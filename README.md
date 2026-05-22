# Santander Cafe Rewards Demo

Expo + TypeScript starter for a Santander Cafe Rewards mobile demo app.

## What is included

- Expo-managed React Native setup with TypeScript
- Scalable `src` structure for navigation, screens, components, and constants
- Auth stack plus extendable tab-based app navigation
- Santander-inspired theme tokens for colour, spacing, radii, and typography
- Reusable UI primitives:
  - `Button`
  - `Card`
  - `ScreenContainer`
  - `BrandLogo`
- Placeholder data-driven MVP screens:
  - Welcome
  - Login
  - Register
  - Home dashboard
  - Rewards
  - QR code
  - Purchase history
  - Account linking
  - Profile and settings
- Firestore-backed loyalty demo data for points, purchase history, reward progress, transactions, and account-linking states
- Demo QR scan flow that simulates a cafe staff scan and writes a mock purchase into Firestore
- Firebase JS SDK setup for Expo with persisted email/password authentication
- Official Santander wordmark and Santander Work Cafe brand assets in `assets/brand`
- Launch screen configured with the black Santander Work Cafe artwork
- `.env.example` for future public Expo configuration

## Structure

```text
.
├── App.tsx
├── app.json
├── assets
│   └── brand
├── src
│   ├── components
│   ├── constants
│   ├── context
│   ├── data
│   ├── navigation
│   └── screens
│       ├── app
│       └── auth
└── README.md
```

## Getting started

```bash
npm install
npm run start
```

Then open the project in Expo Go or an iOS/Android simulator.

## Navigation

- `AuthStack`: `Welcome`, `Login`, `Register`
- `AppStack`: `MainTabs`, `AccountLinking`
- `MainTabs`: `Home`, `Rewards`, `QR`, `History`, `Profile`

## Firebase setup

The app reads Firebase client configuration from Expo public env vars:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Firebase files live under `src/lib/firebase`:

- `config.ts` initializes the Firebase app, Auth, and Firestore
- `auth.ts` contains auth helpers and friendly error mapping
- `firestore.ts` contains collection references, seeding helpers, and loyalty read/write flows

## Firestore structure

- `users/{uid}`: core rewards profile document with points balance, member tier, and member ID
- `users/{uid}/purchases/{purchaseId}`: Firestore-backed cafe purchase history
- `users/{uid}/transactions/{transactionId}`: loyalty ledger entries for seeded and simulated point activity
- `users/{uid}/accountLinks/{accountId}`: Santander account-linking demo states
- `rewards/{rewardId}`: shared rewards catalog for the app

On first sign-in or registration, the app seeds a realistic demo dataset if those loyalty collections are empty.

## Brand assets and fonts

- `assets/brand/santander-wordmark.png` is the official Santander wordmark used in the app UI.
- `assets/brand/work-cafe-lockup-black.png` powers the dark welcome and launch experience.
- `assets/fonts` now includes the official Santander Headline and Santander Text font files used by the app.
- The app already waits for configured fonts before rendering the main UI in `App.tsx`.
