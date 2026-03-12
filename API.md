 # Satsflow Frontend (Expo / React Native)

This document is the authoritative integration guide for the **Satsflow Expo app**.
It covers every backend API endpoint, request/response shapes, auth token management,
and error handling patterns.

---

## Stack Context

- **Framework**: Expo (React Native)
- **HTTP client**: `axios` (recommended) or `fetch`
- **Token storage**: `expo-secure-store` (never AsyncStorage for tokens)
- **Auth**: JWT access token (15 min) + refresh token (7 days, rotated)
- **Backend base URL**: `http://localhost:3000/api/v1` (dev) — replace with production URL
- **Deep-link scheme**: `satsflo://` — set `DEEP_LINK_URL=satsflo://` in backend `.env` so email links open the app

---

## Base API Client Setup

```ts
// lib/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({ baseURL: BASE_URL });

// Attach access token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Navigate to login — use your navigation ref here
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Standard Response Envelope

Every endpoint returns:

```json
{
  "success": true,
  "message": "Human-readable status",
  "data": { ... }
}
```

Errors return:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

Always check `response.data.success` — do not rely solely on HTTP status codes.

---

## Auth Endpoints

**Base path**: `/auth`
No `Authorization` header needed unless noted.

### Register

```
POST /auth/register
```

```ts
body: {
  name: string;           // 2–100 chars
  email: string;
  password: string;       // min 8 chars, 1 uppercase, 1 number, 1 special
}

response.data: {
  user: { id, name, email, role, email_verified, created_at };
  accessToken: string;
  refreshToken: string;
}
```

After success → `SecureStore.setItemAsync('accessToken', ...)` + `SecureStore.setItemAsync('refreshToken', ...)`.

### Login

```
POST /auth/login
```

```ts
body: {
  email: string;
  password: string;
}

response.data: {
  user: { id, name, email, role, email_verified, last_login };
  accessToken: string;
  refreshToken: string;
}
```

### Refresh Token

```
POST /auth/refresh
```

```ts
body: { refreshToken: string }

response.data: {
  accessToken: string;
  refreshToken: string;   // old token is revoked; store this new one
}
```

### Logout

```
POST /auth/logout             — revoke current device refresh token
POST /auth/logout-all         — revoke all refresh tokens for this user
```

```ts
// logout
body: { refreshToken: string }

// logout-all — requires Authorization header
// no body needed
```

### Email Verification

```
// Deep-link flow (email → Expo app → API):
// 1. Email contains: satsflo:///verify-email?token=TOKEN
// 2. Expo opens /verify-email screen, reads token from URL query params
// 3. App calls:
GET  /auth/verify-email/:token           — token as path param (preferred from app code)
GET  /auth/verify-email?token=TOKEN      — token as query param (alias, also accepted)

POST /auth/resend-verification           — resend email (body: { email })
```

### Password Reset

```
POST /auth/forgot-password
body: { email: string }

// Deep-link flow: satsflo:///reset-password?token=TOKEN → Expo reads token → calls:
POST /auth/reset-password/:token          — token as path param, body: { password: string }

