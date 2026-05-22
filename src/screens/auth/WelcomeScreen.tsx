import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BrandLogo,
  Button,
  Card,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import { colors, radii, spacing, typography } from '../../constants';
import type { AuthScreenProps } from '../../navigation/types';

const highlights = [
  {
    icon: 'coffee-outline' as const,
    title: 'Earn points with every cafe visit',
  },
  {
    icon: 'wallet-outline' as const,
    title: 'Link Santander accounts when you are ready',
  },
  {
    icon: 'qrcode-scan' as const,
    title: 'Scan once and keep rewards moving',
  },
];

export function WelcomeScreen({ navigation }: AuthScreenProps<'Welcome'>) {
  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.hero}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={styles.glowCenter} />

        <View style={styles.logoWrap}>
          <BrandLogo size="lg" />
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.heroTagline}>Simple. Personal. Fair.</Text>
          <SectionHeader
            eyebrow="Santander Work Cafe Rewards"
            title="A polished mobile loyalty experience for every cafe visit."
            subtitle="Sign in to manage points, rewards, recent purchases, and linked Santander accounts in one clear demo flow."
            align="center"
          />
        </View>
      </View>

      <Card variant="elevated" style={styles.cardGap}>
        <SectionHeader
          eyebrow="Get started"
          title="Choose how you want to enter the app"
          subtitle="The welcome screen is always your starting point, and sign in plus account creation stay one tap away from each other."
        />

        <View style={styles.heroActions}>
          <Button
            title="Sign in"
            fullWidth
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            title="Create account"
            fullWidth
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </Card>

      <Card variant="outline" style={styles.cardGap}>
        <SectionHeader
          eyebrow="What is ready now"
          title="A connected demo foundation"
          subtitle="This build now uses Firebase Authentication and Firestore-backed demo loyalty data across the main mobile flow."
        />

        <View style={styles.highlightList}>
          {highlights.map((item) => (
            <View key={item.title} style={styles.highlightRow}>
              <View style={styles.highlightIcon}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={colors.brandRed}
                />
              </View>
              <Text style={styles.highlightText}>{item.title}</Text>
            </View>
          ))}
        </View>
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
  hero: {
    overflow: 'hidden',
    borderRadius: radii.xl,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    minHeight: 320,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  glowTop: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(236, 0, 0, 0.14)',
  },
  glowCenter: {
    position: 'absolute',
    top: 130,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(236, 0, 0, 0.06)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -70,
    left: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(215, 165, 72, 0.12)',
  },
  logoWrap: {
    alignItems: 'center',
  },
  heroCopy: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  heroTagline: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroActions: {
    gap: spacing.sm,
  },
  cardGap: {
    gap: spacing.md,
  },
  highlightList: {
    gap: spacing.md,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  highlightIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandRedSoft,
  },
  highlightText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
});
