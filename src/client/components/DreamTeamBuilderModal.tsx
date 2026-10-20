import React, { useState, useMemo, useEffect } from 'react';
import {
  FormationDefinition,
  FormationSlot,
  PlayerVersion,
  SavedDreamTeam,
  DraftedSlot,
  Position,
  SquadRoles,
  TacticalInstructions,
  LiveMentality,
  DefensiveStyle,
  PassingStyle,
} from '../../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { offlineSoloEngine } from '../services/offlineSoloEngine.js';
import { profileService } from '../services/profileService.js';
import { getCustomFormations } from '../utils/customFormations.js';
import { soundManager } from '../utils/audio.js';
import { getOvrBadgeClass } from '../utils/ovrColor.js';
import { FormationStudioModal } from './FormationStudioModal.js';
import {
  X,
  Sparkles,
  Shield,
  Search,
  Check,
  Zap,
  Users,
  Sliders,
  Crown,
  Target,
  Flag,
  ArrowUpDown,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export interface BenchSlotDef {
  id: string;
  name: string;
  roleLabel: string;
  defaultPosition: Position;
  eligiblePositions: Position[];
}

export const DREAM_TEAM_BENCH_SLOTS: BenchSlotDef[] = [
  { id: 'sub-gk', name: 'Backup Goalkeeper', roleLabel: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'] },
  { id: 'sub-cb', name: 'Reserve Center-Back', roleLabel: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB', 'LB', 'RB', 'LWB', 'RWB'] },
  { id: 'sub-fb', name: 'Reserve Full-Back', roleLabel: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'RB', 'LWB', 'RWB', 'CB'] },
  { id: 'sub-cdm', name: 'Defensive Anchor', roleLabel: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM', 'CB'] },
  { id: 'sub-cm', name: 'Central Playmaker', roleLabel: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM', 'LM', 'RM'] },
  { id: 'sub-wng', name: 'Wide Attacker / Winger', roleLabel: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'RW', 'LM', 'RM', 'ST'] },
  { id: 'sub-st', name: 'Clinical Striker', roleLabel: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS', 'LW', 'RW'] },
  {
    id: 'sub-flex1',
    name: 'Wildcard Utility Sub 1',
    roleLabel: 'FLEX',
    defaultPosition: 'CM',
    eligiblePositions: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF', 'SS'],
  },
  {
    id: 'sub-flex2',
    name: 'Wildcard Utility Sub 2',
    roleLabel: 'FLEX',
    defaultPosition: 'ST',
    eligiblePositions: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF', 'SS'],
  },
];

interface DreamTeamBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialDreamTeam?: SavedDreamTeam | null;
}

export const DreamTeamBuilderModal: React.FC<DreamTeamBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialDreamTeam,
}) => {
  const allPlayers = useMemo(() => offlineSoloEngine.getPlayers(), []);
  const allEditions = useMemo(() => offlineSoloEngine.getEditions(), []);

  // Formations state (Presets + Custom)
  const [customFormations, setCustomFormations] = useState<FormationDefinition[]>(() => getCustomFormations());
  const [formationId, setFormationId] = useState<string>(initialDreamTeam?.formationId || '4-3-3');
  const [selectedCustomFormation, setSelectedCustomFormation] = useState<FormationDefinition | undefined>(
    initialDreamTeam?.customFormation
  );
  const [isFormationPickerOpen, setIsFormationPickerOpen] = useState(false);
  const [isFormationStudioOpen, setIsFormationStudioOpen] = useState(false);

  // Active Formation object
  const formation: FormationDefinition = useMemo(() => {
    if (selectedCustomFormation && selectedCustomFormation.id === formationId) {
      return selectedCustomFormation;
    }
    const custom = customFormations.find((f) => f.id === formationId);
    if (custom) return custom;
    return FORMATIONS[formationId] || FORMATIONS['4-3-3'];
  }, [formationId, selectedCustomFormation, customFormations]);

  // Squad Basics
  const [teamName, setTeamName] = useState<string>(initialDreamTeam?.name || 'My All-Time Dream XI');
  const [activeTab, setActiveTab] = useState<'pitch' | 'bench' | 'tactics' | 'roster'>('pitch');

  // 11 Starting Slots: slotId -> PlayerVersion
  const [draftedSlots, setDraftedSlots] = useState<Record<string, PlayerVersion>>(() => {
    if (!initialDreamTeam?.draftedSlots) return {};
    const map: Record<string, PlayerVersion> = {};
    for (const [k, v] of Object.entries(initialDreamTeam.draftedSlots)) {
      map[k] = v.player;
    }
    return map;
  });

  // 9 Bench Slots: benchSlotId -> PlayerVersion
  const [benchSlots, setBenchSlots] = useState<Record<string, PlayerVersion>>(() => {
    if (!initialDreamTeam?.benchSlots) return {};
    const map: Record<string, PlayerVersion> = {};
    for (const [k, v] of Object.entries(initialDreamTeam.benchSlots)) {
      map[k] = v.player;
    }
    return map;
  });

  // Tactics & Roles State
  const [tactics, setTactics] = useState<TacticalInstructions>(() => ({
    mentality: initialDreamTeam?.tactics?.mentality || 'balanced',
    defensiveStyle: initialDreamTeam?.tactics?.defensiveStyle || 'mid_block',
    passingStyle: initialDreamTeam?.tactics?.passingStyle || 'tiki_taka',
  }));

  const [roles, setRoles] = useState<SquadRoles>(() => ({
    captainSlotId: initialDreamTeam?.roles?.captainSlotId || '',
    penaltySlotId: initialDreamTeam?.roles?.penaltySlotId || '',
    freeKickSlotId: initialDreamTeam?.roles?.freeKickSlotId || '',
    cornerSlotId: initialDreamTeam?.roles?.cornerSlotId || '',
  }));

  // Active Assignment Target
  const [activeSlotTarget, setActiveSlotTarget] = useState<{
    type: 'starter' | 'bench';
    slotId: string;
  } | null>(null);

  // Swapping Mode: Selected slot waiting for target to swap with
  const [swappingSlot, setSwappingSlot] = useState<{
    type: 'starter' | 'bench';
    slotId: string;
  } | null>(null);

  // Candidate Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');

  // Refresh custom formations whenever studio closes
  useEffect(() => {
    setCustomFormations(getCustomFormations());
  }, [isFormationStudioOpen]);

  // Determine current active slot definition
  const currentActiveSlotDef = useMemo(() => {
    if (!activeSlotTarget) return null;
    if (activeSlotTarget.type === 'starter') {
      const slot = formation.slots.find((s) => s.id === activeSlotTarget.slotId);
      if (!slot) return null;
      return {
        id: slot.id,
        name: slot.name,
        defaultPosition: slot.defaultPosition,
        eligiblePositions: slot.eligiblePositions,
      };
    } else {
      const bSlot = DREAM_TEAM_BENCH_SLOTS.find((s) => s.id === activeSlotTarget.slotId);
      if (!bSlot) return null;
      return {
        id: bSlot.id,
        name: bSlot.name,
        defaultPosition: bSlot.defaultPosition,
        eligiblePositions: bSlot.eligiblePositions,
      };
    }
  }, [activeSlotTarget, formation]);

  // All currently used player identities across all 20 squad slots
  const usedIdentityIds = useMemo(() => {
    const ids: string[] = [];
    Object.values(draftedSlots).forEach((p) => {
      if (p) ids.push(p.identityId);
    });
    Object.values(benchSlots).forEach((p) => {
      if (p) ids.push(p.identityId);
    });
    return ids;
  }, [draftedSlots, benchSlots]);

  // Filtered Candidate Players for Drawer
  const candidatePlayers = useMemo(() => {
    if (!currentActiveSlotDef) return [];

    const isStarter = activeSlotTarget?.type === 'starter';
    const currentAssignedPlayer = isStarter
      ? draftedSlots[currentActiveSlotDef.id]
      : benchSlots[currentActiveSlotDef.id];

    return allPlayers.filter((p) => {
      // Exclude players already in the 20-man squad, unless it's the player currently in this exact slot
      if (usedIdentityIds.includes(p.identityId) && currentAssignedPlayer?.id !== p.id) {
        return false;
      }

      // Check position eligibility
      const isEligible =
        currentActiveSlotDef.eligiblePositions.includes('GK') &&
        currentActiveSlotDef.eligiblePositions.length === 1
          ? p.naturalPositions.includes('GK') || (p.secondaryPositions && p.secondaryPositions.includes('GK'))
          : currentActiveSlotDef.eligiblePositions.some(
              (pos) =>
                p.naturalPositions.includes(pos) ||
                (p.secondaryPositions && p.secondaryPositions.includes(pos))
            );

      if (!isEligible) return false;

      // Position filter button
      if (positionFilter !== 'ALL') {
        const matchesGroup =
          (positionFilter === 'GK' && p.naturalPositions.includes('GK')) ||
          (positionFilter === 'DEF' &&
            ['CB', 'LB', 'RB', 'LWB', 'RWB'].some((pos) => p.naturalPositions.includes(pos as Position))) ||
          (positionFilter === 'MID' &&
            ['CDM', 'CM', 'CAM', 'LM', 'RM'].some((pos) => p.naturalPositions.includes(pos as Position))) ||
          (positionFilter === 'FWD' &&
            ['ST', 'CF', 'SS', 'LW', 'RW'].some((pos) => p.naturalPositions.includes(pos as Position)));
        if (!matchesGroup) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.naturalPositions.some((pos) => pos.toLowerCase().includes(q))
        );
      }
      return true;
    }).sort((a, b) => b.ovr - a.ovr);
  }, [allPlayers, currentActiveSlotDef, activeSlotTarget, draftedSlots, benchSlots, usedIdentityIds, positionFilter, searchQuery]);

  // Overall calculations
  const startersCount = Object.keys(draftedSlots).length;
  const isStartersComplete = startersCount === formation.slots.length;
  const benchCount = Object.keys(benchSlots).length;
  const totalSquadCount = startersCount + benchCount;

  const starterPlayersList = Object.values(draftedSlots);
  const avgStarterOvr =
    starterPlayersList.length > 0
      ? Math.round(starterPlayersList.reduce((acc, p) => acc + p.ovr, 0) / starterPlayersList.length)
      : 0;

  const allSquadPlayersList = [...starterPlayersList, ...Object.values(benchSlots)];
  const avgSquadOvr =
    allSquadPlayersList.length > 0
      ? Math.round(allSquadPlayersList.reduce((acc, p) => acc + p.ovr, 0) / allSquadPlayersList.length)
      : 0;

  // Handler: Assign Player to Active Slot (Starter or Bench)
  const handleSelectPlayer = (player: PlayerVersion) => {
    if (!activeSlotTarget) return;
    try {
      soundManager.playPickSound();
    } catch (e) {}

    if (activeSlotTarget.type === 'starter') {
      setDraftedSlots((prev) => ({ ...prev, [activeSlotTarget.slotId]: player }));
    } else {
      setBenchSlots((prev) => ({ ...prev, [activeSlotTarget.slotId]: player }));
    }

    setActiveSlotTarget(null);
    setSearchQuery('');
  };

  // Handler: Remove Player from Slot
  const handleRemoveSlot = (type: 'starter' | 'bench', slotId: string) => {
    if (type === 'starter') {
      setDraftedSlots((prev) => {
        const copy = { ...prev };
        delete copy[slotId];
        return copy;
      });
      // Clear roles if this starter held one
      if (roles.captainSlotId === slotId) setRoles((r) => ({ ...r, captainSlotId: '' }));
      if (roles.penaltySlotId === slotId) setRoles((r) => ({ ...r, penaltySlotId: '' }));
      if (roles.freeKickSlotId === slotId) setRoles((r) => ({ ...r, freeKickSlotId: '' }));
      if (roles.cornerSlotId === slotId) setRoles((r) => ({ ...r, cornerSlotId: '' }));
    } else {
      setBenchSlots((prev) => {
        const copy = { ...prev };
        delete copy[slotId];
        return copy;
      });
    }
  };

  // Handler: Swap Player between Two Slots (Starter <-> Bench or Starter <-> Starter)
  const handleExecuteSwap = (targetType: 'starter' | 'bench', targetSlotId: string) => {
    if (!swappingSlot) return;
    try {
      soundManager.playPickSound();
    } catch (e) {}

    const sourcePlayer =
      swappingSlot.type === 'starter'
        ? draftedSlots[swappingSlot.slotId]
        : benchSlots[swappingSlot.slotId];

    const targetPlayer =
      targetType === 'starter'
        ? draftedSlots[targetSlotId]
        : benchSlots[targetSlotId];

    // Swap in state
    if (swappingSlot.type === 'starter' && targetType === 'starter') {
      setDraftedSlots((prev) => {
        const copy = { ...prev };
        if (targetPlayer) copy[swappingSlot.slotId] = targetPlayer;
        else delete copy[swappingSlot.slotId];
        if (sourcePlayer) copy[targetSlotId] = sourcePlayer;
        else delete copy[targetSlotId];
        return copy;
      });
    } else if (swappingSlot.type === 'bench' && targetType === 'bench') {
      setBenchSlots((prev) => {
        const copy = { ...prev };
        if (targetPlayer) copy[swappingSlot.slotId] = targetPlayer;
        else delete copy[swappingSlot.slotId];
        if (sourcePlayer) copy[targetSlotId] = sourcePlayer;
        else delete copy[targetSlotId];
        return copy;
      });
    } else if (swappingSlot.type === 'bench' && targetType === 'starter') {
      setBenchSlots((prev) => {
        const copy = { ...prev };
        if (targetPlayer) copy[swappingSlot.slotId] = targetPlayer;
        else delete copy[swappingSlot.slotId];
        return copy;
      });
      setDraftedSlots((prev) => {
        const copy = { ...prev };
        if (sourcePlayer) copy[targetSlotId] = sourcePlayer;
        else delete copy[targetSlotId];
        return copy;
      });
    } else if (swappingSlot.type === 'starter' && targetType === 'bench') {
      setDraftedSlots((prev) => {
        const copy = { ...prev };
        if (targetPlayer) copy[swappingSlot.slotId] = targetPlayer;
        else delete copy[swappingSlot.slotId];
        return copy;
      });
      setBenchSlots((prev) => {
        const copy = { ...prev };
        if (sourcePlayer) copy[targetSlotId] = sourcePlayer;
        else delete copy[targetSlotId];
        return copy;
      });
    }

    setSwappingSlot(null);
  };

  // Handler: Auto-Fill Entire 20-Player All-Stars Squad
  const handleAutoFill20 = () => {
    try {
      soundManager.playPickSound();
    } catch (e) {}

    const newStarters: Record<string, PlayerVersion> = {};
    const newBench: Record<string, PlayerVersion> = {};
    const usedIds: string[] = [];

    // 1. Fill 11 Starters
    for (const slot of formation.slots) {
      const eligible = allPlayers.filter(
        (p) => !usedIds.includes(p.identityId) && isPlayerEligibleForSlot(p, slot)
      );
      const best = eligible.sort((a, b) => b.ovr - a.ovr)[0] || allPlayers[0];
      newStarters[slot.id] = best;
      usedIds.push(best.identityId);
    }

    // 2. Fill 9 Substitutes
    for (const bSlot of DREAM_TEAM_BENCH_SLOTS) {
      const eligible = allPlayers.filter(
        (p) =>
          !usedIds.includes(p.identityId) &&
          (bSlot.roleLabel === 'FLEX' ||
            p.naturalPositions.some((pos) => bSlot.eligiblePositions.includes(pos)) ||
            (p.secondaryPositions && p.secondaryPositions.some((pos) => bSlot.eligiblePositions.includes(pos))))
      );
      const best = eligible.sort((a, b) => b.ovr - a.ovr)[0];
      if (best) {
        newBench[bSlot.id] = best;
        usedIds.push(best.identityId);
      }
    }

    setDraftedSlots(newStarters);
    setBenchSlots(newBench);

    // 3. Assign Default Roles
    const starterEntries = Object.entries(newStarters);
    if (starterEntries.length > 0) {
      const topOvr = [...starterEntries].sort((a, b) => b[1].ovr - a[1].ovr)[0];
      const topShooter = [...starterEntries].sort((a, b) => {
        const aGoals = a[1].tournamentOrSeasonStats?.goals || 0;
        const bGoals = b[1].tournamentOrSeasonStats?.goals || 0;
        return (bGoals * 2 + b[1].ovr) - (aGoals * 2 + a[1].ovr);
      })[0];
      const topPlaymaker = [...starterEntries].sort((a, b) => {
        const aAssists = a[1].tournamentOrSeasonStats?.assists || 0;
        const bAssists = b[1].tournamentOrSeasonStats?.assists || 0;
        return (bAssists * 2 + b[1].ovr) - (aAssists * 2 + a[1].ovr);
      })[0];

      setRoles({
        captainSlotId: topOvr[0],
        penaltySlotId: topShooter[0],
        freeKickSlotId: topShooter[0],
        cornerSlotId: topPlaymaker[0],
      });
    }
  };

  // Handler: Save Dream Team
  const handleSaveDreamTeam = () => {
    if (!isStartersComplete) return;

    const slotsMap: Record<string, DraftedSlot> = {};
    for (const slot of formation.slots) {
      const player = draftedSlots[slot.id];
      if (player) {
        slotsMap[slot.id] = {
          slotId: slot.id,
          player,
          assignedPosition: slot.defaultPosition,
        };
      }
    }

    const benchSlotsMap: Record<string, DraftedSlot> = {};
    for (const bSlot of DREAM_TEAM_BENCH_SLOTS) {
      const player = benchSlots[bSlot.id];
      if (player) {
        benchSlotsMap[bSlot.id] = {
          slotId: bSlot.id,
          player,
          assignedPosition: bSlot.defaultPosition,
        };
      }
    }

    profileService.saveDreamTeam({
      name: teamName.trim() || 'My All-Time Dream XI',
      formationId: formation.id,
      customFormation: formation.isCustom ? formation : undefined,
      draftedSlots: slotsMap,
      benchSlots: benchSlotsMap,
      totalOvr: avgStarterOvr,
      squadOvr: avgSquadOvr,
      tactics,
      roles,
      savedAt: Date.now(),
    });

    try {
      soundManager.playVictoryFanfare();
    } catch (e) {}
    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-tactical-900 border border-tactical-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[96vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-tactical-750 bg-tactical-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team Name..."
                  maxLength={28}
                  className="bg-transparent border-b border-dashed border-tactical-600 focus:border-gold-500 text-sm sm:text-base font-black text-tactical-100 focus:outline-none px-1"
                />
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-mono font-bold border border-gold-500/30">
                  {avgStarterOvr > 0 ? `${avgStarterOvr} Starting OVR` : 'Custom XI'}
                </span>
                {totalSquadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-tactical-800 text-tactical-300 font-mono hidden md:inline">
                    Squad 20: {avgSquadOvr} OVR
                  </span>
                )}
              </div>
              <p className="text-[11px] text-tactical-400 mt-0.5">
                Build your complete 20-man dream squad with custom formation, tactics & roles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFill20}
              className="py-1.5 px-3 rounded-xl bg-tactical-800 hover:bg-tactical-750 text-gold-300 border border-gold-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Automatically fills all 11 starters and 9 bench players with the top ratings in the game!"
            >
              <Zap className="w-3.5 h-3.5 fill-gold-400" />
              <span className="hidden sm:inline">⚡ Auto-Fill 20 Stars</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDreamTeam}
              disabled={!isStartersComplete}
              className="py-1.5 px-4 rounded-xl bg-pitch-DEFAULT hover:bg-pitch-light disabled:opacity-40 disabled:cursor-not-allowed text-tactical-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-pitch-line transition-all active:scale-95 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Save Squad ({totalSquadCount}/20)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Subheader: Formation Selector Bar & Mode Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-tactical-850 border-b border-tactical-750 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Formation Picker Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-tactical-400 uppercase tracking-wider">Formation:</span>
            <button
              type="button"
              onClick={() => setIsFormationPickerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-tactical-800 hover:bg-tactical-750 border border-gold-500/50 text-gold-300 text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm group"
            >
              <Layers className="w-3.5 h-3.5 text-gold-400" />
              <span>{formation.name}</span>
              <span className="text-[10px] text-tactical-400 group-hover:text-tactical-200 font-mono">
                (Change ▾)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsFormationStudioOpen(true)}
              className="p-1.5 rounded-xl bg-tactical-800 hover:bg-tactical-750 border border-tactical-700 text-tactical-300 hover:text-tactical-100 text-xs font-bold transition-all"
              title="Open Formation Studio to design a custom layout"
            >
              🛠️ Architect
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-tactical-900 p-1 rounded-xl border border-tactical-750">
            <button
              type="button"
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Starting XI ({startersCount}/11)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bench')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bench'
                  ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bench ({benchCount}/9)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tactics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tactics'
                  ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tactics & Roles</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'roster'
                  ? 'bg-pitch-DEFAULT text-tactical-100 shadow'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <span>📋 20-Man Squad</span>
            </button>
          </div>
        </div>

        {/* Swapping Banner Notice */}
        {swappingSlot && (
          <div className="bg-amber-950/90 border-b border-amber-600/50 px-4 py-2 flex items-center justify-between text-xs text-amber-200 animate-pulse shrink-0">
            <span className="flex items-center gap-1.5 font-bold">
              <ArrowUpDown className="w-4 h-4 text-amber-400" />
              <span>
                Swapping mode: Click any slot on the pitch or bench to exchange players!
              </span>
            </span>
            <button
              onClick={() => setSwappingSlot(null)}
              className="px-2 py-0.5 rounded bg-tactical-800 text-tactical-200 font-bold hover:bg-tactical-700"
            >
              Cancel ✕
            </button>
          </div>
        )}

        {/* Main Work Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          {/* TAB 1: Starting XI Pitch View */}
          {activeTab === 'pitch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              {/* Left Column: Interactive Pitch */}
              <div className="lg:col-span-6 bg-tactical-950 border border-tactical-800 rounded-2xl p-3 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-pitch-accent" />
                    <span>Tactical Formation Pitch</span>
                  </span>
                  <span className="text-xs text-gold-400 font-mono font-bold">
                    Starting 11: {avgStarterOvr} OVR
                  </span>
                </div>

                {/* Pitch Canvas */}
                <div className="relative aspect-[4/5] bg-pitch-DEFAULT/40 border border-pitch-line/50 rounded-xl overflow-hidden p-2 shadow-inner">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-pitch-line/40 pointer-events-none" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-pitch-line/40 pointer-events-none" />

                  {formation.slots.map((slot) => {
                    const player = draftedSlots[slot.id];
                    const isSelected = activeSlotTarget?.slotId === slot.id && activeSlotTarget.type === 'starter';
                    const isSwapSelected = swappingSlot?.slotId === slot.id && swappingSlot.type === 'starter';
                    const isCaptain = roles.captainSlotId === slot.id;
                    const isPenalty = roles.penaltySlotId === slot.id;
                    const isFreeKick = roles.freeKickSlotId === slot.id;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => {
                          if (swappingSlot) {
                            handleExecuteSwap('starter', slot.id);
                          } else {
                            setActiveSlotTarget({ type: 'starter', slotId: slot.id });
                          }
                        }}
                        style={{
                          left: `${slot.coordinates.x}%`,
                          top: `${slot.coordinates.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute cursor-pointer transition-all ${
                          isSelected || isSwapSelected
                            ? 'ring-2 ring-gold-400 scale-110 z-20'
                            : player
                            ? 'opacity-100 hover:scale-105 z-10'
                            : 'opacity-75 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold shadow-md border relative ${
                            player
                              ? 'bg-tactical-850 border-gold-500/70 text-gold-300'
                              : isSelected
                              ? 'bg-gold-500 text-tactical-950 border-gold-400 animate-pulse font-black'
                              : 'bg-tactical-800 border-tactical-600 text-tactical-400'
                          }`}
                        >
                          <span>{player ? player.ovr : slot.defaultPosition}</span>

                          {/* Role Badges */}
                          {isCaptain && (
                            <span className="absolute -top-1 -right-1 text-[11px]" title="Team Captain">
                              👑
                            </span>
                          )}
                          {!isCaptain && isPenalty && (
                            <span className="absolute -top-1 -right-1 text-[10px]" title="Penalty Taker">
                              ⚽
                            </span>
                          )}
                          {!isCaptain && !isPenalty && isFreeKick && (
                            <span className="absolute -top-1 -right-1 text-[10px]" title="Free Kick Taker">
                              🎯
                            </span>
                          )}
                        </div>

                        {player ? (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-tactical-950/95 px-1.5 py-0.2 rounded text-[9px] font-mono text-tactical-200 border border-tactical-800 pointer-events-none">
                            {player.name.split(' ').pop()}
                          </div>
                        ) : (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-tactical-900/90 px-1 py-0.2 rounded text-[8px] font-mono text-tactical-400 pointer-events-none">
                            {slot.defaultPosition}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] text-tactical-400 text-center mt-2">
                  Click any slot to assign or swap. Starters match your tactical formation.
                </div>
              </div>

              {/* Right Column: Player Selector Drawer or Starters List */}
              <div className="lg:col-span-6 bg-tactical-950 border border-tactical-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                {activeSlotTarget ? (
                  /* Player Picker Drawer */
                  renderCandidatePicker()
                ) : (
                  /* Starters List */
                  <div className="space-y-3 flex flex-col h-full">
                    <div className="flex items-center justify-between pb-2 border-b border-tactical-800 shrink-0">
                      <div>
                        <span className="text-xs font-bold text-tactical-200 uppercase tracking-wider">
                          Starting XI Lineup
                        </span>
                        <div className="text-[11px] text-tactical-400">
                          {startersCount}/11 Starters Assigned
                        </div>
                      </div>
                      <span className="text-xs text-gold-400 font-mono font-bold">
                        Avg: {avgStarterOvr} OVR
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[460px]">
                      {formation.slots.map((slot) => {
                        const player = draftedSlots[slot.id];
                        return (
                          <div
                            key={slot.id}
                            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                              player
                                ? 'bg-tactical-900 border-tactical-750 hover:border-tactical-600'
                                : 'bg-tactical-950/50 border-dashed border-tactical-750 hover:border-gold-500/40'
                            }`}
                          >
                            <div
                              onClick={() => setActiveSlotTarget({ type: 'starter', slotId: slot.id })}
                              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                            >
                              <span className="w-8 text-[11px] font-bold text-tactical-400 font-mono">
                                {slot.defaultPosition}
                              </span>
                              {player ? (
                                <>
                                  <span
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                      player.ovr
                                    )}`}
                                  >
                                    {player.ovr}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-tactical-100 truncate flex items-center gap-1.5">
                                      <span>{player.name}</span>
                                      {roles.captainSlotId === slot.id && (
                                        <span className="text-xs" title="Captain">
                                          👑
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-tactical-400 font-mono truncate">
                                      {player.naturalPositions.join('/')} • #{player.squadNumber} • {player.ovr} OVR
                                      {player.tournamentOrSeasonStats?.goals ? ` • ${player.tournamentOrSeasonStats.goals} G` : ''}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-tactical-500 italic">
                                  + Empty Slot (Click to assign)
                                </span>
                              )}
                            </div>

                            {player && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSwappingSlot({ type: 'starter', slotId: slot.id })}
                                  className="px-2 py-1 rounded bg-tactical-800 hover:bg-tactical-700 text-tactical-300 text-[10px] font-bold border border-tactical-700"
                                  title="Swap this starter with another player or bench sub"
                                >
                                  ⇄ Swap
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot('starter', slot.id)}
                                  className="text-tactical-500 hover:text-red-400 text-xs px-2 py-1"
                                  title="Remove player from slot"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Substitutes Bench (9 Slots) */}
          {activeTab === 'bench' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              {/* Left Column: 9 Bench Slots Grid */}
              <div className="lg:col-span-7 bg-tactical-950 border border-tactical-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-tactical-800 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-tactical-100 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-pitch-accent" />
                        <span>Substitutes & Reserves Bench (9 Slots)</span>
                      </h3>
                      <p className="text-[11px] text-tactical-400">
                        Backup depth for every department. Swap into the Starting XI anytime!
                      </p>
                    </div>
                    <span className="text-xs text-gold-400 font-mono font-bold">
                      {benchCount}/9 Assigned
                    </span>
                  </div>

                  {/* 9 Bench Slots List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {DREAM_TEAM_BENCH_SLOTS.map((bSlot) => {
                      const player = benchSlots[bSlot.id];
                      const isSelected = activeSlotTarget?.slotId === bSlot.id && activeSlotTarget.type === 'bench';
                      const isSwapSelected = swappingSlot?.slotId === bSlot.id && swappingSlot.type === 'bench';

                      return (
                        <div
                          key={bSlot.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                            isSelected || isSwapSelected
                              ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30'
                              : player
                              ? 'bg-tactical-900 border-tactical-750 hover:border-tactical-600'
                              : 'bg-tactical-950/40 border-dashed border-tactical-750 hover:border-gold-500/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold text-tactical-400 uppercase font-mono">
                              {bSlot.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-tactical-800 text-tactical-300 font-mono">
                              {bSlot.roleLabel}
                            </span>
                          </div>

                          {player ? (
                            <div className="flex items-center justify-between gap-2">
                              <div
                                onClick={() => setActiveSlotTarget({ type: 'bench', slotId: bSlot.id })}
                                className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                              >
                                <span
                                  className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                    player.ovr
                                  )}`}
                                >
                                  {player.ovr}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-tactical-100 truncate">
                                    {player.name}
                                  </div>
                                  <div className="text-[10px] text-tactical-400 font-mono">
                                    {player.naturalPositions.join('/')}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSwappingSlot({ type: 'bench', slotId: bSlot.id })}
                                  className="px-2 py-1 rounded bg-tactical-800 hover:bg-tactical-700 text-tactical-300 text-[10px] font-bold border border-tactical-700"
                                  title="Swap into Starting XI"
                                >
                                  ⇄ Swap
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot('bench', bSlot.id)}
                                  className="text-tactical-500 hover:text-red-400 text-xs px-1.5 py-1"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (swappingSlot) {
                                  handleExecuteSwap('bench', bSlot.id);
                                } else {
                                  setActiveSlotTarget({ type: 'bench', slotId: bSlot.id });
                                }
                              }}
                              className="py-2 text-center text-xs text-tactical-500 hover:text-gold-400 italic rounded-lg bg-tactical-950/60 hover:bg-tactical-900 border border-tactical-800/80 transition-all"
                            >
                              + Assign Bench Sub
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-tactical-400 text-center mt-3 pt-2 border-t border-tactical-800">
                  Total Squad Capacity: 11 Starters + 9 Substitutes = <strong>20 Players</strong>.
                </div>
              </div>

              {/* Right Column: Candidate Picker Drawer */}
              <div className="lg:col-span-5 bg-tactical-950 border border-tactical-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                {activeSlotTarget ? (
                  renderCandidatePicker()
                ) : (
                  <div className="p-8 text-center space-y-3 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-tactical-900 border border-tactical-750 flex items-center justify-center mx-auto text-tactical-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-tactical-200">Select Any Bench Slot</h4>
                    <p className="text-xs text-tactical-400 max-w-xs mx-auto">
                      Click any slot on the left to browse and assign backup goalkeepers, defenders, midfielders, wingers, and strikers from history.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Tactics & Leadership Roles */}
          {activeTab === 'tactics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              {/* Tactical Instructions Column */}
              <div className="lg:col-span-6 bg-tactical-950 border border-tactical-800 rounded-2xl p-5 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-tactical-800">
                  <h3 className="text-xs font-bold text-tactical-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-pitch-accent" />
                    <span>Team Tactical Philosophy</span>
                  </h3>
                  <span className="text-[10px] text-tactical-400 font-mono">In-Match Execution</span>
                </div>

                {/* 1. Mentality */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Tactical Mentality</span>
                    <span className="text-[10px] text-gold-400 font-mono capitalize">
                      {tactics.mentality?.replace('_', ' ')}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'defensive', label: '🛡️ Defensive', desc: 'Protect lead & counter' },
                      { id: 'balanced', label: '⚖️ Balanced', desc: 'Standard control' },
                      { id: 'attacking', label: '⚔️ Attacking', desc: 'Aggressive push' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTactics((prev) => ({ ...prev, mentality: m.id as LiveMentality }))}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          tactics.mentality === m.id
                            ? 'bg-tactical-800 border-gold-500 text-gold-300 ring-2 ring-gold-500/30'
                            : 'bg-tactical-900 border-tactical-800 text-tactical-400 hover:text-tactical-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[9px] text-tactical-400 mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Defensive Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Defensive Line & Pressing</span>
                    <span className="text-[10px] text-gold-400 font-mono capitalize">
                      {tactics.defensiveStyle?.replace('_', ' ')}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low_block', label: 'Low Block', desc: 'Drop deep & pack box' },
                      { id: 'mid_block', label: 'Mid Block', desc: 'Compact mid shape' },
                      { id: 'high_press', label: 'High Press', desc: 'Suffocate opponent high' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() =>
                          setTactics((prev) => ({ ...prev, defensiveStyle: d.id as DefensiveStyle }))
                        }
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          tactics.defensiveStyle === d.id
                            ? 'bg-tactical-800 border-pitch-accent text-pitch-accent ring-2 ring-pitch-accent/30'
                            : 'bg-tactical-900 border-tactical-800 text-tactical-400 hover:text-tactical-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{d.label}</div>
                        <div className="text-[9px] text-tactical-400 mt-0.5">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Passing Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                    <span>3. Build-Up & Passing Style</span>
                    <span className="text-[10px] text-gold-400 font-mono capitalize">
                      {tactics.passingStyle?.replace('_', ' ')}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'tiki_taka', label: 'Tiki-Taka', desc: 'Short patient passing' },
                      { id: 'direct', label: 'Direct Counter', desc: 'Fast vertical release' },
                      { id: 'wing_play', label: 'Wing Play', desc: 'Crosses & wide overload' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTactics((prev) => ({ ...prev, passingStyle: p.id as PassingStyle }))}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          tactics.passingStyle === p.id
                            ? 'bg-tactical-800 border-blue-400 text-blue-300 ring-2 ring-blue-400/30'
                            : 'bg-tactical-900 border-tactical-800 text-tactical-400 hover:text-tactical-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.label}</div>
                        <div className="text-[9px] text-tactical-400 mt-0.5">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leadership & Set-Piece Roles Column */}
              <div className="lg:col-span-6 bg-tactical-950 border border-tactical-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-tactical-800">
                  <h3 className="text-xs font-bold text-tactical-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-gold-400" />
                    <span>Special Leadership & Set-Piece Roles</span>
                  </h3>
                  <span className="text-[10px] text-tactical-400 font-mono">Starting 11 Assigned</span>
                </div>

                {/* Role 1: Team Captain */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-tactical-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-gold-400" />
                    <span>👑 Team Captain (Leadership & Composure)</span>
                  </label>
                  <select
                    value={roles.captainSlotId || ''}
                    onChange={(e) => setRoles((r) => ({ ...r, captainSlotId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-tactical-850 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">-- Choose Captain --</option>
                    {formation.slots.map((s) => {
                      const p = draftedSlots[s.id];
                      if (!p) return null;
                      return (
                        <option key={s.id} value={s.id}>
                          {p.name} ({s.defaultPosition} • {p.ovr} OVR)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Role 2: Penalty Taker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-tactical-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    <span>⚽ Primary Penalty Taker</span>
                  </label>
                  <select
                    value={roles.penaltySlotId || ''}
                    onChange={(e) => setRoles((r) => ({ ...r, penaltySlotId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-tactical-850 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">-- Choose Penalty Specialist --</option>
                    {formation.slots.map((s) => {
                      const p = draftedSlots[s.id];
                      if (!p) return null;
                      return (
                        <option key={s.id} value={s.id}>
                          {p.name} ({s.defaultPosition} • {p.ovr} OVR{p.tournamentOrSeasonStats?.goals ? ` • ${p.tournamentOrSeasonStats.goals} G` : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Role 3: Direct Free Kick Specialist */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-tactical-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>🎯 Direct Free Kick Taker</span>
                  </label>
                  <select
                    value={roles.freeKickSlotId || ''}
                    onChange={(e) => setRoles((r) => ({ ...r, freeKickSlotId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-tactical-850 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">-- Choose Free Kick Specialist --</option>
                    {formation.slots.map((s) => {
                      const p = draftedSlots[s.id];
                      if (!p) return null;
                      return (
                        <option key={s.id} value={s.id}>
                          {p.name} ({s.defaultPosition} • {p.ovr} OVR{p.tournamentOrSeasonStats?.goals ? ` • ${p.tournamentOrSeasonStats.goals} G` : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Role 4: Corner Kick Specialist */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-tactical-300 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-blue-400" />
                    <span>🚩 Corner Kick Taker</span>
                  </label>
                  <select
                    value={roles.cornerSlotId || ''}
                    onChange={(e) => setRoles((r) => ({ ...r, cornerSlotId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-tactical-850 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">-- Choose Corner Specialist --</option>
                    {formation.slots.map((s) => {
                      const p = draftedSlots[s.id];
                      if (!p) return null;
                      return (
                        <option key={s.id} value={s.id}>
                          {p.name} ({s.defaultPosition} • {p.ovr} OVR{p.tournamentOrSeasonStats?.assists ? ` • ${p.tournamentOrSeasonStats.assists} A` : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Full 20-Man Squad Overview Roster */}
          {activeTab === 'roster' && (
            <div className="bg-tactical-950 border border-tactical-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-tactical-800">
                <div>
                  <h3 className="text-sm font-bold text-tactical-100 flex items-center gap-2">
                    <span>Complete 20-Player Roster Overview</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-tactical-800 text-gold-300 font-mono">
                      {totalSquadCount}/20 Players
                    </span>
                  </h3>
                  <p className="text-xs text-tactical-400">
                    All players assigned to your Starting XI and Reserves Bench.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-gold-300">Starters Avg: {avgStarterOvr} OVR</span>
                  <span className="text-tactical-400">•</span>
                  <span className="text-emerald-300">Squad Avg: {avgSquadOvr} OVR</span>
                </div>
              </div>

              {/* Roster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 11 Starters */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Starting XI ({startersCount}/11)</span>
                    <span className="text-gold-400 font-mono">{formation.name}</span>
                  </div>

                  <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                    {formation.slots.map((slot) => {
                      const player = draftedSlots[slot.id];
                      return (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-xl bg-tactical-900 border border-tactical-750 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 text-[11px] font-bold text-tactical-400 font-mono">
                              {slot.defaultPosition}
                            </span>
                            {player ? (
                              <>
                                <span
                                  className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                    player.ovr
                                  )}`}
                                >
                                  {player.ovr}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-tactical-100 truncate flex items-center gap-1.5">
                                    <span>{player.name}</span>
                                    {roles.captainSlotId === slot.id && <span>👑</span>}
                                  </div>
                                  <div className="text-[10px] text-tactical-400 font-mono">
                                    {player.naturalPositions.join('/')}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-tactical-500 italic">Unassigned</span>
                            )}
                          </div>

                          <span className="text-[10px] px-2 py-0.5 rounded bg-pitch-DEFAULT/30 text-pitch-accent border border-pitch-line/50 font-bold uppercase">
                            Starter
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 9 Substitutes */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Substitutes & Reserves ({benchCount}/9)</span>
                    <span className="text-tactical-400 font-mono">Bench</span>
                  </div>

                  <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                    {DREAM_TEAM_BENCH_SLOTS.map((bSlot) => {
                      const player = benchSlots[bSlot.id];
                      return (
                        <div
                          key={bSlot.id}
                          className="p-2.5 rounded-xl bg-tactical-900 border border-tactical-750 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-10 text-[10px] font-bold text-tactical-400 font-mono">
                              {bSlot.roleLabel}
                            </span>
                            {player ? (
                              <>
                                <span
                                  className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                                    player.ovr
                                  )}`}
                                >
                                  {player.ovr}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-tactical-100 truncate">
                                    {player.name}
                                  </div>
                                  <div className="text-[10px] text-tactical-400 font-mono">
                                    {player.naturalPositions.join('/')}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-tactical-500 italic">Unassigned</span>
                            )}
                          </div>

                          <span className="text-[10px] px-2 py-0.5 rounded bg-tactical-800 text-tactical-300 border border-tactical-700 font-bold uppercase">
                            Bench
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formation Picker Modal Overlay */}
        {isFormationPickerOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFormationPickerOpen(false);
            }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-tactical-900 border border-tactical-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-tactical-750 flex items-center justify-between shrink-0 bg-tactical-950">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gold-400" />
                  <h3 className="text-base font-extrabold text-tactical-100">
                    Select Tactical Formation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormationPickerOpen(false)}
                  className="p-1 rounded text-tactical-400 hover:text-tactical-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                {/* Custom Formations (if any) */}
                {customFormations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>✨ Your Custom Formations ({customFormations.length})</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {customFormations.map((cf) => (
                        <div
                          key={cf.id}
                          onClick={() => {
                            setFormationId(cf.id);
                            setSelectedCustomFormation(cf);
                            setDraftedSlots({});
                            setActiveSlotTarget(null);
                            setIsFormationPickerOpen(false);
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            formationId === cf.id
                              ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30'
                              : 'bg-tactical-850 border-tactical-750 hover:border-gold-500/40'
                          }`}
                        >
                          <div className="font-bold text-xs text-tactical-100">{cf.name}</div>
                          <div className="text-[10px] text-tactical-400 mt-0.5">
                            Custom design • 11 slots
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preset Formations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
                      Preset Tactical Systems (12 Systems)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormationPickerOpen(false);
                        setIsFormationStudioOpen(true);
                      }}
                      className="text-xs text-pitch-accent hover:underline font-bold"
                    >
                      + Create Custom in Studio
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(FORMATIONS).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          setFormationId(f.id);
                          setSelectedCustomFormation(undefined);
                          setDraftedSlots({});
                          setActiveSlotTarget(null);
                          setIsFormationPickerOpen(false);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formationId === f.id
                            ? 'bg-tactical-800 border-gold-500 ring-2 ring-gold-500/30'
                            : 'bg-tactical-850 border-tactical-750 hover:border-tactical-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-tactical-100">{f.name}</span>
                          <span className="text-[10px] font-mono text-gold-400">{f.id}</span>
                        </div>
                        <p className="text-[11px] text-tactical-400 mt-1 line-clamp-2 leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formation Studio Modal directly integrated */}
        {isFormationStudioOpen && (
          <FormationStudioModal
            isOpen={isFormationStudioOpen}
            onClose={() => {
              setIsFormationStudioOpen(false);
              setCustomFormations(getCustomFormations());
            }}
            onSelectFormation={(custom) => {
              setSelectedCustomFormation(custom);
              setFormationId(custom.id);
              setCustomFormations(getCustomFormations());
              setDraftedSlots({});
              setIsFormationStudioOpen(false);
            }}
            initialFormation={selectedCustomFormation}
          />
        )}
      </div>
    </div>
  );

  // Helper: Renders Candidate Player Picker Drawer for Active Slot
  function renderCandidatePicker() {
    if (!currentActiveSlotDef) return null;

    return (
      <div className="space-y-3 flex flex-col h-full animate-fade-in">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-2 border-b border-tactical-800 shrink-0">
          <div>
            <span className="text-[10px] text-tactical-400 uppercase font-mono">
              Assigning {activeSlotTarget?.type === 'starter' ? 'Starting Slot' : 'Bench Reserve'}
            </span>
            <h3 className="text-sm font-bold text-tactical-100 flex items-center gap-2">
              <span>{currentActiveSlotDef.name}</span>
              <span className="text-xs text-gold-400 font-mono">
                ({candidatePlayers.length} Candidates)
              </span>
            </h3>
          </div>

          <button
            onClick={() => setActiveSlotTarget(null)}
            className="text-xs text-tactical-400 hover:text-tactical-200 px-2 py-1 rounded bg-tactical-850"
          >
            ✕ Back
          </button>
        </div>

        {/* Search & Position Filters */}
        <div className="space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-tactical-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search players for ${currentActiveSlotDef.defaultPosition}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-tactical-850 border border-tactical-700 text-xs text-tactical-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setPositionFilter(group)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  positionFilter === group
                    ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                    : 'bg-tactical-900 text-tactical-400 border-tactical-800 hover:text-tactical-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Player List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[380px]">
          {candidatePlayers.slice(0, 50).map((player) => {
            const edition = allEditions.find((e) => e.id === player.editionId);
            return (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="p-2.5 rounded-xl bg-tactical-900 hover:bg-tactical-850 border border-tactical-750 hover:border-gold-500/70 cursor-pointer transition-all flex items-center justify-between shadow-sm active:scale-98"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${getOvrBadgeClass(
                      player.ovr
                    )}`}
                  >
                    {player.ovr}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-tactical-100 truncate">
                      {player.name}
                    </div>
                    <div className="text-[10px] text-tactical-400 font-mono">
                      {edition?.teamName || 'Classic'} ({edition?.yearOrSeason || '1990'}) • {player.naturalPositions.join('/')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlayer(player);
                  }}
                  className="px-3 py-1 rounded-lg bg-pitch-DEFAULT/20 hover:bg-pitch-DEFAULT text-pitch-accent hover:text-tactical-100 border border-pitch-line/40 text-xs font-bold transition-all active:scale-95 shrink-0"
                >
                  Select →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};
