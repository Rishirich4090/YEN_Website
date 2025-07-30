import mongoose, { Document } from 'mongoose';
export interface IMember extends Document {
    name: string;
    email: string;
    phone: string;
    membershipType: 'basic' | 'premium' | 'lifetime';
    membershipId: string;
    loginId: string;
    password: string;
    joinDate: Date;
    membershipStartDate: Date;
    membershipEndDate: Date;
    membershipDuration: number;
    approvalStatus: 'pending' | 'approved' | 'rejected' | 'expired';
    isActive: boolean;
    certificateSent: boolean;
    hasVerificationBadge: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMember, {}, {}, {}, mongoose.Document<unknown, {}, IMember, {}> & IMember & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Member.d.ts.map