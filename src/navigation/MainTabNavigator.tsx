import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors, layout, radii, shadows, spacing, typography } from '../constants';
import {
  HomeDashboardScreen,
  ProfileScreen,
  PurchaseHistoryScreen,
  QrCodeScreen,
  RewardsScreen,
} from '../screens/app';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const iconMap: Record<keyof MainTabParamList, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  HomeTab: 'home-variant-outline',
  RewardsTab: 'gift-outline',
  QrTab: 'qrcode-scan',
  HistoryTab: 'receipt-text-clock-outline',
  ProfileTab: 'account-circle-outline',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brandRed,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: colors.canvas,
        },
        tabBarStyle: {
          height: layout.tabBarHeight + 4,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          ...shadows.tabBar,
        },
        tabBarItemStyle: {
          marginHorizontal: 2,
          borderRadius: radii.md,
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.bodyMedium,
          fontSize: typography.size.xs,
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={iconMap[route.name]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeDashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="RewardsTab"
        component={RewardsScreen}
        options={{ title: 'Rewards' }}
      />
      <Tab.Screen
        name="QrTab"
        component={QrCodeScreen}
        options={{ title: 'QR' }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={PurchaseHistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
