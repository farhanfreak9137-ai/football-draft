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
        <label className="block text-xs font-semibold text-tactical-300 uppercase tracking-wider">
          {messages.lobby.selectFormation}
        </label>
        <button
          type="button"
          onClick={onOpenFormationStudio}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-tactical-800 hover:bg-tactical-700 text-pitch-accent border border-pitch-line/50 rounded-lg text-xs font-bold transition-all shadow-sm group"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>
            <span className="hidden sm:inline">Custom </span>Formation Studio
          </span>
        </button>
      </div>

      {/* Selected Custom Formation Banner if active */}
      {selectedCustomFormation && (
        <div className={`mb-2.5 p-2.5 rounded-lg bg-pitch-DEFAULT/15 border border-pitch-line/70 flex items-center justify-between ${compact ? 'text-xs' : ''}`}>
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
            className="text-xs text-pitch-accent hover:underline font-semibold shrink-0 ml-2"
          >
            Edit Studio
          </button>
        </div>
      )}

      {/* Custom Formations list (if any) */}
      {customFormations.length > 0 && (
        <div className="mb-2.5 space-y-1">
          <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
            ✨ Custom Formations ({customFormations.length})
          </span>
          <div className="divide-y divide-tactical-800 rounded-xl overflow-hidden border border-tactical-800 bg-tactical-950">
            {customFormations.map((cf) => {
              const isSelected = selectedFormationId === cf.id && selectedCustomFormation?.id === cf.id;
              return (
                <div
                  key={cf.id}
                  onClick={() => onSelectFormation(cf.id, cf)}
                  className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-tactical-800 text-gold-400 font-bold'
                      : 'hover:bg-tactical-850 text-tactical-200'
                  }`}
                >
                  <span className="text-xs font-semibold">{cf.name}</span>
                  {isSelected ? (
                    <span className="text-[11px] text-gold-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-tactical-400 font-mono">Custom</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Formations */}
      <div className="divide-y divide-tactical-800 rounded-xl overflow-hidden border border-tactical-800 bg-tactical-950">
        {visiblePresets.map((f) => {
          const isSelected = selectedFormationId === f.id && !selectedCustomFormation;
          return (
            <div
              key={f.id}
              onClick={() => onSelectFormation(f.id, null)}
              className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-tactical-800 text-pitch-accent font-bold'
                  : 'hover:bg-tactical-850/80 text-tactical-200'
              }`}
            >
              <span className="text-xs font-semibold">{f.name}</span>
              {isSelected ? (
                <span className="text-[11px] text-pitch-accent font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="text-[10px] text-tactical-500 font-mono">Select →</span>
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
          className="w-full mt-2 py-1.5 px-3 text-xs font-bold text-pitch-accent hover:text-pitch-light hover:bg-tactical-850 rounded-lg border border-dashed border-tactical-700 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Show More Formations ({presets.length - 4} more) ▾</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowAllFormations(false)}
          className="w-full mt-1.5 py-1 text-center text-[11px] font-bold text-tactical-400 hover:text-tactical-200 hover:bg-tactical-850 rounded-lg transition-all"
        >
          <span>Show Less ▴</span>
        </button>
      )}
    </div>
  );
};
