# Security Testing Guide

This document covers the security-related tests implemented in SatsFlo, how to run them, and how to add further tests to strengthen the application's security posture.

---

## Reporting a Vulnerability

Do not open a public issue to report a vulnerability. Contact **info@satsflo.app** privately with a description of the issue, steps to reproduce, and the potential impact. We aim to respond within 48 hours.

---

## Test Framework

| Tool | Purpose |
|---|---|
| Jest | Test runner |
| jest-expo | Expo-aware Jest preset |
| @testing-library/react-native | Component rendering and interaction |
| @testing-library/jest-native | Extended matchers (`toBeVisible`, `toHaveTextContent`, etc.) |

Configuration is in `jest.config.js`. Setup (extended matchers) is in `jest.setup.ts`.

---

## Running the Tests

**Run all tests**

```bash
npm test
```

**Run all tests with coverage report**

```bash
npm run test:ci
```

**Run a single test file**

```bash
npx jest __tests__/auth/login.test.tsx
```

**Run all tests in a directory**

```bash
npx jest __tests__/auth/
```

**Run tests in watch mode (re-runs on file save)**

```bash
npx jest --watch
```

**Run only tests whose name matches a pattern**

```bash
npx jest --testNamePattern="does not call API"
```

---

## Implemented Tests

All tests live in `__tests__/` and mirror the source structure.

### Authentication — `__tests__/auth/`

#### `login.test.tsx`

Tests the `/(auth)/login` screen.

| Test | Security relevance |
|---|---|
| Does not call API when fields are empty | Prevents empty credential submission |
| Calls `api.post` with email and password on submit | Verifies correct payload sent to `/auth/login` |
| Shows API error message on failed login | Verifies error messages surface without exposing internals |
| Shows fallback error message when network fails | Ensures exceptions are caught and not leaked raw |
| Navigates to tabs after successful login | Session established before navigation |
| Navigates to forgot password screen | Correct routing for password recovery |

#### `signup.test.tsx`

Tests the `/(auth)/signup` screen.

| Test | Security relevance |
|---|---|
| Does not call API when form is incomplete | Blocks incomplete registration attempts |
| Shows password requirements when user starts typing | Enforces password strength guidance |
| Does not call API when passwords do not match | Prevents mismatched password submission |
| Calls `api.post` with correct payload on valid submit | Verifies correct data sent to `/auth/register` |
| Shows API error message on failed registration | Error handling without internal leak |
| Shows fallback error message when network fails | Exception boundary on network failure |
| Navigates to cycle-length after successful registration | Onboarding flow integrity |

---

### Partner Flows — `__tests__/partner/`

#### `enter-code.test.tsx`

Tests the partner code entry screen `/(tabs)/enter-code`.

| Test | Security relevance |
|---|---|
| Does not call API when code is incomplete | Blocks partial code submission |
| Calls `api.post` with joined code on Connect when all slots filled | Verifies correct payload sent |
| Shows session expired error when no token | Handles unauthenticated state explicitly |
| Shows API error message on failed connect | Error surfaced without internal detail |
| Shows network error when request throws | Exception boundary |
| Pre-fills code slots from deep link `code` param | Deep link parameter handled safely |

#### `invite-partner.test.tsx`

Tests the `/(tabs)/invite-partner` screen.

| Test | Security relevance |
|---|---|
| Navigates to sharing-invite on Generate partner code press | Correct routing for invite generation |
| Navigates to enter-code on Join with code press | Correct routing for code entry |

#### `whats-your-partner-name.test.tsx`

Tests the `/(tabs)/whats-your-partner-name` screen.

| Test | Security relevance |
|---|---|
| Calls `api.put` with nickname and navigates on Done | Verifies nickname update is authenticated |
| Still navigates to partner-nickname even when `api.put` throws | Graceful failure, no hard crash |

#### `pairing-success.test.tsx` and `partner-dashboard.test.tsx`

Cover partner pairing confirmation and the partner dashboard data display, including error state, retry, and permission error when partner data sharing is disabled.

---

### Screens — `__tests__/screens/`

#### `settings.test.tsx`

Tests the `/(tabs)/settings` screen.

| Test | Security relevance |
|---|---|
| Shows logout confirmation modal when Log out is pressed | Confirms logout requires explicit user action |
| Dismisses logout modal when Cancel is pressed | User can abort logout |
| Calls logout API and navigates to login when Yes, Logout is pressed | Session is terminated and user is redirected |
| Navigates to period-length-settings when pressed | Settings routing integrity |

