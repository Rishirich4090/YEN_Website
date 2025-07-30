import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'member' | 'admin';
    membershipType: 'basic' | 'premium' | 'lifetime';
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    address?: string;
    dateOfBirth?: Date;
    avatar?: string;
    joinDate: Date;
    membershipStartDate?: Date;
    membershipEndDate?: Date;
    lastActive?: Date;
    loginCount: number;
    profileCompleteness: number;
    certificateGenerated: boolean;
    certificateDownloaded: boolean;
    eventsAttended: number;
    messagesPosted: number;
    reason?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateMemberId(): string;
    calculateProfileCompleteness(): number;
    isAccountLocked(): boolean;
    incrementLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map