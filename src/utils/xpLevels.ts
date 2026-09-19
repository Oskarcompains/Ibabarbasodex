export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

export const LEVEL_TIERS: LevelInfo[] = [
  { level: 1, title: 'Novato de Grada', minXp: 0, maxXp: 50, badge: '🔴' },
  { level: 2, title: 'Aficionado Fiel', minXp: 50, maxXp: 120, badge: '⚽' },
  { level: 3, title: 'Ultra de Ibarbaso', minXp: 120, maxXp: 220, badge: '🔥' },
  { level: 4, title: 'Veterano del Soto', minXp: 220, maxXp: 350, badge: '⚡' },
  { level: 5, title: 'Maestro de la Banda', minXp: 350, maxXp: 520, badge: '🛡️' },
  { level: 6, title: 'Capitán de Hinchada', minXp: 520, maxXp: 720, badge: '🏆' },
  { level: 7, title: 'Leyenda Roja y Negra', minXp: 720, maxXp: 980, badge: '👑' },
  { level: 8, title: 'Gran Campeón Soto', minXp: 980, maxXp: 1300, badge: '🌟' },
  { level: 9, title: 'Mítico Ibarbaso', minXp: 1300, maxXp: 1700, badge: '💎' },
  { level: 10, title: 'Héroe Inmortal', minXp: 1700, maxXp: 99999, badge: '⚜️' },
];

export function calculateLevelInfo(totalXp: number) {
  let currentTier = LEVEL_TIERS[0];

  for (const tier of LEVEL_TIERS) {
    if (totalXp >= tier.minXp) {
      currentTier = tier;
    } else {
      break;
    }
  }

  const xpInCurrentTier = Math.max(0, totalXp - currentTier.minXp);
  const tierSpan = currentTier.maxXp - currentTier.minXp;
  const progressPercent = currentTier.level === 10 ? 100 : Math.min(100, Math.round((xpInCurrentTier / tierSpan) * 100));
  const xpNeededForNext = currentTier.level === 10 ? 0 : Math.max(0, currentTier.maxXp - totalXp);

  return {
    level: currentTier.level,
    title: currentTier.title,
    badge: currentTier.badge,
    totalXp,
    currentTierMin: currentTier.minXp,
    currentTierMax: currentTier.maxXp,
    xpInCurrentTier,
    tierSpan,
    progressPercent,
    xpNeededForNext,
    nextTier: LEVEL_TIERS.find(t => t.level === currentTier.level + 1) || null,
  };
}
