/**
 * Color grading for player OVR ratings:
 * - Under 80: White
 * - 80 - 89: Green (Emerald)
 * - 90 - 94: Golden
 * - 95 - 100: Reddish Glow (distinguishes the absolute pinnacle/superiority)
 */
export function getOvrColorClass(ovr: number): string {
  if (ovr >= 95) {
    return 'text-red-400 font-black drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]';
  }
  if (ovr >= 90) {
    return 'text-gold-400 font-black drop-shadow-[0_0_4px_rgba(243,207,85,0.45)]';
  }
  if (ovr >= 80) {
    return 'text-emerald-400 font-bold';
  }
  return 'text-white font-medium';
}

export function getOvrBadgeClass(ovr: number): string {
  if (ovr >= 95) {
    return 'bg-red-950/80 text-red-400 border border-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  }
  if (ovr >= 90) {
    return 'bg-amber-950/80 text-gold-400 border border-gold-500/60 shadow-[0_0_6px_rgba(243,207,85,0.4)]';
  }
  if (ovr >= 80) {
    return 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50';
  }
  return 'bg-tactical-800 text-tactical-100 border border-tactical-700';
}
