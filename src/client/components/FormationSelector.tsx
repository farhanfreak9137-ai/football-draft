import React, { useState } from 'react';
import { FormationDefinition } from '../../shared/types/index.js';
import { FORMATION_PRESETS } from '../../shared/constants/formations.js';
import { messages } from '../i18n/messages.js';
import { Sparkles, Check } from 'lucide-react';

interface FormationSelectorProps {
  selectedFormationId: string;
  selectedCustomFormation: FormationDefinition | null;
  customFormations: FormationDefinition[];
  onSelectFormation: (formationId: string, custom: FormationDefinition | null) => void;
  onOpenFormationStudio: () => void;
  compact?: boolean;
}

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  selectedFormationId,
  selectedCustomFormation,
  customFormations,
  onSelectFormation,
  onOpenFormationStudio,
  compact = false,
}) => {
  const [showAllFormations, setShowAllFormations] = useState(false);
  const presets = Object.values(FORMATION_PRESETS);
  const visiblePresets = showAllFormations ? presets : presets.slice(0, 4);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label className="block text-xs font-semibold text-white uppercase tracking-wider">
          {messages.lobby.selectFormation}
        </label>
        <button
          type="button"
          onClick={onOpenFormationStudio}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-black hover:border-[#0C969C] hover:shadow-[0_0_20px_rgba(12,150,156,0.4)] text-white border border-white/10 rounded-lg text-xs font-semibold transition-all shadow-sm group cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-[#0C969C]" />
          <span>
            <span className="hidden sm:inline">Custom </span>Formation Studio
          </span>
        </button>
      </div>

      {/* Selected Custom Formation Banner if active */}
      {selectedCustomFormation && (
        <div className={`mb-2.5 p-2.5 rounded-xl bg-black border border-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.35)] flex items-center justify-between ${compact ? 'text-xs' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0C969C] shadow-[0_0_8px_rgba(12,150,156,0.8)] animate-pulse" />
            <div>
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0A7075] text-white font-mono font-bold shadow-xs">
                  CUSTOM ACTIVE
                </span>
                <span>{selectedCustomFormation.name}</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {selectedCustomFormation.description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenFormationStudio}
            className="text-xs text-[#0C969C] hover:underline font-semibold shrink-0 ml-2 cursor-pointer"
          >
            Edit Studio
          </button>
        </div>
      )}

      {/* Custom Formations list (if any) */}
      {customFormations.length > 0 && (
        <div className="mb-2.5 space-y-1">
          <span className="text-[11px] font-bold text-[#0C969C] uppercase tracking-wider">
            ✨ Custom Formations ({customFormations.length})
          </span>
          <div className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10 bg-black">
            {customFormations.map((cf) => {
              const isSelected = selectedFormationId === cf.id && selectedCustomFormation?.id === cf.id;
              return (
                <div
                  key={cf.id}
                  onClick={() => onSelectFormation(cf.id, cf)}
                  className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-black text-white font-bold border-l-4 border-l-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.4)]'
                      : 'hover:bg-[#0C969C]/10 hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.25)] text-neutral-300'
                  }`}
                >
                  <span className="text-xs font-semibold">{cf.name}</span>
                  {isSelected ? (
                    <span className="text-[11px] text-[#0C969C] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-mono">Custom</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Formations */}
      <div className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10 bg-black">
        {visiblePresets.map((f) => {
          const isSelected = selectedFormationId === f.id && !selectedCustomFormation;
          return (
            <div
              key={f.id}
              onClick={() => onSelectFormation(f.id, null)}
              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-black text-white font-bold border-l-4 border-l-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.4)]'
                  : 'hover:bg-[#0C969C]/10 hover:text-white hover:shadow-[0_0_15px_rgba(12,150,156,0.25)] text-neutral-300'
              }`}
            >
              <span className="text-xs font-semibold">{f.name}</span>
              {isSelected ? (
                <span className="text-[11px] text-[#0C969C] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="text-[10px] text-neutral-500 font-mono">Select →</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {!showAllFormations ? (
        <button
          type="button"
          onClick={() => setShowAllFormations(true)}
          className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-neutral-400 hover:text-white hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] rounded-lg border border-dashed border-white/10 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Show More Formations ({presets.length - 4} more) ▾</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowAllFormations(false)}
          className="w-full mt-1.5 py-1 text-center text-[11px] font-semibold text-neutral-400 hover:text-white hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.3)] rounded-lg transition-all"
        >
          <span>Show Less ▴</span>
        </button>
      )}
    </div>
  );
};

