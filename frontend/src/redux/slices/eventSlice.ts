/**
 * Event Slice - Events state management
 * Handles event management, registrations, and RSVP functionality
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { API_URLS, SUCCESS_MESSAGES, buildURL } from '../../api/config';
import type { 
  EventState, 
  Event, 
  EventFormData,
  EventRegistrationData,
  EventStats,
  ApiResponse 
} from '../../types';

// Initial state
const initialState: EventState = {
  events: [],
  userEvents: [],
  currentEvent: null,
  eventStats: null,
  isLoading: false,
  error: null,
};

// Async thunks

/**
 * Create a new event (admin/organizer)
 */
export const createEvent = createAsyncThunk<
  Event,
  EventFormData,
  { rejectValue: string }
>(
  'event/create',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Event>(
        API_URLS.EVENTS.CREATE, 
        eventData
      );

      if (response.success && response.data) {
        toast.success(SUCCESS_MESSAGES.EVENT_CREATED);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all events
 */
export const getEvents = createAsyncThunk<
  Event[],
  { 
    page?: number; 
    limit?: number; 
    status?: string; 
    category?: string;
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
  },
  { rejectValue: string }
>(
  'event/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.EVENTS.GET_ALL}?${queryParams.toString()}`;
      const response = await apiClient.get<Event[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get events');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get events';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific event by ID
 */
export const getEvent = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'event/getById',
  async (eventId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.GET_BY_ID, { id: eventId });
      const response = await apiClient.get<Event>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get event');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update event
 */
export const updateEvent = createAsyncThunk<
  Event,
  { eventId: string; eventData: Partial<EventFormData> },
  { rejectValue: string }
>(
  'event/update',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.UPDATE, { id: eventId });
      const response = await apiClient.put<Event>(url, eventData);

      if (response.success && response.data) {
        toast.success('Event updated successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete event
 */
export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'event/delete',
  async (eventId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.DELETE, { id: eventId });
      const response = await apiClient.delete(url);

      if (response.success) {
        toast.success('Event deleted successfully!');
        return eventId;
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Register for event
 */
export const registerForEvent = createAsyncThunk<
  Event,
  EventRegistrationData,
  { rejectValue: string }
>(
  'event/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.REGISTER, { id: registrationData.eventId });
      const response = await apiClient.post<Event>(url, registrationData);

      if (response.success && response.data) {
        toast.success('Successfully registered for event!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to register for event');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to register for event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Cancel event registration
 */
export const cancelEventRegistration = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'event/cancelRegistration',
  async (eventId, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.CANCEL_REGISTRATION, { id: eventId });
      const response = await apiClient.delete<Event>(url);

      if (response.success && response.data) {
        toast.success('Event registration cancelled successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to cancel registration');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to cancel registration';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get user events (registered events)
 */
export const getUserEvents = createAsyncThunk<
  Event[],
  { userId?: string; status?: string },
  { rejectValue: string }
>(
  'event/getUserEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.EVENTS.GET_USER_EVENTS}?${queryParams.toString()}`;
      const response = await apiClient.get<Event[]>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get user events');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get user events';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get event statistics
 */
export const getEventStats = createAsyncThunk<
  EventStats,
  { period?: string; eventId?: string },
  { rejectValue: string }
>(
  'event/getStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_URLS.EVENTS.GET_STATS}?${queryParams.toString()}`;
      const response = await apiClient.get<EventStats>(url);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get event statistics');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get event statistics';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update event status
 */
export const updateEventStatus = createAsyncThunk<
  Event,
  { eventId: string; status: string; notes?: string },
  { rejectValue: string }
>(
  'event/updateStatus',
  async ({ eventId, status, notes }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_URLS.EVENTS.UPDATE_STATUS, { id: eventId });
      const updateData = { status, notes };
      
      const response = await apiClient.put<Event>(url, updateData);

      if (response.success && response.data) {
        toast.success('Event status updated successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update event status');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update event status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Search events
 */
export const searchEvents = createAsyncThunk<
  Event[],
  { query: string; filters?: Record<string, any> },
  { rejectValue: string }
>(
  'event/search',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const url = `${API_URLS.EVENTS.BASE}/search?${params.toString()}`;
      const response = await apiClient.get<Event[]>(url);

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
export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear events
    clearEvents: (state) => {
      state.events = [];
      state.userEvents = [];
      state.currentEvent = null;
    },
    
    // Set current event
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Add event to the list
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload);
    },
    
    // Update event in the lists
    updateEventInList: (state, action: PayloadAction<Event>) => {
      const eventId = action.payload._id;
      
      // Update in events list
      const eventIndex = state.events.findIndex(e => e._id === eventId);
      if (eventIndex !== -1) {
        state.events[eventIndex] = action.payload;
      }
      
      // Update in user events list
      const userEventIndex = state.userEvents.findIndex(e => e._id === eventId);
      if (userEventIndex !== -1) {
        state.userEvents[userEventIndex] = action.payload;
      }
      
      // Update current event if it's the same one
      if (state.currentEvent && state.currentEvent._id === eventId) {
        state.currentEvent = action.payload;
      }
    },
    
    // Remove event from the lists
    removeEventFromList: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      
      state.events = state.events.filter(e => e._id !== eventId);
      state.userEvents = state.userEvents.filter(e => e._id !== eventId);
      
      if (state.currentEvent && state.currentEvent._id === eventId) {
        state.currentEvent = null;
      }
    },
    
    // Sort events by date
    sortEventsByDate: (state, action: PayloadAction<'asc' | 'desc'>) => {
      const sortOrder = action.payload;
      const sortFn = (a: Event, b: Event) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      };
      
      state.events.sort(sortFn);
      state.userEvents.sort(sortFn);
    },
    
    // Filter events by status
    filterEventsByStatus: (state, action: PayloadAction<string>) => {
      // This would typically be handled by refetching with filters
      // But we can update the UI state here if needed
    },
  },
  extraReducers: (builder) => {
    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.unshift(action.payload);
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create event';
      });

    // Get all events
    builder
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get events';
      });

    // Get specific event
    builder
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get event';
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update event in all relevant lists
        const eventId = action.payload._id;
        
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        
        const userEventIndex = state.userEvents.findIndex(e => e._id === eventId);
        if (userEventIndex !== -1) {
          state.userEvents[userEventIndex] = action.payload;
        }
        
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update event';
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove event from all lists
        const eventId = action.payload;
        state.events = state.events.filter(e => e._id !== eventId);
        state.userEvents = state.userEvents.filter(e => e._id !== eventId);
        
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent = null;
        }
        
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete event';
      });

    // Register for event
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the event in events list
        const eventId = action.payload._id;
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        
        // Add to user events if not already there
        const userEventExists = state.userEvents.some(e => e._id === eventId);
        if (!userEventExists) {
          state.userEvents.unshift(action.payload);
        }
        
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent = action.payload;
        }
        
        state.error = null;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to register for event';
      });

    // Cancel event registration
    builder
      .addCase(cancelEventRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelEventRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the event in events list
        const eventId = action.payload._id;
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        
        // Remove from user events
        state.userEvents = state.userEvents.filter(e => e._id !== eventId);
        
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent = action.payload;
        }
        
        state.error = null;
      })
      .addCase(cancelEventRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel registration';
      });

    // Get user events
    builder
      .addCase(getUserEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = action.payload;
        state.error = null;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user events';
      });

    // Get event stats
    builder
      .addCase(getEventStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventStats = action.payload;
        state.error = null;
      })
      .addCase(getEventStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get event statistics';
      });

    // Update event status
    builder
      .addCase(updateEventStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update event in all relevant lists
        const eventId = action.payload._id;
        
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        
        const userEventIndex = state.userEvents.findIndex(e => e._id === eventId);
        if (userEventIndex !== -1) {
          state.userEvents[userEventIndex] = action.payload;
        }
        
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update event status';
      });

    // Search events
    builder
      .addCase(searchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Search failed';
      });
  },
});

