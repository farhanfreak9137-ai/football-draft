import React, { useState } from 'react';
import {
  MatchSimulationState,
  PlayerDraftState,
  PlayerMatchRating,
} from '../../shared/types/index.js';
import {
  Trophy,
  Star,
  X,
  ArrowRight,
  Shield,
  Activity,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { messages } from '../i18n/messages.js';
import { getOvrColorClass } from '../utils/ovrColor.js';
import { profileService } from '../services/profileService.js';
import { convertDraftStateToDreamTeam } from '../utils/dreamTeamHelper.js';
import { soundManager } from '../utils/audio.js';

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveMatch: MatchSimulationState;
  hostDraft: PlayerDraftState;
  guestDraft?: PlayerDraftState;
  ratingsData: {
    hostRatings: PlayerMatchRating[];
    guestRatings: PlayerMatchRating[];
    starOfMatch: PlayerMatchRating | null;
  } | null;
  onViewBothPitches: () => void;
  onPlayAgain: () => void;
  isTournament?: boolean;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  onClose,
  liveMatch,
  hostDraft,
  guestDraft,
  ratingsData,
  onViewBothPitches,
  onPlayAgain,
  isTournament = false,
}) => {
  const [dreamTeamSaved, setDreamTeamSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveDreamTeam = () => {
    const dt = convertDraftStateToDreamTeam(hostDraft);
    profileService.saveDreamTeam(dt);
    setDreamTeamSaved(true);
    soundManager.playPickSound();
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

  const isHostWinner = liveMatch.winner === 'host';
  const isGuestWinner = liveMatch.winner === 'guest';
  const isDraw = !liveMatch.winner || liveMatch.winner === 'draw';

  // Format win method
  const getWinMethodLabel = () => {
    if (liveMatch.winMethod === 'penalties') {
      const hPen = liveMatch.penaltyScore?.host ?? 0;
      const gPen = liveMatch.penaltyScore?.guest ?? 0;
      return `Penalty Shootout Victory (${hPen} - ${gPen})`;
    }
    if (liveMatch.winMethod === 'extra_time') {
      return 'After Extra Time (120\')';
    }
    if (isDraw) {
      return `Full-Time Deadlock (${maxVisualMinute}\')`;
    }
    return `Regular Time (90\')`;
  };

  // Extract goal scorers for quick review
  const hostGoals = liveMatch.events
    .filter((e) => e.type === 'goal' && e.team === 'host')
    .map((e) => ({
      scorer: e.player?.name || 'Attacker',
      minute: e.minute ?? e.second,
    }));

  const guestGoals = liveMatch.events
    .filter((e) => e.type === 'goal' && e.team === 'guest')
    .map((e) => ({
      scorer: e.player?.name || 'Attacker',
      minute: e.minute ?? e.second,
    }));

  const starOfMatch = ratingsData?.starOfMatch;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-tactical-950/85 backdrop-blur-md animate-fade-in"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-result-title"
    >
      <div
        className="bg-tactical-850 border border-tactical-700/90 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Radiant Hero Banner */}
        <div
          className={`relative px-6 pt-7 pb-5 text-center border-b ${
            isHostWinner
              ? 'bg-gradient-to-b from-emerald-950/80 via-tactical-900 to-tactical-850 border-emerald-500/40'
              : isGuestWinner
              ? 'bg-gradient-to-b from-orange-950/80 via-tactical-900 to-tactical-850 border-orange-500/40'
              : 'bg-gradient-to-b from-blue-950/80 via-tactical-900 to-tactical-850 border-blue-500/40'
          }`}
        >
          {/* Close X Button */}
          <button
            onClick={onClose}
            aria-label="Close Winner Popup"
            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trophy & Glow Icon */}
          <div className="relative inline-flex items-center justify-center mb-2">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-xl ${
                isHostWinner
                  ? 'bg-emerald-500/20 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                  : isGuestWinner
                  ? 'bg-orange-500/20 border-orange-400/60 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                  : 'bg-blue-500/20 border-blue-400/60 shadow-[0_0_25px_rgba(59,130,246,0.35)]'
              }`}
            >
              <Trophy
                className={`w-9 h-9 ${
                  isHostWinner
                    ? 'text-gold-400'
                    : isGuestWinner
                    ? 'text-orange-400'
                    : 'text-blue-300'
                }`}
              />
            </div>
            <Sparkles className="w-4 h-4 text-gold-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          {/* Eyebrow Status */}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isHostWinner
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isGuestWinner
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}
            >
              Match Concluded • {maxVisualMinute}'
            </span>
          </div>

          {/* Winner Title */}
          <h2
            id="match-result-title"
            className="text-2xl sm:text-3xl font-black text-tactical-100 tracking-tight"
          >
            {isHostWinner ? (
              <span className="text-emerald-400 flex items-center justify-center gap-2">
                <span>🏆</span>
                <span>{hostName} Wins!</span>
              </span>
            ) : isGuestWinner ? (
              <span className="text-orange-400 flex items-center justify-center gap-2">
                <span>🏆</span>
                <span>{guestName} Wins!</span>
              </span>
            ) : (
              <span className="text-blue-300 flex items-center justify-center gap-2">
                <span>🤝</span>
                <span>Match Drawn!</span>
              </span>
            )}
          </h2>

          <p className="text-xs text-tactical-400 font-medium mt-1">
            {getWinMethodLabel()}
          </p>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Big Scoreboard Card */}
          <div className="bg-tactical-900/90 border border-tactical-750 rounded-xl p-4 shadow-inner">
            <div className="grid grid-cols-3 items-center text-center">
              {/* Host Team */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 border ${
                    isHostWinner
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-tactical-800 text-tactical-200 border-tactical-600'
                  }`}
                >
                  H
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-tactical-100 truncate max-w-[120px]">
                  {hostName}
                </h3>
                <span className="text-[10px] text-tactical-400 font-mono">
                  {hostDraft.formation.name}
                </span>

                {/* Host Scorers */}
                {hostGoals.length > 0 ? (
                  <div className="mt-2 space-y-0.5 text-[11px]">
                    {hostGoals.map((g, i) => (
                      <div
                        key={i}
                        className="text-tactical-300 text-[10px] flex items-center justify-center gap-1"
                      >
                        <span>⚽</span>
                        <span className="font-semibold text-emerald-300 truncate max-w-[90px]">
                          {g.scorer}
                        </span>
                        <span className="text-tactical-400 font-mono">({g.minute}')</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="mt-2 text-[10px] text-tactical-500 italic">No goals</span>
                )}
              </div>

              {/* Central Score */}
              <div className="flex flex-col items-center justify-center">
                <div className="font-mono text-3xl sm:text-4xl font-black text-tactical-100 tracking-tight flex items-center gap-2">
                  <span className={isHostWinner ? 'text-emerald-400' : ''}>
                    {liveMatch.score.host}
                  </span>
                  <span className="text-tactical-600 font-light text-2xl">-</span>
                  <span className={isGuestWinner ? 'text-orange-400' : ''}>
                    {liveMatch.score.guest}
                  </span>
                </div>

                {liveMatch.winMethod === 'penalties' && liveMatch.penaltyScore && (
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-gold-400 font-mono text-[11px] font-bold">
                    Penalties: {liveMatch.penaltyScore.host} - {liveMatch.penaltyScore.guest}
                  </div>
                )}
                <div className="text-[10px] text-tactical-400 uppercase tracking-wider font-mono mt-1">
                  Final Score
                </div>
              </div>

              {/* Guest Team */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 border ${
                    isGuestWinner
                      ? 'bg-orange-500/20 text-orange-300 border-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                      : 'bg-tactical-800 text-tactical-200 border-tactical-600'
                  }`}
                >
                  G
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-tactical-100 truncate max-w-[120px]">
                  {guestName}
                </h3>
                <span className="text-[10px] text-tactical-400 font-mono">
                  {guestDraft?.formation.name || '4-3-3'}
                </span>

                {/* Guest Scorers */}
                {guestGoals.length > 0 ? (
                  <div className="mt-2 space-y-0.5 text-[11px]">
                    {guestGoals.map((g, i) => (
                      <div
                        key={i}
                        className="text-tactical-300 text-[10px] flex items-center justify-center gap-1"
                      >
                        <span>⚽</span>
                        <span className="font-semibold text-orange-300 truncate max-w-[90px]">
                          {g.scorer}
                        </span>
                        <span className="text-tactical-400 font-mono">({g.minute}')</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="mt-2 text-[10px] text-tactical-500 italic">No goals</span>
                )}
              </div>
            </div>
          </div>

          {/* Star of the Match (MVP) Box */}
          {starOfMatch && (
            <div className="p-3.5 rounded-xl bg-tactical-900/90 border border-gold-500/40 relative overflow-hidden text-left shadow-md">
              <div className="flex items-center justify-between text-[11px] text-gold-400 font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  <span>Star of the Match</span>
                </span>
                <span className="font-mono bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded border border-gold-500/30 text-xs font-black">
                  ★ {starOfMatch.rating.toFixed(1)} / 10.0
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-tactical-800 border border-gold-500/50 flex items-center justify-center font-mono font-bold text-xs text-gold-300 shrink-0">
                    #{starOfMatch.squadNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-tactical-100 truncate flex items-center gap-1.5">
                      <span>{starOfMatch.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-300 border border-tactical-700">
                        {starOfMatch.position}
                      </span>
                    </div>
                    <div className="text-[11px] text-tactical-400 truncate">
                      {starOfMatch.team === 'host' ? hostName : guestName} • Historical OVR{' '}
                      <span className={`font-mono font-bold ${getOvrColorClass(starOfMatch.ovr)}`}>
                        {starOfMatch.ovr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event badges */}
                <div className="flex items-center gap-1 shrink-0">
                  {starOfMatch.stats.goals > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold font-mono text-[10px]">
                      ⚽{starOfMatch.stats.goals > 1 ? `x${starOfMatch.stats.goals}` : ''}
                    </span>
                  )}
                  {starOfMatch.stats.saves > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold font-mono text-[10px]">
                      🧤{starOfMatch.stats.saves > 1 ? `x${starOfMatch.stats.saves}` : ''}
                    </span>
                  )}
                  {starOfMatch.stats.cleanSheet && (
                    <span className="text-xs" title="Clean Sheet">
                      🛡️
                    </span>
                  )}
                </div>
              </div>

              {starOfMatch.summary && (
                <p className="mt-2 text-xs text-tactical-300 border-t border-tactical-800 pt-1.5 italic">
                  "{starOfMatch.summary}"
                </p>
              )}
            </div>
          )}

          {/* Quick Match Key Stats */}
          <div className="bg-tactical-900/60 border border-tactical-750 rounded-xl p-3 text-xs">
            <div className="text-[10px] text-tactical-400 font-semibold uppercase tracking-wider mb-2 text-center">
              Match Overview
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.host.shots}
              </span>
              <span className="text-tactical-400">Total Shots</span>
              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.guest.shots}
              </span>

              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.host.shotsOnTarget}
              </span>
              <span className="text-tactical-400">On Target</span>
              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.guest.shotsOnTarget}
              </span>

              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.host.saves}
              </span>
              <span className="text-tactical-400">Goalkeeper Saves</span>
              <span className="font-mono text-tactical-200 font-bold">
                {liveMatch.stats.guest.saves}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-tactical-750 bg-tactical-900/80 flex flex-wrap items-center justify-between gap-2.5">
          {!isTournament ? (
            <button
              onClick={handleSaveDreamTeam}
              className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 font-bold text-xs border border-gold-500/50 active:scale-98 shadow-md transition-all"
            >
              {dreamTeamSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-gold-400" />}
              <span>{dreamTeamSaved ? 'Saved to Dream Team!' : '⭐ Save XI as Dream Team'}</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-tactical-800 hover:bg-tactical-700 text-tactical-200 font-semibold text-xs border border-tactical-700 transition-all"
            >
              <span>Close</span>
            </button>

            <button
              onClick={onPlayAgain}
              className="flex items-center justify-center gap-1.5 py-2 px-5 rounded-xl bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-bold text-xs border border-pitch-line active:scale-98 shadow-md transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{messages.match.playAgain}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

