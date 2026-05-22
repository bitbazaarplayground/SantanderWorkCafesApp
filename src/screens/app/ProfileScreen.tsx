import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  Button,
  Card,
  ListRow,
  ScreenContainer,
  SectionHeader,
  StatusBanner,
} from '../../components';
import { colors, spacing, typography } from '../../constants';
import { useAppSession } from '../../context/AppSessionContext';
import type { MainTabScreenProps } from '../../navigation/types';

function SettingToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.surfaceStrong,
          true: colors.brandRed,
        }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export function ProfileScreen({ navigation }: MainTabScreenProps<'ProfileTab'>) {
  const { user, signOut, linkedAccountCount } = useAppSession();
  const [pushReceipts, setPushReceipts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [challengeReminders, setChallengeReminders] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      setSignOutError('');
      await signOut();
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : 'Unable to sign out right now.',
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Profile"
        title="Settings for your rewards experience"
        subtitle="Profile information, communications, and account linking live together here for the MVP."
      />

      <Card variant="elevated" style={styles.profileCard}>
        <Text style={styles.memberName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.memberDetail}>{user.email}</Text>
        <Text style={styles.memberDetail}>{user.favoriteStore}</Text>
        <View style={styles.memberMetaRow}>
          <View style={styles.memberMetaChip}>
            <Text style={styles.memberMetaLabel}>Tier</Text>
            <Text style={styles.memberMetaValue}>{user.tier}</Text>
          </View>
          <View style={styles.memberMetaChip}>
            <Text style={styles.memberMetaLabel}>Member ID</Text>
            <Text style={styles.memberMetaValue}>{user.memberId}</Text>
          </View>
        </View>
      </Card>

      <Card variant="outline" style={styles.cardGap}>
        <SectionHeader
          eyebrow="Preferences"
          title="Notifications and reminders"
        />
        <SettingToggleRow
          label="Push receipts"
          description="Receive an instant summary after each cafe purchase."
          value={pushReceipts}
          onValueChange={setPushReceipts}
        />
        <SettingToggleRow
          label="Weekly rewards digest"
          description="Get a quick view of points, rewards, and offers each week."
          value={weeklyDigest}
          onValueChange={setWeeklyDigest}
        />
        <SettingToggleRow
          label="Challenge reminders"
          description="Nudge members when bonus streaks or point windows are live."
          value={challengeReminders}
          onValueChange={setChallengeReminders}
        />
      </Card>

      <Card variant="tint" style={styles.cardGap}>
        <SectionHeader
          eyebrow="Connected banking"
          title="Manage Santander account linking"
          subtitle="This detail flow is already available from the app stack and can grow into full connectivity later."
        />
        <ListRow
          icon="bank-outline"
          title="Open account linking"
          subtitle="Review linked, available, and pending Santander account states."
          value={`${linkedAccountCount} linked`}
          onPress={() => navigation.navigate('AccountLinking')}
        />
      </Card>

      {signOutError ? (
        <StatusBanner
          tone="error"
          title="Unable to sign out"
          message={signOutError}
        />
      ) : null}
      <Button
        title={isSigningOut ? 'Signing out...' : 'Sign out'}
        fullWidth
        variant="ghost"
        disabled={isSigningOut}
        onPress={handleSignOut}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  profileCard: {
    gap: spacing.sm,
  },
  memberName: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
  },
  memberDetail: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  memberMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  memberMetaChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brandRedSoft,
  },
  memberMetaLabel: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  memberMetaValue: {
    marginTop: 4,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  cardGap: {
    gap: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  settingCopy: {
    flex: 1,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  settingDescription: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
});
