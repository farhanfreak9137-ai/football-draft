import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LiveMentality,
  MatchEvent,
  MatchSimulationState,
  PenaltyKickResult,
  PlayerDraftState,
  PlayerMatchRating,
  Position,
  DefensiveStyle,
  PassingStyle,
  TouchlineShout,
} from '../../shared/types/index.js';
import { soundManager } from '../utils/audio.js';
import { messages } from '../i18n/messages.js';
import { MatchEngine, getVisualMinute } from '../../shared/engine/matchEngine.js';
import { BothPitchesView } from './BothPitchesView.js';
import { MatchResultModal } from './MatchResultModal.js';
import { getOvrColorClass } from '../utils/ovrColor.js';
import {
  Shield,
  Activity,
  Trophy,
  Volume2,
  VolumeX,
  ArrowRight,
  Clock,
  Target,
  Award,
  CircleDot,
  CheckCircle2,
  XCircle,
  Users,
  Star,
  Sparkles,
  Megaphone,
  Zap,
  Compass,
  Flame,
} from 'lucide-react';

interface MatchViewProps {
  liveMatch: MatchSimulationState;
  hostDraft: PlayerDraftState;
  guestDraft?: PlayerDraftState;
  onExitMatch: () => void;
  onMentalityChange?: (mentality: LiveMentality) => void;
  onTacticsChange?: (tactics: {
    mentality?: LiveMentality;
    defensiveStyle?: DefensiveStyle;
    passingStyle?: PassingStyle;
    shout?: TouchlineShout;
  }) => void;
  isTournament?: boolean;
}

