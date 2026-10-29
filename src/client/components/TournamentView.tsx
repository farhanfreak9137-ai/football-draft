import React, { useState, useEffect } from 'react';
import {
  FormationDefinition,
  PoolType,
  TournamentDraftMode,
  TournamentMatchFixture,
  TournamentState,
} from '../../shared/types/index.js';
import { tournamentService } from '../services/tournamentService.js';
import { TournamentEngine } from '../../shared/engine/tournamentEngine.js';
import {
  Trophy,
  ArrowRight,
  Shield,
  Clock,
  Check,
  RotateCcw,
  Sparkles,
  Award,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface TournamentViewProps {
  activeTournament?: TournamentState | null;
  onStartTournamentMatch: (tournament: TournamentState, matchFixture: TournamentMatchFixture) => void;
  onBackToLobby: () => void;
  formations: FormationDefinition[];
  defaultFormationId: string;
}

interface TournamentStatsSectionProps {
  tournament: TournamentState;
  statsView: 'scorers' | 'assists' | 'squad';
  setStatsView: (v: 'scorers' | 'assists' | 'squad') => void;
}

const TournamentStatsSection: React.FC<TournamentStatsSectionProps> = ({
  tournament,
  statsView,
  setStatsView,
}) => {
  const allStats = Object.values(tournament.playerStats || {});
  const topScorers = [...allStats]
    .filter((s) => s.goals > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 15);

  const topAssisters = [...allStats]
    .filter((s) => s.assists > 0)
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
    .slice(0, 15);

  const squadStats = [...allStats]
    .filter((s) => s.isUserPlayer)
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists) || b.goals - a.goals);

  const awards = tournament.awards;

  return (
    <div className="bg-tactical-850 border border-tactical-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-tactical-750 pb-4">
        <div>
          <h2 className="text-lg font-black text-tactical-100 uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            <span>Tournament Statistics & Honours</span>
          </h2>
          <p className="text-xs text-tactical-400 mt-0.5">
            Full player-level records across all 32 World Cup teams and simulated matches
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-tactical-900 p-1 rounded-xl border border-tactical-750 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatsView('scorers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statsView === 'scorers'
                ? 'bg-gold-500 text-tactical-950 shadow'
                : 'text-tactical-300 hover:text-tactical-100 hover:bg-tactical-800'
            }`}
          >
            <span>⚽ Top Scorers</span>
          </button>
          <button
            type="button"
            onClick={() => setStatsView('assists')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statsView === 'assists'
                ? 'bg-emerald-500 text-tactical-950 shadow'
                : 'text-tactical-300 hover:text-tactical-100 hover:bg-tactical-800'
            }`}
          >
            <span>🎯 Top Assists</span>
          </button>
          <button
            type="button"
            onClick={() => setStatsView('squad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statsView === 'squad'
                ? 'bg-pitch-accent text-tactical-950 shadow'
                : 'text-tactical-300 hover:text-tactical-100 hover:bg-tactical-800'
            }`}
          >
            <span>⭐️ Your Squad</span>
          </button>
        </div>
      </div>

      {/* Honours Cards (Awards) */}
      {awards && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Golden Boot */}
          {awards.goldenBoot ? (
            <div className="bg-gradient-to-br from-amber-950/40 via-tactical-900 to-tactical-900 border border-gold-500/40 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1">
                  <span>🥇 Golden Boot Winner</span>
                </span>
                <span className="text-xl">⚽</span>
              </div>
              <div className="mt-2">
                <div className="text-sm font-black text-tactical-100 truncate flex items-center gap-1.5">
                  <span className="truncate">{awards.goldenBoot.playerName}</span>
                  {awards.goldenBoot.isUserPlayer && (
                    <span className="px-1.5 py-0.2 bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[9px] rounded font-mono font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-tactical-400 truncate">{awards.goldenBoot.teamName}</div>
                <div className="mt-2 text-xs font-bold text-gold-400 font-mono">
                  {awards.goldenBoot.goals} Goals{' '}
                  <span className="text-tactical-400 font-normal">({awards.goldenBoot.assists} ast)</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Top Playmaker */}
          {awards.topPlaymaker ? (
            <div className="bg-gradient-to-br from-emerald-950/40 via-tactical-900 to-tactical-900 border border-emerald-500/40 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span>👟 Top Playmaker</span>
                </span>
                <span className="text-xl">🎯</span>
              </div>
              <div className="mt-2">
                <div className="text-sm font-black text-tactical-100 truncate flex items-center gap-1.5">
                  <span className="truncate">{awards.topPlaymaker.playerName}</span>
                  {awards.topPlaymaker.isUserPlayer && (
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] rounded font-mono font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-tactical-400 truncate">{awards.topPlaymaker.teamName}</div>
                <div className="mt-2 text-xs font-bold text-emerald-400 font-mono">
                  {awards.topPlaymaker.assists} Assists{' '}
                  <span className="text-tactical-400 font-normal">({awards.topPlaymaker.goals} goals)</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Tournament MVP */}
          {awards.mvp ? (
            <div className="bg-gradient-to-br from-[#0A7075]/30 via-tactical-900 to-tactical-900 border border-[#0C969C]/50 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0C969C] uppercase tracking-wider flex items-center gap-1">
                  <span>⭐ Tournament MVP</span>
                </span>
                <span className="text-xl">🌟</span>
              </div>
              <div className="mt-2">
                <div className="text-sm font-black text-tactical-100 truncate flex items-center gap-1.5">
                  <span className="truncate">{awards.mvp.playerName}</span>
                  {awards.mvp.isUserPlayer && (
                    <span className="px-1.5 py-0.2 bg-[#0C969C]/20 text-[#0C969C] border border-[#0C969C]/40 text-[9px] rounded font-mono font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-tactical-400 truncate">{awards.mvp.teamName}</div>
                <div className="mt-2 text-xs font-bold text-[#0C969C] font-mono">
                  {awards.mvp.totalContributions} Contributions{' '}
                  <span className="text-tactical-400 font-normal">
                    ({awards.mvp.goals}G / {awards.mvp.assists}A)
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TABLE SECTION */}
      {statsView === 'scorers' && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
            <span>Golden Boot Race (Top Goalscorers)</span>
            <span className="text-[10px] text-tactical-500">{topScorers.length} players listed</span>
          </div>

          {topScorers.length === 0 ? (
            <div className="text-center py-6 text-xs text-tactical-500 bg-tactical-900/40 rounded-xl border border-tactical-800">
              No goals recorded yet. Play or simulate matches to see goalscorers!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-tactical-750">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-tactical-900/90 border-b border-tactical-750 text-[10px] text-tactical-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3 text-center">Pos</th>
                    <th className="py-2.5 px-3 text-center font-bold text-gold-400">Goals</th>
                    <th className="py-2.5 px-3 text-center font-mono">Assists</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tactical-800 bg-tactical-900/40">
                  {topScorers.map((player, idx) => (
                    <tr
                      key={player.playerId}
                      className={`transition-colors ${
                        player.isUserPlayer
                          ? 'bg-amber-950/30 text-tactical-100 font-bold border-l-2 border-l-gold-500'
                          : 'hover:bg-tactical-800/40 text-tactical-200'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono">
                        <span
                          className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-gold-500 text-tactical-950'
                              : idx === 1
                              ? 'bg-slate-300 text-tactical-950'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'text-tactical-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-tactical-100">{player.name}</span>
                          {player.isUserPlayer && (
                            <span className="px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 text-[9px] font-bold border border-gold-500/30">
                              ★ Manager XI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-tactical-300 truncate max-w-[160px]">
                        {player.teamName}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[10px] text-tactical-400">
                        {player.position || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-gold-400 text-sm">
                        {player.goals}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-tactical-300">
                        {player.assists}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {statsView === 'assists' && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
            <span>Playmakers Leaderboard (Top Assists)</span>
            <span className="text-[10px] text-tactical-500">{topAssisters.length} players listed</span>
          </div>

          {topAssisters.length === 0 ? (
            <div className="text-center py-6 text-xs text-tactical-500 bg-tactical-900/40 rounded-xl border border-tactical-800">
              No assists recorded yet. Play or simulate matches to see playmakers!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-tactical-750">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-tactical-900/90 border-b border-tactical-750 text-[10px] text-tactical-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3 text-center">Pos</th>
                    <th className="py-2.5 px-3 text-center font-bold text-emerald-400">Assists</th>
                    <th className="py-2.5 px-3 text-center font-mono">Goals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tactical-800 bg-tactical-900/40">
                  {topAssisters.map((player, idx) => (
                    <tr
                      key={player.playerId}
                      className={`transition-colors ${
                        player.isUserPlayer
                          ? 'bg-emerald-950/30 text-tactical-100 font-bold border-l-2 border-l-emerald-500'
                          : 'hover:bg-tactical-800/40 text-tactical-200'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono">
                        <span
                          className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-emerald-400 text-tactical-950'
                              : idx === 1
                              ? 'bg-slate-300 text-tactical-950'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'text-tactical-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-tactical-100">{player.name}</span>
                          {player.isUserPlayer && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                              ★ Manager XI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-tactical-300 truncate max-w-[160px]">
                        {player.teamName}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[10px] text-tactical-400">
                        {player.position || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-400 text-sm">
                        {player.assists}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-tactical-300">
                        {player.goals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {statsView === 'squad' && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
            <span>Your Squad Performance Breakdown</span>
            <span className="text-[10px] text-tactical-500">{tournament.userTeam.name}</span>
          </div>

          {squadStats.length === 0 ? (
            <div className="text-center py-6 text-xs text-tactical-500 bg-tactical-900/30 rounded-xl border border-tactical-800">
              Your squad has not recorded goals or assists yet in this campaign.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-tactical-750">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-tactical-900/90 border-b border-tactical-750 text-[10px] text-tactical-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3 text-center">Pos</th>
                    <th className="py-2.5 px-3 text-center font-bold text-gold-400">Goals</th>
                    <th className="py-2.5 px-3 text-center font-bold text-emerald-400">Assists</th>
                    <th className="py-2.5 px-3 text-center font-mono">Total G+A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tactical-800 bg-tactical-900/40">
                  {squadStats.map((p) => (
                    <tr key={p.playerId} className="hover:bg-tactical-800/40">
                      <td className="py-2.5 px-3 font-bold text-tactical-100 flex items-center gap-1.5">
                        <span>⭐</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-tactical-400">
                        {p.position || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-gold-400">
                        {p.goals}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                        {p.assists}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-tactical-100">
                        {p.goals + p.assists}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TournamentView: React.FC<TournamentViewProps> = ({
  activeTournament,
  onStartTournamentMatch,
  onBackToLobby,
  formations,
  defaultFormationId,
}) => {
  const [tournament, setTournament] = useState<TournamentState | null>(() =>
    activeTournament !== undefined ? activeTournament : tournamentService.getActiveTournament()
  );

  useEffect(() => {
    if (activeTournament !== undefined) {
      setTournament(activeTournament);
    }
  }, [activeTournament]);

  // Setup Wizard State (when starting a new tournament)
  const [poolType, setPoolType] = useState<PoolType>('national');
  const [draftMode, setDraftMode] = useState<TournamentDraftMode>('pack_roll');
  const [matchDurationSec, setMatchDurationSec] = useState<number>(180); // Default 3 min for Manager Mode
  const [teamName, setTeamName] = useState('My Dream XI');
  const [formationId, setFormationId] = useState(defaultFormationId || '4-3-3');
  const [showAllTourneyFormations, setShowAllTourneyFormations] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<string>('A');
  const [activeTab, setActiveTab] = useState<'matches' | 'stats'>('matches');
  const [statsView, setStatsView] = useState<'scorers' | 'assists' | 'squad'>('scorers');

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
              2. Squad Entry & Drafting Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Option 1: Pack Roll */}
              <button
                type="button"
                onClick={() => {
                  setDraftMode('pack_roll');
                  setMatchDurationSec(180);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  draftMode === 'pack_roll' || draftMode === 'campaign'
                    ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-gold-400">
                  <Award className="w-4 h-4" />
                  <span>🎲 Pack Roll Draft (1x)</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  Draft once before Game 1: roll historic team packs position-by-position with rerolls. Play all 7 matches with this squad!
                </div>
              </button>

              {/* Option 2: 5-Card Pick (FUT Style) */}
              <button
                type="button"
                onClick={() => {
                  setDraftMode('five_card');
                  setMatchDurationSec(180);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  draftMode === 'five_card'
                    ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-gold-400">
                  <Sparkles className="w-4 h-4" />
                  <span>🃏 5-Card Pick Draft (1x)</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  11 rounds: dealt 5 random player cards per position to choose from. Includes 2 wildcard redraws. Fast and tactical!
                </div>
              </button>

              {/* Option 3: Star Budget */}
              <button
                type="button"
                onClick={() => {
                  setDraftMode('star_budget');
                  setMatchDurationSec(180);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  draftMode === 'star_budget'
                    ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30 shadow-lg'
                    : 'bg-tactical-900 border-tactical-750 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-gold-400">
                  <Shield className="w-4 h-4" />
                  <span>⭐ Star Budget (1x)</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  100 Star Points budget. Pick any players from the database respecting the cap to craft your balanced dream squad.
                </div>
              </button>

              {/* Option 4: Dynamic Draft Every Match */}
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
                  <span>🔄 Draft Every Match</span>
                </div>
                <div className="text-[11px] text-tactical-300 mt-1 leading-relaxed">
                  Draft a fresh 11-player squad against the opponent before every single match in the tournament.
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
              <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider block">
                Base Tactical Formation
              </label>

              <div className="divide-y divide-tactical-800 rounded-xl overflow-hidden border border-tactical-800 bg-tactical-950">
                {(showAllTourneyFormations ? formations : formations.slice(0, 4)).map((f) => {
                  const isSelected = formationId === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setFormationId(f.id)}
                      className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-tactical-800 text-pitch-accent font-bold'
                          : 'hover:bg-tactical-850/80 text-tactical-200'
                      }`}
                    >
                      <span className="text-xs font-semibold">{f.name}</span>
                      {isSelected ? (
                        <span className="text-[11px] text-pitch-accent font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-tactical-500 font-mono">Select →</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {!showAllTourneyFormations ? (
                <button
                  type="button"
                  onClick={() => setShowAllTourneyFormations(true)}
                  className="w-full py-1.5 px-3 text-xs font-bold text-pitch-accent hover:text-pitch-light hover:bg-tactical-850 rounded-lg border border-dashed border-tactical-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Show More Formations ({formations.length - 4} more) ▾</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAllTourneyFormations(false)}
                  className="w-full py-1 text-center text-[11px] font-bold text-tactical-400 hover:text-tactical-200 hover:bg-tactical-850 rounded-lg transition-all"
                >
                  <span>Show Less ▴</span>
                </button>
              )}
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
  const currentGroup = tournament.groups.find((g) => g.id === viewingGroup) || tournament.groups[0];
  if (currentGroup && tournament.groupFixtures) {
    TournamentEngine.recalculateGroupStandings(currentGroup, tournament.groupFixtures);
  }

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

      {/* Mode Switcher Tabs for Active Campaign */}
      {!tournament.isEliminated && tournament.currentRound !== 'completed' && (
        <div className="flex items-center gap-2 border-b border-tactical-700/60 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-pitch-DEFAULT text-tactical-100 border border-pitch-line shadow-md'
                : 'bg-tactical-850 text-tactical-400 hover:text-tactical-200 border border-tactical-700'
            }`}
          >
            <Shield className="w-4 h-4 text-pitch-accent" />
            <span>Campaign Fixtures & Standings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-gold-500 text-tactical-950 border border-gold-400 shadow-md'
                : 'bg-tactical-850 text-tactical-400 hover:text-tactical-200 border border-tactical-700'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeTab === 'stats' ? 'text-tactical-950' : 'text-gold-400'}`} />
            <span>📊 Live Tournament Stats</span>
          </button>
        </div>
      )}

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
              Claim Gold Trophy & Start New Tournament
            </button>
          </div>
        </div>
      )}

      {/* Runner-Up Screen if reached final and finished 2nd */}
      {tournament.currentRound === 'completed' && tournament.runnerUp?.isUser && (
        <div className="bg-gradient-to-b from-slate-900 via-tactical-900 to-tactical-950 border-2 border-slate-400 rounded-2xl p-8 text-center shadow-2xl space-y-4 animate-fade-in">
          <div className="text-6xl animate-bounce">🥈</div>
          <h2 className="text-3xl font-black text-slate-200 tracking-wide uppercase">
            TOURNAMENT RUNNER-UP!
          </h2>
          <p className="text-sm text-tactical-200 max-w-md mx-auto">
            Incredible campaign reaching the Grand Final! You finished 2nd place and earned the Silver Runner-Up Medal.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                tournamentService.abandonTournament();
                setTournament(null);
              }}
              className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-white text-tactical-950 font-black text-sm shadow-xl transition-all"
            >
              Claim Silver Medal & Start New Tournament
            </button>
          </div>
        </div>
      )}

      {/* Eliminated Screen if lost in knockouts or missed group qualification (strictly NOT runner up) */}
      {tournament.isEliminated && !tournament.runnerUp?.isUser && (
        <div className="bg-tactical-900 border border-rose-900/50 rounded-2xl p-6 text-center space-y-3">
          <div className="text-4xl">💔</div>
          <h3 className="text-xl font-bold text-rose-400">Campaign Ended</h3>
          <p className="text-xs text-tactical-300 max-w-md mx-auto">
            Your team was eliminated from the tournament without a podium finish. Only Champions (1st) and Runners-Up (2nd) receive trophies. Review your career statistics in the profile and try again!
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

      {/* STATS & HONOURS SECTION UNDER COMPLETION CARDS */}
      {(tournament.isEliminated || tournament.currentRound === 'completed') && (
        <TournamentStatsSection
          tournament={tournament}
          statsView={statsView}
          setStatsView={setStatsView}
        />
      )}

      {/* STATS SECTION IN ACTIVE CAMPAIGN TAB */}
      {!tournament.isEliminated && tournament.currentRound !== 'completed' && activeTab === 'stats' && (
        <TournamentStatsSection
          tournament={tournament}
          statsView={statsView}
          setStatsView={setStatsView}
        />
      )}

      {/* MATCHES & FIXTURES CONTENT */}
      {!tournament.isEliminated && tournament.currentRound !== 'completed' && activeTab === 'matches' && (
        <>
          {/* NEXT FIXTURE CTA CARD */}
          {nextMatch && (
            <div className="bg-gradient-to-br from-tactical-850 via-tactical-900 to-tactical-950 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-pitch-accent uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Next Scheduled Fixture</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  {getRoundLabel(tournament.currentRound)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center py-5 bg-tactical-950/80 rounded-xl px-4 border border-tactical-750/80 shadow-inner">
                {/* Home Team */}
                <div className="text-center sm:text-left">
                  <div className="text-sm sm:text-lg font-black text-tactical-100 font-display truncate">
                    {nextMatch.homeTeam.name}
                  </div>
                  <div className="text-[11px] text-tactical-400 mt-0.5">
                    {nextMatch.homeTeam.isUser ? (
                      <span className="text-gold-400 font-bold">⭐ Your Manager XI</span>
                    ) : (
                      <span>Formation: {nextMatch.homeTeam.formationId}</span>
                    )}
                  </div>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-tactical-850 border border-gold-500/50 flex items-center justify-center font-black text-xs text-gold-400 shadow-md">
                    VS
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center sm:text-right">
                  <div className="text-sm sm:text-lg font-black text-tactical-100 font-display truncate">
                    {nextMatch.awayTeam.name}
                  </div>
                  <div className="text-[11px] text-tactical-400 mt-0.5">
                    {nextMatch.awayTeam.isUser ? (
                      <span className="text-gold-400 font-bold">⭐ Your Manager XI</span>
                    ) : (
                      <span>Formation: {nextMatch.awayTeam.formationId}</span>
                    )}
                  </div>
                </div>
              </div>

              {tournament.userSquad && (
                <div className="p-3 rounded-xl bg-tactical-900/80 border border-tactical-700/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-tactical-200">
                      Manager Squad Locked: <strong className="text-tactical-100">{tournament.userTeam.name}</strong> (11/11 Players)
                    </span>
                  </div>
                  <span className="text-gold-400 font-mono font-bold">Ready for Kickoff</span>
                </div>
              )}

              <button
                onClick={() => onStartTournamentMatch(tournament, nextMatch)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-tactical-950 font-black text-sm border border-emerald-300/80 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>
                  {tournament.draftMode === 'dynamic'
                    ? '🔄 Draft XI & Play Fixture'
                    : tournament.userSquad
                    ? '⚔️ Kick Off Match (Simulate Now)'
                    : '📋 Draft Your 11 Players for Campaign'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* GROUP STAGE STANDINGS TABLE (During Group Stages) */}
          {tournament.currentRound.startsWith('group_match_') && currentGroup && (
            <div className="bg-tactical-850 border border-tactical-700 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-tactical-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-pitch-accent" />
                  <span>Group {currentGroup.id} Standings (Top 2 Advance to Round of 16)</span>
                </h3>
                {/* Group Switcher Tabs (A through H) */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {tournament.groups.map((grp) => {
                    const isSelected = (viewingGroup || 'A') === grp.id;
                    const hasUser = grp.teams.some((t) => t.isUser);
                    return (
                      <button
                        key={grp.id}
                        onClick={() => setViewingGroup(grp.id)}
                        title={`View Group ${grp.id}${hasUser ? ' (Your Group)' : ''}`}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-pitch-DEFAULT text-tactical-100 border border-pitch-line shadow-sm'
                            : 'bg-tactical-800 text-tactical-400 hover:text-tactical-200 border border-tactical-700'
                        }`}
                      >
                        {grp.id}{hasUser ? ' ★' : ''}
                      </button>
                    );
                  })}
                </div>
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
                    {currentGroup.teams.map((team, idx) => {
                      const isTop2 = idx < 2;
                      return (
                        <tr
                          key={team.id}
                          className={`transition-colors ${
                            team.isUser
                              ? 'bg-[#032F30]/35 text-white font-bold border-l-2 border-l-[#0C969C]'
                              : isTop2
                              ? 'hover:bg-tactical-800/40 text-tactical-100'
                              : 'hover:bg-tactical-800/40 text-tactical-300'
                          }`}
                        >
                          <td className="py-2.5 px-2 font-mono">
                            <span
                              className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                                isTop2
                                  ? 'bg-[#0A7075] text-white border border-[#0C969C]/80 shadow-[0_0_8px_rgba(12,150,156,0.3)]'
                                  : 'bg-black/60 text-tactical-500 border border-tactical-800'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 truncate max-w-[170px]">
                            <span className={team.isUser ? 'text-[#6BA3BE] font-black' : 'text-tactical-100 font-semibold'}>
                              {team.name}
                            </span>
                            {team.isUser && (
                              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-[#0C969C]/20 text-[#6BA3BE] border border-[#0C969C]/40">
                                YOU
                              </span>
                            )}
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
                          <td className={`py-2.5 px-2 text-center font-mono font-bold ${
                            team.groupStats.goalDifference > 0
                              ? 'text-emerald-400'
                              : team.groupStats.goalDifference < 0
                              ? 'text-rose-400'
                              : 'text-tactical-400'
                          }`}>
                            {team.groupStats.goalDifference > 0 ? `+${team.groupStats.goalDifference}` : team.groupStats.goalDifference}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-black text-[#6BA3BE] text-sm">
                            {team.groupStats.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Group Completed Matches with Goalscorers */}
              {(() => {
                const groupMatches = tournament.groupFixtures.filter(
                  (f) => f.groupLetter === currentGroup.id && f.status === 'finished'
                );
                if (groupMatches.length === 0) return null;
                return (
                  <div className="pt-3 border-t border-tactical-750 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-tactical-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pitch-accent" />
                        <span>Group {currentGroup.id} Completed Fixtures & Scorers</span>
                      </div>
                      <span className="text-[10px] font-mono text-tactical-500">
                        {groupMatches.length} / 6 Matches Played
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                      {groupMatches.map((m) => {
                        const roundLabel =
                          m.round === 'group_match_1'
                            ? 'Matchday 1'
                            : m.round === 'group_match_2'
                            ? 'Matchday 2'
                            : 'Matchday 3';

                        return (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              m.isUserMatch
                                ? 'bg-[#032F30]/40 border-[#0C969C]/60 shadow-[0_0_12px_rgba(12,150,156,0.15)] ring-1 ring-[#0C969C]/30'
                                : 'bg-black/60 border-tactical-750 hover:border-tactical-600'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] font-mono text-tactical-400 mb-1 border-b border-tactical-800/60 pb-1">
                              <span className="font-bold text-tactical-300">{roundLabel}</span>
                              {m.isUserMatch && (
                                <span className="px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold">
                                  ★ Manager XI
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between font-bold text-tactical-100 my-1">
                              <span className="truncate max-w-[120px]">{m.homeTeam.name}</span>
                              <span className="font-mono px-2 py-0.5 rounded bg-black/80 border border-[#0C969C]/40 text-[#6BA3BE] font-black text-xs shadow-xs">
                                {m.homeScore} - {m.awayScore}
                              </span>
                              <span className="truncate max-w-[120px] text-right">{m.awayTeam.name}</span>
                            </div>
                            {m.goals && m.goals.length > 0 && (
                              <div className="text-[10px] text-tactical-400 space-y-0.5 pt-1 border-t border-tactical-800/80">
                                {m.goals.map((g, gi) => (
                                  <div key={gi} className="flex items-center justify-between truncate">
                                    <span className="truncate">
                                      ⚽ {g.scorerName} {g.assisterName ? `(ast: ${g.assisterName})` : ''}
                                    </span>
                                    <span className="font-mono text-tactical-500 text-[9px]">{g.minute}'</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* KNOCKOUT BRACKET VIEW (During Knockouts) */}
          {!tournament.currentRound.startsWith('group_match_') && (
            <div className="bg-tactical-850 border border-tactical-700/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-tactical-100 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold-400" />
                  <span>World Championship Knockout Bracket</span>
                </h3>
                <span className="text-[10px] font-mono text-tactical-400">Road to World Glory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Round of 16 Matchups */}
                <div className="space-y-2">
                  <div className="font-bold text-[10px] uppercase text-tactical-400 flex items-center justify-between">
                    <span>Round of 16</span>
                    <span className="font-mono text-tactical-500">{tournament.knockoutFixtures.roundOf16.length} ties</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {tournament.knockoutFixtures.roundOf16.map((m) => {
                      const isFinished = m.status === 'finished';
                      const homeWon = isFinished && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                      const awayWon = isFinished && (m.awayScore ?? 0) > (m.homeScore ?? 0);

                      return (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            m.isUserMatch
                              ? 'bg-emerald-950/30 border-emerald-500/70 shadow-sm border-l-4 border-l-emerald-400'
                              : 'bg-tactical-900/80 border-tactical-750'
                          }`}
                        >
                          <div className={`flex justify-between items-center truncate ${homeWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.homeTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.homeScore ?? '-'}</span>
                          </div>
                          <div className={`flex justify-between items-center truncate mt-1 ${awayWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.awayTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.awayScore ?? '-'}</span>
                          </div>
                          {m.goals && m.goals.length > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t border-tactical-800 text-[9px] text-tactical-400 space-y-0.5">
                              {m.goals.map((g, gi) => (
                                <div key={gi} className="flex items-center justify-between truncate">
                                  <span className="truncate">⚽ {g.scorerName}</span>
                                  <span className="font-mono text-tactical-500">{g.minute}'</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quarter-Finals */}
                <div className="space-y-2">
                  <div className="font-bold text-[10px] uppercase text-tactical-400 flex items-center justify-between">
                    <span>Quarter-Finals</span>
                    <span className="font-mono text-tactical-500">{tournament.knockoutFixtures.quarterFinals.length} ties</span>
                  </div>
                  <div className="space-y-2">
                    {tournament.knockoutFixtures.quarterFinals.map((m) => {
                      const isFinished = m.status === 'finished';
                      const homeWon = isFinished && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                      const awayWon = isFinished && (m.awayScore ?? 0) > (m.homeScore ?? 0);

                      return (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            m.isUserMatch
                              ? 'bg-emerald-950/30 border-emerald-500/70 shadow-sm border-l-4 border-l-emerald-400'
                              : 'bg-tactical-900/80 border-tactical-750'
                          }`}
                        >
                          <div className={`flex justify-between items-center truncate ${homeWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.homeTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.homeScore ?? '-'}</span>
                          </div>
                          <div className={`flex justify-between items-center truncate mt-1 ${awayWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.awayTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.awayScore ?? '-'}</span>
                          </div>
                          {m.goals && m.goals.length > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t border-tactical-800 text-[9px] text-tactical-400 space-y-0.5">
                              {m.goals.map((g, gi) => (
                                <div key={gi} className="flex items-center justify-between truncate">
                                  <span className="truncate">⚽ {g.scorerName}</span>
                                  <span className="font-mono text-tactical-500">{g.minute}'</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Semi-Finals & Final */}
                <div className="space-y-2">
                  <div className="font-bold text-[10px] uppercase text-tactical-400 flex items-center justify-between">
                    <span>Semis & Grand Final</span>
                    <span className="font-mono text-gold-400 font-bold">🏆 Trophy Stage</span>
                  </div>
                  <div className="space-y-2">
                    {tournament.knockoutFixtures.semiFinals.map((m) => {
                      const isFinished = m.status === 'finished';
                      const homeWon = isFinished && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                      const awayWon = isFinished && (m.awayScore ?? 0) > (m.homeScore ?? 0);

                      return (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            m.isUserMatch
                              ? 'bg-emerald-950/30 border-emerald-500/70 shadow-sm border-l-4 border-l-emerald-400'
                              : 'bg-tactical-900/80 border-tactical-750'
                          }`}
                        >
                          <div className={`flex justify-between items-center truncate ${homeWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.homeTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.homeScore ?? '-'}</span>
                          </div>
                          <div className={`flex justify-between items-center truncate mt-1 ${awayWon ? 'font-bold text-tactical-100' : 'text-tactical-300'}`}>
                            <span className="truncate">{m.awayTeam.name}</span>
                            <span className="font-mono px-1.5 py-0.2 rounded bg-tactical-800 text-tactical-200 ml-2 shrink-0">{m.awayScore ?? '-'}</span>
                          </div>
                          {m.goals && m.goals.length > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t border-tactical-800 text-[9px] text-tactical-400 space-y-0.5">
                              {m.goals.map((g, gi) => (
                                <div key={gi} className="flex items-center justify-between truncate">
                                  <span className="truncate">⚽ {g.scorerName}</span>
                                  <span className="font-mono text-tactical-500">{g.minute}'</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {tournament.knockoutFixtures.final && (
                      <div className="p-3.5 rounded-xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-950/50 via-tactical-900 to-tactical-950 text-xs shadow-xl gold-glow relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Grand Final Podium</span>
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold">
                            FINAL
                          </span>
                        </div>
                        <div className="flex justify-between items-center truncate font-black text-tactical-100">
                          <span className="truncate text-sm">{tournament.knockoutFixtures.final.homeTeam.name}</span>
                          <span className="font-mono font-black text-sm px-2 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-gold-400">
                            {tournament.knockoutFixtures.final.homeScore ?? '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center truncate font-black text-tactical-100 mt-1.5">
                          <span className="truncate text-sm">{tournament.knockoutFixtures.final.awayTeam.name}</span>
                          <span className="font-mono font-black text-sm px-2 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-gold-400">
                            {tournament.knockoutFixtures.final.awayScore ?? '-'}
                          </span>
                        </div>
                        {tournament.knockoutFixtures.final.goals && tournament.knockoutFixtures.final.goals.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-amber-500/20 text-[10px] text-tactical-300 space-y-0.5">
                            {tournament.knockoutFixtures.final.goals.map((g, gi) => (
                              <div key={gi} className="flex items-center justify-between truncate">
                                <span className="truncate">⚽ {g.scorerName}</span>
                                <span className="font-mono text-tactical-400">{g.minute}'</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

