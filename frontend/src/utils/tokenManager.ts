/**
 * Token Management Utility
 * Provides centralized token storage, retrieval, and authentication headers
 */

import { tokenStorage, authSession } from './localStorage';

export interface AuthHeaders {
  'Content-Type': string;
  'Authorization'?: string;
  'Accept': string;
}

/**
 * Token Management Class
 */
class TokenManager {
  private static instance: TokenManager;
  
  private constructor() {}
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Save authentication token
   */
  setToken(token: string): boolean {
    return tokenStorage.setToken(token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return tokenStorage.getToken();
  }

  /**
   * Remove authentication token
   */
  removeToken(): boolean {
    return tokenStorage.removeToken();
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return tokenStorage.hasToken();
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders(): AuthHeaders {
    const headers: AuthHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get headers for file upload requests
   */
  getFileUploadHeaders(): Partial<AuthHeaders> {
    const headers: Partial<AuthHeaders> = {
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for file uploads, let browser set it with boundary
    return headers;
  }

  /**
   * Get headers for form data requests
   */
  getFormDataHeaders(): Partial<AuthHeaders> {
    const headers: Partial<AuthHeaders> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Check if token is expired (basic check)
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Basic JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Get token payload
   */
  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }

  /**
   * Get user ID from token
   */
  getUserIdFromToken(): string | null {
    const payload = this.getTokenPayload();
    return payload?.id || payload?.userId || payload?.sub || null;
  }

  /**
   * Get user role from token
   */
  getUserRoleFromToken(): string | null {
    const payload = this.getTokenPayload();
    return payload?.role || null;
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): boolean {
    return authSession.clearSession();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authSession.isAuthenticated() && !this.isTokenExpired();
  }

  /**
   * Auto-refresh token if needed (placeholder for future implementation)
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isTokenExpired()) {
      // TODO: Implement token refresh logic
      console.warn('Token expired, refresh logic not implemented');
      return false;
    }
    return true;
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export convenient functions
export const getAuthHeaders = (): AuthHeaders => tokenManager.getAuthHeaders();
export const getFileUploadHeaders = (): Partial<AuthHeaders> => tokenManager.getFileUploadHeaders();
export const getFormDataHeaders = (): Partial<AuthHeaders> => tokenManager.getFormDataHeaders();
export const setAuthToken = (token: string): boolean => tokenManager.setToken(token);
export const getAuthToken = (): string | null => tokenManager.getToken();
export const removeAuthToken = (): boolean => tokenManager.removeToken();
export const hasAuthToken = (): boolean => tokenManager.hasToken();
export const isAuthenticated = (): boolean => tokenManager.isAuthenticated();
export const clearAuthData = (): boolean => tokenManager.clearAuth();
export const getUserIdFromToken = (): string | null => tokenManager.getUserIdFromToken();
export const getUserRoleFromToken = (): string | null => tokenManager.getUserRoleFromToken();

export default tokenManager;
