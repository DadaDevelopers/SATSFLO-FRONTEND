# SatsFlo Frontend

Mobile application for menstrual cycle tracking, health logging, and cycle insights. Built with React Native and Expo.

- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router 6 (file-based) |
| Styling | NativeWind 4 (Tailwind CSS for React Native) |
| Language | TypeScript 5.9 |
| State | React Context API |
| Storage | AsyncStorage + REST API |
| Build | EAS Build |

---

## Key Features

**Cycle Tracking**
- Circular cycle wheel displaying all days of the current cycle period
- Phase visualization: menstrual, follicular, ovulation, and luteal
- Cycle day counter with days-until-next-period countdown
- Real-time period start and end logging

**Health Logging**
- Daily logs for flow level, symptoms, moods, and medicine
- Notes, weight, temperature, and water intake tracking
- Date-browsable log history synced with the calendar screen

**Calendar**
- Monthly calendar view with period and fertility window highlights
- Day-by-day log summary (flow, symptoms, moods, weight, temperature, water)
- Cycle day labels on each date cell

**Partner Mode**
- Invite a partner or friend to view cycle data
- Switch between personal and partner cycle views
- Dedicated partner dashboard

**Journal**
- Personal health journal with text entries
- All-entries view with filtering

**Community Thread**
- Post and view community threads
- Comment on posts

**Gift Token**
- Send and receive gift tokens between users
- Wallet management for token transactions

**Notifications**
- Push notification support via Expo Notifications
- In-app notification centre with unread count

**Settings**
- Period length, cycle length, and luteal phase length configuration
- Reminder management
- Theme selection (light, dark, system)
- Language preferences
- Privacy policy and terms of service
- Account deletion

**Authentication**
- Email and password signup and login
- OTP email verification
- Forgot password and reset password flow
- Onboarding with cycle setup (period length, cycle length, last period date)

---

## Project Structure

```
app/
  (auth)/          # Login, signup, onboarding screens
  (tabs)/          # Main app screens (home, calendar, settings, etc.)
  add-log/         # Daily health log entry screens
components/
  home/            # Cycle tracker, bottom navigation, phase modals
  add-log/         # Flow droplet, symptom and mood pickers
  signup/          # Onboarding UI components
  ui/              # Shared UI primitives
context/
  add-log-context.tsx   # Global log state (shared across all screens)
  theme-context.tsx     # Theme (light/dark/system)
lib/
  api.ts           # HTTP client with token refresh
  notifications.ts # Push notification registration and listeners
assets/
  images/          # App icons, symptom and medicine images
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Install

```bash
npm install
```

### Run (development)

```bash
npm run start
# or
npx expo start --offline
```

Scan the QR code with the Expo Go app, or run on a connected device or emulator.

> Push notifications require a custom development build. They are disabled automatically in Expo Go.

### Build (Android APK for testing)

```bash
eas build --platform android --profile preview
```

### Build (Android AAB for Play Store)

```bash
eas build --platform android --profile production
```

---

## Environment Notes

- The app communicates with a REST backend. The base URL is configured in `lib/api.ts`.
- Google Services configuration for Android is in `google-services.json` (not committed — add your own for Firebase features).
- The EAS project ID is set under `extra.eas.projectId` in `app.json`.

---

## Branch Structure

| Branch | Purpose |
|---|---|
| `devbranch` | Main integration branch — all feature branches merge here |
| `test` | QA and testing |
| `build` | Production builds and deployment |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch strategy, code standards, how to run tests, and how to write new tests.

## Security

See [SECURITY.md](SECURITY.md) for the security measures in place, existing test coverage for security-critical paths, and recommendations to strengthen the application. To report a vulnerability, contact **info@satsflo.app** privately rather than opening a public issue.

---

## License

Private — DadaDevelopers. All rights reserved.
