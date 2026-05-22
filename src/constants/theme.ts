import { Platform } from 'react-native';

import { colors } from './colors';
import { typography } from './typography';

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
  tabBar: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: -4 },
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: colors.brandRed,
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
} as const;

export const layout = {
  screenPadding: spacing.lg,
  sectionGap: spacing.lg,
  buttonHeight: 54,
  inputHeight: 56,
  tabBarHeight: 78,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  layout,
} as const;
