import React, { useState, useMemo } from 'react';
import { profileService } from '../services/profileService.js';
import { offlineSoloEngine } from '../services/offlineSoloEngine.js';
import { ManagerProfile, TeamEdition } from '../../shared/types/index.js';
import { getOvrBadgeClass } from '../utils/ovrColor.js';
import { DreamTeamBuilderModal } from './DreamTeamBuilderModal.js';
import { getEditionCaliber } from '../utils/dreamTeamHelper.js';
import {
  X,
  Trophy,
  Award,
  Shield,
  Target,
  Flame,
  Check,
  Edit2,
  Calendar,
  Sparkles,
  Play,
  Trash2,
  Users,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayFriendlyMatch?: (opponentEditionId: string, durationSec: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onPlayFriendlyMatch }) => {
  const [profile, setProfile] = useState<ManagerProfile>(() => profileService.getProfile());
  const [activeTab, setActiveTab] = useState<'career' | 'dream_team'>('career');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.managerName);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji || '👔');

  // Friendly match state
  const [isExhibitionOpen, setIsExhibitionOpen] = useState(false);
  const [opponentSearch, setOpponentSearch] = useState('');
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>('');
  const [durationSec, setDurationSec] = useState<number>(90);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const allEditions = useMemo(() => offlineSoloEngine.getEditions(), []);
  const dreamTeamCaliber = profile.dreamTeam?.totalOvr || 88;

  const caliberMatchedEditions = useMemo(() => {
    const players = offlineSoloEngine.getPlayers();
    const matched = allEditions
      .map((ed) => ({
        edition: ed,
        caliber: getEditionCaliber(ed, players),
      }))
      .filter((item) => Math.abs(item.caliber - dreamTeamCaliber) <= 3)
      .sort((a, b) => b.caliber - a.caliber);
    return matched.length > 0 ? matched : allEditions.slice(0, 20).map((ed) => ({ edition: ed, caliber: 88 }));
  }, [allEditions, dreamTeamCaliber]);

  const EMOJI_OPTIONS = ['👔', '🧢', '🕶️', '⚽', '👑', '🦁', '⚡', '🦅', '🎯', '🔥'];

  if (!isOpen) return null;

  const handleSaveName = () => {
    const updated = profileService.updateManagerName(nameInput, selectedEmoji);
    setProfile(updated);
    setIsEditingName(false);
  };

  const handleDisbandDreamTeam = () => {
    if (window.confirm('Are you sure you want to disband your Dream Team?')) {
      const updated = profileService.clearDreamTeam();
      setProfile(updated);
    }
  };

  const handleLaunchExhibition = () => {
    if (!selectedOpponentId || !onPlayFriendlyMatch) return;
    onPlayFriendlyMatch(selectedOpponentId, durationSec);
    onClose();
  };

  const winRate =
    profile.stats.matchesPlayed > 0
      ? Math.round((profile.stats.wins / profile.stats.matchesPlayed) * 100)
      : 0;

  const nextLevelXp = profile.level * 300;
  const currentLevelXp = profile.xp % 300;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 300) * 100));

  const dreamTeamPlayers = profile.dreamTeam
    ? Object.values(profile.dreamTeam.draftedSlots).map((s) => s.player)
    : [];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-tactical-850 border border-tactical-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tactical-700 bg-tactical-900 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-400" />
            <h2 className="text-base font-bold text-tactical-100">Manager Office & Profile</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Profile"
            className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-tactical-750 bg-tactical-900/60 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('career')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'career'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-tactical-400 hover:text-tactical-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Career & Trophies</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dream_team')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'dream_team'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-tactical-400 hover:text-tactical-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>⭐ My Dream Team</span>
            {profile.dreamTeam && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-300 font-mono">
                {profile.dreamTeam.totalOvr} OVR
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'career' ? (
            <>
              {/* Manager Badge & XP Card */}
          <div className="p-4 rounded-xl bg-tactical-900 border border-tactical-750 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-4xl p-3 bg-tactical-800 rounded-2xl border border-tactical-700 shadow-inner">
              {profile.avatarEmoji}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              {isEditingName ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={24}
                      className="bg-tactical-800 border border-tactical-700 rounded px-2.5 py-1 text-sm text-tactical-100 font-bold focus:border-pitch-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-1.5 bg-pitch-DEFAULT hover:bg-pitch-light rounded text-tactical-100"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Emoji selector */}
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setSelectedEmoji(em)}
                        className={`text-sm p-1 rounded ${selectedEmoji === em ? 'bg-tactical-700 ring-1 ring-pitch-accent' : 'hover:bg-tactical-800'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base font-extrabold text-tactical-100 truncate">
                    {profile.managerName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-tactical-400 hover:text-tactical-200 p-1"
                    title="Edit Manager Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-pitch-accent bg-pitch-DEFAULT/20 px-2 py-0.5 rounded border border-pitch-line/40">
                  Level {profile.level} Manager
                </span>
                <span className="text-xs text-tactical-400 font-mono">
                  {profile.xp} Total XP
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-2.5">
                <div className="w-full bg-tactical-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-pitch-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-tactical-500 font-mono mt-1">
                  <span>{currentLevelXp} XP</span>
                  <span>300 XP to Level {profile.level + 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Career Stats Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              Career Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-tactical-400">Matches</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.matchesPlayed}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Wins (W/D/L)</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.wins} <span className="text-xs text-tactical-400 font-normal">/ {profile.stats.draws} / {profile.stats.losses}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-gold-400">Win Rate</div>
                <div className="text-lg font-black text-gold-400 mt-0.5">
                  {winRate}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-pitch-accent">Goals (F/A)</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.goalsScored} <span className="text-xs text-tactical-400 font-normal">/ {profile.stats.goalsConceded}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trophy Cabinet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-gold-400" />
                <span>Trophy Cabinet ({profile.trophies.length})</span>
              </h4>
            </div>

            {profile.trophies.length === 0 ? (
              <div className="p-6 rounded-lg bg-tactical-900/60 border border-tactical-800 text-center space-y-1">
                <Trophy className="w-8 h-8 text-tactical-600 mx-auto" />
                <div className="text-xs font-semibold text-tactical-300">
                  No Trophies Won Yet
                </div>
                <div className="text-[11px] text-tactical-500">
                  Compete in the 7-game World Championship Tournament to lift your first gold trophy!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.trophies.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-lg bg-tactical-900 border border-gold-900/40 flex items-center gap-3"
                  >
                    <div
                      className={`text-2xl p-2 rounded-lg ${
                        tr.type === 'gold' ? 'bg-amber-950/60 border border-amber-600/40' : 'bg-tactical-800 border border-tactical-700'
                      }`}
                    >
                      {tr.type === 'gold' ? '🏆' : '🥈'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-tactical-100 truncate">
                        {tr.tournamentName}
                      </div>
                      <div className="text-[10px] text-tactical-400 flex items-center gap-1">
                        <span>{tr.type === 'gold' ? 'Champion' : 'Runner-Up'}</span>
                        <span>•</span>
                        <span>{tr.draftMode === 'campaign' ? 'Campaign' : 'Dynamic'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Match Form */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              Recent Matches
            </h4>
            {profile.recentMatches.length === 0 ? (
              <div className="p-4 rounded-lg bg-tactical-900 border border-tactical-800 text-center text-xs text-tactical-500">
                No recent matches recorded. Play a quick match or tournament game!
              </div>
            ) : (
              <div className="space-y-1.5">
                {profile.recentMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-tactical-900 border border-tactical-750 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          m.result === 'win'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                            : m.result === 'draw'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-700/50'
                        }`}
                      >
                        {m.result === 'win' ? 'W' : m.result === 'draw' ? 'D' : 'L'}
                      </span>
                      <span className="font-semibold text-tactical-100 truncate">
                        vs {m.opponentName}
                      </span>
                      <span className="text-[10px] text-tactical-400 font-mono hidden sm:inline">
                        ({m.stage})
                      </span>
                    </div>

                    <span className="font-mono font-bold text-tactical-200">
                      {m.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
            </>
          ) : (
            /* ============================================================== */
            /* TAB 2: MY DREAM TEAM */
            /* ============================================================== */
            <div className="space-y-5">
              {profile.dreamTeam ? (
                <>
                  {/* Dream Team Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/15 to-amber-600/15 border border-gold-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gold-400 font-mono uppercase tracking-wider">
                          Official Personal Squad
                        </span>
                        <h3 className="text-lg font-black text-tactical-100 flex items-center gap-2">
                          <span>{profile.dreamTeam.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-tactical-850 text-gold-300 font-mono border border-gold-500/30">
                            {profile.dreamTeam.formationId}
                          </span>
                        </h3>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-tactical-400 font-mono">Team Caliber</div>
                        <div className="text-xl font-black text-gold-400 font-mono">
                          {profile.dreamTeam.totalOvr} <span className="text-xs font-normal">OVR</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Dream Team Match Record */}
                    {profile.dreamTeam.teamStats && (
                      <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-tactical-900/80 border border-tactical-750 text-center font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-tactical-400 block">Matches</span>
                          <span className="font-bold text-tactical-100">{profile.dreamTeam.teamStats.matchesPlayed}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 block">Record (W-D-L)</span>
                          <span className="font-bold text-tactical-100">
                            {profile.dreamTeam.teamStats.wins}-{profile.dreamTeam.teamStats.draws}-{profile.dreamTeam.teamStats.losses}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-pitch-accent block">Goals (F/A)</span>
                          <span className="font-bold text-tactical-100">
                            {profile.dreamTeam.teamStats.goalsFor} - {profile.dreamTeam.teamStats.goalsAgainst}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-tactical-700/60">
                      <button
                        type="button"
                        onClick={() => setIsExhibitionOpen(!isExhibitionOpen)}
                        className="flex-1 py-2 px-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-tactical-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-tactical-950" />
                        <span>{isExhibitionOpen ? 'Hide Challenge Panel' : '⚔️ Play AI Titan Match'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBuilderOpen(true)}
                        className="py-2 px-3 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-gold-300 border border-tactical-700 text-xs font-bold transition-all"
                        title="Edit Squad & Positions"
                      >
                        🛠️ Edit Squad
                      </button>

                      <button
                        type="button"
                        onClick={handleDisbandDreamTeam}
                        className="py-2 px-3 rounded-lg bg-tactical-800 hover:bg-red-950/60 text-tactical-400 hover:text-red-400 border border-tactical-700 hover:border-red-800 text-xs font-bold transition-all"
                        title="Disband Squad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* AI Titan Match Challenge Setup Panel (Same Caliber Opponents) */}
                  {isExhibitionOpen && (
                    <div className="p-4 rounded-xl bg-tactical-900 border border-gold-500/50 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-tactical-100">⚔️ AI Titan Match</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-tactical-800 text-gold-300 border border-gold-500/40 font-mono font-bold">
                          ⚖️ Same-Caliber Rival Tier ({dreamTeamCaliber - 3}–{dreamTeamCaliber + 3} OVR)
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-tactical-400">
                          Choose Matched AI Titan Opponent ({caliberMatchedEditions.length} available):
                        </label>
                        <select
                          value={selectedOpponentId}
                          onChange={(e) => setSelectedOpponentId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-tactical-800 border border-tactical-700 text-xs text-tactical-100 font-bold focus:outline-none focus:border-gold-500"
                        >
                          <option value="">-- Choose AI Opponent --</option>
                          {caliberMatchedEditions.map(({ edition: ed, caliber }) => (
                            <option key={ed.id} value={ed.id}>
                              {ed.teamName} ({ed.yearOrSeason}) • {caliber} OVR • {ed.editionType.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-tactical-400">Match Duration:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: '45s Blitz', val: 45 },
                            { label: '90s Classic', val: 90 },
                            { label: '180s Manager', val: 180 },
                          ].map((dur) => (
                            <button
                              key={dur.val}
                              type="button"
                              onClick={() => setDurationSec(dur.val)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                                durationSec === dur.val
                                  ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                                  : 'bg-tactical-800 text-tactical-400 border-tactical-700'
                              }`}
                            >
                              {dur.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLaunchExhibition}
                        disabled={!selectedOpponentId}
                        className="w-full py-2.5 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light disabled:opacity-40 disabled:cursor-not-allowed text-tactical-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                      >
                        <Play className="w-4 h-4 fill-tactical-100" />
                        <span>Kick Off Titan Match (Player Stats Will Be Saved)</span>
                      </button>
                    </div>
                  )}

                  {/* 11 Starting Players List with Detailed Stats */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-pitch-accent" />
                        <span>Starting XI ({dreamTeamPlayers.length}/11)</span>
                      </span>
                      <span className="text-[10px] text-tactical-400 font-mono">
                        Individual Career Stats
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(profile.dreamTeam.draftedSlots).map(([slotId, slot]) => {
                        const pId = slot.player.identityId || slot.player.id;
                        const pStats = profile.dreamTeam?.playerStats?.[pId] || {
                          appearances: 0,
                          goals: 0,
                          assists: 0,
                          cleanSheets: 0,
                          motmAwards: 0,
                          totalRating: 0,
                        };
                        const avgRating =
                          pStats.appearances > 0 ? (pStats.totalRating / pStats.appearances).toFixed(1) : '-';

                        return (
                          <div
                            key={slotId}
                            className="p-2.5 rounded-xl bg-tactical-900 border border-tactical-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                  slot.player.ovr
                                )}`}
                              >
                                {slot.player.ovr}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-tactical-100 truncate">
                                  {slot.player.name}
                                </div>
                                <div className="text-[10px] text-tactical-400 font-mono">
                                  Pos: <strong className="text-tactical-300">{slot.assignedPosition}</strong> • #{slot.player.squadNumber}
                                </div>
                              </div>
                            </div>

                            {/* Player Career Stats Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] shrink-0">
                              <span className="px-2 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-tactical-300">
                                {pStats.appearances} Apps
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 font-bold">
                                ⚽ {pStats.goals}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 font-bold">
                                🅰️ {pStats.assists}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/40 text-gold-300">
                                ⭐ {avgRating}
                              </span>
                              {pStats.cleanSheets > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-teal-950/70 border border-teal-800/40 text-teal-300 text-[10px]">
                                  🛡️ {pStats.cleanSheets} CS
                                </span>
                              )}
                              {pStats.motmAwards > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px]">
                                  🏆 {pStats.motmAwards} MOTM
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty Dream Team State with Direct Studio Builder */
                <div className="p-8 rounded-xl bg-tactical-900/60 border border-tactical-800 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-tactical-100">No Dream Team Configured Yet</h4>
                    <p className="text-xs text-tactical-400 max-w-sm mx-auto">
                      Build your personal dream squad right here. Play against AI titans of the same caliber, and all player goals, assists, and stats will be tracked!
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsBuilderOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-tactical-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
                    >
                      ✨ Build Dream Team in Studio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-tactical-900 border-t border-tactical-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-tactical-700 hover:bg-tactical-600 text-tactical-100 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Dream Team Studio Builder Modal */}
      {isBuilderOpen && (
        <DreamTeamBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onSaved={() => {
            setProfile(profileService.getProfile());
            setIsBuilderOpen(false);
          }}
          initialDreamTeam={profile.dreamTeam}
        />
      )}
    </div>
  );
};

