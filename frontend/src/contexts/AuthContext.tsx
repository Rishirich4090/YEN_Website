/**
 * AuthContext - Centralized authentication state management
 * Provides authentication context for role-based access control
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser, getUserProfile } from '../redux/slices/authSlice';
import { tokenStorage, authSession } from '../utils/localStorage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  hasRole: (role: 'admin' | 'member') => boolean;
  isAdmin: () => boolean;
  isMember: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthProvider: Initializing auth...');
        
        // First, initialize Redux state from localStorage
        const { initializeAuth } = await import('../redux/slices/authSlice');
        dispatch(initializeAuth());
        
        // Small delay to ensure Redux state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🔄 AuthProvider: Auth initialized successfully');
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        // Clear invalid session on error
        authSession.clearSession();
      } finally {
        setIsInitialized(true);
        console.log('🔄 AuthProvider: Initialization complete');
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<void> => {
    const { loginUser } = await import('../redux/slices/authSlice');
    await dispatch(loginUser({ email, password })).unwrap();
  };

  const logout = async (): Promise<void> => {
    await dispatch(logoutUser()).unwrap();
  };

  const checkAuth = (): void => {
    dispatch(getUserProfile());
  };

  const hasRole = (role: 'admin' | 'member'): boolean => {
    return auth.user?.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isMember = (): boolean => {
    return hasRole('member');
  };

  const contextValue: AuthContextType = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || !isInitialized,
    error: auth.error,
    login,
    logout,
    checkAuth,
    hasRole,
    isAdmin,
    isMember,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
