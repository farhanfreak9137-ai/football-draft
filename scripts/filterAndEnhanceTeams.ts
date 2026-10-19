import fs from 'fs';
import path from 'path';

// Tier 1 Heavyweight Nations: ALL tournament squads from 1950 to 2026 are kept
const TIER1_GIANTS = new Set([
  'Brazil',
  'Argentina',
  'Germany',
  'West Germany',
  'Italy',
  'France',
  'England',
  'Spain',
  'Netherlands',
  'Uruguay',
  'Portugal',
]);

// Tier 2: Specific Peak Legend Squads and Historic Underdogs
const SPECIFIC_HISTORIC_SQUADS = new Set([
  // Lev Yashin Peak Squads
  'Soviet_Union_1958.json',
  'Soviet_Union_1966.json',

  // Legendary Star Talisman Squads
  'Hungary_1954.json', // Ferenc Puskás & Sándor Kocsis (Mighty Magyars)
  'Bulgaria_1994.json', // Hristo Stoichkov (Golden Boot & Semi-Finals)
  'Romania_1994.json', // Gheorghe Hagi (Quarter-Finals)
  'Peru_1970.json', // Teófilo Cubillas
  'Colombia_2014.json', // James Rodríguez (Golden Boot)
  'Denmark_1986.json', // Michael Laudrup & Elkjær (Danish Dynamite)
  'Denmark_1998.json', // Laudrup Brothers (Quarter-Finals)
  'Poland_1974.json', // Grzegorz Lato & Kazimierz Deyna (3rd Place)
  'Poland_1982.json', // Zbigniew Boniek (3rd Place)
  'Czechoslovakia_1962.json', // Josef Masopust (Ballon d'Or Finalists)
  'Czechoslovakia_1990.json', // Skuhravý (Quarter-Finals)

  // Iconic World Cup Underdogs & Cinderella Runs
  'Morocco_2022.json', // First African Semi-Finalist (Bono, Hakimi, Amrabat)
  'Croatia_1998.json', // Davor Šuker 3rd Place
  'Croatia_2018.json', // Luka Modrić Golden Ball Finalists
  'Croatia_2022.json', // Modrić 3rd Place
  'South_Korea_2002.json', // Park Ji-sung Historic 4th Place
  'Turkey_2002.json', // Hakan Şükür & Rüştü 3rd Place
  'Cameroon_1990.json', // Roger Milla Quarter-Finals
  'Senegal_2002.json', // El Hadji Diouf Quarter-Finals
  'Ghana_2010.json', // Asamoah Gyan Quarter-Finals
  'Costa_Rica_2014.json', // Keylor Navas Quarter-Finals
  'Sweden_1958.json', // Finalists with Liedholm
  'Sweden_1994.json', // 3rd Place with Brolin & Dahlin
  'Belgium_1986.json', // Semi-Finals with Pfaff & Scifo
  'Belgium_2018.json', // 3rd Place with Hazard & De Bruyne
  'Nigeria_1994.json', // Super Eagles (Yekini, Amokachi, Finidi)
  'Nigeria_1998.json', // Okocha & Kanu
  'Mexico_1986.json', // Hugo Sánchez Quarter-Finals
  'Mexico_1998.json', // Cuauhtémoc Blanco & Luis Hernández
  'United_States_2002.json', // Donovan Quarter-Finals
  'United_States_2026.json', // Co-Hosts 2026
  'Chile_1962.json', // 3rd Place on Home Soil (Leonel Sánchez)
  'Austria_1954.json', // 3rd Place 7-5 Thriller Team
  'Northern_Ireland_1958.json', // Harry Gregg (Best Goalkeeper) & McParland QF
  'Cape_Verde_2026.json', // The Tubarões Azuis Underdog Special!
]);

