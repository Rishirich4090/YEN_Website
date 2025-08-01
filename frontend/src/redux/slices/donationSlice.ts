/**
 * Donation Slice - Donations state management
 * Handles donations, payment processing, and donation history
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import type { 
  DonationState, 
  Donation, 
  DonationFormData,
  PaymentInitiationData,
  PaymentVerificationData,
  DonationStats,
  ApiResponse 
} from '../../types';

// Initial state
const initialState: DonationState = {
  donations: [],
  userDonations: [],
  currentDonation: null,
  donationStats: null,
  isLoading: false,
  isProcessingPayment: false,
  error: null,
  paymentError: null,
};

// Async thunks

/**
 * Create a new donation
 */
export const createDonation = createAsyncThunk<
  Donation,
  DonationFormData,
  { rejectValue: string }
>(
  'donation/create',
  async (donationData, { rejectWithValue }) => {
    try {
      console.log("Creating donation with data:", donationData);
      const response = await apiClient.post<Donation>(
        API_URLS.DONATIONS.CREATE, 
        donationData
      );

      if (response.success && response.data) {
        toast.success(SUCCESS_MESSAGES.DONATION_CREATED);

        console.log("Donation created successfully:", response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create donation');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create donation';
      return rejectWithValue(message);
    }
  }
);

/**
 * Initiate payment for donation
 */
export const initiatePayment = createAsyncThunk<
  { paymentUrl: string; transactionId: string },
  PaymentInitiationData,
  { rejectValue: string }
>(
  'donation/initiatePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ paymentUrl: string; transactionId: string }>(
        API_URLS.DONATIONS.INITIATE_PAYMENT, 
        paymentData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to initiate payment';
      return rejectWithValue(message);
    }
  }
);

/**
 * Verify payment status
 */
export const verifyPayment = createAsyncThunk<
  Donation,
  PaymentVerificationData,
  { rejectValue: string }
