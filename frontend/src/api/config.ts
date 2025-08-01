/**
 * API Configuration and Constants
 * Centralized configuration for all API endpoints and settings
 */

// Environment-based configuration for Vite
const getBaseURL = (): string => {
  const env = import.meta.env.MODE || 'development';
  const viteBaseUrl = import.meta.env.VITE_API_BASE_URL;
  switch (env) {
    case 'production':
      return viteBaseUrl || 'https://api.hopehands.org';
    case 'staging':
      return viteBaseUrl || 'https://staging-api.hopehands.org';
    default:
      return viteBaseUrl || 'http://localhost:5000';
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  API_VERSION: '/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Complete API URLs
export const API_URLS = {
  // Base API URL
  BASE: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },
  
  // User management endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    DEACTIVATE: '/users/deactivate',
    DELETE: '/users/delete',
  },
  
  // Contact endpoints
  CONTACT: {
    BASE: '/contact',
    SEND_MESSAGE: '/contact/message',
    GET_MESSAGES: '/contact/messages',
    GET_MESSAGE: '/contact/messages/:id',
    UPDATE_STATUS: '/contact/messages/:id/status',
    DELETE_MESSAGE: '/contact/messages/:id',
  },
  
  // Donation endpoints
  DONATIONS: {
    BASE: '/donations',
    CREATE: '/donations',
    GET_ALL: '/donations',
    GET_BY_ID: '/donations/:id',
    GET_USER_DONATIONS: '/donations/user/:email',
    GET_STATS: '/donations/stats/summary',
    UPDATE_STATUS: '/donations/:id/status',
    GENERATE_CERTIFICATE: '/donations/:id/certificate',
    INITIATE_PAYMENT: '/donations/:id/payment/initiate',
    VERIFY_PAYMENT: '/donations/:id/payment/verify',
    CANCEL: '/donations/:id',
    RECURRING: '/donations/recurring',
    CANCEL_RECURRING: '/donations/recurring/:id/cancel',
  },
  
  // Event endpoints
  EVENTS: {
    BASE: '/events',
    CREATE: '/events',
    GET_ALL: '/events',
    GET_BY_ID: '/events/:id',
    UPDATE: '/events/:id',
    DELETE: '/events/:id',
    UPCOMING: '/events/upcoming',
    BY_CATEGORY: '/events/category/:category',
    REGISTER: '/events/:id/register',
    UNREGISTER: '/events/:id/unregister',
    CHECK_IN: '/events/:id/checkin',
    ANNOUNCEMENTS: '/events/:id/announcements',
  },
  
  // Chat endpoints
  CHAT: {
    BASE: '/chat',
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/conversations/:conversationId/messages',
    SEND_MESSAGE: '/chat/conversations/:conversationId/messages',
    MARK_READ: '/chat/conversations/:conversationId/read',
    START_CONVERSATION: '/chat/conversations',
    GET_UNREAD: '/chat/unread',
    SEARCH: '/chat/search',
  },
  
  // Member endpoints
  MEMBERS: {
    BASE: '/members',
    GET_ALL: '/members',
    GET_BY_ID: '/members/:id',
    UPDATE: '/members/:id',
    UPGRADE_MEMBERSHIP: '/members/:id/upgrade',
    CANCEL_MEMBERSHIP: '/members/:id/cancel',
    ACTIVITY: '/members/:id/activity',
    CERTIFICATES: '/members/:id/certificates',
  },
  
  // Admin endpoints
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
  },
  
  // File upload endpoints
  UPLOAD: {
    BASE: '/upload',
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
    EVENT_IMAGE: '/upload/event-image',
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    GET_ALL: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
    PREFERENCES: '/notifications/preferences',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  DONATION_CREATED: 'Donation created successfully!',
  DONATION_SUCCESS: 'Donation completed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  CERTIFICATE_GENERATED: 'Certificate generated successfully!',
  EVENT_REGISTERED: 'Successfully registered for event!',
  EVENT_UNREGISTERED: 'Successfully unregistered from event!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  NOTIFICATION_READ: 'Notification marked as read!',
} as const;

// Request Configuration
export const REQUEST_CONFIG = {
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Headers for file upload
  UPLOAD_HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
  
  // Timeout configurations
  TIMEOUTS: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 60000,  // 60 seconds for file uploads
    LONG_POLLING: 120000, // 2 minutes for long polling
  },
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000,
    EXPONENTIAL_BACKOFF: true,
  },
} as const;

// Helper function to build complete URL
export const buildURL = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_URLS.BASE}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return url;
};

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function to check if error is retryable
export const isRetryableError = (error: any): boolean => {
  if (!error.response) return true; // Network errors are retryable
  
  const status = error.response.status;
  return status >= 500 || status === HTTP_STATUS.TOO_MANY_REQUESTS;
};

// Export commonly used combinations
export const ENDPOINTS = {
  // Auth endpoints with full URLs
  LOGIN: buildURL(API_URLS.AUTH.LOGIN),
  REGISTER: buildURL(API_URLS.AUTH.REGISTER),
  LOGOUT: buildURL(API_URLS.AUTH.LOGOUT),
  REFRESH_TOKEN: buildURL(API_URLS.AUTH.REFRESH),
  
  // Contact endpoints
  SEND_CONTACT: buildURL(API_URLS.CONTACT.SEND_MESSAGE),
  GET_CONTACTS: buildURL(API_URLS.CONTACT.GET_MESSAGES),
  
  // Donation endpoints
  CREATE_DONATION: buildURL(API_URLS.DONATIONS.CREATE),
  GET_DONATIONS: buildURL(API_URLS.DONATIONS.GET_ALL),
  DONATION_STATS: buildURL(API_URLS.DONATIONS.GET_STATS),
  
  // Event endpoints
  GET_EVENTS: buildURL(API_URLS.EVENTS.GET_ALL),
  UPCOMING_EVENTS: buildURL(API_URLS.EVENTS.UPCOMING),
  
  // Chat endpoints
  GET_CONVERSATIONS: buildURL(API_URLS.CHAT.CONVERSATIONS),
  START_CHAT: buildURL(API_URLS.CHAT.START_CONVERSATION),
} as const;
