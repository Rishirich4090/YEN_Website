// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'member' | 'volunteer';
  membershipType: 'basic' | 'premium' | 'lifetime';
  membershipStatus: 'active' | 'inactive' | 'suspended' | 'pending';
  profileImage?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth?: string;
  isEmailVerified: boolean;
  profileCompleteness: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  membershipType?: 'basic' | 'premium' | 'lifetime';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Contact Types
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'spam';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'membership' | 'donation' | 'volunteer' | 'support' | 'feedback' | 'partnership';
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}

// Donation Types
export interface Donation {
  _id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transactionId: string;
  project?: string;
  message?: string;
  isAnonymous: boolean;
  certificateSent: boolean;
  donationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationFormData {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
  paymentMethod: string;
  project?: string;
  message?: string;
  isAnonymous: boolean;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  isAllDay: boolean;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    venue?: {
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    };
    virtual?: {
      platform: string;
      meetingUrl?: string;
      meetingId?: string;
      passcode?: string;
    };
    capacity?: number;
  };
  category: 'fundraising' | 'awareness' | 'volunteer' | 'educational' | 'social' | 'meeting' | 'workshop' | 'conference';
  eventType: 'public' | 'private' | 'members-only' | 'invite-only';
  status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed';
  requiresRegistration: boolean;
  pricing: {
    isFree: boolean;
    basePrice?: number;
    currency?: string;
  };
  attendeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Chat Types
export interface ChatMessage {
  _id: string;
  conversationId: string;
  message: string;
  messageType: 'text' | 'image' | 'file' | 'quick-reply' | 'bot-response' | 'system';
  senderType: 'user' | 'bot' | 'admin' | 'volunteer';
  senderId?: string;
  senderName?: string;
  senderEmail?: string;
  isRead: boolean;
  status: 'active' | 'resolved' | 'escalated' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  updatedAt: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Redux State Types
export interface ContactState extends LoadingState {
  messages: ContactMessage[];
  currentMessage: ContactMessage | null;
}

export interface DonationState extends LoadingState {
  donations: Donation[];
  currentDonation: Donation | null;
  statistics: {
    totalAmount: number;
    totalDonations: number;
    monthlyRecurring: number;
  } | null;
}

export interface EventState extends LoadingState {
  events: Event[];
  currentEvent: Event | null;
  upcomingEvents: Event[];
}

export interface ChatState extends LoadingState {
  messages: ChatMessage[];
  conversations: string[];
  currentConversationId: string | null;
}
