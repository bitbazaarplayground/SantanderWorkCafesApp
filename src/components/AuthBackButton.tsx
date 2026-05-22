import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '../constants';

interface AuthBackButtonProps {
  label?: string;
  onPress: () => void;
}

export function AuthBackButton({
  label = 'Back',
  onPress,
}: AuthBackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : undefined,
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={18}
          color={colors.brandRed}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
});
