/**
 * Redux Store Configuration
 * Centralized state management with Redux Toolkit and persistence
 */

import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import authReducer from '../redux/slices/authSlice';
import contactReducer from '../redux/slices/contactSlice';
import donationReducer from '../redux/slices/donationSlice';
import membershipReducer from '../redux/slices/membershipSlice';
import eventReducer from '../redux/slices/eventSlice';
import chatReducer from '../redux/slices/chatSlice';

// Development middleware for logging
const createLoggerMiddleware = (): Middleware => {
  return (store) => (next) => (action: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 Redux Action: ${action.type || 'Unknown'}`);
      console.log('Previous State:', store.getState());
      console.log('Action:', action);
    }

    const result = next(action);

    if (process.env.NODE_ENV === 'development') {
      console.log('Next State:', store.getState());
      console.groupEnd();
    }

    return result;
  };
};

// Persist configuration
const persistConfig = {
  key: 'ngo-platform-root',
  storage,
  whitelist: ['auth'], // Only persist auth state for security
  blacklist: ['contact', 'donation', 'membership', 'event', 'chat'], // Don't persist these for fresh data
  transforms: [
    // Transform to ensure proper serialization
    {
      in: (inboundState: any, key: string) => {
        // console.log('Persist IN:', key, inboundState);
        return inboundState;
      },
      out: (outboundState: any, key: string) => {
        // console.log('Persist OUT:', key, outboundState);
        return outboundState;
      },
    },
  ],
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  contact: contactReducer,
  donation: donationReducer,
  membership: membershipReducer,
  event: eventReducer,
  chat: chatReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in the state
        ignoredPaths: ['auth.user.lastLoginAt'],
      },
      // Enable immutability check in development
      immutableCheck: {
        warnAfter: 128,
      },
    }).concat(
      // Add custom middleware
      process.env.NODE_ENV === 'development' ? [createLoggerMiddleware()] : []
    ),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV === 'development',
  // Preloaded state (can be used for SSR or initial state)
  preloadedState: undefined,
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export additional helper types
export type AuthState = RootState['auth'];
export type ContactState = RootState['contact'];
export type DonationState = RootState['donation'];
export type MembershipState = RootState['membership'];
export type EventState = RootState['event'];
export type ChatState = RootState['chat'];

// Export store as default
export default store;