>(
  'donation/verifyPayment',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Donation>(
        API_URLS.DONATIONS.VERIFY_PAYMENT, 
        verificationData
      );

      if (response.success && response.data) {
        if (response.data.status === 'completed') {
          toast.success('Payment successful! Thank you for your donation.');
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Payment verification failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all donations (admin)
 */
export const getDonations = createAsyncThunk<
  Donation[],
  { page?: number; limit?: number; status?: string; sortBy?: string },
  { rejectValue: string }
>(
  'donation/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.DONATIONS.GET_ALL}?${queryParams.toString()}`;
      const response = await apiClient.get<Donation[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get donations');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get donations';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get user donations
 */
export const getUserDonations = createAsyncThunk<
  Donation[],
  { userId?: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  'donation/getUserDonations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.DONATIONS.GET_USER_DONATIONS}?${queryParams.toString()}`;
      const response = await apiClient.get<Donation[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get user donations');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get user donations';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific donation by ID
 */
export const getDonation = createAsyncThunk<
  Donation,
  string,
  { rejectValue: string }
>(
  'donation/getById',
  async (donationId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.DONATIONS.GET_BY_ID, { id: donationId });
      const response = await apiClient.get<Donation>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get donation');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get donation';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get donation statistics
 */
export const getDonationStats = createAsyncThunk<
  DonationStats,
  { period?: string; projectId?: string },
  { rejectValue: string }
>(
  'donation/getStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.DONATIONS.GET_STATS}?${queryParams.toString()}`;
      const response = await apiClient.get<DonationStats>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get donation statistics');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get donation statistics';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update donation status (admin)
 */
export const updateDonationStatus = createAsyncThunk<
  Donation,
  { donationId: string; status: string; notes?: string },
  { rejectValue: string }
>(
  'donation/updateStatus',
  async ({ donationId, status, notes }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.DONATIONS.UPDATE_STATUS, { id: donationId });
      const updateData = { status, notes };
      
      const response = await apiClient.put<Donation>(url, updateData);

      if (response.success && response.data) {
        toast.success('Donation status updated successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update donation status');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update donation status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Generate donation certificate
 */
export const generateDonationCertificate = createAsyncThunk<
  { certificateUrl: string },
  string,
  { rejectValue: string }
>(
  'donation/generateCertificate',
  async (donationId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.DONATIONS.GENERATE_CERTIFICATE, { id: donationId });
      const response = await apiClient.post<{ certificateUrl: string }>(url);

      if (response.success && response.data) {
        toast.success('Certificate generated successfully!');
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
 * Cancel donation (if pending)
 */
export const cancelDonation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'donation/cancel',
  async (donationId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.DONATIONS.CANCEL, { id: donationId });
      const response = await apiClient.delete(url);

      if (response.success) {
        toast.success('Donation cancelled successfully!');
        return donationId;
      } else {
        throw new Error(response.message || 'Failed to cancel donation');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to cancel donation';
      return rejectWithValue(message);
    }
  }
);

// Create slice
export const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    
    // Clear donations
    clearDonations: (state) => {
      state.donations = [];
      state.userDonations = [];
      state.currentDonation = null;
    },
    
    // Set current donation
    setCurrentDonation: (state, action: PayloadAction<Donation | null>) => {
      state.currentDonation = action.payload;
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
    
    // Add donation to the list
    addDonation: (state, action: PayloadAction<Donation>) => {
      state.donations.unshift(action.payload);
      state.userDonations.unshift(action.payload);
    },
    
    // Update donation in the lists
    updateDonation: (state, action: PayloadAction<Donation>) => {
      const donationId = action.payload._id;
      
      // Update in donations list
      const donationIndex = state.donations.findIndex(d => d._id === donationId);
      if (donationIndex !== -1) {
        state.donations[donationIndex] = action.payload;
      }
      
      // Update in user donations list
      const userDonationIndex = state.userDonations.findIndex(d => d._id === donationId);
      if (userDonationIndex !== -1) {
        state.userDonations[userDonationIndex] = action.payload;
      }
      
      // Update current donation if it's the same one
      if (state.currentDonation && state.currentDonation._id === donationId) {
        state.currentDonation = action.payload;
      }
    },
    
    // Remove donation from the lists
    removeDonation: (state, action: PayloadAction<string>) => {
      const donationId = action.payload;
      
      state.donations = state.donations.filter(d => d._id !== donationId);
      state.userDonations = state.userDonations.filter(d => d._id !== donationId);
      
      if (state.currentDonation && state.currentDonation._id === donationId) {
        state.currentDonation = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Create donation
    builder
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.donations.unshift(action.payload);
        state.userDonations.unshift(action.payload);
        state.currentDonation = action.payload;
        state.error = null;
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create donation';
      });

    // Initiate payment
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
      })
      .addCase(initiatePayment.fulfilled, (state) => {
        state.isProcessingPayment = false;
        state.paymentError = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || 'Failed to initiate payment';
      });

    // Verify payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        
        // Update the donation in all relevant lists
        const donationId = action.payload._id;
        
        const donationIndex = state.donations.findIndex(d => d._id === donationId);
        if (donationIndex !== -1) {
          state.donations[donationIndex] = action.payload;
        }
        
        const userDonationIndex = state.userDonations.findIndex(d => d._id === donationId);
        if (userDonationIndex !== -1) {
          state.userDonations[userDonationIndex] = action.payload;
        }
        
        if (state.currentDonation && state.currentDonation._id === donationId) {
          state.currentDonation = action.payload;
        }
        
        state.paymentError = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || 'Payment verification failed';
      });

    // Get all donations
    builder
      .addCase(getDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.donations = action.payload;
        state.error = null;
      })
      .addCase(getDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get donations';
      });

    // Get user donations
    builder
      .addCase(getUserDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDonations = action.payload;
        state.error = null;
      })
      .addCase(getUserDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user donations';
      });

    // Get specific donation
    builder
      .addCase(getDonation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDonation = action.payload;
        state.error = null;
      })
      .addCase(getDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get donation';
      });

    // Get donation stats
    builder
      .addCase(getDonationStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDonationStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.donationStats = action.payload;
        state.error = null;
      })
      .addCase(getDonationStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get donation statistics';
      });

    // Update donation status
    builder
      .addCase(updateDonationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update donation in all relevant lists
        const donationId = action.payload._id;
        
        const donationIndex = state.donations.findIndex(d => d._id === donationId);
        if (donationIndex !== -1) {
          state.donations[donationIndex] = action.payload;
        }
        
        const userDonationIndex = state.userDonations.findIndex(d => d._id === donationId);
        if (userDonationIndex !== -1) {
          state.userDonations[userDonationIndex] = action.payload;
        }
        
        if (state.currentDonation && state.currentDonation._id === donationId) {
          state.currentDonation = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateDonationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update donation status';
      });

    // Generate certificate
    builder
      .addCase(generateDonationCertificate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateDonationCertificate.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(generateDonationCertificate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to generate certificate';
      });

    // Cancel donation
    builder
      .addCase(cancelDonation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove donation from all lists
        const donationId = action.payload;
        state.donations = state.donations.filter(d => d._id !== donationId);
        state.userDonations = state.userDonations.filter(d => d._id !== donationId);
        
        if (state.currentDonation && state.currentDonation._id === donationId) {
          state.currentDonation = null;
        }
        
        state.error = null;
      })
      .addCase(cancelDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel donation';
      });
  },
});

// Export actions
export const {
  clearError,
  clearDonations,
  setCurrentDonation,
  setLoading,
  setPaymentLoading,
  setPaymentError,
  addDonation,
  updateDonation,
  removeDonation,
} = donationSlice.actions;

// Export selectors
export const selectDonation = (state: { donation: DonationState }) => state.donation;
export const selectDonations = (state: { donation: DonationState }) => state.donation.donations;
export const selectUserDonations = (state: { donation: DonationState }) => state.donation.userDonations;
export const selectCurrentDonation = (state: { donation: DonationState }) => state.donation.currentDonation;
export const selectDonationStats = (state: { donation: DonationState }) => state.donation.donationStats;
export const selectDonationLoading = (state: { donation: DonationState }) => state.donation.isLoading;
export const selectPaymentLoading = (state: { donation: DonationState }) => state.donation.isProcessingPayment;
export const selectDonationError = (state: { donation: DonationState }) => state.donation.error;
export const selectPaymentError = (state: { donation: DonationState }) => state.donation.paymentError;

// Derived selectors
export const selectDonationsByStatus = (status: string) => (state: { donation: DonationState }) =>
  state.donation.donations.filter(donation => donation.status === status);

export const selectUserDonationsByStatus = (status: string) => (state: { donation: DonationState }) =>
  state.donation.userDonations.filter(donation => donation.status === status);

export const selectCompletedDonations = (state: { donation: DonationState }) =>
  state.donation.donations.filter(donation => donation.status === 'completed');

export const selectPendingDonations = (state: { donation: DonationState }) =>
  state.donation.donations.filter(donation => donation.status === 'pending');

export const selectTotalDonationAmount = (state: { donation: DonationState }) =>
  state.donation.userDonations
    .filter(d => d.status === 'completed')
    .reduce((total, donation) => total + donation.amount, 0);

// Export reducer as default
export default donationSlice.reducer;
