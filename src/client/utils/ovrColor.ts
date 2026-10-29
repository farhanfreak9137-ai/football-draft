/**
 * Premium sports color grading for player OVR ratings:
 * - Under 80: Silver / Foundation (Sleek slate)
 * - 80 - 84: Top Flight Starter (Sapphire Sky)
 * - 85 - 89: International Star (Turf Emerald)
 * - 90 - 94: World Class Elite (Champions Metallic Gold)
 * - 95 - 100: Immortal Legend (Radiant Prismatic Gold & Astral Shimmer)
 */
export function getOvrColorClass(ovr: number): string {
  if (ovr >= 95) {
    return 'text-amber-200 font-black drop-shadow-[0_0_8px_rgba(253,224,71,0.85)] tracking-tight';
  }
  if (ovr >= 90) {
    return 'text-amber-400 font-extrabold drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]';
  }
  if (ovr >= 85) {
    return 'text-emerald-300 font-bold';
  }
  if (ovr >= 80) {
    return 'text-sky-300 font-semibold';
  }
  return 'text-slate-300 font-medium';
}

export function getOvrBadgeClass(ovr: number): string {
  if (ovr >= 95) {
    return 'bg-gradient-to-r from-amber-500/25 via-purple-500/25 to-sky-500/25 text-amber-200 border border-amber-300/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
  }
  if (ovr >= 90) {
    return 'bg-amber-950/80 text-amber-300 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
  }
  if (ovr >= 85) {
    return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50';
  }
  if (ovr >= 80) {
    return 'bg-sky-950/70 text-sky-300 border border-sky-500/40';
  }
  return 'bg-tactical-800/90 text-tactical-200 border border-tactical-700/80';
}
