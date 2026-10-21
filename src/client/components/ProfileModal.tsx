import React, { useState, useMemo } from 'react';
import { profileService } from '../services/profileService.js';
import { offlineSoloEngine } from '../services/offlineSoloEngine.js';
import { ManagerProfile, TeamEdition } from '../../shared/types/index.js';
import { getOvrBadgeClass } from '../utils/ovrColor.js';
import { DreamTeamBuilderModal } from './DreamTeamBuilderModal.js';
import { getEditionCaliber } from '../utils/dreamTeamHelper.js';
import { FORMATIONS } from '../../shared/constants/formations.js';
import { getCustomFormations } from '../utils/customFormations.js';
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
  const [squadViewTab, setSquadViewTab] = useState<'starters' | 'bench'>('starters');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.managerName);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji || '👔');

  // Friendly match state
  const [isExhibitionOpen, setIsExhibitionOpen] = useState(false);
  const [opponentSearch, setOpponentSearch] = useState('');
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>('');
  const [durationSec, setDurationSec] = useState<number>(45);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Helper to format clean human-readable formation names
  const getCleanFormationName = (id: string): string => {
    if (FORMATIONS[id]) return FORMATIONS[id].name;
    try {
      const custom = getCustomFormations().find((f) => f.id === id);
      if (custom) return custom.name;
    } catch (e) {}
    if (id.startsWith('custom-')) {
      const raw = id
        .replace(/^custom-/, '')
        .replace(/-[a-z0-9]{6,}$/i, '')
        .replace(/custom-/g, '')
        .replace(/-/g, ' ');
      return raw.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return id;
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
    >
      <div className="bg-tactical-900 border border-tactical-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-tactical-750 bg-tactical-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-tactical-100">Manager Office & Profile</h2>
              <p className="text-[10px] text-tactical-400">Career stats, trophy cabinet & personal dream squad</p>
            </div>
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
              {profile.trophies.some((t) => t.type === 'silver') && (
                <button
                  onClick={() => {
                    const updated = profileService.clearRunnerUpTrophies();
                    setProfile(updated);
                  }}
                  className="text-[11px] text-tactical-400 hover:text-rose-400 transition-colors underline"
                  title="Remove unearned runner-up medals"
                >
                  Clear runner-ups
                </button>
              )}
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
                    className="p-3 rounded-lg bg-tactical-900 border border-gold-900/40 flex items-center gap-3 relative group"
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = profileService.removeTrophy(tr.id);
                        setProfile(updated);
                      }}
                      className="p-1.5 rounded-md text-tactical-500 hover:text-rose-400 hover:bg-tactical-800 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                      title="Remove trophy"
                      aria-label="Remove trophy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            <div className="space-y-4">
              {profile.dreamTeam ? (
                <>
                  {/* Dream Team Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-tactical-850 via-tactical-800 to-tactical-850 border border-gold-500/30 space-y-3.5 shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-gold-400 font-mono uppercase tracking-wider font-bold">
                          Official Personal Squad
                        </span>
                        <h3 className="text-lg font-black text-tactical-100 flex flex-wrap items-center gap-2 mt-0.5">
                          <span>{profile.dreamTeam.name}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-tactical-900 text-gold-400 font-bold border border-gold-500/30 flex items-center gap-1">
                            <span>⚽</span>
                            <span>{getCleanFormationName(profile.dreamTeam.formationId)}</span>
                          </span>
                        </h3>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] text-tactical-400 font-mono uppercase tracking-wider">Team Caliber</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gold-400 font-mono tracking-tight">
                            {profile.dreamTeam.totalOvr}
                          </span>
                          <span className="text-xs font-bold text-tactical-400">OVR</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Dream Team Match Record */}
                    {profile.dreamTeam.teamStats && (
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-tactical-900/90 border border-tactical-750 text-center font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-tactical-400 block font-sans">Matches</span>
                          <span className="font-bold text-tactical-100 text-sm">{profile.dreamTeam.teamStats.matchesPlayed}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 block font-sans">Record (W-D-L)</span>
                          <span className="font-bold text-tactical-100 text-sm">
                            {profile.dreamTeam.teamStats.wins}-{profile.dreamTeam.teamStats.draws}-{profile.dreamTeam.teamStats.losses}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-pitch-accent block font-sans">Goals (F / A)</span>
                          <span className="font-bold text-tactical-100 text-sm">
                            {profile.dreamTeam.teamStats.goalsFor} - {profile.dreamTeam.teamStats.goalsAgainst}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tactics Badges */}
                    {(profile.dreamTeam.tactics || profile.dreamTeam.roles) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        {profile.dreamTeam.tactics?.mentality && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-tactical-900 border border-tactical-750 text-gold-300 font-mono">
                            🛡️ {profile.dreamTeam.tactics.mentality.replace('_', ' ')}
                          </span>
                        )}
                        {profile.dreamTeam.tactics?.defensiveStyle && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-tactical-900 border border-tactical-750 text-pitch-accent font-mono">
                            ⚡ {profile.dreamTeam.tactics.defensiveStyle.replace('_', ' ')}
                          </span>
                        )}
                        {profile.dreamTeam.tactics?.passingStyle && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-tactical-900 border border-tactical-750 text-blue-300 font-mono">
                            ⚽ {profile.dreamTeam.tactics.passingStyle.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-tactical-750">
                      <button
                        type="button"
                        onClick={() => setIsExhibitionOpen(!isExhibitionOpen)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-tactical-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-tactical-950" />
                        <span>{isExhibitionOpen ? 'Hide Challenge Panel' : '⚔️ Play AI Titan Match'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBuilderOpen(true)}
                        className="py-2 px-3 rounded-xl bg-tactical-800 hover:bg-tactical-750 text-gold-300 border border-tactical-700 text-xs font-bold transition-all flex items-center gap-1.5"
                        title="Edit Squad & Positions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Squad</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDisbandDreamTeam}
                        className="p-2 rounded-xl bg-tactical-800 hover:bg-red-950/60 text-tactical-400 hover:text-red-400 border border-tactical-700 hover:border-red-800 text-xs font-bold transition-all"
                        title="Disband Squad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* AI Titan Match Challenge Setup Panel (Same Caliber Opponents) */}
                  {/* AI Titan Match Challenge Setup Panel (Same Caliber Opponents) */}
                  {isExhibitionOpen && (
                    <div className="p-4 rounded-2xl bg-tactical-850 border border-gold-500/40 space-y-3 animate-fade-in shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-tactical-100 flex items-center gap-1.5">
                          <span>⚔️</span>
                          <span>AI Titan Match Challenge</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-tactical-800 text-gold-300 border border-gold-500/30 font-mono font-bold">
                          ⚖️ Equal Tier ({dreamTeamCaliber - 3}–{dreamTeamCaliber + 3} OVR)
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-tactical-400 block font-medium">
                          Choose Matched AI Titan Rival ({caliberMatchedEditions.length} available):
                        </label>
                        <select
                          value={selectedOpponentId}
                          onChange={(e) => setSelectedOpponentId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-tactical-900 border border-tactical-700 text-xs text-tactical-100 font-bold focus:outline-none focus:border-gold-500"
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
                        <label className="text-[11px] text-tactical-400 block font-medium">Match Duration:</label>
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
                                  : 'bg-tactical-900 text-tactical-400 border-tactical-750 hover:border-tactical-600'
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
                        className="w-full py-2.5 rounded-xl bg-pitch-DEFAULT hover:bg-pitch-light disabled:opacity-40 disabled:cursor-not-allowed text-tactical-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all border border-pitch-line"
                      >
                        <Play className="w-4 h-4 fill-tactical-100" />
                        <span>Kick Off Titan Match (Player Stats Will Be Saved)</span>
                      </button>
                    </div>
                  )}

                  {/* 20-Player Squad Section with Clean Segmented Tabs */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-tactical-750">
                      <div className="flex items-center gap-1 bg-tactical-950 p-1 rounded-xl border border-tactical-750">
                        <button
                          type="button"
                          onClick={() => setSquadViewTab('starters')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            squadViewTab === 'starters'
                              ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                              : 'text-tactical-400 hover:text-tactical-200'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5 text-pitch-accent" />
                          <span>Starting XI ({dreamTeamPlayers.length}/11)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSquadViewTab('bench')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            squadViewTab === 'bench'
                              ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                              : 'text-tactical-400 hover:text-tactical-200'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5 text-gold-400" />
                          <span>Substitutes ({profile.dreamTeam.benchSlots ? Object.keys(profile.dreamTeam.benchSlots).length : 0}/9)</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-tactical-400 font-mono hidden sm:inline">
                        Individual Career Stats
                      </span>
                    </div>

                    {/* Active Roster List */}
                    <div className="space-y-1.5">
                      {squadViewTab === 'starters' ? (
                        Object.entries(profile.dreamTeam.draftedSlots).map(([slotId, slot]) => {
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
                              className="px-3 py-2 rounded-xl bg-tactical-850 hover:bg-tactical-800/80 border border-tactical-750 flex items-center justify-between gap-2.5 transition-colors shadow-sm"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                    slot.player.ovr
                                  )}`}
                                >
                                  {slot.player.ovr}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-tactical-100 truncate">
                                    {slot.player.name}
                                  </div>
                                  <div className="text-[10px] text-tactical-400 font-mono flex items-center gap-1.5">
                                    <span className="font-bold text-gold-400/90">{slot.assignedPosition}</span>
                                    <span>•</span>
                                    <span>#{slot.player.squadNumber}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                                <span className="px-2 py-0.5 rounded bg-tactical-900 border border-tactical-750 text-tactical-300 text-[10px]">
                                  {pStats.appearances} Apps
                                </span>
                                <span className="text-emerald-400 font-bold">⚽ {pStats.goals}</span>
                                <span className="text-cyan-400 font-bold">🅰️ {pStats.assists}</span>
                                <span className="text-gold-400 font-bold">⭐ {avgRating}</span>
                                {pStats.motmAwards > 0 && (
                                  <span className="px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 text-[10px] hidden sm:inline">
                                    🏆 {pStats.motmAwards}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : profile.dreamTeam.benchSlots && Object.keys(profile.dreamTeam.benchSlots).length > 0 ? (
                        Object.entries(profile.dreamTeam.benchSlots).map(([slotId, slot]) => {
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
                              className="px-3 py-2 rounded-xl bg-tactical-850 hover:bg-tactical-800/80 border border-tactical-750 flex items-center justify-between gap-2.5 transition-colors shadow-sm"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                    slot.player.ovr
                                  )}`}
                                >
                                  {slot.player.ovr}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-tactical-100 truncate">
                                    {slot.player.name}
                                  </div>
                                  <div className="text-[10px] text-tactical-400 font-mono flex items-center gap-1.5">
                                    <span className="font-bold text-tactical-300">{slot.assignedPosition}</span>
                                    <span>•</span>
                                    <span>#{slot.player.squadNumber}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                                <span className="px-2 py-0.5 rounded bg-tactical-900 border border-tactical-750 text-tactical-300 text-[10px]">
                                  {pStats.appearances} Apps
                                </span>
                                <span className="text-emerald-400 font-bold">⚽ {pStats.goals}</span>
                                <span className="text-cyan-400 font-bold">🅰️ {pStats.assists}</span>
                                <span className="text-gold-400 font-bold">⭐ {avgRating}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 rounded-xl bg-tactical-850 border border-tactical-750 text-center space-y-2">
                          <p className="text-xs text-tactical-400">No substitutes assigned yet.</p>
                          <button
                            type="button"
                            onClick={() => setIsBuilderOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-tactical-800 hover:bg-tactical-750 text-gold-300 text-xs font-bold border border-tactical-700"
                          >
                            Add Bench Substitutes in Studio
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty Dream Team State with Direct Studio Builder */
                <div className="p-8 rounded-2xl bg-tactical-850 border border-tactical-750 text-center space-y-4">
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

