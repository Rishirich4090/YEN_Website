import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    email: string;
    phone: string;
}, {
    message: string;
    name: string;
    email: string;
    phone: string;
}>;
export declare const validateContactForm: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const membershipSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    membershipType: z.ZodEnum<["basic", "premium", "lifetime"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    membershipType: "basic" | "premium" | "lifetime";
}, {
    name: string;
    email: string;
    phone: string;
    membershipType: "basic" | "premium" | "lifetime";
}>;
export declare const donationSchema: z.ZodObject<{
    donorName: z.ZodString;
    donorEmail: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    donationType: z.ZodDefault<z.ZodEnum<["one-time", "monthly", "annual"]>>;
    paymentMethod: z.ZodString;
    transactionId: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    donorName: string;
    donorEmail: string;
    amount: number;
    currency: string;
    donationType: "one-time" | "monthly" | "annual";
    paymentMethod: string;
    transactionId: string;
    isAnonymous: boolean;
    message?: string | undefined;
    project?: string | undefined;
}, {
    donorName: string;
    donorEmail: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    message?: string | undefined;
    currency?: string | undefined;
    donationType?: "one-time" | "monthly" | "annual" | undefined;
    project?: string | undefined;
    isAnonymous?: boolean | undefined;
}>;
//# sourceMappingURL=validation.d.ts.map