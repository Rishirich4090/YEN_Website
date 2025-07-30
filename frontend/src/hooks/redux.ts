/**
 * Custom Redux Hooks
 * Type-safe hooks for accessing Redux store
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience hook for auth state
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

// Convenience hook for contact state
export const useContact = () => {
  return useAppSelector((state) => state.contact);
};

// Convenience hook for donation state
export const useDonation = () => {
  return useAppSelector((state) => state.donation);
};

// Convenience hook for event state
export const useEvent = () => {
  return useAppSelector((state) => state.event);
};

// Convenience hook for chat state
export const useChat = () => {
  return useAppSelector((state) => state.chat);
};

// Combined hooks for common operations
export const useAuthUser = () => {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
};

export const useLoadingStates = () => {
  const auth = useAuth();
  const contact = useContact();
  const donation = useDonation();
  const event = useEvent();
  const chat = useChat();

  return {
    auth: auth.isLoading,
    contact: contact.isLoading,
    donation: donation.isLoading,
    event: event.isLoading,
    chat: chat.isLoading,
    anyLoading: auth.isLoading || contact.isLoading || donation.isLoading || event.isLoading || chat.isLoading,
  };
};

export const useErrorStates = () => {
  const auth = useAuth();
  const contact = useContact();
  const donation = useDonation();
  const event = useEvent();
  const chat = useChat();

  return {
    auth: auth.error,
    contact: contact.error,
    donation: donation.error,
    event: event.error,
    chat: chat.error,
    hasErrors: !!(auth.error || contact.error || donation.error || event.error || chat.error),
  };
};
