import {
  MatchEvent,
  MatchEventType,
  MatchSimulationState,
  PenaltyKickResult,
  PlayerDraftState,
  PlayerMatchRating,
  PlayerVersion,
  Position,
  SquadRoles,
  LiveMentality,
  DefensiveStyle,
  PassingStyle,
  TouchlineShout,
  TacticalInstructions,
} from '../types/index.js';
import { PRNG } from './prng.js';

export interface MatchEngineConfig {
  knockoutMode?: boolean; // If true, draws proceed to extra time and penalties
  ratingWeight?: number; // Modest rating influence: default 0.05 (5%), prioritizing luck
  randomSeed?: number;
  matchDurationSec?: number; // 45s blitz (default), 90s classic, 180s (3m manager), 240s (4m tactical)
  roles?: SquadRoles;
  liveMentality?: LiveMentality;
}

export function calculateVisualMinute(sec: number, regDuration = 45): number {
  if (sec <= 0) return 0;
  const halfSec = Math.floor(regDuration / 2);
  if (sec <= halfSec) {
    return Math.min(45, Math.max(1, Math.round(sec * (45 / halfSec))));
  }
  if (sec <= regDuration) {
    return Math.min(90, Math.max(46, 45 + Math.round((sec - halfSec) * (45 / (regDuration - halfSec)))));
  }
  const et1End = regDuration + Math.max(7, Math.floor(regDuration * 0.16));
  if (sec <= et1End) {
    return Math.min(105, Math.max(91, 90 + Math.round((sec - regDuration) * (15 / Math.max(1, et1End - regDuration)))));
  }
  const et2End = regDuration + Math.max(14, Math.floor(regDuration * 0.33));
  if (sec <= et2End) {
    return Math.min(120, Math.max(106, 105 + Math.round((sec - et1End) * (15 / Math.max(1, et2End - et1End)))));
  }
  return 120;
}

export function getVisualMinute(sec: number, regDuration = 45): number {
  return calculateVisualMinute(sec, regDuration);
}

export class MatchEngine {
  static getVisualMinute = getVisualMinute;
  static calculateVisualMinute = calculateVisualMinute;

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
    const regDuration = config.matchDurationSec || 45;
    const halfTimeSec = Math.floor(regDuration / 2);
    const liveMentality: LiveMentality = config.liveMentality || 'balanced';

    const hostPlayers = Object.values(hostDraft.draftedSlots).map((s) => s.player);
    const guestPlayers = Object.values(guestDraft.draftedSlots).map((s) => s.player);

    if (hostPlayers.length === 0 || guestPlayers.length === 0) {
      throw new Error('Both teams must have drafted players to simulate match');
    }

    const hostAvgOvr = hostPlayers.reduce((acc, p) => acc + p.ovr, 0) / hostPlayers.length;
    const guestAvgOvr = guestPlayers.reduce((acc, p) => acc + p.ovr, 0) / guestPlayers.length;

    // Modest rating adjustment: capped at +/- 5% advantage
    const rawDiff = (hostAvgOvr - guestAvgOvr) / 100;
    let ratingAdvantage = Math.max(-ratingWeight, Math.min(ratingWeight, rawDiff * ratingWeight));

    // Tactical mentality modifier
    if (liveMentality === 'attacking') {
      ratingAdvantage += 0.08;
    } else if (liveMentality === 'defensive') {
      ratingAdvantage -= 0.04;
    }

    // Base probability that an attack belongs to host (50% base + rating advantage)
    const hostAttackChance = Math.max(0.25, Math.min(0.75, 0.5 + ratingAdvantage));

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

