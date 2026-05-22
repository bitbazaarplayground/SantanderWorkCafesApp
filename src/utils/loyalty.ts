import type {
  LinkedAccountItem,
  MockPurchaseScenario,
  PurchaseRecord,
  RewardItem,
} from '../data/mockData';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const pointsFormatter = new Intl.NumberFormat('en-US');

const purchaseDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatPoints(points: number) {
  return pointsFormatter.format(points);
}

export function formatPointsDelta(points: number) {
  return `+${formatPoints(points)} pts`;
}

export function formatVisitCount(visits: number) {
  return visits.toString().padStart(2, '0');
}

export function formatPurchaseDate(value: string) {
  return purchaseDateFormatter.format(new Date(value));
}

export function calculatePointsEarned(
  amount: number,
  pointsMultiplier = 10,
  bonusPoints = 0,
) {
  return Math.round(amount * pointsMultiplier) + bonusPoints;
}

export function calculateRewardProgress(
  pointsBalance: number,
  rewardPointsCost: number,
) {
  const pointsRemaining = Math.max(rewardPointsCost - pointsBalance, 0);

  return {
    progress:
      rewardPointsCost === 0
        ? 0
        : Math.min(pointsBalance / rewardPointsCost, 1),
    pointsRemaining,
    unlocked: pointsRemaining === 0,
  };
}

export function getRewardStatus(pointsBalance: number, reward: RewardItem) {
  return pointsBalance >= reward.pointsCost ? 'available' : 'save-up';
}

export function getNextReward(
  pointsBalance: number,
  rewards: RewardItem[],
) {
  const sortedRewards = [...rewards].sort(
    (left, right) => left.pointsCost - right.pointsCost,
  );

  return (
    sortedRewards.find((reward) => reward.pointsCost > pointsBalance) ??
    sortedRewards[sortedRewards.length - 1] ??
    null
  );
}

export function getLinkedAccountCount(accounts: LinkedAccountItem[]) {
  return accounts.filter((account) => account.status === 'linked').length;
}

export function calculatePurchaseSummary(history: PurchaseRecord[]) {
  return history.reduce(
    (summary, purchase) => ({
      totalSpend: summary.totalSpend + purchase.amount,
      totalPoints: summary.totalPoints + purchase.pointsEarned,
      totalVisits: summary.totalVisits + 1,
    }),
    {
      totalSpend: 0,
      totalPoints: 0,
      totalVisits: 0,
    },
  );
}

export function buildDashboardMetrics({
  pointsBalance,
  visitsThisMonth,
  rewards,
  linkedAccounts,
}: {
  pointsBalance: number;
  visitsThisMonth: number;
  rewards: RewardItem[];
  linkedAccounts: LinkedAccountItem[];
}) {
  const nextReward = getNextReward(pointsBalance, rewards);

  return [
    { label: 'Points balance', value: formatPoints(pointsBalance) },
    { label: 'Visits this month', value: formatVisitCount(visitsThisMonth) },
    {
      label: 'Linked accounts',
      value: formatVisitCount(getLinkedAccountCount(linkedAccounts)),
    },
    {
      label: 'Next reward',
      value: nextReward ? nextReward.title : 'All unlocked',
    },
  ];
}

export function buildMockQrValue(memberId: string) {
  return `SANTANDER-CAFE-REWARDS:${memberId}`;
}

export function createPurchaseRecord(
  scenario: MockPurchaseScenario,
  purchasedAt = new Date(),
): PurchaseRecord {
  return {
    id: `purchase-${purchasedAt.getTime()}`,
    location: scenario.location,
    purchasedAt: purchasedAt.toISOString(),
    amount: scenario.amount,
    pointsEarned: calculatePointsEarned(
      scenario.amount,
      scenario.pointsMultiplier,
      scenario.bonusPoints,
    ),
    paymentSource: scenario.paymentSource,
    itemSummary: scenario.title,
  };
}
