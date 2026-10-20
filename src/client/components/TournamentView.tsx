import React, { useState } from 'react';
import {
  FormationDefinition,
  PoolType,
  TournamentDraftMode,
  TournamentMatchFixture,
  TournamentState,
} from '../../shared/types/index.js';
import { tournamentService } from '../services/tournamentService.js';
import {
  Trophy,
  ArrowRight,
  Shield,
  Clock,
  Check,
  ChevronRight,
  Flame,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';

interface TournamentViewProps {
  onStartTournamentMatch: (tournament: TournamentState, matchFixture: TournamentMatchFixture) => void;
  onBackToLobby: () => void;
  formations: FormationDefinition[];
  defaultFormationId: string;
}

export const TournamentView: React.FC<TournamentViewProps> = ({
  onStartTournamentMatch,
  onBackToLobby,
  formations,
  defaultFormationId,
}) => {
  const [tournament, setTournament] = useState<TournamentState | null>(() =>
    tournamentService.getActiveTournament()
  );

  // Setup Wizard State (when starting a new tournament)
  const [poolType, setPoolType] = useState<PoolType>('national');
  const [draftMode, setDraftMode] = useState<TournamentDraftMode>('campaign');
  const [matchDurationSec, setMatchDurationSec] = useState<number>(180); // Default 3 min for Manager Mode
  const [teamName, setTeamName] = useState('My Dream XI');
  const [formationId, setFormationId] = useState(defaultFormationId || '4-3-3');
  const [viewingGroup, setViewingGroup] = useState<string>('A');

  const handleCreateTournament = () => {
    const newTourney = tournamentService.startTournament({
      poolType,
      draftMode,
      matchDurationSec,
      userName: teamName,
      userFormationId: formationId,
    });
    setTournament(newTourney);
  };

  const handleAbandon = () => {
    if (window.confirm('Are you sure you want to abandon the current tournament? Your progress will be lost.')) {
      tournamentService.abandonTournament();
      setTournament(null);
    }
  };

  const nextMatch = tournament ? tournamentService.getCurrentUserMatch() : null;

  const getRoundLabel = (round: string) => {
    switch (round) {
      case 'group_match_1':
        return 'Round 1/7: Group Match 1';
      case 'group_match_2':
        return 'Round 2/7: Group Match 2';
      case 'group_match_3':
        return 'Round 3/7: Group Match 3';
      case 'round_of_16':
        return 'Round 4/7: Round of 16';
      case 'quarter_finals':
        return 'Round 5/7: Quarter-Finals';
      case 'semi_finals':
        return 'Round 6/7: Semi-Finals';
      case 'final':
        return 'Round 7/7: World Cup Grand Final 🏆';
      case 'completed':
        return 'Tournament Completed';
      default:
        return round;
    }
  };

  // If no tournament is currently active, show the Tournament Creation Wizard
  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-tactical-900 via-tactical-850 to-tactical-900 border border-gold-900/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  7-Match World Cup Campaign
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30">
                  100% Offline
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-tactical-100 tracking-tight flex items-center gap-2">
                <span>World Championship Tournament</span>
                <Trophy className="w-6 h-6 text-gold-400 inline" />
              </h1>
              <p className="text-xs sm:text-sm text-tactical-300 mt-1 max-w-xl leading-relaxed">
                Experience the authentic World Cup format: 32 teams across 8 groups. Battle through 3 intense group matches,
                survive the Round of 16, Quarter-Finals, and Semi-Finals, and lift the trophy in the Grand Final!
              </p>
            </div>

            <button
              onClick={onBackToLobby}
              className="px-4 py-2 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 text-xs font-semibold border border-tactical-600 transition-colors"
            >
              Back to Quick Play
            </button>
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-6 shadow-xl space-y-6">
          {/* 1. Pool Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              1. Competition Pool
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPoolType('national')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  poolType === 'national'
                    ? 'bg-tactical-800 border-pitch-accent ring-2 ring-pitch-accent/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="text-xl mb-1">🌍</div>
                <div className="font-bold text-sm text-tactical-100">World Cup Nations</div>
                <div className="text-[11px] text-tactical-400 mt-1">
                  Draft from 190 authentic World Cup squads spanning 1930 to 2026.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPoolType('club')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  poolType === 'club'
                    ? 'bg-tactical-800 border-pitch-accent ring-2 ring-pitch-accent/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="text-xl mb-1">🛡️</div>
                <div className="font-bold text-sm text-tactical-100">Classic Club Eras</div>
                <div className="text-[11px] text-tactical-400 mt-1">
                  Draft from iconic club dynasties (e.g. Barcelona 2011, Real Madrid 2017).
                </div>
              </button>
            </div>
          </div>

          {/* 2. Draft Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              2. Tournament Drafting Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftMode('campaign');
                  if (matchDurationSec === 90 || matchDurationSec === 45) {
                    setMatchDurationSec(180); // Auto-suggest 3 min for manager mode
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  draftMode === 'campaign'
                    ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-gold-400">
                  <Award className="w-4 h-4" />
                  <span>Campaign Manager Mode (Recommended)</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  Draft your starting XI <strong>once</strong> at the start. Build tactical synergy, customize player roles,
                  and lead your chosen squad through all 7 tournament fixtures!
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDraftMode('dynamic');
                  setMatchDurationSec(90);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  draftMode === 'dynamic'
                    ? 'bg-tactical-800 border-pitch-accent ring-2 ring-pitch-accent/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-pitch-accent">
                  <RotateCcw className="w-4 h-4" />
                  <span>Dynamic Round-by-Round Draft</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  Draft a fresh, tailored 11-player squad <strong>before every match</strong> to counter each specific opponent's
                  strengths and weaknesses.
                </div>
              </button>
            </div>
          </div>

          {/* 3. Match Simulation Duration (Adjustable as requested) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-pitch-accent" />
                <span>3. Match Simulation Length</span>
              </label>
              <span className="text-[10px] text-tactical-400 font-mono">
                Real seconds per match
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { sec: 45, label: '45s Blitz', desc: 'Fast highlights' },
                { sec: 90, label: '90s Classic', desc: '1 sec = 1 min' },
                { sec: 180, label: '3 Minutes (180s)', desc: 'Manager decisions' },
                { sec: 240, label: '4 Minutes (240s)', desc: 'Deep tactical pace' },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => setMatchDurationSec(opt.sec)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    matchDurationSec === opt.sec
                      ? 'bg-tactical-750 border-pitch-accent text-tactical-100 ring-2 ring-pitch-accent/30'
                      : 'bg-tactical-900 border-tactical-750 text-tactical-400 hover:text-tactical-200'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-tactical-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Team Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
                Manager Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={24}
                className="w-full bg-tactical-800 border border-tactical-700 rounded-lg px-3 py-2 text-xs font-bold text-tactical-100 focus:border-pitch-accent focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
                Base Tactical Formation
              </label>
              <select
                value={formationId}
                onChange={(e) => setFormationId(e.target.value)}
                className="w-full bg-tactical-800 border border-tactical-700 rounded-lg px-3 py-2 text-xs font-bold text-tactical-100 focus:border-pitch-accent focus:outline-none"
              >
                {formations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleCreateTournament}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pitch-DEFAULT to-pitch-light hover:brightness-110 text-tactical-100 font-extrabold text-sm border border-pitch-line shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Trophy className="w-5 h-5 text-gold-400" />
            <span>Launch World Championship Campaign (7 Matches)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // Active Tournament Hub View
  const groupA = tournament.groups.find((g) => g.id === 'A')!;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Active Tournament Header */}
      <div className="bg-tactical-850 border border-tactical-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                {tournament.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-pitch-accent bg-tactical-800 border border-tactical-700">
                ⏱️ {tournament.matchDurationSec}s per match
              </span>
            </div>

            <h1 className="text-2xl font-black text-tactical-100 tracking-tight flex items-center gap-2">
              <span>{getRoundLabel(tournament.currentRound)}</span>
            </h1>

            <div className="text-xs text-tactical-300 mt-1">
              Playing as: <strong>{tournament.userTeam.name}</strong> • Mode:{' '}
              <span className="capitalize">{tournament.draftMode}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAbandon}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/40 transition-colors"
            >
              Abandon
            </button>
            <button
              onClick={onBackToLobby}
              className="px-3 py-1.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 text-xs font-semibold border border-tactical-600 transition-colors"
            >
              Lobby
            </button>
          </div>
        </div>
      </div>

      {/* Champion Victory Screen if won */}
      {tournament.currentRound === 'completed' && tournament.champion?.isUser && (
        <div className="bg-gradient-to-b from-amber-950/80 via-tactical-900 to-tactical-950 border-2 border-gold-500 rounded-2xl p-8 text-center shadow-2xl space-y-4 animate-fade-in">
          <div className="text-6xl animate-bounce">🏆</div>
          <h2 className="text-3xl font-black text-gold-400 tracking-wide uppercase">
            WORLD CHAMPIONS!
          </h2>
          <p className="text-sm text-tactical-200 max-w-md mx-auto">
            Sensational campaign! You defeated all opponents and lifted the World Championship Trophy!
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                tournamentService.abandonTournament();
                setTournament(null);
              }}
              className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-tactical-950 font-black text-sm shadow-xl transition-all"
            >
              Claim Trophy & Start New Tournament
            </button>
          </div>
        </div>
      )}

      {/* Eliminated Screen if lost in knockouts or missed group qualification */}
      {tournament.isEliminated && (
        <div className="bg-tactical-900 border border-rose-900/50 rounded-2xl p-6 text-center space-y-3">
          <div className="text-4xl">💔</div>
          <h3 className="text-xl font-bold text-rose-400">Campaign Ended</h3>
          <p className="text-xs text-tactical-300 max-w-md mx-auto">
            Your team was eliminated from the tournament. Review your career statistics in the profile and try again!
          </p>
          <button
            onClick={() => {
              tournamentService.abandonTournament();
              setTournament(null);
            }}
            className="px-5 py-2.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-100 text-xs font-bold border border-tactical-600"
          >
            Start New Campaign
          </button>
        </div>
      )}

      {/* NEXT FIXTURE CTA CARD */}
      {!tournament.isEliminated && tournament.currentRound !== 'completed' && nextMatch && (
        <div className="bg-tactical-850 border border-pitch-line/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-pitch-accent uppercase tracking-wider">
            <span>Next Scheduled Fixture</span>
            <span>{getRoundLabel(tournament.currentRound)}</span>
          </div>

          <div className="grid grid-cols-3 items-center py-4 bg-tactical-900 rounded-xl px-4 border border-tactical-750">
            {/* Home Team */}
            <div className="text-center sm:text-left">
              <div className="text-sm sm:text-base font-black text-tactical-100 truncate">
                {nextMatch.homeTeam.name}
              </div>
              <div className="text-[11px] text-tactical-400">
                {nextMatch.homeTeam.isUser ? '⭐️ Your Manager XI' : `Formation: ${nextMatch.homeTeam.formationId}`}
              </div>
            </div>

            {/* VS */}
            <div className="text-center font-black text-xs text-gold-400">
              VS
            </div>

            {/* Away Team */}
            <div className="text-center sm:text-right">
              <div className="text-sm sm:text-base font-black text-tactical-100 truncate">
                {nextMatch.awayTeam.name}
              </div>
              <div className="text-[11px] text-tactical-400">
                {nextMatch.awayTeam.isUser ? '⭐️ Your Manager XI' : `Formation: ${nextMatch.awayTeam.formationId}`}
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTournamentMatch(tournament, nextMatch)}
            className="w-full py-4 rounded-xl bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-extrabold text-sm border border-pitch-line shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <span>{tournament.draftMode === 'dynamic' ? 'Draft XI & Play Fixture' : 'Enter Match & Tactical Dugout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GROUP STAGE STANDINGS TABLE (During Group Stages) */}
      {tournament.currentRound.startsWith('group_match_') && (
        <div className="bg-tactical-850 border border-tactical-700 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-tactical-200 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-pitch-accent" />
              <span>Group A Standings (Top 2 Advance to Round of 16)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-tactical-700 text-[10px] text-tactical-400 uppercase tracking-wider">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Team</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">D</th>
                  <th className="py-2 px-2 text-center">L</th>
                  <th className="py-2 px-2 text-center">GD</th>
                  <th className="py-2 px-2 text-center font-bold text-tactical-100">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tactical-750">
                {groupA.teams.map((team, idx) => {
                  const isTop2 = idx < 2;
                  return (
                    <tr
                      key={team.id}
                      className={`${team.isUser ? 'bg-pitch-DEFAULT/15 font-bold' : ''}`}
                    >
                      <td className="py-2.5 px-2 font-mono">
                        <span
                          className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                            isTop2 ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60' : 'text-tactical-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-tactical-100 truncate max-w-[160px]">
                        {team.name} {team.isUser && '(You)'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-tactical-300">
                        {team.groupStats.played}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-tactical-300">
                        {team.groupStats.won}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-tactical-300">
                        {team.groupStats.drawn}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-tactical-300">
                        {team.groupStats.lost}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-tactical-300">
                        {team.groupStats.goalDifference > 0 ? `+${team.groupStats.goalDifference}` : team.groupStats.goalDifference}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-black text-tactical-100">
                        {team.groupStats.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KNOCKOUT BRACKET VIEW (During Knockouts) */}
      {!tournament.currentRound.startsWith('group_match_') && (
        <div className="bg-tactical-850 border border-tactical-700 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-bold text-tactical-200 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-gold-400" />
            <span>Knockout Bracket Tree</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Round of 16 Matchups */}
            <div className="space-y-2">
              <div className="font-bold text-[10px] uppercase text-tactical-400">
                Round of 16 ({tournament.knockoutFixtures.roundOf16.length})
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {tournament.knockoutFixtures.roundOf16.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded border text-[11px] ${
                      m.isUserMatch ? 'bg-pitch-DEFAULT/20 border-pitch-accent/80' : 'bg-tactical-900 border-tactical-750'
                    }`}
                  >
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.homeTeam.name}</span>
                      <span className="font-mono">{m.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.awayTeam.name}</span>
                      <span className="font-mono">{m.awayScore ?? '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarter-Finals */}
            <div className="space-y-2">
              <div className="font-bold text-[10px] uppercase text-tactical-400">
                Quarter-Finals ({tournament.knockoutFixtures.quarterFinals.length})
              </div>
              <div className="space-y-1.5">
                {tournament.knockoutFixtures.quarterFinals.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded border text-[11px] ${
                      m.isUserMatch ? 'bg-pitch-DEFAULT/20 border-pitch-accent/80' : 'bg-tactical-900 border-tactical-750'
                    }`}
                  >
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.homeTeam.name}</span>
                      <span className="font-mono">{m.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.awayTeam.name}</span>
                      <span className="font-mono">{m.awayScore ?? '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semi-Finals & Final */}
            <div className="space-y-2">
              <div className="font-bold text-[10px] uppercase text-tactical-400">
                Semis & Grand Final
              </div>
              <div className="space-y-1.5">
                {tournament.knockoutFixtures.semiFinals.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded border text-[11px] ${
                      m.isUserMatch ? 'bg-pitch-DEFAULT/20 border-pitch-accent/80' : 'bg-tactical-900 border-tactical-750'
                    }`}
                  >
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.homeTeam.name}</span>
                      <span className="font-mono">{m.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="truncate">{m.awayTeam.name}</span>
                      <span className="font-mono">{m.awayScore ?? '-'}</span>
                    </div>
                  </div>
                ))}

                {tournament.knockoutFixtures.final && (
                  <div className="p-2 rounded border border-gold-500/80 bg-amber-950/40 text-[11px]">
                    <div className="text-[10px] font-bold text-gold-400 uppercase">🏆 Grand Final</div>
                    <div className="flex justify-between truncate">
                      <span className="truncate font-bold">{tournament.knockoutFixtures.final.homeTeam.name}</span>
                      <span className="font-mono font-bold">{tournament.knockoutFixtures.final.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="truncate font-bold">{tournament.knockoutFixtures.final.awayTeam.name}</span>
                      <span className="font-mono font-bold">{tournament.knockoutFixtures.final.awayScore ?? '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
