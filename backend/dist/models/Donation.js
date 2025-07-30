import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
const DonationSchema = new Schema({
    // Donor Information
    donorName: {
        type: String,
        required: [true, 'Donor name is required'],
        trim: true,
        minlength: [2, 'Donor name must be at least 2 characters long'],
        maxlength: [100, 'Donor name cannot exceed 100 characters'],
        validate: {
            validator: function (name) {
                return /^[a-zA-Z\s\-'.]+$/.test(name);
            },
            message: 'Donor name can only contain letters, spaces, hyphens, apostrophes, and periods'
        }
    },
    donorEmail: {
        type: String,
        required: [true, 'Donor email is required'],
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email cannot exceed 255 characters'],
        validate: {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: 'Please provide a valid email address'
        },
        index: true
    },
    donorPhone: {
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
    donorAddress: {
        street: { type: String, trim: true, maxlength: [200, 'Street cannot exceed 200 characters'] },
        city: { type: String, trim: true, maxlength: [100, 'City cannot exceed 100 characters'] },
        state: { type: String, trim: true, maxlength: [100, 'State cannot exceed 100 characters'] },
        zipCode: { type: String, trim: true, maxlength: [20, 'Zip code cannot exceed 20 characters'] },
        country: { type: String, trim: true, maxlength: [100, 'Country cannot exceed 100 characters'], default: 'United States' }
    },
    // Donation Details
    amount: {
        type: Number,
        required: [true, 'Donation amount is required'],
        min: [0.01, 'Amount must be greater than 0'],
        max: [1000000, 'Amount cannot exceed $1,000,000'],
        index: true
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true,
        enum: {
            values: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
            message: '{VALUE} is not a supported currency'
        }
    },
    donationType: {
        type: String,
        enum: {
            values: ['one-time', 'monthly', 'quarterly', 'annual', 'recurring'],
            message: '{VALUE} is not a valid donation type'
        },
        default: 'one-time',
        index: true
    },
    recurringDetails: {
        frequency: {
            type: String,
            enum: ['monthly', 'quarterly', 'annual']
        },
        nextPaymentDate: Date,
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    // Payment Information
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cryptocurrency', 'check', 'cash'],
            message: '{VALUE} is not a valid payment method'
        }
    },
    paymentProvider: {
        type: String,
        enum: {
            values: ['stripe', 'paypal', 'razorpay', 'square', 'manual'],
            message: '{VALUE} is not a valid payment provider'
        },
        default: 'stripe'
    },
    transactionId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        unique: true,
        trim: true,
        index: true
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'pending',
        index: true
    },
    paymentReference: {
        type: String,
        trim: true
    },
    processingFee: {
        type: Number,
        min: [0, 'Processing fee cannot be negative'],
        default: 0
    },
    netAmount: {
        type: Number,
        min: [0, 'Net amount cannot be negative']
    },
    // Tax and Legal
    taxDeductible: {
        type: Boolean,
        default: true
    },
    taxReceiptNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    taxReceiptSent: {
        type: Boolean,
        default: false
    },
    taxReceiptSentDate: {
        type: Date
    },
    // Project/Campaign Information
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    designation: {
        type: String,
        enum: {
            values: ['general', 'specific-project', 'emergency-fund', 'education', 'healthcare', 'environment'],
            message: '{VALUE} is not a valid designation'
        },
        default: 'general'
    },
    // Donor Interaction
    message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    publicDisplay: {
        type: Boolean,
        default: true
    },
    donorConsent: {
        marketing: { type: Boolean, default: false },
        updates: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false },
        dataProcessing: { type: Boolean, required: true }
    },
    // Certificates and Acknowledgments
    certificateSent: {
        type: Boolean,
        default: false
    },
    certificateSentDate: {
        type: Date
    },
    acknowledgmentSent: {
        type: Boolean,
        default: false
    },
    acknowledgmentSentDate: {
        type: Date
    },
    thankYouEmailSent: {
        type: Boolean,
        default: false
    },
    // Tracking and Analytics
    source: {
        type: String,
        enum: {
            values: ['website', 'mobile-app', 'email-campaign', 'social-media', 'event', 'direct-mail', 'referral'],
            message: '{VALUE} is not a valid source'
        },
        default: 'website'
    },
    referralSource: {
        type: String,
        trim: true,
        maxlength: [200, 'Referral source cannot exceed 200 characters']
    },
    utmSource: {
        type: String,
        trim: true
    },
    utmMedium: {
        type: String,
        trim: true
    },
    utmCampaign: {
        type: String,
        trim: true
    },
    deviceInfo: {
        userAgent: { type: String, maxlength: [500, 'User agent cannot exceed 500 characters'] },
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
        device: { type: String, maxlength: [100, 'Device cannot exceed 100 characters'] },
        browser: { type: String, maxlength: [100, 'Browser cannot exceed 100 characters'] }
    },
    // Internal Management
    donationDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    processedDate: {
        type: Date
    },
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    internalTags: [{
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [50, 'Tag cannot exceed 50 characters']
        }],
    // Financial Reporting
    fiscalYear: {
        type: Number,
        required: true
    },
    quarter: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    },
    month: {
        type: Number,
        min: 1,
        max: 12,
        required: true
    },
    // Matching and Corporate
    isMatched: {
        type: Boolean,
        default: false
    },
    matchingDonation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation'
    },
    corporateMatching: {
        company: { type: String, trim: true },
        matchingRatio: { type: Number, min: 0, max: 10 },
        matchingAmount: { type: Number, min: 0 },
        status: {
            type: String,
            enum: ['pending', 'approved', 'completed'],
            default: 'pending'
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
DonationSchema.index({ donorEmail: 1, donationDate: -1 });
DonationSchema.index({ paymentStatus: 1, donationDate: -1 });
DonationSchema.index({ project: 1, donationDate: -1 });
DonationSchema.index({ fiscalYear: 1, quarter: 1, month: 1 });
DonationSchema.index({ certificateSent: 1, taxReceiptSent: 1 });
DonationSchema.index({ 'recurringDetails.nextPaymentDate': 1, 'recurringDetails.isActive': 1 });
// Pre-save middleware to calculate derived fields
DonationSchema.pre('save', function (next) {
    // Calculate net amount
    this.netAmount = this.amount - (this.processingFee || 0);
    // Set fiscal year, quarter, and month
    const donationDate = this.donationDate || new Date();
    this.fiscalYear = donationDate.getFullYear();
    this.quarter = Math.ceil((donationDate.getMonth() + 1) / 3);
    this.month = donationDate.getMonth() + 1;
    // Generate tax receipt number if tax deductible and not already set
    if (this.taxDeductible && !this.taxReceiptNumber) {
        this.taxReceiptNumber = `TR-${this.fiscalYear}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    next();
});
// Instance Methods
DonationSchema.methods.calculateNetAmount = function () {
    return this.amount - (this.processingFee || 0);
};
DonationSchema.methods.generateTaxReceipt = async function () {
    if (!this.taxDeductible) {
        throw new Error('This donation is not tax deductible');
    }
    // Generate tax receipt PDF (implementation would go here)
    // This would integrate with a PDF generation service
    const receiptUrl = `${process.env.BASE_URL}/tax-receipts/${this.taxReceiptNumber}.pdf`;
    this.taxReceiptSent = true;
    this.taxReceiptSentDate = new Date();
    await this.save();
    return receiptUrl;
};
DonationSchema.methods.sendThankYouEmail = async function () {
    try {
        // Email sending logic would go here
        // This would integrate with an email service
        this.thankYouEmailSent = true;
        await this.save();
        return true;
    }
    catch (error) {
        return false;
    }
};
DonationSchema.methods.sendCertificate = async function () {
    try {
        // Certificate generation and sending logic would go here
        this.certificateSent = true;
        this.certificateSentDate = new Date();
        await this.save();
        return true;
    }
    catch (error) {
        return false;
    }
};
DonationSchema.methods.processRefund = async function (reason) {
    this.paymentStatus = 'refunded';
    this.notes = `${this.notes || ''}\nRefund processed: ${reason || 'No reason provided'}`;
    return this.save();
};
DonationSchema.methods.markAsVerified = function (verifiedBy) {
    this.verifiedBy = verifiedBy;
    this.verifiedAt = new Date();
    this.processedDate = new Date();
    return this.save();
};
// Static Methods
DonationSchema.statics.getTotalDonations = async function (startDate, endDate) {
    const query = { paymentStatus: 'completed' };
    if (startDate || endDate) {
        query.donationDate = {};
        if (startDate)
            query.donationDate.$gte = startDate;
        if (endDate)
            query.donationDate.$lte = endDate;
    }
    const result = await this.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result[0]?.total || 0;
};
DonationSchema.statics.getDonationsByProject = function (projectId) {
    return this.find({ project: projectId, paymentStatus: 'completed' })
        .sort({ donationDate: -1 })
        .populate('project', 'title description');
};
DonationSchema.statics.getDonationsByDonor = function (donorEmail) {
    return this.find({ donorEmail, paymentStatus: 'completed' })
        .sort({ donationDate: -1 });
};
DonationSchema.statics.getMonthlyRecurring = function () {
    return this.find({
        donationType: { $in: ['monthly', 'quarterly', 'annual', 'recurring'] },
        'recurringDetails.isActive': true,
        'recurringDetails.nextPaymentDate': { $lte: new Date() }
    });
};
DonationSchema.statics.getStatistics = async function (year) {
    const query = { paymentStatus: 'completed' };
    if (year) {
        query.fiscalYear = year;
    }
    const [totalStats, typeStats, projectStats, monthStats, topDonors] = await Promise.all([
        this.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
        ]),
        this.aggregate([
            { $match: query },
            { $group: { _id: '$donationType', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            { $match: { ...query, project: { $exists: true } } },
            { $group: { _id: '$project', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            { $match: query },
            { $group: { _id: '$month', count: { $sum: 1 } } }
        ]),
        this.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$donorEmail',
                    totalAmount: { $sum: '$amount' },
                    donationCount: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 }
        ])
    ]);
    return {
        total: totalStats[0]?.total || 0,
        totalAmount: totalStats[0]?.totalAmount || 0,
        byType: typeStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byProject: projectStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byMonth: monthStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        topDonors: topDonors.map(donor => ({
            email: donor._id,
            totalAmount: donor.totalAmount,
            donationCount: donor.donationCount
        }))
    };
};
DonationSchema.statics.getUnsentCertificates = function () {
    return this.find({
        paymentStatus: 'completed',
        certificateSent: false,
        donationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort({ donationDate: -1 });
};
DonationSchema.statics.getUnsentTaxReceipts = function () {
    return this.find({
        paymentStatus: 'completed',
        taxDeductible: true,
        taxReceiptSent: false,
        donationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort({ donationDate: -1 });
};
const Donation = mongoose.model('Donation', DonationSchema);
export default Donation;
//# sourceMappingURL=Donation.js.map