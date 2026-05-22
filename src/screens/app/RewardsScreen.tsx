import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  EmptyStateCard,
  LoadingStateCard,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  StatusBanner,
} from '../../components';
import { colors, spacing, typography } from '../../constants';
import { featuredOffers } from '../../data/mockData';
import { useAppSession } from '../../context/AppSessionContext';
import type { MainTabScreenProps } from '../../navigation/types';
import {
  calculateRewardProgress,
  formatPoints,
  getNextReward,
  getRewardStatus,
} from '../../utils/loyalty';

export function RewardsScreen({ navigation }: MainTabScreenProps<'RewardsTab'>) {
  const {
    user,
    rewards,
    loyaltyReady,
    isLoyaltyLoading,
    loyaltyError,
    refreshLoyaltyData,
  } = useAppSession();
  const nextReward = getNextReward(user.pointsBalance, rewards);
  const progress = nextReward
    ? calculateRewardProgress(user.pointsBalance, nextReward.pointsCost)
    : null;
  const isInitialLoad = !loyaltyReady || (isLoyaltyLoading && rewards.length === 0);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Rewards"
        title="Turn every purchase into a better cafe ritual"
        subtitle="Live points, progress, and reward availability now come from Firestore-backed loyalty data."
      />

      {loyaltyError ? (
        <StatusBanner
          tone="error"
          title="Rewards could not be refreshed"
          message={loyaltyError}
        >
          <Button
            title="Reload rewards"
            variant="ghost"
            onPress={refreshLoyaltyData}
          />
        </StatusBanner>
      ) : null}

      {isInitialLoad ? (
        <LoadingStateCard
          title="Loading your rewards"
          description="Fetching current points balance and reward availability from Firestore."
        />
      ) : null}

      {!isInitialLoad ? (
        <>
      <Card variant="elevated" style={styles.cardGap}>
        <Text style={styles.balanceLabel}>Available points</Text>
        <Text style={styles.balanceValue}>{formatPoints(user.pointsBalance)}</Text>
        {progress && nextReward ? (
          <>
            <ProgressBar progress={progress.progress} tone="gold" />
            <Text style={styles.progressText}>
              {progress.unlocked
                ? `${nextReward.title} is ready to redeem.`
                : `${formatPoints(progress.pointsRemaining)} points until ${nextReward.title.toLowerCase()}.`}
            </Text>
          </>
        ) : null}
        <Button
          title="Show member QR"
          variant="ghost"
          onPress={() => navigation.navigate('QrTab')}
        />
      </Card>

      {rewards.length > 0 ? (
        <View style={styles.sectionList}>
          {rewards.map((reward) => {
          const rewardStatus = getRewardStatus(user.pointsBalance, reward);

          return (
            <Card key={reward.id} variant="outline" style={styles.cardGap}>
              <Text style={styles.rewardCategory}>{reward.category}</Text>
              <Text style={styles.rewardPoints}>{reward.pointsCost} pts</Text>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardCopy}>{reward.description}</Text>
              <View style={styles.rewardFooter}>
                {rewardStatus === 'save-up' ? (
                  <Text style={styles.rewardRemaining}>
                    {formatPoints(reward.pointsCost - user.pointsBalance)} points remaining
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.rewardStatus,
                    rewardStatus === 'available'
                      ? styles.rewardStatusAvailable
                      : styles.rewardStatusPending,
                  ]}
                >
                  {rewardStatus === 'available' ? 'Ready to redeem' : 'Keep saving'}
                </Text>
              </View>
            </Card>
          );
          })}
        </View>
      ) : (
        <EmptyStateCard
          icon="gift-outline"
          title="No rewards are available yet"
          description="Add reward documents to Firestore or refresh the seeded demo data to populate this view."
          actionLabel="Try again"
          onAction={refreshLoyaltyData}
        />
      )}

      <Card variant="tint" style={styles.cardGap}>
        <SectionHeader
          eyebrow={featuredOffers[1].tag}
          title={featuredOffers[1].title}
          subtitle={featuredOffers[1].detail}
        />
      </Card>
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  cardGap: {
    gap: spacing.md,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  balanceValue: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: 42,
    lineHeight: 48,
  },
  progressText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  sectionList: {
    gap: spacing.md,
  },
  rewardCategory: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rewardPoints: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rewardTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
  },
  rewardCopy: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  rewardFooter: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  rewardRemaining: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  rewardStatus: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
  },
  rewardStatusAvailable: {
    color: colors.accentGreen,
    backgroundColor: colors.accentGreenSoft,
  },
  rewardStatusPending: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
  },
});
