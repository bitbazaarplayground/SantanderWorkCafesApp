import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';

import { colors, layout, radii, shadows, spacing, typography } from '../constants';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantStyles = {
  primary: {
    backgroundColor: colors.brandRed,
    borderColor: colors.brandRed,
    textColor: colors.textOnBrand,
    extraStyle: shadows.button,
  },
  secondary: {
    backgroundColor: colors.brandRedSoft,
    borderColor: colors.brandRedSoft,
    textColor: colors.brandRedDark,
    extraStyle: {},
  },
  ghost: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    textColor: colors.textPrimary,
    extraStyle: {},
  },
} as const;

export function Button({
  title,
  onPress,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        },
        palette.extraStyle,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            {
              color: palette.textColor,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
});