POST /auth/change-password   — auth required
body: { currentPassword: string; newPassword: string }
```

### Current User

```
GET /auth/me   — auth required
response.data: { id, name, email, role, email_verified, created_at, last_login }
```

---

## User Endpoints

**Base path**: `/users`  — all require `Authorization` header.

### Get Profile

```
GET /users/profile
response.data: {
  id, name, email, role, avatar_url, bio, date_of_birth,
  timezone, email_verified, created_at, updated_at
}
```

### Update Profile

```
PUT /users/profile
body: {
  name?: string;
  bio?: string;
  date_of_birth?: string;   // YYYY-MM-DD
  timezone?: string;
  avatar_url?: string;
}
```

### Get Health Profile

```
GET /users/health-profile
response.data: {
  blood_type, height_cm, weight_kg,
  health_conditions,   // decrypted string
  medications,         // decrypted string
  notes,               // decrypted string
  updated_at
}
```

### Update Health Profile

```
PUT /users/health-profile
body: {
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  health_conditions?: string;
  medications?: string;
  notes?: string;
}
```

### Preferences

```
GET /users/preferences
PUT /users/preferences
body: {
  notifications_enabled?: boolean;
  reminder_time?: string;    // "HH:MM"
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}
```

### Export & Delete

```
GET    /users/export          — download all user data as JSON
DELETE /users/account         — permanently delete account
body:  { password: string }   — must confirm with password
```

---

## Cycle Profile Endpoint

**Base path**: `/cycle-profile`  — auth required.

The cycle profile stores the user's typical cycle length and period length.
It also returns live predictions (next period, current phase, days until next period).

### Upsert Cycle Profile

```
POST /cycle-profile
body: {
  cycle_length: number;    // days, e.g. 28
  period_length: number;   // days, e.g. 5
  last_period_date: string; // YYYY-MM-DD
}
response.data: { cycle_length, period_length, last_period_date, updated_at }
```

### Get Cycle Profile + Predictions

```
GET /cycle-profile
response.data: {
  cycle_length, period_length, last_period_date,
  current_phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  days_until_next_period: number;
  predicted_next_period: string;  // YYYY-MM-DD
  fertile_window_start: string;
  fertile_window_end: string;
}
```

---

## Cycle Endpoints

**Base path**: `/cycles`  — all auth required.

### Start a Cycle

```
POST /cycles/start
body: {
  start_date: string;        // YYYY-MM-DD
  flow_intensity?: 'light' | 'medium' | 'heavy' | 'spotting';
  notes?: string;
}
response.data: { id, user_id, start_date, flow_intensity, notes, created_at }
```

### End a Cycle

```
PUT /cycles/:id/end
body: {
  end_date: string;  // YYYY-MM-DD
}
```

### Get Current Cycle

```
GET /cycles/current
response.data: {
  id, start_date, end_date, cycle_length,
  current_day: number,
  phase: string,
  logs: [ ...daily log entries ]
}
```

### Get Cycle History

```
GET /cycles?page=1&limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
response.data: {
  cycles: [ { id, start_date, end_date, cycle_length } ],
  pagination: { page, limit, total, totalPages }
}
```

### Get / Update / Delete Cycle by ID

```
GET    /cycles/:id
PUT    /cycles/:id
body: { flow_intensity?, notes?, start_date?, end_date? }
DELETE /cycles/:id
```

### Log Daily Entry for a Cycle

```
POST /cycles/:id/logs
body: {
  log_date: string;           // YYYY-MM-DD
  flow_intensity?: string;
  symptoms?: string[];
  moods?: string[];
  notes?: string;
  temperature?: number;
  cervical_mucus?: string;
}
```

### Cycle Analytics

```
GET /cycles/analytics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
response.data: {
  average_cycle_length: number;
  average_period_length: number;
  total_cycles: number;
  shortest_cycle: number;
  longest_cycle: number;
  regularity_score: number;
}
```

---

## Day Logs Endpoints

**Base path**: `/logs`  — all auth required.

Day logs store daily metrics: water intake, weight, basal body temperature (BBT), notes.

### Get Single Day Log

```
GET /logs?date=YYYY-MM-DD
response.data: {
  id, user_id, log_date,
  water_ml: number,
  weight_kg: number,
  temperature: number,
  notes: string,
  updated_at
}
```

Returns `null` data (success: true, data: null) if no log exists for that date.

### Get Range

```
GET /logs/range?from=YYYY-MM-DD&to=YYYY-MM-DD
response.data: [ ...day log objects ]
```

### Upsert (Create or Update) Day Log

```
PUT /logs/:date           — :date is YYYY-MM-DD
body: {
  water_ml?: number;
  weight_kg?: number;
  temperature?: number;
  notes?: string;
}
```

This is an upsert — safe to call multiple times for the same date.

---

## Health Endpoints

**Base path**: `/health`  — all auth required.

### Symptoms

```
POST /health/symptoms
body: {
  symptom_name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  logged_at?: string;   // ISO datetime, defaults to now
  notes?: string;
  cycle_id?: string;
}

