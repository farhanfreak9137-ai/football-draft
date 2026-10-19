import React, { useState } from 'react';
import { FormationDefinition, PoolType, Strategy } from '../../shared/types/index.js';
import { FORMATION_PRESETS } from '../../shared/constants/formations.js';
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
  customFormations,
  selectedCustomFormation,
  onSelectCustomFormation,
  loading = false,
}) => {
  const [mode, setMode] = useState<'solo' | 'multiplayer'>('solo');
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [poolType, setPoolType] = useState<PoolType>('national');
  const [managerName, setManagerName] = useState('Tactical Manager');
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-pitch-DEFAULT/30 text-pitch-accent border border-pitch-line/50">
                Authoritative Match Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-tactical-100 tracking-tight">
              Historical Football Draft
            </h1>
            <p className="text-sm text-tactical-300 mt-1 max-w-xl">
              Draft a starting XI from historical national teams and club editions. Challenge a tactical
              historical AI or another player in real-time, then watch the 90-second luck-first simulation unfold.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
                      37 Editions (1990 - 2026)
                    </span>
                  </div>
                  <div className="text-xs text-tactical-400 mt-1">
                    Madrid 2016-17, Barca 2008-09, Milan 2004-05, Man Utd 1998-99, City 2022-23, Leverkusen 2023-24.
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider">
                  {messages.lobby.selectFormation}
                </label>
                <button
                  type="button"
                  onClick={onOpenFormationStudio}
                  className="flex items-center gap-1.5 px-3 py-1 bg-tactical-800 hover:bg-tactical-700 text-pitch-accent border border-pitch-line/50 rounded-lg text-xs font-bold transition-all shadow-sm group"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  <span>Custom Formation Studio</span>
                </button>
              </div>

              {/* Selected Custom Formation Banner if active */}
              {selectedCustomFormation && (
                <div className="mb-2.5 p-3 rounded-lg bg-pitch-DEFAULT/15 border border-pitch-line/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pitch-accent animate-pulse" />
                    <div>
                      <div className="font-bold text-xs text-tactical-100 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-pitch-DEFAULT text-tactical-100 font-mono">
                          CUSTOM ACTIVE
                        </span>
                        <span>{selectedCustomFormation.name}</span>
                      </div>
                      <div className="text-[11px] text-tactical-400 mt-0.5">
                        {selectedCustomFormation.description}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenFormationStudio}
                    className="text-xs text-pitch-accent hover:underline font-semibold"
                  >
                    Edit Studio
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.values(FORMATION_PRESETS).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormationId(f.id);
                      onSelectCustomFormation(null);
                    }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedFormationId === f.id && !selectedCustomFormation
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100 shadow-md'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-300 hover:border-tactical-600'
                    }`}
                  >
                    <div className="font-mono font-bold text-base">{f.name}</div>
                    <div className="text-[11px] text-tactical-400 mt-0.5">{f.description?.slice(0, 32)}...</div>
                  </button>
                ))}

                {/* Saved Custom Formations */}
                {customFormations.map((cf) => (
                  <button
                    key={cf.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormationId(cf.id);
                      onSelectCustomFormation(cf);
                    }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedFormationId === cf.id
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100 shadow-md'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-300 hover:border-tactical-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[9px] font-mono px-1 rounded bg-pitch-DEFAULT/40 text-pitch-accent border border-pitch-line/40">
                        CUSTOM
                      </span>
                      <span className="font-mono font-bold text-sm truncate">{cf.name}</span>
                    </div>
                    <div className="text-[10px] text-tactical-400 mt-0.5 truncate">
                      {cf.description || 'Custom Setup'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider">
                  {messages.lobby.selectFormation}
                </label>
                <button
                  type="button"
                  onClick={onOpenFormationStudio}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-tactical-800 hover:bg-tactical-700 text-pitch-accent border border-pitch-line/50 rounded-lg text-xs font-bold transition-all shadow-sm group"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  <span>Custom Studio</span>
                </button>
              </div>

              {selectedCustomFormation && (
                <div className="mb-2 p-2 rounded-lg bg-pitch-DEFAULT/15 border border-pitch-line/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-tactical-100 truncate">
                    <span className="px-1 py-0.5 rounded text-[9px] bg-pitch-DEFAULT text-tactical-100 font-mono">
                      CUSTOM
                    </span>
                    <span className="truncate">{selectedCustomFormation.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenFormationStudio}
                    className="text-[11px] text-pitch-accent hover:underline font-semibold shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {Object.values(FORMATION_PRESETS).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormationId(f.id);
                      onSelectCustomFormation(null);
                    }}
                    className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                      selectedFormationId === f.id && !selectedCustomFormation
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100 font-bold'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-400 hover:border-tactical-600'
                    }`}
                  >
                    <span className="font-mono">{f.name}</span>
                  </button>
                ))}

                {customFormations.map((cf) => (
                  <button
                    key={cf.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormationId(cf.id);
                      onSelectCustomFormation(cf);
                    }}
                    className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                      selectedFormationId === cf.id
                        ? 'bg-tactical-800 border-pitch-line ring-1 ring-pitch-line text-tactical-100 font-bold'
                        : 'bg-tactical-900/60 border-tactical-750 text-tactical-400 hover:border-tactical-600'
                    }`}
                  >
                    <span className="font-mono text-pitch-accent truncate block">{cf.name}</span>
                  </button>
                ))}
              </div>
            </div>

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

