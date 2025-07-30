import mongoose, { Schema } from 'mongoose';
const MemberSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    membershipType: {
        type: String,
        enum: ['basic', 'premium', 'lifetime'],
        required: true
    },
    membershipId: {
        type: String,
        unique: true,
        required: true
    },
    loginId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    membershipStartDate: {
        type: Date,
        default: null
    },
    membershipEndDate: {
        type: Date,
        default: null
    },
    membershipDuration: {
        type: Number,
        default: 12 // 12 months default
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    certificateSent: {
        type: Boolean,
        default: false
    },
    hasVerificationBadge: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
export default mongoose.model('Member', MemberSchema);
//# sourceMappingURL=Member.js.map