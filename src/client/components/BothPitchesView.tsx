import React, { useState } from 'react';
import {
  PlayerDraftState,
  PlayerMatchRating,
  Position,
} from '../../shared/types/index.js';
import { Award, ArrowLeft, Users, Shield } from 'lucide-react';
import { getOvrColorClass } from '../utils/ovrColor.js';

interface BothPitchesViewProps {
  hostDraft: PlayerDraftState;
  guestDraft?: PlayerDraftState;
  ratingsData: {
    hostRatings: PlayerMatchRating[];
    guestRatings: PlayerMatchRating[];
    starOfMatch: PlayerMatchRating | null;
  } | null;
  isMatchFinished: boolean;
  onBackToMain: () => void;
  hostAvgRating: string;
  guestAvgRating: string;
  renderPlayerRow: (r: PlayerMatchRating, showRating?: boolean) => React.ReactNode;
}

export const BothPitchesView: React.FC<BothPitchesViewProps> = ({
  hostDraft,
  guestDraft,
  ratingsData,
  isMatchFinished,
  onBackToMain,
  hostAvgRating,
  guestAvgRating,
  renderPlayerRow,
}) => {
  const [mobilePitchView, setMobilePitchView] = useState<'both' | 'host' | 'guest'>('both');
  const [showRosterTable, setShowRosterTable] = useState(true);

  const hostName = hostDraft.playerName || 'Host XI';
  const guestName = guestDraft?.playerName || 'Opponent XI';

  // Map ratings by playerId for easy O(1) lookup on pitch tokens
  const hostRatingMap = new Map(ratingsData?.hostRatings.map((r) => [r.playerId, r]));
  const guestRatingMap = new Map(ratingsData?.guestRatings.map((r) => [r.playerId, r]));

  // Helper for role-based styling
  const getRoleColors = (pos: Position, hasLegendSeal: boolean, ovr?: number) => {
    if (ovr !== undefined && ovr >= 95) {
      return 'bg-gradient-to-b from-tactical-800 via-amber-950/40 to-tactical-900 border-amber-300 text-amber-200 ring-2 ring-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.55)]';
    }
    if (hasLegendSeal || (ovr !== undefined && ovr >= 90)) {
      return 'bg-gradient-to-b from-tactical-800 to-tactical-900 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    }
    if (pos === 'GK') {
      return 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-md';
    }
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) {
      return 'bg-blue-950/90 border-blue-400 text-blue-200 shadow-md';
    }
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) {
      return 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-md';
    }
    return 'bg-rose-950/90 border-rose-400 text-rose-200 shadow-md';
  };

  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 9.0) return 'text-emerald-300 font-black';
    if (rating >= 8.0) return 'text-emerald-400 font-bold';
    if (rating >= 7.0) return 'text-blue-300 font-semibold';
    if (rating >= 6.0) return 'text-tactical-200 font-medium';
    return 'text-rose-400 font-medium';
  };

  // Render a tactical pitch with set players
  const renderTeamPitch = (
    team: 'host' | 'guest',
    draft: PlayerDraftState,
    ratingMap: Map<string, PlayerMatchRating>,
    avgRating: string
  ) => {
    const isHost = team === 'host';
    const teamTitle = isHost ? hostName : guestName;

    return (
      <div className="bg-tactical-850/95 border border-tactical-700/80 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
        {/* Pitch Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-tactical-700/70 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                isHost
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-sm'
                  : 'bg-orange-950 border-orange-400 text-orange-300 shadow-sm'
              }`}
            >
              {isHost ? 'H' : 'G'}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-tactical-100 truncate">
                {teamTitle}
              </h4>
              <p className="text-[11px] font-mono text-tactical-400 truncate">
                {draft.formation.name} • <span className="capitalize">{draft.strategy}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            {isMatchFinished ? (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-tactical-900 border border-emerald-500/40 text-emerald-400 font-bold shadow-xs">
                Avg: {avgRating}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-tactical-400">
                11 Starting Players
              </span>
            )}
          </div>
        </div>

        {/* 2D Tactical Field with Set Players */}
        <div className="relative w-full aspect-[3/4] max-h-[500px] rounded-xl tactical-pitch-bg shadow-2xl overflow-hidden select-none border-2 border-pitch-line-solid/35">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line -translate-y-1/2 pointer-events-none" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Top Penalty Area (Opponent Box) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-16 border-b-2 border-x-2 border-pitch-line pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 border-b-2 border-x-2 border-pitch-line pointer-events-none" />

          {/* Bottom Penalty Area (Defending Box) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-16 border-t-2 border-x-2 border-pitch-line pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 border-t-2 border-x-2 border-pitch-line pointer-events-none" />

          {/* Direction indicator */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-pitch-line/90 uppercase tracking-wider font-semibold pointer-events-none">
            ↑ Attack
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-pitch-line/90 uppercase tracking-wider font-semibold pointer-events-none">
            Goal Line ↓
          </div>

          {/* Placed Set Players */}
          {draft.formation.slots.map((slot) => {
            const drafted = draft.draftedSlots[slot.id];
            if (!drafted) return null;
            const player = drafted.player;
            const ratingInfo = ratingMap.get(player.id);

            return (
              <div
                key={slot.id}
                style={{
                  left: `${slot.coordinates.x}%`,
                  top: `${slot.coordinates.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none z-20 group"
                title={`${player.name} (${drafted.assignedPosition}) - Historical OVR: ${player.ovr}${
                  isMatchFinished && ratingInfo ? ` | Match Rating: ${ratingInfo.rating.toFixed(1)}/10` : ''
                }`}
              >
                {/* Round Player Token */}
                <div
                  className={`relative flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 transition-transform duration-200 group-hover:scale-115 ${getRoleColors(
                    drafted.assignedPosition,
                    player.hasLegendSeal,
                    player.ovr
                  )}`}
                >
                  <span className="font-mono text-[9px] font-bold opacity-90 uppercase">
                    {drafted.assignedPosition}
                  </span>

                  <span className="font-mono font-black text-xs leading-none">
                    {isMatchFinished && ratingInfo ? (
                      <span className={getRatingBadgeClass(ratingInfo.rating)}>
                        {ratingInfo.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className={getOvrColorClass(player.ovr)}>{player.ovr}</span>
                    )}
                  </span>

                  {/* Legend Seal Star */}
                  {player.hasLegendSeal && (
                    <Award
                      className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${
                        player.ovr >= 95
                          ? 'text-amber-300 fill-amber-300/40 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                          : 'text-gold-400 fill-gold-500/30'
                      }`}
                    />
                  )}

                  {/* Live Goal Badge */}
                  {ratingInfo && ratingInfo.stats.goals > 0 && (
                    <span
                      className="absolute -top-1.5 -left-1.5 px-1 py-0.2 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono text-[8px] font-black shadow-md"
                      title={`${ratingInfo.stats.goals} Goal(s)`}
                    >
                      ⚽{ratingInfo.stats.goals > 1 ? `x${ratingInfo.stats.goals}` : ''}
                    </span>
                  )}

                  {/* Live Save Badge */}
                  {ratingInfo && ratingInfo.stats.saves > 0 && (
                    <span
                      className="absolute -top-1.5 -left-1.5 px-1 py-0.2 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[8px] font-black shadow-md"
                      title={`${ratingInfo.stats.saves} Save(s)`}
                    >
                      🧤{ratingInfo.stats.saves > 1 ? `x${ratingInfo.stats.saves}` : ''}
                    </span>
                  )}

                  {/* Yellow Card */}
                  {ratingInfo && ratingInfo.stats.yellowCard && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-3 h-4 bg-yellow-400 rounded-xs border border-yellow-200 shadow-md flex items-center justify-center text-[7px] font-mono text-yellow-950 font-black"
                      title="Yellow Card"
                    >
                      !
                    </span>
                  )}

                  {/* Red Card */}
                  {ratingInfo && ratingInfo.stats.redCard && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-3 h-4 bg-red-500 rounded-xs border border-red-200 shadow-md flex items-center justify-center text-[7px] font-mono text-white font-black"
                      title="Red Card"
                    >
                      ✕
                    </span>
                  )}

                  {/* Star of Match Indicator */}
                  {isMatchFinished && ratingInfo && ratingInfo.isStarOfMatch && (
                    <span
                      className="absolute -bottom-1 -right-1 text-gold-400 text-xs font-black animate-pulse drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]"
                      title="Star of the Match"
                    >
                      ★
                    </span>
                  )}
                </div>

                {/* Player Name Pill */}
                <div
                  className={`mt-1 px-1.5 py-0.5 rounded text-center max-w-[80px] sm:max-w-[95px] truncate transition-all shadow-md ${
                    isMatchFinished && ratingInfo?.isStarOfMatch
                      ? 'bg-amber-950/95 border border-gold-400/80 text-gold-300 font-bold text-[9px] sm:text-[10px]'
                      : 'bg-tactical-950/90 border border-tactical-700/80 text-tactical-100 text-[9px] sm:text-[10px] font-medium'
                  }`}
                >
                  <span className="truncate block">
                    #{player.squadNumber} {player.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-200 hover:text-tactical-100 border border-tactical-700 text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Simulation</span>
          </button>

          <div>
            <h3 className="text-base font-bold text-tactical-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-pitch-accent" />
              <span>Tactical Lineups & Formations</span>
            </h3>
            <p className="text-xs text-tactical-400">
              {isMatchFinished
                ? 'Full-time performance ratings on both tactical pitches'
                : 'Both teams set on their tactical pitches in real time'}
            </p>
          </div>
        </div>

        {/* Status / Averages */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          {isMatchFinished && ratingsData?.starOfMatch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-400/15 border border-gold-400/40 text-gold-300 font-bold">
              ★ Star: {ratingsData.starOfMatch.name} ({ratingsData.starOfMatch.rating.toFixed(1)})
            </span>
          )}



          {isMatchFinished ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-tactical-900 border border-tactical-750">
              <span className="text-tactical-300">
                {hostName}: <strong className="text-emerald-400">{hostAvgRating}</strong>
              </span>
              <span className="text-tactical-600">•</span>
              <span className="text-tactical-300">
                {guestName}: <strong className="text-emerald-400">{guestAvgRating}</strong>
              </span>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded bg-tactical-900 border border-tactical-750 text-tactical-400 font-semibold">
              Live Simulation In Progress
            </span>
          )}

          {/* Mobile view switcher */}
          <div className="lg:hidden flex items-center gap-1 bg-tactical-900 p-0.5 rounded border border-tactical-750">
            <button
              onClick={() => setMobilePitchView('both')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mobilePitchView === 'both' ? 'bg-tactical-700 text-tactical-100' : 'text-tactical-400'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setMobilePitchView('host')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mobilePitchView === 'host' ? 'bg-tactical-700 text-tactical-100' : 'text-tactical-400'
              }`}
            >
              Host
            </button>
            <button
              onClick={() => setMobilePitchView('guest')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mobilePitchView === 'guest' ? 'bg-tactical-700 text-tactical-100' : 'text-tactical-400'
              }`}
            >
              Guest
            </button>
          </div>
        </div>
      </div>

      {/* Both Pitches Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Host Pitch */}
        <div className={mobilePitchView === 'guest' ? 'hidden lg:block' : 'block'}>
          {renderTeamPitch(
            'host',
            hostDraft,
            hostRatingMap,
            hostAvgRating
          )}
        </div>

        {/* Guest Pitch */}
        {guestDraft && (
          <div className={mobilePitchView === 'host' ? 'hidden lg:block' : 'block'}>
            {renderTeamPitch(
              'guest',
              guestDraft,
              guestRatingMap,
              guestAvgRating
            )}
          </div>
        )}
      </div>

      {/* Roster Breakdown Toggle Table */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-tactical-700/70">
          <button
            onClick={() => setShowRosterTable(!showRosterTable)}
            className="flex items-center gap-2 text-xs font-bold text-tactical-200 hover:text-tactical-100"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>
              {isMatchFinished ? 'Player Ratings & Stats Table' : '22 Starting Players Table'}
            </span>
            <span className="text-[11px] text-tactical-500 font-mono">
              ({showRosterTable ? 'Hide' : 'Show'})
            </span>
          </button>
        </div>

        {showRosterTable && ratingsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Host Squad Rows */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded bg-tactical-900 border border-tactical-750">
                <span className="text-tactical-100 font-bold truncate">
                  {hostName} ({hostDraft.formation.name})
                </span>
                <span className="text-tactical-400 font-mono text-[11px]">
                  {isMatchFinished ? (
                    <>
                      Avg: <strong className="text-emerald-400">{hostAvgRating}</strong>
                    </>
                  ) : (
                    hostDraft.strategy
                  )}
                </span>
              </div>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {ratingsData.hostRatings.map((r) => renderPlayerRow(r, isMatchFinished))}
              </div>
            </div>

            {/* Guest Squad Rows */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded bg-tactical-900 border border-tactical-750">
                <span className="text-tactical-100 font-bold truncate">
                  {guestName} ({guestDraft?.formation.name || '4-3-3'})
                </span>
                <span className="text-tactical-400 font-mono text-[11px]">
                  {isMatchFinished ? (
                    <>
                      Avg: <strong className="text-emerald-400">{guestAvgRating}</strong>
                    </>
                  ) : (
                    guestDraft?.strategy || 'balanced'
                  )}
                </span>
              </div>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {ratingsData.guestRatings.map((r) => renderPlayerRow(r, isMatchFinished))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

