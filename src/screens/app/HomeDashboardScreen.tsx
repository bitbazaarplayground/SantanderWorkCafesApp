import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BrandLogo,
  Button,
  Card,
  EmptyStateCard,
  ListRow,
  LoadingStateCard,
  ProgressBar,
  ScreenContainer,
  StatusBanner,
} from '../../components';
import { colors, radii, spacing, typography } from '../../constants';
import { useAppSession } from '../../context/AppSessionContext';
import { featuredOffers } from '../../data/mockData';
import type { MainTabScreenProps } from '../../navigation/types';
import {
  calculateRewardProgress,
  formatCurrency,
  formatPoints,
  formatPointsDelta,
  formatPurchaseDate,
  getLinkedAccountCount,
  getNextReward,
} from '../../utils/loyalty';

const earnWays = [
  {
    icon: 'credit-card-outline' as const,
    title: '1 point per $1',
    subtitle: 'On linked card purchases across Santander Work Cafe.',
  },
  {
    icon: 'star-four-points-outline' as const,
    title: 'Extra points',
    subtitle: 'From offers, linked products, and featured reward campaigns.',
  },
  {
    icon: 'link-variant' as const,
    title: 'Unlock more',
    subtitle: 'Link Santander accounts to open more loyalty benefits.',
  },
] as const;

const activityIcons = [
  'coffee-outline',
  'bank-outline',
  'gift-outline',
] as const;

