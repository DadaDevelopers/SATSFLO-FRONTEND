import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import LoginScreen from "@/app/(auth)/login";
import { api } from "@/lib/api";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  multiSet: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/api", () => ({ api: { post: jest.fn() } }));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return { __esModule: true, default: Svg, Path: () => null, Rect: () => null };
});

jest.mock("@/components/signup/input-field", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    InputField: ({ showPasswordToggle, containerClassName, ...props }: any) =>
      React.createElement(TextInput, props),
  };
});

jest.mock("@/components/signup/primary-button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    PrimaryButton: ({ title, ...props }: any) =>
      React.createElement(
        TouchableOpacity,
        props,
        React.createElement(Text, null, title),
      ),
  };
});

jest.mock("@/components/signup/title-section", () => ({
  TitleSection: () => null,
}));
jest.mock("@/components/signup/home-indicator-area", () => ({
  HomeIndicatorArea: () => null,
}));
jest.mock("@/components/signup/checkbox", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Checkbox: ({ label, onToggle }: any) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onToggle, testID: "remember-me" },
        React.createElement(Text, null, label),
      ),
  };
});

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockedApi = api as jest.Mocked<typeof api>;

function fillForm(
  getByPlaceholderText: ReturnType<typeof render>["getByPlaceholderText"],
  email = "user@example.com",
  password = "Password1!",
) {
  fireEvent.changeText(getByPlaceholderText("Email"), email);
  fireEvent.changeText(getByPlaceholderText("Password"), password);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders email and password inputs", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  it("renders Sign In and navigation links", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText(/Forgot Password/)).toBeTruthy();
    expect(getByText(/Create account/)).toBeTruthy();
  });

  it("does not call API when fields are empty", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Sign In"));
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it("calls api.post with email and password on submit", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: {
        data: {
          accessToken: "access",
          refreshToken: "refresh",
          user: { id: 1 },
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "user@example.com",
        password: "Password1!",
      });
    });
  });

  it("shows success message on successful login", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: {
        data: {
          accessToken: "access",
          refreshToken: "refresh",
          user: { id: 1 },
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(getByText("Login successful!")).toBeTruthy();
    });
  });

  it("navigates to tabs after successful login", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: {
        data: {
          accessToken: "access",
          refreshToken: "refresh",
          user: { id: 1 },
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => expect(getByText("Login successful!")).toBeTruthy());
    jest.runAllTimers();

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });

  it("shows API error message on failed login", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: false, status: 401 } as any,
      data: { message: "Invalid credentials" },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(getByText("Invalid credentials")).toBeTruthy();
    });
  });

  it("shows fallback error message when network fails", async () => {
    mockedApi.post.mockRejectedValue(new Error("Network error"));

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(getByText("Error signing in. Please try again.")).toBeTruthy();
    });
  });

  it("navigates to forgot password screen", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText(/Forgot Password/));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/forgot-password");
  });

  it("navigates to signup screen on Create account press", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText(/Create account/));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/signup");
  });
});