// Export actions
export const {
  clearError,
  clearEvents,
  setCurrentEvent,
  setLoading,
  addEvent,
  updateEventInList,
  removeEventFromList,
  sortEventsByDate,
  filterEventsByStatus,
} = eventSlice.actions;

// Export selectors
export const selectEvent = (state: { event: EventState }) => state.event;
export const selectEvents = (state: { event: EventState }) => state.event.events;
export const selectUserEvents = (state: { event: EventState }) => state.event.userEvents;
export const selectCurrentEvent = (state: { event: EventState }) => state.event.currentEvent;
export const selectEventStats = (state: { event: EventState }) => state.event.eventStats;
export const selectEventLoading = (state: { event: EventState }) => state.event.isLoading;
export const selectEventError = (state: { event: EventState }) => state.event.error;

// Derived selectors
export const selectEventsByStatus = (status: string) => (state: { event: EventState }) =>
  state.event.events.filter(event => event.status === status);

export const selectUpcomingEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => new Date(event.startDate) > new Date());

export const selectPastEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => new Date(event.endDate) < new Date());

export const selectActiveEvents = (state: { event: EventState }) => {
  const now = new Date();
  return state.event.events.filter(event => 
    new Date(event.startDate) <= now && new Date(event.endDate) >= now
  );
};

export const selectEventsByCategory = (category: string) => (state: { event: EventState }) =>
  state.event.events.filter(event => event.category === category);

export const selectUserRegisteredEvents = (state: { event: EventState }) =>
  state.event.userEvents.filter(event => event.registrationStatus === 'registered');

// Export reducer as default
export default eventSlice.reducer;
