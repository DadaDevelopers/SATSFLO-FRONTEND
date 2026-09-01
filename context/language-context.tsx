import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import en from "../locales/en.json";
import sw from "../locales/sw.json";

export type SupportedLanguage = "English" | "Swahili";

type Translations = typeof en;

const translations: Record<SupportedLanguage, Translations> = {
  English: en,
  Swahili: sw,
};

const STORAGE_KEY = "app_language";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isSwahili: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split(".");
  let current: any = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("English");
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted language on mount
  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "English" || stored === "Swahili") {
          setLanguageState(stored);
        } else {
          // Check if user has language set in profile
          const userJson = await AsyncStorage.getItem("user");
          if (userJson) {
            const user = JSON.parse(userJson);
            if (user?.language === "English" || user?.language === "Swahili") {
              setLanguageState(user.language);
              await AsyncStorage.setItem(STORAGE_KEY, user.language);
            }
          }
        }
      } catch {
        // Fallback to English
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredLanguage();
  }, []);

  const setLanguage = useCallback(
    async (newLang: SupportedLanguage) => {
      setLanguageState(newLang);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, newLang);
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          api.put("/users/profile", { language: newLang }, token).catch(() => {});
        }
      } catch {}
    },
    [],
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const activeDict = translations[language] || translations.English;
      let text = getNestedValue(activeDict, key);

      // Fallback to English if missing in chosen language
      if (!text && language !== "English") {
        text = getNestedValue(translations.English, key);
      }

      if (!text) {
        return key;
      }

      // Replace interpolation tokens like {{day}} or {{count}}
      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text!.replace(
            new RegExp(`{{\\s*${paramKey}\\s*}}`, "g"),
            String(val),
          );
        });
      }

      return text;
    },
    [language],
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isSwahili: language === "Swahili",
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
