/**
 * Membership Slice - Membership state management
 * Handles membership applications, payments, and certificate generation
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import { getAuthHeaders } from '../../utils/tokenManager';
import type { ApiResponse } from '../../types';

// Membership Types
export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  hasVerificationBadge: boolean;
  joinDate: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  membershipDuration: number;
  isActive: boolean;
  lastLogin?: string;
  loginId: string;
  certificateSent: boolean;
  certificateUrl?: string;
  address?: string;
  dateOfBirth?: string;
  reason?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipFormData {
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
  address?: string;
  dateOfBirth?: string;
  reason?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface MembershipPaymentData {
  membershipType: 'basic' | 'premium' | 'lifetime';
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentProvider: string;
  memberData: MembershipFormData;
}

export interface MembershipState {
  members: Member[];
  currentMember: Member | null;
  membershipStatus: {
    membershipId?: string;
    status?: string;
    hasVerificationBadge?: boolean;
    isActive?: boolean;
  } | null;
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;
  paymentError: string | null;
  certificateUrl: string | null;
}

// Initial state
const initialState: MembershipState = {
  members: [],
  currentMember: null,
  membershipStatus: null,
  isLoading: false,
  isProcessingPayment: false,
  error: null,
  paymentError: null,
  certificateUrl: null,
};

// Async thunks

/**
 * Create membership application
 */
export const createMembership = createAsyncThunk<
  Member,
  MembershipFormData,
  { rejectValue: string }
>(
  'membership/create',
  async (membershipData, { rejectWithValue }) => {
    try {
      console.log("Creating membership application:", membershipData);
      const response = await apiClient.post<Member>(
        API_URLS.MEMBERS.BASE, 
        membershipData
      );

      if (response.success && response.data) {
        toast.success('Membership application submitted successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create membership');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create membership';
      return rejectWithValue(message);
    }
  }
);

/**
 * Process membership payment
 */
export const processMembershipPayment = createAsyncThunk<
  { member: Member; paymentId: string },
  MembershipPaymentData,
  { rejectValue: string }
>(
  'membership/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      console.log("Processing membership payment:", paymentData);
      
      // First create the membership
      const membershipResponse = await apiClient.post<Member>(
        API_URLS.MEMBERS.BASE,
        paymentData.memberData
      );

      if (!membershipResponse.success || !membershipResponse.data) {
        throw new Error('Failed to create membership');
      }

      // Simulate payment processing (replace with actual payment gateway)
      const paymentResponse = await new Promise<{ success: boolean; paymentId: string }>((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 8)}` 
          });
        }, 2000);
      });

      if (paymentResponse.success) {
        // Auto-approve membership after successful payment
        const approvalResponse = await apiClient.post(
          `/api/membership/approve/${membershipResponse.data.membershipId}`
        );

        if (approvalResponse.success) {
          toast.success('Membership payment successful! Welcome to our community!');
          return {
            member: membershipResponse.data,
            paymentId: paymentResponse.paymentId
          };
        }
      }

      throw new Error('Payment processing failed');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Payment processing failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Member login
 */
export const memberLogin = createAsyncThunk<
  { member: Member; token: string },
  { loginId: string; password: string },
  { rejectValue: string }
>(
  'membership/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ member: Member; token: string }>(
        '/api/membership/login',
        credentials
      );

      if (response.success && response.data) {
        toast.success('Login successful! Welcome back!');
        return response.data;
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
 * Get membership status
 */
export const getMembershipStatus = createAsyncThunk<
  Member,
  string,
  { rejectValue: string }
>(
  'membership/getStatus',
  async (loginId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Member>(
        `/api/membership/status/${loginId}`
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get membership status');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get membership status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Download membership certificate
 */
export const downloadMembershipCertificate = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'membership/downloadCertificate',
  async (membershipId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/membership/certificate/${membershipId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthHeaders().Authorization}`,
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `membership-certificate-${membershipId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully!');
      return url;
    } catch (error: any) {
      const message = error.message || 'Failed to download certificate';
      return rejectWithValue(message);
    }
  }
);

/**
 * Generate membership certificate
 */
export const generateMembershipCertificate = createAsyncThunk<
  { certificateUrl: string },
  string,
  { rejectValue: string }
>(
  'membership/generateCertificate',
  async (membershipId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ certificateUrl: string }>(
        `/api/membership/certificate/${membershipId}`
      );

      if (response.success && response.data) {
        toast.success('Certificate generated and sent to your email!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to generate certificate');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to generate certificate';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all members (admin only)
 */
export const getAllMembers = createAsyncThunk<
  Member[],
  { page?: number; limit?: number; status?: string },
  { rejectValue: string }
>(
  'membership/getAllMembers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.MEMBERS.GET_ALL}?${queryParams.toString()}`;
      const response = await apiClient.get<Member[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get members');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get members';
      return rejectWithValue(message);
    }
  }
);

