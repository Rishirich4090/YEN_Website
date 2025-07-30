/**
 * Contact Slice - Contact messages state management
 * Handles sending messages and viewing contact history
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import type { 
  ContactState, 
  ContactMessage, 
  ContactFormData,
  ApiResponse 
} from '../../types';

// Initial state
const initialState: ContactState = {
  messages: [],
  currentMessage: null,
  isLoading: false,
  error: null,
};

// Async thunks

/**
 * Send contact message
 */
export const sendContactMessage = createAsyncThunk<
  ContactMessage,
  ContactFormData,
  { rejectValue: string }
>(
  'contact/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ContactMessage>(
        API_URLS.CONTACT.SEND_MESSAGE, 
        messageData
      );

      if (response.success && response.data) {
        // Show success message
        toast.success(SUCCESS_MESSAGES.MESSAGE_SENT);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to send message';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get contact messages (for authenticated users/admins)
 */
export const getContactMessages = createAsyncThunk<
  ContactMessage[],
  { page?: number; limit?: number; status?: string; priority?: string },
  { rejectValue: string }
>(
  'contact/getMessages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.CONTACT.GET_MESSAGES}?${queryParams.toString()}`;
      const response = await apiClient.get<ContactMessage[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get messages');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get messages';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific contact message by ID
 */
export const getContactMessage = createAsyncThunk<
  ContactMessage,
  string,
  { rejectValue: string }
>(
  'contact/getMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CONTACT.GET_MESSAGE, { id: messageId });
      const response = await apiClient.get<ContactMessage>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get message');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get message';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update contact message status
 */
export const updateContactMessageStatus = createAsyncThunk<
  ContactMessage,
  { messageId: string; status: string; response?: string },
  { rejectValue: string }
>(
  'contact/updateMessageStatus',
  async ({ messageId, status, response }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CONTACT.UPDATE_STATUS, { id: messageId });
      const updateData = { status, response };
      
      const apiResponse = await apiClient.put<ContactMessage>(url, updateData);

      if (apiResponse.success && apiResponse.data) {
        toast.success('Message status updated successfully!');
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Failed to update message status');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update message status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete contact message
 */
export const deleteContactMessage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'contact/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CONTACT.DELETE_MESSAGE, { id: messageId });
      const response = await apiClient.delete(url);

      if (response.success) {
        toast.success('Message deleted successfully!');
        return messageId;
      } else {
        throw new Error(response.message || 'Failed to delete message');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete message';
      return rejectWithValue(message);
    }
  }
);

/**
 * Search contact messages
 */
export const searchContactMessages = createAsyncThunk<
  ContactMessage[],
  { query: string; filters?: Record<string, any> },
  { rejectValue: string }
>(
  'contact/searchMessages',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const url = `${API_URLS.CONTACT.BASE}/search?${params.toString()}`;
      const response = await apiClient.get<ContactMessage[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Search failed';
      return rejectWithValue(message);
    }
  }
);

// Create slice
export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
      state.currentMessage = null;
    },
    
    // Set current message
    setCurrentMessage: (state, action: PayloadAction<ContactMessage | null>) => {
      state.currentMessage = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Add message to the list (for real-time updates)
    addMessage: (state, action: PayloadAction<ContactMessage>) => {
      state.messages.unshift(action.payload);
    },
    
    // Update message in the list
    updateMessage: (state, action: PayloadAction<ContactMessage>) => {
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
      
      if (state.currentMessage && state.currentMessage._id === action.payload._id) {
        state.currentMessage = action.payload;
      }
    },
    
    // Remove message from the list
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
      
      if (state.currentMessage && state.currentMessage._id === action.payload) {
        state.currentMessage = null;
      }
    },
    
    // Filter messages by status
    filterMessagesByStatus: (state, action: PayloadAction<string>) => {
      // This would typically be handled by refetching with filters
      // But we can update the UI state here if needed
    },
  },
  extraReducers: (builder) => {
    // Send contact message
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.unshift(action.payload);
        state.error = null;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send message';
      });

    // Get contact messages
    builder
      .addCase(getContactMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getContactMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getContactMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get messages';
      });

    // Get specific contact message
    builder
      .addCase(getContactMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getContactMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMessage = action.payload;
        state.error = null;
      })
      .addCase(getContactMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get message';
      });

    // Update contact message status
    builder
      .addCase(updateContactMessageStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContactMessageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the message in the list
        const index = state.messages.findIndex(msg => msg._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        
        // Update current message if it's the same one
        if (state.currentMessage && state.currentMessage._id === action.payload._id) {
          state.currentMessage = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateContactMessageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update message status';
      });

    // Delete contact message
    builder
      .addCase(deleteContactMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove message from the list
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
        
        // Clear current message if it was deleted
        if (state.currentMessage && state.currentMessage._id === action.payload) {
          state.currentMessage = null;
        }
        
        state.error = null;
      })
      .addCase(deleteContactMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete message';
      });

    // Search contact messages
    builder
      .addCase(searchContactMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchContactMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(searchContactMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Search failed';
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessages,
  setCurrentMessage,
  setLoading,
  addMessage,
  updateMessage,
  removeMessage,
  filterMessagesByStatus,
} = contactSlice.actions;

// Export selectors
export const selectContact = (state: { contact: ContactState }) => state.contact;
export const selectContactMessages = (state: { contact: ContactState }) => state.contact.messages;
export const selectCurrentMessage = (state: { contact: ContactState }) => state.contact.currentMessage;
export const selectContactLoading = (state: { contact: ContactState }) => state.contact.isLoading;
export const selectContactError = (state: { contact: ContactState }) => state.contact.error;

// Derived selectors
export const selectMessagesByStatus = (status: string) => (state: { contact: ContactState }) =>
  state.contact.messages.filter(message => message.status === status);

export const selectMessagesByPriority = (priority: string) => (state: { contact: ContactState }) =>
  state.contact.messages.filter(message => message.priority === priority);

export const selectUnreadMessages = (state: { contact: ContactState }) =>
  state.contact.messages.filter(message => message.status === 'new');

// Export reducer as default
export default contactSlice.reducer;
