import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { TextInput } from "react-native";

import EnterCodeScreen from "@/app/(tabs)/enter-code";
import { api } from "@/lib/api";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue("mock-token"),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/api", () => ({ api: { post: jest.fn() } }));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@expo/vector-icons", () => ({ Feather: () => null }));

// ── Helpers ────────────────────────────────────────────────────────────────────

import { router, useLocalSearchParams } from "expo-router";
const mockedRouter = router as jest.Mocked<typeof router>;
const mockedParams = useLocalSearchParams as jest.Mock;
const mockedApi = api as jest.Mocked<typeof api>;

function fillCode(
  getAllByType: ReturnType<typeof render>["UNSAFE_getAllByType"],
  code = "A1B2C3",
) {
  const inputs = getAllByType(TextInput);
  code.split("").forEach((char, i) => {
    fireEvent.changeText(inputs[i], char);
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("EnterCodeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockedParams.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders CODE label and 6 input slots", () => {
    const { getByText, UNSAFE_getAllByType } = render(<EnterCodeScreen />);
    expect(getByText("CODE")).toBeTruthy();
    expect(UNSAFE_getAllByType(TextInput)).toHaveLength(6);
  });

  it("renders the Connect button", () => {
    const { getByText } = render(<EnterCodeScreen />);
    expect(getByText("Connect")).toBeTruthy();
  });

  it("does not call API when code is incomplete", async () => {
    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    // Fill only 3 of 6 slots
    const inputs = UNSAFE_getAllByType(TextInput);
    fireEvent.changeText(inputs[0], "A");
    fireEvent.changeText(inputs[1], "B");
    fireEvent.changeText(inputs[2], "C");

    fireEvent.press(getByText("Connect"));
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it("calls api.post with joined code on Connect when all slots filled", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: {},
    });

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/partner/accept",
        { invite_code: "A1B2C3" },
        "mock-token",
      );
    });
  });

  it("navigates to whats-your-partner-name on successful connect", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: true } as any,
      data: {},
    });

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(mockedRouter.push).toHaveBeenCalledWith(
        "/(tabs)/whats-your-partner-name",
      );
    });
  });

  it("shows API error message on failed connect", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: false } as any,
      data: { message: "Invalid or expired code" },
    });

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(getByText("Code not found. Double-check the code and try again.")).toBeTruthy();
    });
  });

  it("shows fallback error when API has no message", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: false, status: 400 } as any,
      data: {},
    });

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(getByText("Could not connect. Please try again.")).toBeTruthy();
    });
  });

  it("shows session expired error when no token", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(getByText("Session expired. Please log in again.")).toBeTruthy();
    });
  });

  it("shows network error when request throws", async () => {
    mockedApi.post.mockRejectedValue(new Error("Network error"));

    const { UNSAFE_getAllByType, getByText } = render(<EnterCodeScreen />);
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => {
      expect(getByText(/Could not connect/)).toBeTruthy();
    });
  });

  it("dismisses error message when ✕ is pressed", async () => {
    mockedApi.post.mockResolvedValue({
      response: { ok: false } as any,
      data: { message: "Bad code" },
    });

    const { UNSAFE_getAllByType, getByText, queryByText } = render(
      <EnterCodeScreen />,
    );
    fillCode(UNSAFE_getAllByType);
    fireEvent.press(getByText("Connect"));

    await waitFor(() => expect(getByText("Bad code")).toBeTruthy());
    fireEvent.press(getByText("✕"));
    expect(queryByText("Bad code")).toBeNull();
  });

  it("pre-fills code slots from deep link code param", () => {
    mockedParams.mockReturnValue({ code: "XY9Z12" });
    const { UNSAFE_getAllByType } = render(<EnterCodeScreen />);
    const inputs = UNSAFE_getAllByType(TextInput);
    expect(inputs[0].props.value).toBe("X");
    expect(inputs[1].props.value).toBe("Y");
    expect(inputs[2].props.value).toBe("9");
    expect(inputs[3].props.value).toBe("Z");
    expect(inputs[4].props.value).toBe("1");
    expect(inputs[5].props.value).toBe("2");
  });
});
