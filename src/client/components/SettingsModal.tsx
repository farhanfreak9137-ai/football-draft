import React, { useState } from 'react';
import { soundManager } from '../utils/audio.js';
import { messages } from '../i18n/messages.js';
import { X, Settings, Volume2, VolumeX, Shield, Clock, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [audioEnabled, setAudioEnabled] = useState(soundManager.enabled);
  const [volume, setVolume] = useState(Math.round(soundManager.volume * 100));

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAudioToggle = () => {
    soundManager.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.volume = newVol / 100;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-tactical-850 border border-tactical-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tactical-700 bg-tactical-900">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-pitch-accent" />
            <h2 className="text-base font-bold text-tactical-100">{messages.settings.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Settings"
            className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audio Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-tactical-300 uppercase tracking-wider">
              Audio & Alerts
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-tactical-900 border border-tactical-750">
              <div className="flex items-center gap-3">
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5 text-pitch-accent" />
                ) : (
                  <VolumeX className="w-5 h-5 text-tactical-500" />
                )}
                <div>
                  <div className="font-semibold text-xs text-tactical-100">
                    {messages.settings.soundEffects}
                  </div>
                  <div className="text-[11px] text-tactical-400">
                    Includes turn countdown chimes, match whistles, and goal alerts.
                  </div>
                </div>
              </div>

              <button
                onClick={handleAudioToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  audioEnabled ? 'bg-pitch-DEFAULT' : 'bg-tactical-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    audioEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Volume slider */}
            {audioEnabled && (
              <div className="p-3.5 rounded-lg bg-tactical-900 border border-tactical-750 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-tactical-300">{messages.settings.volume}</span>
                  <span className="font-mono text-tactical-200">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full accent-pitch-accent h-1.5 bg-tactical-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Engine Rules & Architecture Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-tactical-300 uppercase tracking-wider">
              Simulation Rules
            </h3>
            <div className="p-3.5 rounded-lg bg-tactical-900 border border-tactical-750 space-y-2 text-[11px] text-tactical-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-pitch-accent shrink-0 mt-0.5" />
                <div>
                  <strong>Turn Timer (40s):</strong> Authoritative server countdown. Auto-picks highest-OVR
                  legal player upon expiration using deterministic tie-breaking.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Luck-First Match Engine:</strong> Outcomes are governed by randomness. Normal
                  teams can upset legendary sides, with 90-second duration (1 real sec = 1 match sec).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-tactical-900 border-t border-tactical-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-tactical-700 hover:bg-tactical-600 text-tactical-100 text-xs font-semibold transition-colors"
          >
            {messages.settings.close}
          </button>
        </div>
      </div>
    </div>
  );
};

