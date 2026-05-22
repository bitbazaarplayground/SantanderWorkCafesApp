import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
}: SectionHeaderProps) {
  return (
    <View style={align === 'center' ? styles.containerCenter : undefined}>
      {eyebrow ? (
        <Text
          style={[
            styles.eyebrow,
            light ? styles.eyebrowLight : undefined,
            align === 'center' ? styles.textCenter : undefined,
          ]}
        >
          {eyebrow}
        </Text>
      ) : null}

      <Text
        style={[
          styles.title,
          light ? styles.titleLight : undefined,
          align === 'center' ? styles.textCenter : undefined,
        ]}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            light ? styles.subtitleLight : undefined,
            align === 'center' ? styles.textCenter : undefined,
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  containerCenter: {
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.brandRed,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  eyebrowLight: {
    color: 'rgba(255, 255, 255, 0.84)',
  },
  title: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.size.xxl,
    lineHeight: typography.lineHeight.xxl,
  },
  titleLight: {
    color: colors.textOnBrand,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
  },
  subtitleLight: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
});
