import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import SettingsScreen from '@/app/(tabs)/settings';
import { api } from '@/lib/api';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useFocusEffect: (cb: () => void) => { cb(); },
}));

const mockUser = JSON.stringify({ name: 'Test User', email: 'test@example.com' });

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === 'user') return Promise.resolve(mockUser);
    if (key === 'accessToken') return Promise.resolve('mock-token');
    if (key === 'refreshToken') return Promise.resolve('mock-refresh');
    return Promise.resolve(null);
  }),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
  clearAuthStorage: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  const passThrough = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return {
    __esModule: true,
    default: Svg,
    Path: () => null,
    Rect: () => null,
    G: passThrough,
    Defs: passThrough,
    ClipPath: passThrough,
    LinearGradient: passThrough,
    Stop: () => null,
  };
});

jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));
jest.mock('expo-blur', () => ({ BlurView: ({ children }: any) => children }));

jest.mock('@/context/theme-context', () => ({
  useTheme: () => ({
    selectedTheme: 'system',
    setSelectedTheme: jest.fn(),
    isDark: false,
    colors: {
      background: '#FF4081', navBackground: '#FF3378', cardBackground: '#FFE6EE',
      cardBorder: '#FFB3CD', textOnCard: '#1E1E1E', inputBackground: '#FFD6E4',
    },
  }),
}));

jest.mock('@/components/home/bottom-navigation', () => ({ BottomNavigation: () => null }));

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockedApi = api as jest.Mocked<typeof api>;

const profileResponse = {
  response: { ok: true } as any,
  data: { data: { cycleLength: 28, periodLength: 5, lutealPhaseLength: 14 } },
};


// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.get.mockResolvedValue(profileResponse);
    mockedApi.post.mockResolvedValue({ response: { ok: true } as any, data: {} });
  });

  it('renders Settings title', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  it('renders Period length setting row', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByText('Period length')).toBeTruthy();
    });
  });

  it('renders Cycle length setting row', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByText('Cycle length')).toBeTruthy();
    });
  });

  it('renders Theme setting row', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByText('Theme')).toBeTruthy();
    });
  });

  it('renders Log out setting row', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByText('Log out')).toBeTruthy();
    });
  });

  it('shows logout confirmation modal when Log out is pressed', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => getByText('Log out'));
    fireEvent.press(getByText('Log out'));
    await waitFor(() => {
      expect(getByText('Are you sure you want to log out?')).toBeTruthy();
    });
  });

  it('dismisses logout modal when Cancel is pressed', async () => {
    const { getByText, queryByText } = render(<SettingsScreen />);
    await waitFor(() => getByText('Log out'));
    fireEvent.press(getByText('Log out'));
    await waitFor(() => getByText('Cancel'));
    fireEvent.press(getByText('Cancel'));
    await waitFor(() => {
      expect(queryByText('Are you sure you want to log out?')).toBeNull();
    });
  });

  it('calls logout API and navigates to login when Yes, Logout is pressed', async () => {
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => getByText('Log out'));
    fireEvent.press(getByText('Log out'));
    await waitFor(() => getByText('Yes, Logout'));
    fireEvent.press(getByText('Yes, Logout'));

    await waitFor(() => {
      const { router } = require('expo-router');
      expect(router.replace).toHaveBeenCalledWith('/how-to-use');
    });
  });

  it('navigates to period-length-settings when Period length is pressed', async () => {
    const { router } = require('expo-router');
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => getByText('Period length'));
    fireEvent.press(getByText('Period length'));
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('period-length'));
  });

  it('navigates to cycle-length-settings when Cycle length is pressed', async () => {
    const { router } = require('expo-router');
    const { getByText } = render(<SettingsScreen />);
    await waitFor(() => getByText('Cycle length'));
    fireEvent.press(getByText('Cycle length'));
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('cycle-length'));
  });
});
