import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IEvent extends Document {
  // Basic Event Information
  title: string;
  description: string;
  shortDescription?: string;
  
  // Event Scheduling
  startDate: Date;
  endDate: Date;
  timezone: string;
  isAllDay: boolean;
  
  // Location Information
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
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    virtual?: {
      platform: 'zoom' | 'teams' | 'meet' | 'webex' | 'custom';
      meetingUrl?: string;
      meetingId?: string;
      passcode?: string;
      dialInNumber?: string;
    };
    capacity?: number;
    accessibilityFeatures?: string[];
  };
  
  // Event Details
  category: 'fundraising' | 'awareness' | 'volunteer' | 'educational' | 'social' | 'meeting' | 'workshop' | 'conference';
  eventType: 'public' | 'private' | 'members-only' | 'invite-only';
  tags: string[];
  
  // Registration and RSVP
  requiresRegistration: boolean;
  registrationSettings: {
    openDate?: Date;
    closeDate?: Date;
    maxAttendees?: number;
    allowWaitlist: boolean;
    requireApproval: boolean;
    collectAdditionalInfo: boolean;
    customFields?: Array<{
      fieldName: string;
      fieldType: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'textarea';
      isRequired: boolean;
      options?: string[]; // For select fields
    }>;
  };
  
  // Pricing Information
  pricing: {
    isFree: boolean;
    basePrice?: number;
    currency?: string;
    earlyBirdPrice?: number;
    earlyBirdDeadline?: Date;
    memberDiscount?: number;
    groupDiscounts?: Array<{
      minQuantity: number;
      discountPercent: number;
    }>;
  };
  
  // Content and Media
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  
  // Organizer Information
  organizer: {
    primaryContact: mongoose.Types.ObjectId;
    coOrganizers?: mongoose.Types.ObjectId[];
    department?: string;
    contactEmail: string;
    contactPhone?: string;
  };
  
  // Status and Workflow
  status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed';
  visibility: 'public' | 'unlisted' | 'private';
  publishDate?: Date;
  
  // Attendance Tracking
  rsvps: Array<{
    userId?: mongoose.Types.ObjectId;
    guestInfo?: {
      name: string;
      email: string;
      phone?: string;
    };
    status: 'attending' | 'not-attending' | 'maybe' | 'waitlist';
    responseDate: Date;
    additionalInfo?: Record<string, any>;
    ticketType?: string;
    paymentStatus?: 'pending' | 'completed' | 'refunded';
    checkInStatus?: 'checked-in' | 'no-show';
    checkInTime?: Date;
    companions?: number; // Number of additional people they're bringing
  }>;
  
  // Communication
  announcements: Array<{
    title: string;
    message: string;
    sentAt: Date;
    sentBy: mongoose.Types.ObjectId;
    recipientType: 'all' | 'attending' | 'not-attending' | 'waitlist';
  }>;
  
  // Follow-up and Feedback
  followUp: {
    surveyUrl?: string;
    thankYouMessage?: string;
    certificateTemplate?: string;
    sendCertificates: boolean;
  };
  
  // Analytics
  analytics: {
    views: number;
    uniqueViews: number;
    registrationConversionRate?: number;
    attendanceRate?: number;
    satisfactionScore?: number;
  };
  
  // SEO and Marketing
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  // Internal Management
  budget?: {
    estimatedCost: number;
    actualCost?: number;
    revenue?: number;
    profitLoss?: number;
  };
  
  notes?: string;
  internalTags: string[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  addRSVP(rsvpData: any): Promise<IEvent>;
  updateRSVP(userId: mongoose.Types.ObjectId, status: string): Promise<IEvent>;
  checkInAttendee(userId: mongoose.Types.ObjectId): Promise<IEvent>;
  getAttendeeCount(): number;
  getWaitlistCount(): number;
  isRegistrationOpen(): boolean;
  canAcceptMoreAttendees(): boolean;
  sendAnnouncement(announcement: any): Promise<IEvent>;
  calculateAttendanceRate(): number;
}

