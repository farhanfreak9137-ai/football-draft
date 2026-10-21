import React, { useState, useMemo, useEffect } from 'react';
import {
  FormationDefinition,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  TeamEdition,
  TournamentDraftMode,
} from '../../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { DraftEngine } from '../../shared/engine/draftEngine.js';
import { offlineSoloEngine } from '../services/offlineSoloEngine.js';
import { soundManager } from '../utils/audio.js';
import { getOvrBadgeClass } from '../utils/ovrColor.js';
import {
  Dice5,
  Layers,
  Star,
  RefreshCw,
  Check,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
  X,
  Search,
} from 'lucide-react';

interface SoloDraftStudioProps {
  draftMode: TournamentDraftMode; // 'pack_roll' | 'five_card' | 'star_budget'
  poolType: PoolType;
  formationId: string;
  customFormation?: FormationDefinition;
  managerName: string;
  onComplete: (draftState: PlayerDraftState, saveAsDreamTeam: boolean) => void;
  onCancel: () => void;
}

export function calculateStarCost(ovr: number): number {
  if (ovr >= 93) return 15;
  if (ovr >= 90) return 12;
  if (ovr >= 87) return 10;
  if (ovr >= 84) return 8;
  if (ovr >= 81) return 6;
  return 4;
}

export const SoloDraftStudio: React.FC<SoloDraftStudioProps> = ({
  draftMode,
  poolType,
  formationId,
  customFormation,
  managerName,
  onComplete,
  onCancel,
}) => {
  const formation = useMemo(() => {
    return customFormation || FORMATIONS[formationId] || FORMATIONS['4-3-3'];
  }, [formationId, customFormation]);

  const allPlayers = useMemo(() => offlineSoloEngine.getPlayers(), []);
  const allEditions = useMemo(() => {
    const pool = offlineSoloEngine.getEditions().filter((e) => e.editionType === poolType);
    return pool.length > 0 ? pool : offlineSoloEngine.getEditions();
  }, [poolType]);

  // Draft State
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [draftedSlots, setDraftedSlots] = useState<Record<string, PlayerVersion>>({});
  const [usedIdentityIds, setUsedIdentityIds] = useState<string[]>([]);
  const [saveAsDreamTeam, setSaveAsDreamTeam] = useState(true);

  // Mode A: Pack Roll State
  const [packRollEdition, setPackRollEdition] = useState<TeamEdition | null>(null);
  const [packRerollsLeft, setPackRerollsLeft] = useState(4);
  const [isRolling, setIsRolling] = useState(false);

  // Mode B: 5-Card Pick State
  const [fiveCardChoices, setFiveCardChoices] = useState<PlayerVersion[]>([]);
  const [wildcardsLeft, setWildcardsLeft] = useState(2);

  // Mode C: Star Budget State
  const [starBudget, setStarBudget] = useState(100);
  const [selectedSlotForBudget, setSelectedSlotForBudget] = useState<string | null>(null);
  const [budgetSearchQuery, setBudgetSearchQuery] = useState('');

  const currentSlot = formation.slots[currentSlotIndex] || formation.slots[0];
  const isDraftComplete = Object.keys(draftedSlots).length === formation.slots.length;

  // Helper: Roll a team edition that has eligible players for the slot
  const rollPackEditionForSlot = (targetSlot: typeof currentSlot, excludeEditionId?: string) => {
    setIsRolling(true);
    try {
      soundManager.playRerollSound();
    } catch (e) {}

    setTimeout(() => {
      // Find editions with at least 1 eligible, unused player for this slot
      let eligibleEditions = allEditions.filter((ed) => {
        if (excludeEditionId && ed.id === excludeEditionId && allEditions.length > 1) {
          return false;
        }
        const teamPlayers = allPlayers.filter((p) => p.editionId === ed.id);
        return teamPlayers.some(
          (p) =>
            !usedIdentityIds.includes(p.identityId) &&
            isPlayerEligibleForSlot(p, targetSlot)
        );
      });

      // If filtering out current edition left no candidates, fall back to any eligible edition
      if (eligibleEditions.length === 0) {
        eligibleEditions = allEditions.filter((ed) => {
          const teamPlayers = allPlayers.filter((p) => p.editionId === ed.id);
          return teamPlayers.some(
            (p) =>
              !usedIdentityIds.includes(p.identityId) &&
              isPlayerEligibleForSlot(p, targetSlot)
          );
        });
      }

      const pool = eligibleEditions.length > 0
        ? eligibleEditions
        : allEditions.filter((ed) => {
            const teamPlayers = allPlayers.filter((p) => p.editionId === ed.id);
            return teamPlayers.some((p) => isPlayerEligibleForSlot(p, targetSlot));
          });

      const finalPool = pool.length > 0 ? pool : allEditions;
      const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
      setPackRollEdition(chosen);
      setIsRolling(false);
    }, 200);
  };

  // Helper: Draw 5 unique cards for current slot position
  const drawFiveCardsForSlot = (targetSlot: typeof currentSlot) => {
    try {
      soundManager.playRerollSound();
    } catch (e) {}

    const eligible = allPlayers.filter(
      (p) =>
        !usedIdentityIds.includes(p.identityId) &&
        isPlayerEligibleForSlot(p, targetSlot)
    );
    const pool = eligible.length >= 5 ? eligible : allPlayers.filter((p) => isPlayerEligibleForSlot(p, targetSlot));
    // Shuffle and pick 5 from diverse editions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen: PlayerVersion[] = [];
    const usedEditions = new Set<string>();

    for (const p of shuffled) {
      if (!usedEditions.has(p.editionId) || chosen.length >= 4) {
        chosen.push(p);
        usedEditions.add(p.editionId);
        if (chosen.length === 5) break;
      }
    }
    // If fewer than 5 from distinct editions, fill up
    if (chosen.length < 5) {
      for (const p of shuffled) {
        if (!chosen.some((c) => c.id === p.id)) {
          chosen.push(p);
          if (chosen.length === 5) break;
        }
      }
    }
    setFiveCardChoices(chosen.sort((a, b) => b.ovr - a.ovr));
  };

  // Initialize slot selection on slot change
  useEffect(() => {
    if (isDraftComplete) return;
    if (draftMode === 'pack_roll' || draftMode === 'campaign') {
      rollPackEditionForSlot(currentSlot);
    } else if (draftMode === 'five_card') {
      drawFiveCardsForSlot(currentSlot);
    }
  }, [currentSlotIndex, draftMode]);

  // Handle Pick in Pack-Roll or 5-Card
  const handleSelectPlayer = (player: PlayerVersion) => {
    try {
      soundManager.playPickSound();
    } catch (e) {}

    const updatedDrafted = { ...draftedSlots, [currentSlot.id]: player };
    const updatedIdentities = [...usedIdentityIds, player.identityId];
    setDraftedSlots(updatedDrafted);
    setUsedIdentityIds(updatedIdentities);

    if (currentSlotIndex + 1 < formation.slots.length) {
      setCurrentSlotIndex(currentSlotIndex + 1);
    }
  };

  // Reroll in Pack-Roll Mode
  const handleRerollPack = () => {
    if (packRerollsLeft <= 0 || isRolling) return;
    setPackRerollsLeft((prev) => prev - 1);
    rollPackEditionForSlot(currentSlot, packRollEdition?.id);
  };

  // Wildcard Reshuffle in 5-Card Mode
  const handleReshuffleFiveCards = () => {
    if (wildcardsLeft <= 0) return;
    setWildcardsLeft((prev) => prev - 1);
    drawFiveCardsForSlot(currentSlot);
  };

  // Mode C: Star Budget pick
  const handleSelectBudgetPlayer = (slotId: string, player: PlayerVersion) => {
    const cost = calculateStarCost(player.ovr);
    const existingPlayer = draftedSlots[slotId];
    const existingCost = existingPlayer ? calculateStarCost(existingPlayer.ovr) : 0;
    const netCost = cost - existingCost;

    if (starBudget - netCost < 0) return;

    soundManager.playPickSound();
    setStarBudget((prev) => prev - netCost);
    setDraftedSlots((prev) => ({ ...prev, [slotId]: player }));
    setUsedIdentityIds((prev) => {
      const filtered = existingPlayer ? prev.filter((id) => id !== existingPlayer.identityId) : prev;
      return [...filtered, player.identityId];
    });
    setSelectedSlotForBudget(null);
  };

  // Mode C: Remove player from slot
  const handleRemoveBudgetPlayer = (slotId: string) => {
    const p = draftedSlots[slotId];
    if (!p) return;
    const cost = calculateStarCost(p.ovr);
    setStarBudget((prev) => prev + cost);
    setDraftedSlots((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
    setUsedIdentityIds((prev) => prev.filter((id) => id !== p.identityId));
  };

  // Final Confirmation
  const handleFinalizeDraft = () => {
    if (!isDraftComplete) return;

    const initialDraft = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'user-manager',
      playerName: managerName || 'My Dream XI',
      poolType,
      formationId: formation.id,
    });

    for (const slot of formation.slots) {
      const player = draftedSlots[slot.id];
      if (player) {
        initialDraft.draftedSlots[slot.id] = {
          slotId: slot.id,
          player,
          assignedPosition: slot.defaultPosition,
        };
      }
    }
    initialDraft.usedIdentityIds = [...usedIdentityIds];
    initialDraft.isReady = true;

    onComplete(initialDraft, saveAsDreamTeam);
  };

  // Pack roll candidate players
  const packEligiblePlayers = useMemo(() => {
    if (!packRollEdition) return [];
    return allPlayers.filter(
      (p) =>
        p.editionId === packRollEdition.id &&
        !usedIdentityIds.includes(p.identityId) &&
        isPlayerEligibleForSlot(p, currentSlot)
    );
  }, [packRollEdition, allPlayers, usedIdentityIds, currentSlot]);

  // Calculate Average OVR
  const draftedPlayersList = Object.values(draftedSlots);
  const avgOvr =
    draftedPlayersList.length > 0
      ? Math.round(draftedPlayersList.reduce((acc, p) => acc + p.ovr, 0) / draftedPlayersList.length)
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-tactical-950/95 backdrop-blur-md flex flex-col overflow-y-auto">
      {/* Header Bar with Safe-Area Padding */}
      <header
        className="sticky top-0 z-20 border-b border-tactical-800 bg-tactical-900/95 backdrop-blur px-4 sm:px-6 pb-3 flex items-center justify-between"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            {draftMode === 'five_card' ? (
              <Layers className="w-5 h-5" />
            ) : draftMode === 'star_budget' ? (
              <Star className="w-5 h-5 fill-gold-400" />
            ) : (
              <Dice5 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-tactical-100 uppercase tracking-wider flex items-center gap-2">
              <span>
                {draftMode === 'five_card'
                  ? '5-Card Pick Draft'
                  : draftMode === 'star_budget'
                  ? 'Star Budget Squad Builder'
                  : 'Historical Pack Roll Draft'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-tactical-800 text-tactical-300 font-mono">
                {formation.name}
              </span>
            </h2>
            <p className="text-xs text-tactical-400">
              {draftMode === 'star_budget'
                ? `100 Star Cap • Remaining: ${starBudget} ⭐`
                : `Round ${Math.min(currentSlotIndex + 1, 11)} of 11 • Target Slot: ${currentSlot.defaultPosition}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {draftedPlayersList.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tactical-800 border border-tactical-700 text-xs font-mono">
              <span className="text-tactical-400">Squad OVR:</span>
              <span className="text-gold-400 font-bold">{avgOvr}</span>
            </div>
          )}
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-400 hover:text-tactical-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Draft Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Mini Pitch / Squad Overview */}
        <div className="lg:col-span-5 bg-tactical-900 border border-tactical-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-tactical-300 tracking-wider uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-pitch-accent" />
                <span>Squad Slots ({draftedPlayersList.length}/11)</span>
              </span>
              <span className="text-xs text-tactical-400 font-mono">Avg OVR: {avgOvr}</span>
            </div>

            {/* Tactical Pitch Visualizer */}
            <div className="relative aspect-[4/5] bg-pitch-DEFAULT/40 border border-pitch-line/50 rounded-xl overflow-hidden p-2 flex flex-col justify-between shadow-inner">
              {/* Pitch Markings */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-pitch-line/40 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-pitch-line/40 pointer-events-none" />

              {/* Slot Nodes */}
              {formation.slots.map((slot, idx) => {
                const player = draftedSlots[slot.id];
                const isCurrent = idx === currentSlotIndex && !isDraftComplete && draftMode !== 'star_budget';
                const isBudgetSelected = selectedSlotForBudget === slot.id;

                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      if (draftMode === 'star_budget') {
                        setSelectedSlotForBudget(slot.id);
                      }
                    }}
                    style={{
                      left: `${slot.coordinates.x}%`,
                      top: `${slot.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute cursor-pointer transition-all ${
                      isCurrent || isBudgetSelected
                        ? 'ring-2 ring-gold-400 scale-110 z-10'
                        : player
                        ? 'opacity-100 hover:scale-105'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold shadow-md border ${
                        player
                          ? 'bg-tactical-850 border-gold-500/70 text-gold-300'
                          : isCurrent || isBudgetSelected
                          ? 'bg-gold-500 text-tactical-950 border-gold-400 animate-pulse font-black'
                          : 'bg-tactical-800 border-tactical-600 text-tactical-400'
                      }`}
                    >
                      <span>{player ? player.ovr : slot.defaultPosition}</span>
                    </div>
                    {player && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-tactical-950/90 px-1.5 py-0.2 rounded text-[9px] font-mono text-tactical-200 border border-tactical-800 pointer-events-none">
                        {player.name.split(' ').pop()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Draft Completion Card */}
          {isDraftComplete && (
            <div className="mt-4 p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Squad Complete!</span>
              </div>
              <label className="flex items-center justify-center gap-2 text-xs text-tactical-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsDreamTeam}
                  onChange={(e) => setSaveAsDreamTeam(e.target.checked)}
                  className="rounded border-tactical-700 text-gold-500 focus:ring-0"
                />
                <span>Save to Profile as My Dream Team</span>
              </label>
              <button
                onClick={handleFinalizeDraft}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-tactical-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <span>⚔️ Kick Off Tournament</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Active Draft Picker Based on Mode */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* ============================================================== */}
          {/* MODE A: PACK ROLL DRAFT */}
          {/* ============================================================== */}
          {(draftMode === 'pack_roll' || draftMode === 'campaign') && !isDraftComplete && (
            <div className="bg-tactical-900 border border-tactical-800 rounded-2xl p-5 space-y-5 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                {/* Pack Header */}
                <div className="flex items-center justify-between pb-4 border-b border-tactical-800">
                  <div>
                    <span className="text-[11px] text-tactical-400 uppercase tracking-widest font-mono">
                      Current Target Position
                    </span>
                    <h3 className="text-xl font-black text-gold-400 flex items-center gap-2">
                      <span>{currentSlot.defaultPosition}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-tactical-800 text-tactical-300 font-normal">
                        Slot #{currentSlotIndex + 1}
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={handleRerollPack}
                    disabled={packRerollsLeft <= 0 || isRolling}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-tactical-800 hover:bg-tactical-700 disabled:opacity-40 disabled:cursor-not-allowed border border-tactical-700 text-xs font-bold text-tactical-200 transition-all active:scale-95 shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                    <span>Reroll Team ({packRerollsLeft} left)</span>
                  </button>
                </div>

                {/* Team Card Display */}
                {packRollEdition && (
                  <div className="mt-4 p-4 rounded-xl bg-tactical-850 border border-tactical-700/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-tactical-400 uppercase tracking-wider font-mono">
                        Rolled Historical Edition
                      </span>
                      <h4 className="text-lg font-bold text-tactical-100 flex items-center gap-2">
                        <span>{packRollEdition.teamName}</span>
                        <span className="text-gold-400 font-mono">({packRollEdition.yearOrSeason})</span>
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-tactical-800 border border-tactical-700 text-xs font-mono text-tactical-300 uppercase">
                      {packRollEdition.editionType}
                    </span>
                  </div>
                )}

                {/* Eligible Players From Rolled Edition */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-xs font-bold text-tactical-400 tracking-wider uppercase">
                    Available {currentSlot.defaultPosition} Candidates:
                  </span>

                  {isRolling ? (
                    <div className="p-8 rounded-xl bg-tactical-850/60 border border-tactical-800 text-center space-y-2 animate-pulse">
                      <RefreshCw className="w-6 h-6 text-gold-400 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-tactical-300">Rolling Historical Team Pack...</p>
                    </div>
                  ) : packEligiblePlayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {packEligiblePlayers.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => handleSelectPlayer(player)}
                          className="group p-3 rounded-xl bg-tactical-850 hover:bg-tactical-800 border border-tactical-700 hover:border-gold-500/70 cursor-pointer transition-all flex items-center justify-between shadow-md active:scale-98"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs ${getOvrBadgeClass(
                                player.ovr
                              )}`}
                            >
                              {player.ovr}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-tactical-100 group-hover:text-gold-400 transition-colors">
                                {player.name}
                              </div>
                              <div className="text-[11px] text-tactical-400 flex items-center gap-2">
                                <span>#{player.squadNumber}</span>
                                <span>•</span>
                                <span>{player.naturalPositions.join('/')}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-pitch-accent group-hover:translate-x-1 transition-transform">
                            Pick →
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-tactical-850 border border-tactical-700 text-center space-y-3">
                      <p className="text-xs text-tactical-400">
                        No eligible {currentSlot.defaultPosition} players from {packRollEdition?.teamName}.
                      </p>
                      <button
                        onClick={() => rollPackEditionForSlot(currentSlot, packRollEdition?.id)}
                        className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-tactical-950 font-bold text-xs"
                      >
                        🎲 Free Reroll for another team
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-tactical-500 flex items-center gap-1.5 pt-4 border-t border-tactical-800">
                <Info className="w-3.5 h-3.5 text-tactical-400" />
                <span>
                  Select 1 player to fill this slot. You draft once and play the whole 7-game campaign with this squad!
                </span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE B: 5-CARD PICK DRAFT (FUT STYLE) */}
          {/* ============================================================== */}
          {draftMode === 'five_card' && !isDraftComplete && (
            <div className="bg-tactical-900 border border-tactical-800 rounded-2xl p-5 space-y-5 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-tactical-800">
                  <div>
                    <span className="text-[11px] text-tactical-400 uppercase tracking-widest font-mono">
                      Card Selection Round {currentSlotIndex + 1}/11
                    </span>
                    <h3 className="text-xl font-black text-gold-400 flex items-center gap-2">
                      <span>Pick Your {currentSlot.defaultPosition}</span>
                    </h3>
                  </div>

                  <button
                    onClick={handleReshuffleFiveCards}
                    disabled={wildcardsLeft <= 0}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-tactical-800 hover:bg-tactical-700 disabled:opacity-40 disabled:cursor-not-allowed border border-tactical-700 text-xs font-bold text-tactical-200 transition-all active:scale-95 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Wildcard Reshuffle ({wildcardsLeft} left)</span>
                  </button>
                </div>

                {/* 5 Cards Layout */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {fiveCardChoices.map((player) => {
                    const edition = allEditions.find((e) => e.id === player.editionId);
                    return (
                      <div
                        key={player.id}
                        onClick={() => handleSelectPlayer(player)}
                        className="group relative p-3 rounded-xl bg-tactical-850 hover:bg-tactical-800 border border-tactical-700 hover:border-gold-500 cursor-pointer transition-all flex flex-col justify-between text-center shadow-lg active:scale-95 hover:-translate-y-1"
                      >
                        <div className="space-y-2">
                          <div
                            className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-black text-base shadow-inner ${getOvrBadgeClass(
                              player.ovr
                            )}`}
                          >
                            {player.ovr}
                          </div>
                          <div className="text-xs font-bold text-tactical-100 group-hover:text-gold-400 line-clamp-1">
                            {player.name}
                          </div>
                          <div className="text-[10px] text-tactical-400 font-mono">
                            {edition?.teamName || 'Classic Team'} ({edition?.yearOrSeason || '1990'})
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-tactical-800 text-[10px] font-bold text-pitch-accent uppercase">
                          Select
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] text-tactical-500 flex items-center gap-1.5 pt-4 border-t border-tactical-800">
                <Info className="w-3.5 h-3.5 text-tactical-400" />
                <span>
                  Dealt 5 random historical choices for this position. Select the best tactical fit for your XI.
                </span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE C: STAR BUDGET SQUAD BUILDER */}
          {/* ============================================================== */}
          {draftMode === 'star_budget' && (
            <div className="bg-tactical-900 border border-tactical-800 rounded-2xl p-5 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                {/* Budget Header */}
                <div className="flex items-center justify-between pb-3 border-b border-tactical-800">
                  <div>
                    <h3 className="text-lg font-black text-tactical-100 flex items-center gap-2">
                      <span>Star Budget Squad Builder</span>
                    </h3>
                    <p className="text-xs text-tactical-400">
                      Tap any slot on the pitch or list below to assign players within your 100-star cap.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-400 font-mono text-sm font-black flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-gold-400" />
                    <span>{starBudget} / 100 Remaining</span>
                  </div>
                </div>

                {/* Slot List for Budget Picker */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {formation.slots.map((slot) => {
                    const player = draftedSlots[slot.id];
                    const cost = player ? calculateStarCost(player.ovr) : 0;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlotForBudget(slot.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedSlotForBudget === slot.id
                            ? 'bg-tactical-800 border-gold-400 ring-2 ring-gold-500/30'
                            : player
                            ? 'bg-tactical-850 border-tactical-700 hover:border-tactical-600'
                            : 'bg-tactical-950/60 border-dashed border-tactical-700 hover:border-gold-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-tactical-300">{slot.defaultPosition}</span>
                          {player ? (
                            <span className="text-[10px] text-gold-400 font-mono font-bold">{cost} ⭐</span>
                          ) : (
                            <span className="text-[10px] text-tactical-500 font-mono">+ Empty</span>
                          )}
                        </div>

                        {player ? (
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-tactical-100 truncate">{player.name}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveBudgetPlayer(slot.id);
                              }}
                              className="text-tactical-500 hover:text-red-400 text-xs ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-tactical-500 italic">Tap to choose</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slot Player Selection Modal / Drawer */}
              {selectedSlotForBudget && (
                <div className="p-4 rounded-xl bg-tactical-850 border border-gold-500/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-tactical-100">
                        Choose{' '}
                        {formation.slots.find((s) => s.id === selectedSlotForBudget)?.defaultPosition}
                      </span>
                      <span className="text-[10px] text-tactical-400 font-mono">
                        Available Budget: {starBudget} ⭐
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSlotForBudget(null)}
                      className="text-tactical-400 hover:text-tactical-200 text-xs"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-tactical-400" />
                    <input
                      type="text"
                      placeholder="Search player name..."
                      value={budgetSearchQuery}
                      onChange={(e) => setBudgetSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-tactical-900 border border-tactical-700 text-xs text-tactical-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Filtered Candidate List */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {allPlayers
                      .filter((p) => {
                        const targetSlot = formation.slots.find((s) => s.id === selectedSlotForBudget);
                        if (!targetSlot) return false;
                        if (usedIdentityIds.includes(p.identityId)) return false;
                        if (!isPlayerEligibleForSlot(p, targetSlot)) return false;
                        if (budgetSearchQuery.trim()) {
                          return p.name.toLowerCase().includes(budgetSearchQuery.toLowerCase());
                        }
                        return true;
                      })
                      .slice(0, 25)
                      .map((player) => {
                        const cost = calculateStarCost(player.ovr);
                        const canAfford = starBudget >= cost;
                        return (
                          <div
                            key={player.id}
                            onClick={() => {
                              if (canAfford) {
                                handleSelectBudgetPlayer(selectedSlotForBudget, player);
                              }
                            }}
                            className={`p-2 rounded-lg flex items-center justify-between text-xs border ${
                              canAfford
                                ? 'bg-tactical-900 hover:bg-tactical-800 border-tactical-700 cursor-pointer'
                                : 'bg-tactical-950/40 border-tactical-800 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${getOvrBadgeClass(
                                  player.ovr
                                )}`}
                              >
                                {player.ovr}
                              </span>
                              <span className="font-bold text-tactical-100">{player.name}</span>
                            </div>
                            <span className="font-mono text-gold-400 font-bold">{cost} ⭐</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

