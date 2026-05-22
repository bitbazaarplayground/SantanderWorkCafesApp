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
import type { LinkedAccountItem } from '../../data/mockData';

function getStatusLabel(status: LinkedAccountItem['status']) {
  if (status === 'linked') {
    return 'Linked';
  }

  if (status === 'review') {
    return 'Needs review';
  }

  return 'Available';
}

export function AccountLinkingScreen() {
  const {
    linkedAccounts,
    cycleLinkedAccountStatus,
    isUpdatingAccountLink,
    loyaltyReady,
    isLoyaltyLoading,
    loyaltyError,
    statusMessage,
    dismissStatusMessage,
    refreshLoyaltyData,
  } = useAppSession();
  const isInitialLoad =
    !loyaltyReady || (isLoyaltyLoading && linkedAccounts.length === 0);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Santander account linking"
        title="Prepare eligible accounts for rewards"
        subtitle="This MVP still simulates linking states, but account status changes now persist in Firestore for a stronger demo flow."
      />

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
          title="Account links could not be refreshed"
          message={loyaltyError}
        >
          <Button
            title="Try again"
            variant="ghost"
            onPress={refreshLoyaltyData}
          />
        </StatusBanner>
      ) : null}

      {isInitialLoad ? (
        <LoadingStateCard
          title="Loading linked Santander accounts"
          description="Preparing checking, savings, and card link states from Firestore."
        />
      ) : linkedAccounts.length > 0 ? (
        <View style={styles.list}>
          {linkedAccounts.map((account) => (
            <Card key={account.id} variant="elevated" style={styles.accountCard}>
              <View style={styles.accountTop}>
                <View style={styles.accountMain}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountDetail}>{account.detail}</Text>
                </View>
                <Text
                  style={[
                    styles.accountStatus,
                    account.status === 'linked'
                      ? styles.statusLinked
                      : account.status === 'review'
                        ? styles.statusReview
                        : styles.statusAvailable,
                  ]}
                >
                  {getStatusLabel(account.status)}
                </Text>
              </View>

              <Button
                title={
                  account.status === 'linked'
                    ? 'Already linked'
                    : account.status === 'review'
                      ? isUpdatingAccountLink
                        ? 'Confirming...'
                        : 'Confirm link'
                      : isUpdatingAccountLink
                        ? 'Saving...'
                        : 'Request link'
                }
                variant={account.status === 'linked' ? 'secondary' : 'primary'}
                fullWidth
                disabled={account.status === 'linked' || isUpdatingAccountLink}
                onPress={() => {
                  void cycleLinkedAccountStatus(account.id);
                }}
              />
            </Card>
          ))}
        </View>
      ) : (
        <EmptyStateCard
          icon="bank-outline"
          title="No account links found"
          description="Your Santander checking, savings, and card relationships will appear here once the demo data has been seeded."
          actionLabel="Reload account links"
          onAction={refreshLoyaltyData}
        />
      )}

      <Card variant="tint" style={styles.infoCard}>
        <Text style={styles.infoTitle}>What comes later</Text>
        <Text style={styles.infoCopy}>
          Real linking can slot into this screen with consent copy, API responses,
          eligibility checks, and error states without changing the navigation
          model.
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
  list: {
    gap: spacing.md,
  },
  accountCard: {
    gap: spacing.md,
  },
  accountTop: {
    gap: spacing.md,
  },
  accountMain: {
    gap: spacing.xs,
  },
  accountName: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
  },
  accountDetail: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  accountStatus: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
  },
  statusLinked: {
    color: colors.accentGreen,
    backgroundColor: colors.accentGreenSoft,
  },
  statusReview: {
    color: colors.info,
    backgroundColor: colors.infoSoft,
  },
  statusAvailable: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
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
