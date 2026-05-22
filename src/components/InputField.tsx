import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, layout, radii, spacing, typography } from '../constants';

interface InputFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
}

export function InputField({
  label,
  helperText,
  style,
  ...props
}: InputFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.brandRed}
        style={[styles.input, style]}
      />
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  input: {
    minHeight: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceMuted,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
  },
  helperText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
  },
});
