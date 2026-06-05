# Contributing to SatsFlo

Thank you for contributing. This document explains how to set up the project, the branching strategy, code standards, and how to write and run tests.

---

## Table of Contents

1. [Branch Strategy](#branch-strategy)
2. [Setting Up Locally](#setting-up-locally)
3. [Making Changes](#making-changes)
4. [Code Standards](#code-standards)
5. [Writing and Running Tests](#writing-and-running-tests)
6. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Branch Strategy

| Branch      | Purpose                                                           |
| ----------- | ----------------------------------------------------------------- |
| `devbranch` | Main integration branch. All feature and fix branches merge here. |
| `test`      | QA and testing. Merged into after `devbranch` is stable.          |
| `build`     | Production builds and deployment only.                            |

**Never push directly to `build`.** All code goes through `devbranch` first.

Branch naming convention:

```
feat/short-description       # new feature
fix/short-description        # bug fix
chore/short-description      # tooling, config, dependencies
refactor/short-description   # refactoring with no behaviour change
```

---

## Setting Up Locally

**Prerequisites**

- Node.js 18 or later (`nvm use 20` is recommended)
- npm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

**Install dependencies**

```bash
npm install
```

**Run the development server**

```bash
npm run start
# or offline
npx expo start --offline
```

Scan the QR code with Expo Go on your device, or press `a` to open on an Android emulator.

---

## Making Changes

1. Branch off `devbranch`:

   ```bash
   git checkout devbranch
   git pull origin devbranch
   git checkout -b feat/your-feature-name
   ```

2. Make your changes. Keep commits focused and descriptive.

3. Run tests before pushing:

   ```bash
   npm test
   ```

4. Push your branch and open a pull request targeting `devbranch`.

---

## Code Standards

**TypeScript**

- All new files must be TypeScript (`.ts` or `.tsx`).
- Avoid `any` types. Use proper types or `unknown` with guards.
- Do not suppress TypeScript errors with `@ts-ignore` unless there is a documented reason in a comment on the same line.

**Styling**

- Use NativeWind class names for layout and colour wherever possible.
- Use inline styles only when NativeWind cannot express the style (e.g. dynamic values, SVG).
- Colours: primary pink `#FF4081`, dark background `#1C0A14`. Do not hardcode one-off colours without discussion.

**Components**

- One component per file.
- Keep screen logic (data fetching, state) in the screen file; keep presentational components in `components/`.
- Do not add a new context provider unless the state genuinely needs to be shared across multiple unrelated screens.

**Navigation**

- Use `router.push` for navigating to a new screen.
- Use `router.replace` when the user should not be able to go back (e.g. after login).
- Never push to a route that does not exist in the `app/` file tree.

**API calls**

- Always use the `api` client in `lib/api.ts` — it handles token refresh automatically.
- Never call `fetch` directly.
- Always read the access token from `AsyncStorage.getItem("accessToken")` immediately before making a call; do not store it in component state.

---

## Writing and Running Tests

### Running tests

```bash
npm test
```

To run a single test file:

```bash
npx jest __tests__/auth/login.test.tsx
```

To run tests in watch mode:

```bash
npx jest --watch
```

### Test structure

Tests live in the `__tests__/` directory and mirror the source structure:

```
__tests__/
  auth/
    login.test.tsx
    signup.test.tsx
  partner/
    enter-code.test.tsx
    invite-partner.test.tsx
    pairing-success.test.tsx
    partner-dashboard.test.tsx
    whats-your-partner-name.test.tsx
  screens/
    calendar.test.tsx
    home.test.tsx
    journal.test.tsx
    settings.test.tsx
```

## Submitting a Pull Request

1. Ensure `npm test` passes with no failures.
2. Give the PR a clear title following conventional commits:
   - `feat: add water intake reminder`
   - `fix: calendar crash on missing symptom field`
   - `chore: update eas-cli`
3. Fill in the PR description: what changed, why, and how to test it.
4. Target `devbranch` as the base branch.
5. Request a review from at least one other contributor before merging.

---

## Questions

Open an issue on the repository or reach out via the project's communication channel.
