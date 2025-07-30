/**
 * Toast Configuration
 * Global configuration for toast notifications using react-toastify
 */

import { ToastPosition, ToastOptions } from 'react-toastify';

// Default toast configuration
export const toastConfig: ToastOptions = {
  position: 'top-right' as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

// Toast type configurations
export const toastTypes = {
  success: {
    ...toastConfig,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
  },
  error: {
    ...toastConfig,
    autoClose: 8000, // Longer duration for errors
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
    },
  },
  warning: {
    ...toastConfig,
    style: {
      background: '#F59E0B',
      color: '#FFFFFF',
    },
  },
  info: {
    ...toastConfig,
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
  },
  loading: {
    ...toastConfig,
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    style: {
      background: '#6B7280',
      color: '#FFFFFF',
    },
  },
};

// Custom toast messages
export const toastMessages = {
  // Auth messages
  auth: {
    loginSuccess: 'Welcome back! You have been successfully logged in.',
    logoutSuccess: 'You have been successfully logged out.',
    registrationSuccess: 'Account created successfully! Please check your email for verification.',
    passwordChanged: 'Password changed successfully.',
    profileUpdated: 'Profile updated successfully.',
    emailVerified: 'Email verified successfully.',
    passwordResetSent: 'Password reset link sent to your email.',
    passwordResetSuccess: 'Password reset successfully.',
    sessionExpired: 'Your session has expired. Please log in again.',
  },
  
  // Contact messages
  contact: {
    messageSent: 'Message sent successfully! We will get back to you soon.',
    messageUpdated: 'Message status updated successfully.',
    messageDeleted: 'Message deleted successfully.',
  },
  
  // Donation messages
  donation: {
    created: 'Donation created successfully!',
    paymentSuccess: 'Payment successful! Thank you for your generous donation.',
    paymentFailed: 'Payment failed. Please try again.',
    certificateGenerated: 'Donation certificate generated successfully.',
    cancelled: 'Donation cancelled successfully.',
    statusUpdated: 'Donation status updated successfully.',
  },
  
  // Event messages
  event: {
    created: 'Event created successfully!',
    updated: 'Event updated successfully!',
    deleted: 'Event deleted successfully!',
    registered: 'Successfully registered for the event!',
    registrationCancelled: 'Event registration cancelled successfully.',
    statusUpdated: 'Event status updated successfully.',
  },
  
  // Chat messages
  chat: {
    sessionStarted: 'Chat session started successfully.',
    sessionEnded: 'Chat session ended successfully.',
    messageSent: 'Message sent successfully.',
    messageDeleted: 'Message deleted successfully.',
    fileUploaded: 'File uploaded successfully.',
    connectionLost: 'Connection lost. Attempting to reconnect...',
    connectionRestored: 'Connection restored.',
  },
  
  // Generic messages
  generic: {
    loading: 'Loading...',
    saving: 'Saving...',
    deleting: 'Deleting...',
    processing: 'Processing...',
    uploadingFile: 'Uploading file...',
    success: 'Operation completed successfully.',
    error: 'An error occurred. Please try again.',
    networkError: 'Network error. Please check your connection.',
    validationError: 'Please check your input and try again.',
    permissionDenied: 'You do not have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
  },
};

// Toast utility functions
export const showSuccessToast = (message: string, options?: Partial<ToastOptions>) => {
  return {
    message,
    type: 'success' as const,
    options: { ...toastTypes.success, ...options },
  };
};

export const showErrorToast = (message: string, options?: Partial<ToastOptions>) => {
  return {
    message,
    type: 'error' as const,
    options: { ...toastTypes.error, ...options },
  };
};

export const showWarningToast = (message: string, options?: Partial<ToastOptions>) => {
  return {
    message,
    type: 'warning' as const,
    options: { ...toastTypes.warning, ...options },
  };
};

export const showInfoToast = (message: string, options?: Partial<ToastOptions>) => {
  return {
    message,
    type: 'info' as const,
    options: { ...toastTypes.info, ...options },
  };
};

export const showLoadingToast = (message: string, options?: Partial<ToastOptions>) => {
  return {
    message,
    type: 'loading' as const,
    options: { ...toastTypes.loading, ...options },
  };
};

// Toast context for managing toast state
export interface ToastContextType {
  showToast: (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' | 'loading',
    options?: Partial<ToastOptions>
  ) => void;
  hideToast: (toastId?: string | number) => void;
  clearAllToasts: () => void;
}

export default toastConfig;
