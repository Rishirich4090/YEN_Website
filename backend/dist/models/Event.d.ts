import mongoose, { Document } from 'mongoose';
export interface IEvent extends Document {
    title: string;
    description: string;
    shortDescription?: string;
    startDate: Date;
    endDate: Date;
    timezone: string;
    isAllDay: boolean;
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
    category: 'fundraising' | 'awareness' | 'volunteer' | 'educational' | 'social' | 'meeting' | 'workshop' | 'conference';
    eventType: 'public' | 'private' | 'members-only' | 'invite-only';
    tags: string[];
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
            options?: string[];
        }>;
    };
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
    organizer: {
        primaryContact: mongoose.Types.ObjectId;
        coOrganizers?: mongoose.Types.ObjectId[];
        department?: string;
        contactEmail: string;
        contactPhone?: string;
    };
    status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed';
    visibility: 'public' | 'unlisted' | 'private';
    publishDate?: Date;
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
        companions?: number;
    }>;
    announcements: Array<{
        title: string;
        message: string;
        sentAt: Date;
        sentBy: mongoose.Types.ObjectId;
        recipientType: 'all' | 'attending' | 'not-attending' | 'waitlist';
    }>;
    followUp: {
        surveyUrl?: string;
        thankYouMessage?: string;
        certificateTemplate?: string;
        sendCertificates: boolean;
    };
    analytics: {
        views: number;
        uniqueViews: number;
        registrationConversionRate?: number;
        attendanceRate?: number;
        satisfactionScore?: number;
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
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
        topCategories: Array<{
            category: string;
            count: number;
        }>;
        monthlyEventCount: Record<string, number>;
    }>;
    getOrganizerEvents(organizerId: mongoose.Types.ObjectId): Promise<IEvent[]>;
}
declare const Event: IEventModel;
export default Event;
//# sourceMappingURL=Event.d.ts.map