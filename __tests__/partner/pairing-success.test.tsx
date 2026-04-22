import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import PartnerPairingSuccessScreen from '@/app/(tabs)/partner-pairing-success';

// ── Mocks ─────────────────────────────────────────────────────────────────────

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
    Defs: () => null,
    ClipPath: () => null,
    Rect: () => null,
  };
});

jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));

// Mock local image assets
jest.mock('../../assets/images/hana.png', () => 1);
jest.mock('../../assets/images/janedoe.png', () => 1);

// ── Helpers ────────────────────────────────────────────────────────────────────

import { router } from 'expo-router';
const mockedRouter = router as jest.Mocked<typeof router>;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PartnerPairingSuccessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the success title', () => {
    const { getByText } = render(<PartnerPairingSuccessScreen />);
    expect(getByText('Partner pairing successful')).toBeTruthy();
  });

  it('renders the Next button', () => {
    const { getByText } = render(<PartnerPairingSuccessScreen />);
    expect(getByText('Next')).toBeTruthy();
  });

  it('navigates to made-for-you on Next press', () => {
    const { getByText } = render(<PartnerPairingSuccessScreen />);
    fireEvent.press(getByText('Next'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/made-for-you');
  });
});
