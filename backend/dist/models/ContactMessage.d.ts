import mongoose, { Document } from 'mongoose';
export interface IContactMessage extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'new' | 'in-progress' | 'resolved' | 'spam';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'general' | 'membership' | 'donation' | 'volunteer' | 'support' | 'feedback' | 'partnership';
    tags: string[];
    assignedTo?: mongoose.Types.ObjectId;
    response?: string;
    responseDate?: Date;
    attachments: {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }[];
    source: 'website' | 'email' | 'phone' | 'social-media' | 'event';
    ipAddress?: string;
    userAgent?: string;
    isInternal: boolean;
    metadata: {
        followUpRequired: boolean;
        followUpDate?: Date;
        estimatedResponseTime?: number;
        urgencyReason?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    markAsRead(): Promise<IContactMessage>;
    assignTo(userId: mongoose.Types.ObjectId): Promise<IContactMessage>;
    addResponse(response: string, userId: mongoose.Types.ObjectId): Promise<IContactMessage>;
    markAsResolved(): Promise<IContactMessage>;
    addTag(tag: string): Promise<IContactMessage>;
    removeTag(tag: string): Promise<IContactMessage>;
}
export interface IContactMessageModel extends mongoose.Model<IContactMessage> {
    getUnreadCount(): Promise<number>;
    getByStatus(status: string): Promise<IContactMessage[]>;
    getByPriority(priority: string): Promise<IContactMessage[]>;
    getByCategory(category: string): Promise<IContactMessage[]>;
    getOverdueMessages(): Promise<IContactMessage[]>;
    getStatistics(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
        byCategory: Record<string, number>;
        avgResponseTime: number;
    }>;
}
declare const ContactMessage: IContactMessageModel;
export default ContactMessage;
//# sourceMappingURL=ContactMessage.d.ts.map