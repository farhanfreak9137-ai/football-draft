import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio.js';
import { messages } from '../i18n/messages.js';
import {
  getServerUrl,
  setServerUrl,
  pingServer,
  DEFAULT_ONLINE_SERVER,
} from '../services/api.js';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Shield,
  Clock,
  Globe,
  Wifi,
  WifiOff,
  Check,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [audioEnabled, setAudioEnabled] = useState(soundManager.enabled);
  const [volume, setVolume] = useState(Math.round(soundManager.volume * 100));
  const [serverUrlInput, setServerUrlInput] = useState(() => getServerUrl() || DEFAULT_ONLINE_SERVER);
  const [isSaved, setIsSaved] = useState(false);
  const [pingState, setPingState] = useState<{
    testing: boolean;
    success?: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(null);

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

  const handleTestConnection = async () => {
    setPingState({ testing: true });
    const res = await pingServer(serverUrlInput.trim());
    if (res.success) {
      setPingState({ testing: false, success: true, latencyMs: res.latencyMs });
    } else {
      setPingState({ testing: false, success: false, error: res.error });
    }
  };

  const handleSaveServer = () => {
    setServerUrl(serverUrlInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetServer = () => {
    setServerUrlInput(DEFAULT_ONLINE_SERVER);
    setServerUrl(DEFAULT_ONLINE_SERVER);
    setPingState(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-tactical-850 border border-tactical-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tactical-700 bg-tactical-900 shrink-0">
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
        <div className="p-6 space-y-6 overflow-y-auto">
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

          {/* Multiplayer Cloud Server Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-pitch-accent" />
                <span>Multiplayer Server</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Solo Mode is 100% Offline
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-tactical-900 border border-tactical-750 space-y-3">
              <div className="text-[11px] text-tactical-400 leading-relaxed">
                Connects multiplayer draft rooms with remote friends. You can point this to your Railway, Render, or custom cloud server:
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="https://your-app.up.railway.app"
                  className="flex-1 bg-tactical-800 border border-tactical-700 rounded px-2.5 py-1.5 text-xs text-tactical-100 font-mono focus:border-pitch-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveServer}
                  className="px-3 py-1.5 bg-tactical-700 hover:bg-tactical-650 text-tactical-100 rounded text-xs font-medium flex items-center gap-1 border border-tactical-600 transition-colors"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={pingState?.testing}
                  className="flex items-center gap-1.5 text-pitch-accent hover:text-pitch-light text-xs font-medium disabled:opacity-50"
                >
                  {pingState?.testing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5" />
                  )}
                  <span>{pingState?.testing ? 'Pinging...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetServer}
                  className="flex items-center gap-1 text-tactical-400 hover:text-tactical-200 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>

              {pingState && !pingState.testing && (
                <div
                  className={`p-2 rounded text-[11px] flex items-center gap-1.5 ${
                    pingState.success
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  {pingState.success ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Server online! Ping latency:{' '}
                        <strong>{pingState.latencyMs}ms</strong>.
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">
                        Cannot connect: {pingState.error || 'Check server URL & internet.'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
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
                  <strong>Turn Timer (40s):</strong> Real-time authoritative timer. Automatically picks highest-OVR
                  eligible player upon expiration.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Luck-First Match Engine:</strong> Outcomes prioritize randomness. Classic underdogs
                  can triumph over legendary teams in a fast 90-second simulation (1 match sec = 1 real sec).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-tactical-900 border-t border-tactical-700 flex justify-end shrink-0">
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
