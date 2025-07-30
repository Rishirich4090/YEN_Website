import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IChatMessage extends Document {
  // Conversation Information
  conversationId: string;
  sessionId?: string;
  
  // Message Details
  message: string;
  messageType: 'text' | 'image' | 'file' | 'quick-reply' | 'bot-response' | 'system';
  
  // Sender Information
  senderType: 'user' | 'bot' | 'admin' | 'volunteer';
  senderId?: mongoose.Types.ObjectId; // Reference to User if authenticated
  senderName?: string; // For anonymous users
  senderEmail?: string; // For anonymous users
  
  // Message Context
  context: {
    page?: string; // Which page the user was on
    userAgent?: string;
    ipAddress?: string;
    sessionData?: Record<string, any>;
  };
  
  // Bot/AI Information
  botResponse?: {
    intent?: string;
    confidence?: number;
    entities?: Array<{
      entity: string;
      value: string;
      confidence: number;
    }>;
    suggestedActions?: string[];
    escalateToHuman?: boolean;
  };
  
  // Message Metadata
  isRead: boolean;
  readBy?: Array<{
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }>;
  
  // Status and Priority
  status: 'active' | 'resolved' | 'escalated' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Attachments
  attachments: Array<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  
  // Response Information
  responseTime?: number; // in milliseconds
  responseBy?: mongoose.Types.ObjectId;
  responseAt?: Date;
  
  // Analytics and Tracking
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  language?: string;
  
  // Internal Management
  assignedTo?: mongoose.Types.ObjectId;
  assignedAt?: Date;
  internalNotes?: string;
  tags: string[];
  
  // Conversation Flow
  parentMessageId?: mongoose.Types.ObjectId;
  threadId?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  markAsRead(userId: mongoose.Types.ObjectId): Promise<IChatMessage>;
  assignTo(userId: mongoose.Types.ObjectId): Promise<IChatMessage>;
  escalate(reason?: string): Promise<IChatMessage>;
  addAttachment(attachment: any): Promise<IChatMessage>;
  analyzeSentiment(): Promise<'positive' | 'neutral' | 'negative'>;
}

// Interface for static model methods
export interface IChatMessageModel extends mongoose.Model<IChatMessage> {
  getConversation(conversationId: string): Promise<IChatMessage[]>;
  getUnreadMessages(userId?: mongoose.Types.ObjectId): Promise<IChatMessage[]>;
  getMessagesByStatus(status: string): Promise<IChatMessage[]>;
  getActiveConversations(): Promise<Array<{
    conversationId: string;
    lastMessage: IChatMessage;
    messageCount: number;
    unreadCount: number;
  }>>;
  getAnalytics(startDate?: Date, endDate?: Date): Promise<{
    totalMessages: number;
    conversationCount: number;
    averageResponseTime: number;
    sentimentBreakdown: Record<string, number>;
    topKeywords: Array<{ keyword: string; count: number }>;
    escalationRate: number;
  }>;
  searchMessages(query: string, filters?: any): Promise<IChatMessage[]>;
}

