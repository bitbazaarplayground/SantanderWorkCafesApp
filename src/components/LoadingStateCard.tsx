import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants';
import { Card } from './Card';

interface LoadingStateCardProps {
  title: string;
  description: string;
}

export function LoadingStateCard({
  title,
  description,
}: LoadingStateCardProps) {
  return (
    <Card variant="outline" style={styles.card}>
      <ActivityIndicator size="large" color={colors.brandRed} />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  copy: {
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
});
