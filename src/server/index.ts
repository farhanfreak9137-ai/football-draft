import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { DatabaseService } from './db.js';
import { RoomManager } from './roomManager.js';
import { createApiRouter } from './routes.js';
import { WebSocketHandler } from './wsHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  // Initialize DB and RoomManager
  const db = new DatabaseService();
  await db.initSchema();
  const roomManager = new RoomManager(db);

  let wsHandler: WebSocketHandler | undefined;

  // Mount API router
  app.use('/api', createApiRouter(roomManager, db, () => wsHandler));

  // Serve static client assets in production with no-cache on HTML files
  const possiblePaths = [
    path.resolve(__dirname, '../../dist/client'),
    path.resolve(__dirname, '../../client'),
    path.resolve(process.cwd(), 'dist/client'),
  ];
  const clientDist = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];
  app.use(
    express.static(clientDist, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      },
    })
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
      return next();
    }
    const indexHtml = path.join(clientDist, 'index.html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexHtml, (err) => {
      if (err) {
        res.status(200).send('Historical Football Draft Backend Running.');
      }
    });
  });

  const server = http.createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });
  wsHandler = new WebSocketHandler(wss, roomManager);

  roomManager.onRoomUpdated = (room) => {
    wsHandler?.broadcastRoom(room.roomCode, room);
  };

  // Background Tick Interval (every 1000ms)
  setInterval(async () => {
    const now = Date.now();

    // 1. Check turn deadlines for drafting rooms (40-second timeout auto-pick)
    const timedOutCodes = await roomManager.tickTurnTimers(now);
    for (const code of timedOutCodes) {
      const room = await db.getRoom(code);
      if (room) {
        wsHandler.broadcastRoom(code, room);
      }
    }

    // 2. Broadcast live match ticks for simulating rooms
    const activeRooms = db.getAllActiveRooms();
    for (const room of activeRooms) {
      if (room.status === 'simulating') {
        const liveMatch = roomManager.getLiveMatchState(room.roomCode, now);
        if (liveMatch && wsHandler) {
          wsHandler.broadcastToRoom(room.roomCode, {
            type: 'MATCH_UPDATE',
            liveMatch,
          });
          wsHandler.broadcastToRoom(room.roomCode, {
            type: 'match_tick',
            liveMatch,
          });

          // Check if match completed
          if (liveMatch.status === 'completed') {
            room.status = 'match_finished';
            await db.saveRoom(room);
            wsHandler.broadcastRoom(room.roomCode, room);
          }
        }
      }
    }
  }, 1000);

  // Cleanup abandoned rooms every 60 seconds (1-hour expiry)
  setInterval(async () => {
    const now = Date.now();
    const count = await db.cleanupExpiredRooms(now);
    if (count > 0) {
      console.log(`[Housekeeping] Cleaned up ${count} expired abandoned room(s).`);
    }
  }, 60000);

  server.listen(PORT, () => {
    console.log(`[Server] Historical Football Draft server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});