// Interface for static model methods
export interface IEventModel extends mongoose.Model<IEvent> {
  getUpcomingEvents(limit?: number): Promise<IEvent[]>;
  getEventsByCategory(category: string): Promise<IEvent[]>;
  getEventsByDate(startDate: Date, endDate: Date): Promise<IEvent[]>;
  getPopularEvents(limit?: number): Promise<IEvent[]>;
  searchEvents(query: string, filters?: any): Promise<IEvent[]>;
  getEventStatistics(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
    averageAttendance: number;
    topCategories: Array<{ category: string; count: number }>;
    monthlyEventCount: Record<string, number>;
  }>;
  getOrganizerEvents(organizerId: mongoose.Types.ObjectId): Promise<IEvent[]>;
}

const eventSchema = new Schema<IEvent>({
  // Basic Event Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [5, 'Event title must be at least 5 characters long'],
    maxlength: [200, 'Event title cannot exceed 200 characters'],
    index: true
  },
  
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    minlength: [20, 'Event description must be at least 20 characters long'],
    maxlength: [5000, 'Event description cannot exceed 5000 characters']
  },
  
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  
  // Event Scheduling
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    index: true
  },
  
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(this: IEvent, endDate: Date) {
        return endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    },
    index: true
  },
  
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    default: 'America/New_York'
  },
  
  isAllDay: {
    type: Boolean,
    default: false
  },
  
  // Location Information
  location: {
    type: {
      type: String,
      enum: {
        values: ['physical', 'virtual', 'hybrid'],
        message: '{VALUE} is not a valid location type'
      },
      required: [true, 'Location type is required']
    },
    
    venue: {
      name: { 
        type: String, 
        trim: true,
        maxlength: [200, 'Venue name cannot exceed 200 characters']
      },
      address: {
        street: { 
          type: String, 
          trim: true,
          maxlength: [200, 'Street cannot exceed 200 characters']
        },
        city: { 
          type: String, 
          trim: true,
          maxlength: [100, 'City cannot exceed 100 characters']
        },
        state: { 
          type: String, 
          trim: true,
          maxlength: [100, 'State cannot exceed 100 characters']
        },
        zipCode: { 
          type: String, 
          trim: true,
          maxlength: [20, 'Zip code cannot exceed 20 characters']
        },
        country: { 
          type: String, 
          trim: true,
          maxlength: [100, 'Country cannot exceed 100 characters'],
          default: 'United States'
        }
      },
      coordinates: {
        latitude: { 
          type: Number,
          min: [-90, 'Latitude must be between -90 and 90'],
          max: [90, 'Latitude must be between -90 and 90']
        },
        longitude: { 
          type: Number,
          min: [-180, 'Longitude must be between -180 and 180'],
          max: [180, 'Longitude must be between -180 and 180']
        }
      }
    },
    
    virtual: {
      platform: {
        type: String,
        enum: {
          values: ['zoom', 'teams', 'meet', 'webex', 'custom'],
          message: '{VALUE} is not a valid platform'
        }
      },
      meetingUrl: { 
        type: String, 
        trim: true,
        validate: {
          validator: function(url: string) {
            if (!url) return true; // Optional field
            return validator.isURL(url);
          },
          message: 'Please provide a valid meeting URL'
        }
      },
      meetingId: { 
        type: String, 
        trim: true,
        maxlength: [100, 'Meeting ID cannot exceed 100 characters']
      },
      passcode: { 
        type: String, 
        trim: true,
        maxlength: [50, 'Passcode cannot exceed 50 characters']
      },
      dialInNumber: { 
        type: String, 
        trim: true,
        maxlength: [50, 'Dial-in number cannot exceed 50 characters']
      }
    },
    
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      max: [100000, 'Capacity cannot exceed 100,000']
    },
    
    accessibilityFeatures: [{
      type: String,
      trim: true,
      maxlength: [100, 'Accessibility feature cannot exceed 100 characters']
    }]
  },
  
  // Event Details
  category: {
    type: String,
    enum: {
      values: ['fundraising', 'awareness', 'volunteer', 'educational', 'social', 'meeting', 'workshop', 'conference'],
      message: '{VALUE} is not a valid category'
    },
    required: [true, 'Event category is required'],
    index: true
  },
  
  eventType: {
    type: String,
    enum: {
      values: ['public', 'private', 'members-only', 'invite-only'],
      message: '{VALUE} is not a valid event type'
    },
    default: 'public',
    index: true
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Registration and RSVP
  requiresRegistration: {
    type: Boolean,
    default: true
  },
  
  registrationSettings: {
    openDate: Date,
    closeDate: Date,
    maxAttendees: {
      type: Number,
      min: [1, 'Max attendees must be at least 1']
    },
    allowWaitlist: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    collectAdditionalInfo: {
      type: Boolean,
      default: false
    },
    customFields: [{
      fieldName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Field name cannot exceed 100 characters']
      },
      fieldType: {
        type: String,
        enum: ['text', 'email', 'phone', 'select', 'checkbox', 'textarea'],
        required: true
      },
      isRequired: {
        type: Boolean,
        default: false
      },
      options: [{
        type: String,
        trim: true,
        maxlength: [100, 'Option cannot exceed 100 characters']
      }]
    }]
  },
  
  // Pricing Information
  pricing: {
    isFree: {
      type: Boolean,
      default: true
    },
    basePrice: {
      type: Number,
      min: [0, 'Base price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    earlyBirdPrice: {
      type: Number,
      min: [0, 'Early bird price cannot be negative']
    },
    earlyBirdDeadline: Date,
    memberDiscount: {
      type: Number,
      min: [0, 'Member discount cannot be negative'],
      max: [100, 'Member discount cannot exceed 100%']
    },
    groupDiscounts: [{
      minQuantity: {
        type: Number,
        required: true,
        min: [2, 'Minimum quantity must be at least 2']
      },
      discountPercent: {
        type: Number,
        required: true,
        min: [0, 'Discount percent cannot be negative'],
        max: [100, 'Discount percent cannot exceed 100%']
      }
    }]
  },
  
  // Content and Media
  images: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Alt text cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Document name cannot exceed 200 characters']
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: [0, 'File size cannot be negative']
    }
  }],
  
  // Organizer Information
  organizer: {
    primaryContact: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Primary contact is required'],
      index: true
    },
    coOrganizers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email: string) {
          return validator.isEmail(email);
        },
        message: 'Please provide a valid contact email'
      }
    },
    contactPhone: {
      type: String,
      trim: true,
      validate: {
        validator: function(phone: string) {
          if (!phone) return true; // Optional field
          return validator.isMobilePhone(phone, 'any', { strictMode: false });
        },
        message: 'Please provide a valid contact phone number'
      }
    }
  },
  
  // Status and Workflow
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'cancelled', 'postponed', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft',
    index: true
  },
  
  visibility: {
    type: String,
    enum: {
      values: ['public', 'unlisted', 'private'],
      message: '{VALUE} is not a valid visibility setting'
    },
    default: 'public'
  },
  
  publishDate: Date,
  
  // Attendance Tracking
  rsvps: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    guestInfo: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Guest name cannot exceed 100 characters']
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function(email: string) {
            if (!email) return true; // Optional field
            return validator.isEmail(email);
          },
          message: 'Please provide a valid guest email'
        }
      },
      phone: {
        type: String,
        trim: true
      }
    },
    status: {
      type: String,
      enum: {
        values: ['attending', 'not-attending', 'maybe', 'waitlist'],
        message: '{VALUE} is not a valid RSVP status'
      },
      required: true
    },
    responseDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    additionalInfo: {
      type: Schema.Types.Mixed,
      default: {}
    },
    ticketType: {
      type: String,
      trim: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded']
    },
    checkInStatus: {
      type: String,
      enum: ['checked-in', 'no-show']
    },
    checkInTime: Date,
    companions: {
      type: Number,
      min: [0, 'Companions count cannot be negative'],
      max: [10, 'Companions count cannot exceed 10'],
      default: 0
    }
  }],
  
  // Communication
  announcements: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Announcement title cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Announcement message cannot exceed 2000 characters']
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipientType: {
      type: String,
      enum: ['all', 'attending', 'not-attending', 'waitlist'],
      required: true
    }
  }],
  
  // Follow-up and Feedback
  followUp: {
    surveyUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(url: string) {
          if (!url) return true; // Optional field
          return validator.isURL(url);
        },
        message: 'Please provide a valid survey URL'
      }
    },
    thankYouMessage: {
      type: String,
      trim: true,
      maxlength: [1000, 'Thank you message cannot exceed 1000 characters']
    },
    certificateTemplate: {
      type: String,
      trim: true
    },
    sendCertificates: {
      type: Boolean,
      default: false
    }
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    uniqueViews: {
      type: Number,
      default: 0,
      min: [0, 'Unique views cannot be negative']
    },
    registrationConversionRate: {
      type: Number,
      min: [0, 'Conversion rate cannot be negative'],
      max: [100, 'Conversion rate cannot exceed 100%']
    },
    attendanceRate: {
      type: Number,
      min: [0, 'Attendance rate cannot be negative'],
      max: [100, 'Attendance rate cannot exceed 100%']
    },
    satisfactionScore: {
      type: Number,
      min: [0, 'Satisfaction score cannot be negative'],
      max: [10, 'Satisfaction score cannot exceed 10']
    }
  },
  
  // SEO and Marketing
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Keyword cannot exceed 50 characters']
    }]
  },
  
  // Internal Management
  budget: {
    estimatedCost: {
      type: Number,
      min: [0, 'Estimated cost cannot be negative']
    },
    actualCost: {
      type: Number,
      min: [0, 'Actual cost cannot be negative']
    },
    revenue: {
      type: Number,
      min: [0, 'Revenue cannot be negative']
    },
    profitLoss: Number
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  
  internalTags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Internal tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      const { __v, ...obj } = ret;
      return obj;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, eventType: 1 });
