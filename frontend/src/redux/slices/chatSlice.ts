/**
 * Chat Slice - Real-time chat state management
 * Handles chat sessions, messages, and real-time communication
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import type { 
  ChatState, 
  ChatSession, 
  ChatMessage, 
  ChatMessageData,
  ChatSessionData,
  ApiResponse 
} from '../../types';

// Initial state
const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  isConnected: false,
  isTyping: false,
  typingUsers: [],
  error: null,
  unreadCount: 0,
};

// Async thunks

/**
 * Start a new chat session
 */
export const startChatSession = createAsyncThunk<
  ChatSession,
  ChatSessionData,
  { rejectValue: string }
>(
  'chat/startSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ChatSession>(
        API_URLS.CHAT.START_SESSION, 
        sessionData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to start chat session');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to start chat session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get chat sessions for user
 */
export const getChatSessions = createAsyncThunk<
  ChatSession[],
  { page?: number; limit?: number; status?: string },
  { rejectValue: string }
>(
  'chat/getSessions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.CHAT.GET_SESSIONS}?${queryParams.toString()}`;
      const response = await apiClient.get<ChatSession[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get chat sessions');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get chat sessions';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific chat session
 */
export const getChatSession = createAsyncThunk<
  ChatSession,
  string,
  { rejectValue: string }
>(
  'chat/getSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CHAT.GET_SESSION, { id: sessionId });
      const response = await apiClient.get<ChatSession>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get chat session');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get chat session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Send a chat message
 */
export const sendChatMessage = createAsyncThunk<
  ChatMessage,
  ChatMessageData,
  { rejectValue: string }
>(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ChatMessage>(
        API_URLS.CHAT.SEND_MESSAGE, 
        messageData
      );

      if (response.success && response.data) {
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
 * Get chat messages for a session
 */
export const getChatMessages = createAsyncThunk<
  ChatMessage[],
  { sessionId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  'chat/getMessages',
  async ({ sessionId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const url = buildURL(API_URLS.CHAT.GET_MESSAGES, { id: sessionId }) + `?${params.toString()}`;
      const response = await apiClient.get<ChatMessage[]>(url);

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
 * Mark messages as read
 */
export const markMessagesAsRead = createAsyncThunk<
  void,
  { sessionId: string; messageIds: string[] },
  { rejectValue: string }
>(
  'chat/markAsRead',
  async ({ sessionId, messageIds }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CHAT.MARK_AS_READ, { id: sessionId });
      const response = await apiClient.post(url, { messageIds });

      if (!response.success) {
        throw new Error(response.message || 'Failed to mark messages as read');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to mark messages as read';
      return rejectWithValue(message);
    }
  }
);

/**
 * End chat session
 */
export const endChatSession = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'chat/endSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CHAT.END_SESSION, { id: sessionId });
      const response = await apiClient.put(url);

      if (response.success) {
        toast.success('Chat session ended successfully!');
        return sessionId;
      } else {
        throw new Error(response.message || 'Failed to end chat session');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to end chat session';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete chat message
 */
export const deleteChatMessage = createAsyncThunk<
  string,
  { sessionId: string; messageId: string },
  { rejectValue: string }
>(
  'chat/deleteMessage',
  async ({ sessionId, messageId }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.CHAT.DELETE_MESSAGE, { sessionId, messageId });
      const response = await apiClient.delete(url);

      if (response.success) {
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
 * Upload chat file/attachment
 */
export const uploadChatFile = createAsyncThunk<
  { fileUrl: string; fileName: string; fileType: string },
  { sessionId: string; file: File },
  { rejectValue: string }
>(
  'chat/uploadFile',
  async ({ sessionId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await apiClient.post<{ fileUrl: string; fileName: string; fileType: string }>(
        API_URLS.CHAT.UPLOAD_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to upload file');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to upload file';
      return rejectWithValue(message);
    }
  }
);

// Create slice
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear chat data
    clearChatData: (state) => {
      state.sessions = [];
      state.currentSession = null;
      state.messages = [];
      state.typingUsers = [];
      state.unreadCount = 0;
    },
    
    // Set current session
    setCurrentSession: (state, action: PayloadAction<ChatSession | null>) => {
      state.currentSession = action.payload;
      if (action.payload) {
        // Reset typing indicators when switching sessions
        state.typingUsers = [];
        state.isTyping = false;
      }
    },
    
    // Set connection status
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (!action.payload) {
        // Clear typing indicators when disconnected
        state.typingUsers = [];
        state.isTyping = false;
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Add new message (real-time)
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      
      // Add to messages if it's for the current session
      if (state.currentSession && message.sessionId === state.currentSession._id) {
        state.messages.push(message);
      }
      
      // Update unread count if message is not from current user and not already read
      if (!message.isRead && message.senderId !== state.currentSession?.userId) {
        state.unreadCount += 1;
      }
      
      // Update session's last message
      const sessionIndex = state.sessions.findIndex(s => s._id === message.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex].lastMessage = message;
        state.sessions[sessionIndex].updatedAt = message.createdAt;
      }
    },
    
    // Update message (real-time)
    updateMessage: (state, action: PayloadAction<ChatMessage>) => {
      const updatedMessage = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === updatedMessage._id);
      
      if (messageIndex !== -1) {
        state.messages[messageIndex] = updatedMessage;
      }
    },
    
    // Remove message
    removeMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      state.messages = state.messages.filter(m => m._id !== messageId);
    },
    
    // Set typing status
    setTypingStatus: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    
    // Add typing user
    addTypingUser: (state, action: PayloadAction<{ userId: string; userName: string }>) => {
      const { userId, userName } = action.payload;
      const existingUser = state.typingUsers.find(u => u.userId === userId);
      
      if (!existingUser) {
        state.typingUsers.push({ userId, userName });
      }
    },
    
    // Remove typing user
    removeTypingUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.typingUsers = state.typingUsers.filter(u => u.userId !== userId);
    },
    
    // Clear typing users
    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },
    
    // Update unread count
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, action.payload);
    },
    
    // Mark session messages as read
    markSessionMessagesAsRead: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      
      // Mark messages as read
      state.messages.forEach(message => {
        if (message.sessionId === sessionId && !message.isRead) {
          message.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
      
      // Update session unread count
      const sessionIndex = state.sessions.findIndex(s => s._id === sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex].unreadCount = 0;
      }
    },
    
    // Add session (real-time)
    addSession: (state, action: PayloadAction<ChatSession>) => {
      const session = action.payload;
      const existingIndex = state.sessions.findIndex(s => s._id === session._id);
      
      if (existingIndex === -1) {
        state.sessions.unshift(session);
      } else {
        state.sessions[existingIndex] = session;
      }
    },
    
    // Update session
    updateSession: (state, action: PayloadAction<ChatSession>) => {
      const updatedSession = action.payload;
      const sessionIndex = state.sessions.findIndex(s => s._id === updatedSession._id);
      
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = updatedSession;
        
        // Update current session if it's the same one
        if (state.currentSession && state.currentSession._id === updatedSession._id) {
          state.currentSession = updatedSession;
        }
      }
    },
    
    // Remove session
    removeSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      
      state.sessions = state.sessions.filter(s => s._id !== sessionId);
      
      if (state.currentSession && state.currentSession._id === sessionId) {
        state.currentSession = null;
        state.messages = [];
        state.typingUsers = [];
      }
    },
  },
  extraReducers: (builder) => {
    // Start chat session
    builder
      .addCase(startChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.sessions.unshift(action.payload);
        state.messages = [];
        state.error = null;
      })
      .addCase(startChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to start chat session';
      });

    // Get chat sessions
    builder
      .addCase(getChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        
        // Calculate total unread count
        state.unreadCount = action.payload.reduce((total, session) => 
          total + (session.unreadCount || 0), 0
        );
        
        state.error = null;
      })
      .addCase(getChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get chat sessions';
      });

    // Get specific chat session
    builder
      .addCase(getChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(getChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get chat session';
      });

    // Send chat message
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        // Message will be added via real-time update or addMessage action
        state.error = null;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.error = action.payload || 'Failed to send message';
      });

    // Get chat messages
    builder
      .addCase(getChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get messages';
      });

    // Mark messages as read
    builder
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        // Messages will be updated via real-time or other actions
        state.error = null;
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark messages as read';
      });

    // End chat session
    builder
      .addCase(endChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const sessionId = action.payload;
        
        // Update session status
        const sessionIndex = state.sessions.findIndex(s => s._id === sessionId);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].status = 'ended';
        }
        
        // Clear current session if it's the ended one
        if (state.currentSession && state.currentSession._id === sessionId) {
          state.currentSession = null;
          state.messages = [];
          state.typingUsers = [];
        }
        
        state.error = null;
      })
      .addCase(endChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to end chat session';
      });

    // Delete chat message
    builder
      .addCase(deleteChatMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        state.messages = state.messages.filter(m => m._id !== messageId);
        state.error = null;
      })
      .addCase(deleteChatMessage.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete message';
      });

    // Upload chat file
    builder
      .addCase(uploadChatFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadChatFile.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(uploadChatFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to upload file';
      });
  },
});

