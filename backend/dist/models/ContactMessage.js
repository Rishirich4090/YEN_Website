import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
const contactMessageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
        validate: {
            validator: function (name) {
                return /^[a-zA-Z\s\-'.]+$/.test(name);
            },
            message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email cannot exceed 255 characters'],
        validate: {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: 'Please provide a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (phone) {
                if (!phone)
                    return true; // Optional field
                return validator.isMobilePhone(phone, 'any', { strictMode: false });
            },
            message: 'Please provide a valid phone number'
        }
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [5, 'Subject must be at least 5 characters long'],
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters long'],
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['new', 'in-progress', 'resolved', 'spam'],
            message: '{VALUE} is not a valid status'
        },
        default: 'new',
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
    category: {
        type: String,
        enum: {
            values: ['general', 'membership', 'donation', 'volunteer', 'support', 'feedback', 'partnership'],
            message: '{VALUE} is not a valid category'
        },
        default: 'general',
        index: true
    },
    tags: [{
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [50, 'Tag cannot exceed 50 characters']
        }],
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    response: {
        type: String,
        trim: true,
        maxlength: [5000, 'Response cannot exceed 5000 characters']
    },
    responseDate: {
        type: Date
    },
    attachments: [{
            filename: {
                type: String,
                required: true
            },
            originalName: {
                type: String,
                required: true
            },
            mimeType: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true,
                max: [10 * 1024 * 1024, 'File size cannot exceed 10MB'] // 10MB limit
            },
            url: {
                type: String,
                required: true
            }
        }],
    source: {
        type: String,
        enum: {
            values: ['website', 'email', 'phone', 'social-media', 'event'],
            message: '{VALUE} is not a valid source'
        },
        default: 'website'
    },
    ipAddress: {
        type: String,
        validate: {
            validator: function (ip) {
                if (!ip)
                    return true; // Optional field
                return validator.isIP(ip);
            },
            message: 'Please provide a valid IP address'
        }
    },
    userAgent: {
        type: String,
        maxlength: [500, 'User agent cannot exceed 500 characters']
    },
    isInternal: {
        type: Boolean,
        default: false
    },
    metadata: {
        followUpRequired: {
            type: Boolean,
            default: false
        },
        followUpDate: {
            type: Date
        },
        estimatedResponseTime: {
            type: Number, // in hours
            min: [0, 'Estimated response time cannot be negative'],
            max: [720, 'Estimated response time cannot exceed 30 days'] // 30 days in hours
        },
        urgencyReason: {
            type: String,
            maxlength: [500, 'Urgency reason cannot exceed 500 characters']
        }
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            const { __v, ...obj } = ret;
            return obj;
        }
    },
    toObject: { virtuals: true }
});
// Indexes for performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1, priority: -1 });
contactMessageSchema.index({ category: 1, status: 1 });
contactMessageSchema.index({ assignedTo: 1, status: 1 });
contactMessageSchema.index({ 'metadata.followUpDate': 1 });
// Virtual for response time calculation
contactMessageSchema.virtual('responseTime').get(function () {
    if (this.responseDate && this.createdAt) {
        return Math.round((this.responseDate.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60)); // in hours
    }
    return null;
});
// Virtual for time since creation
contactMessageSchema.virtual('timeSinceCreation').get(function () {
    return Math.round((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60)); // in hours
});
// Virtual for is overdue check
contactMessageSchema.virtual('isOverdue').get(function () {
    if (this.status === 'resolved')
        return false;
    const timeSinceCreation = Math.round((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
    const expectedResponseTime = this.metadata.estimatedResponseTime || 24; // default 24 hours
    return timeSinceCreation > expectedResponseTime;
});
// Pre-save middleware for automatic priority adjustment
contactMessageSchema.pre('save', function (next) {
    // Auto-escalate priority based on keywords in message
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
    const highKeywords = ['important', 'soon', 'quickly', 'priority'];
    const messageText = this.message.toLowerCase();
    const subjectText = this.subject.toLowerCase();
    const combinedText = `${messageText} ${subjectText}`;
    if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
        this.priority = 'urgent';
        this.metadata.urgencyReason = 'Auto-escalated due to urgent keywords';
    }
    else if (highKeywords.some(keyword => combinedText.includes(keyword))) {
        this.priority = 'high';
    }
    // Set estimated response time based on priority
    if (!this.metadata.estimatedResponseTime) {
        switch (this.priority) {
            case 'urgent':
                this.metadata.estimatedResponseTime = 2; // 2 hours
                break;
            case 'high':
                this.metadata.estimatedResponseTime = 8; // 8 hours
                break;
            case 'medium':
                this.metadata.estimatedResponseTime = 24; // 24 hours
                break;
            case 'low':
                this.metadata.estimatedResponseTime = 72; // 72 hours
                break;
        }
    }
    next();
});
// Instance Methods
contactMessageSchema.methods.markAsRead = function () {
    if (this.status === 'new') {
        this.status = 'in-progress';
    }
    return this.save();
};
contactMessageSchema.methods.assignTo = function (userId) {
    this.assignedTo = userId;
    if (this.status === 'new') {
        this.status = 'in-progress';
    }
    return this.save();
};
contactMessageSchema.methods.addResponse = function (response, userId) {
    this.response = response;
    this.responseDate = new Date();
    this.assignedTo = userId;
    return this.save();
};
contactMessageSchema.methods.markAsResolved = function () {
    this.status = 'resolved';
    if (!this.responseDate) {
        this.responseDate = new Date();
    }
    return this.save();
};
contactMessageSchema.methods.addTag = function (tag) {
    const normalizedTag = tag.toLowerCase().trim();
    if (!this.tags.includes(normalizedTag)) {
        this.tags.push(normalizedTag);
    }
    return this.save();
};
contactMessageSchema.methods.removeTag = function (tag) {
    const normalizedTag = tag.toLowerCase().trim();
    this.tags = this.tags.filter((t) => t !== normalizedTag);
    return this.save();
};
// Static Methods
contactMessageSchema.statics.getUnreadCount = function () {
    return this.countDocuments({ status: 'new' });
};
contactMessageSchema.statics.getByStatus = function (status) {
    return this.find({ status })
        .populate('assignedTo', 'firstName lastName email')
        .sort({ createdAt: -1 });
};
contactMessageSchema.statics.getByPriority = function (priority) {
    return this.find({ priority })
        .populate('assignedTo', 'firstName lastName email')
        .sort({ createdAt: -1 });
};
contactMessageSchema.statics.getByCategory = function (category) {
    return this.find({ category })
        .populate('assignedTo', 'firstName lastName email')
        .sort({ createdAt: -1 });
};
contactMessageSchema.statics.getOverdueMessages = function () {
    const now = new Date();
    return this.aggregate([
        {
            $match: {
                status: { $ne: 'resolved' }
            }
        },
        {
            $addFields: {
                timeSinceCreation: {
                    $divide: [
                        { $subtract: [now, '$createdAt'] },
                        1000 * 60 * 60 // Convert to hours
                    ]
                },
                expectedResponseTime: {
                    $ifNull: ['$metadata.estimatedResponseTime', 24]
                }
            }
        },
        {
            $match: {
                $expr: {
                    $gt: ['$timeSinceCreation', '$expectedResponseTime']
                }
            }
        },
        {
            $sort: { createdAt: 1 }
        }
    ]);
};
contactMessageSchema.statics.getStatistics = async function () {
    const [totalCount, statusStats, priorityStats, categoryStats, responseTimeStats] = await Promise.all([
        this.countDocuments(),
        this.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            {
                $match: {
                    responseDate: { $exists: true },
                    createdAt: { $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    avgResponseTime: {
                        $avg: {
                            $divide: [
                                { $subtract: ['$responseDate', '$createdAt'] },
                                1000 * 60 * 60 // Convert to hours
                            ]
                        }
                    }
                }
            }
        ])
    ]);
    return {
        total: totalCount,
        byStatus: statusStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byPriority: priorityStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byCategory: categoryStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        avgResponseTime: responseTimeStats[0]?.avgResponseTime || 0
    };
};
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
//# sourceMappingURL=ContactMessage.js.map