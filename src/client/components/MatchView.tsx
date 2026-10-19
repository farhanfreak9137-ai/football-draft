import React, { useEffect, useRef, useState } from 'react';
import { MatchEvent, MatchSimulationState, PenaltyKickResult, PlayerDraftState } from '../../shared/types/index.js';
import { soundManager } from '../utils/audio.js';
import { messages } from '../i18n/messages.js';
import { getVisualMinute } from '../../shared/engine/matchEngine.js';
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
} from 'lucide-react';

interface MatchViewProps {
  liveMatch: MatchSimulationState;
  hostDraft: PlayerDraftState;
  guestDraft?: PlayerDraftState;
  onExitMatch: () => void;
}

export const MatchView: React.FC<MatchViewProps> = ({
  liveMatch,
  hostDraft,
  guestDraft,
  onExitMatch,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);
  const eventFeedRef = useRef<HTMLDivElement>(null);
  const prevEventsLength = useRef(liveMatch.events.length);

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

  const visualMinute = getVisualMinute(liveMatch.currentSecond);
  const maxVisualMinute = liveMatch.totalDurationSeconds > 45 ? 120 : 90;

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

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Banner: Scoreboard & Real-time Authoritative Clock */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-tactical-700/60 text-xs text-tactical-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-pitch-accent" />
            <span className="font-mono text-tactical-200 font-bold text-sm">
              {visualMinute}'
            </span>
            <span className="text-tactical-400 text-[11px]">/ {maxVisualMinute}' Match Time ({liveMatch.currentSecond}s Sim)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div>{getStatusBadge()}</div>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
              liveMatch.knockoutMode
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                : 'bg-pitch-DEFAULT/20 text-pitch-accent border-pitch-line/50'
            }`}>
              {liveMatch.knockoutMode ? '🏆 Cup Knockout (ET & Penalties)' : '⚽ League Match (Draws Allowed)'}
            </span>
          </div>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-xs text-tactical-300 hover:text-tactical-100 px-2 py-1 rounded bg-tactical-800 border border-tactical-700"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-3 items-center py-4 text-center">
          {/* Host */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-tactical-800 border border-tactical-600 flex items-center justify-center font-bold text-tactical-200 mb-2">
              H
            </div>
            <h2 className="font-bold text-base sm:text-lg text-tactical-100 truncate max-w-[180px]">
              {hostName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-tactical-400 font-mono mt-1">
              <span>{hostDraft.formation.name}</span>
              <span>•</span>
              <span className="capitalize">{hostDraft.strategy}</span>
            </div>
          </div>

          {/* Central Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-4xl sm:text-5xl font-black text-tactical-100 tracking-tight flex items-center gap-3">
              <span>{liveMatch.score.host}</span>
              <span className="text-tactical-500 font-light text-3xl">-</span>
              <span>{liveMatch.score.guest}</span>
            </div>
            {liveMatch.penaltyScore && (
              <div className="font-mono text-xs text-gold-400 mt-1">
                Penalties: {liveMatch.penaltyScore.host} - {liveMatch.penaltyScore.guest}
              </div>
            )}
          </div>

          {/* Guest */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-tactical-800 border border-tactical-600 flex items-center justify-center font-bold text-tactical-200 mb-2">
              G
            </div>
            <h2 className="font-bold text-base sm:text-lg text-tactical-100 truncate max-w-[180px]">
              {guestName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-tactical-400 font-mono mt-1">
              <span>{guestDraft?.formation.name || '4-3-3'}</span>
              <span>•</span>
              <span className="capitalize">{guestDraft?.strategy || 'balanced'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 2D Tactical Pitch & Authoritative Event Feed */}
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
            {/* Center line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-pitch-line/60 -translate-x-1/2"></div>
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-pitch-line/60 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-pitch-line/80 -translate-x-1/2 -translate-y-1/2"></div>
            {/* Penalty boxes */}
            <div className="absolute top-1/4 bottom-1/4 left-0 w-16 border-r-2 border-t-2 border-b-2 border-pitch-line/60"></div>
            <div className="absolute top-1/4 bottom-1/4 right-0 w-16 border-l-2 border-t-2 border-b-2 border-pitch-line/60"></div>

            {/* Goal boxes */}
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

            {/* Event Ripple if Goal or Magical Save */}
            {latestEvent && (latestEvent.type === 'goal' || latestEvent.type === 'save') && (
              <div
                className={`absolute w-12 h-12 rounded-full border-2 ${
                  latestEvent.type === 'goal' ? 'border-gold-400' : 'border-blue-400'
                } animate-ping -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
                style={{
                  left: `${ballPos.x}%`,
                  top: `${ballPos.y}%`,
                }}
              />
            )}

            {/* Team labels on pitch */}
            <div className="absolute top-3 left-3 text-[11px] font-mono text-pitch-line/90 uppercase tracking-wider font-bold">
              {hostName} (ATTACK →)
            </div>
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-pitch-line/90 uppercase tracking-wider font-bold">
              (← ATTACK) {guestName}
            </div>
          </div>

          {/* Active Highlight Banner */}
          <div className="mt-3 p-2.5 rounded bg-tactical-900 border border-tactical-700/60 text-xs text-tactical-200 flex items-center gap-2">
            <span className="font-mono text-pitch-accent font-bold">
              {latestEvent ? `${latestEvent.minute ?? latestEvent.second}'` : '0\''}
            </span>
            <span className="text-tactical-300">
              {latestEvent ? latestEvent.description : 'Match underway.'}
            </span>
          </div>
        </div>

        {/* Authoritative Highlight Feed (5 cols) */}
        <div className="lg:col-span-5 bg-tactical-850 border border-tactical-700/80 rounded-xl p-4 flex flex-col h-[380px] lg:h-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-tactical-700 text-xs">
            <span className="font-semibold text-tactical-200">Match Highlights ({liveMatch.events.length})</span>
            <span className="text-[11px] text-tactical-400 font-mono">Key Events Only</span>
          </div>

          <div ref={eventFeedRef} className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {liveMatch.events.length === 0 ? (
              <div className="text-tactical-500 text-center py-10 italic">Awaiting kickoff...</div>
            ) : (
              liveMatch.events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    ev.type === 'goal'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                      : ev.type === 'save'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-200'
                      : ev.type === 'red_card'
                      ? 'bg-red-500/15 border-red-500/50 text-red-200'
                      : ev.type === 'yellow_card'
                      ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-200'
                      : 'bg-tactical-900/60 border-tactical-750 text-tactical-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {ev.type === 'goal' && '⚽ GOAL!'}
                      {ev.type === 'save' && '🧤 MAGICAL SAVE'}
                      {ev.type === 'yellow_card' && '🟨 YELLOW CARD'}
                      {ev.type === 'red_card' && '🟥 RED CARD'}
                      {ev.type === 'kickoff' && '⏱ KICKOFF'}
                      {ev.type === 'halftime' && '⏱ HALF-TIME'}
                      {ev.type === 'fulltime' && '🏁 FULL-TIME'}
                      <span className="text-tactical-300">({ev.minute ?? ev.second}')</span>
                    </span>
                    <span className="text-tactical-400 font-bold">
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

      {/* Penalty Shootout Display (if penalties active or completed) */}
      {liveMatch.penalties && liveMatch.penalties.length > 0 && (
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

          {/* Side-by-side shootout columns */}
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
              Method: {liveMatch.winMethod ? liveMatch.winMethod.replace('_', ' ').toUpperCase() : 'REGULAR TIME'}
            </p>
          </div>

          <button
            onClick={onExitMatch}
            className="inline-flex items-center gap-2 bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-semibold px-6 py-2.5 rounded-lg text-sm border border-pitch-line active:scale-98 transition-all"
          >
            <span>{messages.match.playAgain}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

