import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '../constants';

type CardVariant = 'elevated' | 'outline' | 'tint';

interface CardProps extends PropsWithChildren {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

const variantStyles = {
  elevated: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    extraStyle: shadows.card,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    extraStyle: {},
  },
  tint: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    extraStyle: {},
  },
} as const;

export function Card({
  children,
  variant = 'elevated',
  style,
}: CardProps) {
  const palette = variantStyles[variant];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        palette.extraStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    overflow: 'hidden',
  },
});
