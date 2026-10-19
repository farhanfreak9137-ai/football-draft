import fs from 'fs';
import path from 'path';
import { TEAMS_2026 } from './data2026.js';

// --- CSV Parser Helpers ---
function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = vals[j] || '';
    }
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Sanitizes name into file-safe string
function sanitizeFilename(name: string): string {
  return name.replace(/['".,]/g, '').replace(/[^a-zA-Z0-9-_]/g, '_').replace(/_+/g, '_');
}

// Format clean player name
function formatPlayerName(givenName: string, familyName: string): string {
  const gn = givenName ? givenName.trim() : '';
  const fn = familyName ? familyName.trim() : '';
  if (!gn || gn.toLowerCase() === 'not applicable' || gn.toLowerCase() === 'not available') {
    return fn || 'Unknown Player';
  }
  return `${gn} ${fn}`.trim();
}

// Map position code and shirt number to tactical positions
function mapPositions(posCode: string, shirtNum: number): { natural: string[]; secondary: string[] } {
  switch (posCode.toUpperCase()) {
    case 'GK':
      return { natural: ['GK'], secondary: [] };
    case 'DF':
      if (shirtNum === 2) return { natural: ['RB'], secondary: ['CB', 'RWB'] };
      if (shirtNum === 3) return { natural: ['LB'], secondary: ['CB', 'LWB'] };
      if (shirtNum === 4 || shirtNum === 5) return { natural: ['CB'], secondary: ['SW', 'DM'] };
      if (shirtNum === 6) return { natural: ['CB'], secondary: ['LB', 'DM'] };
      return { natural: ['CB'], secondary: ['LB', 'RB'] };
    case 'MF':
      if (shirtNum === 4 || shirtNum === 5 || shirtNum === 6) return { natural: ['DM'], secondary: ['CM', 'CB'] };
      if (shirtNum === 7 || shirtNum === 11) return { natural: ['LM', 'RM'], secondary: ['LW', 'RW', 'CM'] };
      if (shirtNum === 8) return { natural: ['CM'], secondary: ['DM', 'AM'] };
      if (shirtNum === 10) return { natural: ['AM'], secondary: ['CM', 'LW', 'RW'] };
      return { natural: ['CM'], secondary: ['DM', 'AM'] };
    case 'FW':
      if (shirtNum === 9) return { natural: ['ST'], secondary: ['CF'] };
      if (shirtNum === 7) return { natural: ['RW'], secondary: ['LW', 'ST'] };
      if (shirtNum === 11) return { natural: ['LW'], secondary: ['RW', 'ST'] };
      if (shirtNum === 10) return { natural: ['CF', 'SS'], secondary: ['ST', 'AM'] };
      return { natural: ['ST'], secondary: ['CF', 'LW', 'RW'] };
    default:
      return { natural: ['CM'], secondary: ['DM', 'AM'] };
  }
}

// Historical default formation by era
function getFormationByYear(year: number): string {
  if (year <= 1954) return '2-3-5';
  if (year <= 1962) return '4-2-4';
  if (year <= 1978) return '4-3-3';
  if (year <= 1994) return '4-4-2';
  if (year <= 2002) return '3-5-2';
  if (year <= 2014) return '4-2-3-1';
  return '4-3-3';
}

async function build() {
  console.log('=== BUILDING WORLD CUP TEAMS (1950 - 2026) ===');

  const rawDir = path.resolve(process.cwd(), 'data/world_cup_raw');
  const targetDir = path.resolve(process.cwd(), 'world_cup_teams');
  const dataTargetDir = path.resolve(process.cwd(), 'data/world_cup_teams');

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  if (!fs.existsSync(dataTargetDir)) fs.mkdirSync(dataTargetDir, { recursive: true });

  const tournaments = parseCsv(fs.readFileSync(path.join(rawDir, 'tournaments.csv'), 'utf-8'));
  const standings = parseCsv(fs.readFileSync(path.join(rawDir, 'tournament_standings.csv'), 'utf-8'));
  const squads = parseCsv(fs.readFileSync(path.join(rawDir, 'squads.csv'), 'utf-8'));
  const appearances = parseCsv(fs.readFileSync(path.join(rawDir, 'player_appearances.csv'), 'utf-8'));
  const awards = parseCsv(fs.readFileSync(path.join(rawDir, 'award_winners.csv'), 'utf-8'));
  const goals = parseCsv(fs.readFileSync(path.join(rawDir, 'goals.csv'), 'utf-8'));

  // Filter for Men's World Cups 1950 - 2022
  const menTournaments = tournaments.filter((t) => {
    const y = parseInt(t.year, 10);
    return y >= 1950 && t.tournament_name.includes("Men's");
  });

  const tournamentMap = new Map<string, { year: number; name: string; host: string }>();
  menTournaments.forEach((t) => {
    tournamentMap.set(t.tournament_id, {
      year: parseInt(t.year, 10),
      name: t.tournament_name,
      host: t.host_country,
    });
  });

  // Index Standings: tournament_id + team_name -> standing string & position number
  const standingsMap = new Map<string, { position: number; label: string }>();
  standings.forEach((s) => {
    const pos = parseInt(s.position, 10);
    let label = `${pos}th Place`;
    if (pos === 1) label = 'Champions';
    else if (pos === 2) label = 'Runners-up';
    else if (pos === 3) label = 'Third Place';
    else if (pos === 4) label = 'Fourth Place';
    standingsMap.set(`${s.tournament_id}_${s.team_name.toLowerCase()}`, { position: pos, label });
  });

  // Index Appearances & Max Stage reached by team & player
  interface PlayerStats {
    starts: number;
    subs: number;
    maxStage: string;
  }
  const playerStatsMap = new Map<string, PlayerStats>();
  const teamMaxStageMap = new Map<string, string>();

  const stagePriority: Record<string, number> = {
    'group stage': 1,
    'second group stage': 2,
    'round of 16': 2,
    'quarter-finals': 3,
    'semi-finals': 4,
    'third place match': 4,
    'final': 5,
  };

  appearances.forEach((a) => {
    const pKey = `${a.tournament_id}_${a.team_name.toLowerCase()}_${a.player_id}`;
    const tKey = `${a.tournament_id}_${a.team_name.toLowerCase()}`;

    const starter = a.starter === '1' ? 1 : 0;
    const sub = a.substitute === '1' ? 1 : 0;
    const stage = (a.stage_name || 'group stage').toLowerCase();

    if (!playerStatsMap.has(pKey)) {
      playerStatsMap.set(pKey, { starts: 0, subs: 0, maxStage: stage });
    }
    const ps = playerStatsMap.get(pKey)!;
    ps.starts += starter;
    ps.subs += sub;
    if ((stagePriority[stage] || 1) > (stagePriority[ps.maxStage] || 1)) {
      ps.maxStage = stage;
    }

    const currentTeamStage = teamMaxStageMap.get(tKey) || 'group stage';
    if ((stagePriority[stage] || 1) > (stagePriority[currentTeamStage] || 1)) {
      teamMaxStageMap.set(tKey, stage);
    }
  });

  // Index Goals scored per player per tournament
  const playerGoalsMap = new Map<string, number>();
  goals.forEach((g) => {
    if (g.own_goal === '1') return;
    const key = `${g.tournament_id}_${g.player_id}`;
    playerGoalsMap.set(key, (playerGoalsMap.get(key) || 0) + 1);
  });

  // Index Awards won per player per tournament
  const playerAwardsMap = new Map<string, string[]>();
  awards.forEach((aw) => {
    const key = `${aw.tournament_id}_${aw.player_id}`;
    if (!playerAwardsMap.has(key)) {
      playerAwardsMap.set(key, []);
    }
    playerAwardsMap.get(key)!.push(aw.award_name);
  });

  // Group Squads by Tournament + Team
  interface TeamGroup {
    tournamentId: string;
    year: number;
    tournamentName: string;
    host: string;
    teamName: string;
    teamCode: string;
    players: Record<string, string>[];
  }

  const teamGroups = new Map<string, TeamGroup>();

  squads.forEach((sq) => {
    if (!tournamentMap.has(sq.tournament_id)) return;
    const tInfo = tournamentMap.get(sq.tournament_id)!;
    const key = `${sq.tournament_id}_${sq.team_name}`;

    if (!teamGroups.has(key)) {
      teamGroups.set(key, {
        tournamentId: sq.tournament_id,
        year: tInfo.year,
        tournamentName: tInfo.name,
        host: tInfo.host,
        teamName: sq.team_name,
        teamCode: sq.team_code,
        players: [],
      });
    }

    teamGroups.get(key)!.players.push(sq);
  });

  console.log(`Found ${teamGroups.size} historical team squads to process.`);

  const generatedFiles: string[] = [];
  const catalogSummary: any[] = [];

  // Process 1950 - 2022 Historical Teams
  for (const group of teamGroups.values()) {
    const tKey = `${group.tournamentId}_${group.teamName.toLowerCase()}`;
    const standingInfo = standingsMap.get(tKey);
    const maxStage = teamMaxStageMap.get(tKey) || 'group stage';

    let standingLabel = standingInfo?.label;
    let standingPosition = standingInfo?.position;

    if (!standingLabel) {
      if (maxStage === 'final') {
        standingLabel = 'Runners-up';
        standingPosition = 2;
      } else if (maxStage === 'semi-finals' || maxStage === 'third place match') {
        standingLabel = 'Semi-Finalists';
        standingPosition = 4;
      } else if (maxStage === 'quarter-finals') {
        standingLabel = 'Quarter-Finalists';
        standingPosition = 8;
      } else if (maxStage === 'round of 16' || maxStage === 'second group stage') {
        standingLabel = 'Round of 16';
        standingPosition = 16;
      } else {
        standingLabel = 'Group Stage';
        standingPosition = 32;
      }
    }

    // Determine Base Team Rating by Standing
    let baseTeamOvr = 75;
    if (standingPosition === 1) baseTeamOvr = 88;
    else if (standingPosition === 2) baseTeamOvr = 85;
    else if (standingPosition && standingPosition <= 4) baseTeamOvr = 83;
    else if (standingPosition && standingPosition <= 8) baseTeamOvr = 80;
    else if (standingPosition && standingPosition <= 16) baseTeamOvr = 78;

    // Process all players in the squad
    const processedPlayers = group.players.map((p, idx) => {
      const pKey = `${group.tournamentId}_${group.teamName.toLowerCase()}_${p.player_id}`;
      const stats = playerStatsMap.get(pKey) || { starts: 0, subs: 0, maxStage: 'group stage' };
      const goalsScored = playerGoalsMap.get(`${group.tournamentId}_${p.player_id}`) || 0;
      const playerAwards = playerAwardsMap.get(`${group.tournamentId}_${p.player_id}`) || [];

      let shirtNum = parseInt(p.shirt_number, 10);
      if (isNaN(shirtNum) || shirtNum <= 0) {
        shirtNum = idx + 1;
      }

      const cleanName = formatPlayerName(p.given_name, p.family_name);
      const { natural, secondary } = mapPositions(p.position_code, shirtNum);

      // Determine Role
      let role: 'Key Starter' | 'Starter' | 'Rotation' | 'Reserve Squad' = 'Reserve Squad';
      if (stats.starts >= 3 || (group.players.length <= 16 && stats.starts >= 2)) {
        role = 'Key Starter';
      } else if (stats.starts >= 1) {
        role = 'Starter';
      } else if (stats.subs >= 1) {
        role = 'Rotation';
      }

      // Calculate OVR (1-100 scale)
      let ovr = baseTeamOvr;

      // Role adjustment
      if (role === 'Key Starter') ovr += 5;
      else if (role === 'Starter') ovr += 2;
      else if (role === 'Rotation') ovr -= 1;
      else ovr -= 5;

      // Goal scoring bonuses
      if (goalsScored >= 7) ovr += 7;
      else if (goalsScored >= 5) ovr += 5;
      else if (goalsScored >= 3) ovr += 3;
      else if (goalsScored >= 1) ovr += 1;

      // Award bonuses & Legend Seal
      let hasLegendSeal = false;
      let legendSealReason: string | undefined = undefined;

      if (playerAwards.some((a) => a.includes('Golden Ball'))) {
        ovr = Math.max(ovr, 96);
        hasLegendSeal = true;
        legendSealReason = `${group.year} FIFA World Cup Golden Ball Winner (Best Player)`;
      } else if (playerAwards.some((a) => a.includes('Silver Ball'))) {
        ovr = Math.max(ovr, 94);
        hasLegendSeal = true;
        legendSealReason = `${group.year} FIFA World Cup Silver Ball Winner`;
      } else if (playerAwards.some((a) => a.includes('Bronze Ball'))) {
        ovr = Math.max(ovr, 93);
        hasLegendSeal = true;
        legendSealReason = `${group.year} FIFA World Cup Bronze Ball Winner`;
      } else if (playerAwards.some((a) => a.includes('Golden Boot'))) {
        ovr = Math.max(ovr, 94);
        hasLegendSeal = true;
        legendSealReason = `${group.year} FIFA World Cup Golden Boot Winner (${goalsScored} Goals)`;
      } else if (playerAwards.some((a) => a.includes('Golden Glove') || a.includes('Yashin Award'))) {
        ovr = Math.max(ovr, 93);
        hasLegendSeal = true;
        legendSealReason = `${group.year} FIFA World Cup Best Goalkeeper Award`;
      } else if (playerAwards.some((a) => a.includes('Silver Boot') || a.includes('Bronze Boot'))) {
        ovr = Math.max(ovr, 91);
      } else if (playerAwards.some((a) => a.includes('Best Young Player'))) {
        ovr = Math.max(ovr, 88);
      }

      // Hard clamp bounds 70 to 99
      ovr = Math.max(70, Math.min(99, ovr));

      // Build rating rationale
      let rationale = `Rated ${ovr} OVR based on ${group.year} World Cup performance for ${group.teamName} (${standingLabel}). `;
      if (role === 'Key Starter') rationale += `Main pillar starting ${stats.starts} match(es). `;
      else if (role === 'Starter') rationale += `Starting lineup contributor (${stats.starts} starts). `;
      else if (role === 'Rotation') rationale += `Substitute rotation option (${stats.subs} sub app). `;
      else rationale += `Squad reserve member. `;

      if (goalsScored > 0) rationale += `Scored ${goalsScored} goal(s). `;
      if (playerAwards.length > 0) rationale += `Honors: ${playerAwards.join(', ')}.`;

      return {
        id: `${sanitizeFilename(group.teamName).toLowerCase()}-${group.year}-${sanitizeFilename(cleanName).toLowerCase()}`,
        identityId: p.player_id,
        squadNumber: shirtNum,
        name: cleanName,
        positionCategory: p.position_name,
        naturalPositions: natural,
        secondaryPositions: secondary,
        ovr,
        role,
        matchesStarted: stats.starts,
        matchesSub: stats.subs,
        goals: goalsScored,
        awards: playerAwards,
        hasLegendSeal,
        legendSealReason,
        ratingRationale: rationale.trim(),
      };
    });

    const teamFilename = `${sanitizeFilename(group.teamName)}_${group.year}.json`;
    const fullTeamData = {
      teamName: group.teamName,
      teamCode: group.teamCode,
      year: group.year,
      tournament: group.tournamentName,
      hostCountry: group.host,
      achievement: standingLabel,
      finalPosition: standingPosition || null,
      tacticalFormation: getFormationByYear(group.year),
      squadSize: processedPlayers.length,
      averageOvr: Math.round(processedPlayers.reduce((sum, p) => sum + p.ovr, 0) / processedPlayers.length),
      players: processedPlayers,
    };

    fs.writeFileSync(path.join(targetDir, teamFilename), JSON.stringify(fullTeamData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataTargetDir, teamFilename), JSON.stringify(fullTeamData, null, 2), 'utf-8');
    generatedFiles.push(teamFilename);

    catalogSummary.push({
      file: teamFilename,
      teamName: group.teamName,
      year: group.year,
      tournament: group.tournamentName,
      achievement: standingLabel,
      squadSize: processedPlayers.length,
      avgOvr: fullTeamData.averageOvr,
    });
  }

  // --- Process 2026 World Cup Squads ---
  console.log(`Processing ${TEAMS_2026.length} verified 2026 World Cup squads...`);
  for (const t26 of TEAMS_2026) {
    const filename = `${sanitizeFilename(t26.teamName)}_2026.json`;
    const processedPlayers = t26.players.map((p) => {
      let rationale = `Rated ${p.ovr} OVR for 2026 World Cup form with ${t26.teamName}. `;
      if (p.role === 'Key Starter') rationale += 'Undisputed leader and regular starting XI pillar.';
      else if (p.role === 'Starter') rationale += 'Regular starting lineup selection.';
      else if (p.role === 'Rotation') rationale += 'Frequent tactical rotation contributor.';
      else rationale += 'National squad reserve depth.';

      return {
        id: `${sanitizeFilename(t26.teamName).toLowerCase()}-2026-${sanitizeFilename(p.name).toLowerCase()}`,
        identityId: `identity-2026-${sanitizeFilename(p.name).toLowerCase()}`,
        squadNumber: p.squadNumber,
        name: p.name,
        positionCategory: p.pos === 'GK' ? 'goal keeper' : p.pos === 'DF' ? 'defender' : p.pos === 'MF' ? 'midfielder' : 'forward',
        naturalPositions: p.naturalPositions,
        secondaryPositions: p.secondaryPositions,
        ovr: p.ovr,
        role: p.role,
        matchesStarted: p.role === 'Key Starter' || p.role === 'Starter' ? 5 : 1,
        matchesSub: p.role === 'Rotation' ? 3 : 0,
        goals: p.pos === 'FW' ? 3 : p.pos === 'MF' ? 1 : 0,
        awards: p.hasLegendSeal ? [p.legendSealReason || '2026 Standout Performer'] : [],
        hasLegendSeal: Boolean(p.hasLegendSeal),
        legendSealReason: p.legendSealReason,
        ratingRationale: rationale,
      };
    });

    const fullTeamData = {
      teamName: t26.teamName,
      teamCode: t26.teamName.slice(0, 3).toUpperCase(),
      year: 2026,
      tournament: "2026 FIFA Men's World Cup",
      hostCountry: 'United States, Canada, Mexico',
      achievement: 'Qualified / Participating Nation',
      finalPosition: null,
      tacticalFormation: t26.tacticalFormation,
      squadSize: processedPlayers.length,
      averageOvr: Math.round(processedPlayers.reduce((sum, p) => sum + p.ovr, 0) / processedPlayers.length),
      players: processedPlayers,
    };

    fs.writeFileSync(path.join(targetDir, filename), JSON.stringify(fullTeamData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataTargetDir, filename), JSON.stringify(fullTeamData, null, 2), 'utf-8');
    generatedFiles.push(filename);

    catalogSummary.push({
      file: filename,
      teamName: t26.teamName,
      year: 2026,
      tournament: "2026 FIFA Men's World Cup",
      achievement: '2026 World Cup Squad',
      squadSize: processedPlayers.length,
      avgOvr: fullTeamData.averageOvr,
    });
  }

  // Generate Master Index
  const indexData = {
    generatedAt: new Date().toISOString(),
    totalTeams: generatedFiles.length,
    yearRange: '1950 - 2026',
    teams: catalogSummary.sort((a, b) => a.year - b.year || a.teamName.localeCompare(b.teamName)),
  };

  fs.writeFileSync(path.join(targetDir, 'index.json'), JSON.stringify(indexData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataTargetDir, 'index.json'), JSON.stringify(indexData, null, 2), 'utf-8');

  // Generate a clean README markdown inside the folder
  let md = `# FIFA World Cup Teams & Player Rosters (1950–2026)\n\n`;
  md += `This folder contains **${generatedFiles.length} team files** covering all World Cup editions from 1950 to 2026.\n`;
  md += `Each file contains the full squad (all 22–26 players, starters and reserves), shirt numbers, tactical positions, form-based OVR ratings, awards, and rating rationales.\n\n`;
  md += `## Tournament Editions Overview\n\n`;
  md += `| Year | Tournament | Teams | Champion / Top Performer |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;

  const tournamentsSummary = new Map<number, { name: string; count: number; champion: string }>();
  catalogSummary.forEach((c) => {
    if (!tournamentsSummary.has(c.year)) {
      tournamentsSummary.set(c.year, { name: c.tournament, count: 0, champion: '' });
    }
    const t = tournamentsSummary.get(c.year)!;
    t.count++;
    if (c.achievement === 'Champions') t.champion = c.teamName;
  });

  Array.from(tournamentsSummary.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([year, t]) => {
      md += `| **${year}** | ${t.name} | ${t.count} squads | ${t.champion || (year === 2026 ? 'Co-Hosts: USA, Mexico, Canada' : 'N/A')} |\n`;
    });

  md += `\n## Sample Team File Structure\n\n`;
  md += `Each \`[Team]_[Year].json\` contains:\n`;
  md += `\`\`\`json\n{\n  "teamName": "Brazil",\n  "year": 1970,\n  "tournament": "1970 FIFA Men's World Cup",\n  "hostCountry": "Mexico",\n  "achievement": "Champions",\n  "tacticalFormation": "4-2-4",\n  "squadSize": 22,\n  "averageOvr": 86,\n  "players": [\n    {\n      "id": "brazil-1970-pele",\n      "squadNumber": 10,\n      "name": "Pelé",\n      "naturalPositions": ["ST", "CF"],\n      "secondaryPositions": ["AM", "LW"],\n      "ovr": 97,\n      "role": "Key Starter",\n      "matchesStarted": 6,\n      "goals": 4,\n      "hasLegendSeal": true,\n      "legendSealReason": "1970 FIFA World Cup Golden Ball Winner (Best Player)"\n    }\n  ]\n}\n\`\`\`\n`;

  fs.writeFileSync(path.join(targetDir, 'README.md'), md, 'utf-8');
  fs.writeFileSync(path.join(dataTargetDir, 'README.md'), md, 'utf-8');

  console.log(`\n🎉 Generated ${generatedFiles.length} complete team files successfully in:`);
  console.log(`- ${targetDir}`);
  console.log(`- ${dataTargetDir}`);
}

build().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});

