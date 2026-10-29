import React, { useState } from 'react';
import { HistoricalScenario } from '../../shared/types/index.js';
import { HISTORICAL_SCENARIOS } from '../../shared/constants/scenarios.js';
import { Trophy, Clock, Target, Shield, Award, Zap, ChevronRight, X, Sparkles, BookOpen } from 'lucide-react';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: HistoricalScenario) => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(HISTORICAL_SCENARIOS[0].id);

  if (!isOpen) return null;

  const currentScenario = HISTORICAL_SCENARIOS.find((s) => s.id === selectedScenarioId) || HISTORICAL_SCENARIOS[0];

  const getDifficultyBadge = (diff: HistoricalScenario['difficulty']) => {
    switch (diff) {
      case 'legendary':
        return 'bg-black text-[#0C969C] border-[#0C969C]/60 ring-1 ring-[#0C969C]/40';
      case 'hard':
        return 'bg-amber-950/80 text-amber-300 border-yellow-500/60';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-black border border-[#0C969C]/40 rounded-2xl max-w-4xl w-full shadow-[0_0_50px_rgba(12,150,156,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#0C969C]/50 shadow-[0_0_15px_rgba(12,150,156,0.3)] flex items-center justify-center text-[#0C969C] text-lg">
              ⏳
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Time Machine: Historical Scenarios
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black border border-[#0C969C]/50 text-[#0C969C]">
                  Solo Mode
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Relive football’s legendary fixtures from critical turning points with custom tactical objectives.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar List + Scenario Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-0">
          {/* Left: Scenario Selector (5 cols) */}
          <div className="md:col-span-5 p-3.5 border-r border-white/10 overflow-y-auto space-y-2 bg-black">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider font-bold block px-1">
              Select Historic Turning Point:
            </span>
            {HISTORICAL_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              return (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-black border-2 border-[#0C969C] shadow-[0_0_20px_rgba(12,150,156,0.4)] text-white'
                      : 'bg-black border-white/10 hover:border-[#0C969C] hover:shadow-[0_0_15px_rgba(12,150,156,0.25)] text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] text-neutral-400 font-semibold">
                      {scenario.year} • {scenario.era.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${getDifficultyBadge(
                        scenario.difficulty
                      )}`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                    {scenario.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {scenario.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/10">
                    <span className="text-gold-400 font-bold">
                      +{scenario.rewards.xp} XP
                    </span>
                    <span className="text-white">
                      Starts {scenario.startingMinute}' ({scenario.startingScore.host}-{scenario.startingScore.guest})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Scenario Spotlight (7 cols) */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-4 bg-black">
            {/* Spotlight Header */}
            <div className="space-y-1.5 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-[#0C969C] font-bold px-2 py-0.5 rounded bg-black border border-[#0C969C]/50 shadow-[0_0_10px_rgba(12,150,156,0.3)]">
                  {currentScenario.era}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getDifficultyBadge(
                    currentScenario.difficulty
                  )}`}
                >
                  {currentScenario.difficulty}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {currentScenario.title}
              </h3>
              <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

            {/* Match Starting Situation Banner */}
            <div className="bg-black border border-white/10 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-mono block">Your Team</span>
                <span className="font-bold text-xs text-[#0C969C] truncate block">
                  {currentScenario.userTeam.name}
                </span>
              </div>
              <div className="space-y-0.5 border-x border-white/10">
                <span className="text-[10px] text-neutral-400 font-mono block">Starting Scoreline</span>
                <span className="font-black text-sm text-gold-400 font-mono block">
                  {currentScenario.startingScore.host} - {currentScenario.startingScore.guest}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-mono block">Clock at Kick</span>
                <span className="font-bold text-xs text-white font-mono block">
                  {currentScenario.startingMinute}' Minute
                </span>
              </div>
            </div>

            {/* Historical Lore Box */}
            <div className="p-3 rounded-xl bg-black border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] font-bold uppercase">
                <BookOpen className="w-3.5 h-3.5 text-[#0C969C]" />
                <span>Historical Context</span>
              </div>
              <p className="text-neutral-300 leading-relaxed italic">
                "{currentScenario.lore}"
              </p>
            </div>

            {/* Scenario Objectives */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#0C969C]" />
                <span>Mission Objectives</span>
              </span>
              <div className="space-y-1.5">
                {currentScenario.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-2.5 rounded-lg bg-black border border-white/10 flex items-center gap-2.5 text-xs text-white"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0C969C]/20 border border-[#0C969C]/40 text-[#0C969C] flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <span>{obj.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{currentScenario.rewards.badgeEmoji}</span>
                <div>
                  <span className="font-bold text-xs text-gold-300 block">
                    {currentScenario.rewards.trophyName}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Profile Badge & Manager Reputation
                  </span>
                </div>
              </div>
              <span className="font-mono text-sm font-black text-gold-400">
                +{currentScenario.rewards.xp} XP
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                onSelectScenario(currentScenario);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#0C969C] via-[#0A7075] to-[#0C969C] hover:brightness-110 text-white shadow-[0_0_25px_rgba(12,150,156,0.5)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer border border-[#0C969C]"
            >
              <span>Play Scenario</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

