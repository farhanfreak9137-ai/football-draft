/**
 * Deterministic pseudo-random number generator (Mulberry32).
 * Provides reproducible random floats, ints, and array shuffles.
 */
export class PRNG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a pseudo-random floating point number in [0, 1).
   */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a pseudo-random integer in [min, max] inclusive.
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a random element from an array.
   */
  pickOne<T>(items: readonly T[] | T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const index = Math.floor(this.next() * items.length);
    return items[index];
  }

  /**
   * Shuffles an array in place using Fisher-Yates.
   */
  shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Returns true with given probability (0 to 1).
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

