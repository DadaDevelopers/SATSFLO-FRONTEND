import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import React from 'react';

import JournalScreen from '@/app/(tabs)/journal';
import { api } from '@/lib/api';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: (cb: () => void) => { cb(); },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mock-token'),
}));

jest.mock('@/lib/api', () => ({ api: { get: jest.fn(), delete: jest.fn() } }));

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

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockEntry = {
  id: 'entry-1',
  date: '2026-05-01T00:00:00.000Z',
  title: 'My First Entry',
  content: 'Feeling good today',
  mood: 'happy',
  symptoms: ['cramps'],
  cycle_day: 3,
};

const emptyResponse = { response: { ok: true } as any, data: { data: [] } };
const entriesResponse = { response: { ok: true } as any, data: { data: [mockEntry] } };
const totalResponse = { response: { ok: true } as any, data: { data: [mockEntry, { id: 'entry-2' }] } };

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockedApi = api as jest.Mocked<typeof api>;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('JournalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen title', async () => {
    mockedApi.get.mockResolvedValue(emptyResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('My SatsFlo Journal')).toBeTruthy();
    });
  });

  it('renders search input', async () => {
    mockedApi.get.mockResolvedValue(emptyResponse);
    const { getByPlaceholderText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByPlaceholderText('Search here')).toBeTruthy();
    });
  });

  it('renders Add New Entry button', async () => {
    mockedApi.get.mockResolvedValue(emptyResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('Add New Entry')).toBeTruthy();
    });
  });

  it('shows empty state when no entries', async () => {
    mockedApi.get.mockResolvedValue(emptyResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('No entry added')).toBeTruthy();
    });
  });

  it('renders entry title when entries exist', async () => {
    mockedApi.get.mockImplementation((path: string) =>
      path.includes('/journal') && !path.includes('?month')
        ? Promise.resolve(totalResponse)
        : Promise.resolve(entriesResponse),
    );
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('My First Entry')).toBeTruthy();
    });
  });

  it('shows Recent Entries header when entries exist', async () => {
    mockedApi.get.mockResolvedValue(entriesResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('Recent Entries')).toBeTruthy();
    });
  });

  it('shows entry count next to Recent Entries', async () => {
    mockedApi.get.mockImplementation((path: string) =>
      !path.includes('?month')
        ? Promise.resolve(totalResponse)
        : Promise.resolve(entriesResponse),
    );
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      // Format: "displayed/total" e.g. "1/2"
      expect(getByText(/\d+\/\d+/)).toBeTruthy();
    });
  });

  it('shows View all button when entries exist', async () => {
    mockedApi.get.mockResolvedValue(entriesResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => {
      expect(getByText('View all')).toBeTruthy();
    });
  });

  it('navigates to add-entry when Add New Entry is pressed', async () => {
    const { router } = require('expo-router');
    mockedApi.get.mockResolvedValue(emptyResponse);
    const { getByText } = render(<JournalScreen />);
    await waitFor(() => getByText('Add New Entry'));
    fireEvent.press(getByText('Add New Entry'));
    expect(router.push).toHaveBeenCalledWith('/add-entry');
  });

  it('navigates back when back arrow is pressed', async () => {
    const { router } = require('expo-router');
    mockedApi.get.mockResolvedValue(emptyResponse);
    render(<JournalScreen />);
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalled();
    });
    expect(router.back).not.toHaveBeenCalled();
  });

  it('calls delete API when delete is confirmed', async () => {
    mockedApi.get.mockResolvedValue(entriesResponse);
    mockedApi.delete.mockResolvedValue({ response: { ok: true } as any, data: {} });

    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const deleteButton = buttons?.find((b: any) => b.style === 'destructive');
      deleteButton?.onPress?.();
    });

    const { getByText } = render(<JournalScreen />);
    await waitFor(() => getByText('My First Entry'));
    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith(
        '/journal/entry-1',
        {},
        'mock-token',
      );
    });
  });
});
