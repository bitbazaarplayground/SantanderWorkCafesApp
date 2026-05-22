import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type FirestoreDataConverter,
} from 'firebase/firestore';

import {
  demoUser,
  initialLinkedAccounts,
  initialPurchaseHistory,
  rewardsCatalog,
  type DemoUser,
  type LinkedAccountItem,
  type MockPurchaseScenario,
  type PurchaseRecord,
  type RewardItem,
} from '../../data/mockData';
import {
  createPurchaseRecord,
  getNextReward,
} from '../../utils/loyalty';
import { firestoreDb } from './config';

export interface UserProfileDocument extends DemoUser, DocumentData {
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RewardDocument extends RewardItem, DocumentData {
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PurchaseDocument extends PurchaseRecord, DocumentData {
  createdAt?: unknown;
}

export interface AccountLinkDocument extends LinkedAccountItem, DocumentData {
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface LoyaltyTransactionDocument extends DocumentData {
  id: string;
  kind: 'purchase' | 'redemption';
  title: string;
  detail: string;
  pointsDelta: number;
  balanceAfter: number;
  purchaseId: string;
  createdAt: string;
}

export interface LoyaltyDataBundle {
  profile: UserProfileDocument;
  rewards: RewardItem[];
  purchases: PurchaseRecord[];
  accountLinks: LinkedAccountItem[];
  latestTransaction: LoyaltyTransactionDocument | null;
}

interface BuildUserProfileInput {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface SeedUserCollectionsInput {
  uid: string;
  startingBalance: number;
}

interface ApplyPurchaseInput {
  uid: string;
  scenario: MockPurchaseScenario;
  redeemRewardId?: string | null;
}

const passthroughConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (value) => value,
  fromFirestore: (snapshot) => snapshot.data() as T,
});

export const firestoreCollections = {
  users: 'users',
  purchases: 'purchases',
  rewards: 'rewards',
  transactions: 'transactions',
  accountLinks: 'accountLinks',
} as const;

export function userDocumentRef(uid: string) {
  return doc(firestoreDb, firestoreCollections.users, uid).withConverter(
    passthroughConverter<UserProfileDocument>(),
  );
}

export function userPurchasesCollectionRef(uid: string) {
  return collection(
    userDocumentRef(uid),
    firestoreCollections.purchases,
  ).withConverter(passthroughConverter<PurchaseDocument>());
}

export function userTransactionsCollectionRef(uid: string) {
  return collection(
    userDocumentRef(uid),
    firestoreCollections.transactions,
  ).withConverter(passthroughConverter<LoyaltyTransactionDocument>());
}

export function userAccountLinksCollectionRef(uid: string) {
  return collection(
    userDocumentRef(uid),
    firestoreCollections.accountLinks,
  ).withConverter(passthroughConverter<AccountLinkDocument>());
}

export function rewardsCollectionRef() {
  return collection(firestoreDb, firestoreCollections.rewards).withConverter(
    passthroughConverter<RewardDocument>(),
  );
}

function buildMemberId(uid: string) {
  const compact = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const token = compact.slice(-8).padStart(8, '0');

  return `SC-${token.slice(0, 4)}-${token.slice(4, 8)}`;
}

export function buildDefaultUserProfile({
  uid,
  email,
  firstName,
  lastName,
}: BuildUserProfileInput): UserProfileDocument {
  return {
    ...demoUser,
    firstName: firstName?.trim() || demoUser.firstName,
    lastName: lastName?.trim() || demoUser.lastName,
    email: email.trim(),
    memberId: buildMemberId(uid),
  };
}

export async function createUserProfile(input: BuildUserProfileInput) {
  const profile = buildDefaultUserProfile(input);

  await setDoc(
    userDocumentRef(input.uid),
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export async function getUserProfile(uid: string) {
  const snapshot = await getDoc(userDocumentRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function ensureUserProfile(input: BuildUserProfileInput) {
  const existingProfile = await getUserProfile(input.uid);

  if (existingProfile) {
    return existingProfile;
  }

  return createUserProfile(input);
}

async function seedRewardsCollection() {
  const rewardsSnapshot = await getDocs(rewardsCollectionRef());

  if (!rewardsSnapshot.empty) {
    return;
  }

  const batch = writeBatch(firestoreDb);

  rewardsCatalog.forEach((reward, index) => {
    const rewardRef = doc(rewardsCollectionRef(), reward.id);

    batch.set(
      rewardRef,
      {
        ...reward,
        sortOrder: index + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function seedUserPurchasesCollection({ uid }: SeedUserCollectionsInput) {
  const purchasesSnapshot = await getDocs(userPurchasesCollectionRef(uid));

  if (!purchasesSnapshot.empty) {
    return;
  }

  const batch = writeBatch(firestoreDb);

  initialPurchaseHistory.forEach((purchase) => {
    const purchaseRef = doc(userPurchasesCollectionRef(uid), purchase.id);

    batch.set(
      purchaseRef,
      {
        ...purchase,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function seedUserTransactionsCollection({
  uid,
  startingBalance,
}: SeedUserCollectionsInput) {
  const transactionsSnapshot = await getDocs(userTransactionsCollectionRef(uid));

  if (!transactionsSnapshot.empty) {
    return;
  }

  const batch = writeBatch(firestoreDb);
  const chronologicalPurchases = [...initialPurchaseHistory].sort(
    (left, right) =>
      new Date(left.purchasedAt).getTime() - new Date(right.purchasedAt).getTime(),
  );
  const openingBalance =
    startingBalance -
    chronologicalPurchases.reduce(
      (totalPoints, purchase) => totalPoints + purchase.pointsEarned,
      0,
    );
  let runningBalance = openingBalance;

  chronologicalPurchases.forEach((purchase) => {
    runningBalance += purchase.pointsEarned;

    const transactionRef = doc(userTransactionsCollectionRef(uid), purchase.id);

    batch.set(
      transactionRef,
      {
        id: transactionRef.id,
        kind: 'purchase',
        title: `Purchase at ${purchase.location}`,
        detail: `${purchase.itemSummary} awarded ${purchase.pointsEarned} points`,
        pointsDelta: purchase.pointsEarned,
        balanceAfter: runningBalance,
        purchaseId: purchase.id,
        createdAt: purchase.purchasedAt,
      } satisfies LoyaltyTransactionDocument,
      { merge: true },
    );
  });

  await batch.commit();
}

async function seedUserAccountLinksCollection({ uid }: SeedUserCollectionsInput) {
  const linksSnapshot = await getDocs(userAccountLinksCollectionRef(uid));

  if (!linksSnapshot.empty) {
    return;
  }

  const batch = writeBatch(firestoreDb);

  initialLinkedAccounts.forEach((accountLink, index) => {
    const linkRef = doc(userAccountLinksCollectionRef(uid), accountLink.id);

    batch.set(
      linkRef,
      {
        ...accountLink,
        sortOrder: index + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
}

export async function ensureDemoLoyaltyData({
  uid,
  startingBalance,
}: SeedUserCollectionsInput) {
  await Promise.all([
    seedRewardsCollection(),
    seedUserPurchasesCollection({ uid, startingBalance }),
    seedUserTransactionsCollection({ uid, startingBalance }),
    seedUserAccountLinksCollection({ uid, startingBalance }),
  ]);
}

export async function getRewards() {
  const rewardsSnapshot = await getDocs(
    query(rewardsCollectionRef(), orderBy('sortOrder', 'asc')),
  );

  return rewardsSnapshot.docs.map((snapshot) => {
    const reward = snapshot.data();

    return {
      id: snapshot.id,
      title: reward.title,
      pointsCost: reward.pointsCost,
      description: reward.description,
      category: reward.category,
    } satisfies RewardItem;
  });
}

export async function getUserPurchases(uid: string) {
  const purchasesSnapshot = await getDocs(
    query(userPurchasesCollectionRef(uid), orderBy('purchasedAt', 'desc')),
  );

  return purchasesSnapshot.docs.map((snapshot) => snapshot.data());
}

export async function getUserAccountLinks(uid: string) {
  const linksSnapshot = await getDocs(
    query(userAccountLinksCollectionRef(uid), orderBy('sortOrder', 'asc')),
  );

  return linksSnapshot.docs.map((snapshot) => {
    const link = snapshot.data();

    return {
      id: snapshot.id,
      name: link.name,
      detail: link.detail,
      status: link.status,
    } satisfies LinkedAccountItem;
  });
}

export async function getLatestTransaction(uid: string) {
  const transactionSnapshot = await getDocs(
    query(userTransactionsCollectionRef(uid), orderBy('createdAt', 'desc')),
  );

  if (transactionSnapshot.empty) {
    return null;
  }

  return transactionSnapshot.docs[0].data();
}

export async function loadUserLoyaltyData(input: BuildUserProfileInput) {
  const profile = await ensureUserProfile(input);
  await ensureDemoLoyaltyData({
    uid: input.uid,
    startingBalance: profile.pointsBalance,
  });

  const [rewards, purchases, accountLinks, latestTransaction] =
    await Promise.all([
      getRewards(),
      getUserPurchases(input.uid),
      getUserAccountLinks(input.uid),
      getLatestTransaction(input.uid),
    ]);

  return {
    profile,
    rewards,
    purchases,
    accountLinks,
    latestTransaction,
  } satisfies LoyaltyDataBundle;
}

function getNextAccountLinkStatus(status: LinkedAccountItem['status']) {
  if (status === 'available') {
    return {
      status: 'review' as const,
      detail: 'Link request captured for secure review',
    };
  }

  if (status === 'review') {
    return {
      status: 'linked' as const,
      detail: 'Linked and ready to power loyalty benefits',
    };
  }

  return {
    status: 'linked' as const,
    detail: 'Linked and ready to power loyalty benefits',
  };
}

export async function advanceAccountLinkStatus(uid: string, accountId: string) {
  const accountRef = doc(userAccountLinksCollectionRef(uid), accountId);
  const accountSnapshot = await getDoc(accountRef);

  if (!accountSnapshot.exists()) {
    throw new Error('Unable to find that account link right now.');
  }

  const account = accountSnapshot.data();
  const nextState = getNextAccountLinkStatus(account.status);

  await updateDoc(accountRef, {
    ...nextState,
    updatedAt: serverTimestamp(),
  });

  return {
    ...account,
    ...nextState,
  } satisfies LinkedAccountItem;
}

export async function applySimulatedPurchase({
  uid,
  scenario,
  redeemRewardId,
}: ApplyPurchaseInput) {
  return runTransaction(firestoreDb, async (transaction) => {
    const userRef = userDocumentRef(uid);
    const userSnapshot = await transaction.get(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('Your loyalty profile is not ready yet.');
    }

    const currentUser = userSnapshot.data();
    const purchaseRecord = createPurchaseRecord(scenario);
    const purchaseRef = doc(userPurchasesCollectionRef(uid), purchaseRecord.id);
    const purchaseTransactionRef = doc(userTransactionsCollectionRef(uid));
    const rewardToRedeem = redeemRewardId
      ? rewardsCatalog.find((reward) => reward.id === redeemRewardId) ?? null
      : null;

    if (redeemRewardId && !rewardToRedeem) {
      throw new Error('The selected reward is not available right now.');
    }

    if (
      rewardToRedeem &&
      currentUser.pointsBalance < rewardToRedeem.pointsCost
    ) {
      throw new Error('You do not have enough points to redeem this reward.');
    }

    const balanceAfterRedemption = rewardToRedeem
      ? currentUser.pointsBalance - rewardToRedeem.pointsCost
      : currentUser.pointsBalance;
    const finalBalance = balanceAfterRedemption + purchaseRecord.pointsEarned;
    const nextReward =
      getNextReward(finalBalance, rewardsCatalog)?.title || currentUser.nextReward;

    transaction.set(
      purchaseRef,
      {
        ...purchaseRecord,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (rewardToRedeem) {
      const redemptionTransactionRef = doc(userTransactionsCollectionRef(uid));

      transaction.set(
        redemptionTransactionRef,
        {
          id: redemptionTransactionRef.id,
          kind: 'redemption',
          title: `Reward redeemed: ${rewardToRedeem.title}`,
          detail: `${rewardToRedeem.pointsCost} points were used before checkout.`,
          pointsDelta: -rewardToRedeem.pointsCost,
          balanceAfter: balanceAfterRedemption,
          purchaseId: purchaseRecord.id,
          createdAt: purchaseRecord.purchasedAt,
        } satisfies LoyaltyTransactionDocument,
        { merge: true },
      );
    }

    transaction.set(
      purchaseTransactionRef,
      {
        id: purchaseTransactionRef.id,
        kind: 'purchase',
        title: `Purchase at ${scenario.location}`,
        detail: `${purchaseRecord.itemSummary} awarded ${purchaseRecord.pointsEarned} points`,
        pointsDelta: purchaseRecord.pointsEarned,
        balanceAfter: finalBalance,
        purchaseId: purchaseRecord.id,
        createdAt: purchaseRecord.purchasedAt,
      } satisfies LoyaltyTransactionDocument,
      { merge: true },
    );

    transaction.update(userRef, {
      pointsBalance: finalBalance,
      visitsThisMonth: currentUser.visitsThisMonth + 1,
      nextReward,
      updatedAt: serverTimestamp(),
    });

    return {
      purchase: purchaseRecord,
      balanceAfter: finalBalance,
      pointsAwarded: purchaseRecord.pointsEarned,
      pointsRedeemed: rewardToRedeem?.pointsCost ?? 0,
      rewardRedeemedTitle: rewardToRedeem?.title ?? null,
      nextReward,
    };
  });
}

export function getFriendlyFirestoreErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error
      ? error.message
      : 'We could not load loyalty data right now.';
  }

  switch (error.code) {
    case 'permission-denied':
      return 'Firestore permission was denied. Check your rules or signed-in user.';
    case 'unavailable':
      return 'Firestore is temporarily unavailable. Please try again.';
    case 'not-found':
      return 'The requested Firestore document could not be found.';
    default:
      return 'We could not complete the Firestore request right now.';
  }
}

export function toDemoUser(profile: Partial<UserProfileDocument>): DemoUser {
  return {
    ...demoUser,
    ...profile,
    email: profile.email ?? demoUser.email,
  };
}