// Export actions
export const {
  clearError,
  clearChatData,
  setCurrentSession,
  setConnectionStatus,
  setLoading,
  addMessage,
  updateMessage,
  removeMessage,
  setTypingStatus,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  updateUnreadCount,
  markSessionMessagesAsRead,
  addSession,
  updateSession,
  removeSession,
} = chatSlice.actions;

// Export selectors
export const selectChat = (state: { chat: ChatState }) => state.chat;
export const selectChatSessions = (state: { chat: ChatState }) => state.chat.sessions;
export const selectCurrentSession = (state: { chat: ChatState }) => state.chat.currentSession;
export const selectChatMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectChatLoading = (state: { chat: ChatState }) => state.chat.isLoading;
export const selectChatConnected = (state: { chat: ChatState }) => state.chat.isConnected;
export const selectTypingUsers = (state: { chat: ChatState }) => state.chat.typingUsers;
export const selectIsTyping = (state: { chat: ChatState }) => state.chat.isTyping;
export const selectUnreadCount = (state: { chat: ChatState }) => state.chat.unreadCount;
export const selectChatError = (state: { chat: ChatState }) => state.chat.error;

// Derived selectors
export const selectActiveSessions = (state: { chat: ChatState }) =>
  state.chat.sessions.filter(session => session.status === 'active');

export const selectUnreadSessions = (state: { chat: ChatState }) =>
  state.chat.sessions.filter(session => (session.unreadCount || 0) > 0);

export const selectRecentMessages = (limit: number = 10) => (state: { chat: ChatState }) =>
  state.chat.messages.slice(-limit);

export const selectMessagesByUser = (userId: string) => (state: { chat: ChatState }) =>
  state.chat.messages.filter(message => message.senderId === userId);

export const selectHasTypingUsers = (state: { chat: ChatState }) =>
  state.chat.typingUsers.length > 0;

// Export reducer as default
export default chatSlice.reducer;
