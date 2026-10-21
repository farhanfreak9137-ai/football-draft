import React, { useState, useEffect } from 'react';
import { FormationDefinition, PoolType, Strategy, ManagerProfile } from '../../shared/types/index.js';
import { FormationSelector } from './FormationSelector.js';
import { Logo } from './Logo.js';
import { profileService } from '../services/profileService.js';
import { messages } from '../i18n/messages.js';
import {
  Users,
  User,
  Shield,
  Layers,
  Sparkles,
  Copy,
  Check,
  Globe,
  Settings,
  Flame,
  ArrowRight,
  Trophy,
  Award,
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
  }) => void;
  onJoinRoom: (params: {
    roomCode: string;
    guestName: string;
    formationId: string;
    strategy: Strategy;
    customFormation?: FormationDefinition;
  }) => void;
  onOpenSettings: () => void;
  onOpenFormationStudio: () => void;
  onOpenTournament: () => void;
  onOpenProfile: () => void;
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
  onOpenSettings,
  onOpenFormationStudio,
  onOpenTournament,
  onOpenProfile,
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
  const [joinCode, setJoinCode] = useState('');

  // Synchronize when a custom formation is selected from the studio
  React.useEffect(() => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Logo size={44} className="mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-pitch-DEFAULT/30 text-pitch-accent border border-pitch-line/50">
                  Authoritative Match Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-tactical-100 tracking-tight">
                Historical Football Simulator
              </h1>
              <p className="text-sm text-tactical-300 mt-1 max-w-xl">
                Draft a starting XI from historical national teams and club editions. Face a tactical
                AI or a live opponent, then watch your match simulation unfold — with full career
                tracking, tactical management, and a World Cup campaign.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-tactical-800 hover:bg-tactical-750 text-tactical-100 border border-tactical-600 transition-all text-xs font-bold shadow-sm"
              title="Manager Profile & Career"
            >
              <span className="text-sm">{profile?.avatarEmoji || '👔'}</span>
              <span className="hidden sm:inline">{profile?.managerName || 'Profile'}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-tactical-900 text-gold-400 border border-tactical-700">
                Lv.{profile?.level || 1}
              </span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 border border-tactical-600 transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Mode: 7-Game World Cup Tournament */}
      <div className="bg-gradient-to-r from-amber-950/60 via-tactical-850 to-tactical-850 border border-gold-500/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  Featured Mode
                </span>
                {hasActiveTournament && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                    Campaign in Progress ({tournamentRoundLabel || 'Active'})
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-tactical-100 flex items-center gap-1.5">
                <span>World Championship Campaign (7 Matches)</span>
              </h2>
              <p className="text-xs text-tactical-300 mt-0.5 max-w-xl">
                {hasActiveTournament
                  ? 'Your tournament campaign is actively saved. Jump back into the manager dugout and play your next fixture!'
                  : 'Experience the 7-game international campaign: 3 group matches, Round of 16, Quarters, Semis, and Grand Final. Choose Manager Mode (3-4 min tactical pace) or Dynamic Draft (90s fast sim).'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTournament}
            className={`w-full sm:w-auto px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shrink-0 shadow-lg ${
              hasActiveTournament
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-tactical-950 shadow-emerald-900/40'
                : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-tactical-950 shadow-gold-950/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{hasActiveTournament ? 'Continue Tournament' : 'Enter World Cup'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-6 shadow-xl space-y-6">
        {/* Navigation Tabs (Create vs Join) */}
        <div className="grid grid-cols-2 p-1 bg-tactical-900 rounded-lg border border-tactical-750 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              tab === 'create'
                ? 'bg-tactical-700 text-tactical-100 shadow'
                : 'text-tactical-400 hover:text-tactical-200'
            }`}
          >
            Create Match Room
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              tab === 'join'
                ? 'bg-tactical-700 text-tactical-100 shadow'
                : 'text-tactical-400 hover:text-tactical-200'
            }`}
          >
            Join Existing Room
          </button>
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                Draft Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('solo')}
                  className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                    mode === 'solo'
                      ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line'
                      : 'bg-tactical-900/60 border-tactical-750 hover:border-tactical-600'
                  }`}
                >
                  <User className="w-5 h-5 text-pitch-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-tactical-100">{messages.lobby.soloDraft}</div>
                    <div className="text-xs text-tactical-400 mt-0.5 leading-relaxed">
                      {messages.lobby.soloDescription}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('multiplayer')}
                  className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                    mode === 'multiplayer'
                      ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line'
                      : 'bg-tactical-900/60 border-tactical-750 hover:border-tactical-600'
                  }`}
                >
                  <Users className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-tactical-100">{messages.lobby.multiplayerRoom}</div>
                    <div className="text-xs text-tactical-400 mt-0.5 leading-relaxed">
                      {messages.lobby.multiplayerDescription}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Historical Pool Selection */}
            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                {messages.lobby.selectPool}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPoolType('national')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    poolType === 'national'
                      ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line'
                      : 'bg-tactical-900/60 border-tactical-750 hover:border-tactical-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-tactical-100">National Teams</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-tactical-700 text-tactical-300">
                      20 Editions (1950 - 2022)
                    </span>
                  </div>
                  <div className="text-xs text-tactical-400 mt-1">
                    Brazil 1970, Hungary 1954, Spain 2010, Greece 2004, Argentina 2022, etc.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPoolType('club')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    poolType === 'club'
                      ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line'
                      : 'bg-tactical-900/60 border-tactical-750 hover:border-tactical-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-tactical-100">Clubs</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-tactical-700 text-tactical-300">
                      75 Editions (1990 - 2026)
                    </span>
                  </div>
                  <div className="text-xs text-tactical-400 mt-1">
                    Barca 1991-2026, Madrid 2000-25, Arsenal, Chelsea, City, Liverpool, United, Bayern, Milan, Inter, Juve, Napoli.
                  </div>
                </button>
              </div>
            </div>

            {/* Manager Name */}
            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                {messages.lobby.managerName}
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                maxLength={30}
                placeholder="Enter your name"
                className="w-full bg-tactical-900 border border-tactical-600 rounded-lg px-3.5 py-2.5 text-sm text-tactical-100 focus:outline-none focus:border-pitch-line"
              />
            </div>

            {/* Formation Preset & Custom Formations */}
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

            {/* Strategy */}
            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                {messages.lobby.selectStrategy}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['attacking', 'balanced', 'defensive'] as Strategy[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStrategy(st)}
                    className={`py-2.5 px-3 rounded-lg border text-center text-xs font-semibold capitalize transition-all ${
                      strategy === st
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-400 hover:border-tactical-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Format & Rotation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider">
                  Match Format & Rules
                </label>
                <span className="text-[11px] text-pitch-accent font-mono">auto-rotates draws & penalties</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'auto' as const,
                    title: 'Auto-Rotate',
                    subtitle: 'Alternates League & Cup format',
                  },
                  {
                    id: 'normal' as const,
                    title: 'Normal Time (League)',
                    subtitle: "90' draws allowed • No penalties",
                  },
                  {
                    id: 'knockout' as const,
                    title: 'Cup Knockout',
                    subtitle: 'Ties go to Extra Time & Penalties',
                  },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setMatchFormat(fmt.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      matchFormat === fmt.id
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100 shadow-sm'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-400 hover:border-tactical-600'
                    }`}
                  >
                    <div className="font-semibold text-xs text-tactical-100">{fmt.title}</div>
                    <div className="text-[10px] text-tactical-400 mt-0.5">{fmt.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-bold text-sm border border-pitch-line shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              <span>{messages.lobby.createRoom}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Join Room Form */
          <form onSubmit={handleJoin} className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="6-CHARACTER CODE (E.G. DRAFT1)"
                className="w-full bg-tactical-900 border border-tactical-600 rounded-lg px-4 py-3 text-center font-mono font-bold tracking-widest text-lg text-tactical-100 focus:outline-none focus:border-pitch-line uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                {messages.lobby.managerName}
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                maxLength={30}
                placeholder="Enter your name"
                className="w-full bg-tactical-900 border border-tactical-600 rounded-lg px-3.5 py-2.5 text-sm text-tactical-100 focus:outline-none focus:border-pitch-line"
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
              <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider mb-2">
                {messages.lobby.selectStrategy}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['attacking', 'balanced', 'defensive'] as Strategy[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStrategy(st)}
                    className={`py-2 px-2 rounded-lg border text-center text-xs font-semibold capitalize transition-all ${
                      strategy === st
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-400 hover:border-tactical-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || joinCode.trim().length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 font-bold text-sm border border-pitch-line shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              <span>{messages.lobby.joinButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

