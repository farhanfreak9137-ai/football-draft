import {
  MatchEvent,
  MatchEventType,
  MatchSimulationState,
  PenaltyKickResult,
  PlayerDraftState,
  PlayerVersion,
} from '../types/index.js';
import { PRNG } from './prng.js';

export interface MatchEngineConfig {
  knockoutMode?: boolean; // If true, draws proceed to extra time and penalties
  ratingWeight?: number; // Modest rating influence: default 0.05 (5%), prioritizing luck
  randomSeed?: number;
}

export class MatchEngine {
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
      pitchLocation?: { x: number; y: number }
    ): MatchEvent => {
      return {
        id: `ev-${second}-${type}-${prng.nextInt(1000, 9999)}`,
        second,
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

    // 1. Kickoff
    events.push(createEvent(0, 'first_half', 'kickoff', 'host', 'The match kicks off at the historic stadium!'));

    // Simulation loop for regular time (seconds 1 to 90)
    for (let sec = 1; sec <= 90; sec++) {
      if (sec === 45) {
        events.push(createEvent(45, 'first_half', 'halftime', 'host', 'Half-time whistle blows. Teams head into the tactical dugout.'));
        continue;
      }

      if (sec === 46) {
        events.push(createEvent(46, 'second_half', 'kickoff', 'guest', 'Second half underway!'));
        continue;
      }

      if (sec >= 80 && sec <= 82 && prng.chance(0.4)) {
        const pressTeam = currentScore.host < currentScore.guest ? 'host' : currentScore.guest < currentScore.host ? 'guest' : prng.pickOne(['host', 'guest'] as const);
        const attackingSquad = pressTeam === 'host' ? hostPlayers : guestPlayers;
        const forward = getSquadPlayer(attackingSquad, 'FWD');
        events.push(createEvent(
          sec,
          'second_half',
          'late_pressure',
          pressTeam,
          `Intense late pressure mounted by ${pressTeam === 'host' ? hostDraft.playerName : guestDraft.playerName}! ${forward.name} drives the team forward.`
        ));
      }

      // Roll chance of significant match action (luck-governed: ~18-22% chance per second)
      if (prng.chance(0.20)) {
        const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
        const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
        const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
        const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;
        const currentPeriod = sec <= 45 ? 'first_half' : 'second_half';

        const actionRoll = prng.next();

        if (actionRoll < 0.35) {
          // Defensive intervention / tackle
          const defender = getSquadPlayer(defendingSquad, 'DEF');
          stats[defendingTeam].tackles++;
          events.push(createEvent(
            sec,
            currentPeriod,
            'defensive_intervention',
            defendingTeam,
            `Crucial defensive tackle by ${defender.name} breaks up the dangerous counter-attack!`,
            defender,
            undefined,
            { x: attackingTeam === 'host' ? 75 : 25, y: prng.nextInt(30, 70) }
          ));
        } else if (actionRoll < 0.65) {
          // Attack building up
          const midfielder = getSquadPlayer(attackingSquad, 'MID');
          events.push(createEvent(
            sec,
            currentPeriod,
            'attack',
            attackingTeam,
            `Crisp passing move orchestrated by ${midfielder.name} cutting into the final third.`,
            midfielder,
            undefined,
            { x: attackingTeam === 'host' ? 65 : 35, y: prng.nextInt(20, 80) }
          ));
        } else if (actionRoll < 0.85) {
          // Shot on target / Save
          const shooter = getSquadPlayer(attackingSquad, 'FWD');
          const keeper = getSquadPlayer(defendingSquad, 'GK');
          stats[attackingTeam].shots++;
          stats[attackingTeam].shotsOnTarget++;
          stats[defendingTeam].saves++;

          events.push(createEvent(
            sec,
            currentPeriod,
            'save',
            defendingTeam,
            `Fierce shot by ${shooter.name}! Spectacular reflex save by ${keeper.name} to turn it behind for a corner!`,
            keeper,
            shooter,
            { x: attackingTeam === 'host' ? 90 : 10, y: 50 }
          ));
          stats[attackingTeam].corners++;
        } else if (actionRoll < 0.93) {
          // Missed chance
          const shooter = getSquadPlayer(attackingSquad, 'FWD');
          stats[attackingTeam].shots++;
          events.push(createEvent(
            sec,
            currentPeriod,
            'miss',
            attackingTeam,
            `Golden opportunity! ${shooter.name} fires from the edge of the area, but the ball flashes inches wide of the upright!`,
            shooter,
            undefined,
            { x: attackingTeam === 'host' ? 88 : 12, y: prng.nextInt(35, 65) }
          ));
        } else {
          // GOAL! (Luck-first: approx ~2-3 goals per 90s match on average)
          const scorer = getSquadPlayer(attackingSquad, 'FWD');
          const assister = getSquadPlayer(attackingSquad, 'MID');
          stats[attackingTeam].shots++;
          stats[attackingTeam].shotsOnTarget++;
          currentScore[attackingTeam]++;

          events.push(createEvent(
            sec,
            currentPeriod,
            'goal',
            attackingTeam,
            `GOAL! ${scorer.name} clinically strikes it home into the bottom corner after an exquisite pass from ${assister.name}! (${currentScore.host}-${currentScore.guest})`,
            scorer,
            assister,
            { x: attackingTeam === 'host' ? 95 : 5, y: 50 }
          ));
        }
      }
    }

    events.push(createEvent(90, 'second_half', 'fulltime', 'host', `Full time whistle! Score: ${currentScore.host} - ${currentScore.guest}`));

    let totalDuration = 90;
    let matchWinner: 'host' | 'guest' | 'draw' =
      currentScore.host > currentScore.guest ? 'host' : currentScore.guest > currentScore.host ? 'guest' : 'draw';
    let winMethod: MatchSimulationState['winMethod'] = matchWinner === 'draw' ? 'draw' : 'regular_time';
    const penalties: PenaltyKickResult[] = [];
    let penaltyScore: { host: number; guest: number } | undefined;

    // Check Extra Time if tied and knockoutMode is active
    if (matchWinner === 'draw' && knockoutMode) {
      totalDuration = 120;
      winMethod = 'extra_time';

      events.push(createEvent(91, 'extra_time_1', 'extra_time_start', 'host', 'Match is tied! Heading into Extra Time (two 15-second halves).'));

      // Extra Time First Half: 91 to 105
      for (let sec = 92; sec <= 105; sec++) {
        if (prng.chance(0.20)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.12)) {
            // Extra time goal
            const scorer = getSquadPlayer(attackingSquad, 'FWD');
            const assister = getSquadPlayer(attackingSquad, 'MID');
            currentScore[attackingTeam]++;
            events.push(createEvent(
              sec,
              'extra_time_1',
              'goal',
              attackingTeam,
              `EXTRA TIME GOAL! Dramatic finish by ${scorer.name}! (${currentScore.host}-${currentScore.guest})`,
              scorer,
              assister,
              { x: attackingTeam === 'host' ? 95 : 5, y: 50 }
            ));
          } else {
            const shooter = getSquadPlayer(attackingSquad, 'FWD');
            const keeper = getSquadPlayer(defendingSquad, 'GK');
            events.push(createEvent(
              sec,
              'extra_time_1',
              'save',
              defendingTeam,
              `Extra-time save! ${keeper.name} keeps his team in the contest!`,
              keeper,
              shooter
            ));
          }
        }
      }

      events.push(createEvent(105, 'extra_time_1', 'extra_time_half', 'host', 'Half-time in Extra Time. Quick turnaround.'));

      // Extra Time Second Half: 106 to 120
      for (let sec = 106; sec <= 120; sec++) {
        if (prng.chance(0.20)) {
          const attackingTeam: 'host' | 'guest' = prng.chance(hostAttackChance) ? 'host' : 'guest';
          const defendingTeam: 'host' | 'guest' = attackingTeam === 'host' ? 'guest' : 'host';
          const attackingSquad = attackingTeam === 'host' ? hostPlayers : guestPlayers;
          const defendingSquad = attackingTeam === 'host' ? guestPlayers : hostPlayers;

          if (prng.chance(0.12)) {
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
            events.push(createEvent(
              sec,
              'extra_time_2',
              'miss',
              attackingTeam,
              `Exhausted effort by ${shooter.name} skids narrowly wide of the post!`,
              shooter
            ));
          }
        }
      }

      events.push(createEvent(120, 'extra_time_2', 'extra_time_end', 'host', `Extra time ends! Score: ${currentScore.host} - ${currentScore.guest}`));

      // Check if decided in Extra Time
      if (currentScore.host !== currentScore.guest) {
        matchWinner = currentScore.host > currentScore.guest ? 'host' : 'guest';
        winMethod = 'extra_time';
      } else {
        // PENALTY SHOOTOUT
        winMethod = 'penalties';
        events.push(createEvent(120, 'penalties', 'penalty_shootout_start', 'host', 'Score remains level after 120 simulated seconds! Proceeding to the Penalty Shootout!'));

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
        events.push(createEvent(120, 'penalties', 'match_end', matchWinner, `Shootout finished! ${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} wins the penalty shootout (${currentPenScore.host}-${currentPenScore.guest})!`));
      }
    }

    events.push(createEvent(totalDuration, totalDuration <= 90 ? 'second_half' : 'extra_time_2', 'match_end', matchWinner === 'draw' ? 'host' : matchWinner, `Final Result: ${matchWinner === 'draw' ? 'Match Drawn' : `${matchWinner === 'host' ? hostDraft.playerName : guestDraft.playerName} victorious!`} [Score: ${currentScore.host}-${currentScore.guest}]`));

    return {
      matchId: `match-${seed}`,
      seed,
      status: 'not_started',
      currentSecond: 0,
      totalDurationSeconds: totalDuration,
      startTime: 0,
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
      if (currentSecond < 120) {
        status = currentSecond === 45 ? 'halftime' : currentSecond > 90 ? 'extra_time' : 'live';
      } else {
        // After 120s: each penalty kick reveals consecutively every 2 seconds
        const penElapsed = elapsedSeconds - 120;
        const totalPenDuration = simulation.penalties.length * 2;
        const visibleKicks = Math.min(
          simulation.penalties.length,
          Math.max(1, Math.floor(penElapsed / 2) + 1)
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
      } else if (currentSecond === 45) {
        status = 'halftime';
      } else if (currentSecond > 90 && simulation.totalDurationSeconds > 90) {
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
      } else if (ev.type === 'shot') {
        liveStats[ev.team].shots++;
        liveStats[ev.team].shotsOnTarget++;
      } else if (ev.type === 'miss') {
        liveStats[ev.team].shots++;
      } else if (ev.type === 'save') {
        const opposing = ev.team === 'host' ? 'guest' : 'host';
        liveStats[opposing].saves++;
        liveStats[ev.team].shots++;
        liveStats[ev.team].shotsOnTarget++;
      } else if (ev.type === 'defensive_intervention') {
        const opposing = ev.team === 'host' ? 'guest' : 'host';
        liveStats[opposing].tackles++;
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
}