POST /health/symptoms/batch
body: { symptoms: [ ...same shape as above ] }

GET /health/symptoms?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&symptomName=string&severity=number
response.data: [ { id, symptom_name, severity, logged_at, notes, cycle_id } ]

GET  /health/symptoms/date/:date
PUT  /health/symptoms/:id
body: { severity?, notes? }
DELETE /health/symptoms/:id
```

### Moods

```
POST /health/moods
body: {
  mood: string;            // e.g. "happy", "anxious", "calm"
  intensity: 1 | 2 | 3 | 4 | 5;
  logged_at?: string;
  notes?: string;
  cycle_id?: string;
}

POST /health/moods/batch
body: { moods: [ ...same shape ] }

GET /health/moods?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&mood=string&intensity=number
GET /health/moods/date/:date
PUT /health/moods/:id
body: { intensity?, notes? }
DELETE /health/moods/:id
```

### Analytics

```
GET /health/analytics/symptoms
response.data: {
  top_symptoms: [ { symptom_name, count, avg_severity } ],
  by_phase: { menstrual: [...], follicular: [...], ovulation: [...], luteal: [...] }
}

GET /health/analytics/moods
response.data: {
  mood_distribution: [ { mood, count, avg_intensity } ],
  by_phase: { ... }
}
```

### Daily Summary & Trends

```
GET /health/summary/:date
response.data: {
  date: string,
  symptoms: [ ...symptom objects ],
  moods: [ ...mood objects ]
}

GET /health/trends/:cycleId
response.data: {
  symptoms_by_day: [ { day, symptoms: [...] } ],
  moods_by_day:    [ { day, moods:    [...] } ]
}
```

---

## Water Settings Endpoints

**Base path**: `/water-settings`  — auth required.

Stores the user's daily water goal and cup sizes.

```
GET /water-settings
response.data: {
  daily_goal_ml: number,
  cup_sizes: number[],    // e.g. [150, 250, 350, 500]
  updated_at: string
}

PUT /water-settings
body: {
  daily_goal_ml?: number;
  cup_sizes?: number[];
}
```

---

## Journal Endpoints

**Base path**: `/journal`  — auth required.

Private diary entries associated with the user's cycle.

```
GET /journal?month=YYYY-MM
response.data: [ { id, entry_date, title, content, mood, created_at } ]

POST /journal
body: {
  entry_date: string;   // YYYY-MM-DD
  title?: string;
  content: string;
  mood?: string;
}
response.data: { id, entry_date, title, content, mood, created_at }
```

---

## Community Endpoints

**Base path**: `/threads`
Threads and comments support optional auth — `Authorization` header is NOT required to read, but IS required to create/like/comment.

### Threads

```
GET /threads?page=1&limit=10&category=string&search=string
response.data: {
  threads: [
    {
      id, title, content, category, tags,
      likes_count, comments_count, views_count,
      created_at,
      user: { id, name, avatar_url }
    }
  ],
  pagination: { page, limit, total, totalPages }
}

POST /threads                    — auth required
body: {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  is_anonymous?: boolean;
}

GET    /threads/:id
response.data: {
  id, content, image_url, created_at, updated_at,
  comment_count, like_count, is_liked_by_me,
  user: { id, name, avatar_url },
  comments: [ { id, content, created_at, user: { id, name, avatar_url } } ]
}

PUT    /threads/:id              — auth required (own post only)
body: { content?, image_url? }
DELETE /threads/:id              — auth required (own post or admin)
```

### Comments

```
POST /threads/:threadId/comments  — auth required
body: {
  content: string;
  is_anonymous?: boolean;
}
response.data: {
  id, thread_id, content, created_at,
  user: { id, name, avatar_url }
}

