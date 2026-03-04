import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

export type ThemeSelection = 'system' | 'light' | 'dark';

export interface ThemeColors {
  background: string;
  navBackground: string;
  cardBackground: string;
  cardBorder: string;
  textOnDark: string;
  textOnCard: string;
  inputBackground: string;
  inputBorder: string;
  divider: string;
  accent: string;
  accentMed: string;
  accentDark: string;
  homeIndicatorBg: string;
  homeIndicator: string;
}

const lightColors: ThemeColors = {
  background: '#FF4081',
  navBackground: '#FF3378',
  cardBackground: '#FFE6EE',
  cardBorder: '#FFB3CD',
  textOnDark: '#FFFFFF',
  textOnCard: '#1E1E1E',
  inputBackground: '#FFD6E4',
  inputBorder: '#FFB3CD',
  divider: '#FFD6E8',
  accent: '#FF4081',
  accentMed: '#FF82AD',
  accentDark: '#FF3378',
  homeIndicatorBg: '#FF3378',
  homeIndicator: '#FF99BC',
};

const darkColors: ThemeColors = {
  background: '#1C0A14',
  navBackground: '#130609',
  cardBackground: '#2E1520',
  cardBorder: '#4D1E35',
  textOnDark: '#FFFFFF',
  textOnCard: '#F0F0F0',
  inputBackground: '#3A1825',
  inputBorder: '#5D2A40',
  divider: '#3A1825',
  accent: '#FF4081',
  accentMed: '#FF82AD',
  accentDark: '#CC2B61',
  homeIndicatorBg: '#130609',
  homeIndicator: '#4D1E35',
};

interface ThemeContextType {
  selectedTheme: ThemeSelection;
  setSelectedTheme: (theme: ThemeSelection) => void;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [selectedTheme, setSelectedThemeState] = useState<ThemeSelection>('system');

  // Dark mode disabled until UI development is complete — re-enable by restoring the line below:
  // const isDark = selectedTheme === 'dark' || (selectedTheme === 'system' && systemScheme === 'dark');
  const isDark = false;

  const colors = isDark ? darkColors : lightColors;

  const setSelectedTheme = (theme: ThemeSelection) => {
    setSelectedThemeState(theme);
    // Drive NativeWind dark: classes by overriding the system color scheme
    // Appearance.setColorScheme is not available on web
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(theme === 'system' ? null : theme);
    }
  };

  // Sync on mount in case system scheme is already dark
  useEffect(() => {
    if (selectedTheme === 'system' && Platform.OS !== 'web') {
      Appearance.setColorScheme(null);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
