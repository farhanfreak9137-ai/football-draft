import React, { useState, useEffect, useRef } from 'react';
import { FormationDefinition, FormationSlot, Position, PositionGroup } from '../../shared/types/index.js';
import {
  FORMATIONS,
  ARCHETYPE_TEMPLATES,
  TACTICAL_SNAP_NODES,
  TacticalSnapNode,
  calculatePositionFromCoordinates,
  findClosestSnapNode,
  validateCustomFormation,
  generateFormationFromLines,
  ELIGIBLE_POSITIONS_MAP,
} from '../../shared/constants/formations.js';
import {
  getCustomFormations,
  saveCustomFormation,
  deleteCustomFormation,
} from '../utils/customFormations.js';
import {
  X,
  Save,
  Check,
  AlertCircle,
  Move,
  Magnet,
  Sliders,
  Trash2,
  RotateCcw,
  Play,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface FormationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormation: (formation: FormationDefinition) => void;
  initialFormation?: FormationDefinition | null;
}

type StudioMode = 'free' | 'snap' | 'lines';

const AVAILABLE_ROLES_BY_GROUP: Record<PositionGroup, Position[]> = {
  GK: ['GK'],
  DEF: ['CB', 'LB', 'RB', 'LWB', 'RWB'],
  MID: ['CM', 'CDM', 'CAM', 'LM', 'RM'],
  FWD: ['ST', 'CF', 'SS', 'LW', 'RW'],
};

