import React, { useState, useMemo } from 'react';
import {
  FormationDefinition,
  PlayerVersion,
  SavedDreamTeam,
  DraftedSlot,
} from '../../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { offlineSoloEngine } from '../services/offlineSoloEngine.js';
import { profileService } from '../services/profileService.js';
import { soundManager } from '../utils/audio.js';
import { getOvrBadgeClass, getOvrColorClass } from '../utils/ovrColor.js';
import {
  X,
  Sparkles,
  Shield,
  Search,
  Check,
  RotateCcw,
  Users,
  Zap,
} from 'lucide-react';

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

  const [formationId, setFormationId] = useState<string>(
    initialDreamTeam?.formationId || '4-3-3'
  );
  const [teamName, setTeamName] = useState<string>(
    initialDreamTeam?.name || 'My All-Time Dream XI'
  );

  const formation = FORMATIONS[formationId] || FORMATIONS['4-3-3'];

  // SlotId -> PlayerVersion
  const [draftedSlots, setDraftedSlots] = useState<Record<string, PlayerVersion>>(() => {
    if (!initialDreamTeam?.draftedSlots) return {};
    const map: Record<string, PlayerVersion> = {};
    for (const [k, v] of Object.entries(initialDreamTeam.draftedSlots)) {
      map[k] = v.player;
    }
    return map;
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');

  const currentSlot = formation.slots.find((s) => s.id === selectedSlotId);
  const usedIdentityIds = Object.values(draftedSlots).map((p) => p.identityId);

  // Filtered candidate players for drawer
  const candidatePlayers = useMemo(() => {
    if (!currentSlot) return [];
    return allPlayers.filter((p) => {
      if (usedIdentityIds.includes(p.identityId) && draftedSlots[currentSlot.id]?.id !== p.id) {
        return false;
      }
      if (!isPlayerEligibleForSlot(p, currentSlot)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.naturalPositions.some((pos) => pos.toLowerCase().includes(q))
        );
      }
      return true;
    }).sort((a, b) => b.ovr - a.ovr);
  }, [allPlayers, currentSlot, usedIdentityIds, draftedSlots, searchQuery]);

  const filledCount = Object.keys(draftedSlots).length;
  const isComplete = filledCount === formation.slots.length;

  const draftedList = Object.values(draftedSlots);
  const avgOvr =
    draftedList.length > 0
      ? Math.round(draftedList.reduce((acc, p) => acc + p.ovr, 0) / draftedList.length)
      : 0;

  // Auto-Fill Best All-Stars
  const handleAutoFill = () => {
    soundManager.playPickSound();
    const newDrafted: Record<string, PlayerVersion> = {};
    const usedIds: string[] = [];

    for (const slot of formation.slots) {
      const eligible = allPlayers.filter(
        (p) =>
          !usedIds.includes(p.identityId) &&
          isPlayerEligibleForSlot(p, slot)
      );
      const best = eligible.sort((a, b) => b.ovr - a.ovr)[0] || allPlayers[0];
      newDrafted[slot.id] = best;
      usedIds.push(best.identityId);
    }

    setDraftedSlots(newDrafted);
  };

  const handleSelectPlayer = (player: PlayerVersion) => {
    if (!selectedSlotId) return;
    soundManager.playPickSound();
    setDraftedSlots((prev) => ({ ...prev, [selectedSlotId]: player }));
    setSelectedSlotId(null);
  };

  const handleRemoveSlot = (slotId: string) => {
    setDraftedSlots((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  const handleSaveDreamTeam = () => {
    if (!isComplete) return;

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

    profileService.saveDreamTeam({
      name: teamName.trim() || 'My All-Time Dream XI',
      formationId: formation.id,
      draftedSlots: slotsMap,
      totalOvr: avgOvr,
      savedAt: Date.now(),
    });

    soundManager.playVictoryFanfare();
    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-tactical-850 border border-tactical-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-tactical-700 bg-tactical-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-tactical-100 flex items-center gap-2">
                <span>Dream Team Architect</span>
                <span className="text-xs px-2 py-0.5 rounded bg-tactical-800 text-gold-300 font-mono">
                  {avgOvr > 0 ? `${avgOvr} OVR` : 'Custom XI'}
                </span>
              </h2>
              <p className="text-[11px] text-tactical-400">
                Craft your permanent squad to challenge AI teams of the same caliber.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Name, Formation, Auto-Fill */}
        <div className="px-5 py-3 bg-tactical-900/60 border-b border-tactical-750 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-[220px]">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name (e.g. Galacticos All-Stars)"
              maxLength={28}
              className="px-3 py-1.5 rounded-lg bg-tactical-800 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none flex-1"
            />

            <select
              value={formationId}
              onChange={(e) => {
                setFormationId(e.target.value);
                setDraftedSlots({});
              }}
              className="px-3 py-1.5 rounded-lg bg-tactical-800 border border-tactical-700 text-xs text-tactical-100 font-bold focus:border-gold-500 focus:outline-none"
            >
              {Object.values(FORMATIONS).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.description})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFill}
              className="py-1.5 px-3 rounded-lg bg-tactical-800 hover:bg-tactical-750 text-gold-300 border border-gold-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-gold-400" />
              <span>Auto-Fill All-Stars</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDreamTeam}
              disabled={!isComplete}
              className="py-1.5 px-4 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light disabled:opacity-40 disabled:cursor-not-allowed text-tactical-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-pitch-line transition-all active:scale-95 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Save Dream Team ({filledCount}/11)</span>
            </button>
          </div>
        </div>

        {/* Content Area: Pitch & Selector */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Tactical Pitch Visualizer */}
          <div className="lg:col-span-6 bg-tactical-900 border border-tactical-800 rounded-2xl p-3 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-pitch-accent" />
                <span>Lineup Pitch ({filledCount}/11 Filled)</span>
              </span>
              <span className="text-xs text-gold-400 font-mono font-bold">Avg OVR: {avgOvr}</span>
            </div>

            <div className="relative aspect-[4/5] bg-pitch-DEFAULT/40 border border-pitch-line/50 rounded-xl overflow-hidden p-2 shadow-inner">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-pitch-line/40 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-pitch-line/40 pointer-events-none" />

              {formation.slots.map((slot) => {
                const player = draftedSlots[slot.id];
                const isSelected = selectedSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    style={{
                      left: `${slot.coordinates.x}%`,
                      top: `${slot.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute cursor-pointer transition-all ${
                      isSelected
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
                          : isSelected
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

            <div className="text-[10px] text-tactical-400 text-center mt-2">
              Tap any slot on the pitch or right list to assign or swap a player.
            </div>
          </div>

          {/* Right Panel: Slot List or Candidate Search */}
          <div className="lg:col-span-6 bg-tactical-900 border border-tactical-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            {selectedSlotId && currentSlot ? (
              /* Player Picker for Active Slot */
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between pb-2 border-b border-tactical-800 shrink-0">
                  <div>
                    <span className="text-[10px] text-tactical-400 uppercase font-mono">
                      Assigning Slot
                    </span>
                    <h3 className="text-sm font-bold text-tactical-100 flex items-center gap-2">
                      <span>{currentSlot.defaultPosition}</span>
                      <span className="text-xs text-gold-400 font-mono">
                        ({candidatePlayers.length} Candidates)
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedSlotId(null)}
                    className="text-xs text-tactical-400 hover:text-tactical-200"
                  >
                    Back to Squad ✕
                  </button>
                </div>

                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-tactical-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentSlot.defaultPosition} players...`}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-tactical-800 border border-tactical-700 text-xs text-tactical-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Candidate Player List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
                  {candidatePlayers.slice(0, 40).map((player) => {
                    const edition = allEditions.find((e) => e.id === player.editionId);
                    return (
                      <div
                        key={player.id}
                        onClick={() => handleSelectPlayer(player)}
                        className="p-2.5 rounded-xl bg-tactical-850 hover:bg-tactical-800 border border-tactical-700 hover:border-gold-500/70 cursor-pointer transition-all flex items-center justify-between shadow-sm active:scale-98"
                      >
                        <div className="flex items-center gap-2.5">
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
                              {edition?.teamName || 'Classic Team'} ({edition?.yearOrSeason || '1990'})
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-pitch-accent">
                          Select →
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Squad Slot Roster List */
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between pb-2 border-b border-tactical-800 shrink-0">
                  <span className="text-xs font-bold text-tactical-200 uppercase tracking-wider">
                    Starting 11 Roster
                  </span>
                  <span className="text-[11px] text-tactical-400 font-mono">
                    {filledCount}/11 Assigned
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[380px]">
                  {formation.slots.map((slot) => {
                    const player = draftedSlots[slot.id];
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          player
                            ? 'bg-tactical-850 border-tactical-700 hover:border-tactical-600'
                            : 'bg-tactical-950/40 border-dashed border-tactical-750 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 text-[11px] font-bold text-tactical-400 font-mono">
                            {slot.defaultPosition}
                          </span>
                          {player ? (
                            <>
                              <span
                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${getOvrBadgeClass(
                                  player.ovr
                                )}`}
                              >
                                {player.ovr}
                              </span>
                              <span className="text-xs font-bold text-tactical-100 truncate">
                                {player.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-tactical-500 italic">
                              + Empty Slot (Tap to choose)
                            </span>
                          )}
                        </div>

                        {player && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSlot(slot.id);
                            }}
                            className="text-tactical-500 hover:text-red-400 text-xs px-2"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

