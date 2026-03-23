# SatsFlo Frontend — Full Documentation

> React Native / Expo application for menstrual cycle tracking, partner pairing, community threads, and Bitcoin SATS gifting.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [App Flow Overview](#app-flow-overview)
4. [Screens — Auth](#screens--auth)
5. [Screens — Main App (Tabs)](#screens--main-app-tabs)
6. [Screens — Add Log](#screens--add-log)
7. [Screens — Chat](#screens--chat)
8. [Screens — Onboarding](#screens--onboarding)
9. [Screens — Partner](#screens--partner)
10. [Screens — Gift Token](#screens--gift-token)
11. [Components](#components)
12. [Context & State](#context--state)
13. [Lib / Utilities](#lib--utilities)
14. [Constants](#constants)
15. [Hooks](#hooks)
16. [Navigation Map](#navigation-map)
17. [API Endpoints Used](#api-endpoints-used)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native via Expo (SDK 54) |
| Router | Expo Router (file-based, v4) |
| Styling | NativeWind (Tailwind CSS for RN) |
| HTTP Client | Native `fetch` wrapped in `lib/api.ts` |
| Auth Storage | `@react-native-async-storage/async-storage` |
| Icons | `@expo/vector-icons` (Feather, Ionicons, MaterialIcons) |
| Language | TypeScript |
| Platform targets | iOS, Android |

---

## Folder Structure

```
SATSFLO-FRONTEND/
│
├── app/                          # All screens (Expo Router file-based routing)
│   ├── index.tsx                 # Root redirect → /splash
│   ├── _layout.tsx               # Root layout (fonts, global providers)
│   ├── splash.tsx                # Splash screen (auto-redirects to onboarding)
│   ├── modal.tsx                 # Generic modal screen
│   ├── edit-period.tsx           # Static edit period calendar (legacy)
│   ├── start-partnership.tsx     # Partnership setup landing
│   │
│   ├── onboarding/               # 3-screen onboarding intro
│   │   ├── index.tsx             # Screen 1 — wellness journey
│   │   ├── screen2.tsx           # Screen 2 — cycle insights
│   │   └── screen3.tsx           # Screen 3 — community support
│   │
│   ├── (auth)/                   # Authentication group (no tab bar)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Redirects to signup
│   │   ├── signup.tsx            # Register (name, email, password)
│   │   ├── login.tsx             # Login (email, password)
│   │   ├── forgot-password.tsx   # Request OTP via email
│   │   ├── otp-verification.tsx  # 6-digit OTP entry, 60s resend
│   │   ├── reset-password.tsx    # New password form
│   │   ├── cycle-length.tsx      # Onboarding step 1/3 — pick cycle length
│   │   ├── period-length.tsx     # Onboarding step 2/3 — pick period length
│   │   └── last-period.tsx       # Onboarding step 3/3 — calendar date picker
│   │
│   ├── (tabs)/                   # Main app group (with bottom navigation)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home — cycle tracker chart
│   │   ├── calendar.tsx          # Cycle calendar view
│   │   ├── settings.tsx          # Settings hub
│   │   ├── my-profile.tsx        # Edit profile
│   │   ├── language-settings.tsx # Language picker
│   │   ├── cycle-length-settings.tsx
│   │   ├── period-length-settings.tsx
│   │   ├── luteal-phase-settings.tsx
│   │   ├── notifications.tsx     # Notifications list
│   │   ├── reminders.tsx         # Reminder toggles
│   │   ├── journal.tsx           # Journal entries list
│   │   ├── add-entry.tsx         # Create journal entry
│   │   ├── thread.tsx            # Community threads + groups + chat tabs
│   │   ├── add-thread.tsx        # Create new thread post
│   │   ├── view-comments.tsx     # Thread detail + comments
│   │   ├── chat.tsx              # Chat conversation list
│   │   ├── invite-partner.tsx    # Partner invite landing
│   │   ├── generate-invite.tsx   # Generate 6-char partner invite code
│   │   ├── enter-code.tsx        # Enter partner's invite code
│   │   ├── partner-nickname.tsx  # Set nicknames for both partners
│   │   ├── partner-pairing-success.tsx
│   │   ├── whats-your-partner-name.tsx
│   │   ├── sharing-invite.tsx
│   │   ├── connect-wallet.tsx    # Select lightning wallet provider
│   │   ├── gift-token.tsx        # SATS gifting intro
│   │   ├── gift-token-wallet.tsx
│   │   ├── send-gift-amount.tsx  # Send SATS — enter amount + address
│   │   ├── select-wallet.tsx     # Select wallet for sending
│   │   ├── receive-wallet.tsx    # Select wallet for receiving
│   │   ├── success-sent.tsx      # SATS sent confirmation
│   │   ├── success-received.tsx  # SATS received confirmation + balance
│   │   ├── made-for-you.tsx
│   │   ├── explore.tsx
│   │   └── ...                   # Additional screens
│   │
│   ├── add-log/                  # Period/health logging group
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Main log screen (all health metrics)
│   │   ├── drink-water.tsx       # Water intake goal settings
│   │   ├── symptoms.tsx          # Symptom selector
│   │   ├── moods.tsx             # Mood selector
│   │   ├── medicine.tsx          # Medicine tracker
│   │   ├── notes.tsx             # Free-text notes
│   │   ├── weight.tsx            # Weight entry
│   │   └── temperature.tsx       # Body temperature entry
│   │
│   ├── chat/                     # Conversation group
│   │   ├── _layout.tsx
│   │   └── conversation.tsx      # 1-on-1 chat screen
│   │
│   ├── gift-token/               # Gift token flow group
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── receive.tsx
│   │   ├── select-wallet.tsx
│   │   ├── send-amount.tsx
│   │   ├── send-category.tsx
│   │   └── success.tsx
│   │
│   └── partner/                  # Partner dashboard group
│       ├── index.tsx
│       ├── calendar.tsx
│       ├── insights.tsx
│       ├── my-partner.tsx
│       └── settings.tsx
│
├── components/                   # Reusable UI components
│   ├── home/                     # Home screen components
│   │   ├── cycle-tracker.tsx     # Donut chart with cycle phase segments
│   │   ├── cycle-wheel.tsx       # Alternative wheel visualization
│   │   ├── phase-legend.tsx      # Phase colour legend with tap handlers
│   │   ├── home-header.tsx       # Top bar (logo, notification bell)
│   │   ├── bottom-navigation.tsx # Custom bottom tab bar
│   │   ├── partner-bottom-navigation.tsx
│   │   ├── menstrual-phase-modal.tsx
│   │   ├── follicular-phase-modal.tsx
│   │   ├── ovulation-phase-modal.tsx
│   │   ├── luteal-phase-modal.tsx
│   │   └── index.ts
│   │
│   ├── signup/                   # Auth screen components
│   │   ├── auth-screen-container.tsx
│   │   ├── back-button.tsx
│   │   ├── calendar-picker.tsx   # Full month calendar with period highlight
│   │   ├── checkbox.tsx
│   │   ├── custom-status-bar.tsx
│   │   ├── day-picker.tsx        # Scrollable number picker (cycle/period length)
│   │   ├── home-indicator-area.tsx
│   │   ├── input-field.tsx       # Styled text input
│   │   ├── otp-input.tsx         # 6-box OTP input
│   │   ├── primary-button.tsx    # Pink CTA button
│   │   ├── title-section.tsx     # Title + subtitle + step indicator
│   │   └── index.ts
│   │
│   ├── add-log/                  # Log screen components
│   │   ├── collapsible-section.tsx
│   │   ├── icons.tsx
│   │   └── selectable-option.tsx
│   │
│   ├── chat/                     # Chat UI components
│   │   ├── chat-header.tsx
│   │   ├── chat-list-header.tsx
│   │   ├── conversation-item.tsx
│   │   ├── message-bubble.tsx
│   │   └── message-input.tsx
│   │
│   ├── partner/                  # Partner view components
│   │   ├── my-partner.tsx
│   │   ├── partner-calendar.tsx
│   │   ├── partner-dashboard.tsx
│   │   ├── partner-insights.tsx
│   │   ├── partner-settings.tsx
│   │   └── start-partnership.tsx
│   │
│   └── ui/                       # Generic UI utilities
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       ├── icon-symbol.ios.tsx
│       └── responsive-container.tsx
│
├── context/
│   ├── add-log-context.tsx       # Global state for health logging
│   └── theme-context.tsx         # App theme context
│
├── lib/
│   ├── api.ts                    # HTTP client (fetch wrapper + token helpers)
│   └── utils.ts                  # cn() Tailwind class merge utility
│
├── constants/
│   ├── colors.ts                 # Brand colour tokens
│   ├── theme.ts                  # Theme definitions
│   └── signup-theme.ts           # Auth screen theme values
│
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   ├── use-responsive.ts
│   └── use-theme-color.ts
│
├── API_CONTRACT.md               # Full request/response field reference
├── DOCUMENTATION.md              # This file
└── app.json                      # Expo project config
```

---

## App Flow Overview

```
Launch
  └── /splash (2s auto-redirect)
        └── /onboarding (3 screens)
              └── /(auth)/signup
                    ├── /(auth)/login
                    │     └── /(tabs)/index  ← Main App
                    └── /(auth)/cycle-length
                          └── /(auth)/period-length
                                └── /(auth)/last-period
                                      └── /(tabs)/index  ← Main App
```

---

## Screens — Auth

### `app/(auth)/signup.tsx`
Registration form with name, email, password, confirm password, and terms checkbox.
- **POST** `/auth/register`
- On success: saves `accessToken`, `refreshToken`, `user` to AsyncStorage → navigates to `/(auth)/cycle-length`
- On error: shows inline error message

### `app/(auth)/login.tsx`
Login with email and password. Has remember-me toggle and show/hide password.
- **POST** `/auth/login`
- On success: saves tokens → navigates to `/(tabs)`
- Links to forgot-password and signup

### `app/(auth)/forgot-password.tsx`
Enter registered email to receive OTP reset code.
- **POST** `/auth/forgot-password`
- On success: navigates to `/(auth)/otp-verification` passing email as param

### `app/(auth)/otp-verification.tsx`
6-digit OTP entry screen. 60-second countdown before "Resend" is enabled.
- **POST** `/auth/verify-otp` with `{ email, otp }`
- Resend calls **POST** `/auth/forgot-password` again
- On success: reads `reset_token` from response → navigates to `/(auth)/reset-password?token=...`

### `app/(auth)/reset-password.tsx`
New password + confirm password form. Token comes from route params.
- **POST** `/auth/reset-password/:token`
- On success: navigates to `/(auth)/login`

### `app/(auth)/cycle-length.tsx`
Scrollable picker to select cycle length (21–35 days, default 27). No API call — passes value as route param.
- Navigates to `/(auth)/period-length?cycleLength=...`

### `app/(auth)/period-length.tsx`
Scrollable picker to select period length (3–9 days, default 5). No API call — passes both values forward.
- Navigates to `/(auth)/last-period?cycleLength=...&periodLength=...`

### `app/(auth)/last-period.tsx`
Full calendar picker to select the date of the last period start.
- **POST** `/cycle-profile` on first-time onboarding (passes cycle_length, period_length, last_period_start, luteal_phase_length, ignore_irregular_cycle)
- **PUT** `/cycle-profile` when navigated with `isEdit=true` (from home screen Edit Period button — only updates last_period_start)
- On finish: navigates to `/(tabs)` (or back if editing)

---

## Screens — Main App (Tabs)

### `app/(tabs)/index.tsx` — Home
The main screen. Shows a donut/ring chart with the current cycle phase highlighted in colour. Centre overlay shows today's date, days until next period, and an Edit Period button.
- **GET** `/cycles/current` on load (falls back to **GET** `/cycle-profile`)
- Edit Period button → navigates to `/(auth)/last-period?isEdit=true`
- Journal button → `/(tabs)/journal`
- Gift Token button → `/(tabs)/gift-token`
- Notification bell → `/(tabs)/notifications`
- Phase segments and legend open informational modals (Menstrual, Follicular, Ovulation, Luteal)

### `app/(tabs)/calendar.tsx`
Full month calendar view showing cycle phases, period days, and ovulation window colour-coded by day type.

### `app/(tabs)/settings.tsx`
Settings hub screen. Lists all configurable options:
- My Profile → `/(tabs)/my-profile`
- Language → `/(tabs)/language-settings`
- Cycle Length → `/(tabs)/cycle-length-settings`
- Period Length → `/(tabs)/period-length-settings`
- Luteal Phase → `/(tabs)/luteal-phase-settings`
- Notifications → `/(tabs)/notifications`
- Reminders → `/(tabs)/reminders`
- Invite Partner → `/(tabs)/invite-partner`
- Connect Wallet → `/(tabs)/connect-wallet`
- Logout: **POST** `/auth/logout` with refreshToken → clears AsyncStorage → navigates to `/(auth)/login`
- Delete Account: shows password confirmation modal → **DELETE** `/users/account` with password

### `app/(tabs)/my-profile.tsx`
Editable profile: full name, email (read-only), phone (with country code picker), date of birth.
- **GET** `/users/profile` on load
- **PUT** `/users/profile` on save (date converted from DD-MM-YYYY display to YYYY-MM-DD for API)
- Camera/gallery integration for avatar (display only, not uploaded)

### `app/(tabs)/language-settings.tsx`
Grid of 12 language options. Saves immediately on selection.
- **PUT** `/users/profile` with `{ language }`

### `app/(tabs)/cycle-length-settings.tsx`
Scrollable picker (21–35 days) + ignore irregular cycle toggle.
- **GET** `/cycle-profile` on load to pre-fill current value
- **PUT** `/cycle-profile` with `{ cycle_length, ignore_irregular_cycle }` on save

### `app/(tabs)/period-length-settings.tsx`
Scrollable picker (3–9 days).
- **GET** `/cycle-profile` on load
- **PUT** `/cycle-profile` with `{ period_length }` on save

### `app/(tabs)/luteal-phase-settings.tsx`
Scrollable picker (10–16 days) + ignore irregular cycle toggle.
- **GET** `/cycle-profile` on load
- **PUT** `/cycle-profile` with `{ luteal_phase_length, ignore_irregular_cycle }` on save

### `app/(tabs)/notifications.tsx`
Notification feed (currently static demo data — no live API). Shows likes, comments, received SATS.

### `app/(tabs)/reminders.tsx`
Toggle switches for: period starts, period ends, fertility window, ovulation, medicine. Currently saves locally (no API endpoint).

### `app/(tabs)/journal.tsx`
Journal entries list. Header shows month/week calendar picker. Entries filtered by selected date and search text. Shows empty state if no entries.
- **GET** `/journal?month=YYYY-MM` on load and when month changes
- Date day parsed directly from string (avoids UTC timezone shift bug)
- Add New Entry button → `/(tabs)/add-entry`

### `app/(tabs)/add-entry.tsx`
Full journal entry creation screen. Scrollable week picker at top, then: title (optional), mood selector (8 moods with emoji), symptom tags, notes textarea, image/video upload.
- **POST** `/journal` with `{ title?, content, mood?, date }`
- Media: launches camera or photo library (image stored locally, not uploaded to API)
- Save → navigates back to journal

### `app/(tabs)/thread.tsx`
Three-tab community screen:
- **Threads tab**: public posts feed — **GET** `/threads`. Like/unlike with optimistic UI: **POST** or **DELETE** `/threads/:id/like`
- **Groups tab**: **GET** `/groups`
- **Chats tab**: switches to chat.tsx behaviour
- FAB button → `/(tabs)/add-thread`
- Post tap → `/(tabs)/view-comments?threadId=...`

### `app/(tabs)/add-thread.tsx`
Compose new community post. Text input + media/emoji/link icons.
- **POST** `/threads` with `{ title: "", content, category: "general" }`
- Post button → navigates back to threads

### `app/(tabs)/view-comments.tsx`
Thread detail + comments. Accepts `threadId` route param.
- **GET** `/threads/:id` (thread detail)
- **GET** `/threads/:id/comments` (comments list)
- Send button: **POST** `/threads/:id/comments` with `{ content }`

### `app/(tabs)/chat.tsx`
Chat list with Conversations / Groups / Threads tabs. Search bar.
- **GET** `/chats` for conversations tab
- **GET** `/groups` for groups tab
- Tap conversation → `/chat/conversation?id=...&name=...`

### `app/(tabs)/invite-partner.tsx`
Landing screen for partner pairing with illustration. Two options:
- Generate code → `/(tabs)/generate-invite`  (you invite)
- Enter code → `/(tabs)/enter-code`  (they invited you)

### `app/(tabs)/generate-invite.tsx`
Displays a generated 6-character invite code with 24h countdown timer.
- **POST** `/partner/invite` on mount (no body)
- Reads `invite_code` (or `code`) from response
- Share button: native share sheet
- Navigates to `/(tabs)/partner-pairing-success` after sharing

### `app/(tabs)/enter-code.tsx`
6-box character input for typing a partner's invite code.
- **POST** `/partner/accept` with `{ invite_code }`
- On success → `/(tabs)/whats-your-partner-name`

### `app/(tabs)/partner-nickname.tsx`
Two text inputs: one for your own nickname, one for your partner's nickname.
- **PUT** `/partner/nickname` with `{ my_nickname, partner_nickname }`
- Next / Skip → `/start-partnership`

### `app/(tabs)/partner-pairing-success.tsx`
Celebratory success screen with avatar cluster and heart background. No API call.
- Next → `/(tabs)/made-for-you`

### `app/(tabs)/connect-wallet.tsx`
Lightning wallet provider selector. Options: Blink, Bitnob, Breeze, Phoenix, Aqua.
- **GET** `/wallet/lightning` on load (pre-selects current wallet)
- **PUT** `/wallet/lightning` with `{ lightning_address }` on save

### `app/(tabs)/gift-token.tsx`
Educational intro screen explaining Bitcoin SATS gifting concept with illustration.
- Proceed → `/(tabs)/gift-token-wallet`

### `app/(tabs)/send-gift-amount.tsx`
Send SATS form: destination lightning address, amount (with currency conversion for USD/EUR/KES/NGN display), optional note.
- **POST** `/payments/validate` with `{ lightning_address }` to validate address
- On success → `/(tabs)/select-wallet` passing lightning_address, amount_sats, note as params

### `app/(tabs)/select-wallet.tsx`
Choose which wallet to send from (Blink, Wallet of Satoshi). Receives payment params from previous screen.
- **POST** `/payments/tip` with `{ lightning_address, amount_sats, note }`
- On success → `/(tabs)/success-sent`

### `app/(tabs)/receive-wallet.tsx`
Choose which wallet to receive into.
- **GET** `/lightning/wallet` to fetch current balance
- On success → `/(tabs)/success-received?balance=...`

### `app/(tabs)/success-sent.tsx`
Confirmation screen: "SATS sent successfully". No API call.
- Done → `/(tabs)`

### `app/(tabs)/success-received.tsx`
Confirmation screen showing real wallet balance from route param (previously hardcoded). No API call.
- Done → `/(tabs)`

---

## Screens — Add Log

### `app/add-log/index.tsx` — Health Log Dashboard
Central logging screen for the current day. Sections:
- **Period tracking**: Period Start / Period End toggle buttons
- **Flow**: light / medium / heavy selector
- **Symptoms**: opens `/add-log/symptoms`
- **Moods**: opens `/add-log/moods`
- **Medicine**: opens `/add-log/medicine`
- **Notes**: opens `/add-log/notes`
- **Weight**: opens `/add-log/weight`
- **Temperature**: opens `/add-log/temperature`
- **Water intake**: opens `/add-log/drink-water`

API calls on Save:
- **PUT** `/logs/:date` with all health fields
- **POST** `/cycles/start` with `{ start_date }` if period was started
- **POST** `/cycles/end` with `{ end_date }` if period was ended

### `app/add-log/drink-water.tsx`
Water intake goal configurator. Slider/picker for daily goal in ml. Cup capacity options (50ml / 100ml / 200ml / 350ml / 500ml).
- **GET** `/water-settings` on load to pre-fill `daily_goal_ml`
- **PUT** `/water-settings` with `{ daily_goal_ml }` on save

### `app/add-log/symptoms.tsx`
Multi-select symptom grid. Selected symptoms fed back into add-log context.

### `app/add-log/moods.tsx`
Multi-select mood grid. Feeds back into context.

### `app/add-log/medicine.tsx`
Medicine tracker entry. Feeds back into context.

### `app/add-log/notes.tsx`
Free-text notes. Feeds back into context.

### `app/add-log/weight.tsx`
Numeric weight entry with unit toggle (kg/lbs). Feeds back into context.

### `app/add-log/temperature.tsx`
Basal body temperature entry with unit toggle (°C/°F). Feeds back into context.

---

## Screens — Chat

### `app/chat/conversation.tsx`
Real-time style 1-on-1 chat. Receives `conversationId` and `name` as route params. Optimistic message sending.
- **GET** `/chats/:conversationId` on mount to load message history
- **POST** `/chats/:conversationId` with `{ content }` on send
- Messages rendered as sent (right) or received (left) bubbles
- Image/voice attach icons present (no upload API yet)

---

## Screens — Onboarding

Three intro screens shown only on first launch. No API calls.

| Screen | Content |
|---|---|
| `onboarding/index.tsx` | "Start Your Wellness Journey" |
| `onboarding/screen2.tsx` | "Cycle Insights Just for You" |
| `onboarding/screen3.tsx` | "Community Support" |

Each has Skip (→ signup) and Continue/Get Started buttons.

---

## Screens — Partner

Group of screens for partner dashboard view. Rendered via `components/partner/` components.

| Screen | Description |
|---|---|
| `partner/index.tsx` | Partner dashboard home |
| `partner/calendar.tsx` | Partner's cycle calendar view |
| `partner/insights.tsx` | Insights about partner's cycle |
| `partner/my-partner.tsx` | Partner profile info |
| `partner/settings.tsx` | Partner-specific settings |

---

## Components

### Home Components (`components/home/`)

| Component | Description |
|---|---|
| `cycle-tracker.tsx` | Donut ring chart. Divides the ring into 4 arc segments coloured by phase (Menstrual=red, Follicular=pink, Ovulation=purple, Luteal=orange). Accepts `currentDay`, `cycleLength`, `size` props. |
| `cycle-wheel.tsx` | Alternative wheel/radial visualization |
| `phase-legend.tsx` | Row of coloured dots with phase names. Each tappable to open its modal. |
| `home-header.tsx` | Top bar with SatsFlo logo and notification bell icon |
| `bottom-navigation.tsx` | Custom 5-tab bottom bar (Home, Calendar, Add, Chat, Settings) |
| `menstrual-phase-modal.tsx` | Info sheet about the menstrual phase |
| `follicular-phase-modal.tsx` | Info sheet about the follicular phase |
| `ovulation-phase-modal.tsx` | Info sheet about ovulation |
| `luteal-phase-modal.tsx` | Info sheet about the luteal phase |

### Signup / Auth Components (`components/signup/`)

| Component | Description |
|---|---|
| `calendar-picker.tsx` | Full month grid calendar. Highlights selected date and period days. Used in last-period (onboarding + edit) screens. |
| `day-picker.tsx` | Vertically scrollable number picker for cycle/period length selection |
| `otp-input.tsx` | 6 individual character boxes for OTP input. Auto-advances focus on each character entry. |
| `input-field.tsx` | Styled TextInput with label, error state, show/hide password toggle |
| `primary-button.tsx` | Full-width pink CTA button with loading state |
| `title-section.tsx` | Title + subtitle + optional step indicator (e.g. "1/3") |
| `back-button.tsx` | Left-arrow back navigation button |
| `checkbox.tsx` | Circular checkbox for terms agreement |
| `auth-screen-container.tsx` | Wrapper providing consistent padding/background for auth screens |
| `home-indicator-area.tsx` | Bottom safe area spacer with home indicator bar |

### Chat Components (`components/chat/`)

| Component | Description |
|---|---|
| `conversation-item.tsx` | Single row in the chat list (avatar, name, last message, timestamp) |
| `message-bubble.tsx` | Chat bubble (sent = right/pink, received = left/white) |
| `message-input.tsx` | Bottom input bar with text field, attach, and send button |
| `chat-header.tsx` | Conversation screen header (back, avatar, name, online dot) |
| `chat-list-header.tsx` | Chat list screen header with search |

### Add-Log Components (`components/add-log/`)

| Component | Description |
|---|---|
| `collapsible-section.tsx` | Expandable section wrapper used in the log screen |
| `selectable-option.tsx` | Tappable chip/pill for selecting symptoms, moods etc. |
| `icons.tsx` | Icon definitions for the log categories |

---

## Context & State

### `context/add-log-context.tsx`
Global React context providing state for the health logging flow. Wraps the entire add-log group.

**State managed:**
- `selectedDate` — currently selected log date
- `periodStarted` / `periodEnded` — boolean flags
- `flow` — string (light / medium / heavy)
- `symptoms` — string array
- `moods` — string array
- `medicine` — string array
- `notes` — string
- `weight` / `temperature` / `waterIntake` — numbers
- Daily water goal from settings

**Key functions:**
- `getCurrentDayData()` — returns all state for the current date
- `isDateInPeriod(date)` — checks if a date falls within a logged period
- `saveCurrentDay()` — triggers the API save

---

## Lib / Utilities

### `lib/api.ts`
Core HTTP client wrapping native `fetch`.

```ts
Base URL: https://satsflo-backend.onrender.com/api/v1
```

**Methods:**
- `api.post(path, body, token?)` — POST with JSON body
- `api.put(path, body, token?)` — PUT with JSON body
- `api.get(path, token?)` — GET request
- `api.delete(path, body?, token?)` — DELETE with optional JSON body

All methods return `{ response, data }`. Token is passed as `Authorization: Bearer <token>` header.

**Helper functions:**
- `clearAuthStorage()` — removes `accessToken`, `refreshToken`, `user` from AsyncStorage
- `refreshTokens()` — calls **POST** `/auth/refresh` with stored refreshToken, updates AsyncStorage, returns new accessToken

### `lib/utils.ts`
- `cn(...classes)` — merges Tailwind class strings using `clsx` + `tailwind-merge`. Used throughout components for conditional styling.

---

## Constants

| File | Contents |
|---|---|
| `constants/colors.ts` | Brand colour tokens (primary pink `#FF4081`, etc.) |
| `constants/theme.ts` | Light/dark theme colour mappings |
| `constants/signup-theme.ts` | Auth screen specific colour values |

---

## Hooks

| Hook | Description |
|---|---|
| `use-color-scheme.ts` | Returns current system colour scheme (light/dark) |
| `use-color-scheme.web.ts` | Web-specific colour scheme override |
| `use-responsive.ts` | Returns screen dimensions and breakpoint booleans |
| `use-theme-color.ts` | Returns the correct colour for current theme from constants |

---

## Navigation Map

```
/splash
  └── /onboarding
        ├── /onboarding/screen2
        │     └── /onboarding/screen3
        │           └── /(auth)/signup
        └── /(auth)/signup  ← (skip at any point)

/(auth)/signup
  ├── /(auth)/login
  │     ├── /(auth)/forgot-password
  │     │     └── /(auth)/otp-verification
  │     │           └── /(auth)/reset-password
  │     │                 └── /(auth)/login
  │     └── /(tabs)
  └── /(auth)/cycle-length
        └── /(auth)/period-length
              └── /(auth)/last-period
                    └── /(tabs)

/(tabs)/index  [HOME]
  ├── /(auth)/last-period?isEdit=true  [Edit Period]
  ├── /(tabs)/notifications
  ├── /(tabs)/gift-token
  └── /(tabs)/journal
        └── /(tabs)/add-entry

/(tabs)/settings
  ├── /(tabs)/my-profile
  ├── /(tabs)/language-settings
  ├── /(tabs)/cycle-length-settings
  ├── /(tabs)/period-length-settings
  ├── /(tabs)/luteal-phase-settings
  ├── /(tabs)/notifications
  ├── /(tabs)/reminders
  ├── /(tabs)/invite-partner
  │     ├── /(tabs)/generate-invite → /(tabs)/partner-pairing-success
  │     └── /(tabs)/enter-code → /(tabs)/partner-nickname → /start-partnership
  └── /(tabs)/connect-wallet

/(tabs)/thread  [COMMUNITY]
  ├── /(tabs)/add-thread
  └── /(tabs)/view-comments

/(tabs)/chat
  └── /chat/conversation

/add-log
  ├── /add-log/symptoms
  ├── /add-log/moods
  ├── /add-log/medicine
  ├── /add-log/notes
  ├── /add-log/weight
  ├── /add-log/temperature
  └── /add-log/drink-water

/(tabs)/gift-token
  └── /(tabs)/send-gift-amount
        └── /(tabs)/select-wallet → /(tabs)/success-sent
  └── /(tabs)/receive-wallet → /(tabs)/success-received
```

---

## API Endpoints Used

> Full request/response field reference: see `API_CONTRACT.md`

### Auth
| Method | Endpoint | Screen |
|---|---|---|
| POST | `/auth/register` | signup.tsx |
| POST | `/auth/login` | login.tsx |
| POST | `/auth/forgot-password` | forgot-password.tsx, otp-verification.tsx |
| POST | `/auth/verify-otp` | otp-verification.tsx |
| POST | `/auth/reset-password/:token` | reset-password.tsx |
| POST | `/auth/refresh` | lib/api.ts refreshTokens() |
| POST | `/auth/logout` | settings.tsx |
| GET | `/auth/me` | settings.tsx |

### Users
| Method | Endpoint | Screen |
|---|---|---|
| GET | `/users/profile` | my-profile.tsx |
| PUT | `/users/profile` | my-profile.tsx, language-settings.tsx |
| DELETE | `/users/account` | settings.tsx |

### Cycle
| Method | Endpoint | Screen |
|---|---|---|
| POST | `/cycle-profile` | last-period.tsx |
| PUT | `/cycle-profile` | last-period.tsx, cycle-length-settings.tsx, period-length-settings.tsx, luteal-phase-settings.tsx |
| GET | `/cycle-profile` | cycle-length-settings.tsx, period-length-settings.tsx, luteal-phase-settings.tsx |
| GET | `/cycles/current` | index.tsx (home) |
| POST | `/cycles/start` | add-log/index.tsx |
| POST | `/cycles/end` | add-log/index.tsx |
| GET | `/logs/:date` | add-log/index.tsx |
| PUT | `/logs/:date` | add-log/index.tsx |

### Water & Journal
| Method | Endpoint | Screen |
|---|---|---|
| GET | `/water-settings` | add-log/drink-water.tsx |
| PUT | `/water-settings` | add-log/drink-water.tsx |
| GET | `/journal?month=YYYY-MM` | journal.tsx |
| POST | `/journal` | add-entry.tsx |

### Partner
| Method | Endpoint | Screen |
|---|---|---|
| POST | `/partner/invite` | generate-invite.tsx |
| POST | `/partner/accept` | enter-code.tsx |
| PUT | `/partner/nickname` | partner-nickname.tsx |

### Wallet & Payments
| Method | Endpoint | Screen |
|---|---|---|
| GET | `/wallet/lightning` | connect-wallet.tsx |
| PUT | `/wallet/lightning` | connect-wallet.tsx |
| POST | `/payments/validate` | send-gift-amount.tsx |
| POST | `/payments/tip` | select-wallet.tsx |
| GET | `/lightning/wallet` | receive-wallet.tsx |

### Community
| Method | Endpoint | Screen |
|---|---|---|
| GET | `/threads` | thread.tsx |
| POST | `/threads` | add-thread.tsx |
| GET | `/threads/:id` | view-comments.tsx |
| GET | `/threads/:id/comments` | view-comments.tsx |
| POST | `/threads/:id/comments` | view-comments.tsx |
| POST | `/threads/:id/like` | thread.tsx |
| DELETE | `/threads/:id/like` | thread.tsx |
| GET | `/chats` | chat.tsx |
| GET | `/chats/:id` | chat/conversation.tsx |
| POST | `/chats/:id` | chat/conversation.tsx |
| GET | `/groups` | thread.tsx, chat.tsx |