const chatMessageSchema = new Schema<IChatMessage>({
  // Conversation Information
  conversationId: {
    type: String,
    required: [true, 'Conversation ID is required'],
    trim: true,
    maxlength: [100, 'Conversation ID cannot exceed 100 characters'],
    index: true
  },
  
  sessionId: {
    type: String,
    trim: true,
    maxlength: [100, 'Session ID cannot exceed 100 characters'],
    index: true
  },
  
  // Message Details
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [1, 'Message cannot be empty'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  
  messageType: {
    type: String,
    enum: {
      values: ['text', 'image', 'file', 'quick-reply', 'bot-response', 'system'],
      message: '{VALUE} is not a valid message type'
    },
    default: 'text',
    index: true
  },
  
  // Sender Information
  senderType: {
    type: String,
    enum: {
      values: ['user', 'bot', 'admin', 'volunteer'],
      message: '{VALUE} is not a valid sender type'
    },
    required: [true, 'Sender type is required'],
    index: true
  },
  
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  senderName: {
    type: String,
    trim: true,
    maxlength: [100, 'Sender name cannot exceed 100 characters'],
    validate: {
      validator: function(name: string) {
        if (!name) return true; // Optional field
        return /^[a-zA-Z\s\-'.]+$/.test(name);
      },
      message: 'Sender name can only contain letters, spaces, hyphens, apostrophes, and periods'
    }
  },
  
  senderEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    validate: {
      validator: function(email: string) {
        if (!email) return true; // Optional field
        return validator.isEmail(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  
  // Message Context
  context: {
    page: { 
      type: String, 
      trim: true,
      maxlength: [200, 'Page cannot exceed 200 characters']
    },
    userAgent: { 
      type: String,
      maxlength: [500, 'User agent cannot exceed 500 characters']
    },
    ipAddress: { 
      type: String,
      validate: {
        validator: function(ip: string) {
          if (!ip) return true; // Optional field
          return validator.isIP(ip);
        },
        message: 'Please provide a valid IP address'
      }
    },
    sessionData: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  
  // Bot/AI Information
  botResponse: {
    intent: { 
      type: String, 
      trim: true,
      maxlength: [100, 'Intent cannot exceed 100 characters']
    },
    confidence: { 
      type: Number, 
      min: [0, 'Confidence cannot be negative'],
      max: [1, 'Confidence cannot exceed 1']
    },
    entities: [{
      entity: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [50, 'Entity cannot exceed 50 characters']
      },
      value: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [200, 'Entity value cannot exceed 200 characters']
      },
      confidence: { 
        type: Number, 
        required: true,
        min: [0, 'Confidence cannot be negative'],
        max: [1, 'Confidence cannot exceed 1']
      }
    }],
    suggestedActions: [{
      type: String,
      trim: true,
      maxlength: [200, 'Suggested action cannot exceed 200 characters']
    }],
    escalateToHuman: {
      type: Boolean,
      default: false
    }
  },
  
  // Message Metadata
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  
  readBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  }],
  
  // Status and Priority
  status: {
    type: String,
    enum: {
      values: ['active', 'resolved', 'escalated', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active',
    index: true
  },
  
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: '{VALUE} is not a valid priority level'
    },
    default: 'medium',
    index: true
  },
  
  // Attachments
  attachments: [{
    filename: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    mimeType: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: [0, 'File size cannot be negative'],
      max: [10 * 1024 * 1024, 'File size cannot exceed 10MB'] // 10MB limit
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Response Information
  responseTime: {
    type: Number, // in milliseconds
    min: [0, 'Response time cannot be negative']
  },
  
  responseBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  responseAt: {
    type: Date
  },
  
  // Analytics and Tracking
  sentiment: {
    type: String,
    enum: {
      values: ['positive', 'neutral', 'negative'],
      message: '{VALUE} is not a valid sentiment'
    },
    index: true
  },
  
  keywords: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  }],
  
  language: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [10, 'Language code cannot exceed 10 characters'],
    default: 'en'
  },
  
  // Internal Management
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  assignedAt: {
    type: Date
  },
  
  internalNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Internal notes cannot exceed 1000 characters']
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Conversation Flow
  parentMessageId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatMessage'
  },
  
  threadId: {
    type: String,
    trim: true,
    maxlength: [100, 'Thread ID cannot exceed 100 characters'],
    index: true
  }
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
chatMessageSchema.index({ conversationId: 1, createdAt: -1 });
chatMessageSchema.index({ senderType: 1, senderId: 1 });
chatMessageSchema.index({ status: 1, priority: -1 });
chatMessageSchema.index({ assignedTo: 1, status: 1 });
chatMessageSchema.index({ threadId: 1, createdAt: 1 });
chatMessageSchema.index({ sentiment: 1, createdAt: -1 });

// Text index for search functionality
chatMessageSchema.index({ 
  message: 'text', 
  keywords: 'text',
  'context.page': 'text'
});

// Pre-save middleware for processing
chatMessageSchema.pre('save', function(this: IChatMessage, next) {
  // Extract keywords from message
  if (this.isModified('message')) {
    const words = this.message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    this.keywords = [...new Set(words)]; // Remove duplicates
  }
  
  // Auto-escalate based on urgency keywords
  const urgentKeywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately'];
  const messageText = this.message.toLowerCase();
  
  if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
    this.priority = 'urgent';
    this.botResponse = this.botResponse || {};
    this.botResponse.escalateToHuman = true;
  }
  
  // Set response time if this is a response
  if (this.responseBy && this.responseAt && this.parentMessageId) {
    // This would need to calculate based on the parent message creation time
    // For now, we'll leave it to be calculated elsewhere
  }
  
  next();
});

// Instance Methods
chatMessageSchema.methods.markAsRead = function(userId: mongoose.Types.ObjectId): Promise<IChatMessage> {
  if (!this.readBy.some((read: any) => read.userId.equals(userId))) {
    this.readBy.push({
      userId,
      readAt: new Date()
    });
  }
  this.isRead = true;
  return this.save();
};

chatMessageSchema.methods.assignTo = function(userId: mongoose.Types.ObjectId): Promise<IChatMessage> {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  if (this.status === 'active') {
    this.status = 'escalated';
  }
  return this.save();
};

chatMessageSchema.methods.escalate = function(reason?: string): Promise<IChatMessage> {
  this.status = 'escalated';
  this.priority = this.priority === 'low' ? 'medium' : 
                  this.priority === 'medium' ? 'high' : 'urgent';
  
  if (reason) {
    this.internalNotes = `${this.internalNotes || ''}\nEscalated: ${reason}`;
  }
  
  return this.save();
};

chatMessageSchema.methods.addAttachment = function(attachment: any): Promise<IChatMessage> {
  this.attachments.push(attachment);
  return this.save();
};

chatMessageSchema.methods.analyzeSentiment = async function(): Promise<'positive' | 'neutral' | 'negative'> {
  // This would integrate with a sentiment analysis service
  // For now, we'll do a simple keyword-based analysis
  
  const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect'];
  const negativeWords = ['terrible', 'awful', 'horrible', 'hate', 'worst', 'frustrated', 'angry'];
  
  const messageText = this.message.toLowerCase();
  const positiveCount = positiveWords.filter(word => messageText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => messageText.includes(word)).length;
  
  let sentiment: 'positive' | 'neutral' | 'negative';
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  this.sentiment = sentiment;
  await this.save();
  
  return sentiment;
};

// Static Methods
chatMessageSchema.statics.getConversation = function(conversationId: string): Promise<IChatMessage[]> {
  return this.find({ conversationId })
    .populate('senderId', 'firstName lastName email')
    .populate('responseBy', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: 1 });
};

