# Security Testing Guide

This document covers the security-related tests implemented in SatsFlo, how to run them, and how to add further tests to strengthen the application's security posture.

---

## Reporting a Vulnerability

Do not open a public issue to report a vulnerability. Contact **info@satsflo.app** privately with a description of the issue, steps to reproduce, and the potential impact. We aim to respond within 48 hours.

---

## Test Framework

| Tool                          | Purpose                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| Jest                          | Test runner                                                  |
| jest-expo                     | Expo-aware Jest preset                                       |
| @testing-library/react-native | Component rendering and interaction                          |
| @testing-library/jest-native  | Extended matchers (`toBeVisible`, `toHaveTextContent`, etc.) |

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
