import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { LanguageProvider, useLanguage } from "@/context/language-context";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/api", () => ({
  api: {
    put: jest.fn().mockResolvedValue({ ok: true }),
  },
}));

describe("LanguageContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  it("defaults to English translations", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("English");
    expect(result.current.t("settings.title")).toBe("Settings");
    expect(result.current.t("nav.home")).toBe("Home");
    expect(result.current.t("home.today")).toBe("Today");
  });

  it("interpolates parameters correctly in English", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t("home.period_day", { day: 4 })).toBe("Period: Day 4");
    expect(result.current.t("home.period_late_plural", { count: 3 })).toContain("3 days");
  });

  it("switches to Swahili and translates keys correctly", async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage("Swahili");
    });

    expect(result.current.language).toBe("Swahili");
    expect(result.current.isSwahili).toBe(true);
    expect(result.current.t("settings.title")).toBe("Mipangilio");
    expect(result.current.t("nav.home")).toBe("Nyumbani");
    expect(result.current.t("home.today")).toBe("Leo");
    expect(result.current.t("home.period_day", { day: 4 })).toBe("Hedhi: Siku 4");
    expect(result.current.t("settings.language_preferences")).toBe("Mapendeleo ya lugha");
  });

  it("falls back to English when a key is not found in Swahili", async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage("Swahili");
    });

    // An unknown key should return the key itself
    expect(result.current.t("non.existent.key")).toBe("non.existent.key");
  });
});
