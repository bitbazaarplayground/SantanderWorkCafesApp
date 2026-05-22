import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors, typography } from '../constants';
import { AccountLinkingScreen } from '../screens/app';
import { MainTabNavigator } from './MainTabNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        contentStyle: { backgroundColor: colors.canvas },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.canvas },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: typography.fontFamily.heading,
          fontSize: typography.size.lg,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountLinking"
        component={AccountLinkingScreen}
        options={{ title: 'Link Santander accounts' }}
      />
    </Stack.Navigator>
  );
}
