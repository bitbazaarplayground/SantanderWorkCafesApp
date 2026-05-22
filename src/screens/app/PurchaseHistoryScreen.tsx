import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  EmptyStateCard,
  LoadingStateCard,
  ScreenContainer,
  SectionHeader,
  StatusBanner,
} from '../../components';
import { colors, spacing, typography } from '../../constants';
import { useAppSession } from '../../context/AppSessionContext';
import {
  calculatePurchaseSummary,
  formatCurrency,
  formatPoints,
  formatPointsDelta,
  formatPurchaseDate,
} from '../../utils/loyalty';

export function PurchaseHistoryScreen() {
  const {
    purchaseHistory,
    loyaltyReady,
    isLoyaltyLoading,
    loyaltyError,
    refreshLoyaltyData,
  } = useAppSession();
  const summary = calculatePurchaseSummary(purchaseHistory);
  const isInitialLoad =
    !loyaltyReady || (isLoyaltyLoading && purchaseHistory.length === 0);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="History"
        title="Track visits, spend, and earned points"
        subtitle="Purchases now load from Firestore, including cafe visits added by the QR demo flow."
      />

      {loyaltyError ? (
        <StatusBanner
          tone="error"
          title="Purchase history unavailable"
          message={loyaltyError}
        >
          <Button
            title="Reload history"
            variant="ghost"
            onPress={refreshLoyaltyData}
          />
        </StatusBanner>
      ) : null}

      {isInitialLoad ? (
        <LoadingStateCard
          title="Loading purchase history"
          description="Pulling your most recent cafe visits and points from Firestore."
        />
      ) : null}

      {!isInitialLoad ? (
        <>
      <Card variant="elevated" style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Recorded spend</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalSpend)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Points earned</Text>
          <Text style={styles.summaryValue}>
            {formatPoints(summary.totalPoints)} pts
          </Text>
        </View>
      </Card>

      {purchaseHistory.length > 0 ? (
        <View style={styles.list}>
          {purchaseHistory.map((record) => (
            <Card key={record.id} variant="outline" style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View style={styles.historyMain}>
                  <Text style={styles.location}>{record.location}</Text>
                  <Text style={styles.date}>
                    {record.itemSummary} on {formatPurchaseDate(record.purchasedAt)}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(record.amount)}</Text>
              </View>

              <View style={styles.historyMeta}>
                <Text style={styles.points}>
                  {formatPointsDelta(record.pointsEarned)}
                </Text>
                <Text style={styles.paymentSource}>{record.paymentSource}</Text>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <EmptyStateCard
          icon="receipt-text-clock-outline"
          title="No purchases recorded yet"
          description="Use the QR demo flow to simulate a cafe checkout and create your first Firestore-backed purchase."
        />
      )}
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
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
  },
  list: {
    gap: spacing.md,
  },
  historyCard: {
    gap: spacing.md,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  historyMain: {
    flex: 1,
  },
  location: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  date: {
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  amount: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  points: {
    color: colors.accentGreen,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  paymentSource: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
});
