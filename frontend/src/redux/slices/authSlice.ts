/**
 * Auth Slice - Authentication state management
 * Handles login, register, logout, and user profile management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import { authSession, userStorage, tokenStorage } from '../../utils/localStorage';
import type { 
  AuthState, 
  User, 
  LoginCredentials, 
  RegisterData, 
  ApiResponse 
} from '../../types';

// Initial state
const initialState: AuthState = {
  user: authSession.getSession().user,
  token: authSession.getSession().token,
  isAuthenticated: authSession.isAuthenticated(),
  isLoading: false,
  error: null,
};

// Async thunks

/**
 * Login user
 */
export const loginUser = createAsyncThunk<
  { user: User; token: string; refreshToken?: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>(API_URLS.AUTH.LOGIN, credentials);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // Save auth session
        authSession.saveSession(token, user, refreshToken);
        
        // Show success message
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        
        return { user, token, refreshToken };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Register user
 */
export const registerUser = createAsyncThunk<
  { user: User; token: string; refreshToken?: string },
  RegisterData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Prepare payload for backend
      const payload: any = {
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
      };
      // Optionally add membershipType if backend supports it
      if (userData.membershipType) payload.membershipType = userData.membershipType;

      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>(API_URLS.AUTH.REGISTER, payload);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        authSession.saveSession(token, user, refreshToken);
        toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        return { user, token, refreshToken };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint
      await apiClient.post(API_URLS.AUTH.LOGOUT);
      
      // Clear local storage regardless of API response
      authSession.clearSession();
      
      // Show success message
      toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (error: any) {
      // Clear local storage even if API call fails
      authSession.clearSession();
      
      const message = error.response?.data?.message || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get user profile
 */
export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<User>(API_URLS.AUTH.PROFILE);
      
      if (response.success && response.data) {
        // Update user in storage
        userStorage.setUser(response.data);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get profile');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get profile';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<User>(API_URLS.USERS.UPDATE_PROFILE, updates);
      
      if (response.success && response.data) {
        // Update user in storage
        userStorage.setUser(response.data);
        
        // Show success message
        toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

/**
 * Change password
 */
export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_URLS.AUTH.CHANGE_PASSWORD, passwordData);
      
      if (response.success) {
        // Show success message
        toast.success(SUCCESS_MESSAGES.PASSWORD_CHANGED);
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to change password';
      return rejectWithValue(message);
    }
  }
);

/**
 * Verify email
 */
export const verifyEmail = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_URLS.AUTH.VERIFY_EMAIL, { token });
      
      if (response.success) {
        toast.success('Email verified successfully!');
      } else {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Email verification failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Request password reset
 */
export const requestPasswordReset = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>(
  'auth/requestPasswordReset',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_URLS.AUTH.FORGOT_PASSWORD, { email });
      
      if (response.success) {
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset email';
      return rejectWithValue(message);
    }
  }
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk<
  void,
  { token: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_URLS.AUTH.RESET_PASSWORD, resetData);
      
      if (response.success) {
        toast.success('Password reset successfully! You can now login.');
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

// Create slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear auth state (manual logout)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      authSession.clearSession();
    },
    
    // Update user data without API call
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        userStorage.setUser(state.user);
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Initialize auth from storage (for app startup)
    initializeAuth: (state) => {
      const session = authSession.getSession();
      state.user = session.user;
      state.token = session.token;
      state.isAuthenticated = authSession.isAuthenticated();
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Clear auth even if logout API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || null;
      });

    // Get user profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get profile';
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to change password';
      });

    // Verify email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.isEmailVerified = true;
          userStorage.updateUser({ isEmailVerified: true });
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Email verification failed';
      });

    // Request password reset
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset email';
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Password reset failed';
      });
  },
});

// Export actions
export const { 
  clearError, 
  clearAuth, 
  updateUser, 
  setLoading, 
  initializeAuth 
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Export reducer as default
export default authSlice.reducer;
