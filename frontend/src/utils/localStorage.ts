/**
 * LocalStorage utility functions for token and user data management
 * Provides type-safe localStorage operations with error handling
 */

const STORAGE_KEYS = {
  TOKEN: 'hopehands_auth_token',
  USER: 'hopehands_user_data',
  REFRESH_TOKEN: 'hopehands_refresh_token',
  THEME: 'hopehands_theme',
  LANGUAGE: 'hopehands_language',
} as const;

interface StorageData {
  [STORAGE_KEYS.TOKEN]: string;
  [STORAGE_KEYS.USER]: any;
  [STORAGE_KEYS.REFRESH_TOKEN]: string;
  [STORAGE_KEYS.THEME]: 'light' | 'dark';
  [STORAGE_KEYS.LANGUAGE]: string;
}

class LocalStorageManager {
  /**
   * Set item in localStorage with error handling
   */
  setItem<K extends keyof StorageData>(key: K, value: StorageData[K]): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  getItem<K extends keyof StorageData>(key: K): StorageData[K] | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;

      // Try to parse as JSON, if it fails, return as string
      try {
        return JSON.parse(item);
      } catch {
        return item as StorageData[K];
      }
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem<K extends keyof StorageData>(key: K): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all application data from localStorage
   */
  clearAll(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
const storageManager = new LocalStorageManager();

// Auth Token Management
export const tokenStorage = {
  /**
   * Save authentication token
   */
  setToken: (token: string): boolean => {
    return storageManager.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * Get authentication token
   */
  getToken: (): string | null => {
    return storageManager.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Remove authentication token
   */
  removeToken: (): boolean => {
    return storageManager.removeItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return !!storageManager.getItem(STORAGE_KEYS.TOKEN);
  },
};

// Refresh Token Management
export const refreshTokenStorage = {
  /**
   * Save refresh token
   */
  setRefreshToken: (token: string): boolean => {
    return storageManager.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    return storageManager.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Remove refresh token
   */
  removeRefreshToken: (): boolean => {
    return storageManager.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

// User Data Management
export const userStorage = {
  /**
   * Save user data
   */
  setUser: (user: any): boolean => {
    return storageManager.setItem(STORAGE_KEYS.USER, user);
  },

  /**
   * Get user data
   */
  getUser: (): any | null => {
    return storageManager.getItem(STORAGE_KEYS.USER);
  },

  /**
   * Remove user data
   */
  removeUser: (): boolean => {
    return storageManager.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Update specific user field
   */
  updateUser: (updates: Partial<any>): boolean => {
    const currentUser = userStorage.getUser();
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    return storageManager.setItem(STORAGE_KEYS.USER, updatedUser);
  },
};

// App Settings Management
export const settingsStorage = {
  /**
   * Save theme preference
   */
  setTheme: (theme: 'light' | 'dark'): boolean => {
    return storageManager.setItem(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Get theme preference
   */
  getTheme: (): 'light' | 'dark' | null => {
    return storageManager.getItem(STORAGE_KEYS.THEME);
  },

  /**
   * Save language preference
   */
  setLanguage: (language: string): boolean => {
    return storageManager.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * Get language preference
   */
  getLanguage: (): string | null => {
    return storageManager.getItem(STORAGE_KEYS.LANGUAGE);
  },
};

// Auth Session Management
export const authSession = {
  /**
   * Save complete auth session (token + user)
   */
  saveSession: (token: string, user: any, refreshToken?: string): boolean => {
    console.log('🔄 Saving Auth Session:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      userEmail: user?.email,
      hasRefreshToken: !!refreshToken 
    });
    
    const tokenSaved = tokenStorage.setToken(token);
    const userSaved = userStorage.setUser(user);
    const refreshSaved = refreshToken ? refreshTokenStorage.setRefreshToken(refreshToken) : true;

    const allSaved = tokenSaved && userSaved && refreshSaved;
    console.log('🔄 Auth Session Save Result:', { 
      tokenSaved, 
      userSaved, 
      refreshSaved, 
      allSaved 
    });

    return allSaved;
  },

  /**
   * Get complete auth session
   */
  getSession: (): { token: string | null; user: any | null; refreshToken: string | null } => {
    return {
      token: tokenStorage.getToken(),
      user: userStorage.getUser(),
      refreshToken: refreshTokenStorage.getRefreshToken(),
    };
  },

  /**
   * Clear complete auth session
   */
  clearSession: (): boolean => {
    const tokenCleared = tokenStorage.removeToken();
    const userCleared = userStorage.removeUser();
    const refreshCleared = refreshTokenStorage.removeRefreshToken();

    return tokenCleared && userCleared && refreshCleared;
  },

  /**
   * Check if user is authenticated (has both token and user data)
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.hasToken() && !!userStorage.getUser();
  },
};

// Utility functions
export const storageUtils = {
  /**
   * Check localStorage availability
   */
  isStorageAvailable: (): boolean => {
    return storageManager.isAvailable();
  },

  /**
   * Clear all application data
   */
  clearAllData: (): boolean => {
    return storageManager.clearAll();
  },

  /**
   * Get storage usage info
   */
  getStorageInfo: (): { used: number; total: number } => {
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Rough estimate of total storage (5MB is common limit)
      const total = 5 * 1024 * 1024; // 5MB in bytes
      
      return { used, total };
    } catch {
      return { used: 0, total: 0 };
    }
  },
};

export default storageManager;
