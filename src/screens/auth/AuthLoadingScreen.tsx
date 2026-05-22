import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BrandLogo, ScreenContainer } from '../../components';
import { colors, radii, spacing, typography } from '../../constants';

export function AuthLoadingScreen() {
  return (
    <ScreenContainer style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <BrandLogo size="lg" />
        <ActivityIndicator
          size="large"
          color={colors.brandRed}
          style={styles.spinner}
        />
        <Text style={styles.title}>Checking your secure session</Text>
        <Text style={styles.copy}>
          Restoring your account and preparing the latest rewards data.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  spinner: {
    marginTop: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    textAlign: 'center',
  },
  copy: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
});
