import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants';

type StatusTone = 'success' | 'info' | 'error';

interface StatusBannerProps extends PropsWithChildren {
  title: string;
  message: string;
  tone?: StatusTone;
}

const toneStyles = {
  success: {
    backgroundColor: colors.accentGreenSoft,
    titleColor: colors.accentGreen,
  },
  info: {
    backgroundColor: colors.infoSoft,
    titleColor: colors.info,
  },
  error: {
    backgroundColor: colors.brandRedSoft,
    titleColor: colors.brandRedDark,
  },
} as const;

export function StatusBanner({
  title,
  message,
  tone = 'info',
  children,
}: StatusBannerProps) {
  const palette = toneStyles[tone];

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.titleColor,
        },
      ]}
    >
      <Text style={[styles.title, { color: palette.titleColor }]}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  message: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
});
