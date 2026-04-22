import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import WhatsYourPartnerNameScreen from '@/app/(tabs)/whats-your-partner-name';
import { api } from '@/lib/api';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mock-token'),
}));

jest.mock('@/lib/api', () => ({ api: { put: jest.fn() } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return { __esModule: true, default: Svg, Path: () => null };
});

jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));

// ── Helpers ────────────────────────────────────────────────────────────────────

import { router } from 'expo-router';
const mockedRouter = router as jest.Mocked<typeof router>;
const mockedApi = api as jest.Mocked<typeof api>;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('WhatsYourPartnerNameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the question title', () => {
    const { getByText } = render(<WhatsYourPartnerNameScreen />);
    expect(getByText('What name does your partner call you?')).toBeTruthy();
  });

  it('renders the name input with placeholder', () => {
    const { getByPlaceholderText } = render(<WhatsYourPartnerNameScreen />);
    expect(getByPlaceholderText('My Love')).toBeTruthy();
  });

  it('renders Done and Skip buttons', () => {
    const { getByText } = render(<WhatsYourPartnerNameScreen />);
    expect(getByText('Done')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
  });

  it('navigates to partner-nickname on Skip press', () => {
    const { getByText } = render(<WhatsYourPartnerNameScreen />);
    fireEvent.press(getByText('Skip'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/partner-nickname');
  });

  it('calls api.put with nickname and navigates on Done when name is entered', async () => {
    mockedApi.put.mockResolvedValue({ response: { ok: true } as any, data: {} });

    const { getByPlaceholderText, getByText } = render(<WhatsYourPartnerNameScreen />);
    fireEvent.changeText(getByPlaceholderText('My Love'), 'Sweetheart');
    fireEvent.press(getByText('Done'));

    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith(
        '/partner/nickname',
        { my_nickname: 'Sweetheart' },
        'mock-token',
      );
      expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/partner-nickname');
    });
  });

  it('navigates to partner-nickname on Done without entering a name (no API call)', async () => {
    const { getByText } = render(<WhatsYourPartnerNameScreen />);
    fireEvent.press(getByText('Done'));

    await waitFor(() => {
      expect(mockedApi.put).not.toHaveBeenCalled();
      expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/partner-nickname');
    });
  });

  it('still navigates to partner-nickname even when api.put throws', async () => {
    mockedApi.put.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, getByText } = render(<WhatsYourPartnerNameScreen />);
    fireEvent.changeText(getByPlaceholderText('My Love'), 'Babe');
    fireEvent.press(getByText('Done'));

    await waitFor(() => {
      expect(mockedRouter.push).toHaveBeenCalledWith('/(tabs)/partner-nickname');
    });
  });
});
