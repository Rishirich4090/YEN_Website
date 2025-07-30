import mongoose, { Document } from 'mongoose';
export interface IChatMessage extends Document {
    conversationId: string;
    sessionId?: string;
    message: string;
    messageType: 'text' | 'image' | 'file' | 'quick-reply' | 'bot-response' | 'system';
    senderType: 'user' | 'bot' | 'admin' | 'volunteer';
    senderId?: mongoose.Types.ObjectId;
    senderName?: string;
    senderEmail?: string;
    context: {
        page?: string;
        userAgent?: string;
        ipAddress?: string;
        sessionData?: Record<string, any>;
    };
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
    isRead: boolean;
    readBy?: Array<{
        userId: mongoose.Types.ObjectId;
        readAt: Date;
    }>;
    status: 'active' | 'resolved' | 'escalated' | 'archived';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments: Array<{
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
    responseTime?: number;
    responseBy?: mongoose.Types.ObjectId;
    responseAt?: Date;
    sentiment?: 'positive' | 'neutral' | 'negative';
    keywords: string[];
    language?: string;
    assignedTo?: mongoose.Types.ObjectId;
    assignedAt?: Date;
    internalNotes?: string;
    tags: string[];
    parentMessageId?: mongoose.Types.ObjectId;
    threadId?: string;
    createdAt: Date;
    updatedAt: Date;
    markAsRead(userId: mongoose.Types.ObjectId): Promise<IChatMessage>;
    assignTo(userId: mongoose.Types.ObjectId): Promise<IChatMessage>;
    escalate(reason?: string): Promise<IChatMessage>;
    addAttachment(attachment: any): Promise<IChatMessage>;
    analyzeSentiment(): Promise<'positive' | 'neutral' | 'negative'>;
}
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
        topKeywords: Array<{
            keyword: string;
            count: number;
        }>;
        escalationRate: number;
    }>;
    searchMessages(query: string, filters?: any): Promise<IChatMessage[]>;
}
declare const ChatMessage: IChatMessageModel;
export default ChatMessage;
//# sourceMappingURL=ChatMessage.d.ts.map