import { HistoricalScenario } from '../types/index.js';

export const HISTORICAL_SCENARIOS: HistoricalScenario[] = [
  {
    id: 'miracle-of-istanbul-2005',
    title: 'The Miracle of Istanbul',
    subtitle: 'Overcome a 3-0 deficit against Ancelotti’s legendary Rossoneri',
    era: '2005 UEFA Champions League Final',
    year: 2005,
    difficulty: 'legendary',
    description:
      'Down 0-3 at halftime against an all-time AC Milan featuring Maldini, Kaká, and Shevchenko. Command Liverpool to complete the greatest comeback in European football history.',
    lore:
      'May 25, 2005 at Atatürk Olympic Stadium. AC Milan dismantled Liverpool in the first 45 minutes. Rafael Benítez adjusted tactics to a 3-man defense and unleashed Steven Gerrard. Can you replicate or surpass the miraculous 6 minutes of destiny?',
    userTeam: {
      name: 'Liverpool (2004-05)',
      formationId: '4-4-2',
      editionId: 'liverpool-2004-05',
      poolType: 'club',
    },
    opponentTeam: {
      name: 'AC Milan (2004-05)',
      formationId: '4-3-3',
      editionId: 'ac-milan-2004-05',
      poolType: 'club',
    },
    startingSecond: 23,
    startingMinute: 45,
    startingScore: { host: 0, guest: 3 },
    durationSec: 45,
    userIsHost: true,
    objectives: [
      {
        id: 'obj-draw-or-win',
        description: 'Equalize or take the lead from 0-3 down before full-time whistle',
        targetGoalDiff: 0,
      },
      {
        id: 'obj-no-concede',
        description: 'Shut out Milan in the second half (prevent conceding further)',
        preventConceding: true,
      },
    ],
    rewards: {
      xp: 500,
      trophyName: 'Istanbul Miraculous Comeback',
      badgeEmoji: '🏆',
    },
  },
  {
    id: 'greece-underdog-glory-2004',
    title: 'The Spartan Wall of Lisbon',
    subtitle: 'Defend a razor-thin 1-0 lead against attacking hosts',
    era: 'UEFA Euro 2004 Final',
    year: 2004,
    difficulty: 'hard',
    description:
      'Angelos Charisteas scored a towering header in the 57th minute. Now with 20 minutes on the clock, preserve Greece’s miraculous 1-0 lead under relentless pressure.',
    lore:
      'July 4, 2004 at Estádio da Luz. Otto Rehhagel’s disciplined Greek side shocked the world with defensive resilience and lethal set-pieces. Shift your mentality to defensive, utilize fresh legs, and secure the greatest international underdog triumph.',
    userTeam: {
      name: 'Greece (2004)',
      formationId: '4-4-2',
      editionId: 'greece-2004',
      poolType: 'national',
    },
    opponentTeam: {
      name: 'Portugal (2016)',
      formationId: '4-3-3',
      editionId: 'portugal-2016',
      poolType: 'national',
    },
    startingSecond: 35,
    startingMinute: 70,
    startingScore: { host: 1, guest: 0 },
    durationSec: 45,
    userIsHost: true,
    objectives: [
      {
        id: 'obj-hold-lead',
        description: 'Maintain the 1-0 lead until the final whistle',
        targetGoalDiff: 1,
      },
      {
        id: 'obj-clean-sheet',
        description: 'Keep a clean sheet with 0 goals conceded in closing minutes',
        preventConceding: true,
      },
    ],
    rewards: {
      xp: 350,
      trophyName: 'Spartan Clean Sheet',
      badgeEmoji: '🛡️',
    },
  },
  {
    id: 'wembley-masterclass-2011',
    title: 'Pep’s Wembley Carousel',
    subtitle: 'Execute total tiki-taka dominance and seal a 2-goal margin',
    era: '2011 UEFA Champions League Final',
    year: 2011,
    difficulty: 'normal',
    description:
      'At 1-1 in the 54th minute against Sir Alex Ferguson’s Manchester United, take command of Guardiola’s peak Barcelona. Carve open the defense and win by 2 or more goals.',
    lore:
      'May 28, 2011 at Wembley Stadium. Sir Alex Ferguson admitted after the match: "No one has ever given us a hiding like that." Lionel Messi, Xavi, and Iniesta put on the most comprehensive passing clinic ever witnessed in club football.',
    userTeam: {
      name: 'FC Barcelona (2010-11)',
      formationId: '4-3-3',
      editionId: 'barcelona-2010-11',
      poolType: 'club',
    },
    opponentTeam: {
      name: 'Manchester United (2007-08)',
      formationId: '4-4-2',
      editionId: 'manchester-united-2007-08',
      poolType: 'club',
    },
    startingSecond: 27,
    startingMinute: 54,
    startingScore: { host: 1, guest: 1 },
    durationSec: 45,
    userIsHost: true,
    objectives: [
      {
        id: 'obj-two-goal-margin',
        description: 'Win the final by at least 2 clear goals (e.g. 3-1 or better)',
        targetGoalDiff: 2,
      },
    ],
    rewards: {
      xp: 300,
      trophyName: 'Tiki-Taka Masterclass',
      badgeEmoji: '👑',
    },
  },
  {
    id: 'azteca-hand-and-foot-1986',
    title: 'Maradona’s Azteca Solitary Symphony',
    subtitle: 'Break the 1-1 deadlock with Argentine inspiration',
    era: '1986 FIFA World Cup Quarter-Final',
    year: 1986,
    difficulty: 'hard',
    description:
      'Tied 1-1 in the searing heat of Estadio Azteca. Channel the magic of Diego Maradona to surge forward, create high xG opportunities, and secure the semi-final berth.',
    lore:
      'June 22, 1986. 114,580 fans witnessed the dual faces of football genius: cunning audacity followed by the "Goal of the Century" — slaloming past five players from inside his own half.',
    userTeam: {
      name: 'Argentina (1986)',
      formationId: '3-5-2',
      editionId: 'argentina-1986',
      poolType: 'national',
    },
    opponentTeam: {
      name: 'England (1966)',
      formationId: '4-4-2',
      editionId: 'england-1966',
      poolType: 'national',
    },
    startingSecond: 30,
    startingMinute: 60,
    startingScore: { host: 1, guest: 1 },
    durationSec: 45,
    userIsHost: true,
    objectives: [
      {
        id: 'obj-score-winner',
        description: 'Score the match-winning goal and achieve victory',
        targetGoalDiff: 1,
      },
    ],
    rewards: {
      xp: 400,
      trophyName: 'Azteca Golden Glove & Boot',
      badgeEmoji: '⚡',
    },
  },
];