eventSchema.index({ 'organizer.primaryContact': 1 });
eventSchema.index({ status: 1, visibility: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ 'location.type': 1 });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function(this: IEvent) {
  return this.rsvps.filter(rsvp => rsvp.status === 'attending').length;
});

// Virtual for waitlist count
eventSchema.virtual('waitlistCount').get(function(this: IEvent) {
  return this.rsvps.filter(rsvp => rsvp.status === 'waitlist').length;
});

// Pre-save middleware
eventSchema.pre('save', function(this: IEvent, next) {
  // Calculate profit/loss if both cost and revenue are available
  if (this.budget?.actualCost !== undefined && this.budget?.revenue !== undefined) {
    this.budget.profitLoss = this.budget.revenue - this.budget.actualCost;
  }
  
  // Auto-publish if publish date is set and has passed
  if (this.publishDate && this.publishDate <= new Date() && this.status === 'draft') {
    this.status = 'published';
  }
  
  next();
});

// Instance Methods
eventSchema.methods.addRSVP = function(rsvpData: any): Promise<IEvent> {
  // Check if user already has an RSVP
  const existingRSVP = this.rsvps.find((rsvp: any) => 
    (rsvpData.userId && rsvp.userId?.equals(rsvpData.userId)) ||
    (rsvpData.guestInfo?.email && rsvp.guestInfo?.email === rsvpData.guestInfo.email)
  );
  
  if (existingRSVP) {
    // Update existing RSVP
    Object.assign(existingRSVP, rsvpData);
  } else {
    // Add new RSVP
    this.rsvps.push(rsvpData);
  }
  
  return this.save();
};

