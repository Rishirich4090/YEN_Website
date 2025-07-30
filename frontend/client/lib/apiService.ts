const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
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

  async submitContactForm(formData: ContactFormData): Promise<ApiResponse> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async createMembership(membershipData: {
    name: string;
    email: string;
    phone: string;
    membershipType: 'basic' | 'premium' | 'lifetime';
  }): Promise<ApiResponse> {
    return this.request('/membership', {
      method: 'POST',
      body: JSON.stringify(membershipData),
    });
  }

  async processDonation(donationData: {
    donorName: string;
    donorEmail: string;
    amount: number;
    currency?: string;
    donationType?: 'one-time' | 'monthly' | 'annual';
    paymentMethod: string;
    transactionId: string;
    project?: string;
    message?: string;
    isAnonymous?: boolean;
  }): Promise<ApiResponse> {
    return this.request('/membership/donation', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export default new ApiService();
export type { ContactFormData, ApiResponse };
