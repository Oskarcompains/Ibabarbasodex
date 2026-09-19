import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  IbardexEntry,
  Gym,
  Badge,
  RankingUser,
  UnlockEvent,
  NavigationTab,
  FormationType,
  TacticsSettings,
  ClubFacilities,
  MatchEvent,
  LeagueTeam,
  LeagueMatch,
  AttendedMatch,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_IBARDEX_ENTRIES,
  INITIAL_GYMS,
  INITIAL_BADGES,
  INITIAL_RANKING,
} from '../data/initialData';
import {
  FORMATIONS_CONFIG,
  INITIAL_SEASON_STATE,
  INITIAL_TACTICS,
  INITIAL_FACILITIES,
  calculateTeamRatingAndChemistry,
  autoBuildBestSquad,
  simulateLeagueRoundInstant,
  FACILITY_DETAILS,
} from '../utils/managerEngine';
import { calculateLevelInfo } from '../utils/xpLevels';
import { soundEffects } from '../utils/audio';
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  logOut as firebaseLogOut,
  saveUserProfileToFirestore,
  loadUserProfileFromFirestore,
  fetchCloudRanking,
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AppContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  ibardexEntries: IbardexEntry[];
  gyms: Gym[];
  badges: Badge[];
  ranking: RankingUser[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedGymId: string | null;
  setSelectedGymId: (id: string | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  unlockQueue: UnlockEvent[];
  currentUnlock: UnlockEvent | null;
  dismissCurrentUnlock: () => void;

  // Authentication
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;

  // Manager Mode & Tactics & Squad
  changeFormation: (formation: FormationType) => void;
  assignPlayerToSlot: (slotId: string, playerId: string | null) => void;
  autoAssignSquad: () => void;
  updateTactics: (tactics: Partial<TacticsSettings>) => void;
  playSimulatedMatch: (
    matchday: number,
    simulatedResult?: { homeScore: number; awayScore: number; events: MatchEvent[] }
  ) => { won: boolean; drawn: boolean; lost: boolean; coinsAwarded: number; xpAwarded: number; packsAwarded: number };
  upgradeFacility: (facilityKey: keyof ClubFacilities) => { success: boolean; message: string };
  trainPlayer: (
    playerId: string,
    statKey: 'fuerza' | 'defensa' | 'velocidad' | 'pasion'
  ) => { success: boolean; message: string };
  signPlayerWithCoins: (entryId: string, cost: number) => { success: boolean; message: string };
  resetSeason: () => void;

  // Core Game Actions (Packs, Minigame & Unlocks)
  rewardCifrasLetrasGame: (params: {
    gameMode: 'cifras' | 'letras' | 'duelo';
    xpWon: number;
    packsWon: number;
    isExact?: boolean;
    word?: string;
    wordPoints?: number;
    title: string;
    description: string;
  }) => void;
  attendMatch: (gymId: string, mode?: 'presencial' | 'stream') => { success: boolean; message: string; xpAwarded: number; coinsAwarded?: number };
  openPlayerPack: (packType?: 'bronce' | 'plata' | 'oro' | 'especial') => { success: boolean; message: string; unlocked: IbardexEntry[] };
  buyPackWithXp: (cost?: number) => { success: boolean; message: string };
  buyPackWithCoins: (cost: number, packType: 'bronce' | 'plata' | 'oro' | 'especial') => { success: boolean; message: string };
  scanQrCode: (qrPayload: string) => { success: boolean; message: string; xpAwarded: number };
  redeemSecretCode: (code: string) => { success: boolean; message: string; xpAwarded: number };

  // Profile & Admin Actions
  updateUserProfile: (name: string, instagram: string, avatarSprite?: string) => void;
  isAdmin: boolean;
  adminLoginWithKey: (key: string) => boolean;
  adminLogout: () => void;
  adminGrantPack: (count?: number) => void;
  adminGrantXp: (amount: number, reason: string) => void;
  adminGrantCoins: (amount: number) => void;
  adminSetUserStats: (stats: { xp?: number; coins?: number; packs?: number; level?: number }) => void;
  adminUnlockOrLockEntry: (entryId: string, unlock: boolean) => void;
  adminUpdateGymStatus: (gymId: string, status: 'upcoming' | 'played', score?: string) => void;
  adminResetData: () => void;
  resetAllPlayers: () => Promise<void>;
  resetAllDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ibardex_cd_soto_ibarbaso_v5';

// Immediately purge old cached keys from legacy iterations so no stale unlocked items survive
try {
  const legacyPrefixes = [
    'ibardex_cd_soto_ibarbaso_v1',
    'ibardex_cd_soto_ibarbaso_v2',
    'ibardex_cd_soto_ibarbaso_v3',
    'ibardex_cd_soto_ibarbaso_v4',
  ];
  const suffixes = ['user', 'entries', 'gyms', 'badges', 'ranking'];
  legacyPrefixes.forEach(p => {
    suffixes.forEach(s => {
      localStorage.removeItem(`${p}_${s}`);
    });
  });
} catch {}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_user');
      if (!saved) return INITIAL_USER;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_USER,
        ...parsed,
        managerCoins: parsed.managerCoins ?? INITIAL_USER.managerCoins ?? 0,
        managerSquad: parsed.managerSquad ?? INITIAL_USER.managerSquad,
        tactics: parsed.tactics ?? INITIAL_USER.tactics ?? INITIAL_TACTICS,
        facilities: parsed.facilities ?? INITIAL_USER.facilities ?? INITIAL_FACILITIES,
        playerTraining: parsed.playerTraining ?? {},
        seasonState: parsed.seasonState ?? INITIAL_USER.seasonState ?? INITIAL_SEASON_STATE,
        unlockedEntries: parsed.unlockedEntries || [],
      };
    } catch {
      return INITIAL_USER;
    }
  });

  const [ibardexEntries, setIbardexEntries] = useState<IbardexEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_entries');
      if (!saved) return INITIAL_IBARDEX_ENTRIES;
      const parsed: IbardexEntry[] = JSON.parse(saved);
      const savedMap = new Map(parsed.map(e => [e.id, e]));

      return INITIAL_IBARDEX_ENTRIES.map(initial => {
        const savedEntry = savedMap.get(initial.id);
        if (savedEntry) {
          return {
            ...initial,
            unlocked: savedEntry.unlocked ?? false,
            unlockedAt: savedEntry.unlockedAt,
          };
        }
        return initial;
      });
    } catch {
      return INITIAL_IBARDEX_ENTRIES;
    }
  });

  const [gyms, setGyms] = useState<Gym[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_gyms');
      return saved ? JSON.parse(saved) : INITIAL_GYMS;
    } catch {
      return INITIAL_GYMS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [ranking, setRanking] = useState<RankingUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_ranking');
      return saved ? JSON.parse(saved) : INITIAL_RANKING;
    } catch {
      return INITIAL_RANKING;
    }
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('inicio');
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [unlockQueue, setUnlockQueue] = useState<UnlockEvent[]>([]);
  const [currentUnlock, setCurrentUnlock] = useState<UnlockEvent | null>(null);

  const ADMIN_EMAIL = '14krokodilo14@gmail.com';
  const [adminSessionUnlocked, setAdminSessionUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('soto_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const isAdmin = Boolean(
    (firebaseUser?.email && firebaseUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    user.role === 'admin' ||
    adminSessionUnlocked
  );

  const syncTimeoutRef = useRef<any>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_entries', JSON.stringify(ibardexEntries));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [ibardexEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_gyms', JSON.stringify(gyms));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [gyms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_badges', JSON.stringify(badges));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [badges]);

  // Debounced auto-save to Firebase Firestore
  const triggerCloudSync = useCallback(
    (profileToSave: UserProfile) => {
      if (!firebaseUser) return;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      syncTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          await saveUserProfileToFirestore(profileToSave);
          setLastSyncedAt(new Date().toLocaleTimeString());
        } catch (err) {
          console.error('Auto-sync to Firestore failed:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 1500);
    },
    [firebaseUser]
  );

  useEffect(() => {
    if (firebaseUser && user.id === firebaseUser.uid) {
      triggerCloudSync(user);
    }
  }, [user, firebaseUser, triggerCloudSync]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentFirebaseUser => {
      setFirebaseUser(currentFirebaseUser);

      if (currentFirebaseUser) {
        try {
          const cloudData = await loadUserProfileFromFirestore(currentFirebaseUser.uid);
          if (cloudData) {
            setUser(prev => ({
              ...prev,
              ...cloudData,
              id: currentFirebaseUser.uid,
              name: cloudData.name || currentFirebaseUser.displayName || prev.name,
              email: currentFirebaseUser.email || undefined,
              photoURL: currentFirebaseUser.photoURL || undefined,
              isLoggedInWithGoogle: true,
              managerCoins: cloudData.managerCoins ?? prev.managerCoins ?? 250,
              managerSquad: cloudData.managerSquad ?? prev.managerSquad,
              tactics: cloudData.tactics ?? prev.tactics ?? INITIAL_TACTICS,
              facilities: cloudData.facilities ?? prev.facilities ?? INITIAL_FACILITIES,
              playerTraining: cloudData.playerTraining ?? prev.playerTraining ?? {},
              seasonState: cloudData.seasonState ?? prev.seasonState ?? INITIAL_SEASON_STATE,
            }));

            if (cloudData.unlockedEntries) {
              setIbardexEntries(prev =>
                prev.map(e => ({
                  ...e,
                  unlocked: cloudData.unlockedEntries.includes(e.id),
                }))
              );
            }
            if (cloudData.earnedBadges) {
              setBadges(prev =>
                prev.map(b => ({
                  ...b,
                  earned: cloudData.earnedBadges.includes(b.id),
                }))
              );
            }
            if (cloudData.unlockedGyms) {
              setGyms(prev =>
                prev.map(g => ({
                  ...g,
                  isUnlocked: cloudData.unlockedGyms.includes(g.id),
                  badgeEarned: cloudData.earnedBadges?.includes(g.badgeId) || false,
                }))
              );
            }
          } else {
            const newCloudProfile: UserProfile = {
              ...user,
              id: currentFirebaseUser.uid,
              name: currentFirebaseUser.displayName || user.name,
              email: currentFirebaseUser.email || undefined,
              photoURL: currentFirebaseUser.photoURL || undefined,
              isLoggedInWithGoogle: true,
            };
            setUser(newCloudProfile);
            await saveUserProfileToFirestore(newCloudProfile);
          }
          setLastSyncedAt(new Date().toLocaleTimeString());
        } catch (err) {
          console.error('Error fetching user from Firestore:', err);
        }
      } else {
        setUser(prev => ({
          ...prev,
          isLoggedInWithGoogle: false,
        }));
      }

      try {
        const cloudRanking = await fetchCloudRanking();
        if (cloudRanking.length > 0) {
          setRanking(cloudRanking);
        }
      } catch (e) {
        console.warn('Ranking fetch skipped', e);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Ranking with current user XP and team OVR
  useEffect(() => {
    const teamStats = calculateTeamRatingAndChemistry(
      user.managerSquad,
      ibardexEntries,
      user.playerTraining || {},
      user.facilities || INITIAL_FACILITIES
    );

    const sotoPosition = user.seasonState?.teams
      ? user.seasonState.teams.findIndex(t => t.id === 'team_soto') + 1
      : 1;

    setRanking(prev => {
      const updated = prev.map(item => {
        if (item.id === user.id || item.isCurrentUser) {
          return {
            ...item,
            id: user.id,
            name: user.name,
            instagram: user.instagram,
            level: user.level,
            xp: user.xp,
            badgesCount: user.earnedBadges.length,
            avatarSprite: user.avatarSprite,
            photoURL: user.photoURL,
            teamOvr: teamStats.teamOvr,
            leaguePosition: sotoPosition,
            isCurrentUser: true,
          };
        }
        return item;
      });

      updated.sort((a, b) => b.xp - a.xp);
      return updated.map((u, idx) => ({ ...u, rank: idx + 1 }));
    });
  }, [user, ibardexEntries]);

  // Handle Unlock Queue popup progression
  useEffect(() => {
    if (!currentUnlock && unlockQueue.length > 0) {
      const next = unlockQueue[0];
      setCurrentUnlock(next);
      setUnlockQueue(prev => prev.slice(1));

      if (next.type === 'badge' || next.type === 'trophy') {
        soundEffects.playBadgeFanfare();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#eab308', '#ffffff', '#2563eb'],
        });
      } else if (next.type === 'level_up') {
        soundEffects.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#dc2626', '#fbbf24', '#ffffff'],
        });
      } else if (next.type === 'pack') {
        soundEffects.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#dc2626', '#fbbf24', '#3b82f6', '#10b981'],
        });
      } else {
        soundEffects.playUnlock();
      }
    }
  }, [currentUnlock, unlockQueue]);

  const dismissCurrentUnlock = () => {
    setCurrentUnlock(null);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playClick();
  };

  const queueUnlock = (event: UnlockEvent) => {
    setUnlockQueue(prev => [...prev, event]);
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      soundEffects.playClick();
      const googleUser = await firebaseSignInWithGoogle();
      if (googleUser) {
        soundEffects.playSuccess();
      }
    } catch (error: any) {
      soundEffects.playError();
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      soundEffects.playClick();
      await firebaseLogOut();
      soundEffects.playSuccess();
    } catch (error) {
      soundEffects.playError();
      throw error;
    }
  };

  // =========================================================================
  // --- FOOTBALL MANAGER / PC FÚTBOL LOGIC ---
  // =========================================================================

  const changeFormation = (formation: FormationType) => {
    const config = FORMATIONS_CONFIG[formation];
    const prevSlots = user.managerSquad.startingXI;

    // Keep existing player assignments if slot labels match
    const newSlots = config.slots.map(s => {
      const existing = prevSlots.find(p => p.slotId === s.slotId);
      return {
        slotId: s.slotId,
        positionLabel: s.positionLabel,
        requiredRole: s.requiredRole,
        playerId: existing?.playerId || null,
      };
    });

    setUser(prev => ({
      ...prev,
      managerSquad: {
        ...prev.managerSquad,
        formation,
        startingXI: newSlots,
      },
    }));
    soundEffects.playClick();
  };

  const assignPlayerToSlot = (slotId: string, playerId: string | null) => {
    setUser(prev => {
      // If player is already placed in another slot, swap or clear
      const updatedStartingXI = prev.managerSquad.startingXI.map(slot => {
        if (slot.slotId === slotId) {
          return { ...slot, playerId };
        }
        if (playerId && slot.playerId === playerId) {
          return { ...slot, playerId: null };
        }
        return slot;
      });

      return {
        ...prev,
        managerSquad: {
          ...prev.managerSquad,
          startingXI: updatedStartingXI,
        },
      };
    });
    soundEffects.playClick();
  };

  const autoAssignSquad = () => {
    const bestStartingXI = autoBuildBestSquad(
      user.managerSquad.formation,
      ibardexEntries,
      user.playerTraining || {}
    );

    setUser(prev => ({
      ...prev,
      managerSquad: {
        ...prev.managerSquad,
        startingXI: bestStartingXI,
      },
    }));
    soundEffects.playSuccess();
  };

  const updateTactics = (newTactics: Partial<TacticsSettings>) => {
    setUser(prev => ({
      ...prev,
      tactics: {
        ...prev.tactics,
        ...newTactics,
      },
    }));
    soundEffects.playClick();
  };

  // Play / Finish a Simulated League Match
  const playSimulatedMatch = (
    matchday: number,
    simulatedResult?: { homeScore: number; awayScore: number; events: MatchEvent[] }
  ) => {
    const season = user.seasonState || INITIAL_SEASON_STATE;
    const currentMatch = season.matches.find(
      m => m.matchday === matchday && (m.homeTeamId === 'team_soto' || m.awayTeamId === 'team_soto')
    );

    if (!currentMatch) {
      return { won: false, drawn: false, lost: false, coinsAwarded: 0, xpAwarded: 0, packsAwarded: 0 };
    }

    const isSotoHome = currentMatch.homeTeamId === 'team_soto';
    const sotoScore = isSotoHome ? simulatedResult?.homeScore ?? 2 : simulatedResult?.awayScore ?? 1;
    const rivalScore = isSotoHome ? simulatedResult?.awayScore ?? 1 : simulatedResult?.homeScore ?? 1;

    const won = sotoScore > rivalScore;
    const drawn = sotoScore === rivalScore;
    const lost = sotoScore < rivalScore;

    // Calculate Rewards based on stadium and match outcome
    const stadiumBonus = (user.facilities?.stadiumLevel || 1) * 50;
    let coinsAwarded = stadiumBonus + (won ? 150 : drawn ? 75 : 30);
    let xpAwarded = won ? 60 : drawn ? 30 : 15;
    let packsAwarded = won ? 1 : 0;

    // Simulate other matches in round
    const { updatedMatches, updatedTeams } = simulateLeagueRoundInstant(
      season.matches.map(m => {
        if (m.matchday === matchday && (m.homeTeamId === 'team_soto' || m.awayTeamId === 'team_soto')) {
          return {
            ...m,
            homeScore: simulatedResult?.homeScore ?? (isSotoHome ? sotoScore : rivalScore),
            awayScore: simulatedResult?.awayScore ?? (isSotoHome ? rivalScore : sotoScore),
            played: true,
            events: simulatedResult?.events,
          };
        }
        return m;
      }),
      season.teams,
      matchday
    );

    // Update Soto's stats explicitly
    const sotoTeam = updatedTeams.find(t => t.id === 'team_soto');
    if (sotoTeam) {
      sotoTeam.played++;
      sotoTeam.goalsFor += sotoScore;
      sotoTeam.goalsAgainst += rivalScore;
      if (won) {
        sotoTeam.won++;
        sotoTeam.points += 3;
        sotoTeam.recentForm = [...sotoTeam.recentForm.slice(-4), 'W'];
      } else if (drawn) {
        sotoTeam.drawn++;
        sotoTeam.points += 1;
        sotoTeam.recentForm = [...sotoTeam.recentForm.slice(-4), 'D'];
      } else {
        sotoTeam.lost++;
        sotoTeam.recentForm = [...sotoTeam.recentForm.slice(-4), 'L'];
      }
    }

    const nextMatchday = Math.min(season.totalMatchdays + 1, season.currentMatchday + 1);

    const isSeasonFinished = nextMatchday > season.totalMatchdays;
    let isChampion = false;
    if (isSeasonFinished && updatedTeams[0]?.id === 'team_soto') {
      isChampion = true;
      packsAwarded += 3;
      coinsAwarded += 500;
      xpAwarded += 200;

      queueUnlock({
        type: 'trophy',
        title: '🏆 ¡CAMPEONES DE LIGA!',
        subtitle: 'C.D. Soto Ibarbaso asciende de categoría',
        name: 'CAMPEÓN DE NAVARRA',
        xpEarned: 200,
        description: '¡Has llevado al Soto a lo más alto! Recibes +500 🪙 y 3 Sobres de Oro Campeón.',
      });
    }

    const newXp = user.xp + xpAwarded;
    const oldLevelInfo = calculateLevelInfo(user.xp);
    const newLevelInfo = calculateLevelInfo(newXp);

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevelInfo.level,
      managerCoins: user.managerCoins + coinsAwarded,
      playerPacks: user.playerPacks + packsAwarded,
      seasonState: {
        ...season,
        currentMatchday: nextMatchday,
        teams: updatedTeams,
        matches: updatedMatches,
        trophiesWon: season.trophiesWon + (isChampion ? 1 : 0),
      },
    };

    setUser(updatedUser);

    if (won) {
      soundEffects.playBadgeFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundEffects.playSuccess();
    }

    return { won, drawn, lost, coinsAwarded, xpAwarded, packsAwarded };
  };

  const upgradeFacility = (facilityKey: keyof ClubFacilities) => {
    const currentLevel = user.facilities?.[facilityKey] || 1;
    const details = FACILITY_DETAILS[facilityKey];

    if (currentLevel >= 5) {
      soundEffects.playError();
      return { success: false, message: 'Esta instalación ya está en el nivel máximo (5).' };
    }

    const cost = details.costs[currentLevel] || 500;
    if (user.managerCoins < cost) {
      soundEffects.playError();
      return {
        success: false,
        message: `Necesitas ${cost} 🪙 para mejorar ${details.name}. Tienes ${user.managerCoins} 🪙.`,
      };
    }

    const updatedFacilities: ClubFacilities = {
      ...(user.facilities || INITIAL_FACILITIES),
      [facilityKey]: currentLevel + 1,
    };

    setUser(prev => ({
      ...prev,
      managerCoins: prev.managerCoins - cost,
      facilities: updatedFacilities,
    }));

    soundEffects.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
    });

    return {
      success: true,
      message: `¡${details.name} mejorado al Nivel ${currentLevel + 1}!`,
    };
  };

  const trainPlayer = (
    playerId: string,
    statKey: 'fuerza' | 'defensa' | 'velocidad' | 'pasion'
  ) => {
    const cost = 80;
    if (user.managerCoins < cost) {
      soundEffects.playError();
      return { success: false, message: `Necesitas ${cost} 🪙 de presupuesto para entrenar a este jugador.` };
    }

    const player = ibardexEntries.find(e => e.id === playerId);
    if (!player) {
      soundEffects.playError();
      return { success: false, message: 'Jugador no encontrado.' };
    }

    const currentTraining = user.playerTraining?.[playerId] || {
      trainedLevel: 0,
      extraStats: { fuerza: 0, defensa: 0, velocidad: 0, pasion: 0 },
    };

    const updatedInfo = {
      trainedLevel: currentTraining.trainedLevel + 1,
      extraStats: {
        ...currentTraining.extraStats,
        [statKey]: currentTraining.extraStats[statKey] + 2,
      },
    };

    setUser(prev => ({
      ...prev,
      managerCoins: prev.managerCoins - cost,
      playerTraining: {
        ...(prev.playerTraining || {}),
        [playerId]: updatedInfo,
      },
    }));

    soundEffects.playSuccess();
    return {
      success: true,
      message: `¡${player.name} entrenado con éxito! +2 en ${statKey.toUpperCase()}.`,
    };
  };

  const signPlayerWithCoins = (entryId: string, cost: number) => {
    if (user.managerCoins < cost) {
      soundEffects.playError();
      return { success: false, message: `Necesitas ${cost} 🪙 para fichar a este jugador.` };
    }

    const entry = ibardexEntries.find(e => e.id === entryId);
    if (!entry) {
      soundEffects.playError();
      return { success: false, message: 'Jugador no disponible.' };
    }

    const updatedUnlocked = Array.from(new Set([...user.unlockedEntries, entryId]));
    setIbardexEntries(prev =>
      prev.map(e => (e.id === entryId ? { ...e, unlocked: true } : e))
    );

    setUser(prev => ({
      ...prev,
      managerCoins: prev.managerCoins - cost,
      unlockedEntries: updatedUnlocked,
    }));

    queueUnlock({
      type: 'entry',
      title: '¡FICHAJE ESTRELLA COMPLETADO!',
      subtitle: `${entry.name} se une al CD Soto Ibarbaso`,
      name: entry.name,
      spriteKey: entry.spriteKey,
      xpEarned: entry.xpReward,
      description: `¡Has firmado a ${entry.name}! Ya está disponible para tu alineación de mánager.`,
      unlockedEntries: [entry],
    });

    soundEffects.playSuccess();
    return { success: true, message: `¡Fichaje oficial! ${entry.name} se incorpora a tu plantilla.` };
  };

  const resetSeason = () => {
    const newMatches = INITIAL_SEASON_STATE.matches.map(m => ({ ...m, played: false, homeScore: null, awayScore: null }));
    const resetTeams = INITIAL_SEASON_STATE.teams.map(t => ({
      ...t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      recentForm: [],
    }));

    setUser(prev => ({
      ...prev,
      seasonState: {
        ...INITIAL_SEASON_STATE,
        seasonNumber: (prev.seasonState?.seasonNumber || 1) + 1,
        currentMatchday: 1,
        matches: newMatches,
        teams: resetTeams,
      },
    }));
    soundEffects.playSuccess();
  };

  // Open Booster Pack (reveals 3 cards + grants coins & XP)
  const openPlayerPack = (packType: 'bronce' | 'plata' | 'oro' | 'especial' = 'oro') => {
    if (user.playerPacks <= 0) {
      soundEffects.playError();
      return { success: false, message: 'No tienes sobres disponibles. ¡Gana partidos o canjea XP!', unlocked: [] };
    }

    // Scouting bonus calculation
    const scoutingLevel = user.facilities?.scoutingNetworkLevel || 1;
    const epicBonus = scoutingLevel * 0.05;

    // Filter locked entries
    const lockedPool = ibardexEntries.filter(
      e => !user.unlockedEntries.includes(e.id)
    );

    let newlyUnlocked: IbardexEntry[] = [];
    const countToPick = 3;

    if (lockedPool.length > 0) {
      // Prioritize by rarity weighting
      const sortedPool = [...lockedPool].sort((a, b) => {
        const weightA = a.rarity === 'Legendario' ? 4 : a.rarity === 'Épico' ? 3 : a.rarity === 'Raro' ? 2 : 1;
        const weightB = b.rarity === 'Legendario' ? 4 : b.rarity === 'Épico' ? 3 : b.rarity === 'Raro' ? 2 : 1;
        return (Math.random() + (weightB > 2 ? epicBonus : 0)) - Math.random();
      });
      newlyUnlocked = sortedPool.slice(0, Math.min(countToPick, lockedPool.length));
    } else {
      const shuffled = [...ibardexEntries].sort(() => 0.5 - Math.random());
      newlyUnlocked = shuffled.slice(0, countToPick);
    }

    const xpEarned = newlyUnlocked.reduce((sum, item) => sum + (item.xpReward || 25), 30);
    const coinsWon = 50 + Math.floor(Math.random() * 50);
    const newXp = user.xp + xpEarned;
    const oldLevelInfo = calculateLevelInfo(user.xp);
    const newLevelInfo = calculateLevelInfo(newXp);
    const nowStr = new Date().toISOString().slice(0, 10);

    const updatedUnlockedIds = Array.from(
      new Set([...user.unlockedEntries, ...newlyUnlocked.map(item => item.id)])
    );

    setIbardexEntries(prev =>
      prev.map(e =>
        updatedUnlockedIds.includes(e.id)
          ? { ...e, unlocked: true, unlockedAt: e.unlockedAt || nowStr }
          : e
      )
    );

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevelInfo.level,
      managerCoins: user.managerCoins + coinsWon,
      playerPacks: Math.max(0, user.playerPacks - 1),
      unlockedEntries: updatedUnlockedIds,
    };

    setUser(updatedUser);

    queueUnlock({
      type: 'pack',
      title: '¡SOBRE FIFA / PC FÚTBOL ABIERTO!',
      subtitle: `${newlyUnlocked.map(c => c.name).join(', ')}`,
      name: newlyUnlocked[0]?.name || 'Nuevas Cartas',
      spriteKey: newlyUnlocked[0]?.spriteKey,
      xpEarned,
      description: `¡Desbloqueaste ${newlyUnlocked.length} futbolistas para tu alineación! Ganaste +${coinsWon} 🪙 de presupuesto.`,
      unlockedEntries: newlyUnlocked,
    });

    if (newLevelInfo.level > oldLevelInfo.level) {
      queueUnlock({
        type: 'level_up',
        title: '¡SUBISTE DE NIVEL!',
        subtitle: `Nivel ${newLevelInfo.level}: ${newLevelInfo.title}`,
        name: `NIVEL ${newLevelInfo.level}`,
        xpEarned,
        description: `¡Has alcanzado el rango "${newLevelInfo.title}"!`,
      });
    }

    soundEffects.playSuccess();
    return {
      success: true,
      message: `¡Sobre abierto! Desbloqueaste a: ${newlyUnlocked.map(c => c.name).join(', ')} (+${coinsWon} 🪙)`,
      unlocked: newlyUnlocked,
    };
  };

  const buyPackWithCoins = (cost: number, packType: 'bronce' | 'plata' | 'oro' | 'especial') => {
    if (user.managerCoins < cost) {
      soundEffects.playError();
      return { success: false, message: `Necesitas ${cost} 🪙 de presupuesto para este sobre.` };
    }

    setUser(prev => ({
      ...prev,
      managerCoins: prev.managerCoins - cost,
      playerPacks: prev.playerPacks + 1,
    }));

    soundEffects.playSuccess();
    return { success: true, message: `¡Sobre ${packType.toUpperCase()} adquirido! Puedes abrirlo ahora.` };
  };

  const buyPackWithXp = (cost = 50) => {
    if (user.xp < cost) {
      soundEffects.playError();
      return { success: false, message: `Necesitas al menos ${cost} XP para canjear un sobre.` };
    }

    setUser(prev => ({
      ...prev,
      xp: prev.xp - cost,
      playerPacks: prev.playerPacks + 1,
    }));

    soundEffects.playSuccess();
    return { success: true, message: '¡Sobre conseguido con éxito! Ya puedes abrirlo en la sección Sobres.' };
  };

  const rewardCifrasLetrasGame = (params: {
    gameMode: 'cifras' | 'letras' | 'duelo';
    xpWon: number;
    packsWon: number;
    isExact?: boolean;
    word?: string;
    wordPoints?: number;
    title: string;
    description: string;
  }) => {
    const { xpWon, packsWon, isExact, word, wordPoints, title, description } = params;
    const newXp = user.xp + xpWon;
    const oldLevelInfo = calculateLevelInfo(user.xp);
    const newLevelInfo = calculateLevelInfo(newXp);
    const newPacksCount = user.playerPacks + packsWon;
    const coinsWon = xpWon * 2;

    const prevStats = user.cifrasLetrasStats || {
      gamesPlayed: 0,
      exactMatchesCount: 0,
      bestWord: '',
      bestWordPoints: 0,
      totalXpEarned: 0,
    };

    const newBestWord =
      word && (!prevStats.bestWord || word.length > prevStats.bestWord.length)
        ? word
        : prevStats.bestWord;

    const newBestWordPoints = Math.max(prevStats.bestWordPoints || 0, wordPoints || 0);

    const updatedStats = {
      gamesPlayed: prevStats.gamesPlayed + 1,
      exactMatchesCount: prevStats.exactMatchesCount + (isExact ? 1 : 0),
      bestWord: newBestWord,
      bestWordPoints: newBestWordPoints,
      totalXpEarned: (prevStats.totalXpEarned || 0) + xpWon,
    };

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevelInfo.level,
      managerCoins: user.managerCoins + coinsWon,
      playerPacks: newPacksCount,
      cifrasLetrasStats: updatedStats,
    };

    setUser(updatedUser);

    if (packsWon > 0 || isExact || xpWon >= 40) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    if (packsWon > 0) {
      queueUnlock({
        type: 'pack',
        title: title || '¡PREMIO CIFRAS Y LETRAS!',
        subtitle: `+${xpWon} XP, +${coinsWon} 🪙 y +${packsWon} Sobre`,
        name: isExact ? 'DIANA EXACTA' : 'GRAN PUNTUACIÓN',
        xpEarned: xpWon,
        description,
      });
    }

    if (newLevelInfo.level > oldLevelInfo.level) {
      queueUnlock({
        type: 'level_up',
        title: '¡SUBISTE DE NIVEL!',
        subtitle: `Nivel ${newLevelInfo.level}: ${newLevelInfo.title}`,
        name: `NIVEL ${newLevelInfo.level}`,
        xpEarned: xpWon,
        description: `¡Has alcanzado el rango "${newLevelInfo.title}" gracias a tu mente ágil!`,
      });
    }

    soundEffects.playSuccess();
  };

  const attendMatch = (gymId: string, mode: 'presencial' | 'stream' = 'presencial') => {
    const gym = gyms.find(g => g.id === gymId);
    if (!gym) {
      soundEffects.playError();
      return { success: false, message: 'Partido no encontrado', xpAwarded: 0, coinsAwarded: 0 };
    }

    const existingAttendance = user.attendedMatches.find(m => m.gymId === gymId);
    const alreadyPresencial = existingAttendance?.mode === 'presencial' || existingAttendance?.mode === 'ambos';
    const alreadyStream = existingAttendance?.mode === 'stream' || existingAttendance?.mode === 'ambos';

    if (mode === 'presencial' && alreadyPresencial) {
      soundEffects.playError();
      return {
        success: false,
        message: '¡Ya has canjeado la asistencia presencial para este partido!',
        xpAwarded: 0,
        coinsAwarded: 0,
      };
    }

    if (mode === 'stream' && (alreadyStream || alreadyPresencial)) {
      soundEffects.playError();
      return {
        success: false,
        message: alreadyPresencial
          ? '¡Ya cuentas con la recompensa máxima presencial en este partido!'
          : '¡Ya has canjeado el directo de este partido! Ve al estadio para conseguir el bono presencial.',
        xpAwarded: 0,
        coinsAwarded: 0,
      };
    }

    // Determine rewards according to mode
    let xpAwarded = 0;
    let coinsWon = 0;
    let packsWon = 0;
    let newMode: 'presencial' | 'stream' | 'ambos' = mode;

    if (mode === 'presencial') {
      if (alreadyStream) {
        // Upgrade from stream to full presencial bonus
        const fullCoins = gym.rewardCoinsPresencial ?? 200;
        const streamCoins = gym.rewardCoinsStream ?? 80;
        coinsWon = Math.max(0, fullCoins - streamCoins);

        const fullXp = gym.rewardXpPresencial ?? 100;
        const streamXp = gym.rewardXpStream ?? 40;
        xpAwarded = Math.max(0, fullXp - streamXp);

        packsWon = 1;
        newMode = 'ambos';
      } else {
        coinsWon = gym.rewardCoinsPresencial ?? 200;
        xpAwarded = gym.rewardXpPresencial ?? 100;
        packsWon = 1;
        newMode = 'presencial';
      }
    } else {
      // mode === 'stream'
      coinsWon = gym.rewardCoinsStream ?? 80;
      xpAwarded = gym.rewardXpStream ?? 40;
      packsWon = 0;
      newMode = 'stream';
    }

    const newXp = user.xp + xpAwarded;
    const oldLevelInfo = calculateLevelInfo(user.xp);
    const newLevelInfo = calculateLevelInfo(newXp);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedGymsList = Array.from(new Set([...user.unlockedGyms, gymId]));
    const updatedBadges = [...user.earnedBadges];
    if (gym.badgeId && !updatedBadges.includes(gym.badgeId)) {
      updatedBadges.push(gym.badgeId);
    }

    let updatedUnlockedEntries = [...user.unlockedEntries];
    const rivalEntry = ibardexEntries.find(e => e.gymId === gymId);
    if (rivalEntry && !updatedUnlockedEntries.includes(rivalEntry.id)) {
      updatedUnlockedEntries.push(rivalEntry.id);
    }

    if (gym.unlockedPlayerIds && mode === 'presencial') {
      gym.unlockedPlayerIds.forEach(pid => {
        if (!updatedUnlockedEntries.includes(pid)) {
          updatedUnlockedEntries.push(pid);
        }
      });
    }

    setGyms(prev =>
      prev.map(g =>
        g.id === gymId
          ? { ...g, isUnlocked: true, unlockedAt: nowStr.slice(0, 10), badgeEarned: true, status: 'played' }
          : g
      )
    );

    if (gym.badgeId) {
      setBadges(prev =>
        prev.map(b => (b.id === gym.badgeId ? { ...b, earned: true, earnedAt: nowStr.slice(0, 10) } : b))
      );
    }

    setIbardexEntries(prev =>
      prev.map(e => (updatedUnlockedEntries.includes(e.id) ? { ...e, unlocked: true } : e))
    );

    const badge = badges.find(b => b.id === gym.badgeId);
    if (mode === 'presencial') {
      queueUnlock({
        type: 'badge',
        title: '¡CANJE EN PERSONA (ESTADIO)!',
        subtitle: `Jornada #${gym.number} • ${gym.stadium}`,
        name: `${gym.rivalName} - ${gym.badgeName}`,
        badgeColor: badge?.color || '#dc2626',
        badgeIcon: badge?.iconName || 'shield',
        xpEarned: xpAwarded,
        description: `¡Gracias por apoyar en la grada! Has sumado +${coinsWon} 🪙 Monedas, +${xpAwarded} XP y +${packsWon} Sobre de cartas.`,
      });
    } else {
      queueUnlock({
        type: 'badge',
        title: '¡CANJE DE STREAM EN DIRECTO!',
        subtitle: `Jornada #${gym.number} • Transmisión Online`,
        name: `Soto vs ${gym.rivalName}`,
        badgeColor: '#9333ea',
        badgeIcon: 'award',
        xpEarned: xpAwarded,
        description: `¡Gracias por alentar desde el directo! Has sumado +${coinsWon} 🪙 Monedas y +${xpAwarded} XP para comprar sobres.`,
      });
    }

    if (newLevelInfo.level > oldLevelInfo.level) {
      queueUnlock({
        type: 'level_up',
        title: '¡SUBISTE DE NIVEL!',
        subtitle: `Nivel ${newLevelInfo.level}: ${newLevelInfo.title}`,
        name: `NIVEL ${newLevelInfo.level}`,
        xpEarned: xpAwarded,
        description: `¡Felicidades! Ahora tienes rango "${newLevelInfo.title}".`,
      });
    }

    const updatedAttendedMatches: AttendedMatch[] = user.attendedMatches.some(m => m.gymId === gymId)
      ? user.attendedMatches.map(m =>
          m.gymId === gymId
            ? {
                ...m,
                attendedAt: nowStr,
                xpEarned: (m.xpEarned || 0) + xpAwarded,
                coinsEarned: (m.coinsEarned || 0) + coinsWon,
                mode: newMode,
              }
            : m
        )
      : [
          ...user.attendedMatches,
          {
            gymId,
            attendedAt: nowStr,
            xpEarned: xpAwarded,
            coinsEarned: coinsWon,
            mode: newMode,
          },
        ];

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevelInfo.level,
      managerCoins: user.managerCoins + coinsWon,
      playerPacks: user.playerPacks + packsWon,
      unlockedGyms: updatedGymsList,
      earnedBadges: updatedBadges,
      unlockedEntries: updatedUnlockedEntries,
      attendedMatches: updatedAttendedMatches,
    };

    setUser(updatedUser);
    soundEffects.playSuccess();

    return {
      success: true,
      message:
        mode === 'presencial'
          ? `¡Partido canjeado en persona! +${coinsWon} 🪙, +${xpAwarded} XP y +${packsWon} Sobre.`
          : `¡Partido canjeado por Stream! +${coinsWon} 🪙 y +${xpAwarded} XP.`,
      xpAwarded,
      coinsAwarded: coinsWon,
    };
  };

  const unlockPlayerById = (entryId: string) => {
    const entry = ibardexEntries.find(e => e.id === entryId || (e.qrCode && e.qrCode.toUpperCase() === entryId.toUpperCase()));
    if (!entry) {
      soundEffects.playError();
      return { success: false, message: 'Jugador no encontrado.', xpAwarded: 0 };
    }

    if (user.unlockedEntries.includes(entry.id)) {
      soundEffects.playError();
      return {
        success: false,
        message: `Ya tienes a ${entry.name} en tu plantilla.`,
        xpAwarded: 0,
      };
    }

    const xpEarned = entry.xpReward || 25;
    const newXp = user.xp + xpEarned;
    const oldLevelInfo = calculateLevelInfo(user.xp);
    const newLevelInfo = calculateLevelInfo(newXp);
    const nowStr = new Date().toISOString().slice(0, 10);

    const updatedUnlockedIds = Array.from(new Set([...user.unlockedEntries, entry.id]));

    setIbardexEntries(prev =>
      prev.map(e => (e.id === entry.id ? { ...e, unlocked: true, unlockedAt: nowStr } : e))
    );

    setUser(prev => ({
      ...prev,
      xp: newXp,
      level: newLevelInfo.level,
      managerCoins: prev.managerCoins + 30,
      unlockedEntries: updatedUnlockedIds,
    }));

    queueUnlock({
      type: 'entry',
      title: '¡JUGADOR DESBLOQUEADO!',
      subtitle: `${entry.name} • ${entry.position || entry.category.toUpperCase()}`,
      name: entry.name,
      number: entry.id,
      spriteKey: entry.spriteKey,
      xpEarned,
      description: `${entry.description}`,
      unlockedEntries: [entry],
    });

    soundEffects.playSuccess();
    return {
      success: true,
      message: `🎉 ¡${entry.name} desbloqueado! (+${xpEarned} XP).`,
      xpAwarded: xpEarned,
    };
  };

  const scanQrCode = (qrPayload: string) => {
    const cleanPayload = qrPayload.trim().toUpperCase();
    if (!cleanPayload) {
      return { success: false, message: 'Por favor introduce un código QR válido.', xpAwarded: 0 };
    }

    // Match Presencial detection
    const matchedGymPresencial = gyms.find(
      g =>
        (g.presencialCode && g.presencialCode.toUpperCase() === cleanPayload) ||
        (g.qrCodePresencial && g.qrCodePresencial.toUpperCase() === cleanPayload) ||
        (g.qrCode && g.qrCode.toUpperCase() === cleanPayload) ||
        cleanPayload === `ESTADIO-J${g.number}` ||
        cleanPayload === `ESTADIO-J0${g.number}` ||
        cleanPayload === `PRESENCIAL-J${g.number}` ||
        cleanPayload === `PRESENCIAL-J0${g.number}` ||
        cleanPayload === `SOTO-J${g.number}` ||
        cleanPayload === `SOTO-J0${g.number}` ||
        cleanPayload === `CAMPO-J${g.number}` ||
        cleanPayload === `ESTADIO-${g.rivalName.replace(/\s+/g, '').toUpperCase()}` ||
        cleanPayload === `PRESENCIAL-${g.rivalName.replace(/\s+/g, '').toUpperCase()}` ||
        cleanPayload === `SOTO-${g.rivalName.replace(/\s+/g, '').toUpperCase()}`
    );
    if (matchedGymPresencial) {
      return attendMatch(matchedGymPresencial.id, 'presencial');
    }

    // Match Stream detection
    const matchedGymStream = gyms.find(
      g =>
        (g.streamCode && g.streamCode.toUpperCase() === cleanPayload) ||
        (g.qrCodeStream && g.qrCodeStream.toUpperCase() === cleanPayload) ||
        cleanPayload === `STREAM-J${g.number}` ||
        cleanPayload === `STREAM-J0${g.number}` ||
        cleanPayload === `DIRECTO-J${g.number}` ||
        cleanPayload === `DIRECTO-J0${g.number}` ||
        cleanPayload === `TWITCH-J${g.number}` ||
        cleanPayload === `TWITCH-J0${g.number}` ||
        cleanPayload === `STREAM-${g.rivalName.replace(/\s+/g, '').toUpperCase()}` ||
        cleanPayload === `DIRECTO-${g.rivalName.replace(/\s+/g, '').toUpperCase()}`
    );
    if (matchedGymStream) {
      return attendMatch(matchedGymStream.id, 'stream');
    }

    const matchedGym = gyms.find(
      g =>
        g.id.toUpperCase() === cleanPayload ||
        cleanPayload.includes(g.id.toUpperCase())
    );
    if (matchedGym) {
      return attendMatch(matchedGym.id, 'presencial');
    }

    const matchedEntry = ibardexEntries.find(
      e =>
        (e.qrCode && e.qrCode.toUpperCase() === cleanPayload) ||
        e.id.toUpperCase() === cleanPayload ||
        cleanPayload === `IBAR-PLAYER-${e.number}` ||
        cleanPayload === `IBAR-JUGADOR-${e.number}`
    );

    if (matchedEntry) {
      return unlockPlayerById(matchedEntry.id);
    }

    return redeemSecretCode(cleanPayload);
  };

  const redeemSecretCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();

    if (code === 'SOTO2025' || code === 'SOTO' || code === 'IBARBASO') {
      if (user.unlockedEntries.includes('#010')) {
        soundEffects.playError();
        return { success: false, message: 'Ya has canjeado este código.', xpAwarded: 0 };
      }
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 30,
        managerCoins: prev.managerCoins + 100,
        playerPacks: prev.playerPacks + 2,
        unlockedEntries: Array.from(new Set([...prev.unlockedEntries, '#010', '#020'])),
      }));
      setIbardexEntries(prev =>
        prev.map(e => (e.id === '#010' || e.id === '#020' ? { ...e, unlocked: true } : e))
      );
      soundEffects.playSuccess();
      return { success: true, message: '¡Código canjeado! +30 XP, +100 🪙 y +2 Sobres.', xpAwarded: 30 };
    }

    if (code === 'BUFANDAROJA' || code === 'BUFANDA') {
      if (user.unlockedEntries.includes('#301')) {
        return { success: false, message: 'Ya tienes la bufanda en tu inventario.', xpAwarded: 0 };
      }
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 20,
        managerCoins: prev.managerCoins + 50,
        unlockedEntries: Array.from(new Set([...prev.unlockedEntries, '#301'])),
      }));
      setIbardexEntries(prev =>
        prev.map(e => (e.id === '#301' ? { ...e, unlocked: true } : e))
      );
      soundEffects.playSuccess();
      return { success: true, message: '¡Bufanda Sagrada desbloqueada! +20 XP y +50 🪙.', xpAwarded: 20 };
    }

    if (code === 'GOLAZO' || code === 'PACK') {
      setUser(prev => ({
        ...prev,
        playerPacks: prev.playerPacks + 1,
        managerCoins: prev.managerCoins + 50,
      }));
      soundEffects.playSuccess();
      return { success: true, message: '¡+1 Sobre y +50 🪙 conseguidos!', xpAwarded: 0 };
    }

    soundEffects.playError();
    return { success: false, message: 'Código no reconocido o caducado.', xpAwarded: 0 };
  };

  const updateUserProfile = (name: string, instagram: string, avatarSprite?: string) => {
    setUser(prev => ({
      ...prev,
      name,
      instagram: instagram.startsWith('@') ? instagram : `@${instagram}`,
      avatarSprite: avatarSprite || prev.avatarSprite,
    }));
    soundEffects.playSuccess();
  };

  const adminGrantPack = (count = 1) => {
    setUser(prev => ({ ...prev, playerPacks: prev.playerPacks + count }));
    soundEffects.playSuccess();
  };

  const adminGrantCoins = (amount = 100) => {
    setUser(prev => ({ ...prev, managerCoins: prev.managerCoins + amount }));
    soundEffects.playSuccess();
  };

  const adminGrantXp = (amount: number, reason: string) => {
    const newXp = Math.max(0, user.xp + amount);
    const newLevelInfo = calculateLevelInfo(newXp);
    setUser(prev => ({
      ...prev,
      xp: newXp,
      level: newLevelInfo.level,
    }));
    if (amount > 0) soundEffects.playSuccess();
  };

  const adminLoginWithKey = (key: string): boolean => {
    const cleanKey = key.trim().toLowerCase();
    if (
      cleanKey === 'soto2025' ||
      cleanKey === '14krokodilo14' ||
      cleanKey === '14krokodilo14@gmail.com' ||
      cleanKey === 'admin14' ||
      cleanKey === 'sotoadmin' ||
      cleanKey === 'soto'
    ) {
      setAdminSessionUnlocked(true);
      try {
        sessionStorage.setItem('soto_admin_session', 'true');
      } catch {}
      setUser(prev => ({ ...prev, role: 'admin' }));
      soundEffects.playSuccess();
      return true;
    }
    soundEffects.playError();
    return false;
  };

  const adminLogout = () => {
    setAdminSessionUnlocked(false);
    try {
      sessionStorage.removeItem('soto_admin_session');
    } catch {}
    setUser(prev => ({ ...prev, role: 'user' }));
    soundEffects.playSuccess();
  };

  const adminSetUserStats = (stats: { xp?: number; coins?: number; packs?: number; level?: number }) => {
    setUser(prev => {
      const newXp = stats.xp !== undefined ? Math.max(0, stats.xp) : prev.xp;
      const newCoins = stats.coins !== undefined ? Math.max(0, stats.coins) : prev.managerCoins;
      const newPacks = stats.packs !== undefined ? Math.max(0, stats.packs) : prev.playerPacks;
      const newLevel = stats.level !== undefined ? Math.max(1, stats.level) : calculateLevelInfo(newXp).level;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        managerCoins: newCoins,
        playerPacks: newPacks,
      };
    });
    soundEffects.playSuccess();
  };

  const adminUnlockOrLockEntry = (entryId: string, unlock: boolean) => {
    if (unlock) {
      const entry = ibardexEntries.find(e => e.id === entryId);
      if (!entry) return;
      setIbardexEntries(prev => prev.map(e => (e.id === entryId ? { ...e, unlocked: true } : e)));
      setUser(prev => ({
        ...prev,
        unlockedEntries: Array.from(new Set([...prev.unlockedEntries, entryId])),
      }));
    } else {
      setIbardexEntries(prev => prev.map(e => (e.id === entryId ? { ...e, unlocked: false } : e)));
      setUser(prev => ({
        ...prev,
        unlockedEntries: prev.unlockedEntries.filter(id => id !== entryId),
      }));
    }
    soundEffects.playSuccess();
  };

  const adminUpdateGymStatus = (gymId: string, status: 'upcoming' | 'played', score?: string) => {
    setGyms(prev =>
      prev.map(g => {
        if (g.id === gymId) {
          return {
            ...g,
            status,
            score: score !== undefined ? score : g.score,
          };
        }
        return g;
      })
    );
    soundEffects.playSuccess();
  };

  const resetAllDatabase = async () => {
    // Clear all storage versions in localStorage
    const prefixes = [
      'ibardex_cd_soto_ibarbaso_v1',
      'ibardex_cd_soto_ibarbaso_v2',
      'ibardex_cd_soto_ibarbaso_v3',
      STORAGE_KEY,
    ];
    const suffixes = ['user', 'entries', 'gyms', 'badges', 'ranking'];
    prefixes.forEach(p => {
      suffixes.forEach(s => {
        try {
          localStorage.removeItem(`${p}_${s}`);
        } catch {}
      });
    });

    setUser(INITIAL_USER);
    setIbardexEntries(INITIAL_IBARDEX_ENTRIES);
    setGyms(INITIAL_GYMS);
    setBadges(INITIAL_BADGES);
    setRanking(INITIAL_RANKING);
    setSelectedGymId(null);
    setCurrentUnlock(null);
    setUnlockQueue([]);

    // If logged into Firebase, overwrite Firestore user document with empty state
    if (firebaseUser) {
      try {
        await saveUserProfileToFirestore({
          ...INITIAL_USER,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || INITIAL_USER.name,
          email: firebaseUser.email || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          isLoggedInWithGoogle: true,
        });
        setLastSyncedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error resetting Firestore document:', err);
      }
    }

    soundEffects.playSuccess();
  };

  const resetAllPlayers = async () => {
    setUser(prev => {
      const updated = {
        ...prev,
        unlockedEntries: [],
      };
      try {
        localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIbardexEntries(prev => {
      const updated = prev.map(e => ({
        ...e,
        unlocked: false,
        unlockedAt: undefined,
      }));
      try {
        localStorage.setItem(STORAGE_KEY + '_entries', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (firebaseUser) {
      try {
        await saveUserProfileToFirestore({
          ...user,
          unlockedEntries: [],
        });
        setLastSyncedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error resetting players in Firestore:', err);
      }
    }
    soundEffects.playSuccess();
  };

  const adminResetData = () => {
    void resetAllDatabase();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        authLoading,
        isSyncing,
        lastSyncedAt,
        ibardexEntries,
        gyms,
        badges,
        ranking,
        activeTab,
        setActiveTab,
        selectedGymId,
        setSelectedGymId,
        isScannerOpen,
        setIsScannerOpen,
        isAdminOpen,
        setIsAdminOpen,
        soundEnabled,
        toggleSound,
        unlockQueue,
        currentUnlock,
        dismissCurrentUnlock,
        loginWithGoogle,
        logoutUser,
        changeFormation,
        assignPlayerToSlot,
        autoAssignSquad,
        updateTactics,
        playSimulatedMatch,
        upgradeFacility,
        trainPlayer,
        signPlayerWithCoins,
        resetSeason,
        rewardCifrasLetrasGame,
        attendMatch,
        openPlayerPack,
        buyPackWithXp,
        buyPackWithCoins,
        scanQrCode,
        redeemSecretCode,
        updateUserProfile,
        isAdmin,
        adminLoginWithKey,
        adminLogout,
        adminGrantPack,
        adminGrantXp,
        adminGrantCoins,
        adminSetUserStats,
        adminUnlockOrLockEntry,
        adminUpdateGymStatus,
        adminResetData,
        resetAllPlayers,
        resetAllDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
