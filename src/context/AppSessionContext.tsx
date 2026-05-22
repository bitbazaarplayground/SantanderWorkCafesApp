import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  demoUser,
  mockPurchaseScenarios,
  type DemoUser,
  type LinkedAccountItem,
  type PurchaseRecord,
  type RewardItem,
} from '../data/mockData';
import {
  applySimulatedPurchase,
  advanceAccountLinkStatus,
  createUserProfile,
  ensureUserProfile,
  getFriendlyFirestoreErrorMessage,
  getFriendlyAuthErrorMessage,
  loadUserLoyaltyData,
  observeAuthState,
  registerWithEmailPassword,
  refreshCurrentUser,
  sendPasswordRecoveryEmail,
  sendVerificationEmail,
  signInWithEmailPassword,
  signOutCurrentUser,
  toDemoUser,
} from '../lib/firebase';

interface SignInInput {
  email: string;
  password: string;
}

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface MockPurchaseResult {
  record: PurchaseRecord;
  pointsAwarded: number;
  pointsRedeemed: number;
  rewardRedeemedTitle: string | null;
  newBalance: number;
}

interface StatusMessage {
  tone: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface AppSessionContextValue {
  authReady: boolean;
  loyaltyReady: boolean;
  isAuthenticated: boolean;
  isLoyaltyLoading: boolean;
  isProcessingPurchase: boolean;
  isUpdatingAccountLink: boolean;
  loyaltyError: string;
  statusMessage: StatusMessage | null;
  user: DemoUser;
  rewards: RewardItem[];
  purchaseHistory: PurchaseRecord[];
  linkedAccounts: LinkedAccountItem[];
  linkedAccountCount: number;
  lastPurchase: PurchaseRecord | null;
  signIn: (input: SignInInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshLoyaltyData: () => Promise<void>;
  dismissStatusMessage: () => void;
  cycleLinkedAccountStatus: (accountId: string) => Promise<void>;
  completeMockPurchase: (
    scenarioId: string,
    options?: { redeemRewardId?: string | null },
  ) => Promise<MockPurchaseResult | null>;
}

interface ActiveAuthUser {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

const AppSessionContext = createContext<AppSessionContextValue | undefined>(
  undefined,
);

function buildProfileNameSeed(email: string) {
  const localPart = email.split('@')[0] || '';
  const segments = localPart
    .split(/[.\-_]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return {
    firstName: segments[0]
      ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
      : demoUser.firstName,
    lastName: segments[1]
      ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
      : demoUser.lastName,
  };
}

export function AppSessionProvider({ children }: PropsWithChildren) {
  const [authReady, setAuthReady] = useState(false);
  const [loyaltyReady, setLoyaltyReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoyaltyLoading, setIsLoyaltyLoading] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [isUpdatingAccountLink, setIsUpdatingAccountLink] = useState(false);
  const [loyaltyError, setLoyaltyError] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [activeAuthUser, setActiveAuthUser] = useState<ActiveAuthUser | null>(null);
  const [user, setUser] = useState<DemoUser>(demoUser);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountItem[]>([]);
  const [lastPurchase, setLastPurchase] = useState<PurchaseRecord | null>(null);

  function resetLoyaltyState(nextUser = demoUser) {
    setUser(nextUser);
    setRewards([]);
    setPurchaseHistory([]);
    setLinkedAccounts([]);
    setLastPurchase(null);
    setLoyaltyError('');
    setStatusMessage(null);
    setIsProcessingPurchase(false);
    setIsUpdatingAccountLink(false);
  }

  async function hydrateLoyaltyData(
    authUser: ActiveAuthUser,
    options?: {
      initial?: boolean;
      message?: StatusMessage | null;
    },
  ) {
    const isInitial = options?.initial ?? false;

    if (isInitial) {
      setLoyaltyReady(false);
    }

    setIsLoyaltyLoading(true);
    setLoyaltyError('');

    try {
      const loyaltyData = await loadUserLoyaltyData(authUser);

      setUser(toDemoUser(loyaltyData.profile));
      setRewards(loyaltyData.rewards);
      setPurchaseHistory(loyaltyData.purchases);
      setLinkedAccounts(loyaltyData.accountLinks);
      setLastPurchase(loyaltyData.purchases[0] ?? null);

      if (options?.message) {
        setStatusMessage(options.message);
      }
    } catch (error) {
      setUser(
        toDemoUser({
          email: authUser.email,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
        }),
      );
      setRewards([]);
      setPurchaseHistory([]);
      setLinkedAccounts([]);
      setLastPurchase(null);
      setLoyaltyError(getFriendlyFirestoreErrorMessage(error));
    } finally {
      setLoyaltyReady(true);
      setIsLoyaltyLoading(false);
      setAuthReady(true);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = observeAuthState(async (firebaseUser) => {
      if (!isMounted) {
        return;
      }

      if (!firebaseUser) {
        setActiveAuthUser(null);
        resetLoyaltyState(demoUser);
        setLoyaltyReady(false);
        setIsAuthenticated(false);
        setAuthReady(true);
        return;
      }

      const email = firebaseUser.email?.trim() || demoUser.email;
      const seededNames = buildProfileNameSeed(email);
      const nextAuthUser = {
        uid: firebaseUser.uid,
        email,
        firstName: seededNames.firstName,
        lastName: seededNames.lastName,
      } satisfies ActiveAuthUser;

      setActiveAuthUser(nextAuthUser);
      setIsAuthenticated(true);

      try {
        await ensureUserProfile(nextAuthUser);
      } catch {
        // We still continue into the main loyalty load so the app can render an error state.
      }

      if (!isMounted) {
        return;
      }

      await hydrateLoyaltyData(nextAuthUser, { initial: true });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function signIn(input: SignInInput) {
    try {
      const credentials = await signInWithEmailPassword(
        input.email.trim(),
        input.password,
      );
      const refreshedUser = await refreshCurrentUser();
      const verifiedUser = refreshedUser ?? credentials.user;

      if (!verifiedUser.emailVerified) {
        await signOutCurrentUser();
        throw new Error('Please verify your email before signing in.');
      }
    } catch (error) {
      throw new Error(getFriendlyAuthErrorMessage(error));
    }
  }

  async function register(input: RegisterInput) {
    try {
      const credentials = await registerWithEmailPassword(
        input.email.trim(),
        input.password,
      );

      await createUserProfile({
        uid: credentials.user.uid,
        email: credentials.user.email?.trim() || input.email.trim(),
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await sendVerificationEmail();
      await signOutCurrentUser();
    } catch (error) {
      throw new Error(getFriendlyAuthErrorMessage(error));
    }
  }

  async function recoverPassword(email: string) {
    try {
      await sendPasswordRecoveryEmail(email.trim());
    } catch (error) {
      throw new Error(getFriendlyAuthErrorMessage(error));
    }
  }

  async function signOut() {
    try {
      await signOutCurrentUser();
    } catch (error) {
      throw new Error(getFriendlyAuthErrorMessage(error));
    }
  }

  async function refreshLoyaltyData() {
    if (!activeAuthUser) {
      return;
    }

    await hydrateLoyaltyData(activeAuthUser);
  }

  function dismissStatusMessage() {
    setStatusMessage(null);
  }

  async function cycleLinkedAccountStatus(accountId: string) {
    if (!activeAuthUser) {
      return;
    }

    try {
      setIsUpdatingAccountLink(true);
      const updatedAccount = await advanceAccountLinkStatus(
        activeAuthUser.uid,
        accountId,
      );

      setLinkedAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === accountId ? updatedAccount : account,
        ),
      );

      setStatusMessage({
        tone: 'success',
        title: 'Account link updated',
        message: `${updatedAccount.name} is now marked as ${updatedAccount.status.replace('-', ' ')}.`,
      });
    } catch (error) {
      setStatusMessage({
        tone: 'error',
        title: 'Unable to update account link',
        message: getFriendlyFirestoreErrorMessage(error),
      });
    } finally {
      setIsUpdatingAccountLink(false);
    }
  }

  async function completeMockPurchase(
    scenarioId: string,
    options?: { redeemRewardId?: string | null },
  ) {
    if (!activeAuthUser) {
      return null;
    }

    const scenario = mockPurchaseScenarios.find(
      (purchaseScenario) => purchaseScenario.id === scenarioId,
    );

    if (!scenario) {
      return null;
    }

    try {
      setIsProcessingPurchase(true);
      const result = await applySimulatedPurchase({
        uid: activeAuthUser.uid,
        scenario,
        redeemRewardId: options?.redeemRewardId,
      });

      await hydrateLoyaltyData(activeAuthUser, {
        message: {
          tone: 'success',
          title: 'Purchase captured',
          message: result.rewardRedeemedTitle
            ? `${result.rewardRedeemedTitle} was redeemed and ${result.purchase.pointsEarned} points were added after ${scenario.title.toLowerCase()}.`
            : `${result.purchase.pointsEarned} points were added after ${scenario.title.toLowerCase()}.`,
        },
      });

      return {
        record: result.purchase,
        pointsAwarded: result.pointsAwarded,
        pointsRedeemed: result.pointsRedeemed,
        rewardRedeemedTitle: result.rewardRedeemedTitle,
        newBalance: result.balanceAfter,
      };
    } catch (error) {
      setStatusMessage({
        tone: 'error',
        title: 'Purchase update failed',
        message: getFriendlyFirestoreErrorMessage(error),
      });
      return null;
    } finally {
      setIsProcessingPurchase(false);
    }
  }

  return (
    <AppSessionContext.Provider
      value={{
        authReady,
        loyaltyReady,
        isAuthenticated,
        isLoyaltyLoading,
        isProcessingPurchase,
        isUpdatingAccountLink,
        loyaltyError,
        statusMessage,
        user,
        rewards,
        purchaseHistory,
        linkedAccounts,
        linkedAccountCount: linkedAccounts.filter(
          (account) => account.status === 'linked',
        ).length,
        lastPurchase,
        signIn,
        register,
        recoverPassword,
        signOut,
        refreshLoyaltyData,
        dismissStatusMessage,
        cycleLinkedAccountStatus,
        completeMockPurchase,
      }}
    >
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error('useAppSession must be used within AppSessionProvider');
  }

  return context;
}
