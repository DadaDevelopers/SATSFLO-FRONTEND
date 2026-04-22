import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import SignupScreen from '@/app/(auth)/signup';
import { api } from '@/lib/api';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn() }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  multiSet: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/api', () => ({ api: { post: jest.fn() } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return { __esModule: true, default: Svg, Path: () => null, Rect: () => null };
});

jest.mock('@/components/signup/input-field', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    InputField: ({ showPasswordToggle, containerClassName, ...props }: any) =>
      React.createElement(TextInput, props),
  };
});

jest.mock('@/components/signup/primary-button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    PrimaryButton: ({ title, ...props }: any) =>
      React.createElement(
        TouchableOpacity,
        props,
        React.createElement(Text, null, title),
      ),
  };
});

jest.mock('@/components/signup/checkbox', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Checkbox: ({ label, onToggle }: any) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onToggle, testID: 'agree-checkbox' },
        React.createElement(Text, null, label ?? 'I agree'),
      ),
  };
});

jest.mock('@/components/signup/title-section', () => ({
  TitleSection: () => null,
}));
jest.mock('@/components/signup/home-indicator-area', () => ({
  HomeIndicatorArea: () => null,
}));
jest.mock('@/components/signup/back-button', () => ({
  BackButton: () => null,
}));
jest.mock('@/components/terms-modal', () => ({
  TermsModal: () => null,
}));

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockedApi = api as jest.Mocked<typeof api>;

function fillValidForm(
  getByPlaceholderText: ReturnType<typeof render>['getByPlaceholderText'],
  getByTestId: ReturnType<typeof render>['getByTestId'],
) {
  fireEvent.changeText(getByPlaceholderText('Name'), 'Jane Doe');
  fireEvent.changeText(getByPlaceholderText('Email'), 'jane@example.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'Password1!');
  fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Password1!');
  fireEvent.press(getByTestId('agree-checkbox')); // toggle agreeToTerms
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders all required input fields', () => {
    const { getByPlaceholderText } = render(<SignupScreen />);
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
  });

  it('renders Sign up button and Sign In link', () => {
    const { getByText } = render(<SignupScreen />);
    expect(getByText('Sign up')).toBeTruthy();
    expect(getByText(/Sign In/)).toBeTruthy();
  });

  it('does not call API when form is incomplete', () => {
    const { getByText } = render(<SignupScreen />);
    fireEvent.press(getByText('Sign up'));
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('shows password requirements when user starts typing a password', () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    fireEvent.changeText(getByPlaceholderText('Password'), 'ab');
    expect(getByText(/8 Characters/)).toBeTruthy();
    expect(getByText(/1 Uppercase Letter/)).toBeTruthy();
  });

  it('does not call API when passwords do not match', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fireEvent.changeText(getByPlaceholderText('Name'), 'Jane');
    fireEvent.changeText(getByPlaceholderText('Email'), 'jane@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'Different1!');
    fireEvent.press(getByTestId('agree-checkbox'));
    fireEvent.press(getByText('Sign up'));
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('calls api.post with correct payload on valid form submit', async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: { data: { accessToken: 'access', refreshToken: 'refresh', user: { id: 1 } } },
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fillValidForm(getByPlaceholderText, getByTestId);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password1!',
        confirm_password: 'Password1!',
        acceptTerms: true,
      });
    });
  });

  it('shows success message on successful registration', async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: { data: { accessToken: 'access', refreshToken: 'refresh', user: { id: 1 } } },
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fillValidForm(getByPlaceholderText, getByTestId);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Account created successfully!')).toBeTruthy();
    });
  });

  it('navigates to cycle-length after successful registration', async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: { data: { accessToken: 'access', refreshToken: 'refresh', user: { id: 1 } } },
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fillValidForm(getByPlaceholderText, getByTestId);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => expect(getByText('Account created successfully!')).toBeTruthy());
    jest.runAllTimers();

    expect(mockPush).toHaveBeenCalledWith('/(auth)/cycle-length');
  });

  it('shows API error message on failed registration', async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: false, status: 400 } as any,
      data: { message: 'Email already in use' },
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fillValidForm(getByPlaceholderText, getByTestId);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Email already in use')).toBeTruthy();
    });
  });

  it('shows fallback error message when network fails', async () => {
    mockedApi.post.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, getByTestId, getByText } = render(<SignupScreen />);
    fillValidForm(getByPlaceholderText, getByTestId);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Error creating an account. Please try again.')).toBeTruthy();
    });
  });

  it('navigates to login screen on Sign In press', () => {
    const { getByText } = render(<SignupScreen />);
    fireEvent.press(getByText(/Sign In/));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/login');
  });
});