// Create slice
export const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    
    // Clear members
    clearMembers: (state) => {
      state.members = [];
      state.currentMember = null;
    },
    
    // Set current member
    setCurrentMember: (state, action: PayloadAction<Member | null>) => {
      state.currentMember = action.payload;
    },
    
    // Set loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.isProcessingPayment = action.payload;
    },
    
    // Set payment error
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.paymentError = action.payload;
    },
    
    // Add member to the list
    addMember: (state, action: PayloadAction<Member>) => {
      state.members.unshift(action.payload);
    },
    
    // Update member in the lists
    updateMember: (state, action: PayloadAction<Member>) => {
      const memberId = action.payload._id;
      
      const memberIndex = state.members.findIndex(m => m._id === memberId);
      if (memberIndex !== -1) {
        state.members[memberIndex] = action.payload;
      }
      
      if (state.currentMember && state.currentMember._id === memberId) {
        state.currentMember = action.payload;
      }
    },
    
    // Remove member from the list
    removeMember: (state, action: PayloadAction<string>) => {
      const memberId = action.payload;
      
      state.members = state.members.filter(m => m._id !== memberId);
      
      if (state.currentMember && state.currentMember._id === memberId) {
        state.currentMember = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Create membership
    builder
      .addCase(createMembership.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.unshift(action.payload);
        state.currentMember = action.payload;
        state.error = null;
      })
      .addCase(createMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create membership';
      });

    // Process payment
    builder
      .addCase(processMembershipPayment.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
      })
      .addCase(processMembershipPayment.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        state.currentMember = action.payload.member;
        state.paymentError = null;
      })
      .addCase(processMembershipPayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || 'Payment processing failed';
      });

    // Member login
    builder
      .addCase(memberLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(memberLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload.member;
        state.error = null;
      })
      .addCase(memberLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Get membership status
    builder
      .addCase(getMembershipStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMembershipStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload;
        state.membershipStatus = {
          membershipId: action.payload.membershipId,
          status: action.payload.approvalStatus,
          hasVerificationBadge: action.payload.hasVerificationBadge,
          isActive: action.payload.isActive,
        };
        state.error = null;
      })
      .addCase(getMembershipStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get membership status';
      });

    // Download certificate
    builder
      .addCase(downloadMembershipCertificate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadMembershipCertificate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.certificateUrl = action.payload;
        state.error = null;
      })
      .addCase(downloadMembershipCertificate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to download certificate';
      });

    // Generate certificate
    builder
      .addCase(generateMembershipCertificate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateMembershipCertificate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.certificateUrl = action.payload.certificateUrl;
        state.error = null;
      })
      .addCase(generateMembershipCertificate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to generate certificate';
      });

    // Get all members
    builder
      .addCase(getAllMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
        state.error = null;
      })
      .addCase(getAllMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get members';
      });
  },
});

// Export actions
export const {
  clearError,
  clearMembers,
  setCurrentMember,
  setLoading,
  setPaymentLoading,
  setPaymentError,
  addMember,
  updateMember,
  removeMember,
} = membershipSlice.actions;

// Export selectors
export const selectMembership = (state: { membership: MembershipState }) => state.membership;
export const selectMembers = (state: { membership: MembershipState }) => state.membership.members;
export const selectCurrentMember = (state: { membership: MembershipState }) => state.membership.currentMember;
export const selectMembershipStatus = (state: { membership: MembershipState }) => state.membership.membershipStatus;
export const selectMembershipLoading = (state: { membership: MembershipState }) => state.membership.isLoading;
export const selectPaymentLoading = (state: { membership: MembershipState }) => state.membership.isProcessingPayment;
export const selectMembershipError = (state: { membership: MembershipState }) => state.membership.error;
export const selectPaymentError = (state: { membership: MembershipState }) => state.membership.paymentError;
export const selectCertificateUrl = (state: { membership: MembershipState }) => state.membership.certificateUrl;

// Derived selectors
export const selectMembersByStatus = (status: string) => (state: { membership: MembershipState }) =>
  state.membership.members.filter(member => member.approvalStatus === status);

export const selectActiveMembersCount = (state: { membership: MembershipState }) =>
  state.membership.members.filter(member => member.isActive).length;

export const selectPendingMembersCount = (state: { membership: MembershipState }) =>
  state.membership.members.filter(member => member.approvalStatus === 'pending').length;

// Export reducer as default
export default membershipSlice.reducer;
