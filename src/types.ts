export type EntryCategory = 'plantilla' | 'rivales' | 'cuerpo_tecnico' | 'villanos' | 'objetos' | 'logros';

export type NavigationTab = 'inicio' | 'jugadores' | 'partidos' | 'sobres' | 'ranking' | 'perfil';

export interface IbardexEntry {
  id: string; // e.g. '#001'
  number: number;
  name: string;
  category: EntryCategory;
  position?: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero' | 'Cuerpo Técnico' | 'Afición';
  posCode?: string; // e.g. 'CT', 'DC', 'POR', 'MCD', 'MP', 'L.I', 'L.D', 'MC'
  otherPositions?: string[]; // e.g. ['E.D', 'MC', 'MP'], ['L.I'], etc.
  team?: string; // e.g. 'C.D. Soto Ibarbaso'
  dorsal?: number;
  rarity?: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  specialMove?: string;
  description: string;
  lore: string;
  spriteKey: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  gymId?: string;
  qrCode?: string;
  stats?: {
    fuerza?: number;
    pasion?: number;
    defensa?: number;
    velocidad?: number;
    tiro?: number;
    pase?: number;
    media?: number;
  };
}

export type FormationType = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2';
export type TacticalStyle = 'combinativo' | 'contraataque' | 'presion_alta' | 'autobus' | 'balones_largos';
export type MentalidadType = 'muy_defensiva' | 'defensiva' | 'equilibrada' | 'ofensiva' | 'ataque_total';

export interface SquadSlot {
  slotId: string;
  positionLabel: string; // e.g. 'POR', 'CT1', 'CT2', 'LI', 'LD', 'MC1', 'MC2', 'MP', 'EI', 'ED', 'DC'
  requiredRole: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  playerId: string | null; // entry ID e.g. '#019' or null
}

export interface ManagerSquad {
  formation: FormationType;
  startingXI: SquadSlot[];
  bench: (string | null)[]; // up to 7 bench player entry IDs
  captainId: string | null;
  penaltyTakerId: string | null;
  freeKickTakerId: string | null;
  cornerTakerId: string | null;
}

export interface TacticsSettings {
  style: TacticalStyle;
  mentalidad: MentalidadType;
  presion: number; // 1-100
  ritmo: number; // 1-100
  agresividad: number; // 1-100
  instruccionesEspeciales: string[];
}

export interface ClubFacilities {
  stadiumLevel: number; // 1 to 5 (El Soto)
  medicalCenterLevel: number; // 1 to 5 (Centro Fisioterapia)
  scoutingNetworkLevel: number; // 1 to 5 (Red Ojeadores)
  academyLevel: number; // 1 to 5 (Cantera Ibarbaso)
}

export interface PlayerTrainingInfo {
  trainedLevel: number;
  extraStats: {
    fuerza: number;
    defensa: number;
    velocidad: number;
    pasion: number;
  };
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'save' | 'woodwork' | 'injury' | 'sub' | 'commentary' | 'chance';
  team: 'home' | 'away';
  text: string;
  player?: string;
  scoreHome: number;
  scoreAway: number;
}

export interface LeagueTeam {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  ovr: number;
  recentForm: ('W' | 'D' | 'L')[];
}

export interface LeagueMatch {
  matchday: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
  events?: MatchEvent[];
  dateLabel: string;
}

export interface LeagueSeasonState {
  currentMatchday: number; // 1 to 14
  totalMatchdays: number;
  seasonNumber: number;
  teams: LeagueTeam[];
  matches: LeagueMatch[];
  trophiesWon: number;
  topScorers: { playerId: string; name: string; teamName: string; goals: number }[];
}

export interface Gym {
  id: string;
  number: number;
  rivalName: string;
  nickname: string;
  location: string;
  stadium: string;
  matchDate: string;
  matchTime?: string;
  score?: string; // e.g. "Soto 3 - 1 Rotxapea"
  status: 'upcoming' | 'played' | 'locked';
  isUnlocked: boolean;
  unlockedAt?: string;
  badgeId: string;
  badgeName: string;
  badgeImage: string;
  badgeEarned: boolean;
  badgeEarnedAt?: string;
  qrCode: string;
  qrCodePresencial?: string;
  qrCodeStream?: string;
  presencialCode?: string;
  streamCode?: string;
  rewardCoinsPresencial?: number;
  rewardCoinsStream?: number;
  rewardXpPresencial?: number;
  rewardXpStream?: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil' | 'Épica';
  description: string;
  rivalCoach: string;
  rivalStarPlayer: string;
  unlockedPlayerIds?: string[];
}

export interface Badge {
  id: string;
  name: string;
  category: 'gimnasio' | 'especial' | 'temporada';
  gymId?: string;
  description: string;
  howToGet: string;
  iconName: string;
  color: string;
  earned: boolean;
  earnedAt?: string;
  xpReward: number;
}

export interface AttendedMatch {
  gymId: string;
  attendedAt: string;
  xpEarned: number;
  coinsEarned?: number;
  mode?: 'presencial' | 'stream' | 'ambos';
}

export interface UserProfile {
  id: string;
  email?: string;
  photoURL?: string;
  isLoggedInWithGoogle?: boolean;
  role?: 'admin' | 'user';
  instagram: string;
  name: string;
  xp: number;
  level: number;
  registeredAt: string;
  avatarSprite: string;
  playerPacks: number; // Unopened booster packs
  managerCoins: number; // In-game manager coins 🪙
  unlockedEntries: string[]; // list of entry IDs (e.g. '#001')
  earnedBadges: string[]; // list of badge IDs
  unlockedGyms: string[]; // list of gym IDs attended
  attendedMatches: AttendedMatch[];
  cifrasLetrasStats?: {
    gamesPlayed: number;
    exactMatchesCount: number;
    bestWord: string;
    bestWordPoints: number;
    totalXpEarned: number;
  };
  managerSquad: ManagerSquad;
  tactics: TacticsSettings;
  facilities: ClubFacilities;
  playerTraining: Record<string, PlayerTrainingInfo>;
  seasonState: LeagueSeasonState;
  isClubMember: boolean;
  memberNumber?: string;
}

export interface RankingUser {
  id: string;
  name: string;
  instagram: string;
  level: number;
  xp: number;
  badgesCount: number;
  avatarSprite: string;
  photoURL?: string;
  rank?: number;
  isCurrentUser?: boolean;
  teamOvr?: number;
  leaguePosition?: number;
}

export interface UnlockEvent {
  type: 'entry' | 'badge' | 'level_up' | 'gym' | 'pack' | 'trophy';
  title: string;
  subtitle: string;
  name: string;
  number?: string;
  spriteKey?: string;
  badgeColor?: string;
  badgeIcon?: string;
  xpEarned: number;
  description?: string;
  unlockedEntries?: IbardexEntry[];
}

