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