export function HomeDashboardScreen({
  navigation,
}: MainTabScreenProps<'HomeTab'>) {
  const {
    user,
    rewards,
    purchaseHistory,
    linkedAccounts,
    loyaltyReady,
    isLoyaltyLoading,
    loyaltyError,
    statusMessage,
    dismissStatusMessage,
    refreshLoyaltyData,
  } = useAppSession();
  const linkedAccountCount = getLinkedAccountCount(linkedAccounts);
  const nextReward = getNextReward(user.pointsBalance, rewards);
  const rewardProgress = nextReward
    ? calculateRewardProgress(user.pointsBalance, nextReward.pointsCost)
    : null;
  const recentPurchases = purchaseHistory.slice(0, 3);
  const isInitialLoad =
    !loyaltyReady || (isLoyaltyLoading && purchaseHistory.length === 0);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {statusMessage ? (
        <StatusBanner
          tone={statusMessage.tone}
          title={statusMessage.title}
          message={statusMessage.message}
        >
          <Button title="Dismiss" variant="ghost" onPress={dismissStatusMessage} />
        </StatusBanner>
      ) : null}

      {loyaltyError ? (
        <StatusBanner
          tone="error"
          title="Unable to refresh loyalty data"
          message={loyaltyError}
        >
          <Button title="Try again" variant="ghost" onPress={refreshLoyaltyData} />
        </StatusBanner>
      ) : null}

      <View style={styles.topBar}>
        <View style={styles.brandBlock}>
          <BrandLogo showWordmark={false} />
          <Text style={styles.brandSubline}>Work Cafe Rewards</Text>
        </View>

        <View style={styles.topBarActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('RewardsTab')}
            style={({ pressed }) => [
              styles.topBarAction,
              pressed ? styles.topBarActionPressed : undefined,
            ]}
          >
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={22}
              color={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('ProfileTab')}
            style={({ pressed }) => [
              styles.topBarAction,
              pressed ? styles.topBarActionPressed : undefined,
            ]}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.segmentedControl}>
        <Pressable style={[styles.segmentButton, styles.segmentButtonActive]}>
          <Text style={[styles.segmentText, styles.segmentTextActive]}>Balances</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('HistoryTab')}
          style={({ pressed }) => [
            styles.segmentButton,
            pressed ? styles.segmentButtonPressed : undefined,
          ]}
        >
          <Text style={styles.segmentText}>History</Text>
        </Pressable>
      </View>

      {isInitialLoad ? (
        <LoadingStateCard
          title="Loading your rewards dashboard"
          description="Pulling points, purchases, rewards, and linked Santander accounts from Firestore."
        />
      ) : (
        <>
          <Card variant="elevated" style={styles.balanceCard}>
            <View style={styles.balanceCopy}>
              <Text style={styles.balanceEyebrow}>Your balance</Text>
              <View style={styles.balanceValueRow}>
                <Text style={styles.balanceValue}>{formatPoints(user.pointsBalance)}</Text>
                <Text style={styles.balanceSuffix}>PTS</Text>
              </View>
              <Text style={styles.balanceWorth}>
                Worth {formatCurrency(user.pointsBalance / 100)}
              </Text>
            </View>

            <View style={styles.balanceArt} pointerEvents="none">
              <View style={styles.balanceBlobLarge} />
              <View style={styles.balanceBlobSmall} />
              <View style={styles.balanceCoin}>
                <Text style={styles.balanceCoinText}>P</Text>
              </View>
            </View>

            <View style={styles.balanceMeta}>
              <View style={styles.metaChip}>
                <Text style={styles.metaLabel}>Member tier</Text>
                <Text style={styles.metaValue}>{user.tier}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaLabel}>Linked</Text>
                <Text style={styles.metaValue}>
                  {linkedAccountCount} account{linkedAccountCount === 1 ? '' : 's'}
                </Text>
              </View>
            </View>

            {nextReward && rewardProgress ? (
              <View style={styles.progressBlock}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Next reward</Text>
                  <Text style={styles.progressValue}>
                    {rewardProgress.unlocked
                      ? `${nextReward.title} unlocked`
                      : `${formatPoints(rewardProgress.pointsRemaining)} to go`}
                  </Text>
                </View>
                <ProgressBar progress={rewardProgress.progress} tone="brand" />
              </View>
            ) : null}

            <View style={styles.balanceActions}>
              <Button
                title="Show my QR"
                fullWidth
                onPress={() => navigation.navigate('QrTab')}
              />
              <Button
                title="Browse rewards"
                fullWidth
                variant="secondary"
                onPress={() => navigation.navigate('RewardsTab')}
              />
            </View>
          </Card>

          <Card variant="outline" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How to earn</Text>
            <View style={styles.sectionStack}>
              {earnWays.map((item, index) => (
                <View key={item.title}>
                  <ListRow
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    onPress={() => {
                      if (index === 2) {
                        navigation.navigate('AccountLinking');
                        return;
                      }

                      navigation.navigate('RewardsTab');
                    }}
                  />
                  {index < earnWays.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              ))}
            </View>
          </Card>

          <Card variant="outline" style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('HistoryTab')}
                style={({ pressed }) => [
                  styles.inlineLink,
                  pressed ? styles.inlineLinkPressed : undefined,
                ]}
              >
                <Text style={styles.inlineLinkText}>See all</Text>
              </Pressable>
            </View>

            {recentPurchases.length > 0 ? (
              <View style={styles.activityList}>
                {recentPurchases.map((purchase, index) => (
                  <View key={purchase.id}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('HistoryTab')}
                      style={({ pressed }) => [
                        styles.activityRow,
                        pressed ? styles.activityRowPressed : undefined,
                      ]}
                    >
                      <View style={styles.activityLeading}>
                        <View style={styles.activityIconShell}>
                          <MaterialCommunityIcons
                            name={activityIcons[index % activityIcons.length]}
                            size={20}
                            color={colors.brandRed}
                          />
                        </View>
                        <View style={styles.activityCopy}>
                          <Text style={styles.activityTitle}>{purchase.location}</Text>
                          <Text style={styles.activitySubtitle}>
                            {purchase.itemSummary} • {formatPurchaseDate(purchase.purchasedAt)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.activityTrailing}>
                        <Text style={styles.activityPoints}>
                          {formatPointsDelta(purchase.pointsEarned)}
                        </Text>
                        <Text style={styles.activityAmount}>
                          {formatCurrency(purchase.amount)}
                        </Text>
                      </View>
                    </Pressable>
                    {index < recentPurchases.length - 1 ? (
                      <View style={styles.divider} />
                    ) : null}
                  </View>
                ))}
              </View>
            ) : (
              <EmptyStateCard
                icon="receipt-text-outline"
                title="Your activity will appear here"
                description="Complete a demo cafe scan to populate this view with styled, Firestore-backed purchase activity."
                actionLabel="Open QR flow"
                onAction={() => navigation.navigate('QrTab')}
              />
            )}
          </Card>

          <Card variant="tint" style={styles.offerCard}>
            <View style={styles.offerIconShell}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={26}
                color={colors.brandRed}
              />
            </View>
            <View style={styles.offerCopy}>
              <Text style={styles.offerTitle}>Make the most of your rewards</Text>
              <Text style={styles.offerSubtitle}>{featuredOffers[0].detail}</Text>
            </View>
            <Button
              title="View rewards"
              variant="ghost"
              onPress={() => navigation.navigate('RewardsTab')}
            />
          </Card>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
    gap: 4,
  },
  brandSubline: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  topBarAction: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  topBarActionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceStrong,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: colors.brandRed,
  },
  segmentButtonPressed: {
    opacity: 0.82,
  },
  segmentText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  segmentTextActive: {
    color: colors.textOnBrand,
  },
  balanceCard: {
    position: 'relative',
    overflow: 'hidden',
    gap: spacing.lg,
  },
  balanceCopy: {
    maxWidth: '58%',
    gap: spacing.xs,
  },
  balanceEyebrow: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  balanceValue: {
    color: colors.black,
    fontFamily: typography.fontFamily.heading,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.2,
  },
  balanceSuffix: {
    marginBottom: 8,
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    letterSpacing: 0.6,
  },
  balanceWorth: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  balanceArt: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    width: 148,
    height: 148,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceBlobLarge: {
    position: 'absolute',
    width: 116,
    height: 82,
    borderRadius: 48,
    backgroundColor: colors.brandRed,
    transform: [{ rotate: '-18deg' }, { translateX: -14 }, { translateY: 14 }],
  },
  balanceBlobSmall: {
    position: 'absolute',
    width: 72,
    height: 108,
    borderRadius: 38,
    backgroundColor: colors.brandRedPressed,
    transform: [{ rotate: '24deg' }, { translateX: 18 }, { translateY: -18 }],
  },
  balanceCoin: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.accentGoldSoft,
    borderWidth: 4,
    borderColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCoinText: {
    color: colors.accentGold,
    fontFamily: typography.fontFamily.heading,
    fontSize: 34,
    lineHeight: 36,
  },
  balanceMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaChip: {
    flexGrow: 1,
    minWidth: '42%',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    gap: 2,
  },
  metaLabel: {
    color: colors.textMuted,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaValue: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  progressBlock: {
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  progressValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  balanceActions: {
    gap: spacing.sm,
  },
  sectionCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  sectionStack: {
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  inlineLink: {
    paddingVertical: 4,
  },
  inlineLinkPressed: {
    opacity: 0.72,
  },
  inlineLinkText: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  activityList: {
    gap: spacing.xs,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  activityRowPressed: {
    opacity: 0.78,
  },
  activityLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activityIconShell: {
    width: 46,
    height: 46,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandRedSoft,
  },
  activityCopy: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  activitySubtitle: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  activityTrailing: {
    alignItems: 'flex-end',
    gap: 2,
  },
  activityPoints: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  activityAmount: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  offerCard: {
    gap: spacing.md,
  },
  offerIconShell: {
    width: 54,
    height: 54,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  offerCopy: {
    gap: spacing.xs,
  },
  offerTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
  },
  offerSubtitle: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
});