export const MatchView: React.FC<MatchViewProps> = ({
  liveMatch,
  hostDraft,
  guestDraft,
  onExitMatch,
  onMentalityChange,
  onTacticsChange,
  isTournament = false,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);
  const [activeTab, setActiveTab] = useState<'pitch' | 'lineups' | 'report'>('pitch');
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentMentality, setCurrentMentality] = useState<LiveMentality>('balanced');
  const [defensiveStyle, setDefensiveStyle] = useState<DefensiveStyle>('mid_block');
  const [passingStyle, setPassingStyle] = useState<PassingStyle>('tiki_taka');
  const [activeShout, setActiveShout] = useState<{ shout: TouchlineShout; label: string; expiresAtSec: number } | null>(null);
  const [shoutCooldownUntil, setShoutCooldownUntil] = useState<number>(0);
  const [isDugoutOpen, setIsDugoutOpen] = useState(false);
  // Reactive clock for shout cooldown display — updates every second while cooldown is active
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (shoutCooldownUntil <= 0) return;
    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= shoutCooldownUntil) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [shoutCooldownUntil]);

  const hasAutoOpenedModal = useRef(false);
  const eventFeedRef = useRef<HTMLDivElement>(null);
  const prevEventsLength = useRef(liveMatch.events.length);

  const handleMentalitySelect = (m: LiveMentality) => {
    setCurrentMentality(m);
    if (onMentalityChange) onMentalityChange(m);
    if (onTacticsChange) onTacticsChange({ mentality: m, defensiveStyle, passingStyle });
  };

  const handleDefensiveSelect = (style: DefensiveStyle) => {
    setDefensiveStyle(style);
    if (onTacticsChange) onTacticsChange({ mentality: currentMentality, defensiveStyle: style, passingStyle });
  };

  const handlePassingSelect = (style: PassingStyle) => {
    setPassingStyle(style);
    if (onTacticsChange) onTacticsChange({ mentality: currentMentality, defensiveStyle, passingStyle: style });
  };

  const handleShout = (shout: TouchlineShout, label: string) => {
    const now = Date.now();
    if (now < shoutCooldownUntil) return;
    soundManager.playShoutSound();
    const curSec = liveMatch.currentSecond || 0;
    setActiveShout({ shout, label, expiresAtSec: curSec + 15 });
    setShoutCooldownUntil(now + 25000); // 25s cooldown
    if (onTacticsChange) {
      onTacticsChange({ mentality: currentMentality, defensiveStyle, passingStyle, shout });
    }
  };

  // Automatically trigger Winner Result popup and appropriate audio when match finishes
  useEffect(() => {
    if (liveMatch.status === 'completed' && !hasAutoOpenedModal.current) {
      hasAutoOpenedModal.current = true;
      setShowResultModal(true);
      // Play outcome-specific sound
      if (liveMatch.winner === 'host') {
        soundManager.playVictoryFanfare();
      } else if (liveMatch.winner === 'guest') {
        soundManager.playDefeatSound();
      } else {
        // Draw — neutral final whistle
        soundManager.playWhistle();
      }
    }
  }, [liveMatch.status]);

  // Auto-scroll event feed and play sounds
  useEffect(() => {
    if (liveMatch.events.length > prevEventsLength.current) {
      const newEvents = liveMatch.events.slice(prevEventsLength.current);
      newEvents.forEach((ev) => {
        if (ev.type === 'goal') {
          soundManager.playGoalAlert();
        } else if (ev.type === 'save') {
          soundManager.playSaveAlert();
        } else if (ev.type === 'yellow_card' || ev.type === 'red_card') {
          soundManager.playCardAlert();
        } else if (ev.type === 'kickoff' || ev.type === 'halftime' || ev.type === 'fulltime') {
          soundManager.playWhistle();
        }
      });
      prevEventsLength.current = liveMatch.events.length;
      if (eventFeedRef.current) {
        eventFeedRef.current.scrollTop = eventFeedRef.current.scrollHeight;
      }
    }
  }, [liveMatch.events]);

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const hostName = hostDraft.playerName || 'Host XI';
  const guestName = guestDraft?.playerName || 'Opponent XI';

  const regDuration = liveMatch.regularDurationSeconds || (liveMatch.totalDurationSeconds <= 60 ? 45 : liveMatch.totalDurationSeconds);
  const hasExtraTime = Boolean(
    liveMatch.totalDurationSeconds > regDuration ||
    liveMatch.winMethod === 'extra_time' ||
    liveMatch.winMethod === 'penalties'
  );
  const maxVisualMinute = hasExtraTime ? 120 : 90;
  const visualMinute = MatchEngine.calculateVisualMinute(liveMatch.currentSecond, regDuration);
  const isMatchFinished = liveMatch.status === 'completed';

  // Compute live & post-match player ratings
  const ratingsData = useMemo(() => {
    if (!guestDraft) return null;
    return MatchEngine.computePlayerRatings(hostDraft, guestDraft, liveMatch);
  }, [
    hostDraft,
    guestDraft,
    liveMatch.events,
    liveMatch.penalties,
    liveMatch.score,
    liveMatch.winner,
  ]);

  const hostAvgRating = ratingsData
    ? (
        ratingsData.hostRatings.reduce((acc, r) => acc + r.rating, 0) /
        (ratingsData.hostRatings.length || 1)
      ).toFixed(1)
    : '7.0';
  const guestAvgRating = ratingsData
    ? (
        ratingsData.guestRatings.reduce((acc, r) => acc + r.rating, 0) /
        (ratingsData.guestRatings.length || 1)
      ).toFixed(1)
    : '7.0';

  // Helper: Rating badge color styling
  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 9.0)
      return 'bg-emerald-500 text-tactical-950 font-black shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (rating >= 8.0)
      return 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold';
    if (rating >= 7.0)
      return 'bg-blue-950 text-blue-300 border border-blue-500/40 font-semibold';
    if (rating >= 6.0)
      return 'bg-tactical-800 text-tactical-200 border border-tactical-700 font-medium';
    return 'bg-rose-950/70 text-rose-300 border border-rose-500/50 font-medium';
  };

  // Helper: Position badge color styling
  const getPositionPillClass = (pos: Position) => {
    if (pos === 'GK') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos))
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos))
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  // Status badge styling
  const getStatusBadge = () => {
    switch (liveMatch.status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            LIVE ({visualMinute}')
          </span>
        );
      case 'halftime':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Half-Time (45')
          </span>
        );
      case 'extra_time':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
            Extra Time ({visualMinute}')
          </span>
        );
      case 'penalties':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            Penalty Shootout
          </span>
        );
      case 'fulltime':
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Full-Time ({maxVisualMinute}')
          </span>
        );
      default:
        return null;
    }
  };

  // Active event on pitch
  const latestEvent = liveMatch.events[liveMatch.events.length - 1];
  const ballPos = latestEvent?.pitchLocation || { x: 50, y: 50 };
  const clampedX = Math.max(14, Math.min(86, ballPos.x));
  const clampedY = Math.max(18, Math.min(82, ballPos.y));

  // Render a single player row (showRating=false during simulation, true after full-time)
  const renderPlayerRow = (r: PlayerMatchRating, showRating = false) => (
    <div
      key={r.playerId}
      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
        showRating && r.isStarOfMatch
          ? 'bg-amber-950/30 border-gold-500/60 ring-1 ring-gold-400/30'
          : 'bg-tactical-900/60 border-tactical-750 hover:bg-tactical-800/70'
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0 mr-2 flex-1">
        <span
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getPositionPillClass(
            r.position
          )}`}
        >
          {r.position}
        </span>
        <span className="font-mono text-[11px] text-tactical-400 font-semibold w-5 shrink-0 text-left">
          #{r.squadNumber}
        </span>
        <span className="font-medium text-xs text-tactical-100 truncate">
          {r.name}
        </span>
        {showRating && r.isStarOfMatch && (
          <span
            className="text-gold-400 font-bold text-xs shrink-0 flex items-center"
            title="Star of the Match"
          >
            ★
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Match event badges */}
        <div className="flex items-center gap-1">
          {r.stats.goals > 0 && (
            <span
              className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-[10px] font-bold"
              title={`${r.stats.goals} Goal${r.stats.goals > 1 ? 's' : ''}`}
            >
              ⚽{r.stats.goals > 1 ? `x${r.stats.goals}` : ''}
            </span>
          )}
          {r.stats.saves > 0 && (
            <span
              className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-bold"
              title={`${r.stats.saves} Save${r.stats.saves > 1 ? 's' : ''}`}
            >
              🧤{r.stats.saves > 1 ? `x${r.stats.saves}` : ''}
            </span>
          )}
          {r.stats.yellowCard && (
            <span
              className="px-1 py-0.5 rounded bg-amber-950/90 border border-yellow-400 text-yellow-300 font-mono text-[10px] font-bold flex items-center gap-0.5"
              title="Yellow Card (Cautioned)"
            >
              <span className="inline-block w-2 h-3 bg-yellow-400 rounded-xs border border-yellow-200"></span>
            </span>
          )}
          {r.stats.redCard && (
            <span
              className="px-1 py-0.5 rounded bg-red-950/90 border border-red-500 text-red-300 font-mono text-[10px] font-bold flex items-center gap-0.5"
              title="Red Card"
            >
              <span className="inline-block w-2 h-3 bg-red-500 rounded-xs border border-red-200"></span>
            </span>
          )}
          {showRating &&
            r.stats.cleanSheet &&
            (r.position === 'GK' ||
              ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(r.position)) && (
              <span className="text-[11px] text-emerald-400" title="Clean Sheet Maintained">
                🛡️
              </span>
            )}
        </div>

        {/* Base Historical OVR */}
        <span
          className={`font-mono text-[11px] hidden sm:inline ${getOvrColorClass(r.ovr)}`}
          title="Historical OVR"
        >
          {r.ovr}
        </span>

        {/* Match Rating Pill - ONLY shown when showRating is true (after match ends) */}
        {showRating && (
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${getRatingBadgeClass(
              r.rating
            )}`}
            title={`Match Rating: ${r.rating.toFixed(1)} / 10.0`}
          >
            {r.rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Banner: Scoreboard & Real-time Authoritative Clock */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-tactical-700/60 text-xs text-tactical-400 gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-pitch-accent shrink-0" />
              <span className="font-mono text-tactical-200 font-bold text-sm">
                {visualMinute}'
              </span>
              <span className="text-tactical-400 text-[11px]">
                / {maxVisualMinute}' ({liveMatch.currentSecond}s)
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold border ${
                liveMatch.knockoutMode
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                  : 'bg-pitch-DEFAULT/20 text-pitch-accent border-pitch-line/50'
              }`}
            >
              {liveMatch.knockoutMode
                ? '🏆 Cup Knockout'
                : '⚽ League Match'}
            </span>

            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 text-[11px] text-tactical-300 hover:text-tactical-100 px-2 py-1 rounded bg-tactical-800 border border-tactical-700"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{soundEnabled ? 'Audio' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-3 items-center py-3 sm:py-4 text-center gap-1 sm:gap-4">
          {/* Host */}
          <div className="flex flex-col items-center min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tactical-800 border border-tactical-600 flex items-center justify-center font-bold text-xs sm:text-sm text-tactical-200 mb-1 sm:mb-2 shrink-0">
              H
            </div>
            <h2 className="font-bold text-xs sm:text-base text-tactical-100 truncate w-full px-1">
              {hostName}
            </h2>
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-tactical-400 font-mono mt-0.5 truncate w-full">
              <span className="truncate">{hostDraft.formation.name.split(' ')[0]}</span>
              <span>•</span>
              <span className="capitalize">{hostDraft.strategy}</span>
            </div>
          </div>

          {/* Central Score */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="font-mono text-3xl sm:text-5xl font-black text-tactical-100 tracking-tight flex items-center gap-2 sm:gap-3">
              <span>{liveMatch.score.host}</span>
              <span className="text-tactical-500 font-light text-2xl sm:text-3xl">-</span>
              <span>{liveMatch.score.guest}</span>
            </div>
            {(liveMatch.status === 'penalties' ||
              (liveMatch.status === 'completed' && liveMatch.winMethod === 'penalties')) &&
              liveMatch.penaltyScore && (
                <div className="font-mono text-[10px] sm:text-xs text-gold-400 mt-1 whitespace-nowrap animate-fade-in">
                  Pens: {liveMatch.penaltyScore.host} - {liveMatch.penaltyScore.guest}
                </div>
              )}
          </div>

          {/* Guest */}
          <div className="flex flex-col items-center min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tactical-800 border border-tactical-600 flex items-center justify-center font-bold text-xs sm:text-sm text-tactical-200 mb-1 sm:mb-2 shrink-0">
              G
            </div>
            <h2 className="font-bold text-xs sm:text-base text-tactical-100 truncate w-full px-1">
              {guestName}
            </h2>
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-tactical-400 font-mono mt-0.5 truncate w-full">
              <span className="truncate">{(guestDraft?.formation.name || '4-3-3').split(' ')[0]}</span>
              <span>•</span>
              <span className="capitalize">{guestDraft?.strategy || 'balanced'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live In-Match Touchline Tactical Dugout */}
      {!isMatchFinished && (
        <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-3.5 shadow-lg space-y-3">
          {/* Active Shout Banner */}
          {activeShout && (
            <div className="p-2.5 rounded-lg bg-gold-500/20 border border-gold-500/50 flex items-center justify-between text-xs text-gold-300 font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-gold-400" />
                <span>📢 Manager Shout: {activeShout.label}!</span>
              </div>
              <span className="text-[10px] font-mono text-gold-400">Tactical Boost Active</span>
            </div>
          )}

          {/* Mentality Header & Dugout Toggle */}
          <div className="flex items-center justify-between gap-2 border-b border-tactical-800/80 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-pitch-accent animate-pulse shrink-0"></span>
              <span className="text-xs font-bold text-tactical-200 uppercase tracking-wider shrink-0">
                Mentality:
              </span>
              <span className="text-[11px] font-mono text-tactical-300 capitalize truncate">
                {currentMentality} • {defensiveStyle.replace('_', ' ')} • {passingStyle.replace('_', ' ')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDugoutOpen(!isDugoutOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isDugoutOpen
                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/50 shadow-sm'
                  : 'bg-tactical-800 text-tactical-300 hover:text-tactical-100 hover:bg-tactical-750 border border-tactical-700'
              }`}
            >
              <span>{isDugoutOpen ? 'Hide Dugout ✕' : 'Tactics & Shouts ⚙️'}</span>
            </button>
          </div>

          {/* Mentality Action Buttons: 3 full-width columns with dedicated room */}
          <div className="grid grid-cols-3 gap-2 w-full pt-0.5">
            <button
              type="button"
              onClick={() => handleMentalitySelect('defensive')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentMentality === 'defensive'
                  ? 'bg-blue-600 text-white shadow-md border border-blue-400 ring-2 ring-blue-500/40'
                  : 'bg-tactical-800 text-tactical-300 hover:text-tactical-100 hover:bg-tactical-750 border border-tactical-700'
              }`}
              title="Park the Bus: Strengthen defense, prioritize clean sheets and blocks"
            >
              <span>🛡️</span>
              <span>Defend</span>
            </button>
            <button
              type="button"
              onClick={() => handleMentalitySelect('balanced')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentMentality === 'balanced'
                  ? 'bg-tactical-700 text-tactical-100 shadow-md border border-tactical-500 ring-2 ring-tactical-400/40'
                  : 'bg-tactical-800 text-tactical-300 hover:text-tactical-100 hover:bg-tactical-750 border border-tactical-700'
              }`}
              title="Balanced: Maintain planned tactical shape and discipline"
            >
              <span>⚖️</span>
              <span>Balanced</span>
            </button>
            <button
              type="button"
              onClick={() => handleMentalitySelect('attacking')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentMentality === 'attacking'
                  ? 'bg-rose-600 text-white shadow-md border border-rose-400 ring-2 ring-rose-500/40 animate-pulse'
                  : 'bg-tactical-800 text-tactical-300 hover:text-tactical-100 hover:bg-tactical-750 border border-tactical-700'
              }`}
              title="All-Out Attack: Commit players forward to generate chances and goals"
            >
              <span>⚡</span>
              <span>Attack</span>
            </button>
          </div>

          {/* Expanded Tactical Dugout (Pressing, Passing Style, Shouts) */}
          {isDugoutOpen && (
            <div className="pt-3 border-t border-tactical-750 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
              {/* Defensive & Pressing Line */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-tactical-400 uppercase tracking-wider">
                  Pressing & Defensive Line
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'low_block', label: 'Low Block', desc: 'Absorb & counter' },
                    { id: 'mid_block', label: 'Mid Block', desc: 'Disciplined' },
                    { id: 'high_press', label: 'High Press', desc: 'Gegenpress' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleDefensiveSelect(s.id as DefensiveStyle)}
                      className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                        defensiveStyle === s.id
                          ? 'bg-pitch-DEFAULT/30 text-pitch-accent border-pitch-line'
                          : 'bg-tactical-900 text-tactical-400 border-tactical-800 hover:bg-tactical-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Build-Up & Passing Style */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-tactical-400 uppercase tracking-wider">
                  Passing & Build-Up
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'tiki_taka', label: 'Tiki-Taka', desc: 'Short passes' },
                    { id: 'direct', label: 'Direct', desc: 'Long ball' },
                    { id: 'wing_play', label: 'Wing Play', desc: 'Crosses' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handlePassingSelect(s.id as PassingStyle)}
                      className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                        passingStyle === s.id
                          ? 'bg-pitch-DEFAULT/30 text-pitch-accent border-pitch-line'
                          : 'bg-tactical-900 text-tactical-400 border-tactical-800 hover:bg-tactical-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Touchline Shouts (with Cooldown) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider flex items-center justify-between">
                  <span>📢 Touchline Shouts</span>
                  {now < shoutCooldownUntil && (
                    <span className="font-mono text-tactical-400">
                      Cooldown ({Math.ceil((shoutCooldownUntil - now) / 1000)}s)
                    </span>
                  )}
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'demand_more', label: 'Demand More', icon: '🔥' },
                    { id: 'focus_retain', label: 'Focus & Retain', icon: '🧠' },
                    { id: 'push_forward', label: 'Push Forward', icon: '⚡' },
                  ].map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      disabled={now < shoutCooldownUntil}
                      onClick={() => handleShout(sh.id as TouchlineShout, sh.label)}
                      className="p-1.5 rounded-lg text-[10px] font-bold bg-gold-500/15 hover:bg-gold-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-gold-300 border border-gold-500/40 text-center active:scale-95 transition-all truncate"
                    >
                      <span>{sh.icon} {sh.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Switcher Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-tactical-850 rounded-xl border border-tactical-750 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('pitch')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'pitch'
              ? 'bg-tactical-700 text-tactical-100 shadow-sm border border-tactical-600'
              : 'text-tactical-400 hover:text-tactical-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-pitch-accent" />
          <span>Pitch & Action</span>
        </button>

        <button
          onClick={() => setActiveTab('lineups')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'lineups'
              ? 'bg-tactical-700 text-tactical-100 shadow-sm border border-tactical-600'
              : 'text-tactical-400 hover:text-tactical-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-pitch-accent" />
          <span>Both Pitches</span>
        </button>
      </div>

      {/* SEPARATE OPTION: Both Pitches View (Tactical formations with set players) */}
      {activeTab === 'lineups' && (
        <BothPitchesView
          hostDraft={hostDraft}
          guestDraft={guestDraft}
          ratingsData={ratingsData}
          isMatchFinished={isMatchFinished}
          onBackToMain={() => setActiveTab('pitch')}
          hostAvgRating={hostAvgRating}
          guestAvgRating={guestAvgRating}
          renderPlayerRow={renderPlayerRow}
        />
      )}

      {/* Main Simulation View: 2D Pitch & Distinct Highlights Feed (Lineups removed from here!) */}
      {activeTab === 'pitch' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 2D Pitch Visualizer (7 cols) */}
          <div className="lg:col-span-7 bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 text-xs text-tactical-400">
              <span className="font-semibold text-tactical-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-pitch-accent" />
                Tactical Pitch Simulation
              </span>
              <span className="font-mono text-[11px]">
                Action Zone: {latestEvent ? latestEvent.type.toUpperCase() : 'MIDFIELD'}
              </span>
            </div>

            {/* 2D Pitch Field */}
            <div className="relative w-full aspect-[16/10] bg-pitch-DEFAULT rounded-lg border-2 border-pitch-line/80 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Field Markings */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-pitch-line/60 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-pitch-line/60 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-pitch-line/80 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/4 bottom-1/4 left-0 w-16 border-r-2 border-t-2 border-b-2 border-pitch-line/60"></div>
              <div className="absolute top-1/4 bottom-1/4 right-0 w-16 border-l-2 border-t-2 border-b-2 border-pitch-line/60"></div>
              <div className="absolute top-1/3 bottom-1/3 left-0 w-6 border-r-2 border-t-2 border-b-2 border-pitch-line/60"></div>
              <div className="absolute top-1/3 bottom-1/3 right-0 w-6 border-l-2 border-t-2 border-b-2 border-pitch-line/60"></div>

              {/* Animated Ball Position */}
              <div
                className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-700 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
                style={{
                  left: `${ballPos.x}%`,
                  top: `${ballPos.y}%`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-tactical-950"></div>
              </div>

              {/* Distinct Visual Pitch Animations */}
              {/* 1. Goal Event: Broadcast Graphic + Pitch Ripple */}
              {latestEvent && latestEvent.type === 'goal' && (
                <>
                  {/* Ball Ripple (Clamped to prevent clipping) */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                    style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-full border-4 animate-ping ${
                        latestEvent.team === 'host'
                          ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)]'
                          : 'border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.9)]'
                      }`}
                    />
                  </div>

                  {/* Centered TV Broadcast Goal Banner */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-3">
                    <div
                      className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl border-2 shadow-2xl flex flex-col items-center animate-bounce backdrop-blur-sm ${
                        latestEvent.team === 'host'
                          ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.7)]'
                          : 'bg-orange-950/95 border-orange-400 text-orange-100 shadow-[0_0_30px_rgba(249,115,22,0.7)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg">⚽</span>
                        <span className="font-mono font-black text-xs sm:text-sm tracking-widest uppercase">
                          GOAL!
                        </span>
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-white/95 truncate max-w-[200px] text-center whitespace-nowrap">
                        {latestEvent.team === 'host' ? hostName : guestName}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* 2. Yellow Card Event: Physical Yellow Referee Card Popup */}
              {latestEvent && latestEvent.type === 'yellow_card' && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center animate-bounce"
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                >
                  <div className="w-5 h-7 rounded-xs bg-yellow-400 border-2 border-yellow-100 shadow-[0_0_18px_rgba(250,204,21,1)] flex items-center justify-center font-bold text-[10px] text-yellow-950 font-mono">
                    !
                  </div>
                  <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-amber-950/95 border border-yellow-400 text-yellow-300 shadow-md uppercase tracking-wider mt-1 whitespace-nowrap">
                    🟨 CARD
                  </span>
                </div>
              )}

              {/* 3. Magical Save Event: Cyan Ring */}
              {latestEvent && latestEvent.type === 'save' && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center"
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                >
                  <div className="w-14 h-14 rounded-full border-3 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-ping" />
                  <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 shadow-md uppercase tracking-wider mt-1 whitespace-nowrap">
                    🧤 SAVE
                  </span>
                </div>
              )}

              {/* Team labels on pitch */}
              <div className="absolute top-2.5 left-2.5 text-[10px] sm:text-[11px] font-mono text-pitch-line/95 uppercase tracking-wider font-bold bg-tactical-950/75 px-2 py-0.5 rounded border border-pitch-line/30 backdrop-blur-xs select-none">
                {hostName} (ATTACK →)
              </div>
              <div className="absolute bottom-2.5 right-2.5 text-[10px] sm:text-[11px] font-mono text-pitch-line/95 uppercase tracking-wider font-bold bg-tactical-950/75 px-2 py-0.5 rounded border border-pitch-line/30 backdrop-blur-xs select-none">
                (← ATTACK) {guestName}
              </div>
            </div>

            {/* Active Highlight Banner (Differentiated by event & scoring team) */}
            <div
              className={`mt-3 p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all shadow-md ${
                latestEvent?.type === 'goal'
                  ? latestEvent.team === 'host'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50'
                    : 'bg-orange-950/90 border-orange-400 text-orange-100 ring-2 ring-orange-400/50'
                  : latestEvent?.type === 'yellow_card'
                  ? 'bg-amber-950/90 border-yellow-400 text-yellow-100 ring-2 ring-yellow-400/40'
                  : latestEvent?.type === 'red_card'
                  ? 'bg-red-950/90 border-red-400 text-red-100'
                  : latestEvent?.type === 'save'
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-100'
                  : 'bg-tactical-900 border-tactical-700/60 text-tactical-200'
              }`}
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono font-black text-xs shrink-0 px-2 py-0.5 rounded bg-tactical-950/80 border border-tactical-700">
                  {latestEvent ? `${latestEvent.minute ?? latestEvent.second}'` : '0\''}
                </span>
                {latestEvent?.type === 'goal' && (
                  <span
                    className={`px-2 py-0.5 rounded font-black font-mono text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 animate-pulse whitespace-nowrap ${
                      latestEvent.team === 'host'
                        ? 'bg-emerald-500 text-tactical-950'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    ⚽ {latestEvent.team === 'host' ? `${hostName} GOAL!` : `${guestName} GOAL!`}
                  </span>
                )}
                {latestEvent?.type === 'yellow_card' && (
                  <span className="px-2 py-0.5 rounded bg-yellow-400 text-tactical-950 font-bold font-mono text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1 whitespace-nowrap">
                    <span className="inline-block w-2.5 h-3.5 bg-yellow-300 rounded-xs border border-yellow-100 shadow-xs"></span>
                    YELLOW CARD
                  </span>
                )}
                {latestEvent?.type === 'save' && (
                  <span className="px-2 py-0.5 rounded bg-cyan-500 text-tactical-950 font-bold font-mono text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 whitespace-nowrap">
                    🧤 SAVE
                  </span>
                )}
              </div>
              <div className="font-medium text-xs text-tactical-200 flex-1 leading-snug">
                {latestEvent ? latestEvent.description : 'Match underway.'}
              </div>
            </div>
          </div>

          {/* Authoritative Highlight Feed (5 cols) */}
          <div className="lg:col-span-5 bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 flex flex-col h-[340px] lg:h-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-tactical-700 text-xs">
              <span className="font-semibold text-tactical-200">
                Match Highlights ({liveMatch.events.length})
              </span>
              <span className="text-[11px] text-tactical-400 font-mono">
                Key Events Only
              </span>
            </div>

            <div
              ref={eventFeedRef}
              className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs smooth-scroll"
            >
              {liveMatch.events.length === 0 ? (
                <div className="text-tactical-500 text-center py-10 italic">
                  Awaiting kickoff...
                </div>
              ) : (
                liveMatch.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-2.5 rounded-lg border transition-all ${
                      ev.type === 'goal'
                        ? ev.team === 'host'
                          ? 'bg-emerald-950/85 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40'
                          : 'bg-orange-950/85 border-2 border-orange-400 text-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.25)] ring-1 ring-orange-400/40'
                        : ev.type === 'save'
                        ? 'bg-cyan-950/60 border-2 border-cyan-400 text-cyan-100 shadow-sm'
                        : ev.type === 'red_card'
                        ? 'bg-red-950/70 border-2 border-red-500 text-red-100 shadow-sm'
                        : ev.type === 'yellow_card'
                        ? 'bg-amber-950/60 border-2 border-yellow-400 text-yellow-100 shadow-[0_0_12px_rgba(250,204,21,0.2)]'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        {ev.type === 'goal' && (
                          <span
                            className={`font-extrabold flex items-center gap-1 ${
                              ev.team === 'host' ? 'text-emerald-300' : 'text-orange-300'
                            }`}
                          >
                            ⚽ {ev.team === 'host' ? `${hostName} GOAL!` : `${guestName} GOAL!`}
                          </span>
                        )}
                        {ev.type === 'save' && (
                          <span className="text-cyan-300 font-bold flex items-center gap-1">
                            🧤 MAGICAL SAVE
                          </span>
                        )}
                        {ev.type === 'yellow_card' && (
                          <span className="text-yellow-300 font-bold flex items-center gap-1">
                            <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-xs border border-yellow-200 shadow-xs mr-0.5"></span>
                            🟨 YELLOW CARD
                          </span>
                        )}
                        {ev.type === 'red_card' && (
                          <span className="text-red-300 font-bold flex items-center gap-1">
                            <span className="inline-block w-2.5 h-3.5 bg-red-500 rounded-xs border border-red-200 shadow-xs mr-0.5"></span>
                            🟥 RED CARD
                          </span>
                        )}
                        {ev.type === 'kickoff' && '⏱ KICKOFF'}
                        {ev.type === 'halftime' && '⏱ HALF-TIME'}
                        {ev.type === 'fulltime' && '🏁 FULL-TIME'}
                        <span className="text-tactical-400 font-normal">
                          ({ev.minute ?? ev.second}')
                        </span>
                      </span>
                      <span className="text-tactical-300 font-bold">
                        {ev.score.host} - {ev.score.guest}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    )}

      {/* Penalty Shootout Display (only if match reached penalties period or finished on penalties) */}
      {(liveMatch.status === 'penalties' ||
        (liveMatch.status === 'completed' && liveMatch.winMethod === 'penalties')) &&
        liveMatch.penalties &&
        liveMatch.penalties.length > 0 && (
        <div className="bg-tactical-850 border border-gold-500/50 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-tactical-700/70 gap-2">
            <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-400" />
              Penalty Shootout Results
            </h4>
            <div className="font-mono text-xs font-bold text-tactical-200 bg-tactical-900 px-3 py-1 rounded border border-tactical-700">
              Shootout Score: <span className="text-emerald-400 font-black">{liveMatch.penaltyScore?.host ?? 0}</span> - <span className="text-emerald-400 font-black">{liveMatch.penaltyScore?.guest ?? 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Host Kickers */}
            <div className="bg-tactical-900/80 rounded-lg p-3 border border-tactical-750 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-tactical-800">
                <span className="font-bold text-tactical-100 truncate">{hostName}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {liveMatch.penalties.filter((p) => p.team === 'host' && p.scored).length} Goals
                </span>
              </div>
              <div className="space-y-1.5">
                {liveMatch.penalties
                  .filter((p) => p.team === 'host')
                  .map((p, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-xs transition-all ${
                        p.scored
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/40 border-red-500/40 text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] text-tactical-400 font-semibold w-5">
                          #{p.round}
                        </span>
                        <span className="font-medium truncate">
                          {p.kicker.squadNumber}. {p.kicker.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono font-bold text-[11px]">
                        {p.scored ? (
                          <>
                            <span className="text-emerald-400">⚽ SCORED</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          </>
                        ) : (
                          <>
                            <span className="text-red-400">❌ MISSED</span>
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Guest Kickers */}
            <div className="bg-tactical-900/80 rounded-lg p-3 border border-tactical-750 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-tactical-800">
                <span className="font-bold text-tactical-100 truncate">{guestName}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {liveMatch.penalties.filter((p) => p.team === 'guest' && p.scored).length} Goals
                </span>
              </div>
              <div className="space-y-1.5">
                {liveMatch.penalties
                  .filter((p) => p.team === 'guest')
                  .map((p, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-xs transition-all ${
                        p.scored
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/40 border-red-500/40 text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] text-tactical-400 font-semibold w-5">
                          #{p.round}
                        </span>
                        <span className="font-medium truncate">
                          {p.kicker.squadNumber}. {p.kicker.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono font-bold text-[11px]">
                        {p.scored ? (
                          <>
                            <span className="text-emerald-400">⚽ SCORED</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          </>
                        ) : (
                          <>
                            <span className="text-red-400">❌ MISSED</span>
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Match Statistics Grid */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-3">
          Match Statistics
        </h4>

        <div className="grid grid-cols-3 gap-3 text-xs text-center border-t border-tactical-750 pt-3">
          <div className="font-mono text-tactical-200 font-bold">{liveMatch.stats.host.shots}</div>
          <div className="text-tactical-400">Total Shots</div>
          <div className="font-mono text-tactical-200 font-bold">{liveMatch.stats.guest.shots}</div>

          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.host.shotsOnTarget}
          </div>
          <div className="text-tactical-400">Shots on Target</div>
          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.guest.shotsOnTarget}
          </div>

          <div className="font-mono text-tactical-200 font-bold">{liveMatch.stats.host.saves}</div>
          <div className="text-tactical-400">Goalkeeper Saves</div>
          <div className="font-mono text-tactical-200 font-bold">{liveMatch.stats.guest.saves}</div>

          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.host.corners}
          </div>
          <div className="text-tactical-400">Corner Kicks</div>
          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.guest.corners}
          </div>

          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.host.tackles}
          </div>
          <div className="text-tactical-400">Defensive Interventions</div>
          <div className="font-mono text-tactical-200 font-bold">
            {liveMatch.stats.guest.tackles}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {liveMatch.status === 'completed' && (
        <div className="bg-gradient-to-r from-tactical-850 via-tactical-800 to-tactical-850 border border-emerald-500/40 rounded-xl p-6 text-center space-y-4 shadow-xl">
          <Trophy className="w-10 h-10 mx-auto text-gold-400" />
          <div>
            <h3 className="text-xl font-bold text-tactical-100">
              {liveMatch.winner === 'host'
                ? `${hostName} Wins!`
                : liveMatch.winner === 'guest'
                ? `${guestName} Wins!`
                : 'Match Drawn!'}
            </h3>
            <p className="text-xs text-tactical-400 mt-1">
              Method:{' '}
              {liveMatch.winMethod
                ? liveMatch.winMethod.replace('_', ' ').toUpperCase()
                : 'REGULAR TIME'}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={onExitMatch}
              className="inline-flex items-center gap-2 bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-semibold px-6 py-2.5 rounded-lg text-sm border border-pitch-line active:scale-98 transition-all shadow-md"
            >
              <span>{messages.match.playAgain}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Match Result Winner Modal / Popup */}
      <MatchResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        liveMatch={liveMatch}
        hostDraft={hostDraft}
        guestDraft={guestDraft}
        ratingsData={ratingsData}
        isTournament={isTournament}
        onViewBothPitches={() => {
          setActiveTab('lineups');
          setShowResultModal(false);
        }}
        onPlayAgain={onExitMatch}
      />
    </div>
  );
};