chatMessageSchema.statics.getUnreadMessages = function(userId?: mongoose.Types.ObjectId): Promise<IChatMessage[]> {
  const query: any = { isRead: false };
  
  if (userId) {
    query.assignedTo = userId;
  }
  
  return this.find(query)
    .populate('senderId', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

chatMessageSchema.statics.getMessagesByStatus = function(status: string): Promise<IChatMessage[]> {
  return this.find({ status })
    .populate('senderId', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

chatMessageSchema.statics.getActiveConversations = async function(): Promise<Array<{
  conversationId: string;
  lastMessage: IChatMessage;
  messageCount: number;
  unreadCount: number;
}>> {
  const conversations = await this.aggregate([
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [{ $eq: ['$isRead', false] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
  
  return conversations.map(conv => ({
    conversationId: conv._id,
    lastMessage: conv.lastMessage,
    messageCount: conv.messageCount,
    unreadCount: conv.unreadCount
  }));
};

chatMessageSchema.statics.getAnalytics = async function(startDate?: Date, endDate?: Date): Promise<{
  totalMessages: number;
  conversationCount: number;
  averageResponseTime: number;
  sentimentBreakdown: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
  escalationRate: number;
}> {
  const query: any = {};
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  const [
    totalMessages,
    conversationCount,
    responseTimeStats,
    sentimentStats,
    keywordStats,
    escalationStats
  ] = await Promise.all([
    this.countDocuments(query),
    this.distinct('conversationId', query).then((conversations: string[]) => conversations.length),
    this.aggregate([
      { $match: { ...query, responseTime: { $exists: true, $gt: 0 } } },
      { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
    ]),
    this.aggregate([
      { $match: { ...query, sentiment: { $exists: true } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: query },
      { $unwind: '$keywords' },
      { $group: { _id: '$keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    this.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          escalated: {
            $sum: {
              $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0]
            }
          }
        }
      }
    ])
  ]);
  
  const escalationRate = escalationStats[0] ? 
    (escalationStats[0].escalated / escalationStats[0].total) * 100 : 0;
  
  return {
    totalMessages,
    conversationCount,
    averageResponseTime: responseTimeStats[0]?.avgResponseTime || 0,
    sentimentBreakdown: sentimentStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    topKeywords: keywordStats.map(item => ({ keyword: item._id, count: item.count })),
    escalationRate
  };
};

chatMessageSchema.statics.searchMessages = function(query: string, filters?: any): Promise<IChatMessage[]> {
  const searchQuery: any = {
    $text: { $search: query }
  };
  
  if (filters) {
    Object.assign(searchQuery, filters);
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('senderId', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email');
};

const ChatMessage = mongoose.model<IChatMessage, IChatMessageModel>('ChatMessage', chatMessageSchema);

export default ChatMessage;
