import 'react-native-gesture-handler';

import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LaunchOverlay } from './src/components';
import { appFontAssets } from './src/constants';
import { AppSessionProvider } from './src/context/AppSessionContext';
import { AppNavigator } from './src/navigation/AppNavigator';

SplashScreen.setOptions({
  duration: 900,
  fade: true,
});

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Native splash may already be controlled by the host environment.
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts(appFontAssets);
  const [launchDelayComplete, setLaunchDelayComplete] = useState(false);
  const [showLaunchOverlay, setShowLaunchOverlay] = useState(true);
  const launchOpacity = useRef(new Animated.Value(1)).current;
  const appReady = launchDelayComplete && (fontsLoaded || Boolean(fontError));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLaunchDelayComplete(true);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!appReady) {
      return;
    }

    let isActive = true;

    void SplashScreen.hideAsync()
      .catch(() => {
        // Ignore hide errors so the app can still continue rendering.
      })
      .finally(() => {
        Animated.timing(launchOpacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && isActive) {
            setShowLaunchOverlay(false);
          }
        });
      });

    return () => {
      isActive = false;
      launchOpacity.stopAnimation();
    };
  }, [appReady]);

  return (
    <SafeAreaProvider>
      {appReady ? (
        <AppSessionProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AppSessionProvider>
      ) : null}
      {showLaunchOverlay ? <LaunchOverlay opacity={launchOpacity} /> : null}
    </SafeAreaProvider>
  );
}
