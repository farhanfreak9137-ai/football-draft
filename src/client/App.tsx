import React, { useEffect, useState, useRef } from 'react';
import {
  FormationDefinition,
  FormationSlot,
  LiveMentality,
  MatchSimulationState,
  PlayerVersion,
  PoolType,
  Position,
  RoomState,
  Strategy,
  TournamentMatchFixture,
  TournamentState,
  TournamentTeam,
  DefensiveStyle,
  PassingStyle,
  TouchlineShout,
} from '../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../shared/constants/formations.js';
import {
  closeRoom,
  createPrebuiltMatch,
  createRoom,
  executePick,
  executeRoll,
  executeReroll,
  getLiveMatch,
  getServerUrl,
  joinRoom,
  reconnectSeat,
  startMatch,
  updateLiveMentality,
} from './services/api.js';
import { offlineSoloEngine } from './services/offlineSoloEngine.js';
import { tournamentService } from './services/tournamentService.js';
import { profileService } from './services/profileService.js';
import { convertDreamTeamToDraftState, convertDraftStateToDreamTeam } from './utils/dreamTeamHelper.js';
import { TournamentEngine } from '../shared/engine/tournamentEngine.js';
import { MatchEngine } from '../shared/engine/matchEngine.js';
import { soundManager } from './utils/audio.js';
import { getCustomFormations } from './utils/customFormations.js';
import { messages } from './i18n/messages.js';
import { LobbyView } from './components/LobbyView.js';
import { TournamentView } from './components/TournamentView.js';
import { SoloDraftStudio } from './components/SoloDraftStudio.js';
import { ProfileModal } from './components/ProfileModal.js';
import { TacticalPitch } from './components/TacticalPitch.js';
import { RosterList } from './components/RosterList.js';
import { MatchView } from './components/MatchView.js';
import { TimerCountdown } from './components/TimerCountdown.js';
import { SettingsModal } from './components/SettingsModal.js';
import { FormationStudioModal } from './components/FormationStudioModal.js';
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
  Trophy,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFormationStudioOpen, setIsFormationStudioOpen] = useState(false);
  const [customFormations, setCustomFormations] = useState<FormationDefinition[]>([]);
  const [selectedCustomFormation, setSelectedCustomFormation] = useState<FormationDefinition | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Tournament & Profile State
  const [activeScreen, setActiveScreen] = useState<'lobby' | 'tournament'>('lobby');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTournament, setActiveTournament] = useState<TournamentState | null>(() =>
    tournamentService.getActiveTournament()
  );
  const [tournamentMatchContext, setTournamentMatchContext] = useState<{
    isTournament: boolean;
    matchFixture?: TournamentMatchFixture;
    draftMode?: string;
  } | null>(null);

  // Solo Draft Modal Context (for Pack-Roll, 5-Card, Star-Budget)
  const [soloDraftParams, setSoloDraftParams] = useState<{
    tournament: TournamentState;
    fixture: TournamentMatchFixture;
  } | null>(null);

  // Load saved custom formations on initial render
  useEffect(() => {
    try {
      setCustomFormations(getCustomFormations());
    } catch (e) {}
  }, []);

  // Active Game State
  const [room, setRoom] = useState<RoomState | null>(null);
  const [mySeat, setMySeat] = useState<'host' | 'guest'>('host');
  const [token, setToken] = useState<string | null>(null);
  const [liveMatch, setLiveMatch] = useState<MatchSimulationState | null>(null);
  const [isDreamTeamMatch, setIsDreamTeamMatch] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerVersion | null>(null);
  const [viewingSquad, setViewingSquad] = useState<'mine' | 'opponent'>('mine');
  const [mobileDraftTab, setMobileDraftTab] = useState<'roster' | 'pitch'>('roster');

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
    if (!room || !token || room.mode === 'solo' || room.roomCode.startsWith('SOLO-')) return;

    const handleBeforeUnload = () => {
      try {
        const base = getServerUrl();
        fetch(`${base}/api/rooms/${room.roomCode}/close`, {
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
  }, [room?.roomCode, room?.mode, token]);

  // WebSocket connection management when room and token exist
  useEffect(() => {
    if (!room || !token || room.mode === 'solo' || room.roomCode.startsWith('SOLO-')) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const serverBase = getServerUrl();
    let wsUrl = '';
    if (serverBase) {
      try {
        const url = new URL(serverBase);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${url.host}/ws?token=${token}&roomCode=${room.roomCode}`;
      } catch (e) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${window.location.host}/ws?token=${token}&roomCode=${room.roomCode}`;
      }
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/ws?token=${token}&roomCode=${room.roomCode}`;
    }

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
    customFormation?: FormationDefinition;
  }) => {
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await createRoom({
        ...params,
        customFormation:
          params.customFormation ||
          (selectedCustomFormation && params.formationId === selectedCustomFormation.id
            ? selectedCustomFormation
            : undefined),
      });
      setRoom(res.room);
      setMySeat('host');
      setToken(res.hostToken);
      setIsDreamTeamMatch(false);
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
    customFormation?: FormationDefinition;
  }) => {
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await joinRoom({
        ...params,
        customFormation:
          params.customFormation ||
          (selectedCustomFormation && params.formationId === selectedCustomFormation.id
            ? selectedCustomFormation
            : undefined),
      });
      setRoom(res.room);
      setMySeat('guest');
      setToken(res.guestToken);
      setIsDreamTeamMatch(false);
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

  // Handler: Execute Roll (Initial team draw for turn)
  const handleRoll = async () => {
    if (!room || !token) return;
    try {
      setIsRolling(true);
      setErrorNotice(null);
      setSelectedPlayer(null);
      const updated = await executeRoll({
        roomCode: room.roomCode,
        token,
      });
      setRoom(updated);
    } catch (err: any) {
      setErrorNotice(err.message || 'Roll failed.');
    } finally {
      setIsRolling(false);
    }
  };

  // Handler: Execute Reroll
  const handleReroll = async () => {
    if (!room || !token || isRolling) return;
    try {
      setIsRolling(true);
      setErrorNotice(null);
      setSelectedPlayer(null);
      soundManager.playRerollSound();
      const updated = await executeReroll({
        roomCode: room.roomCode,
        token,
      });
      setRoom({
        ...updated,
        hostDraft: {
          ...updated.hostDraft,
          draftedSlots: { ...updated.hostDraft.draftedSlots },
          currentRoster: [...updated.hostDraft.currentRoster],
        },
        guestDraft: updated.guestDraft
          ? {
              ...updated.guestDraft,
              draftedSlots: { ...updated.guestDraft.draftedSlots },
              currentRoster: [...updated.guestDraft.currentRoster],
            }
          : undefined,
      });
    } catch (err: any) {
      setErrorNotice(err.message || 'Reroll rejected by server.');
    } finally {
      setIsRolling(false);
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

      let matchDurationSec: number | undefined = undefined;
      if (tournamentMatchContext?.isTournament) {
        const tourney = tournamentService.getActiveTournament();
        if (tourney) {
          matchDurationSec = tourney.matchDurationSec;
          // If in a draft-once mode and squad was just drafted, save user squad to tournament state!
          if (tourney.draftMode !== 'dynamic' && !tourney.userSquad && room.hostDraft) {
            tournamentService.setUserSquad(room.hostDraft);
            setActiveTournament(tournamentService.getActiveTournament());
          }
        }
      }

      const res = await startMatch({
        roomCode: room.roomCode,
        token,
        matchDurationSec,
      });
      setRoom(res.room);
      setLiveMatch(res.simulation);
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to start match simulation.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Leave / Close Room / Exit Match
  const handleLeaveRoom = async () => {
    if (tournamentMatchContext?.isTournament && liveMatch) {
      const userScore = mySeat === 'host' ? liveMatch.score.host : liveMatch.score.guest;
      const opponentScore = mySeat === 'host' ? liveMatch.score.guest : liveMatch.score.host;
      const penaltyScore = liveMatch.penaltyScore
        ? {
            user: mySeat === 'host' ? liveMatch.penaltyScore.host : liveMatch.penaltyScore.guest,
            opponent: mySeat === 'host' ? liveMatch.penaltyScore.guest : liveMatch.penaltyScore.host,
          }
        : undefined;

      try {
        const updated = tournamentService.recordUserMatchResult({
          userScore,
          opponentScore,
          penaltyScore,
          simulation: liveMatch,
        });
        setActiveTournament({ ...updated });
      } catch (e) {
        console.error('Error recording tournament result:', e);
      }

      setTournamentMatchContext(null);
      setRoom(null);
      setToken(null);
      setLiveMatch(null);
      setErrorNotice(null);
      setActiveScreen('tournament');
      return;
    }

    if (isDreamTeamMatch && liveMatch && room?.hostDraft && room?.guestDraft) {
      try {
        const ratingsData = MatchEngine.computePlayerRatings(room.hostDraft, room.guestDraft, liveMatch);
        const dreamTeam = profileService.getDreamTeam();
        if (dreamTeam) {
          const userScore = liveMatch.score.host;
          const opponentScore = liveMatch.score.guest;
          const opponentName = room.guestDraft.playerName || 'AI Titan';

          const playerMatchStats = Object.values(dreamTeam.draftedSlots).map((slot) => {
            const p = slot.player;
            const r = ratingsData.hostRatings.find((hr) => hr.playerId === p.id);
            const goals = liveMatch.events.filter((e) => e.type === 'goal' && e.player?.id === p.id).length;
            const assists = liveMatch.events.filter((e) => e.type === 'goal' && e.secondaryPlayer?.id === p.id).length;
            const hasYellow = liveMatch.events.some((e) => e.type === 'yellow_card' && e.player?.id === p.id);
            const hasRed = liveMatch.events.some((e) => e.type === 'red_card' && e.player?.id === p.id);
            const cleanSheet = opponentScore === 0;
            const motm = ratingsData.starOfMatch?.playerId === p.id;
            const rating = r ? r.rating : 6.5;

            return {
              identityId: p.identityId || p.id,
              goals,
              assists,
              cleanSheet,
              motm,
              yellowCard: hasYellow,
              redCard: hasRed,
              rating,
            };
          });

          profileService.recordDreamTeamMatch({
            userScore,
            opponentScore,
            opponentName,
            playerMatchStats,
          });
        }
      } catch (err) {
        console.error('Error saving Dream Team match stats:', err);
      }

      setIsDreamTeamMatch(false);
      setRoom(null);
      setToken(null);
      setLiveMatch(null);
      setErrorNotice(null);
      setIsProfileOpen(true);
      setActiveScreen('lobby');
      return;
    }

    if (room && token) {
      try {
        await closeRoom({ roomCode: room.roomCode, token });
      } catch (e) {
        // Ignore close error
      }
    }

    // Record quick match (solo AI or multiplayer) result to career stats if match was completed.
    // Tournament matches and Dream Team matches are recorded separately above.
    if (liveMatch && liveMatch.status === 'completed') {
      try {
        const userScore = mySeat === 'host' ? liveMatch.score.host : liveMatch.score.guest;
        const opponentScore = mySeat === 'host' ? liveMatch.score.guest : liveMatch.score.host;
        const opponentName =
          (mySeat === 'host' ? room?.guestDraft?.playerName : room?.hostDraft?.playerName) ||
          'Opponent';
        const isWin =
          userScore > opponentScore ||
          (liveMatch.penaltyScore
            ? (mySeat === 'host'
                ? liveMatch.penaltyScore.host > liveMatch.penaltyScore.guest
                : liveMatch.penaltyScore.guest > liveMatch.penaltyScore.host)
            : false);
        const isDraw =
          userScore === opponentScore &&
          !liveMatch.penaltyScore;

        profileService.recordMatch({
          opponentName,
          score: `${userScore}-${opponentScore}`,
          result: isWin ? 'win' : isDraw ? 'draw' : 'loss',
          stage: room?.mode === 'solo' ? 'QUICK MATCH (AI)' : 'MULTIPLAYER',
          goalsScored: userScore,
          goalsConceded: opponentScore,
        });
      } catch (e) {
        console.error('Error recording quick match result:', e);
      }
    }

    setRoom(null);
    setToken(null);
    setLiveMatch(null);
    setErrorNotice(null);
    setActiveScreen('lobby');
  };

  // Handler: Touchline In-Match Live Mentality Instruction
  const handleLiveMentalityChange = (mentality: LiveMentality) => {
    if (room) {
      const updated = updateLiveMentality(room.roomCode, mentality, mySeat);
      if (updated) {
        setLiveMatch({ ...updated });
      }
    }
  };

  // Handler: In-Match Touchline Tactics & Shouts
  const handleTacticsChange = (tactics: {
    mentality?: LiveMentality;
    defensiveStyle?: DefensiveStyle;
    passingStyle?: PassingStyle;
    shout?: TouchlineShout;
  }) => {
    if (room && offlineSoloEngine.getLiveMatch(room.roomCode)) {
      const updated = offlineSoloEngine.updateLiveTactics(tactics, mySeat);
      if (updated) {
        setLiveMatch({ ...updated });
      }
    }
  };

  // Handler: Solo Draft Complete from Studio (Pack-Roll, 5-Card, Star-Budget)
  const handleSoloDraftComplete = (draftState: any, saveAsDreamTeam: boolean) => {
    if (!soloDraftParams) return;
    const { tournament: tourney, fixture } = soloDraftParams;
    const opponentTeam = fixture.homeTeam.isUser ? fixture.awayTeam : fixture.homeTeam;
    const isKnockout = !tourney.currentRound.startsWith('group_match_');

    // Save user squad to tournament state!
    const updatedTourney = tournamentService.setUserSquad(draftState);
    setActiveTournament({ ...updatedTourney });

    // Save as Dream Team if checked
    if (saveAsDreamTeam) {
      profileService.saveDreamTeam(convertDraftStateToDreamTeam(draftState));
    }

    // Build authentic AI opponent squad
    const aiDraft = TournamentEngine.buildAiTeamSquad(
      opponentTeam,
      tourney.poolType,
      offlineSoloEngine.getPlayers(),
      opponentTeam.formationId
    );

    // Launch Prebuilt Match directly!
    const res = createPrebuiltMatch({
      hostDraft: draftState,
      guestDraft: aiDraft,
      matchDurationSec: tourney.matchDurationSec,
      isKnockout,
      poolType: tourney.poolType,
    });

    setIsDreamTeamMatch(false);
    setRoom(res.room);
    setMySeat('host');
    setToken(res.room.hostSeat.token);
    setLiveMatch(res.simulation);
    setTournamentMatchContext({
      isTournament: true,
      matchFixture: fixture,
      draftMode: tourney.draftMode,
    });
    setSoloDraftParams(null);
  };

  // Handler: Launch Exhibition Friendly Match from Profile
  const handlePlayFriendlyMatch = (opponentEditionId: string, durationSec: number) => {
    const dreamTeam = profileService.getDreamTeam();
    if (!dreamTeam) return;

    const hostDraft = convertDreamTeamToDraftState(dreamTeam);
    const opponentEdition = offlineSoloEngine.getEditions().find((e) => e.id === opponentEditionId);
    const opponentTeam: TournamentTeam = {
      id: 'friendly-ai',
      name: opponentEdition ? `${opponentEdition.teamName} (${opponentEdition.yearOrSeason})` : 'Classic XI',
      editionId: opponentEditionId,
      poolType: opponentEdition?.editionType || 'national',
      isUser: false,
      formationId: opponentEdition?.tacticalFormation || '4-3-3',
      groupStats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    };

    const guestDraft = TournamentEngine.buildAiTeamSquad(
      opponentTeam,
      opponentTeam.poolType,
      offlineSoloEngine.getPlayers(),
      opponentTeam.formationId
    );

    const res = createPrebuiltMatch({
      hostDraft,
      guestDraft,
      matchDurationSec: durationSec,
      isKnockout: false,
      poolType: opponentTeam.poolType,
    });

    setIsDreamTeamMatch(true);
    setRoom(res.room);
    setMySeat('host');
    setToken(res.room.hostSeat.token);
    setLiveMatch(res.simulation);
    setTournamentMatchContext(null);
  };

  // Handler: Launch Tournament Match
  const handleStartTournamentMatch = async (
    tourney: TournamentState,
    fixture: TournamentMatchFixture
  ) => {
    try {
      setIsDreamTeamMatch(false);
      setLoading(true);
      setErrorNotice(null);

      const opponentTeam = fixture.homeTeam.isUser ? fixture.awayTeam : fixture.homeTeam;
      const isKnockout = !tourney.currentRound.startsWith('group_match_');

      // 1. DRAFT-ONCE MODES (pack_roll, five_card, star_budget, dream_team, campaign)
      if (tourney.draftMode !== 'dynamic') {
        // If manager squad is already drafted (Games 2 through 7, or Game 1 after draft):
        if (tourney.userSquad && tourney.userSquad.isReady) {
          const aiDraft = TournamentEngine.buildAiTeamSquad(
            opponentTeam,
            tourney.poolType,
            offlineSoloEngine.getPlayers(),
            opponentTeam.formationId
          );

          const res = createPrebuiltMatch({
            hostDraft: tourney.userSquad,
            guestDraft: aiDraft,
            matchDurationSec: tourney.matchDurationSec,
            isKnockout,
            poolType: tourney.poolType,
          });

          setRoom(res.room);
          setMySeat('host');
          setToken(res.room.hostSeat.token);
          setLiveMatch(res.simulation);
          setTournamentMatchContext({
            isTournament: true,
            matchFixture: fixture,
            draftMode: tourney.draftMode,
          });
          return;
        }

        // Open Solo Draft Studio for pack_roll, five_card, star_budget, campaign
        setSoloDraftParams({ tournament: tourney, fixture });
        return;
      }

      // 2. Dynamic Draft Mode: draft fresh before every match
      const res = await createRoom({
        mode: 'solo',
        poolType: tourney.poolType,
        hostName: tourney.userTeam.name,
        formationId: tourney.userTeam.formationId,
        strategy: 'balanced',
        matchFormat: isKnockout ? 'knockout' : 'normal',
      });

      if (res.room.guestDraft) {
        res.room.guestDraft.playerName = opponentTeam.name;
        res.room.guestDraft.formation =
          FORMATIONS[opponentTeam.formationId || '4-3-3'] || FORMATIONS['4-3-3'];
      }

      setRoom(res.room);
      setMySeat('host');
      setToken(res.hostToken);
      setTournamentMatchContext({
        isTournament: true,
        matchFixture: fixture,
        draftMode: 'dynamic',
      });
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to start tournament match.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Turn countdown timer timeout (auto-pick in offline solo mode)
  const handleTimerTimeout = () => {
    if (room && room.mode === 'solo' && isMyTurn) {
      const updated = offlineSoloEngine.autoPickHostIfExpired(room.roomCode);
      if (updated) {
        setRoom({ ...updated });
        setSelectedPlayer(null);
      }
    }
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

  // Reset selected player when turn ends or if drafted by opponent
  useEffect(() => {
    if (!isMyTurn) {
      setSelectedPlayer(null);
    } else if (selectedPlayer) {
      const isTaken =
        (myDraft?.usedIdentityIds || []).includes(selectedPlayer.identityId) ||
        (oppDraft?.usedIdentityIds || []).includes(selectedPlayer.identityId);
      if (isTaken) {
        setSelectedPlayer(null);
      }
    }
  }, [isMyTurn, room?.turnNumber, myDraft?.usedIdentityIds, oppDraft?.usedIdentityIds]);

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
            {!room && (
              <>
                <button
                  onClick={() => setActiveScreen(activeScreen === 'tournament' ? 'lobby' : 'tournament')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    activeScreen === 'tournament'
                      ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                      : 'bg-tactical-800 text-tactical-300 hover:text-tactical-100 border-tactical-700'
                  }`}
                  title="Toggle World Cup Campaign"
                >
                  <Trophy className="w-3.5 h-3.5 text-gold-400" />
                  <span className="hidden sm:inline">
                    {activeScreen === 'tournament' ? 'Quick Play' : 'World Cup'}
                  </span>
                </button>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-200 border border-tactical-600 transition-all text-xs font-bold flex items-center gap-1"
                  title="Manager Profile"
                >
                  <span>👔</span>
                  <span className="hidden md:inline">Profile</span>
                </button>
              </>
            )}
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

        {/* View 1: Tournament Hub View (Active Tournament or Creation Wizard) */}
        {!room && activeScreen === 'tournament' && (
          <TournamentView
            onStartTournamentMatch={handleStartTournamentMatch}
            onBackToLobby={() => setActiveScreen('lobby')}
            formations={Object.values(FORMATIONS)}
            defaultFormationId={selectedCustomFormation?.id || '4-3-3'}
          />
        )}

        {/* View 2: Quick Play Lobby (Solo & Multiplayer Draft Setup) */}
        {!room && activeScreen === 'lobby' && (
          <LobbyView
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenFormationStudio={() => setIsFormationStudioOpen(true)}
            onOpenTournament={() => setActiveScreen('tournament')}
            onOpenProfile={() => setIsProfileOpen(true)}
            hasActiveTournament={Boolean(
              activeTournament &&
                activeTournament.currentRound !== 'completed' &&
                !activeTournament.isEliminated
            )}
            tournamentRoundLabel={activeTournament?.currentRound.replace(/_/g, ' ').toUpperCase()}
            customFormations={customFormations}
            selectedCustomFormation={selectedCustomFormation}
            onSelectCustomFormation={(f) => setSelectedCustomFormation(f)}
            loading={loading}
          />
        )}

        {/* View 3: Live Match Simulation */}
        {room && isSimulating && liveMatch && (
          <MatchView
            liveMatch={liveMatch}
            hostDraft={room.hostDraft}
            guestDraft={room.guestDraft}
            onExitMatch={handleLeaveRoom}
            onMentalityChange={handleLiveMentalityChange}
            onTacticsChange={handleTacticsChange}
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
                  <TimerCountdown
                    deadline={room.turnDeadline}
                    isMyTurn={isMyTurn}
                    onTimeout={handleTimerTimeout}
                  />
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

            {/* Mobile Tab Switcher (Draft Roster vs Pitch XI) */}
            <div className="flex items-center p-1 bg-tactical-900 rounded-xl border border-tactical-750 lg:hidden shadow-md">
              <button
                type="button"
                onClick={() => setMobileDraftTab('roster')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mobileDraftTab === 'roster'
                    ? 'bg-tactical-750 text-tactical-100 shadow border border-tactical-600'
                    : 'text-tactical-400 hover:text-tactical-200'
                }`}
              >
                <span>📋 Draft Roster</span>
                {myDraft.currentTeamEdition && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tactical-800 text-pitch-accent border border-pitch-line/40 truncate max-w-[100px]">
                    {myDraft.currentTeamEdition.teamName.split(' ')[0]}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileDraftTab('pitch')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mobileDraftTab === 'pitch'
                    ? 'bg-tactical-750 text-tactical-100 shadow border border-tactical-600'
                    : 'text-tactical-400 hover:text-tactical-200'
                }`}
              >
                <span>🏟️ Pitch XI</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-tactical-800 text-gold-400 border border-tactical-700">
                  {myDraftedCount}/11
                </span>
                {selectedPlayer && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            </div>

            {/* Tactical Pitch View & Roster Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Pitch Column: Visible on pitch tab on mobile, always visible on lg desktop */}
              <div className={`space-y-3 lg:col-span-5 ${mobileDraftTab === 'pitch' ? 'block' : 'hidden lg:block'}`}>
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
                  <div className="bg-emerald-950/90 border border-emerald-400 rounded-lg px-3 py-2 flex items-center justify-between shadow-lg shadow-emerald-950/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="text-xs text-emerald-100 truncate">
                        Drafting <strong>{selectedPlayer.name}</strong> ({[...selectedPlayer.naturalPositions, ...selectedPlayer.secondaryPositions].join('/')}):{' '}
                        <span className="text-emerald-300 font-bold">Tap glowing position on pitch</span>
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
                    <span>Select a player in Roster to reveal matching pitch positions.</span>
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

              {/* Available Edition Roster or Opponent Lineup: Visible on roster tab on mobile, always visible on lg desktop */}
              <div className={`space-y-4 lg:col-span-7 ${mobileDraftTab === 'roster' ? 'block' : 'hidden lg:block'}`}>
                {/* Mobile Active Selection Alert when on roster tab */}
                {selectedPlayer && (
                  <div className="bg-emerald-950/95 border border-emerald-400/80 rounded-lg px-3.5 py-2.5 flex items-center justify-between shadow-lg text-xs lg:hidden">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="text-emerald-200 truncate">
                        Selected: <strong>{selectedPlayer.name}</strong> • Tap 1-Tap Assign below or:
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <button
                        onClick={() => setMobileDraftTab('pitch')}
                        className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-tactical-950 font-bold text-xs shadow"
                      >
                        View Pitch
                      </button>
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="px-2 py-1 rounded bg-tactical-900 border border-emerald-500/50 text-emerald-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!isBothDraftComplete ? (
                  <RosterList
                    edition={myDraft.currentTeamEdition}
                    roster={myDraft.currentRoster}
                    openSlots={openFormationSlots}
                    draftedPlayerIds={myDraft.usedIdentityIds}
                    opponentDraftedPlayerIds={oppDraft?.usedIdentityIds || []}
                    rerollsRemaining={myDraft.rerollsRemaining}
                    isMyTurn={isMyTurn}
                    selectedPlayerId={selectedPlayer?.id}
                    onSelectPlayer={(player) =>
                      setSelectedPlayer((prev) => (prev?.id === player.id ? null : player))
                    }
                    onSlotSelect={handleSlotSelect}
                    onReroll={handleReroll}
                    onRoll={handleRoll}
                    isRolling={isRolling}
                    disabled={loading || isRolling}
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
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onPlayFriendlyMatch={handlePlayFriendlyMatch}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {isFormationStudioOpen && (
        <FormationStudioModal
          isOpen={isFormationStudioOpen}
          onClose={() => {
            setIsFormationStudioOpen(false);
            setCustomFormations(getCustomFormations());
          }}
          onSelectFormation={(custom) => {
            setSelectedCustomFormation(custom);
            setCustomFormations(getCustomFormations());
          }}
          initialFormation={selectedCustomFormation}
        />
      )}

      {/* Solo Draft Studio for Tournament (Pack-Roll, 5-Card, Star-Budget) */}
      {soloDraftParams && (
        <SoloDraftStudio
          draftMode={soloDraftParams.tournament.draftMode}
          poolType={soloDraftParams.tournament.poolType}
          formationId={soloDraftParams.tournament.userTeam.formationId || '4-3-3'}
          managerName={soloDraftParams.tournament.userTeam.name}
          onComplete={handleSoloDraftComplete}
          onCancel={() => setSoloDraftParams(null)}
        />
      )}
    </div>
  );
};

