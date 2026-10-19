import React, { useEffect, useState, useRef } from 'react';
import {
  FormationSlot,
  MatchSimulationState,
  PlayerVersion,
  PoolType,
  Position,
  RoomState,
  Strategy,
} from '../shared/types/index.js';
import { isPlayerEligibleForSlot } from '../shared/constants/formations.js';
import {
  closeRoom,
  createRoom,
  executePick,
  executeReroll,
  getLiveMatch,
  joinRoom,
  reconnectSeat,
  startMatch,
} from './services/api.js';
import { soundManager } from './utils/audio.js';
import { messages } from './i18n/messages.js';
import { LobbyView } from './components/LobbyView.js';
import { TacticalPitch } from './components/TacticalPitch.js';
import { RosterList } from './components/RosterList.js';
import { MatchView } from './components/MatchView.js';
import { TimerCountdown } from './components/TimerCountdown.js';
import { SettingsModal } from './components/SettingsModal.js';
import {
  Users,
  Copy,
  Check,
  RotateCcw,
  Play,
  AlertCircle,
  Settings,
  Shield,
  Clock,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Active Game State
  const [room, setRoom] = useState<RoomState | null>(null);
  const [mySeat, setMySeat] = useState<'host' | 'guest'>('host');
  const [token, setToken] = useState<string | null>(null);
  const [liveMatch, setLiveMatch] = useState<MatchSimulationState | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerVersion | null>(null);
  const [viewingSquad, setViewingSquad] = useState<'mine' | 'opponent'>('mine');

  // Reset selected player when turn or draft state changes
  useEffect(() => {
    setSelectedPlayer(null);
  }, [room?.turnNumber, room?.activeTurn, room?.status]);

  // Determine view screen (simulating)
  const isSimulating = Boolean(
    liveMatch &&
      (liveMatch.status === 'live' ||
        liveMatch.status === 'halftime' ||
        liveMatch.status === 'extra_time' ||
        liveMatch.status === 'penalties' ||
        liveMatch.status === 'fulltime' ||
        liveMatch.status === 'completed')
  );

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Clear any persistent session so initial page loads always start fresh in the Lobby
  useEffect(() => {
    try {
      localStorage.removeItem('hfd_session');
      sessionStorage.removeItem('hfd_session');
    } catch (e) {}
  }, []);

  // When tab/window is closed or refreshed, automatically quit and close the room on the server
  useEffect(() => {
    if (!room || !token) return;

    const handleBeforeUnload = () => {
      try {
        fetch(`/api/rooms/${room.roomCode}/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          keepalive: true,
        });
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [room?.roomCode, token]);

  // WebSocket connection management when room and token exist
  useEffect(() => {
    if (!room || !token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}&roomCode=${room.roomCode}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      try {
        ws.send(JSON.stringify({ type: 'auth', roomCode: room.roomCode, token }));
      } catch (e) {}
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ((data.type === 'SYNC_STATE' || data.type === 'room_update') && data.room) {
          setRoom(data.room);
          if (data.liveMatch) {
            setLiveMatch(data.liveMatch);
          }
        } else if ((data.type === 'MATCH_UPDATE' || data.type === 'match_tick') && data.liveMatch) {
          setLiveMatch(data.liveMatch);
        } else if (data.type === 'MATCH_FINISHED') {
          if (data.liveMatch) setLiveMatch(data.liveMatch);
          if (data.room) setRoom(data.room);
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    ws.onclose = () => {
      console.log('WS connection closed.');
    };

    return () => {
      ws.close();
    };
  }, [room?.roomCode, token]);

  // Fallback lobby polling: updates host screen immediately upon guest join
  useEffect(() => {
    if (!room || room.status !== 'lobby' || !token) return;
    const interval = setInterval(async () => {
      try {
        const data = await reconnectSeat({ roomCode: room.roomCode, token });
        if (data.room && data.room.status !== 'lobby') {
          setRoom(data.room);
          if (data.liveMatch) setLiveMatch(data.liveMatch);
        }
      } catch (e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [room?.roomCode, room?.status, token]);

  // Fallback drafting turn polling: updates client when waiting for opponent or AI selection
  useEffect(() => {
    if (!room || room.status !== 'drafting' || !token) return;
    if (room.activeTurn !== mySeat) {
      const interval = setInterval(async () => {
        try {
          const data = await reconnectSeat({ roomCode: room.roomCode, token });
          if (data.room && (data.room.activeTurn === mySeat || data.room.status !== 'drafting')) {
            setRoom(data.room);
          }
        } catch (e) {}
      }, 500);
      return () => clearInterval(interval);
    }
  }, [room?.roomCode, room?.status, room?.activeTurn, mySeat, token]);

  // Consecutive real-time match ticker: polls every 1000ms while simulating
  useEffect(() => {
    if (!room || (room.status !== 'simulating' && !isSimulating)) return;
    const interval = setInterval(async () => {
      try {
        const live = await getLiveMatch(room.roomCode);
        if (live) {
          setLiveMatch(live);
          if (live.status === 'completed' && token) {
            const data = await reconnectSeat({ roomCode: room.roomCode, token });
            if (data.room) setRoom(data.room);
          }
        }
      } catch (e) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [room?.roomCode, room?.status, isSimulating, token]);

  // Handler: Create Room
  const handleCreateRoom = async (params: {
    mode: 'solo' | 'multiplayer';
    poolType: PoolType;
    hostName: string;
    formationId: string;
    strategy: Strategy;
    matchFormat: 'auto' | 'normal' | 'knockout';
  }) => {
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await createRoom(params);
      setRoom(res.room);
      setMySeat('host');
      setToken(res.hostToken);
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Join Room
  const handleJoinRoom = async (params: {
    roomCode: string;
    guestName: string;
    formationId: string;
    strategy: Strategy;
  }) => {
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await joinRoom(params);
      setRoom(res.room);
      setMySeat('guest');
      setToken(res.guestToken);
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to join room.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Execute Pick
  const handlePick = async (playerId: string, slotId: string) => {
    if (!room || !token) return;
    try {
      setErrorNotice(null);
      setSelectedPlayer(null);
      const updated = await executePick({
        roomCode: room.roomCode,
        token,
        playerId,
        slotId,
      });
      setRoom(updated);
    } catch (err: any) {
      setErrorNotice(err.message || 'Pick rejected by server.');
    }
  };

  // Handler: Execute Reroll
  const handleReroll = async () => {
    if (!room || !token) return;
    try {
      setErrorNotice(null);
      setSelectedPlayer(null);
      const updated = await executeReroll({
        roomCode: room.roomCode,
        token,
      });
      setRoom(updated);
    } catch (err: any) {
      setErrorNotice(err.message || 'Reroll rejected by server.');
    }
  };

  // Handler: Select slot on pitch to complete pick
  const handleSlotSelect = async (slotId: string) => {
    if (!selectedPlayer) return;
    if (!highlightedSlotIds.includes(slotId)) return;
    const playerToPick = selectedPlayer;
    setSelectedPlayer(null);
    await handlePick(playerToPick.id, slotId);
  };

  // Handler: Start Match
  const handleStartMatch = async () => {
    if (!room || !token) return;
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await startMatch({
        roomCode: room.roomCode,
        token,
      });
      setRoom(res.room);
      setLiveMatch(res.simulation);
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to start match simulation.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Leave / Close Room
  const handleLeaveRoom = async () => {
    if (room && token) {
      try {
        await closeRoom({ roomCode: room.roomCode, token });
      } catch (e) {
        // Ignore close error
      }
    }
    setRoom(null);
    setToken(null);
    setLiveMatch(null);
    setErrorNotice(null);
  };

  const copyRoomCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Derive relevant draft data
  const myDraft = room ? (mySeat === 'host' ? room.hostDraft : room.guestDraft) : null;
  const oppDraft = room ? (mySeat === 'host' ? room.guestDraft : room.hostDraft) : null;
  const isMyTurn = room?.activeTurn === mySeat;

  // Calculate open formation slots for current user
  const openFormationSlots: FormationSlot[] =
    myDraft && myDraft.formation
      ? myDraft.formation.slots.filter((slot) => !myDraft.draftedSlots[slot.id])
      : [];

  // Calculate slots that glow when a player is selected
  const highlightedSlotIds =
    selectedPlayer && myDraft?.formation
      ? openFormationSlots
          .filter((slot) => isPlayerEligibleForSlot(selectedPlayer, slot))
          .map((slot) => slot.id)
      : [];

  const myDraftedCount = myDraft ? Object.keys(myDraft.draftedSlots).length : 0;
  const oppDraftedCount = oppDraft ? Object.keys(oppDraft.draftedSlots).length : 0;
  const isBothDraftComplete = myDraftedCount === 11 && oppDraftedCount === 11;

  return (
    <div className="min-h-screen bg-tactical-900 text-tactical-100 flex flex-col justify-between selection:bg-pitch-accent selection:text-tactical-950 font-sans">
      {/* Global Top Navbar */}
      <header className="border-b border-tactical-700/80 bg-tactical-850 px-4 py-3 sticky top-0 z-40 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pitch-DEFAULT border border-pitch-line flex items-center justify-center font-bold font-mono text-pitch-accent shadow-sm">
              ⚽
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-tactical-100">
                HISTORICAL FOOTBALL DRAFT
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-tactical-400">
                v1.0 (Luck-First Sim)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 border border-tactical-600 transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            {room && (
              <button
                onClick={handleLeaveRoom}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800/60 text-xs font-medium transition-all ml-1"
                title="Leave Room"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Leave</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Error notification banner if any */}
        {errorNotice && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-red-400 hover:text-red-100 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: Lobby (Not in a room) */}
        {!room && (
          <LobbyView
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onOpenSettings={() => setIsSettingsOpen(true)}
            loading={loading}
          />
        )}

        {/* View 2: Live Match Simulation */}
        {room && isSimulating && liveMatch && (
          <MatchView
            liveMatch={liveMatch}
            hostDraft={room.hostDraft}
            guestDraft={room.guestDraft}
            onExitMatch={handleLeaveRoom}
          />
        )}

        {/* View 3: Waiting in Multiplayer Lobby for Guest */}
        {room &&
          !isSimulating &&
          room.mode === 'multiplayer' &&
          !room.guestDraft && (
            <div className="max-w-xl mx-auto bg-tactical-850 border border-tactical-700 rounded-xl p-8 text-center space-y-6 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-tactical-800 border border-tactical-600 flex items-center justify-center mx-auto text-gold-400">
                <Users className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-tactical-100">{messages.lobby.waitingForGuest}</h2>
                <p className="text-xs text-tactical-400 mt-1">{messages.lobby.roomCodeLabel}</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-3xl font-black tracking-widest text-pitch-accent px-4 py-2 bg-tactical-900 rounded-lg border border-pitch-line/50">
                  {room.roomCode}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-200 border border-tactical-600 text-xs font-semibold transition-all active:scale-95"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? messages.lobby.copied : messages.lobby.copyCode}</span>
                </button>
              </div>

              <div className="text-[11px] text-tactical-500">
                Both managers must connect before the historical draft sequence begins.
              </div>
            </div>
          )}

        {/* View 4: Drafting Phase */}
        {room && !isSimulating && myDraft && (room.mode === 'solo' || room.guestDraft) && (
          <div className="space-y-6">
            {/* Draft Header Bar: Turn status, 40s timer, room code */}
            <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    isMyTurn ? 'bg-pitch-accent animate-ping' : 'bg-tactical-600'
                  }`}
                />
                <div>
                  <div className="text-sm font-bold text-tactical-100 flex items-center gap-2">
                    <span>
                      {isMyTurn ? messages.draft.yourTurn : messages.draft.opponentTurn}
                    </span>
                    <span className="text-xs font-normal font-mono text-tactical-400">
                      (Turn #{room.turnNumber})
                    </span>
                  </div>
                  <div className="text-[11px] text-tactical-400">
                    Your drafted XI: <strong>{myDraftedCount}/11</strong> • Opponent:{' '}
                    <strong>{oppDraftedCount}/11</strong>
                  </div>
                </div>
              </div>

              {/* Turn Countdown Timer */}
              {!isBothDraftComplete && (
                <div className="flex items-center gap-4">
                  <TimerCountdown deadline={room.turnDeadline} isMyTurn={isMyTurn} />
                </div>
              )}

              {/* Ready to start match button if 11 drafted */}
              {isBothDraftComplete && (
                <button
                  onClick={handleStartMatch}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-bold text-xs border border-pitch-line active:scale-98 shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 fill-tactical-100" />
                  <span>{messages.draft.proceedToMatch}</span>
                </button>
              )}
            </div>

            {/* Tactical Announcements & AI Status */}
            {room.lastPickAnnouncement && (
              <div className="bg-tactical-850 border border-tactical-700/80 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">
                    {room.lastPickAnnouncement.seat === mySeat ? '👤' : room.mode === 'solo' ? '🤖' : '👥'}
                  </span>
                  <span className="text-tactical-200 truncate">
                    <strong>{room.lastPickAnnouncement.seat === mySeat ? 'You' : oppDraft?.playerName || 'Opponent'}</strong> drafted{' '}
                    <strong className="text-pitch-accent">#{room.lastPickAnnouncement.squadNumber} {room.lastPickAnnouncement.playerName}</strong>{' '}
                    ({room.lastPickAnnouncement.position})
                    {room.lastPickAnnouncement.teamEditionName ? ` from ${room.lastPickAnnouncement.teamEditionName}` : ''}!
                  </span>
                </div>
                <span className="font-mono text-[10px] text-tactical-400 shrink-0 ml-2">Turn #{room.turnNumber - 1}</span>
              </div>
            )}

            {!isMyTurn && room.mode === 'solo' && !isBothDraftComplete && (
              <div className="bg-purple-950/40 border border-purple-500/40 rounded-lg px-4 py-2 text-xs text-purple-200 flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                <span>
                  <strong>{oppDraft?.playerName || 'Tactical AI Challenger'}</strong> is evaluating rolled team edition & choosing with equal odds...
                </span>
              </div>
            )}

            {/* Tactical Pitch View (Your Lineup or Opponent Lineup) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-3">
                {/* Squad Selector Toggle */}
                <div className="flex items-center gap-2 p-1 bg-tactical-900 rounded-lg border border-tactical-750">
                  <button
                    type="button"
                    onClick={() => setViewingSquad('mine')}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                      viewingSquad === 'mine'
                        ? 'bg-tactical-750 text-tactical-100 shadow-sm border border-tactical-600'
                        : 'text-tactical-400 hover:text-tactical-200'
                    }`}
                  >
                    Your Squad ({myDraftedCount}/11)
                  </button>
                  {oppDraft && (
                    <button
                      type="button"
                      onClick={() => setViewingSquad('opponent')}
                      className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                        viewingSquad === 'opponent'
                          ? 'bg-tactical-750 text-tactical-100 shadow-sm border border-tactical-600'
                          : 'text-tactical-400 hover:text-tactical-200'
                      }`}
                    >
                      {room.mode === 'solo' ? '🤖 AI Squad' : 'Opponent Squad'} ({oppDraftedCount}/11)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-tactical-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-pitch-accent" />
                    {viewingSquad === 'mine'
                      ? `Your Tactical XI (${myDraft.formation.name})`
                      : `${oppDraft?.playerName || 'Opponent'} (${oppDraft?.formation.name || '4-3-3'})`}
                  </span>
                  <span className="font-mono text-tactical-400 capitalize">
                    {viewingSquad === 'mine' ? myDraft.strategy : oppDraft?.strategy || 'balanced'} Strategy
                  </span>
                </div>

                {/* Selection Guidance Banner */}
                {viewingSquad === 'mine' && selectedPlayer ? (
                  <div className="bg-emerald-950/90 border border-emerald-400 rounded-lg px-3 py-2 flex items-center justify-between shadow-lg shadow-emerald-950/50 animate-pulse">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="text-xs text-emerald-100 truncate">
                        Drafting <strong>{selectedPlayer.name}</strong> ({[...selectedPlayer.naturalPositions, ...selectedPlayer.secondaryPositions].join('/')}):{' '}
                        <span className="text-emerald-300 font-bold">Click a glowing position on the pitch</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="text-[11px] text-emerald-300 hover:text-white px-2 py-0.5 rounded bg-tactical-900 border border-emerald-500/50 shrink-0 ml-2 font-mono transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : viewingSquad === 'mine' && isMyTurn && !isBothDraftComplete ? (
                  <div className="bg-tactical-850/80 border border-tactical-700/60 rounded-lg px-3 py-1.5 text-xs text-tactical-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pitch-accent animate-pulse shrink-0" />
                    <span>Click any player in the list to reveal their glowing pitch positions.</span>
                  </div>
                ) : null}

                <TacticalPitch
                  formation={viewingSquad === 'mine' ? myDraft.formation : (oppDraft?.formation || myDraft.formation)}
                  draftedSlots={viewingSquad === 'mine' ? myDraft.draftedSlots : (oppDraft?.draftedSlots || {})}
                  highlightedSlotIds={viewingSquad === 'mine' ? highlightedSlotIds : []}
                  onSlotSelect={handleSlotSelect}
                  interactive={viewingSquad === 'mine' && isMyTurn}
                />
              </div>

              {/* Available Edition Roster or Opponent Lineup */}
              <div className="lg:col-span-7 space-y-4">
                {!isBothDraftComplete ? (
                  <RosterList
                    edition={myDraft.currentTeamEdition}
                    roster={myDraft.currentRoster}
                    openSlots={openFormationSlots}
                    draftedPlayerIds={myDraft.usedIdentityIds}
                    rerollsRemaining={myDraft.rerollsRemaining}
                    isMyTurn={isMyTurn}
                    selectedPlayerId={selectedPlayer?.id}
                    onSelectPlayer={(player) =>
                      setSelectedPlayer((prev) => (prev?.id === player.id ? null : player))
                    }
                    onReroll={handleReroll}
                    disabled={loading}
                  />
                ) : (
                  <div className="bg-tactical-850 border border-pitch-line/50 rounded-xl p-8 text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 rounded-full bg-pitch-DEFAULT/30 border border-pitch-line flex items-center justify-center mx-auto text-pitch-accent">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-tactical-100">
                      {messages.draft.bothTeamsReady}
                    </h3>
                    <p className="text-xs text-tactical-400 max-w-md mx-auto">
                      All 11 positions have been drafted for both squads. Launch the 90-second real-time
                      authoritative simulation to see tactical strategy and luck clash.
                    </p>
                    <button
                      onClick={handleStartMatch}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-bold text-sm border border-pitch-line active:scale-98 shadow-xl transition-all"
                    >
                      <Play className="w-4 h-4 fill-tactical-100" />
                      <span>{messages.draft.proceedToMatch}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-tactical-800 bg-tactical-900 px-4 py-3 text-center text-xs text-tactical-500 font-mono">
        Historical Football Draft Engine • FIFA World Cup (1950–2026) • Server-Authoritative PRNG
      </footer>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