// Cape Verde 2026 Squad Generator
function generateCapeVerde2026(): any {
  return {
    teamName: 'Cape Verde',
    teamCode: 'CPV',
    year: 2026,
    tournament: "2026 FIFA Men's World Cup",
    hostCountry: 'United States, Canada, Mexico',
    achievement: '2026 World Cup Underdogs (Tubarões Azuis)',
    finalPosition: null,
    tacticalFormation: '4-3-3',
    squadSize: 23,
    averageOvr: 80,
    players: [
      {
        id: 'cape_verde-2026-vozinha',
        identityId: 'identity-2026-vozinha',
        squadNumber: 1,
        name: 'Vozinha',
        positionCategory: 'goal keeper',
        naturalPositions: ['GK'],
        secondaryPositions: [],
        ovr: 79,
        role: 'Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 0,
        awards: ['Veteran National Goalkeeper & 70+ Caps'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 79 OVR for 2026 World Cup form with Cape Verde. Long-serving national team goalkeeper.',
      },
      {
        id: 'cape_verde-2026-steven_moreira',
        identityId: 'identity-2026-steven_moreira',
        squadNumber: 2,
        name: 'Steven Moreira',
        positionCategory: 'defender',
        naturalPositions: ['RB'],
        secondaryPositions: ['RWB', 'CB'],
        ovr: 82,
        role: 'Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 0,
        awards: ['MLS Cup Champion & Best XI Defender'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 82 OVR for 2026 World Cup form with Cape Verde. Standout MLS Cup champion right back.',
      },
      {
        id: 'cape_verde-2026-roberto_pico_lopes',
        identityId: 'identity-2026-roberto_pico_lopes',
        squadNumber: 3,
        name: 'Roberto "Pico" Lopes',
        positionCategory: 'defender',
        naturalPositions: ['CB'],
        secondaryPositions: [],
        ovr: 80,
        role: 'Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 80 OVR for 2026 World Cup form with Cape Verde. Defensive rock and team leader.',
      },
      {
        id: 'cape_verde-2026-logan_costa',
        identityId: 'identity-2026-logan_costa',
        squadNumber: 4,
        name: 'Logan Costa',
        positionCategory: 'defender',
        naturalPositions: ['CB'],
        secondaryPositions: ['RB'],
        ovr: 84,
        role: 'Key Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 1,
        awards: ['La Liga Star Defender (Villarreal)'],
        hasLegendSeal: true,
        legendSealReason: 'High-Level European Top-5 League Standout Center-Back',
        ratingRationale: 'Rated 84 OVR for 2026 World Cup form with Cape Verde. Top-flight Spanish La Liga anchor.',
      },
      {
        id: 'cape_verde-2026-stopira',
        identityId: 'identity-2026-stopira',
        squadNumber: 5,
        name: 'Stopira',
        positionCategory: 'defender',
        naturalPositions: ['LB'],
        secondaryPositions: ['CB', 'LWB'],
        ovr: 78,
        role: 'Rotation',
        matchesStarted: 2,
        matchesSub: 3,
        goals: 0,
        awards: ['Cape Verde Icon & Former Captain'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. Respected veteran captain and squad leader.',
      },
      {
        id: 'cape_verde-2026-joao_paulo_fernandes',
        identityId: 'identity-2026-joao_paulo_fernandes',
        squadNumber: 6,
        name: 'João Paulo Fernandes',
        positionCategory: 'defender',
        naturalPositions: ['LB'],
        secondaryPositions: ['LWB', 'LM'],
        ovr: 80,
        role: 'Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 80 OVR for 2026 World Cup form with Cape Verde. Dynamic starting left back.',
      },
      {
        id: 'cape_verde-2026-kevin_pina',
        identityId: 'identity-2026-kevin_pina',
        squadNumber: 7,
        name: 'Kevin Pina',
        positionCategory: 'midfielder',
        naturalPositions: ['DM'],
        secondaryPositions: ['CM', 'CB'],
        ovr: 82,
        role: 'Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 1,
        awards: ['AFCON 2024 Breakthrough Midfielder'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 82 OVR for 2026 World Cup form with Cape Verde. Dominant physical holding midfielder.',
      },
      {
        id: 'cape_verde-2026-jamiro_monteiro',
        identityId: 'identity-2026-jamiro_monteiro',
        squadNumber: 8,
        name: 'Jamiro Monteiro',
        positionCategory: 'midfielder',
        naturalPositions: ['CM'],
        secondaryPositions: ['AM', 'DM'],
        ovr: 82,
        role: 'Key Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 1,
        awards: ['Cape Verde Midfield Architect'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 82 OVR for 2026 World Cup form with Cape Verde. Creative tempo controller and playmaker.',
      },
      {
        id: 'cape_verde-2026-bebe',
        identityId: 'identity-2026-bebe',
        squadNumber: 9,
        name: 'Bebé',
        positionCategory: 'forward',
        naturalPositions: ['LW', 'ST'],
        secondaryPositions: ['RW'],
        ovr: 83,
        role: 'Key Starter',
        matchesStarted: 4,
        matchesSub: 1,
        goals: 2,
        awards: ['AFCON 40-Yard Free Kick Legend & Cult Hero'],
        hasLegendSeal: true,
        legendSealReason: 'Legendary Free-Kick Specialist & Cape Verde National Talisman',
        ratingRationale: 'Rated 83 OVR for 2026 World Cup form with Cape Verde. Match-winner with world-class long-range shooting.',
      },
      {
        id: 'cape_verde-2026-ryan_mendes',
        identityId: 'identity-2026-ryan_mendes',
        squadNumber: 10,
        name: 'Ryan Mendes',
        positionCategory: 'forward',
        naturalPositions: ['RW'],
        secondaryPositions: ['LW', 'ST', 'CF'],
        ovr: 84,
        role: 'Key Starter',
        matchesStarted: 5,
        matchesSub: 0,
        goals: 2,
        awards: ['All-Time Caps & Goals Record Holder', 'National Captain'],
        hasLegendSeal: true,
        legendSealReason: 'Cape Verde All-Time Greatest Player & National Icon',
        ratingRationale: 'Rated 84 OVR for 2026 World Cup form with Cape Verde. Undisputed team captain and talismanic forward.',
      },
      {
        id: 'cape_verde-2026-jovane_cabral',
        identityId: 'identity-2026-jovane_cabral',
        squadNumber: 11,
        name: 'Jovane Cabral',
        positionCategory: 'forward',
        naturalPositions: ['LW'],
        secondaryPositions: ['ST', 'RW'],
        ovr: 82,
        role: 'Starter',
        matchesStarted: 4,
        matchesSub: 1,
        goals: 1,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 82 OVR for 2026 World Cup form with Cape Verde. Direct dribbler with explosive acceleration.',
      },
      {
        id: 'cape_verde-2026-dylan_silva',
        identityId: 'identity-2026-dylan_silva',
        squadNumber: 12,
        name: 'Dylan Silva',
        positionCategory: 'goal keeper',
        naturalPositions: ['GK'],
        secondaryPositions: [],
        ovr: 76,
        role: 'Reserve Squad',
        matchesStarted: 0,
        matchesSub: 0,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 76 OVR for 2026 World Cup form with Cape Verde. Reserve goalkeeper.',
      },
      {
        id: 'cape_verde-2026-marcio_rosa',
        identityId: 'identity-2026-marcio_rosa',
        squadNumber: 13,
        name: 'Márcio Rosa',
        positionCategory: 'goal keeper',
        naturalPositions: ['GK'],
        secondaryPositions: [],
        ovr: 76,
        role: 'Reserve Squad',
        matchesStarted: 0,
        matchesSub: 0,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 76 OVR for 2026 World Cup form with Cape Verde. Reserve goalkeeper.',
      },
      {
        id: 'cape_verde-2026-diney_borges',
        identityId: 'identity-2026-diney_borges',
        squadNumber: 14,
        name: 'Diney Borges',
        positionCategory: 'defender',
        naturalPositions: ['CB'],
        secondaryPositions: [],
        ovr: 78,
        role: 'Rotation',
        matchesStarted: 1,
        matchesSub: 3,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. Experienced backup center-back.',
      },
      {
        id: 'cape_verde-2026-deroy_duarte',
        identityId: 'identity-2026-deroy_duarte',
        squadNumber: 15,
        name: 'Deroy Duarte',
        positionCategory: 'midfielder',
        naturalPositions: ['CM'],
        secondaryPositions: ['DM'],
        ovr: 80,
        role: 'Starter',
        matchesStarted: 3,
        matchesSub: 2,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 80 OVR for 2026 World Cup form with Cape Verde. High-workrate box-to-box midfielder.',
      },
      {
        id: 'cape_verde-2026-patrick_andrade',
        identityId: 'identity-2026-patrick_andrade',
        squadNumber: 16,
        name: 'Patrick Andrade',
        positionCategory: 'midfielder',
        naturalPositions: ['CM'],
        secondaryPositions: ['DM'],
        ovr: 78,
        role: 'Rotation',
        matchesStarted: 1,
        matchesSub: 3,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. European competition veteran.',
      },
      {
        id: 'cape_verde-2026-kenny_rocha_santos',
        identityId: 'identity-2026-kenny_rocha_santos',
        squadNumber: 17,
        name: 'Kenny Rocha Santos',
        positionCategory: 'midfielder',
        naturalPositions: ['AM'],
        secondaryPositions: ['CM'],
        ovr: 79,
        role: 'Rotation',
        matchesStarted: 1,
        matchesSub: 4,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 79 OVR for 2026 World Cup form with Cape Verde. Technically gifted creative midfielder.',
      },
      {
        id: 'cape_verde-2026-laros_duarte',
        identityId: 'identity-2026-laros_duarte',
        squadNumber: 18,
        name: 'Laros Duarte',
        positionCategory: 'midfielder',
        naturalPositions: ['AM'],
        secondaryPositions: ['CM'],
        ovr: 78,
        role: 'Rotation',
        matchesStarted: 0,
        matchesSub: 4,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. Energetic attacking midfield option.',
      },
      {
        id: 'cape_verde-2026-cuca',
        identityId: 'identity-2026-cuca',
        squadNumber: 19,
        name: 'Cuca',
        positionCategory: 'midfielder',
        naturalPositions: ['DM'],
        secondaryPositions: ['CM'],
        ovr: 77,
        role: 'Reserve Squad',
        matchesStarted: 0,
        matchesSub: 2,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 77 OVR for 2026 World Cup form with Cape Verde. Combative squad midfielder.',
      },
      {
        id: 'cape_verde-2026-garry_rodrigues',
        identityId: 'identity-2026-garry_rodrigues',
        squadNumber: 20,
        name: 'Garry Rodrigues',
        positionCategory: 'forward',
        naturalPositions: ['LW'],
        secondaryPositions: ['RW'],
        ovr: 81,
        role: 'Starter',
        matchesStarted: 3,
        matchesSub: 2,
        goals: 1,
        awards: ['Super League Veteran & Title Winner'],
        hasLegendSeal: false,
        ratingRationale: 'Rated 81 OVR for 2026 World Cup form with Cape Verde. Experienced European winger.',
      },
      {
        id: 'cape_verde-2026-helio_varela',
        identityId: 'identity-2026-helio_varela',
        squadNumber: 21,
        name: 'Hélio Varela',
        positionCategory: 'forward',
        naturalPositions: ['LW'],
        secondaryPositions: ['RW'],
        ovr: 79,
        role: 'Rotation',
        matchesStarted: 1,
        matchesSub: 3,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 79 OVR for 2026 World Cup form with Cape Verde. Fast direct young winger.',
      },
      {
        id: 'cape_verde-2026-bryan_teixeira',
        identityId: 'identity-2026-bryan_teixeira',
        squadNumber: 22,
        name: 'Bryan Teixeira',
        positionCategory: 'forward',
        naturalPositions: ['ST'],
        secondaryPositions: ['CF', 'LW'],
        ovr: 78,
        role: 'Rotation',
        matchesStarted: 1,
        matchesSub: 3,
        goals: 1,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. Physical center-forward option.',
      },
      {
        id: 'cape_verde-2026-gilson_benchimol',
        identityId: 'identity-2026-gilson_benchimol',
        squadNumber: 23,
        name: 'Gilson Benchimol',
        positionCategory: 'forward',
        naturalPositions: ['ST'],
        secondaryPositions: ['RW'],
        ovr: 78,
        role: 'Reserve Squad',
        matchesStarted: 0,
        matchesSub: 2,
        goals: 0,
        awards: [],
        hasLegendSeal: false,
        ratingRationale: 'Rated 78 OVR for 2026 World Cup form with Cape Verde. Promising target striker.',
      },
    ],
  };
}

function shouldKeepSquad(fileName: string, teamData: any): boolean {
  // If specific historic underdog or peak legend squad
  if (SPECIFIC_HISTORIC_SQUADS.has(fileName)) return true;

  // If Tier 1 Giant nation
  if (TIER1_GIANTS.has(teamData.teamName)) return true;

  return false;
}

async function run() {
  console.log('=== CURATING & FILTERING WORLD CUP DRAFT POOL ===');

  const sourceDir = path.resolve(process.cwd(), 'data/world_cup_teams_all_494');
  const targetDirs = [
    path.resolve(process.cwd(), 'world_cup_teams'),
    path.resolve(process.cwd(), 'data/world_cup_teams'),
  ];

  // 1. Generate Cape Verde 2026
  const capeVerdeData = generateCapeVerde2026();
  const cvPath = path.join(sourceDir, 'Cape_Verde_2026.json');
  fs.writeFileSync(cvPath, JSON.stringify(capeVerdeData, null, 2));

  // 2. Read all files in source backup
  const allFiles = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json') && f !== 'index.json');
  console.log(`Analyzing ${allFiles.length} candidate squads...`);

  const keptCatalog: any[] = [];
  const keptFiles = new Set<string>();

  for (const file of allFiles) {
    const filePath = path.join(sourceDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    if (shouldKeepSquad(file, data)) {
      keptFiles.add(file);

      // Enhance Lev Yashin in Soviet Union 1958 and 1966
      if (file === 'Soviet_Union_1958.json' || file === 'Soviet_Union_1966.json') {
        const yashin = data.players.find(
          (p: any) =>
            p.name.toLowerCase().includes('yashin') ||
            p.name.toLowerCase().includes('jaschin') ||
            (p.positionCategory === 'goal keeper' && p.squadNumber === 1)
        );
        if (yashin) {
          yashin.name = 'Lev Yashin';
          yashin.ovr = 98;
          yashin.role = 'Key Starter';
          yashin.hasLegendSeal = true;
          yashin.legendSealReason = "Only Goalkeeper in History to Win the Ballon d'Or (The Black Spider)";
          if (!yashin.awards.includes('Ballon d\'Or Winner & FIFA Goalkeeper of the Century')) {
            yashin.awards.push('Ballon d\'Or Winner & FIFA Goalkeeper of the Century');
          }
          yashin.ratingRationale = `Rated 98 OVR for ${data.year} World Cup. Greatest goalkeeper in football history (The Black Spider). Ballon d'Or winner and defensive anchor.`;
        }
      }

      // Re-save enhanced/kept data
      for (const tDir of targetDirs) {
        if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
        fs.writeFileSync(path.join(tDir, file), JSON.stringify(data, null, 2));
      }

      keptCatalog.push({
        file,
        teamName: data.teamName,
        year: data.year,
        tournament: data.tournament,
        achievement: data.achievement,
        squadSize: data.squadSize,
        avgOvr: data.averageOvr,
      });
    }
  }

  // 3. Remove files not kept from target directories
  for (const tDir of targetDirs) {
    const existing = fs.readdirSync(tDir).filter((f) => f.endsWith('.json') && f !== 'index.json');
    for (const f of existing) {
      if (!keptFiles.has(f)) {
        fs.unlinkSync(path.join(tDir, f));
      }
    }
  }

  // Sort catalog by year ascending, then teamName
  keptCatalog.sort((a, b) => a.year - b.year || a.teamName.localeCompare(b.teamName));

  const indexData = {
    generatedAt: new Date().toISOString(),
    totalTeams: keptCatalog.length,
    yearRange: '1950 - 2026',
    poolType: 'Curated Giants, Peak Legend Talismans & Historic Underdogs',
    teams: keptCatalog,
  };

  for (const tDir of targetDirs) {
    fs.writeFileSync(path.join(tDir, 'index.json'), JSON.stringify(indexData, null, 2));
  }

  console.log(`\n🎉 CURATION COMPLETE!`);
  console.log(`Total squads in curated draft pool: ${keptCatalog.length}`);
  console.log(`Giants preserved: Brazil, Argentina, Germany, Italy, France, England, Spain, Netherlands, Uruguay, Portugal`);
  console.log(`Included special underdog: Cape Verde 2026 (Tubarões Azuis)`);
  console.log(`Included Yashin peak squads: Soviet Union 1958 & 1966`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

