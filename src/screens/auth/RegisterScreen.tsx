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

export function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { register } = useAppSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await register({
        firstName,
        lastName,
        email,
        password,
      });
      Alert.alert(
        'Check your email',
        'We sent a verification link to your email address. Please confirm your account before signing in.',
      );
      navigation.replace('Login');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create the account.';
      setErrorMessage(
        message,
      );
      if (message === 'This email is already in use.') {
        Alert.alert('Email already in use', message);
      }
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
        eyebrow="Create account"
        title="Join the cafe rewards experience"
        subtitle="Create your account to start earning rewards at Santander Work Cafe."
      />

      <Card variant="elevated" style={styles.formCard}>
        <InputField
          label="First name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        <InputField
          label="Last name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />
        <InputField
          label="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        <InputField
          label="Mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          placeholder="07xxx xxxxxx"
        />
        <InputField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          helperText="Use at least 6 characters."
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button
          title={isSubmitting ? 'Creating account...' : 'Create account'}
          fullWidth
          disabled={isSubmitting}
          onPress={handleRegister}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have a rewards profile?</Text>
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
