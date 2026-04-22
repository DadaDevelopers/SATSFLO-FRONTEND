import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import InvitePartnerScreen from '@/app/(tabs)/invite-partner';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return {
    __esModule: true,
    default: Svg,
    Path: () => null,
    G: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Feather: () => null,
}));

// ── Helpers ────────────────────────────────────────────────────────────────────

import { router } from 'expo-router';
const mockedRouter = router as jest.Mocked<typeof router>;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('InvitePartnerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('renders the screen title', () => {
    const { getByText } = render(<InvitePartnerScreen />);
    expect(getByText('Invite Partner')).toBeTruthy();
  });

  it('renders description text', () => {
    const { getByText } = render(<InvitePartnerScreen />);
    expect(getByText(/Invite your partner or friend/)).toBeTruthy();
  });

  it('renders Generate partner code and Join with code buttons', () => {
    const { getByText } = render(<InvitePartnerScreen />);
    expect(getByText('Generate partner code')).toBeTruthy();
    expect(getByText('Join with code')).toBeTruthy();
  });

  it('navigates to sharing-invite on Generate partner code press', () => {
    const { getByText } = render(<InvitePartnerScreen />);
    fireEvent.press(getByText('Generate partner code'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/sharing-invite');
  });

  it('navigates to enter-code on Join with code press', () => {
    const { getByText } = render(<InvitePartnerScreen />);
    fireEvent.press(getByText('Join with code'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/enter-code');
  });
});
