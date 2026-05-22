import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants';

interface ScreenContainerProps extends PropsWithChildren {
  scrollable?: boolean;
  keyboardAware?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  scrollable = false,
  keyboardAware = false,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const behavior = keyboardAware && Platform.OS === 'ios' ? 'padding' : undefined;

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={behavior}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={contentContainerStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={behavior}>
        <View style={contentContainerStyle}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
