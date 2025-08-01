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
  category?: 'general' | 'membership' | 'donation' | 'volunteer' | 'support' | 'feedback' | 'partnership';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source?: 'website' | 'email' | 'phone' | 'social-media' | 'event';
}

// Donation Types
export interface Donation {
  _id: string;
  // Donor Information
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Donation Details
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
  recurringDetails?: {
    frequency: 'monthly' | 'quarterly' | 'annual';
    nextPaymentDate?: Date;
    endDate?: Date;
    isActive: boolean;
  };
  
  // Payment Information
  paymentMethod: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'cryptocurrency' | 'check' | 'cash';
  paymentProvider: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'manual';
  transactionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentReference?: string;
  processingFee?: number;
  netAmount?: number;
  
  // Tax and Legal
  taxDeductible: boolean;
  taxReceiptNumber?: string;
  taxReceiptSent: boolean;
  taxReceiptSentDate?: string;
  
  // Project/Campaign Information
  project?: string;
  campaign?: string;
  designation: 'general' | 'specific-project' | 'emergency-fund' | 'education' | 'healthcare' | 'environment';
  
  // Donor Interaction
  message?: string;
  isAnonymous: boolean;
  publicDisplay: boolean;
  donorConsent: {
    marketing: boolean;
    updates: boolean;
    newsletter: boolean;
    dataProcessing: boolean;
  };
  
  // Certificates and Acknowledgments
  certificateSent: boolean;
  certificateSentDate?: string;
  acknowledgmentSent: boolean;
  acknowledgmentSentDate?: string;
  thankYouEmailSent: boolean;
  
  // Tracking and Analytics
  source: 'website' | 'mobile-app' | 'email-campaign' | 'social-media' | 'event' | 'direct-mail' | 'referral';
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceInfo?: {
    userAgent?: string;
    ipAddress?: string;
    device?: string;
    browser?: string;
  };
  
  // Internal Management
  donationDate: string;
  processedDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  internalTags: string[];
  
  // Financial Reporting
  fiscalYear: number;
  quarter: number;
  month: number;
  
  // Matching and Corporate
  isMatched: boolean;
  matchingDonation?: string;
  corporateMatching?: {
    company: string;
    matchingRatio: number;
    matchingAmount: number;
    status: 'pending' | 'approved' | 'completed';
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface DonationFormData {
  // Donor Information
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Donation Details
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
  recurringDetails?: {
    frequency: 'monthly' | 'quarterly' | 'annual';
    nextPaymentDate?: Date;
    endDate?: Date;
    isActive?: boolean;
  };
  
  // Payment Information
  paymentMethod: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'cryptocurrency' | 'check' | 'cash';
  paymentProvider?: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'manual';
  
  // Project/Campaign Information
  project?: string;
  campaign?: string;
  designation?: 'general' | 'specific-project' | 'emergency-fund' | 'education' | 'healthcare' | 'environment';
  
  // Donor Interaction
  message?: string;
  isAnonymous: boolean;
  publicDisplay?: boolean;
  donorConsent: {
    marketing: boolean;
    updates: boolean;
    newsletter: boolean;
    dataProcessing: boolean;
  };
  
  // Tracking and Analytics
  source?: 'website' | 'mobile-app' | 'email-campaign' | 'social-media' | 'event' | 'direct-mail' | 'referral';
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Tax Information
  panNumber?: string;
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

// Payment Types
export interface PaymentInitiationData {
  donationId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentVerificationData {
  donationId: string;
  paymentId: string;
  status: string;
}

// Donation Statistics
export interface DonationStats {
  total: number;
  totalAmount: number;
  byType: Record<string, number>;
  byProject: Record<string, number>;
  byMonth: Record<string, number>;
  topDonors: Array<{ email: string; totalAmount: number; donationCount: number }>;
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
  userDonations: Donation[];
  currentDonation: Donation | null;
  donationStats: DonationStats | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
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
