import { Image, StyleSheet, Text, View } from 'react-native';

import { brandAssets, colors, radii, spacing, typography } from '../constants';

type BrandLogoSize = 'md' | 'lg';
type BrandLogoTone = 'light' | 'dark';
type BrandLogoVariant = 'santander' | 'workCafe';

interface BrandLogoProps {
  size?: BrandLogoSize;
  showWordmark?: boolean;
  tone?: BrandLogoTone;
  variant?: BrandLogoVariant;
}

const sizeMap = {
  md: {
    santanderWidth: 150,
    santanderHeight: 26,
    workCafeWidth: 220,
    workCafeHeight: 147,
    subline: 12,
  },
  lg: {
    santanderWidth: 188,
    santanderHeight: 33,
    workCafeWidth: 280,
    workCafeHeight: 187,
    subline: 13,
  },
} as const;

export function BrandLogo({
  size = 'md',
  showWordmark = true,
  tone = 'dark',
  variant = 'santander',
}: BrandLogoProps) {
  const metrics = sizeMap[size];
  const isLight = tone === 'light';

  if (variant === 'workCafe') {
    return (
      <View style={styles.workCafeWrap}>
        <Image
          source={brandAssets.workCafeLockupBlack}
          style={{
            width: metrics.workCafeWidth,
            height: metrics.workCafeHeight,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.santanderWrap}>
      <View
        style={[
          styles.wordmarkShell,
          isLight ? styles.wordmarkShellOnDark : undefined,
        ]}
      >
        <Image
          source={brandAssets.santanderWordmark}
          style={{
            width: metrics.santanderWidth,
            height: metrics.santanderHeight,
          }}
          resizeMode="contain"
        />
      </View>

      {showWordmark ? (
        <Text
          style={[
            styles.subline,
            {
              fontSize: metrics.subline,
              color: isLight ? colors.textOnDarkSecondary : colors.textSecondary,
            },
          ]}
        >
          Work Cafe Rewards
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  santanderWrap: {
    gap: spacing.xs,
  },
  workCafeWrap: {
    alignItems: 'center',
  },
  wordmarkShell: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  wordmarkShellOnDark: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  subline: {
    fontFamily: typography.fontFamily.body,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
