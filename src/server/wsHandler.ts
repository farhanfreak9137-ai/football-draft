import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { RoomManager } from './roomManager.js';
import { RoomState } from '../shared/types/index.js';

interface ClientConnection {
  ws: WebSocket;
  roomCode?: string;
  seat?: 'host' | 'guest';
  token?: string;
  isAlive: boolean;
}

export class WebSocketHandler {
  private wss: WebSocketServer;
  private roomManager: RoomManager;
  private clients: Map<WebSocket, ClientConnection> = new Map();

  constructor(wss: WebSocketServer, roomManager: RoomManager) {
    this.wss = wss;
    this.roomManager = roomManager;
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const client: ClientConnection = {
        ws,
        isAlive: true,
      };
      this.clients.set(ws, client);

      // Authenticate immediately from URL query parameters if present (/ws?token=...&roomCode=...)
      if (req.url) {
        try {
          const parsed = new URL(req.url, 'http://localhost');
          const token = parsed.searchParams.get('token');
          const roomCode = parsed.searchParams.get('roomCode');
          if (token && roomCode) {
            this.roomManager.authenticateSeat(roomCode, token).then((auth) => {
              if (auth) {
                client.roomCode = roomCode.toUpperCase();
                client.token = token;
                client.seat = auth.seat;
                client.ws.send(
                  JSON.stringify({
                    type: 'room_update',
                    seat: auth.seat,
                    room: auth.room,
                    liveMatch: this.roomManager.getLiveMatchState(roomCode, Date.now()),
                  })
                );
                this.broadcastRoom(client.roomCode!, auth.room);
              }
            });
          }
        } catch (e) {
          // Ignore URL parse error
        }
      }

      ws.on('pong', () => {
        client.isAlive = true;
      });

      ws.on('message', async (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(client, message);
        } catch (err: any) {
          ws.send(JSON.stringify({ type: 'error', message: err.message || 'Invalid message' }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });

    // Heartbeat ping interval
    setInterval(() => {
      for (const [ws, client] of this.clients.entries()) {
        if (!client.isAlive) {
          ws.terminate();
          this.clients.delete(ws);
          continue;
        }
        client.isAlive = false;
        ws.ping();
      }
    }, 30000);
  }

  private async handleMessage(client: ClientConnection, msg: any) {
    switch (msg.type) {
      case 'auth': {
        const { roomCode, token } = msg;
        if (!roomCode || !token) {
          client.ws.send(JSON.stringify({ type: 'error', message: 'roomCode and token required' }));
          return;
        }
        const auth = await this.roomManager.authenticateSeat(roomCode, token);
        if (!auth) {
          client.ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
          return;
        }
        client.roomCode = roomCode.toUpperCase();
        client.token = token;
        client.seat = auth.seat;

        client.ws.send(
          JSON.stringify({
            type: 'auth_success',
            seat: auth.seat,
            room: auth.room,
            liveMatch: this.roomManager.getLiveMatchState(roomCode, Date.now()),
          })
        );
        this.broadcastRoom(client.roomCode!, auth.room);
        break;
      }

      case 'pick': {
        if (!client.roomCode || !client.token) {
          client.ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
          return;
        }
        const room = await this.roomManager.executePick({
          roomCode: client.roomCode,
          token: client.token,
          playerId: msg.playerId,
          slotId: msg.slotId,
        });
        this.broadcastRoom(client.roomCode, room);
        break;
      }

      case 'reroll': {
        if (!client.roomCode || !client.token) {
          client.ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
          return;
        }
        const room = await this.roomManager.executeReroll({
          roomCode: client.roomCode,
          token: client.token,
        });
        this.broadcastRoom(client.roomCode, room);
        break;
      }

      case 'start_match': {
        if (!client.roomCode || !client.token) {
          client.ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
          return;
        }
        const { room, simulation } = await this.roomManager.startMatch({
          roomCode: client.roomCode,
          token: client.token,
        });
        this.broadcastRoom(client.roomCode, room);
        this.broadcastToRoom(client.roomCode, {
          type: 'match_started',
          simulation,
        });
        break;
      }

      case 'ping': {
        client.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      }
    }
  }

  public broadcastRoom(roomCode: string, room: RoomState) {
    // Send a single unified update message — avoid double-broadcasting the same payload
    this.broadcastToRoom(roomCode, {
      type: 'SYNC_STATE',
      room,
    });
  }

  public broadcastToRoom(roomCode: string, data: any) {
    const payload = JSON.stringify(data);
    const upperCode = roomCode.toUpperCase();
    for (const client of this.clients.values()) {
      if (client.roomCode === upperCode && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    }
  }
}
