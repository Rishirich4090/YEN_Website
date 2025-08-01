import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    email: string;
    phone: string;
    name: string;
}, {
    message: string;
    email: string;
    phone: string;
    name: string;
}>;
export declare const validateContactForm: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const membershipSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    membershipType: z.ZodEnum<["basic", "premium", "lifetime"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    name: string;
    membershipType: "basic" | "premium" | "lifetime";
}, {
    email: string;
    phone: string;
    name: string;
    membershipType: "basic" | "premium" | "lifetime";
}>;
export declare const donationSchema: z.ZodObject<{
    donorName: z.ZodString;
    donorEmail: z.ZodString;
    donorPhone: z.ZodOptional<z.ZodString>;
    donorAddress: z.ZodOptional<z.ZodObject<{
        street: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        zipCode: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    }, {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    }>>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    donationType: z.ZodDefault<z.ZodEnum<["one-time", "monthly", "quarterly", "annual", "recurring"]>>;
    recurringDetails: z.ZodOptional<z.ZodObject<{
        frequency: z.ZodOptional<z.ZodEnum<["monthly", "quarterly", "annual"]>>;
        nextPaymentDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive: boolean;
        frequency?: "monthly" | "quarterly" | "annual" | undefined;
        nextPaymentDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        frequency?: "monthly" | "quarterly" | "annual" | undefined;
        nextPaymentDate?: string | undefined;
        endDate?: string | undefined;
        isActive?: boolean | undefined;
    }>>;
    paymentMethod: z.ZodEnum<["credit-card", "debit-card", "paypal", "bank-transfer", "cryptocurrency", "check", "cash"]>;
    paymentProvider: z.ZodDefault<z.ZodEnum<["stripe", "paypal", "razorpay", "square", "manual"]>>;
    transactionId: z.ZodOptional<z.ZodString>;
    project: z.ZodOptional<z.ZodString>;
    campaign: z.ZodOptional<z.ZodString>;
    designation: z.ZodDefault<z.ZodEnum<["general", "specific-project", "emergency-fund", "education", "healthcare", "environment"]>>;
    message: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    publicDisplay: z.ZodDefault<z.ZodBoolean>;
    donorConsent: z.ZodObject<{
        marketing: z.ZodDefault<z.ZodBoolean>;
        updates: z.ZodDefault<z.ZodBoolean>;
        newsletter: z.ZodDefault<z.ZodBoolean>;
        dataProcessing: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    }, "strip", z.ZodTypeAny, {
        marketing: boolean;
        updates: boolean;
        newsletter: boolean;
        dataProcessing: boolean;
    }, {
        dataProcessing: boolean;
        marketing?: boolean | undefined;
        updates?: boolean | undefined;
        newsletter?: boolean | undefined;
    }>;
    source: z.ZodDefault<z.ZodEnum<["website", "mobile-app", "email-campaign", "social-media", "event", "direct-mail", "referral"]>>;
    referralSource: z.ZodOptional<z.ZodString>;
    utmSource: z.ZodOptional<z.ZodString>;
    utmMedium: z.ZodOptional<z.ZodString>;
    utmCampaign: z.ZodOptional<z.ZodString>;
    deviceInfo: z.ZodOptional<z.ZodObject<{
        userAgent: z.ZodOptional<z.ZodString>;
        ipAddress: z.ZodOptional<z.ZodString>;
        device: z.ZodOptional<z.ZodString>;
        browser: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
        device?: string | undefined;
        browser?: string | undefined;
    }, {
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
        device?: string | undefined;
        browser?: string | undefined;
    }>>;
    panNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    source: "website" | "social-media" | "event" | "mobile-app" | "email-campaign" | "direct-mail" | "referral";
    donorName: string;
    donorEmail: string;
    amount: number;
    currency: string;
    donationType: "one-time" | "monthly" | "quarterly" | "annual" | "recurring";
    paymentMethod: "credit-card" | "debit-card" | "paypal" | "bank-transfer" | "cryptocurrency" | "check" | "cash";
    paymentProvider: "paypal" | "stripe" | "razorpay" | "square" | "manual";
    designation: "general" | "specific-project" | "emergency-fund" | "education" | "healthcare" | "environment";
    isAnonymous: boolean;
    publicDisplay: boolean;
    donorConsent: {
        marketing: boolean;
        updates: boolean;
        newsletter: boolean;
        dataProcessing: boolean;
    };
    message?: string | undefined;
    donorPhone?: string | undefined;
    donorAddress?: {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    } | undefined;
    recurringDetails?: {
        isActive: boolean;
        frequency?: "monthly" | "quarterly" | "annual" | undefined;
        nextPaymentDate?: string | undefined;
        endDate?: string | undefined;
    } | undefined;
    transactionId?: string | undefined;
    project?: string | undefined;
    campaign?: string | undefined;
    referralSource?: string | undefined;
    utmSource?: string | undefined;
    utmMedium?: string | undefined;
    utmCampaign?: string | undefined;
    deviceInfo?: {
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
        device?: string | undefined;
        browser?: string | undefined;
    } | undefined;
    panNumber?: string | undefined;
}, {
    donorName: string;
    donorEmail: string;
    amount: number;
    paymentMethod: "credit-card" | "debit-card" | "paypal" | "bank-transfer" | "cryptocurrency" | "check" | "cash";
    donorConsent: {
        dataProcessing: boolean;
        marketing?: boolean | undefined;
        updates?: boolean | undefined;
        newsletter?: boolean | undefined;
    };
    message?: string | undefined;
    source?: "website" | "social-media" | "event" | "mobile-app" | "email-campaign" | "direct-mail" | "referral" | undefined;
    donorPhone?: string | undefined;
    donorAddress?: {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    } | undefined;
    currency?: string | undefined;
    donationType?: "one-time" | "monthly" | "quarterly" | "annual" | "recurring" | undefined;
    recurringDetails?: {
        frequency?: "monthly" | "quarterly" | "annual" | undefined;
        nextPaymentDate?: string | undefined;
        endDate?: string | undefined;
        isActive?: boolean | undefined;
    } | undefined;
    paymentProvider?: "paypal" | "stripe" | "razorpay" | "square" | "manual" | undefined;
    transactionId?: string | undefined;
    project?: string | undefined;
    campaign?: string | undefined;
    designation?: "general" | "specific-project" | "emergency-fund" | "education" | "healthcare" | "environment" | undefined;
    isAnonymous?: boolean | undefined;
    publicDisplay?: boolean | undefined;
    referralSource?: string | undefined;
    utmSource?: string | undefined;
    utmMedium?: string | undefined;
    utmCampaign?: string | undefined;
    deviceInfo?: {
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
        device?: string | undefined;
        browser?: string | undefined;
    } | undefined;
    panNumber?: string | undefined;
}>;
//# sourceMappingURL=validation.d.ts.map