export const FormationStudioModal: React.FC<FormationStudioModalProps> = ({
  isOpen,
  onClose,
  onSelectFormation,
  initialFormation,
}) => {
  const pitchRef = useRef<HTMLDivElement>(null);

  // Studio Mode: Mode 1 (free), Mode 2 (snap), Mode 3 (lines & archetypes)
  const [mode, setMode] = useState<StudioMode>('free');

  // Formation Name
  const [formationName, setFormationName] = useState<string>('Custom 4-3-3 Setup');

  // 11 Formation Slots
  const [slots, setSlots] = useState<FormationSlot[]>(() => {
    if (initialFormation?.slots && initialFormation.slots.length === 11) {
      return JSON.parse(JSON.stringify(initialFormation.slots));
    }
    return JSON.parse(JSON.stringify(FORMATIONS['4-3-3'].slots));
  });

  // Selected Slot for fine-tuning
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Dragging State
  const [draggingSlotId, setDraggingSlotId] = useState<string | null>(null);
  const [hoveredSnapNode, setHoveredSnapNode] = useState<TacticalSnapNode | null>(null);

  // Line Count Steppers (Mode 3)
  const [lineDef, setLineDef] = useState<number>(4);
  const [lineMid, setLineMid] = useState<number>(3);
  const [lineFwd, setLineFwd] = useState<number>(3);

  // Saved Custom Formations from localStorage
  const [savedFormations, setSavedFormations] = useState<FormationDefinition[]>([]);
  const [showSavedList, setShowSavedList] = useState<boolean>(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load saved formations on mount
  useEffect(() => {
    setSavedFormations(getCustomFormations());
  }, []);

  // Sync initial formation if changed
  useEffect(() => {
    if (initialFormation?.slots && initialFormation.slots.length === 11) {
      setSlots(JSON.parse(JSON.stringify(initialFormation.slots)));
      setFormationName(initialFormation.name || 'Custom Formation');
    }
  }, [initialFormation]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Validation
  const validation = validateCustomFormation(slots);

  // Update line counts whenever slots change to keep stepper in sync
  useEffect(() => {
    const counts = { def: 0, mid: 0, fwd: 0 };
    for (const s of slots) {
      if (s.group === 'DEF') counts.def++;
      if (s.group === 'MID') counts.mid++;
      if (s.group === 'FWD') counts.fwd++;
    }
    if (counts.def >= 3 && counts.def <= 5) setLineDef(counts.def);
    if (counts.mid >= 2 && counts.mid <= 6) setLineMid(counts.mid);
    if (counts.fwd >= 1 && counts.fwd <= 4) setLineFwd(counts.fwd);
  }, [slots]);

  // Temporary feedback alert dismiss
  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Drag Handlers
  const handlePointerDown = (slotId: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingSlotId(slotId);
    setSelectedSlotId(slotId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingSlotId || !pitchRef.current) return;
    e.preventDefault();

    const rect = pitchRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Bounds checking
    let x = Math.round(Math.max(6, Math.min(94, rawX)));
    let y = Math.round(Math.max(8, Math.min(94, rawY)));

    // Constrain GK to box
    const isGK = draggingSlotId === 'gk';
    if (isGK) {
      x = Math.max(32, Math.min(68, x));
      y = Math.max(85, Math.min(94, y));
    }

    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== draggingSlotId) return slot;

        if (isGK) {
          return { ...slot, coordinates: { x, y } };
        }

        if (mode === 'snap') {
          const snapNode = findClosestSnapNode(x, y, 9);
          setHoveredSnapNode(snapNode);

          if (snapNode) {
            return {
              ...slot,
              coordinates: { x: snapNode.coordinates.x, y: snapNode.coordinates.y },
              defaultPosition: snapNode.position,
              group: snapNode.group,
              name: snapNode.name,
              eligiblePositions: ELIGIBLE_POSITIONS_MAP[snapNode.position] || [snapNode.position],
            };
          }
        } else {
          setHoveredSnapNode(null);
        }

        // Free mode dynamic auto-morph
        const dynamic = calculatePositionFromCoordinates(x, y);
        return {
          ...slot,
          coordinates: { x, y },
          defaultPosition: dynamic.position,
          group: dynamic.group,
          name: dynamic.name,
          eligiblePositions: dynamic.eligiblePositions,
        };
      })
    );
  };

  const handlePointerUp = () => {
    setDraggingSlotId(null);
    setHoveredSnapNode(null);
  };

  // Role override for selected token
  const handleRoleChange = (slotId: string, newPosition: Position) => {
    let newGroup: PositionGroup = 'MID';
    if (newPosition === 'GK') newGroup = 'GK';
    else if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(newPosition)) newGroup = 'DEF';
    else if (['ST', 'CF', 'SS', 'LW', 'RW'].includes(newPosition)) newGroup = 'FWD';

    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        return {
          ...s,
          defaultPosition: newPosition,
          group: newGroup,
          eligiblePositions: ELIGIBLE_POSITIONS_MAP[newPosition] || [newPosition],
        };
      })
    );
  };

  // Custom Slot Label override
  const handleSlotNameChange = (slotId: string, customName: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, name: customName } : s))
    );
  };

  // Mode 3: Apply Line Stepper Formation
  const handleApplyLines = () => {
    const totalOutfield = lineDef + lineMid + lineFwd;
    if (totalOutfield !== 10) {
      showFeedback(`Outfield lines must total exactly 10 players (currently ${totalOutfield}).`, 'error');
      return;
    }

    const generated = generateFormationFromLines(
      lineDef,
      lineMid,
      lineFwd,
      formationName || `${lineDef}-${lineMid}-${lineFwd} Tactical`
    );
    setSlots(generated.slots);
    showFeedback(`Generated balanced ${lineDef}-${lineMid}-${lineFwd} formation!`, 'success');
  };

  // Mode 3: Load Archetype Template
  const handleLoadArchetype = (template: FormationDefinition) => {
    setSlots(JSON.parse(JSON.stringify(template.slots)));
    setFormationName(`${template.name} (Custom)`);
    showFeedback(`Loaded archetype: ${template.name}`, 'success');
  };

  // Reset to default 4-3-3
  const handleResetToDefault = () => {
    const def = FORMATIONS['4-3-3'];
    setSlots(JSON.parse(JSON.stringify(def.slots)));
    setFormationName('Custom 4-3-3 Setup');
    showFeedback('Reset to default 4-3-3 formation.', 'success');
  };

  // Save Formation to localStorage
  const handleSaveFormation = (): FormationDefinition | null => {
    if (!validation.valid) {
      showFeedback(validation.reason || 'Invalid formation structure.', 'error');
      return null;
    }

    const customId = `custom-${formationName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const newFormation: FormationDefinition = {
      id: customId,
      name: formationName.trim() || `${validation.derivedName} Custom`,
      description: `Custom ${validation.derivedName} tactical setup with custom coordinates.`,
      slots,
      isCustom: true,
    };

    const ok = saveCustomFormation(newFormation);
    if (ok) {
      setSavedFormations(getCustomFormations());
      showFeedback('Formation saved to your custom library!', 'success');
      return newFormation;
    } else {
      showFeedback('Failed to save formation.', 'error');
      return null;
    }
  };

  // Save and Use Formation immediately in Draft Lobby
  const handleSaveAndUse = () => {
    const saved = handleSaveFormation();
    if (saved) {
      onSelectFormation(saved);
      onClose();
    }
  };

  // Delete saved formation
  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomFormation(id);
    setSavedFormations(getCustomFormations());
    showFeedback('Custom formation deleted.', 'success');
  };

  // Load a saved formation into the editor
  const handleLoadSaved = (f: FormationDefinition) => {
    setSlots(JSON.parse(JSON.stringify(f.slots)));
    setFormationName(f.name);
    setShowSavedList(false);
    showFeedback(`Loaded "${f.name}".`, 'success');
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  // Position token badge colors
  const getBadgeStyle = (group: PositionGroup) => {
    switch (group) {
      case 'GK':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'DEF':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'MID':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'FWD':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-tactical-950/85 backdrop-blur-md overflow-y-auto"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative w-full max-w-5xl bg-tactical-900 border border-tactical-700 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-tactical-750 bg-tactical-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pitch-DEFAULT/30 border border-pitch-line/50 rounded-xl text-pitch-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-tactical-100 tracking-tight">
                  Custom Formation Studio
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-tactical-800 text-pitch-accent border border-tactical-700">
                  3-in-1 Tactical Editor
                </span>
              </div>
              <p className="text-xs text-tactical-400 mt-0.5">
                Drag players freely, magnetically snap to tactical anchors, or build balanced lines & templates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSavedList(!showSavedList)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 border border-tactical-700 flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Saved ({savedFormations.length})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Bar */}
        {feedback && (
          <div
            className={`px-4 py-2 text-xs font-medium flex items-center justify-between border-b ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
            }`}
          >
            <span>{feedback.text}</span>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-75 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Mode Switcher Bar */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-tactical-850/60 border-b border-tactical-750 gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-tactical-900 p-1 rounded-xl border border-tactical-750 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => setMode('free')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                mode === 'free'
                  ? 'bg-tactical-700 text-pitch-accent shadow-sm'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>Free Drag</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('snap')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                mode === 'snap'
                  ? 'bg-tactical-700 text-gold-400 shadow-sm'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Magnet className="w-3.5 h-3.5" />
              <span>Snap <span className="hidden sm:inline">Anchors (25)</span></span>
            </button>

            <button
              type="button"
              onClick={() => setMode('lines')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                mode === 'lines'
                  ? 'bg-tactical-700 text-blue-400 shadow-sm'
                  : 'text-tactical-400 hover:text-tactical-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Lines</span>
            </button>
          </div>

          {/* Formation Name Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 max-w-xs">
            <span className="text-xs text-tactical-400 font-semibold whitespace-nowrap">Name:</span>
            <input
              type="text"
              value={formationName}
              onChange={(e) => setFormationName(e.target.value)}
              maxLength={28}
              placeholder="Formation Name"
              className="w-full bg-tactical-900 border border-tactical-700 rounded-lg px-2.5 py-1 text-xs text-tactical-100 focus:outline-none focus:border-pitch-line"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col md:flex-row gap-5">
          {/* Left Column: Interactive Pitch */}
          <div className="flex-1 flex flex-col items-center">
            <div
              ref={pitchRef}
              className="relative w-full aspect-[3/4] max-w-[420px] rounded-xl tactical-pitch-bg shadow-2xl border-2 border-tactical-700 overflow-hidden select-none touch-none"
            >
              {/* Pitch Visual Markings */}
              {/* Halfway line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line -translate-y-1/2 pointer-events-none" />
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Top Penalty Box (Opponent End) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-pitch-line pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b-2 border-x-2 border-pitch-line pointer-events-none" />

              {/* Bottom Penalty Box (Our Defensive End) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-pitch-line pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t-2 border-x-2 border-pitch-line pointer-events-none" />

              {/* Mode 2: Tactical Snap Anchors Visual Overlay */}
              {mode === 'snap' && (
                <div className="absolute inset-0 pointer-events-none">
                  {TACTICAL_SNAP_NODES.map((node) => {
                    const isHovered = hoveredSnapNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        style={{
                          left: `${node.coordinates.x}%`,
                          top: `${node.coordinates.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all ${
                          isHovered ? 'scale-125 z-10' : 'opacity-40'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            isHovered
                              ? 'bg-gold-400 border-white ring-4 ring-gold-400/50 animate-ping'
                              : 'bg-tactical-800 border-tactical-400'
                          }`}
                        />
                        <span className="text-[8px] font-mono font-bold text-tactical-300 mt-0.5">
                          {node.position}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 11 Player Formation Tokens */}
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isDragging = draggingSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    style={{
                      left: `${slot.coordinates.x}%`,
                      top: `${slot.coordinates.y}%`,
                    }}
                    onPointerDown={(e) => handlePointerDown(slot.id, e)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none cursor-grab active:cursor-grabbing transition-transform ${
                      isDragging
                        ? 'z-40 scale-125 drop-shadow-2xl'
                        : isSelected
                        ? 'z-30 scale-110'
                        : 'z-20 hover:scale-105'
                    }`}
                  >
                    {/* Circle Token */}
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex flex-col items-center justify-center shadow-lg transition-colors ${
                        isSelected
                          ? 'border-pitch-accent bg-tactical-850 ring-2 ring-pitch-accent/60'
                          : getBadgeStyle(slot.group)
                      }`}
                    >
                      <span className="font-mono font-extrabold text-xs tracking-tight">
                        {slot.defaultPosition}
                      </span>
                    </div>

                    {/* Position Label below token */}
                    <div
                      className={`mt-1 px-1.5 py-0.5 rounded text-center max-w-[85px] truncate font-medium text-[9px] shadow ${
                        isSelected
                          ? 'bg-pitch-DEFAULT text-tactical-100 border border-pitch-line font-bold'
                          : 'bg-tactical-950/85 text-tactical-200 border border-tactical-700/80'
                      }`}
                    >
                      {slot.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helper Caption */}
            <div className="flex items-center gap-1.5 text-xs text-tactical-400 mt-2.5">
              <Info className="w-3.5 h-3.5 text-pitch-accent shrink-0" />
              <span>
                {mode === 'free'
                  ? 'Drag tokens anywhere; role & name auto-morph from coordinates.'
                  : mode === 'snap'
                  ? 'Tokens magnetically lock to closest tactical anchor.'
                  : 'Adjust line steppers or pick classic archetypes below.'}
              </span>
            </div>
          </div>

          {/* Right Column: Controls, Fine-Tuning & Archetypes */}
          <div className="w-full md:w-[380px] flex flex-col gap-4">
            {/* Validation Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                validation.valid
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              }`}
            >
              {validation.valid ? (
                <Check className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {validation.valid ? `Valid Formation (${validation.derivedName})` : 'Invalid Formation'}
                  </span>
                  <span className="font-mono text-xs font-bold">11 Players</span>
                </div>
                <div className="text-xs mt-1 leading-relaxed opacity-90">
                  {validation.valid
                    ? 'Formation meets simulator rules and is ready for draft play.'
                    : validation.reason}
                </div>
                <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-tactical-900 border border-tactical-700 text-tactical-300">
                    GK: {validation.counts.gk}/1
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tactical-900 border border-tactical-700 text-tactical-300">
                    DEF: {validation.counts.def}/3-5
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tactical-900 border border-tactical-700 text-tactical-300">
                    MID: {validation.counts.mid}/2-6
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tactical-900 border border-tactical-700 text-tactical-300">
                    FWD: {validation.counts.fwd}/1-4
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Slot Fine-Tuning Card */}
            {selectedSlot && (
              <div className="p-3.5 bg-tactical-850 border border-tactical-750 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pitch-accent" />
                    <span className="font-bold text-xs text-tactical-200 uppercase tracking-wider">
                      Selected Slot: {selectedSlot.defaultPosition}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-tactical-400">
                    X: {selectedSlot.coordinates.x}% | Y: {selectedSlot.coordinates.y}%
                  </span>
                </div>

                {/* Role Switcher */}
                <div>
                  <label className="block text-[11px] text-tactical-400 font-semibold mb-1.5">
                    Tactical Role ({selectedSlot.group})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_ROLES_BY_GROUP[selectedSlot.group]?.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(selectedSlot.id, role)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                          selectedSlot.defaultPosition === role
                            ? 'bg-pitch-DEFAULT text-tactical-100 border border-pitch-line shadow'
                            : 'bg-tactical-900 text-tactical-400 border border-tactical-700 hover:border-tactical-600'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot Name Input */}
                <div>
                  <label className="block text-[11px] text-tactical-400 font-semibold mb-1">
                    Slot Label
                  </label>
                  <input
                    type="text"
                    value={selectedSlot.name}
                    onChange={(e) => handleSlotNameChange(selectedSlot.id, e.target.value)}
                    maxLength={24}
                    className="w-full bg-tactical-900 border border-tactical-700 rounded px-2.5 py-1 text-xs text-tactical-100 focus:outline-none focus:border-pitch-line"
                  />
                </div>
              </div>
            )}

            {/* Mode 3: Line Stepper & Archetypes */}
            {mode === 'lines' && (
              <div className="p-3.5 bg-tactical-850 border border-tactical-750 rounded-xl space-y-4">
                <div>
                  <span className="font-bold text-xs text-tactical-200 uppercase tracking-wider block mb-2">
                    Line Steppers
                  </span>
                  <div className="space-y-2.5">
                    {/* Defenders */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tactical-300 font-medium">Defenders (3-5)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLineDef((c) => Math.max(3, c - 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-tactical-100">{lineDef}</span>
                        <button
                          type="button"
                          onClick={() => setLineDef((c) => Math.min(5, c + 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Midfielders */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tactical-300 font-medium">Midfielders (2-6)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLineMid((c) => Math.max(2, c - 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-tactical-100">{lineMid}</span>
                        <button
                          type="button"
                          onClick={() => setLineMid((c) => Math.min(6, c + 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Forwards */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tactical-300 font-medium">Forwards (1-4)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLineFwd((c) => Math.max(1, c - 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-tactical-100">{lineFwd}</span>
                        <button
                          type="button"
                          onClick={() => setLineFwd((c) => Math.min(4, c + 1))}
                          className="w-6 h-6 rounded bg-tactical-900 border border-tactical-700 text-tactical-200 hover:border-tactical-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyLines}
                    className="w-full mt-3 py-1.5 rounded-lg bg-tactical-700 hover:bg-tactical-600 text-tactical-100 text-xs font-bold transition-all border border-tactical-600"
                  >
                    Generate {lineDef}-{lineMid}-{lineFwd} Lines
                  </button>
                </div>

                {/* 10 Archetype Templates */}
                <div className="border-t border-tactical-750 pt-3">
                  <span className="font-bold text-xs text-tactical-200 uppercase tracking-wider block mb-2">
                    1-Click Classic Archetypes
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {ARCHETYPE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleLoadArchetype(tmpl)}
                        className="p-2 rounded-lg bg-tactical-900 hover:bg-tactical-800 border border-tactical-700 text-left transition-all group"
                      >
                        <div className="font-mono font-bold text-xs text-tactical-200 group-hover:text-pitch-accent">
                          {tmpl.name}
                        </div>
                        <div className="text-[10px] text-tactical-400 truncate mt-0.5">
                          {tmpl.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Saved Formations Drawer / Popover */}
            {showSavedList && (
              <div className="p-3.5 bg-tactical-850 border border-tactical-750 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-tactical-200 uppercase tracking-wider">
                    My Saved Custom Formations
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSavedList(false)}
                    className="text-xs text-tactical-400 hover:text-tactical-200"
                  >
                    Close
                  </button>
                </div>

                {savedFormations.length === 0 ? (
                  <div className="text-xs text-tactical-400 py-3 text-center">
                    No custom formations saved yet.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {savedFormations.map((sf) => (
                      <div
                        key={sf.id}
                        onClick={() => handleLoadSaved(sf)}
                        className="p-2 bg-tactical-900 hover:bg-tactical-800 border border-tactical-700 rounded-lg flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div>
                          <div className="font-bold text-xs text-tactical-200 group-hover:text-pitch-accent">
                            {sf.name}
                          </div>
                          <div className="text-[10px] text-tactical-400">{sf.description}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSaved(sf.id, e)}
                          title="Delete formation"
                          className="p-1 rounded text-tactical-500 hover:text-rose-400 hover:bg-tactical-850"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-tactical-750 bg-tactical-850 shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-tactical-300 text-xs font-semibold border border-tactical-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (4-3-3)</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveFormation}
              disabled={!validation.valid}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-tactical-750 hover:bg-tactical-700 text-tactical-100 text-xs font-bold border border-tactical-600 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Library</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndUse}
              disabled={!validation.valid}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pitch-DEFAULT hover:bg-pitch-light text-tactical-100 text-xs font-bold border border-pitch-line shadow-lg transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Save & Use in Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

