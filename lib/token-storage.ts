import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// expo-secure-store doesn't support web — fall back to AsyncStorage on web.
// AsyncStorage is fine for dev; on native, SecureStore encrypts at rest.
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return storage.get(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return storage.get(REFRESH_TOKEN_KEY);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      storage.set(ACCESS_TOKEN_KEY, accessToken),
      storage.set(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      storage.remove(ACCESS_TOKEN_KEY),
      storage.remove(REFRESH_TOKEN_KEY),
    ]);
  },
};
