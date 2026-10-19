import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

interface TimerCountdownProps {
  deadline: number; // Server epoch deadline in ms
  isMyTurn?: boolean;
  isActive?: boolean;
  onTimeout?: () => void;
}

export const TimerCountdown: React.FC<TimerCountdownProps> = ({
  deadline,
  isMyTurn = true,
  isActive = true,
  onTimeout,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(40);

  useEffect(() => {
    if (!isActive || deadline === 0) {
      setSecondsRemaining(40);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((deadline - now) / 1000));
      setSecondsRemaining(diff);

      // Warning audio tick on each second when <= 10 seconds remaining and it is my turn
      if (diff <= 10 && diff > 0 && isMyTurn) {
        soundManager.playTimerTick();
      }

      if (diff === 0 && onTimeout) {
        onTimeout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 200);
    return () => clearInterval(interval);
  }, [deadline, isActive, isMyTurn, onTimeout]);

  // Percentage from 100% (long) down to 0% (short) as time ticks
  const percentage = Math.min(100, Math.max(0, (secondsRemaining / 40) * 100));

  // Dynamic bar color: Green (> 20s) -> Yellow/Amber (10s - 20s) -> Red (<= 10s)
  const getBarColorClass = () => {
    if (secondsRemaining > 20) {
      return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]';
    }
    if (secondsRemaining > 10) {
      return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]';
    }
    return 'bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)] animate-pulse';
  };

  const isUrgent = secondsRemaining <= 10;

  return (
    <div
      className={`rounded-xl border px-3.5 py-2.5 transition-all w-52 sm:w-60 shadow-md ${
        isUrgent && isMyTurn
          ? 'bg-red-950/60 border-red-500/70 text-red-200 ring-2 ring-red-500/40 animate-pulse'
          : 'bg-tactical-850 border-tactical-700/80 text-tactical-100'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-xs">
          {isUrgent && isMyTurn ? (
            <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
          ) : (
            <Clock
              className={`w-3.5 h-3.5 ${
                secondsRemaining > 20
                  ? 'text-emerald-400'
                  : secondsRemaining > 10
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            />
          )}
          <span className="text-[11px] text-tactical-300">
            {isMyTurn ? 'Turn Timer' : "Opponent Turn"}
          </span>
        </div>

        {/* Numerical counting display */}
        <div className="flex items-baseline gap-1">
          <span
            className={`font-mono font-black text-base tracking-tight ${
              secondsRemaining > 20
                ? 'text-emerald-400'
                : secondsRemaining > 10
                ? 'text-amber-400'
                : 'text-red-400 animate-pulse'
            }`}
          >
            {secondsRemaining}s
          </span>
          <span className="font-mono text-[10px] text-tactical-500">/ 40s</span>
        </div>
      </div>

      {/* Progress bar: Shrinks from Long (100%) to Short (0%), transitions Green -> Yellow -> Red */}
      <div className="w-full bg-tactical-950/90 h-2 rounded-full overflow-hidden border border-tactical-750/70 p-0.5">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-200 ease-out ${getBarColorClass()}`}
        />
      </div>
    </div>
  );
};
