export const appFontAssets = {
  'SantanderHeadline-Bold': require('../../assets/fonts/SantanderHeadline-Bold.otf'),
  'SantanderText-Regular': require('../../assets/fonts/SantanderText-Regular.otf'),
  'SantanderText-Bold': require('../../assets/fonts/SantanderText-Bold.otf'),
} as const;

export const typography = {
  fontFamily: {
    heading: 'SantanderHeadline-Bold',
    body: 'SantanderText-Regular',
    bodyMedium: 'SantanderText-Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 34,
  },
  lineHeight: {
    xs: 18,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 32,
    xxl: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
