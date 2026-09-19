import {
  FormationType,
  SquadSlot,
  ManagerSquad,
  TacticsSettings,
  LeagueTeam,
  LeagueMatch,
  LeagueSeasonState,
  MatchEvent,
  IbardexEntry,
  ClubFacilities,
  PlayerTrainingInfo,
} from '../types';

// =========================================================================
// --- FORMATIONS & FIELD COORDINATES ---
// =========================================================================

export interface FormationSlotConfig {
  slotId: string;
  positionLabel: string;
  requiredRole: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  compatibleCodes: string[];
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
}

export const FORMATIONS_CONFIG: Record<FormationType, { name: string; slots: FormationSlotConfig[] }> = {
  '4-3-3': {
    name: '4-3-3 Ofensivo',
    slots: [
      { slotId: 'slot_por', positionLabel: 'POR', requiredRole: 'Portero', compatibleCodes: ['POR'], x: 50, y: 88 },
      { slotId: 'slot_li', positionLabel: 'LI', requiredRole: 'Defensa', compatibleCodes: ['L.I', 'C.I', 'CT'], x: 16, y: 70 },
      { slotId: 'slot_ct1', positionLabel: 'CTI', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.I'], x: 38, y: 72 },
      { slotId: 'slot_ct2', positionLabel: 'CTD', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.D'], x: 62, y: 72 },
      { slotId: 'slot_ld', positionLabel: 'LD', requiredRole: 'Defensa', compatibleCodes: ['L.D', 'C.D', 'CT'], x: 84, y: 70 },
      { slotId: 'slot_mc1', positionLabel: 'MCI', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MCD', 'MP'], x: 28, y: 46 },
      { slotId: 'slot_mcd', positionLabel: 'MCD', requiredRole: 'Centrocampista', compatibleCodes: ['MCD', 'MC', 'CT'], x: 50, y: 52 },
      { slotId: 'slot_mc2', positionLabel: 'MCD', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MP', 'MCD'], x: 72, y: 46 },
      { slotId: 'slot_ei', positionLabel: 'EI', requiredRole: 'Delantero', compatibleCodes: ['E.I', 'DC', 'MP'], x: 20, y: 22 },
      { slotId: 'slot_dc', positionLabel: 'DC', requiredRole: 'Delantero', compatibleCodes: ['DC', 'MP'], x: 50, y: 16 },
      { slotId: 'slot_ed', positionLabel: 'ED', requiredRole: 'Delantero', compatibleCodes: ['E.D', 'DC', 'MP'], x: 80, y: 22 },
    ],
  },
  '4-4-2': {
    name: '4-4-2 Clásico',
    slots: [
      { slotId: 'slot_por', positionLabel: 'POR', requiredRole: 'Portero', compatibleCodes: ['POR'], x: 50, y: 88 },
      { slotId: 'slot_li', positionLabel: 'LI', requiredRole: 'Defensa', compatibleCodes: ['L.I', 'C.I', 'CT'], x: 16, y: 70 },
      { slotId: 'slot_ct1', positionLabel: 'CTI', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.I'], x: 38, y: 72 },
      { slotId: 'slot_ct2', positionLabel: 'CTD', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.D'], x: 62, y: 72 },
      { slotId: 'slot_ld', positionLabel: 'LD', requiredRole: 'Defensa', compatibleCodes: ['L.D', 'C.D', 'CT'], x: 84, y: 70 },
      { slotId: 'slot_mi', positionLabel: 'MI', requiredRole: 'Centrocampista', compatibleCodes: ['E.I', 'C.I', 'MC'], x: 16, y: 44 },
      { slotId: 'slot_mc1', positionLabel: 'MC1', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MCD'], x: 38, y: 46 },
      { slotId: 'slot_mc2', positionLabel: 'MC2', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MP'], x: 62, y: 46 },
      { slotId: 'slot_md', positionLabel: 'MD', requiredRole: 'Centrocampista', compatibleCodes: ['E.D', 'C.D', 'MC'], x: 84, y: 44 },
      { slotId: 'slot_dc1', positionLabel: 'DC1', requiredRole: 'Delantero', compatibleCodes: ['DC', 'MP', 'E.I'], x: 36, y: 18 },
      { slotId: 'slot_dc2', positionLabel: 'DC2', requiredRole: 'Delantero', compatibleCodes: ['DC', 'MP', 'E.D'], x: 64, y: 18 },
    ],
  },
  '3-5-2': {
    name: '3-5-2 Dominio Total',
    slots: [
      { slotId: 'slot_por', positionLabel: 'POR', requiredRole: 'Portero', compatibleCodes: ['POR'], x: 50, y: 88 },
      { slotId: 'slot_ct1', positionLabel: 'CTI', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.I'], x: 26, y: 72 },
      { slotId: 'slot_ct2', positionLabel: 'CT', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 50, y: 74 },
      { slotId: 'slot_ct3', positionLabel: 'CTD', requiredRole: 'Defensa', compatibleCodes: ['CT', 'L.D'], x: 74, y: 72 },
      { slotId: 'slot_ci', positionLabel: 'CI', requiredRole: 'Centrocampista', compatibleCodes: ['L.I', 'C.I', 'E.I'], x: 14, y: 48 },
      { slotId: 'slot_mc1', positionLabel: 'MCD', requiredRole: 'Centrocampista', compatibleCodes: ['MCD', 'MC'], x: 36, y: 52 },
      { slotId: 'slot_mp', positionLabel: 'MCO', requiredRole: 'Centrocampista', compatibleCodes: ['MP', 'MC'], x: 50, y: 38 },
      { slotId: 'slot_mc2', positionLabel: 'MC', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MP'], x: 64, y: 52 },
      { slotId: 'slot_cd', positionLabel: 'CD', requiredRole: 'Centrocampista', compatibleCodes: ['L.D', 'C.D', 'E.D'], x: 86, y: 48 },
      { slotId: 'slot_dc1', positionLabel: 'DC1', requiredRole: 'Delantero', compatibleCodes: ['DC', 'E.I'], x: 36, y: 18 },
      { slotId: 'slot_dc2', positionLabel: 'DC2', requiredRole: 'Delantero', compatibleCodes: ['DC', 'E.D'], x: 64, y: 18 },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1 Táctico',
    slots: [
      { slotId: 'slot_por', positionLabel: 'POR', requiredRole: 'Portero', compatibleCodes: ['POR'], x: 50, y: 88 },
      { slotId: 'slot_li', positionLabel: 'LI', requiredRole: 'Defensa', compatibleCodes: ['L.I', 'C.I'], x: 16, y: 72 },
      { slotId: 'slot_ct1', positionLabel: 'CTI', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 38, y: 74 },
      { slotId: 'slot_ct2', positionLabel: 'CTD', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 62, y: 74 },
      { slotId: 'slot_ld', positionLabel: 'LD', requiredRole: 'Defensa', compatibleCodes: ['L.D', 'C.D'], x: 84, y: 72 },
      { slotId: 'slot_mcd1', positionLabel: 'MCD1', requiredRole: 'Centrocampista', compatibleCodes: ['MCD', 'MC'], x: 36, y: 54 },
      { slotId: 'slot_mcd2', positionLabel: 'MCD2', requiredRole: 'Centrocampista', compatibleCodes: ['MCD', 'MC'], x: 64, y: 54 },
      { slotId: 'slot_mi', positionLabel: 'MCO-I', requiredRole: 'Centrocampista', compatibleCodes: ['E.I', 'MP'], x: 22, y: 34 },
      { slotId: 'slot_mp', positionLabel: 'MCO', requiredRole: 'Centrocampista', compatibleCodes: ['MP', 'MC'], x: 50, y: 32 },
      { slotId: 'slot_md', positionLabel: 'MCO-D', requiredRole: 'Centrocampista', compatibleCodes: ['E.D', 'MP'], x: 78, y: 34 },
      { slotId: 'slot_dc', positionLabel: 'DC', requiredRole: 'Delantero', compatibleCodes: ['DC'], x: 50, y: 16 },
    ],
  },
  '5-3-2': {
    name: '5-3-2 Cerrojo & Contra',
    slots: [
      { slotId: 'slot_por', positionLabel: 'POR', requiredRole: 'Portero', compatibleCodes: ['POR'], x: 50, y: 88 },
      { slotId: 'slot_li', positionLabel: 'CI', requiredRole: 'Defensa', compatibleCodes: ['L.I', 'C.I'], x: 12, y: 66 },
      { slotId: 'slot_ct1', positionLabel: 'CT1', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 30, y: 74 },
      { slotId: 'slot_ct2', positionLabel: 'LIB', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 50, y: 76 },
      { slotId: 'slot_ct3', positionLabel: 'CT2', requiredRole: 'Defensa', compatibleCodes: ['CT'], x: 70, y: 74 },
      { slotId: 'slot_ld', positionLabel: 'CD', requiredRole: 'Defensa', compatibleCodes: ['L.D', 'C.D'], x: 88, y: 66 },
      { slotId: 'slot_mc1', positionLabel: 'MCI', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MCD'], x: 28, y: 46 },
      { slotId: 'slot_mcd', positionLabel: 'MCD', requiredRole: 'Centrocampista', compatibleCodes: ['MCD', 'MC'], x: 50, y: 50 },
      { slotId: 'slot_mc2', positionLabel: 'MCD', requiredRole: 'Centrocampista', compatibleCodes: ['MC', 'MP'], x: 72, y: 46 },
      { slotId: 'slot_dc1', positionLabel: 'DC1', requiredRole: 'Delantero', compatibleCodes: ['DC', 'E.I'], x: 36, y: 20 },
      { slotId: 'slot_dc2', positionLabel: 'DC2', requiredRole: 'Delantero', compatibleCodes: ['DC', 'E.D'], x: 64, y: 20 },
    ],
  },
};

// =========================================================================
// --- DEFAULT TEAMS IN THE LEAGUE ---
// =========================================================================

export const INITIAL_LEAGUE_TEAMS: LeagueTeam[] = [
  {
    id: 'team_soto',
    name: 'C.D. Soto Ibarbaso',
    shortName: 'SOTO',
    badge: 'soto',
    color: '#dc2626',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 82,
    recentForm: [],
  },
  {
    id: 'team_rotxapea',
    name: 'C.D. Rotxapea',
    shortName: 'ROTX',
    badge: 'rotxapea',
    color: '#16a34a',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 77,
    recentForm: [],
  },
  {
    id: 'team_burlades',
    name: 'C.D. Burladés',
    shortName: 'BURL',
    badge: 'burlades',
    color: '#2563eb',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 79,
    recentForm: [],
  },
  {
    id: 'team_txantrea',
    name: 'U.D.C. Txantrea',
    shortName: 'TXAN',
    badge: 'txantrea',
    color: '#0284c7',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 81,
    recentForm: [],
  },
  {
    id: 'team_sanjuan',
    name: 'A.D. San Juan',
    shortName: 'SJUAN',
    badge: 'sanjuan',
    color: '#059669',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 83,
    recentForm: [],
  },
  {
    id: 'team_ardoi',
    name: 'C.F. Ardoi',
    shortName: 'ARDO',
    badge: 'ardoi',
    color: '#7c3aed',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 84,
    recentForm: [],
  },
  {
    id: 'team_betionak',
    name: 'C.D. Beti Onak',
    shortName: 'BONK',
    badge: 'betionak',
    color: '#ea580c',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 82,
    recentForm: [],
  },
  {
    id: 'team_subiza',
    name: 'C.D. Subiza',
    shortName: 'SUBI',
    badge: 'subiza',
    color: '#ca8a04',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 85,
    recentForm: [],
  },
  {
    id: 'team_betikozkor',
    name: 'C.D. Beti Kozkor',
    shortName: 'BKOZ',
    badge: 'betikozkor',
    color: '#4f46e5',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 80,
    recentForm: [],
  },
  {
    id: 'team_egues',
    name: 'C.D. Valle de Egüés',
    shortName: 'EGUS',
    badge: 'egues',
    color: '#db2777',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    ovr: 83,
    recentForm: [],
  },
];

// Generate 14 balanced matchdays for the league
export function generateInitialLeagueMatches(teams: LeagueTeam[] = INITIAL_LEAGUE_TEAMS): LeagueMatch[] {
  const teamIds = teams.map(t => t.id);
  const n = teamIds.length;
  const matches: LeagueMatch[] = [];

  // Round Robin generator for 14 matchdays
  for (let matchday = 1; matchday <= 14; matchday++) {
    const roundMatches: { home: string; away: string }[] = [];
    const dateLabel = `Jornada ${matchday} • ${new Date(2026, 8 + Math.floor((matchday - 1) / 2), 6 + ((matchday - 1) % 2) * 14).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;

    // Create pairings
    for (let i = 0; i < n / 2; i++) {
      const homeIdx = (matchday - 1 + i) % (n - 1);
      let awayIdx = (n - 1 - i + matchday - 1) % (n - 1);
      if (i === 0) awayIdx = n - 1;

      const isHome = matchday % 2 === 0;
      const t1 = teamIds[homeIdx];
      const t2 = teamIds[awayIdx];

      roundMatches.push({
        home: isHome ? t1 : t2,
        away: isHome ? t2 : t1,
      });
    }

    roundMatches.forEach(pair => {
      matches.push({
        matchday,
        homeTeamId: pair.home,
        awayTeamId: pair.away,
        homeScore: null,
        awayScore: null,
        played: false,
        dateLabel,
      });
    });
  }

  return matches;
}

export const INITIAL_SEASON_STATE: LeagueSeasonState = {
  currentMatchday: 1,
  totalMatchdays: 14,
  seasonNumber: 1,
  teams: INITIAL_LEAGUE_TEAMS,
  matches: generateInitialLeagueMatches(INITIAL_LEAGUE_TEAMS),
  trophiesWon: 0,
  topScorers: [
    { playerId: '#044', name: 'Iker Ruiz', teamName: 'C.D. Soto Ibarbaso', goals: 0 },
    { playerId: '#037', name: 'Nico Redín', teamName: 'C.D. Soto Ibarbaso', goals: 0 },
    { playerId: 'rival_dani', name: 'Dani', teamName: 'C.D. Rotxapea', goals: 0 },
  ],
};

export const INITIAL_TACTICS: TacticsSettings = {
  style: 'combinativo',
  mentalidad: 'ofensiva',
  presion: 75,
  ritmo: 70,
  agresividad: 65,
  instruccionesEspeciales: ['Subidas por bandas', 'Presión tras pérdida'],
};

export const INITIAL_FACILITIES: ClubFacilities = {
  stadiumLevel: 1,
  medicalCenterLevel: 1,
  scoutingNetworkLevel: 1,
  academyLevel: 1,
};

// =========================================================================
// --- PLAYER STATS & TEAM CHEMISTRY CALCULATOR ---
// =========================================================================

export function getPlayerOverall(
  player: IbardexEntry,
  training?: PlayerTrainingInfo
): number {
  const f = (player.stats?.fuerza || 75) + (training?.extraStats.fuerza || 0);
  const d = (player.stats?.defensa || 75) + (training?.extraStats.defensa || 0);
  const v = (player.stats?.velocidad || 75) + (training?.extraStats.velocidad || 0);
  const p = (player.stats?.pasion || 80) + (training?.extraStats.pasion || 0);

  if (player.position === 'Portero') {
    return Math.round(d * 0.45 + f * 0.25 + p * 0.2 + v * 0.1);
  }
  if (player.position === 'Defensa') {
    return Math.round(d * 0.4 + f * 0.3 + v * 0.15 + p * 0.15);
  }
  if (player.position === 'Centrocampista') {
    return Math.round(p * 0.35 + v * 0.25 + f * 0.2 + d * 0.2);
  }
  // Delantero
  return Math.round(v * 0.35 + f * 0.3 + p * 0.25 + d * 0.1);
}

export function calculateTeamRatingAndChemistry(
  squad: ManagerSquad,
  allEntries: IbardexEntry[],
  playerTraining: Record<string, PlayerTrainingInfo>,
  facilities: ClubFacilities
): {
  teamOvr: number;
  attackOvr: number;
  midfieldOvr: number;
  defenseOvr: number;
  chemistry: number;
  startingPlayers: (IbardexEntry & { ovr: number; slotChemistry: number })[];
} {
  const entriesMap = new Map(allEntries.map(e => [e.id, e]));
  const formationConfig = FORMATIONS_CONFIG[squad.formation];

  let totalOvr = 0;
  let attackTotal = 0;
  let attackCount = 0;
  let midTotal = 0;
  let midCount = 0;
  let defTotal = 0;
  let defCount = 0;
  let chemistryPoints = 0;

  const startingPlayers: (IbardexEntry & { ovr: number; slotChemistry: number })[] = [];

  formationConfig.slots.forEach(slotConfig => {
    const assignedSlot = squad.startingXI.find(s => s.slotId === slotConfig.slotId);
    const player = assignedSlot?.playerId ? entriesMap.get(assignedSlot.playerId) : null;

    if (player) {
      const training = playerTraining[player.id];
      const baseOvr = getPlayerOverall(player, training);

      // Slot compatibility
      let slotChem = 50; // default out-of-position
      if (player.position === slotConfig.requiredRole) {
        slotChem = 85;
      }
      if (player.posCode && slotConfig.compatibleCodes.includes(player.posCode)) {
        slotChem = 100;
      } else if (
        player.otherPositions &&
        player.otherPositions.some(p => slotConfig.compatibleCodes.includes(p))
      ) {
        slotChem = 90;
      }

      chemistryPoints += slotChem;
      totalOvr += baseOvr;

      if (slotConfig.requiredRole === 'Delantero') {
        attackTotal += baseOvr;
        attackCount++;
      } else if (slotConfig.requiredRole === 'Centrocampista') {
        midTotal += baseOvr;
        midCount++;
      } else {
        defTotal += baseOvr;
        defCount++;
      }

      startingPlayers.push({
        ...player,
        ovr: baseOvr,
        slotChemistry: slotChem,
      });
    } else {
      // Empty slot penalty
      chemistryPoints += 10;
      totalOvr += 50;
      if (slotConfig.requiredRole === 'Delantero') {
        attackTotal += 50;
        attackCount++;
      } else if (slotConfig.requiredRole === 'Centrocampista') {
        midTotal += 50;
        midCount++;
      } else {
        defTotal += 50;
        defCount++;
      }
    }
  });

  const baseChemistry = Math.round(chemistryPoints / 11);
  const stadiumBonus = (facilities.stadiumLevel - 1) * 2;
  const chemistry = Math.min(100, baseChemistry + stadiumBonus);

  const teamOvr = Math.round(totalOvr / 11);
  const attackOvr = attackCount > 0 ? Math.round(attackTotal / attackCount) : 60;
  const midfieldOvr = midCount > 0 ? Math.round(midTotal / midCount) : 60;
  const defenseOvr = defCount > 0 ? Math.round(defTotal / defCount) : 60;

  return {
    teamOvr,
    attackOvr,
    midfieldOvr,
    defenseOvr,
    chemistry,
    startingPlayers,
  };
}

// Auto-build best starting XI from unlocked players
export function autoBuildBestSquad(
  formation: FormationType,
  allEntries: IbardexEntry[],
  playerTraining: Record<string, PlayerTrainingInfo>
): SquadSlot[] {
  const formationConfig = FORMATIONS_CONFIG[formation];
  const unlockedPlantilla = allEntries.filter(
    e => e.unlocked && e.category === 'plantilla'
  );

  // Sort players by OVR descending
  const sortedPlayers = [...unlockedPlantilla].sort((a, b) => {
    return getPlayerOverall(b, playerTraining[b.id]) - getPlayerOverall(a, playerTraining[a.id]);
  });

  const usedPlayerIds = new Set<string>();
  const startingXI: SquadSlot[] = [];

  formationConfig.slots.forEach(slotConfig => {
    // 1. Try exact position code match
    let chosen = sortedPlayers.find(
      p =>
        !usedPlayerIds.has(p.id) &&
        p.posCode &&
        slotConfig.compatibleCodes.includes(p.posCode)
    );

    // 2. Try secondary position match
    if (!chosen) {
      chosen = sortedPlayers.find(
        p =>
          !usedPlayerIds.has(p.id) &&
          p.otherPositions &&
          p.otherPositions.some(code => slotConfig.compatibleCodes.includes(code))
      );
    }

    // 3. Try matching required role
    if (!chosen) {
      chosen = sortedPlayers.find(
        p => !usedPlayerIds.has(p.id) && p.position === slotConfig.requiredRole
      );
    }

    // 4. Fallback to any remaining player
    if (!chosen) {
      chosen = sortedPlayers.find(p => !usedPlayerIds.has(p.id));
    }

    if (chosen) {
      usedPlayerIds.add(chosen.id);
      startingXI.push({
        slotId: slotConfig.slotId,
        positionLabel: slotConfig.positionLabel,
        requiredRole: slotConfig.requiredRole,
        playerId: chosen.id,
      });
    } else {
      startingXI.push({
        slotId: slotConfig.slotId,
        positionLabel: slotConfig.positionLabel,
        requiredRole: slotConfig.requiredRole,
        playerId: null,
      });
    }
  });

  return startingXI;
}

// =========================================================================
// --- PC FÚTBOL / MATCHDAY SIMULATOR ENGINE ---
// =========================================================================

export function simulateLiveMatchFull(
  homeTeam: LeagueTeam,
  awayTeam: LeagueTeam,
  tactics: TacticsSettings,
  isSotoHome: boolean,
  isSotoAway: boolean,
  sotoPlayers: IbardexEntry[]
): {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: {
    possessionHome: number;
    shotsHome: number;
    shotsAway: number;
    cornersHome: number;
    cornersAway: number;
  };
} {
  const events: MatchEvent[] = [];
  let scoreHome = 0;
  let scoreAway = 0;

  const sotoNames = sotoPlayers.map(p => p.name);
  const getSotoPlayer = () =>
    sotoNames.length > 0
      ? sotoNames[Math.floor(Math.random() * sotoNames.length)]
      : 'Jugador del Soto';

  const homePower = homeTeam.ovr + (homeTeam.id === 'team_soto' ? 3 : 0);
  const awayPower = awayTeam.ovr;
  const powerDiff = homePower - awayPower;

  // Base chances calculation
  let homeProb = 0.5 + powerDiff * 0.02;
  homeProb = Math.max(0.25, Math.min(0.75, homeProb));

  // Possession
  const possessionHome = Math.min(
    70,
    Math.max(30, Math.round(50 + powerDiff * 1.5 + (Math.random() * 8 - 4)))
  );

  let shotsHome = 0;
  let shotsAway = 0;
  let cornersHome = 0;
  let cornersAway = 0;

  // Key minute intervals
  const minutePoints = [
    5, 12, 19, 27, 34, 42, 45, 53, 61, 68, 75, 82, 88, 90,
  ];

  events.push({
    minute: 1,
    type: 'commentary',
    team: 'home',
    text: `¡Pita el colegiado y RUEEEEEDA EL BALÓN en el feudo de ${homeTeam.name}!`,
    scoreHome: 0,
    scoreAway: 0,
  });

  minutePoints.forEach(min => {
    const isHomeAction = Math.random() < homeProb;
    const roll = Math.random();

    if (isHomeAction) {
      shotsHome++;
      const playerName =
        homeTeam.id === 'team_soto' ? getSotoPlayer() : `Delantero de ${homeTeam.shortName}`;

      if (roll < 0.22) {
        // GOAL HOME
        scoreHome++;
        events.push({
          minute: min,
          type: 'goal',
          team: 'home',
          text: `⚽ ¡¡GOOOOOOOOOOL DE ${homeTeam.shortName.toUpperCase()}!! ¡Trallazo inapelable de ${playerName} a la escuadra! (${scoreHome}-${scoreAway})`,
          player: playerName,
          scoreHome,
          scoreAway,
        });
      } else if (roll < 0.45) {
        // Save
        events.push({
          minute: min,
          type: 'save',
          team: 'home',
          text: `🧤 ¡Qué mano providencial del guardameta rival ante el chut cruzado de ${playerName}!`,
          scoreHome,
          scoreAway,
        });
      } else if (roll < 0.6) {
        // Woodwork
        events.push({
          minute: min,
          type: 'woodwork',
          team: 'home',
          text: `💥 ¡AL LARGUERO! Cabezazo imperial de ${playerName} que hace temblar la portería.`,
          scoreHome,
          scoreAway,
        });
      } else if (roll < 0.8) {
        // Corner
        cornersHome++;
        events.push({
          minute: min,
          type: 'chance',
          team: 'home',
          text: `🚩 Saque de esquina para ${homeTeam.shortName}. Sube toda la zaga al remate.`,
          scoreHome,
          scoreAway,
        });
      }
    } else {
      shotsAway++;
      const playerName =
        awayTeam.id === 'team_soto' ? getSotoPlayer() : `Atacante de ${awayTeam.shortName}`;

      if (roll < 0.19) {
        // GOAL AWAY
        scoreAway++;
        events.push({
          minute: min,
          type: 'goal',
          team: 'away',
          text: `⚽ ¡GOL DE ${awayTeam.shortName.toUpperCase()}! Remate letal de ${playerName} tras un contragolpe fulgurante. (${scoreHome}-${scoreAway})`,
          player: playerName,
          scoreHome,
          scoreAway,
        });
      } else if (roll < 0.45) {
        // Save
        events.push({
          minute: min,
          type: 'save',
          team: 'away',
          text: `🧤 ¡Paradón colosal del portero! Se estira a mano cambiada y evita el tanto.`,
          scoreHome,
          scoreAway,
        });
      } else if (roll < 0.65) {
        // Yellow card
        events.push({
          minute: min,
          type: 'yellow_card',
          team: 'away',
          text: `🟨 Tarjeta amarilla por una entrada dura para frenar la transición.`,
          scoreHome,
          scoreAway,
        });
      } else {
        cornersAway++;
      }
    }
  });

  events.push({
    minute: 90,
    type: 'commentary',
    team: 'home',
    text: `🏁 ¡FINAL DEL PARTIDO! Resultado final: ${homeTeam.name} ${scoreHome} - ${scoreAway} ${awayTeam.name}.`,
    scoreHome,
    scoreAway,
  });

  return {
    homeScore: scoreHome,
    awayScore: scoreAway,
    events,
    stats: {
      possessionHome,
      shotsHome: Math.max(shotsHome, scoreHome + 2),
      shotsAway: Math.max(shotsAway, scoreAway + 1),
      cornersHome: Math.max(cornersHome, 2),
      cornersAway: Math.max(cornersAway, 2),
    },
  };
}

// Instant simulation for other league matches in a matchday
export function simulateLeagueRoundInstant(
  matches: LeagueMatch[],
  teams: LeagueTeam[],
  matchday: number
): {
  updatedMatches: LeagueMatch[];
  updatedTeams: LeagueTeam[];
} {
  const teamsMap = new Map(teams.map(t => [t.id, { ...t }]));
  const updatedMatches = matches.map(match => {
    if (match.matchday === matchday && !match.played) {
      const home = teamsMap.get(match.homeTeamId);
      const away = teamsMap.get(match.awayTeamId);

      if (home && away) {
        const homeDiff = (home.ovr - away.ovr) * 0.1 + 0.3;
        let hScore = Math.max(0, Math.floor(Math.random() * 3.2 + homeDiff));
        let aScore = Math.max(0, Math.floor(Math.random() * 2.8 - homeDiff * 0.5));

        // Update home team stats
        home.played++;
        home.goalsFor += hScore;
        home.goalsAgainst += aScore;

        // Update away team stats
        away.played++;
        away.goalsFor += aScore;
        away.goalsAgainst += hScore;

        if (hScore > aScore) {
          home.won++;
          home.points += 3;
          home.recentForm = [...home.recentForm.slice(-4), 'W'];
          away.lost++;
          away.recentForm = [...away.recentForm.slice(-4), 'L'];
        } else if (hScore === aScore) {
          home.drawn++;
          home.points += 1;
          home.recentForm = [...home.recentForm.slice(-4), 'D'];
          away.drawn++;
          away.points += 1;
          away.recentForm = [...away.recentForm.slice(-4), 'D'];
        } else {
          away.won++;
          away.points += 3;
          away.recentForm = [...away.recentForm.slice(-4), 'W'];
          home.lost++;
          home.recentForm = [...home.recentForm.slice(-4), 'L'];
        }

        return {
          ...match,
          homeScore: hScore,
          awayScore: aScore,
          played: true,
        };
      }
    }
    return match;
  });

  // Sort updated teams by points, goal difference, goals for
  const updatedTeams = Array.from(teamsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  return {
    updatedMatches,
    updatedTeams,
  };
}

// Facility upgrade costs & effects
export const FACILITY_DETAILS = {
  stadiumLevel: {
    name: 'Estadio El Soto de Ibarbaso',
    icon: 'Building2',
    description: 'Aumenta el aforo, la recaudación por partido y la química local.',
    costs: [0, 150, 350, 750, 1500],
    bonusLabel: (lvl: number) => `+${lvl * 50} 🪙 por partido • +${(lvl - 1) * 2}% Química Local`,
  },
  medicalCenterLevel: {
    name: 'Centro Fisioterapia & Recuperación',
    icon: 'Activity',
    description: 'Reduce el cansancio de los futbolistas y otorga +2 Resistencia física.',
    costs: [0, 120, 300, 650, 1300],
    bonusLabel: (lvl: number) => `+${lvl * 2} Pasión & Resistencia a toda la plantilla`,
  },
  scoutingNetworkLevel: {
    name: 'Red de Ojeadores de Navarra',
    icon: 'Target',
    description: 'Aumenta la probabilidad de conseguir cartas Épicas y Legendarias en los sobres.',
    costs: [0, 200, 450, 900, 2000],
    bonusLabel: (lvl: number) => `+${lvl * 5}% probabilidad de cartas Épicas/Legendarias`,
  },
  academyLevel: {
    name: 'Cantera Roja y Negra',
    icon: 'Users',
    description: 'Genera sobres de cromos gratuitos de la cantera cada semana.',
    costs: [0, 180, 400, 850, 1800],
    bonusLabel: (lvl: number) => `Genera 1 sobre adicional cada ${6 - lvl} victorias`,
  },
};