#### `home.test.tsx`

| Test | Security relevance |
|---|---|
| Does not show email verification banner when email is verified | Verified state renders correctly |
| Shows email verification banner when email is unverified | Unverified users are prompted |
| Calls resend-verification API when Resend email is pressed | Verification resend works |

#### `calendar.test.tsx` and `journal.test.tsx`

Cover screen rendering, data fetching, and navigation. `journal.test.tsx` includes a test that the delete API is called when deletion is confirmed, ensuring destructive actions go through proper confirmation.

---

## How to Add New Tests

### File location

Place new test files in `__tests__/` under the subdirectory that matches the source:

```
__tests__/
  auth/          # screens in app/(auth)/
  partner/       # partner-related screens and components
  screens/       # screens in app/(tabs)/
  components/    # shared components (add this directory if needed)
  lib/           # utility and API layer tests (add this directory if needed)
```

### Recommended standard mock block

Every test file needs the same set of mocks at the top. Copy this block and add any screen-specific mocks below it:

```tsx
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useFocusEffect: (cb: () => void) => { cb(); },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue("mock-token"),
  setItem: jest.fn().mockResolvedValue(undefined),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiGet: jest.fn().mockResolvedValue([["accessToken", "mock-token"], ["refreshToken", "mock-refresh"]]),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/api", () => ({ api: { post: jest.fn(), get: jest.fn(), put: jest.fn(), delete: jest.fn() } }));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Svg = ({ children }: any) => React.createElement(View, null, children);
  return { __esModule: true, default: Svg, Path: () => null, Rect: () => null, Circle: () => null, G: () => null };
});

jest.mock("@expo/vector-icons", () => ({ Feather: () => null }));
```

### Core security tests to add

The following test areas are not yet covered and should be prioritised:

**Token refresh on 401 — `__tests__/lib/api.test.ts`**

The `withTokenRefresh` function in `lib/api.ts` is central to session continuity but has no tests. Add:

```ts
it("retries the original request with a new token after a 401", async () => {
  // First call returns 401, refresh succeeds, retry returns 200
});

it("returns the original 401 when token refresh fails", async () => {
  // Both the original call and the refresh return 401
  // Verify no infinite retry loop
});

it("does not attempt refresh for NO_REFRESH_PATHS endpoints", async () => {
  // Call to /auth/login that returns 401 should not trigger refresh
});
```

**Storage cleanup on logout — `__tests__/screens/settings.test.tsx`**

Add to the existing settings test file:

```ts
it("calls AsyncStorage.multiRemove with the correct keys on logout", async () => {
  // Confirm accessToken, refreshToken, and user are removed
});
```

**Delete account password requirement — `__tests__/screens/settings.test.tsx`**

```ts
it("does not call delete API when password field is empty", async () => {
  // Open delete modal, press Yes Delete without entering a password
  // Verify api.delete is not called
});
```

**Upload authentication — `__tests__/services/upload.service.test.ts`**

```ts
it("attaches Authorization header to avatar upload", async () => {
  // Verify fetch is called with Authorization: Bearer <token>
});

it("returns null when avatar upload returns a non-ok response", async () => {
  // Verify failed upload is handled gracefully
});

it("returns empty array when journal image upload fails", async () => {
  // Verify exception during upload does not propagate
});
```

**OTP verification — `__tests__/auth/otp-verification.test.tsx`**

```ts
it("does not call verify API when OTP field is empty", async () => {});
it("calls api.post with the OTP value on submit", async () => {});
it("shows error when OTP is incorrect", async () => {});
it("navigates to login after successful verification", async () => {});
```

**Reset password — `__tests__/auth/reset-password.test.tsx`**

```ts
it("does not submit when passwords do not match", async () => {});
it("does not submit when password field is empty", async () => {});
it("calls api.post with the new password on valid submit", async () => {});
```

### What each test should cover at minimum

For any new screen or feature that handles authentication, user input, or data submission, add tests for:

1. **Empty / invalid input is blocked** — form does not reach the API with missing or invalid data.
2. **Correct API endpoint and payload** — the right method, path, and body are used.
3. **API error is surfaced** — the error message from the server is shown without exposing raw exception detail.
4. **Network failure is handled** — a thrown exception produces a safe fallback message, not a crash.
5. **Navigation after success** — the correct screen is shown after a successful operation.
6. **Destructive actions require confirmation** — delete and logout actions go through a modal before executing.
