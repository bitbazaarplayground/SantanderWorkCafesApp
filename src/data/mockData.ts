export interface DemoUser {
  firstName: string;
  lastName: string;
  email: string;
  memberId: string;
  tier: string;
  pointsBalance: number;
  nextReward: string;
  visitsThisMonth: number;
  favoriteStore: string;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: string;
}

export interface OfferItem {
  id: string;
  title: string;
  detail: string;
  tag: string;
}

export interface PurchaseRecord {
  id: string;
  location: string;
  purchasedAt: string;
  amount: number;
  pointsEarned: number;
  paymentSource: string;
  itemSummary: string;
}

export interface LinkedAccountItem {
  id: string;
  name: string;
  detail: string;
  status: 'linked' | 'available' | 'review';
}

export interface MockPurchaseScenario {
  id: string;
  title: string;
  location: string;
  amount: number;
  paymentSource: string;
  pointsMultiplier?: number;
  bonusPoints?: number;
  note: string;
}

export const demoUser: DemoUser = {
  firstName: 'Danielle',
  lastName: 'Roberts',
  email: 'danielle.roberts@example.com',
  memberId: 'SC-4829-117',
  tier: 'Roast Reserve',
  pointsBalance: 1240,
  nextReward: 'Breakfast pairing',
  visitsThisMonth: 8,
  favoriteStore: 'Santander Work Cafe, Soho',
};

export const rewardsCatalog: RewardItem[] = [
  {
    id: 'reward-1',
    title: 'Flat white on us',
    pointsCost: 900,
    description: 'Redeem for one handcrafted flat white at any participating cafe.',
    category: 'Drink reward',
  },
  {
    id: 'reward-2',
    title: 'Breakfast pairing',
    pointsCost: 1400,
    description: 'One pastry and one barista-made drink during the morning window.',
    category: 'Morning reward',
  },
  {
    id: 'reward-3',
    title: 'Meeting host bundle',
    pointsCost: 2200,
    description: 'A four-drink bundle for team catchups inside the cafe space.',
    category: 'Team reward',
  },
];

export const featuredOffers: OfferItem[] = [
  {
    id: 'offer-1',
    title: 'Double points before 10:30 AM',
    detail: 'Weekday morning visits earn twice the standard points for handcrafted drinks.',
    tag: 'Morning bonus',
  },
  {
    id: 'offer-2',
    title: 'Loyalty boost after five visits',
    detail: 'Unlock a one-time 150 point top-up after your fifth purchase in the month.',
    tag: 'Momentum reward',
  },
];

export const initialPurchaseHistory: PurchaseRecord[] = [
  {
    id: 'purchase-1',
    location: 'Work Cafe Soho',
    purchasedAt: '2026-05-20T09:15:00.000Z',
    amount: 8.4,
    pointsEarned: 84,
    paymentSource: 'Santander Mastercard',
    itemSummary: 'Flat white and croissant',
  },
  {
    id: 'purchase-2',
    location: 'Work Cafe Chelsea',
    purchasedAt: '2026-05-18T12:10:00.000Z',
    amount: 14.25,
    pointsEarned: 143,
    paymentSource: 'Linked debit account',
    itemSummary: 'Cold brew and salad bowl',
  },
  {
    id: 'purchase-3',
    location: 'Work Cafe Soho',
    purchasedAt: '2026-05-15T08:42:00.000Z',
    amount: 6.9,
    pointsEarned: 69,
    paymentSource: 'Santander Mastercard',
    itemSummary: 'Cappuccino',
  },
  {
    id: 'purchase-4',
    location: 'Work Cafe Tribeca',
    purchasedAt: '2026-05-11T14:05:00.000Z',
    amount: 12.8,
    pointsEarned: 128,
    paymentSource: 'Linked debit account',
    itemSummary: 'Iced latte and pastry',
  },
];

export const initialLinkedAccounts: LinkedAccountItem[] = [
  {
    id: 'account-1',
    name: 'Santander Everyday Checking',
    detail: 'Ending in 3914',
    status: 'linked',
  },
  {
    id: 'account-2',
    name: 'Santander Savings',
    detail: 'Eligible for round-up challenges',
    status: 'available',
  },
  {
    id: 'account-3',
    name: 'Santander Mastercard',
    detail: 'Requires a final in-app confirmation',
    status: 'review',
  },
];

export const mockPurchaseScenarios: MockPurchaseScenario[] = [
  {
    id: 'scan-1',
    title: 'Morning flat white',
    location: 'Santander Work Cafe, Soho',
    amount: 9.6,
    paymentSource: 'Santander Mastercard',
    note: 'Standard points applied at checkout.',
  },
  {
    id: 'scan-2',
    title: 'Lunch break cold brew',
    location: 'Santander Work Cafe, Chelsea',
    amount: 12.5,
    paymentSource: 'Linked debit account',
    bonusPoints: 20,
    note: 'Includes a lunchtime challenge bonus.',
  },
  {
    id: 'scan-3',
    title: 'Team coffee round',
    location: 'Santander Work Cafe, Tribeca',
    amount: 18.2,
    paymentSource: 'Santander Mastercard',
    bonusPoints: 30,
    note: 'Team order with a hosted meeting boost.',
  },
];
