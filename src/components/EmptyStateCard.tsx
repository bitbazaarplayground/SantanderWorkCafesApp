import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '../constants';
import { Button } from './Button';
import { Card } from './Card';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface EmptyStateCardProps {
  title: string;
  description: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateCard({
  title,
  description,
  icon = 'coffee-outline',
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <Card variant="outline" style={styles.card}>
      <View style={styles.iconShell}>
        <MaterialCommunityIcons name={icon} size={22} color={colors.brandRed} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} variant="ghost" onPress={onAction} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandRedSoft,
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
