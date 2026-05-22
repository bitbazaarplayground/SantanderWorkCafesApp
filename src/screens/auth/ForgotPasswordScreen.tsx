import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

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

export function ForgotPasswordScreen({
  navigation,
}: AuthScreenProps<'ForgotPassword'>) {
  const { recoverPassword } = useAppSession();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRecoverPassword() {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await recoverPassword(email);
      Alert.alert(
        'Recovery email sent',
        'If an account exists for this email, a password recovery link has been sent.',
      );
      navigation.replace('Login');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to send a recovery email right now.';
      setErrorMessage(message);
      Alert.alert('Unable to recover password', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Login');
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
        eyebrow="Recover access"
        title="Reset your password"
        subtitle="Enter the email address linked to your account and we will send a secure recovery link."
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
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button
          title={isSubmitting ? 'Sending link...' : 'Send recovery link'}
          fullWidth
          disabled={isSubmitting}
          onPress={handleRecoverPassword}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remembered your password?</Text>
        <Button
          title="Back to sign in"
          variant="secondary"
          fullWidth
          onPress={() => navigation.replace('Login')}
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
