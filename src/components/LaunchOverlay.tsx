import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  StyleSheet,
  View,
  type AnimatedValue,
} from 'react-native';

import { colors } from '../constants';
import { BrandLogo } from './BrandLogo';

interface LaunchOverlayProps {
  opacity: AnimatedValue;
}

export function LaunchOverlay({ opacity }: LaunchOverlayProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, styles.overlay, { opacity }]}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        <BrandLogo variant="workCafe" size="lg" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 999,
    backgroundColor: colors.canvasDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
