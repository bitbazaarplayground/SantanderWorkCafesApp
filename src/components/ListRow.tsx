import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '../constants';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ListRowProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}

export function ListRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
}: ListRowProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress ? styles.rowPressed : undefined,
      ]}
    >
      <View style={styles.leading}>
        {icon ? (
          <View style={styles.iconShell}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={colors.brandRed}
            />
          </View>
        ) : null}

        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.trailing}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {onPress ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textMuted}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
  },
  rowPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconShell: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandRedSoft,
    marginRight: spacing.md,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  subtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  value: {
    color: colors.brandRedDark,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  trailing: {
    marginLeft: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
