import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  type Persistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

const firebaseEnv = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingEnvVars = Object.entries(firebaseEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingEnvVars.join(', ')}`,
  );
}

const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: firebaseEnv.apiKey,
        authDomain: firebaseEnv.authDomain,
        projectId: firebaseEnv.projectId,
        storageBucket: firebaseEnv.storageBucket,
        messagingSenderId: firebaseEnv.messagingSenderId,
        appId: firebaseEnv.appId,
      });

export const firebaseAuth =
  Platform.OS === 'web'
    ? getAuth(firebaseApp)
    : (() => {
        try {
          return initializeAuth(firebaseApp, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
        } catch {
          return getAuth(firebaseApp);
        }
      })();

export const firestoreDb = getFirestore(firebaseApp);
export { firebaseApp };
