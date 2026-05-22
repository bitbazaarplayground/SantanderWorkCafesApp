import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AuthBackButton,
  BrandLogo,
  Button,
  Card,
  InputField,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import { colors, spacing, typography } from '../../constants';
import { useAppSession } from '../../context/AppSessionContext';
import type { AuthScreenProps } from '../../navigation/types';

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { signIn } = useAppSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await signIn({
        email,
        password,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to sign in right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Welcome');
  }

  return (
    <ScreenContainer
      scrollable
      keyboardAware
      contentContainerStyle={styles.content}
    >
      <AuthBackButton onPress={handleBack} />
      <BrandLogo />

      <SectionHeader
        eyebrow="Secure sign in"
        title="Welcome back to your rewards wallet"
        subtitle="Sign in with your email address and password. If you are not ready yet, you can always return to the welcome screen."
      />

      <Card variant="elevated" style={styles.formCard}>
        <InputField
          label="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button
          title={isSubmitting ? 'Signing in...' : 'Sign in'}
          fullWidth
          disabled={isSubmitting}
          onPress={handleSignIn}
        />
        <View style={styles.inlineActionRow}>
          <Text style={styles.inlineActionText}>Forgot your password?</Text>
          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            style={({ pressed }) => [
              styles.inlineActionLink,
              pressed ? styles.inlineActionLinkPressed : undefined,
            ]}
          >
            <Text style={styles.inlineActionLinkText}>Recover it here</Text>
          </Pressable>
        </View>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New to Santander Cafe Rewards?</Text>
        <Button
          title="Create a new account"
          variant="secondary"
          fullWidth
          onPress={() => navigation.replace('Register')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  formCard: {
    gap: spacing.md,
  },
  errorText: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  inlineActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  inlineActionText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  inlineActionLink: {
    paddingHorizontal: 2,
  },
  inlineActionLinkPressed: {
    opacity: 0.72,
  },
  inlineActionLinkText: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  footer: {
    gap: spacing.xs,
  },
  footerText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'center',
  },
});
