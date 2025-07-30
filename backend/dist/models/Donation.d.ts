import mongoose, { Document } from 'mongoose';
export interface IDonation extends Document {
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    donorAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    amount: number;
    currency: string;
    donationType: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'recurring';
    recurringDetails?: {
        frequency: 'monthly' | 'quarterly' | 'annual';
        nextPaymentDate?: Date;
        endDate?: Date;
        isActive: boolean;
    };
    paymentMethod: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'cryptocurrency' | 'check' | 'cash';
    paymentProvider: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'manual';
    transactionId: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    paymentReference?: string;
    processingFee?: number;
    netAmount?: number;
    taxDeductible: boolean;
    taxReceiptNumber?: string;
    taxReceiptSent: boolean;
    taxReceiptSentDate?: Date;
    project?: mongoose.Types.ObjectId;
    campaign?: mongoose.Types.ObjectId;
    designation?: 'general' | 'specific-project' | 'emergency-fund' | 'education' | 'healthcare' | 'environment';
    message?: string;
    isAnonymous: boolean;
    publicDisplay: boolean;
    donorConsent: {
        marketing: boolean;
        updates: boolean;
        newsletter: boolean;
        dataProcessing: boolean;
    };
    certificateSent: boolean;
    certificateSentDate?: Date;
    acknowledgmentSent: boolean;
    acknowledgmentSentDate?: Date;
    thankYouEmailSent: boolean;
    source: 'website' | 'mobile-app' | 'email-campaign' | 'social-media' | 'event' | 'direct-mail' | 'referral';
    referralSource?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    deviceInfo?: {
        userAgent?: string;
        ipAddress?: string;
        device?: string;
        browser?: string;
    };
    donationDate: Date;
    processedDate?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    notes?: string;
    internalTags: string[];
    fiscalYear: number;
    quarter: number;
    month: number;
    isMatched: boolean;
    matchingDonation?: mongoose.Types.ObjectId;
    corporateMatching?: {
        company: string;
        matchingRatio: number;
        matchingAmount: number;
        status: 'pending' | 'approved' | 'completed';
    };
    createdAt: Date;
    updatedAt: Date;
    calculateNetAmount(): number;
    generateTaxReceipt(): Promise<string>;
    sendThankYouEmail(): Promise<boolean>;
    sendCertificate(): Promise<boolean>;
    processRefund(reason?: string): Promise<IDonation>;
    markAsVerified(verifiedBy: mongoose.Types.ObjectId): Promise<IDonation>;
}
export interface IDonationModel extends mongoose.Model<IDonation> {
    getTotalDonations(startDate?: Date, endDate?: Date): Promise<number>;
    getDonationsByProject(projectId: mongoose.Types.ObjectId): Promise<IDonation[]>;
    getDonationsByDonor(donorEmail: string): Promise<IDonation[]>;
    getMonthlyRecurring(): Promise<IDonation[]>;
    getStatistics(year?: number): Promise<{
        total: number;
        totalAmount: number;
        byType: Record<string, number>;
        byProject: Record<string, number>;
        byMonth: Record<string, number>;
        topDonors: Array<{
            email: string;
            totalAmount: number;
            donationCount: number;
        }>;
    }>;
    getUnsentCertificates(): Promise<IDonation[]>;
    getUnsentTaxReceipts(): Promise<IDonation[]>;
}
declare const Donation: IDonationModel;
export default Donation;
//# sourceMappingURL=Donation.d.ts.map