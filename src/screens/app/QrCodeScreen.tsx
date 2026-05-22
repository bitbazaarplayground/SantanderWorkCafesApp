import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  LoadingStateCard,
  QrCodePlaceholder,
  ScreenContainer,
  SectionHeader,
  StatusBanner,
} from '../../components';
import { colors, radii, spacing, typography } from '../../constants';
import { useAppSession } from '../../context/AppSessionContext';
import { mockPurchaseScenarios } from '../../data/mockData';
import type { MainTabScreenProps } from '../../navigation/types';
import {
  buildMockQrValue,
  calculatePointsEarned,
  formatCurrency,
  formatPoints,
  formatPointsDelta,
} from '../../utils/loyalty';

export function QrCodeScreen({ navigation }: MainTabScreenProps<'QrTab'>) {
  const {
    user,
    rewards,
    completeMockPurchase,
    isProcessingPurchase,
    loyaltyReady,
    isLoyaltyLoading,
    loyaltyError,
    refreshLoyaltyData,
    statusMessage,
    dismissStatusMessage,
  } = useAppSession();
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    mockPurchaseScenarios[0].id,
  );
  const [visitMode, setVisitMode] = useState<'earn' | 'redeem'>('earn');
  const [scanStage, setScanStage] = useState<'idle' | 'scanned' | 'completed'>(
    'idle',
  );
  const [lastAwardedPoints, setLastAwardedPoints] = useState<number | null>(null);
  const [lastRedeemedRewardTitle, setLastRedeemedRewardTitle] = useState<string | null>(null);
  const [lastRedeemedPoints, setLastRedeemedPoints] = useState(0);

  const selectedScenario =
    mockPurchaseScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    mockPurchaseScenarios[0];
  const coffeeReward = rewards.find((reward) => reward.id === 'reward-1') ?? null;
  const canRedeemCoffee =
    coffeeReward ? user.pointsBalance >= coffeeReward.pointsCost : false;

  function handleSimulateScan() {
    setScanStage('scanned');
  }

  const isInitialLoad = !loyaltyReady || isLoyaltyLoading;

  async function handleCompletePurchase() {
    const result = await completeMockPurchase(selectedScenario.id, {
      redeemRewardId:
        visitMode === 'redeem' && canRedeemCoffee && coffeeReward
          ? coffeeReward.id
          : null,
    });

    if (!result) {
      return;
    }

    setLastAwardedPoints(result.pointsAwarded);
    setLastRedeemedRewardTitle(result.rewardRedeemedTitle);
    setLastRedeemedPoints(result.pointsRedeemed);
    setScanStage('completed');
  }

  function handleSelectScenario(scenarioId: string) {
    setSelectedScenarioId(scenarioId);
    setScanStage('idle');
    setLastAwardedPoints(null);
  }

  function handleResetDemo() {
    setScanStage('idle');
    setLastAwardedPoints(null);
    setLastRedeemedRewardTitle(null);
    setLastRedeemedPoints(0);
  }

  function handleSelectVisitMode(mode: 'earn' | 'redeem') {
    setVisitMode(mode);
    setScanStage('idle');
    setLastAwardedPoints(null);
    setLastRedeemedRewardTitle(null);
    setLastRedeemedPoints(0);
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Member QR"
        title="Scan once, earn instantly"
        subtitle="This screen now runs a full demo flow from QR display to a Firestore-backed points update."
      />

      {loyaltyError ? (
        <StatusBanner
          tone="error"
          title="QR loyalty data is out of sync"
          message={loyaltyError}
        >
          <Button title="Reload data" variant="ghost" onPress={refreshLoyaltyData} />
        </StatusBanner>
      ) : null}

      {statusMessage?.tone === 'error' ? (
        <StatusBanner
          tone="error"
          title={statusMessage.title}
          message={statusMessage.message}
        >
          <Button title="Dismiss" variant="ghost" onPress={dismissStatusMessage} />
        </StatusBanner>
      ) : null}

      {isInitialLoad ? (
        <LoadingStateCard
          title="Preparing your member QR"
          description="Loading your Firestore-backed loyalty profile before we simulate the next cafe scan."
        />
      ) : null}

      {!isInitialLoad ? (
        <>
      <Card variant="elevated" style={styles.qrCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Member ID</Text>
          <Text style={styles.badgeValue}>{user.memberId}</Text>
          <Text style={styles.badgeCode}>{buildMockQrValue(user.memberId)}</Text>
        </View>

        <View style={styles.qrShell}>
          <QrCodePlaceholder />
        </View>

        <Text style={styles.scanTitle}>Ready for checkout scanning</Text>
        <Text style={styles.scanCopy}>
          Present this screen when ordering to attach points, rewards eligibility,
          and visit history to your account.
        </Text>

        <View style={styles.modeSelector}>
          <Pressable
            onPress={() => handleSelectVisitMode('earn')}
            style={({ pressed }) => [
              styles.modeCard,
              visitMode === 'earn' ? styles.modeCardSelected : undefined,
              pressed ? styles.modeCardPressed : undefined,
            ]}
          >
            <Text style={styles.modeTitle}>Earn points only</Text>
            <Text style={styles.modeCopy}>
              Keep your visit simple and add points without using any rewards.
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSelectVisitMode('redeem')}
            style={({ pressed }) => [
              styles.modeCard,
              visitMode === 'redeem' ? styles.modeCardSelected : undefined,
              !canRedeemCoffee ? styles.modeCardDisabled : undefined,
              pressed ? styles.modeCardPressed : undefined,
            ]}
          >
            <Text style={styles.modeTitle}>
              Redeem coffee reward
            </Text>
            <Text style={styles.modeCopy}>
              {coffeeReward
                ? canRedeemCoffee
                  ? `Use ${coffeeReward.pointsCost} points for ${coffeeReward.title.toLowerCase()}.`
                  : `${coffeeReward.title} unlocks at ${coffeeReward.pointsCost} points.`
                : 'Reward options are loading.'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.scenarioList}>
          {mockPurchaseScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            const awardedPoints = calculatePointsEarned(
              scenario.amount,
              scenario.pointsMultiplier,
              scenario.bonusPoints,
            );

            return (
              <Pressable
                key={scenario.id}
                onPress={() => handleSelectScenario(scenario.id)}
                style={({ pressed }) => [
                  styles.scenarioCard,
                  isSelected ? styles.scenarioCardSelected : undefined,
                  pressed ? styles.scenarioCardPressed : undefined,
                ]}
                disabled={isProcessingPurchase}
              >
                <View style={styles.scenarioTop}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  <Text style={styles.scenarioAmount}>
                    {formatCurrency(scenario.amount)}
                  </Text>
                </View>
                <Text style={styles.scenarioLocation}>{scenario.location}</Text>
                <Text style={styles.scenarioMeta}>
                  {formatPointsDelta(awardedPoints)} • {scenario.paymentSource}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Card variant="outline" style={styles.scanFlowCard}>
          <Text style={styles.scanFlowTitle}>Demo scan flow</Text>
          <Text style={styles.scanFlowCopy}>
            {scanStage === 'idle'
              ? 'Step 1: simulate a cafe staff scan to validate the member QR.'
              : scanStage === 'scanned'
                ? visitMode === 'redeem'
                  ? 'Step 2: complete checkout to redeem your selected reward and update your balance.'
                  : 'Step 2: complete the mock purchase to award points and write a new purchase into history.'
                : 'Scan complete. Your updated balance is already reflected in the dashboard and rewards view.'}
          </Text>
          <Text style={styles.scanFlowNote}>
            {visitMode === 'redeem' && coffeeReward && canRedeemCoffee
              ? `${selectedScenario.note} ${coffeeReward.title} will also be redeemed on this visit.`
              : selectedScenario.note}
          </Text>

          <View style={styles.scanActionGroup}>
            {scanStage === 'idle' ? (
              <Button
                title={isProcessingPurchase ? 'Preparing...' : 'Simulate cafe staff scan'}
                fullWidth
                disabled={isProcessingPurchase}
                onPress={handleSimulateScan}
              />
            ) : null}

            {scanStage === 'scanned' ? (
              <Button
                title={
                  isProcessingPurchase
                    ? 'Updating Firestore...'
                    : visitMode === 'redeem' && coffeeReward && canRedeemCoffee
                      ? `Redeem ${coffeeReward.title} and add ${formatPoints(calculatePointsEarned(selectedScenario.amount, selectedScenario.pointsMultiplier, selectedScenario.bonusPoints))} pts`
                      : `Complete purchase and add ${formatPoints(calculatePointsEarned(selectedScenario.amount, selectedScenario.pointsMultiplier, selectedScenario.bonusPoints))} pts`
                }
                fullWidth
                disabled={
                  isProcessingPurchase ||
                  (visitMode === 'redeem' && !canRedeemCoffee)
                }
                onPress={() => {
                  void handleCompletePurchase();
                }}
              />
            ) : null}

            {scanStage === 'completed' ? (
              <>
                <Card variant="tint" style={styles.successCard}>
                  <Text style={styles.successTitle}>
                    {lastRedeemedRewardTitle
                      ? `${lastRedeemedRewardTitle} redeemed`
                      : lastAwardedPoints
                        ? formatPointsDelta(lastAwardedPoints)
                        : ''}
                  </Text>
                  <Text style={styles.successCopy}>
                    {lastRedeemedRewardTitle
                      ? `${lastRedeemedRewardTitle} used ${formatPoints(lastRedeemedPoints)} points, and ${selectedScenario.title.toLowerCase()} still added ${formatPoints(lastAwardedPoints ?? 0)} points to your balance.`
                      : `${selectedScenario.title} has been added to your mock purchase history, and your balance now reflects ${formatPoints(user.pointsBalance)} points.`}
                  </Text>
                </Card>
                <Button
                  title="View updated dashboard"
                  fullWidth
                  onPress={() => navigation.navigate('HomeTab')}
                />
                <Button
                  title="Run another demo scan"
                  fullWidth
                  variant="ghost"
                  disabled={isProcessingPurchase}
                  onPress={handleResetDemo}
                />
              </>
            ) : null}
          </View>
        </Card>

        <Button
          title="View purchase history"
          fullWidth
          variant="ghost"
          onPress={() => navigation.navigate('HistoryTab')}
        />
      </Card>
        </>
      ) : null}

      <Card variant="tint" style={styles.infoCard}>
        <Text style={styles.infoTitle}>Security note</Text>
        <Text style={styles.infoCopy}>
          This MVP still uses a styled placeholder code, but the loyalty flow
          around it now persists in Firestore so the demo behaves like a connected app.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  qrCard: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  badge: {
    alignSelf: 'stretch',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brandRedSoft,
  },
  badgeLabel: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badgeValue: {
    marginTop: 4,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  badgeCode: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  qrShell: {
    width: '100%',
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.canvasAlt,
    alignItems: 'center',
  },
  scanTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    textAlign: 'center',
  },
  scanCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
  scenarioList: {
    width: '100%',
    gap: spacing.sm,
  },
  modeSelector: {
    width: '100%',
    gap: spacing.sm,
  },
  modeCard: {
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  modeCardSelected: {
    borderColor: colors.brandRed,
    backgroundColor: colors.brandRedSoft,
  },
  modeCardDisabled: {
    opacity: 0.68,
  },
  modeCardPressed: {
    opacity: 0.82,
  },
  modeTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  modeCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  scenarioCard: {
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  scenarioCardSelected: {
    borderColor: colors.brandRed,
    backgroundColor: colors.brandRedSoft,
  },
  scenarioCardPressed: {
    opacity: 0.82,
  },
  scenarioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scenarioTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  scenarioAmount: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  scenarioLocation: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  scenarioMeta: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  scanFlowCard: {
    width: '100%',
    gap: spacing.md,
  },
  scanFlowTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  scanFlowCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  scanFlowNote: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  scanActionGroup: {
    gap: spacing.sm,
  },
  successCard: {
    gap: spacing.xs,
  },
  successTitle: {
    color: colors.accentGreen,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    textAlign: 'center',
  },
  successCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
  infoCard: {
    gap: spacing.xs,
  },
  infoTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  infoCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
});
