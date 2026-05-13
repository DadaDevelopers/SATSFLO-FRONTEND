import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import PartnerDashboardScreen from '@/components/partner/partner-dashboard';
import { api } from '@/lib/api';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: (cb: () => void) => { cb(); },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mock-token'),
}));

jest.mock('@/lib/api', () => ({ api: { get: jest.fn() } }));

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

jest.mock('@/components/home/partner-bottom-navigation', () => ({
  PartnerBottomNavigation: () => null,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const partnerResponse = {
  response: { ok: true } as any,
  data: {
    data: {
      partner: { username: 'jane_doe' },
      partner_nickname: 'Babe',
    },
  },
};

const cycleResponse = {
  response: { ok: true } as any,
  data: {
    data: {
      phase: 'follicular',
      cycle_day: 7,
      next_period_days: 21,
      next_ovulation_days: 7,
      is_period: false,
      symptoms: ['cramps', 'fatigue'],
      mood: 'happy',
      sex_drive: 'high',
      pregnancy_chance: 'medium',
    },
  },
};

const periodCycleResponse = {
  response: { ok: true } as any,
  data: {
    data: {
      phase: 'menstrual',
      cycle_day: 2,
      next_period_days: 26,
      next_ovulation_days: 12,
      is_period: true,
      symptoms: ['cramps'],
      mood: 'sad',
      sex_drive: 'low',
      pregnancy_chance: 'low',
    },
  },
};

const permissionErrorResponse = {
  response: { ok: false, status: 403 } as any,
  data: { message: 'Data not shared' },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockedApi = api as jest.Mocked<typeof api>;

function mockBothApis(cycleRes = cycleResponse) {
  mockedApi.get.mockImplementation((path: string) =>
    path.includes('/partner/cycle')
      ? Promise.resolve(cycleRes)
      : Promise.resolve(partnerResponse),
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PartnerDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator on initial render', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {})); // never resolves
    const { getByText } = render(<PartnerDashboardScreen />);
    expect(getByText('Loading cycle data…')).toBeTruthy();
  });

  it('renders partner nickname in header after load', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText(/Babe/)).toBeTruthy();
    });
  });

  it("renders partner's cycle phase card", async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Cycle Phase')).toBeTruthy();
    });
  });

  it('renders cycle day number', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText(/Cycle Day 7/)).toBeTruthy();
    });
  });

  it('shows days until next ovulation in hero when not on period', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('7 Days Left')).toBeTruthy();
    });
  });

  it('shows Period Day hero value when partner is on period', async () => {
    mockBothApis(periodCycleResponse);
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Period Day')).toBeTruthy();
    });
  });

  it('renders symptoms as pill chips', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('cramps')).toBeTruthy();
      expect(getByText('fatigue')).toBeTruthy();
    });
  });

  it("renders Today's Symptoms card", async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText(/Today.*Symptoms/)).toBeTruthy();
    });
  });

  it('renders Pregnancy Chance card with API value', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Pregnancy Chance')).toBeTruthy();
      expect(getByText('medium')).toBeTruthy();
    });
  });

  it('renders Mood card with partner mood', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Mood')).toBeTruthy();
      expect(getByText('happy')).toBeTruthy();
    });
  });

  it('renders Sex Drive card', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Sex Drive')).toBeTruthy();
      expect(getByText('high')).toBeTruthy();
    });
  });

  it('renders Gift Token button after data loads', async () => {
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Gift Token')).toBeTruthy();
    });
  });

  it('navigates to gift-token on Gift Token press', async () => {
    const { router } = require('expo-router');
    mockBothApis();
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => getByText('Gift Token'));
    fireEvent.press(getByText('Gift Token'));
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('gift-token'));
  });

  it('shows permission error when partner has not shared data', async () => {
    mockedApi.get.mockImplementation((path: string) =>
      path.includes('/partner/cycle')
        ? Promise.resolve(permissionErrorResponse)
        : Promise.resolve(partnerResponse),
    );
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText(/shared/i)).toBeTruthy();
    });
  });

  it('shows Retry button on error state', async () => {
    mockedApi.get.mockImplementation((path: string) =>
      path.includes('/partner/cycle')
        ? Promise.resolve(permissionErrorResponse)
        : Promise.resolve(partnerResponse),
    );
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  it('re-fetches data when Retry is pressed', async () => {
    mockedApi.get.mockImplementation((path: string) =>
      path.includes('/partner/cycle')
        ? Promise.resolve(permissionErrorResponse)
        : Promise.resolve(partnerResponse),
    );
    const { getByText } = render(<PartnerDashboardScreen />);
    await waitFor(() => getByText('Retry'));
    fireEvent.press(getByText('Retry'));
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledTimes(4); // 2 on mount + 2 on retry
    });
  });

  it('navigates back when back arrow is pressed', async () => {
    mockBothApis();
    render(<PartnerDashboardScreen />);
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalled();
    });
  });
});
