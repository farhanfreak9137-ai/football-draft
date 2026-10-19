import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

interface TimerCountdownProps {
  deadline: number; // Server epoch deadline in ms
  isActive: boolean;
  onTimeout?: () => void;
}

export const TimerCountdown: React.FC<TimerCountdownProps> = ({
  deadline,
  isActive,
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

      // Warning sound on each second when <= 10 seconds remaining
      if (diff <= 10 && diff > 0) {
        soundManager.playTimerTick();
      }

      if (diff === 0 && onTimeout) {
        onTimeout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline, isActive, onTimeout]);

  const percentage = Math.min(100, Math.max(0, (secondsRemaining / 40) * 100));
  const isUrgent = secondsRemaining <= 10;

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isUrgent
          ? 'bg-red-950/40 border-red-500/60 text-red-200'
          : 'bg-tactical-800 border-tactical-700 text-tactical-100'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 font-medium text-xs">
          {isUrgent ? (
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          ) : (
            <Clock className="w-4 h-4 text-tactical-400" />
          )}
          <span>{isUrgent ? 'Turn Expiry Warning' : 'Turn Clock'}</span>
        </div>
        <span
          className={`font-mono font-bold text-base ${
            isUrgent ? 'text-red-400 animate-pulse' : 'text-tactical-100'
          }`}
        >
          {secondsRemaining}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-tactical-700 h-1.5 rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-red-500' : 'bg-pitch-accent'
          }`}
        />
      </div>
    </div>
  );
};