    // Helper: Find assigned specialist from squad roles
    const getSpecialist = (
      draft: PlayerDraftState,
      roleType: 'captain' | 'penalty' | 'freeKick' | 'corner',
      fallbackGroup: 'GK' | 'DEF' | 'MID' | 'FWD'
    ): PlayerVersion => {
      const roles = draft.roles;
      let slotId: string | undefined;
      if (roleType === 'captain') slotId = roles?.captainSlotId;
      else if (roleType === 'penalty') slotId = roles?.penaltySlotId;
      else if (roleType === 'freeKick') slotId = roles?.freeKickSlotId;
      else if (roleType === 'corner') slotId = roles?.cornerSlotId;

      if (slotId && draft.draftedSlots[slotId]) {
        return draft.draftedSlots[slotId].player;
      }
      const squad = Object.values(draft.draftedSlots).map((s) => s.player);
      return getSquadPlayer(squad, fallbackGroup);
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
      const minute = customMinute ?? calculateVisualMinute(second, regDuration);
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
          position: secondaryPlayer.naturalPositions[0],
          squadNumber: secondaryPlayer.squadNumber,
        } : undefined,
        description,
        score: { ...currentScore },
        pitchLocation,
      };
    };

    // 1. Kickoff (Visual 0', Real 0s)
    events.push(createEvent(0, 'first_half', 'kickoff', 'host', 'The match kicks off! Both sides battle for historical supremacy.', undefined, undefined, { x: 50, y: 50 }, 0));

    // Calculate action chance per second based on duration
    const actionChance = regDuration <= 45 ? 0.18 : regDuration <= 90 ? 0.14 : regDuration <= 180 ? 0.10 : 0.08;

    // Simulation loop for regular time
    for (let sec = 1; sec <= regDuration; sec++) {
      if (sec === halfTimeSec) {
        events.push(createEvent(halfTimeSec, 'first_half', 'halftime', 'host', 'Half-time whistle blows! Teams head into the tactical dugout.', undefined, undefined, { x: 50, y: 50 }, 45));
        continue;
      }

      if (sec === halfTimeSec + 1) {
        events.push(createEvent(halfTimeSec + 1, 'second_half', 'kickoff', 'guest', 'Second half underway! Tension is mounting on the pitch.', undefined, undefined, { x: 50, y: 50 }, 46));
        continue;
      }

      // Roll chance of significant match action
      if (prng.chance(actionChance)) {
        const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
        const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
        const attackingDraft = attackingTeam === 'host' ? hostDraft : guestDraft;
        const defendingDraft = attackingTeam === 'host' ? guestDraft : hostDraft;
        const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
        const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;
        const currentPeriod: MatchEvent['period'] = sec <= halfTimeSec ? 'first_half' : 'second_half';

        const actionRoll = prng.next();

        if (actionRoll < 0.40) {
          // 1. GOAL!
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
        } else if (actionRoll < 0.76) {
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
        } else if (actionRoll < 0.88) {
          // 3. DEFENSIVE INTERVENTION / TACKLE
          const defender = getSquadPlayer(defendingSquad, 'DEF');
          const attacker = getSquadPlayer(attackingSquad, 'FWD');
          stats[defendingTeam].tackles++;

          events.push(createEvent(
            sec,
            currentPeriod,
            'defensive_intervention',
            defendingTeam,
            `BRILLIANT TACKLE! ${defender.name} executes a masterclass sliding tackle to stop ${attacker.name}'s counter-attack!`,
            defender,
            attacker,
            { x: attackingTeam === 'host' ? 70 : 30, y: prng.nextInt(20, 80) }
          ));
        } else if (actionRoll < 0.94) {
          // 4. SET PIECE (FREE KICK / CORNER)
          const setPieceTaker = getSpecialist(attackingDraft, 'freeKick', 'MID');
          const defender = getSquadPlayer(defendingSquad, 'DEF');
          stats[attackingTeam].shots++;
          stats[defendingTeam].fouls++;

          if (prng.chance(0.35)) {
            // Direct free-kick goal!
            currentScore[attackingTeam]++;
            stats[attackingTeam].shotsOnTarget++;
            events.push(createEvent(
              sec,
              currentPeriod,
              'goal',
              attackingTeam,
              `STUNNING FREE-KICK GOAL! ${setPieceTaker.name} curls a breathtaking direct free-kick over the wall into the top corner! (${currentScore.host}-${currentScore.guest})`,
              setPieceTaker,
              defender,
              { x: attackingTeam === 'host' ? 95 : 5, y: 40 }
            ));
          } else {
            events.push(createEvent(
              sec,
              currentPeriod,
              'shot',
              attackingTeam,
              `DANGEROUS FREE-KICK! ${setPieceTaker.name} curls the ball beautifully, but it whistles just inches past the post!`,
              setPieceTaker,
              defender,
              { x: attackingTeam === 'host' ? 88 : 12, y: 40 }
            ));
          }
        } else {
          // 5. DISCIPLINARY / YELLOW CARD
          const foulCommitter = getSquadPlayer(defendingSquad, 'DEF');
          stats[defendingTeam].fouls++;

          events.push(createEvent(
            sec,
            currentPeriod,
            'yellow_card',
            defendingTeam,
            `YELLOW CARD! Referee cautions ${foulCommitter.name} for a cynical tactical trip.`,
            foulCommitter,
            undefined,
            { x: attackingTeam === 'host' ? 65 : 35, y: prng.nextInt(20, 80) }
          ));
        }
      }
    }

    // Fulltime Event
    events.push(createEvent(
      regDuration,
      'second_half',
      'fulltime',
      'host',
      `Full-time whistle! Final regular score: ${currentScore.host} - ${currentScore.guest}`,
      undefined,
      undefined,
      { x: 50, y: 50 },
      90
    ));

    let totalDuration = regDuration;
    let matchWinner: 'host' | 'guest' | 'draw' =
      currentScore.host > currentScore.guest ? 'host' : currentScore.guest > currentScore.host ? 'guest' : 'draw';
    let winMethod: 'regular_time' | 'extra_time' | 'penalties' | 'draw' = 'regular_time';

    const penalties: PenaltyKickResult[] = [];
    let penaltyScore: { host: number; guest: number } | undefined = undefined;

    // Knockout extra-time & penalties handling
    if (knockoutMode && matchWinner === 'draw') {
      const etTotal = Math.max(15, Math.floor(regDuration * 0.33));
      const et1Duration = Math.floor(etTotal / 2);
      const et2Duration = etTotal - et1Duration;
      const et1Start = regDuration + 1;
      const et1End = regDuration + et1Duration;
      const et2Start = et1End + 1;
      const et2End = regDuration + etTotal;
      totalDuration = et2End;
      winMethod = 'extra_time';

      events.push(createEvent(et1Start, 'extra_time_1', 'extra_time_start', 'host', 'Match is tied! Heading into Extra Time (two tactical periods).', undefined, undefined, { x: 50, y: 50 }, 91));

      // Extra Time 1
      for (let sec = et1Start; sec <= et1End; sec++) {
        if (prng.chance(actionChance * 1.2)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.35)) {
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

      events.push(createEvent(et1End, 'extra_time_1', 'extra_time_half', 'host', 'Half-time in Extra Time. Quick turnaround.', undefined, undefined, { x: 50, y: 50 }, 105));

      // Extra Time 2
      for (let sec = et2Start; sec <= et2End; sec++) {
        if (prng.chance(actionChance * 1.2)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.35)) {
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

      events.push(createEvent(et2End, 'extra_time_2', 'extra_time_end', 'host', `Extra time ends! Score: ${currentScore.host} - ${currentScore.guest}`, undefined, undefined, { x: 50, y: 50 }, 120));

      if (currentScore.host !== currentScore.guest) {
        matchWinner = currentScore.host > currentScore.guest ? 'host' : 'guest';
        winMethod = 'extra_time';
      } else {
        // PENALTY SHOOTOUT
        winMethod = 'penalties';
        events.push(createEvent(et2End, 'penalties', 'penalty_shootout_start', 'host', 'Score remains level after Extra Time! Proceeding to the Penalty Shootout!', undefined, undefined, { x: 50, y: 50 }, 120));

        const currentPenScore = { host: 0, guest: 0 };
        // If penalty role is designated for host, put them 1st in order
        const hostPKSpecialist = getSpecialist(hostDraft, 'penalty', 'FWD');
        const hostKickers = [
          hostPKSpecialist,
          ...hostPlayers.filter((p) => p.id !== hostPKSpecialist.id),
        ];
        const guestKickers = [...guestPlayers];

        let shootoutWinner: 'host' | 'guest' | null = null;

        for (let round = 1; round <= 5; round++) {
          const hostKicker = hostKickers[(round - 1) % hostKickers.length];
          const hostScored = prng.chance(0.75);
          if (hostScored) currentPenScore.host++;

          penalties.push({
            round,
            team: 'host',
            kicker: { id: hostKicker.id, name: hostKicker.name, squadNumber: hostKicker.squadNumber },
            scored: hostScored,
            suddenDeath: false,
            description: hostScored
              ? `${hostKicker.name} scores from the spot with clinical precision!`
              : `${hostKicker.name}'s penalty is dramatically saved!`,
          });

          const guestKicker = guestKickers[(round - 1) % guestKickers.length];
          const guestScored = prng.chance(0.75);
          if (guestScored) currentPenScore.guest++;

          penalties.push({
            round,
            team: 'guest',
            kicker: { id: guestKicker.id, name: guestKicker.name, squadNumber: guestKicker.squadNumber },
            scored: guestScored,
            suddenDeath: false,
            description: guestScored
              ? `${guestKicker.name} coolly converts the penalty into the corner!`
              : `${guestKicker.name}'s penalty is stopped by the keeper!`,
          });
        }

        if (currentPenScore.host !== currentPenScore.guest) {
          shootoutWinner = currentPenScore.host > currentPenScore.guest ? 'host' : 'guest';
        } else {
          // Sudden death
          let sdRound = 6;
          while (!shootoutWinner && sdRound <= 12) {
            const hKicker = hostKickers[(sdRound - 1) % hostKickers.length];
            const hScored = prng.chance(0.70);
            if (hScored) currentPenScore.host++;

            penalties.push({
              round: sdRound,
              team: 'host',
              kicker: { id: hKicker.id, name: hKicker.name, squadNumber: hKicker.squadNumber },
              scored: hScored,
              suddenDeath: true,
              description: hScored ? `Sudden death: ${hKicker.name} scores!` : `Sudden death: ${hKicker.name} misses!`,
            });

            const gKicker = guestKickers[(sdRound - 1) % guestKickers.length];
            const gScored = prng.chance(0.70);
            if (gScored) currentPenScore.guest++;

            penalties.push({
              round: sdRound,
              team: 'guest',
              kicker: { id: gKicker.id, name: gKicker.name, squadNumber: gKicker.squadNumber },
              scored: gScored,
              suddenDeath: true,
              description: gScored ? `Sudden death: ${gKicker.name} responds with a goal!` : `Sudden death: ${gKicker.name} fails to convert!`,
            });

            if (currentPenScore.host > currentPenScore.guest) shootoutWinner = 'host';
            else if (currentPenScore.guest > currentPenScore.host) shootoutWinner = 'guest';
            sdRound++;
          }
        }

        matchWinner = shootoutWinner || 'host';
        penaltyScore = { ...currentPenScore };
        events.push(createEvent(totalDuration, 'penalties', 'match_end', matchWinner, `Shootout finished! ${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} wins the penalty shootout (${currentPenScore.host}-${currentPenScore.guest})!`, undefined, undefined, { x: 50, y: 50 }, 120));
      }
    }

    events.push(createEvent(totalDuration, totalDuration <= regDuration ? 'second_half' : 'extra_time_2', 'match_end', matchWinner === 'draw' ? 'host' : matchWinner, `Final Result: ${matchWinner === 'draw' ? 'Match Drawn' : `${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} victorious!`} [Score: ${currentScore.host}-${currentScore.guest}]`, undefined, undefined, { x: 50, y: 50 }, totalDuration <= regDuration ? 90 : 120));

    return {
      matchId: `match-${seed}`,
      startTime: 0,
      totalDurationMs: totalDuration * 1000,
      totalDurationSeconds: totalDuration,
      regularDurationSeconds: regDuration,
      currentElapsedSec: 0,
      currentSecond: 0,
      status: 'live',
      currentMinute: 0,
      knockoutMode,
      matchFormat: knockoutMode ? 'cup' : 'league',
      hostTeam: {
        name: hostDraft.playerName,
        formation: hostDraft.formation.name,
        avgOvr: Math.round(hostAvgOvr),
        roles: hostDraft.roles,
      },
      guestTeam: {
        name: guestDraft.playerName,
        formation: guestDraft.formation.name,
        avgOvr: Math.round(guestAvgOvr),
        roles: guestDraft.roles,
      },
      events,
      visibleEvents: [events[0]],
      penalties,
      penaltyKicks: penalties,
      penaltyScore,
      score: currentScore,
      finalScore: currentScore,
      winner: matchWinner,
      winMethod,
      liveMentality,
      stats,
    };
  }

  /**
   * Updates live in-match touchline mentality dynamically.
   */
  static updateLiveMentality(
    simulation: MatchSimulationState,
    mentality: LiveMentality,
    team: 'host' | 'guest' = 'host'
  ): MatchSimulationState {
    simulation.liveMentality = mentality;
    if (!simulation.tacticalInstructions) {
      simulation.tacticalInstructions = {};
    }
    simulation.tacticalInstructions.mentality = mentality;
    return simulation;
  }

  /**
   * Updates live in-match touchline tactics (mentality, pressing, passing style, touchline shouts).
   */
  static updateLiveTactics(
    simulation: MatchSimulationState,
    tactics: {
      mentality?: LiveMentality;
      defensiveStyle?: DefensiveStyle;
      passingStyle?: PassingStyle;
      shout?: TouchlineShout;
    },
    team: 'host' | 'guest' = 'host'
  ): MatchSimulationState {
    if (!simulation.tacticalInstructions) {
      simulation.tacticalInstructions = {};
    }
    if (tactics.mentality) {
      simulation.liveMentality = tactics.mentality;
      simulation.tacticalInstructions.mentality = tactics.mentality;
    }
    if (tactics.defensiveStyle) {
      simulation.tacticalInstructions.defensiveStyle = tactics.defensiveStyle;
    }
    if (tactics.passingStyle) {
      simulation.tacticalInstructions.passingStyle = tactics.passingStyle;
    }
    if (tactics.shout) {
      const curSec = simulation.currentSecond || 0;
      simulation.tacticalInstructions.activeShout = {
        shout: tactics.shout,
        activatedAtSec: curSec,
        expiresAtSec: curSec + 15,
      };
    }
    return simulation;
  }

  /**
   * Calculates the authoritative current state of a match at a given server timestamp.
   */
  static getAuthoritativeStateAtTime(
    simulation: MatchSimulationState,
    now: number
  ): MatchSimulationState {
    if (simulation.startTime === 0) {
      return simulation;
    }

    const elapsedSeconds = Math.max(0, Math.floor((now - simulation.startTime) / 1000));
    const totalDurationSec = simulation.totalDurationSeconds || Math.floor((simulation.totalDurationMs || 45000) / 1000);
    const regDuration = simulation.regularDurationSeconds || (totalDurationSec <= 60 ? 45 : totalDurationSec);
    const currentSecond = Math.min(elapsedSeconds, totalDurationSec);

    let status: MatchSimulationState['status'] = 'live';

    if (currentSecond >= totalDurationSec) {
      status = 'completed';
    } else if (currentSecond === Math.floor(regDuration / 2)) {
      status = 'halftime';
    } else if (currentSecond > regDuration && totalDurationSec > regDuration) {
      status = 'extra_time';
    }

    // Filter events up to currentSecond
    const visibleEvents = simulation.events.filter((ev) => ev.second <= currentSecond);

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

    const currentMinute = calculateVisualMinute(currentSecond, regDuration);

    return {
      ...simulation,
      status,
      currentElapsedSec: currentSecond,
      currentSecond,
      totalDurationSeconds: totalDurationSec,
      totalDurationMs: totalDurationSec * 1000,
      currentMinute,
      events: visibleEvents,
      visibleEvents,
      score: currentScore,
      finalScore: currentScore,
      penalties: simulation.penalties || simulation.penaltyKicks,
      penaltyKicks: simulation.penaltyKicks || simulation.penalties,
      winner: status === 'completed' ? simulation.winner : undefined,
      winMethod: status === 'completed' ? simulation.winMethod : undefined,
      stats: liveStats,
    };
  }

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

    const rateSquad = (
      draft: PlayerDraftState,
      team: 'host' | 'guest'
    ): PlayerMatchRating[] => {
      const isWinner = team === 'host' ? isHostWinner : isGuestWinner;
      const squad = Object.values(draft.draftedSlots).map((s) => s.player);

      return squad.map((p) => {
        let rating = 6.0 + (p.ovr - 80) * 0.05;
        if (isWinner) rating += 0.8;

        // Count goals and assists from events
        const goals = simulation.events.filter(
          (e) => e.type === 'goal' && e.player?.id === p.id
        ).length;
        const assists = simulation.events.filter(
          (e) => e.type === 'goal' && e.secondaryPlayer?.id === p.id
        ).length;
        const saves = simulation.events.filter(
          (e) => e.type === 'save' && e.player?.id === p.id
        ).length;

        rating += goals * 1.2;
        rating += assists * 0.6;
        rating += saves * 0.4;

        rating = Math.max(5.0, Math.min(10.0, Math.round(rating * 10) / 10));

        return {
          playerId: p.id,
          name: p.name,
          squadNumber: p.squadNumber,
          position: p.naturalPositions[0],
          ovr: p.ovr,
          team,
          rating,
          stats: {
            goals,
            assists,
            saves,
            yellowCard: false,
            redCard: false,
            penaltyScored: false,
            penaltyMissed: false,
            cleanSheet: team === 'host' ? simulation.finalScore.guest === 0 : simulation.finalScore.host === 0,
          },
          summary: goals > 0 ? `Scored ${goals} goal(s)` : `Rated ${rating}`,
        };
      });
    };

    const hostRatings = rateSquad(hostDraft, 'host');
    const guestRatings = rateSquad(guestDraft, 'guest');
    const all = [...hostRatings, ...guestRatings].sort((a, b) => b.rating - a.rating);
    const starOfMatch = all[0] || null;
    if (starOfMatch) starOfMatch.isStarOfMatch = true;

    return { hostRatings, guestRatings, starOfMatch };
  }
}