eventSchema.methods.updateRSVP = function(userId: mongoose.Types.ObjectId, status: string): Promise<IEvent> {
  const rsvp = this.rsvps.find((r: any) => r.userId?.equals(userId));
  if (rsvp) {
    rsvp.status = status as any;
    rsvp.responseDate = new Date();
  }
  return this.save();
};

eventSchema.methods.checkInAttendee = function(userId: mongoose.Types.ObjectId): Promise<IEvent> {
  const rsvp = this.rsvps.find((r: any) => r.userId?.equals(userId));
  if (rsvp && rsvp.status === 'attending') {
    rsvp.checkInStatus = 'checked-in';
    rsvp.checkInTime = new Date();
  }
  return this.save();
};

eventSchema.methods.getAttendeeCount = function(): number {
  return this.rsvps.filter((rsvp: any) => rsvp.status === 'attending').length;
};

eventSchema.methods.getWaitlistCount = function(): number {
  return this.rsvps.filter((rsvp: any) => rsvp.status === 'waitlist').length;
};

eventSchema.methods.isRegistrationOpen = function(): boolean {
  const now = new Date();
  const { openDate, closeDate } = this.registrationSettings;
  
  if (openDate && now < openDate) return false;
  if (closeDate && now > closeDate) return false;
  
  return this.status === 'published' && this.requiresRegistration;
};

