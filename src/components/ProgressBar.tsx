import { StyleSheet, View } from 'react-native';

import { colors, radii } from '../constants';

interface ProgressBarProps {
  progress: number;
  tone?: 'brand' | 'gold' | 'green';
}

const toneMap = {
  brand: colors.brandRed,
  gold: colors.accentGold,
  green: colors.accentGreen,
} as const;

export function ProgressBar({
  progress,
  tone = 'brand',
}: ProgressBarProps) {
  const safeProgress = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${safeProgress * 100}%`,
            backgroundColor: toneMap[tone],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceStrong,
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
