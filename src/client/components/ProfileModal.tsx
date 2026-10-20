import React, { useState } from 'react';
import { profileService } from '../services/profileService.js';
import { ManagerProfile } from '../../shared/types/index.js';
import {
  X,
  Trophy,
  Award,
  Shield,
  Target,
  Flame,
  Check,
  Edit2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<ManagerProfile>(() => profileService.getProfile());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.managerName);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji || '👔');

  const EMOJI_OPTIONS = ['👔', '🧢', '🕶️', '⚽', '👑', '🦁', '⚡', '🦅', '🎯', '🔥'];

  if (!isOpen) return null;

  const handleSaveName = () => {
    const updated = profileService.updateManagerName(nameInput, selectedEmoji);
    setProfile(updated);
    setIsEditingName(false);
  };

  const winRate =
    profile.stats.matchesPlayed > 0
      ? Math.round((profile.stats.wins / profile.stats.matchesPlayed) * 100)
      : 0;

  const nextLevelXp = profile.level * 300;
  const currentLevelXp = profile.xp % 300;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 300) * 100));

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-tactical-850 border border-tactical-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tactical-700 bg-tactical-900 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-400" />
            <h2 className="text-base font-bold text-tactical-100">Manager Profile & Career</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Profile"
            className="p-1.5 rounded-lg text-tactical-400 hover:text-tactical-100 hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Manager Badge & XP Card */}
          <div className="p-4 rounded-xl bg-tactical-900 border border-tactical-750 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-4xl p-3 bg-tactical-800 rounded-2xl border border-tactical-700 shadow-inner">
              {profile.avatarEmoji}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              {isEditingName ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={24}
                      className="bg-tactical-800 border border-tactical-700 rounded px-2.5 py-1 text-sm text-tactical-100 font-bold focus:border-pitch-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-1.5 bg-pitch-DEFAULT hover:bg-pitch-light rounded text-tactical-100"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Emoji selector */}
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setSelectedEmoji(em)}
                        className={`text-sm p-1 rounded ${selectedEmoji === em ? 'bg-tactical-700 ring-1 ring-pitch-accent' : 'hover:bg-tactical-800'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base font-extrabold text-tactical-100 truncate">
                    {profile.managerName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-tactical-400 hover:text-tactical-200 p-1"
                    title="Edit Manager Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-pitch-accent bg-pitch-DEFAULT/20 px-2 py-0.5 rounded border border-pitch-line/40">
                  Level {profile.level} Manager
                </span>
                <span className="text-xs text-tactical-400 font-mono">
                  {profile.xp} Total XP
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-2.5">
                <div className="w-full bg-tactical-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-pitch-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-tactical-500 font-mono mt-1">
                  <span>{currentLevelXp} XP</span>
                  <span>300 XP to Level {profile.level + 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Career Stats Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              Career Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-tactical-400">Matches</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.matchesPlayed}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Wins (W/D/L)</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.wins} <span className="text-xs text-tactical-400 font-normal">/ {profile.stats.draws} / {profile.stats.losses}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-gold-400">Win Rate</div>
                <div className="text-lg font-black text-gold-400 mt-0.5">
                  {winRate}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-900 border border-tactical-750 text-center">
                <div className="text-[10px] uppercase font-bold text-pitch-accent">Goals (F/A)</div>
                <div className="text-lg font-black text-tactical-100 mt-0.5">
                  {profile.stats.goalsScored} <span className="text-xs text-tactical-400 font-normal">/ {profile.stats.goalsConceded}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trophy Cabinet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-gold-400" />
                <span>Trophy Cabinet ({profile.trophies.length})</span>
              </h4>
            </div>

            {profile.trophies.length === 0 ? (
              <div className="p-6 rounded-lg bg-tactical-900/60 border border-tactical-800 text-center space-y-1">
                <Trophy className="w-8 h-8 text-tactical-600 mx-auto" />
                <div className="text-xs font-semibold text-tactical-300">
                  No Trophies Won Yet
                </div>
                <div className="text-[11px] text-tactical-500">
                  Compete in the 7-game World Championship Tournament to lift your first gold trophy!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.trophies.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-lg bg-tactical-900 border border-gold-900/40 flex items-center gap-3"
                  >
                    <div
                      className={`text-2xl p-2 rounded-lg ${
                        tr.type === 'gold' ? 'bg-amber-950/60 border border-amber-600/40' : 'bg-tactical-800 border border-tactical-700'
                      }`}
                    >
                      {tr.type === 'gold' ? '🏆' : '🥈'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-tactical-100 truncate">
                        {tr.tournamentName}
                      </div>
                      <div className="text-[10px] text-tactical-400 flex items-center gap-1">
                        <span>{tr.type === 'gold' ? 'Champion' : 'Runner-Up'}</span>
                        <span>•</span>
                        <span>{tr.draftMode === 'campaign' ? 'Campaign' : 'Dynamic'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Match Form */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-tactical-300 uppercase tracking-wider">
              Recent Matches
            </h4>
            {profile.recentMatches.length === 0 ? (
              <div className="p-4 rounded-lg bg-tactical-900 border border-tactical-800 text-center text-xs text-tactical-500">
                No recent matches recorded. Play a quick match or tournament game!
              </div>
            ) : (
              <div className="space-y-1.5">
                {profile.recentMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-tactical-900 border border-tactical-750 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          m.result === 'win'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                            : m.result === 'draw'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-700/50'
                        }`}
                      >
                        {m.result === 'win' ? 'W' : m.result === 'draw' ? 'D' : 'L'}
                      </span>
                      <span className="font-semibold text-tactical-100 truncate">
                        vs {m.opponentName}
                      </span>
                      <span className="text-[10px] text-tactical-400 font-mono hidden sm:inline">
                        ({m.stage})
                      </span>
                    </div>

                    <span className="font-mono font-bold text-tactical-200">
                      {m.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-tactical-900 border-t border-tactical-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-tactical-700 hover:bg-tactical-600 text-tactical-100 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