eventSchema.methods.canAcceptMoreAttendees = function(): boolean {
  if (!this.registrationSettings.maxAttendees) return true;
  
  const currentAttendees = this.getAttendeeCount();
  return currentAttendees < this.registrationSettings.maxAttendees;
};

eventSchema.methods.sendAnnouncement = function(announcement: any): Promise<IEvent> {
  this.announcements.push(announcement);
  return this.save();
};

eventSchema.methods.calculateAttendanceRate = function(): number {
  const attendingCount = this.rsvps.filter((rsvp: any) => rsvp.status === 'attending').length;
  const checkedInCount = this.rsvps.filter((rsvp: any) => rsvp.checkInStatus === 'checked-in').length;
  
  if (attendingCount === 0) return 0;
  return (checkedInCount / attendingCount) * 100;
};

// Static Methods
eventSchema.statics.getUpcomingEvents = function(limit = 10): Promise<IEvent[]> {
  return this.find({
    startDate: { $gte: new Date() },
    status: 'published',
    visibility: { $in: ['public', 'unlisted'] }
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .populate('organizer.primaryContact', 'firstName lastName email');
};

eventSchema.statics.getEventsByCategory = function(category: string): Promise<IEvent[]> {
  return this.find({
    category,
    status: 'published',
    visibility: { $in: ['public', 'unlisted'] }
  })
  .sort({ startDate: 1 })
  .populate('organizer.primaryContact', 'firstName lastName email');
};

eventSchema.statics.getEventsByDate = function(startDate: Date, endDate: Date): Promise<IEvent[]> {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ],
    status: 'published',
    visibility: { $in: ['public', 'unlisted'] }
  })
  .sort({ startDate: 1 });
};

eventSchema.statics.getPopularEvents = function(limit = 10): Promise<IEvent[]> {
  return this.find({
    startDate: { $gte: new Date() },
    status: 'published',
    visibility: { $in: ['public', 'unlisted'] }
  })
  .sort({ 'analytics.views': -1, 'rsvps': -1 })
  .limit(limit);
};

eventSchema.statics.searchEvents = function(query: string, filters?: any): Promise<IEvent[]> {
  const searchQuery: any = {
    $text: { $search: query },
    status: 'published',
    visibility: { $in: ['public', 'unlisted'] }
  };
  
  if (filters) {
    Object.assign(searchQuery, filters);
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

eventSchema.statics.getEventStatistics = async function(): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  topCategories: Array<{ category: string; count: number }>;
  monthlyEventCount: Record<string, number>;
}> {
  const now = new Date();
  
  const [
    totalEvents,
    upcomingEvents,
    categoryStats,
    monthlyStats,
    attendanceStats
  ] = await Promise.all([
    this.countDocuments({ status: 'published' }),
    this.countDocuments({ 
      status: 'published', 
      startDate: { $gte: now } 
    }),
    this.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    this.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          count: { $sum: 1 }
        }
      }
    ]),
    this.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$rsvps' },
      { $match: { 'rsvps.status': 'attending' } },
      { $group: { _id: null, totalAttendees: { $sum: 1 } } }
    ])
  ]);
  
  return {
    totalEvents,
    upcomingEvents,
    totalAttendees: attendanceStats[0]?.totalAttendees || 0,
    averageAttendance: totalEvents > 0 ? (attendanceStats[0]?.totalAttendees || 0) / totalEvents : 0,
    topCategories: categoryStats.map(stat => ({ category: stat._id, count: stat.count })),
    monthlyEventCount: monthlyStats.reduce((acc, stat) => {
      const key = `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`;
      acc[key] = stat.count;
      return acc;
    }, {} as Record<string, number>)
  };
};

eventSchema.statics.getOrganizerEvents = function(organizerId: mongoose.Types.ObjectId): Promise<IEvent[]> {
  return this.find({
    $or: [
      { 'organizer.primaryContact': organizerId },
      { 'organizer.coOrganizers': organizerId }
    ]
  })
  .sort({ startDate: -1 });
};

const Event = mongoose.model<IEvent, IEventModel>('Event', eventSchema);

export default Event;