PUT    /threads/:id/comments/:commentId     — auth required (own comment only)
body: { content: string }
DELETE /threads/:id/comments/:commentId    — auth required (own comment or admin)
```

### Likes

```
POST   /threads/:threadId/like     — auth required — toggle like
DELETE /threads/:threadId/like     — unlike
```

### Notifications

```
GET /notifications
response.data: [
  {
    id, type, message, is_read,
    created_at,
    actor: { id, name, avatar_url }
  }
]

PATCH /notifications/:notificationId/read   — mark single notification read
PATCH /notifications/read-all               — mark all notifications read
```

---

## Error Handling Pattern

```ts
// utils/handleApiError.ts
import { AxiosError } from 'axios';

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.errors?.length) {
      return data.errors.map((e: { message: string }) => e.message).join('\n');
    }
    return data?.message ?? 'Something went wrong';
  }
  return 'Network error — check your connection';
}
```

```ts
// usage in a component / service
try {
  const { data } = await api.post('/auth/login', { email, password });
  // data.data.accessToken, data.data.refreshToken
} catch (err) {
  const message = handleApiError(err);
  Alert.alert('Login failed', message);
}
```

---

## Token Storage & Logout Helper

```ts
// lib/auth.ts
import * as SecureStore from 'expo-secure-store';

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

export async function logout() {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch { /* best-effort */ }
  }
  await clearTokens();
}
```

---

## Feature Integration Cheat-Sheet

| Screen | Endpoint(s) |
|--------|-------------|
| Onboarding / Register | `POST /auth/register` → save tokens → `POST /cycle-profile` |
| Login | `POST /auth/login` → save tokens |
| Home / Dashboard | `GET /auth/me`, `GET /cycle-profile`, `GET /logs?date=today` |
| Period tracker | `POST /cycles/start`, `POST /cycles/end`, `GET /cycles/current`, `POST /cycles/:id/logs` |
| Daily log | `PUT /logs/:date` (water, weight, temp) |
| Symptoms | `POST /health/symptoms` or `/batch`, `GET /health/symptoms/date/:date` |
| Mood log | `POST /health/moods` or `/batch`, `GET /health/moods/date/:date` |
| Health analytics | `GET /health/analytics/symptoms`, `GET /health/analytics/moods` |
| Journal | `GET /journal?month=YYYY-MM`, `POST /journal` |
| Water settings | `GET /water-settings`, `PUT /water-settings` |
| Profile | `GET /users/profile`, `PUT /users/profile` |
| Health profile | `GET /users/health-profile`, `PUT /users/health-profile` |
| Community feed | `GET /threads` (no auth required) |
| Thread detail | `GET /threads/:id` |
| Post thread | `POST /threads` |
| Like / comment | `POST /threads/:id/like`, `POST /threads/:id/comments` |
| Notifications | `GET /notifications`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| Cycle history | `GET /cycles?page=1&limit=10` |
| Cycle analytics | `GET /cycles/analytics` |
| Change password | `POST /auth/change-password` |
| Forgot password | `POST /auth/forgot-password` → email link → `POST /auth/reset-password/:token` |
| Delete account | `DELETE /users/account` |

---

## Notes

- All dates use `YYYY-MM-DD` format. All datetimes are ISO 8601 UTC.
- Pagination parameters: `?page=1&limit=10` (default limit is 10).
- The `is_anonymous` flag on threads/comments hides the user object in responses.
- Community read endpoints (`GET /threads`, `GET /threads/:id`) work without auth — pass the token if the user is logged in to get personalised data (e.g. `is_liked`).
- Rate limits are stricter on health/auth routes — avoid aggressive polling.
- The `cycle-profile` endpoint (`POST /cycle-profile`) is an upsert — safe to call on every onboarding save.
