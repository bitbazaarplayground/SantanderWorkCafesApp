import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useAppSession } from '../context/AppSessionContext';
import { colors } from '../constants';
import { AuthLoadingScreen } from '../screens/auth';
import { AppStackNavigator } from './AppStackNavigator';
import { AuthNavigator } from './AuthNavigator';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.brandRed,
  },
};

export function AppNavigator() {
  const { authReady, isAuthenticated } = useAppSession();

  if (!authReady) {
    return <AuthLoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <AppStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
