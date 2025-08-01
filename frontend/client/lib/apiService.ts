const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Enhanced interfaces matching backend schemas
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: 'general' | 'membership' | 'donation' | 'volunteer' | 'support' | 'feedback' | 'partnership';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source?: 'website' | 'email' | 'phone' | 'social-media' | 'event';
}

interface DonationFormData {
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
  currency?: string;
  donationType?: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
  recurringDetails?: {
    frequency?: 'monthly' | 'quarterly' | 'annual';
    endDate?: Date;
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
  isAnonymous?: boolean;
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

interface MembershipFormData {
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
  address?: string;
  dateOfBirth?: string;
  reason?: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'member' | 'admin';
  membershipType?: 'basic' | 'premium' | 'lifetime';
  address?: string;
  dateOfBirth?: Date;
  avatar?: string;
  reason?: string;
}

interface EventFormData {
  title: string;
  description: string;
  shortDescription?: string;
  startDate: Date;
  endDate: Date;
  timezone?: string;
  isAllDay?: boolean;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    venue?: {
      name?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
    };
    virtual?: {
      platform?: 'zoom' | 'teams' | 'meet' | 'webex' | 'custom';
      meetingUrl?: string;
      meetingId?: string;
      passcode?: string;
    };
    capacity?: number;
  };
  category: 'fundraising' | 'awareness' | 'volunteer' | 'educational' | 'social' | 'meeting' | 'workshop' | 'conference';
  eventType?: 'public' | 'private' | 'members-only' | 'invite-only';
  requiresRegistration?: boolean;
  registrationSettings?: {
    openDate?: Date;
    closeDate?: Date;
    maxAttendees?: number;
    allowWaitlist?: boolean;
    requireApproval?: boolean;
  };
  pricing?: {
    isFree: boolean;
    basePrice?: number;
    currency?: string;
    earlyBirdPrice?: number;
    earlyBirdDeadline?: Date;
    memberDiscount?: number;
  };
  organizer: {
    contactEmail: string;
    contactPhone?: string;
    department?: string;
  };
}

interface ChatMessageData {
  conversationId: string;
  message: string;
  messageType?: 'text' | 'image' | 'file' | 'quick-reply';
  senderType?: 'user' | 'bot' | 'admin' | 'volunteer';
  senderName?: string;
  senderEmail?: string;
  context?: {
    page?: string;
    sessionData?: Record<string, any>;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Contact API methods
  async submitContactForm(formData: ContactFormData): Promise<ApiResponse> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async getContactMessages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url, { method: 'GET' });
  }

  async updateContactStatus(messageId: string, status: string): Promise<ApiResponse> {
    return this.request(`/contact/${messageId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Membership API methods
  async createMembership(membershipData: MembershipFormData): Promise<ApiResponse> {
    return this.request('/membership', {
      method: 'POST',
      body: JSON.stringify(membershipData),
    });
  }

  async memberLogin(loginData: { loginId: string; password: string }): Promise<ApiResponse> {
    return this.request('/membership/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async getMembershipStatus(loginId: string): Promise<ApiResponse> {
    return this.request(`/membership/status/${loginId}`, { method: 'GET' });
  }

  async downloadCertificate(membershipId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/membership/certificate/${membershipId}`);
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    return response.blob();
  }

  async approveMembership(membershipId: string): Promise<ApiResponse> {
    return this.request(`/membership/approve/${membershipId}`, { method: 'POST' });
  }

  async extendMembership(membershipId: string, additionalMonths: number): Promise<ApiResponse> {
    return this.request(`/membership/extend/${membershipId}`, {
      method: 'POST',
      body: JSON.stringify({ additionalMonths }),
    });
  }

  // Donation API methods
  async createDonation(donationData: DonationFormData): Promise<ApiResponse> {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async processDonation(donationData: DonationFormData): Promise<ApiResponse> {
    return this.request('/membership/donation', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async getDonations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/donations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url, { method: 'GET' });
  }

  async getDonation(donationId: string): Promise<ApiResponse> {
    return this.request(`/donations/${donationId}`, { method: 'GET' });
  }

  async getUserDonations(email: string): Promise<ApiResponse> {
    return this.request(`/donations/user/${email}`, { method: 'GET' });
  }

  async getDonationStats(params?: { year?: number; projectId?: string }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/donations/stats/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url, { method: 'GET' });
  }

  async generateDonationCertificate(donationId: string): Promise<ApiResponse> {
    return this.request(`/donations/${donationId}/certificate`, { method: 'POST' });
  }

  async updateDonationStatus(donationId: string, status: string, notes?: string): Promise<ApiResponse> {
    return this.request(`/donations/${donationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Event API methods (placeholder for future implementation)
  async createEvent(eventData: EventFormData): Promise<ApiResponse> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getEvents(params?: { page?: number; limit?: number; category?: string }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url, { method: 'GET' });
  }

  async registerForEvent(eventId: string, registrationData: any): Promise<ApiResponse> {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  // User API methods (placeholder for future implementation)
  async createUser(userData: UserFormData): Promise<ApiResponse> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: { email: string; password: string }): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}`, { method: 'GET' });
  }

  async updateUserProfile(userId: string, userData: Partial<UserFormData>): Promise<ApiResponse> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Chat API methods (placeholder for future implementation)
  async sendChatMessage(messageData: ChatMessageData): Promise<ApiResponse> {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getChatMessages(conversationId: string): Promise<ApiResponse> {
    return this.request(`/chat/messages/${conversationId}`, { method: 'GET' });
  }

  async getActiveConversations(): Promise<ApiResponse> {
    return this.request('/chat/conversations', { method: 'GET' });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export default new ApiService();
export type { 
  ContactFormData, 
  DonationFormData, 
  MembershipFormData, 
  UserFormData, 
  EventFormData, 
  ChatMessageData, 
  ApiResponse 
};
