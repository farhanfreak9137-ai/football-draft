import {
  MatchEvent,
  MatchEventType,
  MatchSimulationState,
  PenaltyKickResult,
  PlayerDraftState,
  PlayerMatchRating,
  PlayerVersion,
  Position,
} from '../types/index.js';
import { PRNG } from './prng.js';

export interface MatchEngineConfig {
  knockoutMode?: boolean; // If true, draws proceed to extra time and penalties
  ratingWeight?: number; // Modest rating influence: default 0.05 (5%), prioritizing luck
  randomSeed?: number;
}

export function getVisualMinute(sec: number): number {
  if (sec <= 0) return 0;
  if (sec <= 22) return Math.min(45, Math.max(1, Math.round(sec * (45 / 22))));
  if (sec <= 45) return Math.min(90, Math.max(46, 45 + Math.round((sec - 22) * (45 / 23))));
  if (sec <= 52) return Math.min(105, Math.max(91, 90 + Math.round((sec - 45) * (15 / 7))));
  if (sec <= 60) return Math.min(120, Math.max(106, 105 + Math.round((sec - 52) * (15 / 8))));
  return 120;
}

export class MatchEngine {
  static getVisualMinute = getVisualMinute;
  /**
   * Generates a complete, authoritative match simulation with deterministic event timeline.
   */
  static simulateMatch(
    hostDraft: PlayerDraftState,
    guestDraft: PlayerDraftState,
    config: MatchEngineConfig = {}
  ): MatchSimulationState {
    const seed = config.randomSeed ?? Date.now();
    const prng = new PRNG(seed);
    const knockoutMode = config.knockoutMode ?? true;
    const ratingWeight = config.ratingWeight ?? 0.05;

    const hostPlayers = Object.values(hostDraft.draftedSlots).map((s) => s.player);
    const guestPlayers = Object.values(guestDraft.draftedSlots).map((s) => s.player);

    if (hostPlayers.length === 0 || guestPlayers.length === 0) {
      throw new Error('Both teams must have drafted players to simulate match');
    }

    const hostAvgOvr = hostPlayers.reduce((acc, p) => acc + p.ovr, 0) / hostPlayers.length;
    const guestAvgOvr = guestPlayers.reduce((acc, p) => acc + p.ovr, 0) / guestPlayers.length;

    // Modest rating adjustment: capped at +/- 5% advantage
    const rawDiff = (hostAvgOvr - guestAvgOvr) / 100;
    const ratingAdvantage = Math.max(-ratingWeight, Math.min(ratingWeight, rawDiff * ratingWeight));
    // Base probability that an attack belongs to host (50% base + rating advantage)
    const hostAttackChance = 0.5 + ratingAdvantage;

    const events: MatchEvent[] = [];
    let currentScore = { host: 0, guest: 0 };
    const stats = {
      host: { shots: 0, shotsOnTarget: 0, saves: 0, corners: 0, tackles: 0, fouls: 0 },
      guest: { shots: 0, shotsOnTarget: 0, saves: 0, corners: 0, tackles: 0, fouls: 0 },
    };

    // Helper: Select player by position group from squad
    const getSquadPlayer = (squad: PlayerVersion[], group: 'GK' | 'DEF' | 'MID' | 'FWD'): PlayerVersion => {
      const filtered = squad.filter((p) => {
        if (group === 'GK') return p.naturalPositions.includes('GK');
        if (group === 'DEF') return p.naturalPositions.some((pos) => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos));
        if (group === 'MID') return p.naturalPositions.some((pos) => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos));
        return p.naturalPositions.some((pos) => ['ST', 'CF', 'LW', 'RW', 'SS'].includes(pos));
      });
      return filtered.length > 0 ? prng.pickOne(filtered) : prng.pickOne(squad);
    };

    const createEvent = (
      second: number,
      period: MatchEvent['period'],
      type: MatchEventType,
      team: 'host' | 'guest',
      description: string,
      player?: PlayerVersion,
      secondaryPlayer?: PlayerVersion,
      pitchLocation?: { x: number; y: number },
      customMinute?: number
    ): MatchEvent => {
      const minute = customMinute ?? getVisualMinute(second);
      return {
        id: `ev-${second}-${type}-${prng.nextInt(1000, 9999)}`,
        second,
        minute,
        period,
        type,
        team,
        player: player ? {
          id: player.id,
          name: player.name,
          position: player.naturalPositions[0],
          squadNumber: player.squadNumber,
        } : undefined,
        secondaryPlayer: secondaryPlayer ? {
          id: secondaryPlayer.id,
          name: secondaryPlayer.name,
        } : undefined,
        description,
        score: { ...currentScore },
        pitchLocation,
      };
    };

    // 1. Kickoff (Visual 0', Real 0s)
    events.push(createEvent(0, 'first_half', 'kickoff', 'host', 'The match kicks off! Both sides battle for historical supremacy.', undefined, undefined, { x: 50, y: 50 }, 0));

    // Simulation loop for regular time (45 real seconds representing 90 visual minutes)
    for (let sec = 1; sec <= 45; sec++) {
      if (sec === 22) {
        events.push(createEvent(22, 'first_half', 'halftime', 'host', 'Half-time whistle blows! Teams head into the tactical dugout.', undefined, undefined, { x: 50, y: 50 }, 45));
        continue;
      }

      if (sec === 23) {
        events.push(createEvent(23, 'second_half', 'kickoff', 'guest', 'Second half underway! Tension is mounting on the pitch.', undefined, undefined, { x: 50, y: 50 }, 46));
        continue;
      }

      // Roll chance of significant match action (~18% chance per real second -> 6-8 key highlights per match)
      if (prng.chance(0.18)) {
        const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
        const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
        const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
        const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;
        const currentPeriod: MatchEvent['period'] = sec <= 22 ? 'first_half' : 'second_half';

        const actionRoll = prng.next();

        if (actionRoll < 0.42) {
          // 1. GOAL! (approx 2-3 goals per match)
          const scorer = getSquadPlayer(attackingSquad, 'FWD');
          const assister = getSquadPlayer(attackingSquad, 'MID');
          stats[attackingTeam].shots++;
          stats[attackingTeam].shotsOnTarget++;
          currentScore[attackingTeam]++;

          const goalPhrases = [
            `GOAL! ${scorer.name} clinically strikes into the bottom corner after an exquisite pass from ${assister.name}! (${currentScore.host}-${currentScore.guest})`,
            `GOAL! Sensational finish! ${scorer.name} unleashes a thunderous volley into the top corner! (${currentScore.host}-${currentScore.guest})`,
            `GOAL! ${scorer.name} rises highest and powers an unstoppable header home from ${assister.name}'s delivery! (${currentScore.host}-${currentScore.guest})`,
            `GOAL! Pure individual magic from ${scorer.name}! Dribbles past the defender and chips the goalkeeper with supreme composure! (${currentScore.host}-${currentScore.guest})`,
          ];

          events.push(createEvent(
            sec,
            currentPeriod,
            'goal',
            attackingTeam,
            prng.pickOne(goalPhrases),
            scorer,
            assister,
            { x: attackingTeam === 'host' ? 95 : 5, y: 50 }
          ));
        } else if (actionRoll < 0.82) {
          // 2. MAGICAL SAVE!
          const shooter = getSquadPlayer(attackingSquad, 'FWD');
          const keeper = getSquadPlayer(defendingSquad, 'GK');
          stats[attackingTeam].shots++;
          stats[attackingTeam].shotsOnTarget++;
          stats[defendingTeam].saves++;

          const savePhrases = [
            `MAGICAL SAVE! ${keeper.name} produces an unbelievable flying fingertip save to deny ${shooter.name}'s thunderous shot!`,
            `MAGICAL SAVE! Incredible point-blank reflex stop on the goal-line by ${keeper.name}!`,
            `MAGICAL SAVE! ${keeper.name} dashes off his line with an astonishing one-on-one diving save against ${shooter.name}!`,
            `MAGICAL SAVE! Miraculous acrobatic dive by ${keeper.name} tipping the ball over the crossbar!`,
          ];

          events.push(createEvent(
            sec,
            currentPeriod,
            'save',
            defendingTeam,
            prng.pickOne(savePhrases),
            keeper,
            shooter,
            { x: attackingTeam === 'host' ? 90 : 10, y: 50 }
          ));
        } else if (actionRoll < 0.95) {
          // 3. YELLOW CARD!
          const defender = getSquadPlayer(defendingSquad, 'DEF');
          const attacker = getSquadPlayer(attackingSquad, 'FWD');
          stats[defendingTeam].fouls++;

          const cardPhrases = [
            `YELLOW CARD! ${defender.name} is booked for a cynical tactical slide to break up ${attacker.name}'s counter-attack.`,
            `YELLOW CARD! Referee shows yellow to ${defender.name} following a fierce lunging challenge on ${attacker.name}.`,
            `YELLOW CARD! ${defender.name} goes into the referee's notebook for an aggressive shirt pull on the break.`,
          ];

          events.push(createEvent(
            sec,
            currentPeriod,
            'yellow_card',
            defendingTeam,
            prng.pickOne(cardPhrases),
            defender,
            attacker,
            { x: attackingTeam === 'host' ? 65 : 35, y: prng.nextInt(30, 70) }
          ));
        } else {
          // 4. RED CARD! (Dramatic & rare)
          const defender = getSquadPlayer(defendingSquad, 'DEF');
          stats[defendingTeam].fouls++;

          events.push(createEvent(
            sec,
            currentPeriod,
            'red_card',
            defendingTeam,
            `RED CARD! ${defender.name} is sent off for a dangerous last-man tackle denying a clear goalscoring opportunity!`,
            defender,
            undefined,
            { x: attackingTeam === 'host' ? 80 : 20, y: prng.nextInt(35, 65) }
          ));
        }
      }
    }

    events.push(createEvent(45, 'second_half', 'fulltime', 'host', `Full-time whistle blows! Final score: ${currentScore.host} - ${currentScore.guest}`, undefined, undefined, { x: 50, y: 50 }, 90));

    let totalDuration = 45;
    let matchWinner: 'host' | 'guest' | 'draw' =
      currentScore.host > currentScore.guest ? 'host' : currentScore.guest > currentScore.host ? 'guest' : 'draw';
    let winMethod: MatchSimulationState['winMethod'] = matchWinner === 'draw' ? 'draw' : 'regular_time';
    const penalties: PenaltyKickResult[] = [];
    let penaltyScore: { host: number; guest: number } | undefined;

    // Check Extra Time if tied and knockoutMode is active (15 real seconds: 46-60)
    if (matchWinner === 'draw' && knockoutMode) {
      totalDuration = 60;
      winMethod = 'extra_time';

      events.push(createEvent(45, 'extra_time_1', 'extra_time_start', 'host', 'Match is tied! Heading into Extra Time (two rapid halves).', undefined, undefined, { x: 50, y: 50 }, 91));

      // Extra Time First Half: real seconds 46 to 52 (visual 91' to 105')
      for (let sec = 46; sec <= 52; sec++) {
        if (prng.chance(0.25)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.35)) {
            // Extra time goal
            const scorer = getSquadPlayer(attackingSquad, 'FWD');
            const assister = getSquadPlayer(attackingSquad, 'MID');
            currentScore[attackingTeam]++;
            events.push(createEvent(
              sec,
              'extra_time_1',
              'goal',
              attackingTeam,
              `EXTRA TIME GOAL! Dramatic finish by ${scorer.name} after a through-ball from ${assister.name}! (${currentScore.host}-${currentScore.guest})`,
              scorer,
              assister,
              { x: attackingTeam === 'host' ? 95 : 5, y: 50 }
            ));
          } else {
            const shooter = getSquadPlayer(attackingSquad, 'FWD');
            const keeper = getSquadPlayer(defendingSquad, 'GK');
            stats[defendingTeam].saves++;
            events.push(createEvent(
              sec,
              'extra_time_1',
              'save',
              defendingTeam,
              `MAGICAL SAVE! ${keeper.name} keeps his team alive with a stunning extra-time reflex save!`,
              keeper,
              shooter
            ));
          }
        }
      }

      events.push(createEvent(52, 'extra_time_1', 'extra_time_half', 'host', 'Half-time in Extra Time. Quick turnaround.', undefined, undefined, { x: 50, y: 50 }, 105));

      // Extra Time Second Half: real seconds 53 to 60 (visual 106' to 120')
      for (let sec = 53; sec <= 59; sec++) {
        if (prng.chance(0.25)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.35)) {
            // Extra time goal
            const scorer = getSquadPlayer(attackingSquad, 'FWD');
            const assister = getSquadPlayer(attackingSquad, 'MID');
            currentScore[attackingTeam]++;
            events.push(createEvent(
              sec,
              'extra_time_2',
              'goal',
              attackingTeam,
              `LATE DRAMA! ${scorer.name} strikes in the dying moments of extra time! (${currentScore.host}-${currentScore.guest})`,
              scorer,
              assister,
              { x: attackingTeam === 'host' ? 95 : 5, y: 50 }
            ));
          } else {
            const shooter = getSquadPlayer(attackingSquad, 'FWD');
            const keeper = getSquadPlayer(defendingSquad, 'GK');
            stats[defendingTeam].saves++;
            events.push(createEvent(
              sec,
              'extra_time_2',
              'save',
              defendingTeam,
              `MAGICAL SAVE! Heroic save by ${keeper.name} in the final minutes!`,
              keeper,
              shooter
            ));
          }
        }
      }

      events.push(createEvent(60, 'extra_time_2', 'extra_time_end', 'host', `Extra time ends! Score: ${currentScore.host} - ${currentScore.guest}`, undefined, undefined, { x: 50, y: 50 }, 120));

      // Check if decided in Extra Time
      if (currentScore.host !== currentScore.guest) {
        matchWinner = currentScore.host > currentScore.guest ? 'host' : 'guest';
        winMethod = 'extra_time';
      } else {
        // PENALTY SHOOTOUT (starts at real second 60)
        winMethod = 'penalties';
        events.push(createEvent(60, 'penalties', 'penalty_shootout_start', 'host', 'Score remains level after Extra Time! Proceeding to the Penalty Shootout!', undefined, undefined, { x: 50, y: 50 }, 120));

        const currentPenScore = { host: 0, guest: 0 };
        const hostKickers = [...hostPlayers];
        const guestKickers = [...guestPlayers];

        // Standard 5 rounds alternating
        let hostTaken = 0;
        let guestTaken = 0;
        let shootoutWinner: 'host' | 'guest' | null = null;

        for (let round = 1; round <= 5; round++) {
          // Host kick
          const hostKicker = hostKickers[(round - 1) % hostKickers.length];
          const hostScored = prng.chance(0.75); // Standard 75% football penalty conversion rate
          if (hostScored) currentPenScore.host++;
          hostTaken++;

          penalties.push({
            round,
            team: 'host',
            kicker: { id: hostKicker.id, name: hostKicker.name, squadNumber: hostKicker.squadNumber },
            scored: hostScored,
            scoreAfterKick: { ...currentPenScore },
            description: hostScored
              ? `${hostKicker.name} calmly buries the penalty!`
              : `${hostKicker.name} misses! The goalkeeper denies the spot kick!`,
          });

          // Early termination check if mathematically impossible for guest
          const guestMaxRemaining = 5 - guestTaken;
          if (currentPenScore.host > currentPenScore.guest + guestMaxRemaining) {
            shootoutWinner = 'host';
            break;
          }
          if (currentPenScore.guest > currentPenScore.host + (5 - hostTaken)) {
            shootoutWinner = 'guest';
            break;
          }

          // Guest kick
          const guestKicker = guestKickers[(round - 1) % guestKickers.length];
          const guestScored = prng.chance(0.75);
          if (guestScored) currentPenScore.guest++;
          guestTaken++;

          penalties.push({
            round,
            team: 'guest',
            kicker: { id: guestKicker.id, name: guestKicker.name, squadNumber: guestKicker.squadNumber },
            scored: guestScored,
            scoreAfterKick: { ...currentPenScore },
            description: guestScored
              ? `${guestKicker.name} slots it into the net!`
              : `${guestKicker.name} hits the woodwork! Penalty missed!`,
          });

          // Early termination check
          if (currentPenScore.host > currentPenScore.guest + (5 - guestTaken)) {
            shootoutWinner = 'host';
            break;
          }
          if (currentPenScore.guest > currentPenScore.host + (5 - hostTaken)) {
            shootoutWinner = 'guest';
            break;
          }
        }

        // Sudden death if still level after 5 rounds
        let suddenDeathRound = 6;
        while (!shootoutWinner && suddenDeathRound <= 15) {
          const hostKicker = hostKickers[(suddenDeathRound - 1) % hostKickers.length];
          const hostScored = prng.chance(0.70);
          if (hostScored) currentPenScore.host++;

          penalties.push({
            round: suddenDeathRound,
            team: 'host',
            kicker: { id: hostKicker.id, name: hostKicker.name, squadNumber: hostKicker.squadNumber },
            scored: hostScored,
            scoreAfterKick: { ...currentPenScore },
            description: hostScored
              ? `Sudden death: ${hostKicker.name} scores!`
              : `Sudden death: ${hostKicker.name} is saved!`,
          });

          const guestKicker = guestKickers[(suddenDeathRound - 1) % guestKickers.length];
          const guestScored = prng.chance(0.70);
          if (guestScored) currentPenScore.guest++;

          penalties.push({
            round: suddenDeathRound,
            team: 'guest',
            kicker: { id: guestKicker.id, name: guestKicker.name, squadNumber: guestKicker.squadNumber },
            scored: guestScored,
            scoreAfterKick: { ...currentPenScore },
            description: guestScored
              ? `Sudden death: ${guestKicker.name} responds with a goal!`
              : `Sudden death: ${guestKicker.name} fails to convert!`,
          });

          if (currentPenScore.host > currentPenScore.guest) {
            shootoutWinner = 'host';
          } else if (currentPenScore.guest > currentPenScore.host) {
            shootoutWinner = 'guest';
          }
          suddenDeathRound++;
        }

        // Failsafe tie-break if reaches max sudden death rounds (luck-based)
        if (!shootoutWinner) {
          shootoutWinner = prng.chance(0.5) ? 'host' : 'guest';
        }

        matchWinner = shootoutWinner;
        penaltyScore = { ...currentPenScore };
        events.push(createEvent(60, 'penalties', 'match_end', matchWinner, `Shootout finished! ${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} wins the penalty shootout (${currentPenScore.host}-${currentPenScore.guest})!`, undefined, undefined, { x: 50, y: 50 }, 120));
      }
    }

    events.push(createEvent(totalDuration, totalDuration <= 45 ? 'second_half' : 'extra_time_2', 'match_end', matchWinner === 'draw' ? 'host' : matchWinner, `Final Result: ${matchWinner === 'draw' ? 'Match Drawn' : `${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} victorious!`} [Score: ${currentScore.host}-${currentScore.guest}]`, undefined, undefined, { x: 50, y: 50 }, totalDuration <= 45 ? 90 : 120));

    return {
      matchId: `match-${seed}`,
      seed,
      status: 'not_started',
      currentSecond: 0,
      totalDurationSeconds: totalDuration,
      startTime: 0,
      knockoutMode,
      matchFormat: knockoutMode ? 'cup' : 'league',
      score: currentScore,
      events,
      penalties,
      penaltyScore,
      winner: matchWinner,
      winMethod,
      stats,
    };
  }

  /**
   * Calculates the authoritative current state of a match at a given server timestamp.
   * Handles reconnects, elapsed real time, extra time, and penalty steps cleanly.
   */
  static getAuthoritativeStateAtTime(
    simulation: MatchSimulationState,
    now: number
  ): MatchSimulationState {
    if (simulation.startTime === 0 || simulation.status === 'not_started') {
      return simulation;
    }

    const elapsedSeconds = Math.max(0, Math.floor((now - simulation.startTime) / 1000));
    const currentSecond = Math.min(elapsedSeconds, simulation.totalDurationSeconds);

    let status: MatchSimulationState['status'] = 'live';

    // Penalty shootout handling if match tied after extra time
    let visiblePenalties: PenaltyKickResult[] = [];
    let livePenaltyScore: { host: number; guest: number } | undefined = undefined;

    if (simulation.winMethod === 'penalties' && simulation.penalties && simulation.penalties.length > 0) {
      if (currentSecond < 60) {
        status = currentSecond === 22 ? 'halftime' : currentSecond > 45 ? 'extra_time' : 'live';
      } else {
        // After 60s: each penalty kick reveals consecutively every 1.5 seconds
        const penElapsed = Math.max(0, (now - simulation.startTime) / 1000 - 60);
        const totalPenDuration = simulation.penalties.length * 1.5;
        const visibleKicks = Math.min(
          simulation.penalties.length,
          Math.max(1, Math.floor(penElapsed / 1.5) + 1)
        );
        visiblePenalties = simulation.penalties.slice(0, visibleKicks);
        livePenaltyScore = { host: 0, guest: 0 };
        for (const p of visiblePenalties) {
          if (p.scored) livePenaltyScore[p.team]++;
        }

        if (penElapsed < totalPenDuration) {
          status = 'penalties';
        } else {
          status = 'completed';
        }
      }
    } else {
      if (currentSecond >= simulation.totalDurationSeconds) {
        status = 'completed';
      } else if (currentSecond === 22) {
        status = 'halftime';
      } else if (currentSecond > 45 && simulation.totalDurationSeconds > 45) {
        status = 'extra_time';
      }
    }

    // Filter events that have happened strictly up to currentSecond
    const visibleEvents = simulation.events.filter((ev) => ev.second <= currentSecond);

    // Compute live score and stats from visible events
    const currentScore = { host: 0, guest: 0 };
    const liveStats = {
      host: { shots: 0, shotsOnTarget: 0, saves: 0, corners: 0, tackles: 0, fouls: 0 },
      guest: { shots: 0, shotsOnTarget: 0, saves: 0, corners: 0, tackles: 0, fouls: 0 },
    };

    for (const ev of visibleEvents) {
      if (ev.type === 'goal') {
        currentScore[ev.team]++;
        liveStats[ev.team].shots++;
        liveStats[ev.team].shotsOnTarget++;
      } else if (ev.type === 'save') {
        const opposing = ev.team === 'host' ? 'guest' : 'host';
        liveStats[opposing].saves++;
        liveStats[ev.team].shots++;
        liveStats[ev.team].shotsOnTarget++;
      } else if (ev.type === 'yellow_card' || ev.type === 'red_card') {
        liveStats[ev.team].fouls++;
      }
    }

    const isFinished = status === 'completed';

    return {
      ...simulation,
      status,
      currentSecond,
      score: currentScore,
      events: visibleEvents,
      penalties: visiblePenalties,
      penaltyScore: livePenaltyScore,
      winner: isFinished ? simulation.winner : undefined,
      winMethod: isFinished ? simulation.winMethod : undefined,
      stats: liveStats,
    };
  }

  /**
   * Computes authentic post-match player ratings (5.0 - 10.0 scale)
   * factoring individual goals, assists, saves, clean sheets, disciplinary actions,
   * penalty kicks, team match outcome, and base historical OVR.
   */
  static computePlayerRatings(
    hostDraft: PlayerDraftState,
    guestDraft: PlayerDraftState,
    simulation: MatchSimulationState
  ): {
    hostRatings: PlayerMatchRating[];
    guestRatings: PlayerMatchRating[];
    starOfMatch: PlayerMatchRating | null;
  } {
    const isHostWinner = simulation.winner === 'host';
    const isGuestWinner = simulation.winner === 'guest';
    const isDraw = !simulation.winner || simulation.winner === 'draw';

    const hostConceded = simulation.score.guest;
    const guestConceded = simulation.score.host;

    const POSITION_ORDER: Record<string, number> = {
      GK: 1, LB: 2, LWB: 3, CB: 4, RB: 5, RWB: 6,
      CDM: 7, CM: 8, CAM: 9, LM: 10, RM: 11,
      LW: 12, RW: 13, CF: 14, SS: 15, ST: 16,
    };

    const rateSquad = (
      draft: PlayerDraftState,
      team: 'host' | 'guest',
      teamConceded: number,
      won: boolean,
      draw: boolean
    ): PlayerMatchRating[] => {
      const slots = Object.values(draft.draftedSlots);
      const ratings = slots.map((slot) => {
        const p = slot.player;
        const pos = slot.assignedPosition;
        const isGK = pos === 'GK' || p.naturalPositions.includes('GK');
        const isDef = ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos) || p.naturalPositions.some((np) => ['CB', 'LB', 'RB'].includes(np));

        let goals = 0;
        let assists = 0;
        let saves = 0;
        let yellowCard = false;
        let redCard = false;

        for (const ev of simulation.events) {
          if (ev.type === 'goal') {
            if (ev.player?.id === p.id) goals++;
            if (ev.secondaryPlayer?.id === p.id) assists++;
          } else if (ev.type === 'save') {
            if (ev.player?.id === p.id || (isGK && ev.team !== team)) {
              saves++;
            }
          } else if (ev.type === 'yellow_card') {
            if (ev.player?.id === p.id) yellowCard = true;
          } else if (ev.type === 'red_card') {
            if (ev.player?.id === p.id) redCard = true;
          }
        }

        let penaltyScored = false;
        let penaltyMissed = false;
        if (simulation.penalties) {
          for (const pen of simulation.penalties) {
            if (pen.team === team && pen.kicker?.id === p.id) {
              if (pen.scored) penaltyScored = true;
              else penaltyMissed = true;
            }
          }
        }

        const cleanSheet = teamConceded === 0;

        // Base rating starts around 6.2
        let score = 6.2;

        // Modest quality adjustment from historical OVR (+0.03 per OVR above 80)
        score += (p.ovr - 80) * 0.03;

        // Team outcome impact
        if (won) score += 0.5;
        else if (draw) score += 0.1;
        else score -= 0.3;

        // Clean sheet & defensive impact
        if (cleanSheet && (isGK || isDef)) {
          score += 0.8;
        } else if (teamConceded > 0 && (isGK || isDef)) {
          score -= teamConceded * 0.2;
        }

        // Saves
        score += saves * 0.35;

        // Goals
        if (isDef) score += goals * 1.3;
        else score += goals * 1.0;

        // Assists
        score += assists * 0.5;

        // Cards
        if (yellowCard) score -= 0.5;
        if (redCard) score -= 1.5;

        // Penalties
        if (penaltyScored) score += 0.3;
        if (penaltyMissed) score -= 0.5;

        // Clamp between 5.0 and 10.0
        score = Math.max(5.0, Math.min(10.0, score));
        const finalRating = Math.round(score * 10) / 10;

        const highlights: string[] = [];
        if (goals > 0) highlights.push(`${goals} Goal${goals > 1 ? 's' : ''}`);
        if (assists > 0) highlights.push(`${assists} Assist${assists > 1 ? 's' : ''}`);
        if (saves > 0) highlights.push(`${saves} Save${saves > 1 ? 's' : ''}`);
        if (cleanSheet && (isGK || isDef)) highlights.push('Clean Sheet');
        if (redCard) highlights.push('Red Card');
        else if (yellowCard) highlights.push('Cautioned');
        if (penaltyScored) highlights.push('Shootout Goal');

        let summary = highlights.join(' • ');
        if (!summary) {
          if (finalRating >= 8.0) summary = 'High-Impact Performance';
          else if (finalRating >= 7.0) summary = 'Solid Tactical Display';
          else if (finalRating >= 6.0) summary = 'Steady Performance';
          else summary = 'Quiet Match';
        }

        return {
          playerId: p.id,
          name: p.name,
          squadNumber: p.squadNumber,
          position: pos,
          ovr: p.ovr,
          team,
          rating: finalRating,
          stats: {
            goals,
            assists,
            saves,
            yellowCard,
            redCard,
            penaltyScored,
            penaltyMissed,
            cleanSheet,
          },
          summary,
        };
      });

      // Sort naturally in tactical line order: GK -> DEF -> MID -> FWD
      ratings.sort((a, b) => (POSITION_ORDER[a.position] || 99) - (POSITION_ORDER[b.position] || 99));
      return ratings;
    };

    const hostRatings = rateSquad(hostDraft, 'host', hostConceded, isHostWinner, isDraw);
    const guestRatings = rateSquad(guestDraft, 'guest', guestConceded, isGuestWinner, isDraw);

    // Determine Player of the Match (highest rated, tie-break: goals -> OVR -> squad #)
    const all = [...hostRatings, ...guestRatings];
    let star: PlayerMatchRating | null = null;
    if (all.length > 0) {
      all.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        if (b.stats.goals !== a.stats.goals) return b.stats.goals - a.stats.goals;
        return b.ovr - a.ovr;
      });
      star = all[0];
      star.isStarOfMatch = true;
      star.summary = star.summary ? `★ Player of the Match • ${star.summary}` : '★ Player of the Match';
    }

    return {
      hostRatings,
      guestRatings,
      starOfMatch: star,
    };
  }
}

