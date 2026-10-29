import React, { useState, useEffect } from 'react';
import { FormationDefinition, PoolType, Strategy, ManagerProfile } from '../../shared/types/index.js';
import { FormationSelector } from './FormationSelector.js';
import { profileService } from '../services/profileService.js';
import { messages } from '../i18n/messages.js';
import {
  Users,
  User,
  ArrowRight,
  Trophy,
  Zap,
  Sparkles,
} from 'lucide-react';

interface LobbyViewProps {
  onCreateRoom: (params: {
    mode: 'solo' | 'multiplayer';
    poolType: PoolType;
    hostName: string;
    formationId: string;
    strategy: Strategy;
    matchFormat: 'auto' | 'normal' | 'knockout';
    customFormation?: FormationDefinition;
    enableSubstitutions?: boolean;
  }) => void;
  onJoinRoom: (params: {
    roomCode: string;
    guestName: string;
    formationId: string;
    strategy: Strategy;
    customFormation?: FormationDefinition;
  }) => void;
  onOpenSettings?: () => void;
  onOpenFormationStudio: () => void;
  onOpenTournament: () => void;
  onOpenProfile?: () => void;
  onOpenScenarios?: () => void;
  hasActiveTournament?: boolean;
  tournamentRoundLabel?: string;
  customFormations: FormationDefinition[];
  selectedCustomFormation: FormationDefinition | null;
  onSelectCustomFormation: (custom: FormationDefinition | null) => void;
  loading?: boolean;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onCreateRoom,
  onJoinRoom,
  onOpenFormationStudio,
  onOpenTournament,
  onOpenProfile,
  onOpenScenarios,
  hasActiveTournament = false,
  tournamentRoundLabel,
  customFormations,
  selectedCustomFormation,
  onSelectCustomFormation,
  loading = false,
}) => {
  const [profile, setProfile] = useState<ManagerProfile>(() => profileService.getProfile());
  const [mode, setMode] = useState<'solo' | 'multiplayer'>('solo');
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [poolType, setPoolType] = useState<PoolType>('national');
  const [managerName, setManagerName] = useState(profile.managerName || 'Tactical Manager');

  useEffect(() => {
    try {
      const p = profileService.getProfile();
      setProfile(p);
      setManagerName(p.managerName);
    } catch (e) {}
  }, []);

  const [selectedFormationId, setSelectedFormationId] = useState(
    selectedCustomFormation ? selectedCustomFormation.id : '4-3-3'
  );
  const [strategy, setStrategy] = useState<Strategy>('balanced');
  const [matchFormat, setMatchFormat] = useState<'auto' | 'normal' | 'knockout'>('auto');
  const [enableSubstitutions, setEnableSubstitutions] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('football_sim_subs_enabled');
      if (saved !== null) return saved === 'true';
    }
    return false; // Default to Classic 11 (Pure Starting XI Only)
  });
  const [joinCode, setJoinCode] = useState('');

  const handleToggleSubstitutions = (val: boolean) => {
    setEnableSubstitutions(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('football_sim_subs_enabled', String(val));
    }
  };

  // Synchronize when a custom formation is selected from the studio
  useEffect(() => {
    if (selectedCustomFormation) {
      setSelectedFormationId(selectedCustomFormation.id);
    }
  }, [selectedCustomFormation]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom({
      mode,
      poolType,
      hostName: managerName.trim() || 'Tactical Manager',
      formationId: selectedFormationId,
      strategy,
      matchFormat,
      enableSubstitutions,
      customFormation: selectedCustomFormation || undefined,
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    onJoinRoom({
      roomCode: joinCode.trim().toUpperCase(),
      guestName: managerName.trim() || 'Guest Manager',
      formationId: selectedFormationId,
      strategy,
      customFormation: selectedCustomFormation || undefined,
    });
  };

  const totalMatches = profile.stats?.matchesPlayed || 0;
  const totalWins = profile.stats?.wins || 0;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
  const trophiesCount = (profile.trophies || []).filter((t) => t.type === 'gold').length;
  const xp = profile.xp || 0;
  const currentLevel = profile.level || 1;
  const xpCurrentLevelBase = (currentLevel - 1) * 500;
  const xpInLevel = Math.max(0, xp - xpCurrentLevelBase);
  const xpLevelPercentage = Math.min(100, Math.round((xpInLevel / 500) * 100));

  return (
    <div className="w-full space-y-6">
      {/* 2-Column Responsive Command Center (Fills widescreen displays gracefully) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Match Arena & Room Console (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 cinematic-card rounded-2xl p-5 sm:p-7 space-y-6">
          {/* Segmented Top Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0C969C] shadow-[0_0_10px_rgba(12,150,156,0.9)] animate-pulse" />
              <h2 className="text-base sm:text-lg font-display font-black text-white tracking-wide uppercase">
                Match Command Terminal
              </h2>
            </div>

            <div className="grid grid-cols-3 p-1 bg-black rounded-xl border border-white/10 shadow-inner text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setTab('create');
                  setMode('solo');
                }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'create' && mode === 'solo'
                    ? 'bg-black text-white border-2 border-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.45)] font-bold'
                    : 'text-neutral-400 hover:text-white hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] border border-transparent'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#0C969C]" />
                <span className="truncate">Solo vs AI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('create');
                  setMode('multiplayer');
                }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'create' && mode === 'multiplayer'
                    ? 'bg-black text-white border-2 border-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.45)] font-bold'
                    : 'text-neutral-400 hover:text-white hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] border border-transparent'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#0C969C]" />
                <span className="truncate">1v1 PvP</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('join')}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'join'
                    ? 'bg-black text-white border-2 border-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.45)] font-bold'
                    : 'text-neutral-400 hover:text-white hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] border border-transparent'
                }`}
              >
                <span>🔑 Join Room</span>
              </button>
            </div>
          </div>

          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-6">
              {/* 1. Historical Era Pool Selection */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                    {messages.lobby.selectPool}
                  </label>
                  <span className="text-[11px] font-mono text-[#0C969C] font-semibold">386 Real Verified Legends</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setPoolType('national')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      poolType === 'national'
                        ? 'bg-black border-2 border-[#0C969C] text-white shadow-[0_0_25px_rgba(12,150,156,0.45)]'
                        : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_20px_rgba(12,150,156,0.35)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌍</span>
                        <span className="font-bold text-sm text-white">National Teams</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black border border-[#0C969C]/60 text-[#0C969C]">
                        20 Editions
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      Brazil 1970, Hungary 1954, Spain 2010, Greece 2004, Argentina 2022, France 1998 & legendary champions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPoolType('club')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      poolType === 'club'
                        ? 'bg-black border-2 border-[#0C969C] text-white shadow-[0_0_25px_rgba(12,150,156,0.45)]'
                        : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_20px_rgba(12,150,156,0.35)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        <span className="font-bold text-sm text-white">Classic Club Eras</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black border border-[#0C969C]/60 text-[#0C969C]">
                        75 Editions
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      Barça 1991–2026, Real Madrid Galácticos & 2017, Arsenal Invincibles, Treble United, Milan 2007.
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Manager Name & Tactical Strategy (2-Column Subgrid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Manager Name */}
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                    {messages.lobby.managerName}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      maxLength={30}
                      placeholder="Enter manager name"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-[#0C969C] focus:shadow-[0_0_20px_rgba(12,150,156,0.45)] hover:border-[#0C969C]/50 transition-all shadow-inner"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                      {managerName.length}/30
                    </span>
                  </div>
                </div>

                {/* Strategy Selector */}
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                    {messages.lobby.selectStrategy}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'attacking' as Strategy, label: 'Attacking', icon: '⚔️', activeStyle: 'bg-rose-950/40 border-2 border-rose-500 text-rose-200 font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
                      { id: 'balanced' as Strategy, label: 'Balanced', icon: '⚖️', activeStyle: 'bg-black border-2 border-[#0C969C] text-white font-bold shadow-[0_0_20px_rgba(12,150,156,0.45)]' },
                      { id: 'defensive' as Strategy, label: 'Defensive', icon: '🛡️', activeStyle: 'bg-[#274D60]/40 border-2 border-[#6BA3BE] text-white font-bold shadow-[0_0_15px_rgba(107,163,190,0.4)]' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStrategy(st.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          strategy === st.id
                            ? st.activeStyle
                            : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.3)]'
                        }`}
                      >
                        <div className="text-sm">{st.icon}</div>
                        <div className="font-semibold text-xs mt-0.5">{st.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Formation Preset & Custom Formations */}
              <FormationSelector
                selectedFormationId={selectedFormationId}
                selectedCustomFormation={selectedCustomFormation}
                customFormations={customFormations}
                onSelectFormation={(fid, custom) => {
                  setSelectedFormationId(fid);
                  onSelectCustomFormation(custom);
                }}
                onOpenFormationStudio={onOpenFormationStudio}
              />

              {/* 4. Match Format & Squad Substitutions (2-Column Subgrid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Match Format & Rules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                      Match Format & Rules
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'auto' as const, icon: '🔄', title: 'Auto' },
                      { id: 'normal' as const, icon: '⏱️', title: 'League' },
                      { id: 'knockout' as const, icon: '🏆', title: 'Cup' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setMatchFormat(fmt.id)}
                        className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          matchFormat === fmt.id
                            ? 'bg-black border-2 border-[#0C969C] text-white font-bold shadow-[0_0_20px_rgba(12,150,156,0.45)]'
                            : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.3)]'
                        }`}
                      >
                        <span className="text-base">{fmt.icon}</span>
                        <div className="font-semibold text-xs mt-0.5">{fmt.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Squad Size & Substitutions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                      Squad Size & Format
                    </label>
                    <span className="text-[10px] font-mono text-[#0C969C] font-semibold">
                      {!enableSubstitutions ? '11 Picks (Starting XI)' : '17 Picks (XI + 6 Subs)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSubstitutions(false)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        !enableSubstitutions
                          ? 'bg-black border-2 border-[#0C969C] text-white font-bold shadow-[0_0_20px_rgba(12,150,156,0.45)]'
                          : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.3)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Classic 11</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black text-[#0C969C] font-bold border border-[#0C969C]/40">⚡ PURE XI</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">Starting XI • Fast Kickoff</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSubstitutions(true)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        enableSubstitutions
                          ? 'bg-black border-2 border-[#0C969C] text-white font-bold shadow-[0_0_20px_rgba(12,150,156,0.45)]'
                          : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.3)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">17 Squad</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0C969C]/20 text-[#0C969C] font-bold border border-[#0C969C]/40">SUBS</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">11 Starters + 6 Bench</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Primary Modern Kickoff Button (Pitch Black with Radiant Turquoise Glow) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0C969C] via-[#0A7075] to-[#0C969C] hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(12,150,156,0.6)] border border-[#0C969C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{mode === 'solo' ? '⚡ Kick Off Solo Draft Match' : '👥 Create 1v1 PvP Match Room'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            /* Join Room Form */
            <form onSubmit={handleJoin} className="space-y-6 max-w-lg mx-auto py-2">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Enter 6-Character Room Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="ROOM CODE (E.G. DRAFT1)"
                  className="w-full bg-black border-2 border-[#0C969C] rounded-xl px-4 py-4 text-center font-mono font-black tracking-widest text-2xl text-[#0C969C] shadow-[0_0_25px_rgba(12,150,156,0.45)] focus:outline-none focus:border-[#6BA3BE] uppercase shadow-inner"
                />
              </div>

              <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 text-xs text-neutral-300">
                <span className="text-[#0C969C] text-base shrink-0">ℹ️</span>
                <span>
                  <strong>Room Rule Sync:</strong> Match format, era pool, and squad rules (Pure 11 or 17-player squad) automatically sync from the host room.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  {messages.lobby.managerName}
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  maxLength={30}
                  placeholder="Enter manager name"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-[#0C969C] focus:shadow-[0_0_20px_rgba(12,150,156,0.45)] hover:border-[#0C969C]/50 transition-all shadow-inner"
                />
              </div>

              <FormationSelector
                selectedFormationId={selectedFormationId}
                selectedCustomFormation={selectedCustomFormation}
                customFormations={customFormations}
                onSelectFormation={(fid, custom) => {
                  setSelectedFormationId(fid);
                  onSelectCustomFormation(custom);
                }}
                onOpenFormationStudio={onOpenFormationStudio}
                compact
              />

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  {messages.lobby.selectStrategy}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'attacking' as Strategy, label: 'Attacking', icon: '⚔️' },
                    { id: 'balanced' as Strategy, label: 'Balanced', icon: '⚖️' },
                    { id: 'defensive' as Strategy, label: 'Defensive', icon: '🛡️' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStrategy(st.id)}
                      className={`py-2 px-2 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                        strategy === st.id
                          ? 'bg-black border-2 border-[#0C969C] text-white font-bold shadow-[0_0_15px_rgba(12,150,156,0.4)]'
                          : 'bg-black border-white/10 text-neutral-400 hover:border-[#0C969C] hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.3)]'
                      }`}
                    >
                      <span className="mr-1">{st.icon}</span>
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || joinCode.trim().length !== 6}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0C969C] via-[#0A7075] to-[#0C969C] hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(12,150,156,0.6)] border border-[#0C969C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{messages.lobby.joinButton}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Career Dossier & Championship Hub (lg:col-span-5 xl:col-span-4 space-y-6) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Card 1: Manager Career Dossier */}
          <div className="cinematic-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black border border-[#0C969C]/50 shadow-[0_0_15px_rgba(12,150,156,0.3)] flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {profile.avatarEmoji || '👔'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-base text-white truncate">
                      {profile.managerName || 'Tactical Manager'}
                    </h3>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-black text-[#0C969C] border border-[#0C969C]/50 shadow-[0_0_10px_rgba(12,150,156,0.3)]">
                      Lv.{currentLevel}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">Tactical Master Record</p>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="px-2.5 py-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-black hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.35)] rounded-lg border border-white/10 transition-all cursor-pointer"
                >
                  Dossier
                </button>
              )}
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>Level {currentLevel} Progress</span>
                <span className="text-[#0C969C] font-bold">{xpInLevel}/500 XP ({xpLevelPercentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#0A7075] to-[#0C969C] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(12,150,156,0.8)]"
                  style={{ width: `${xpLevelPercentage}%` }}
                />
              </div>
            </div>

            {/* 4-Stat Grid Matrix */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] transition-all">
                <div className="text-xs font-mono font-bold text-white">{totalMatches}</div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-tight mt-0.5">Matches</div>
              </div>
              <div className="p-2 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] transition-all">
                <div className="text-xs font-mono font-bold text-[#0C969C]">{totalWins}</div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-tight mt-0.5">Wins</div>
              </div>
              <div className="p-2 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] transition-all">
                <div className="text-xs font-mono font-bold text-neutral-200">{winRate}%</div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-tight mt-0.5">Win Rate</div>
              </div>
              <div className="p-2 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] transition-all">
                <div className="text-xs font-mono font-bold text-amber-300">🏆 {trophiesCount}</div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-tight mt-0.5">Gold</div>
              </div>
            </div>

            {/* 1-Click Instant AI Kickoff Action */}
            <button
              type="button"
              onClick={() => {
                onCreateRoom({
                  mode: 'solo',
                  poolType: 'national',
                  hostName: managerName.trim() || 'Tactical Manager',
                  formationId: selectedFormationId,
                  strategy: 'balanced',
                  matchFormat: 'auto',
                  enableSubstitutions: enableSubstitutions,
                  customFormation: selectedCustomFormation || undefined,
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:border-[#0C969C] hover:shadow-[0_0_20px_rgba(12,150,156,0.4)] hover:text-[#0C969C] text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#0C969C]" />
              <span>Instant AI Match (1-Click)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>

          {/* Card 2: World Championship Campaign */}
          <div className="cinematic-card-gold rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                Official Tournament
              </span>
              {hasActiveTournament && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse">
                  {tournamentRoundLabel || 'Campaign Active'}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black font-display text-white tracking-wide flex items-center gap-2">
                <span>🏆 World Championship</span>
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {hasActiveTournament
                  ? 'Your 7-game tournament campaign is saved. Continue your pursuit of the golden trophy!'
                  : 'Play the authentic 7-match gauntlet: 3 group fixtures, Round of 16, Quarters, Semis & Grand Final.'}
              </p>
            </div>

            <button
              onClick={onOpenTournament}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-black" />
              <span>{hasActiveTournament ? 'Continue Saved Campaign' : 'Enter World Cup (7 Matches)'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Card 3: Tactical Lab & Historic Scenarios */}
          <div className="cinematic-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Historic Challenges & Studio
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#0C969C]" />
            </div>

            {/* Time Machine Tile */}
            <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_20px_rgba(12,150,156,0.35)] transition-all">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>⏳ Time Machine Scenarios</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate">Istanbul 2005, Azteca 1986 turning points</div>
              </div>
              <button
                type="button"
                onClick={onOpenScenarios}
                className="px-3 py-1.5 rounded-lg bg-black hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.35)] hover:text-[#0C969C] text-white border border-white/10 text-xs font-semibold shrink-0 transition-all cursor-pointer"
              >
                Play →
              </button>
            </div>

            {/* Tactics Studio Tile */}
            <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_20px_rgba(12,150,156,0.35)] transition-all">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>📋 Custom Tactics Studio</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate">Tactics board & custom snap formations</div>
              </div>
              <button
                type="button"
                onClick={onOpenFormationStudio}
                className="px-3 py-1.5 rounded-lg bg-black hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.35)] hover:text-[#0C969C] text-white border border-white/10 text-xs font-semibold shrink-0 transition-all cursor-pointer"
              >
                Board →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
