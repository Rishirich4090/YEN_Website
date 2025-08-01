import { z } from 'zod';
export const contactFormSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    email: z.string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    phone: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
    message: z.string()
        .min(1, 'Message is required')
        .max(1000, 'Message cannot exceed 1000 characters')
        .trim()
});
export const validateContactForm = (req, res, next) => {
    try {
        const validatedData = contactFormSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        next(error);
    }
};
export const membershipSchema = z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    membershipType: z.enum(['basic', 'premium', 'lifetime'])
});
export const donationSchema = z.object({
    // Donor Information
    donorName: z.string().min(1, 'Donor name is required').trim(),
    donorEmail: z.string().email('Please enter a valid email address'),
    donorPhone: z.string().optional(),
    donorAddress: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional()
    }).optional(),
    // Donation Details
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    currency: z.string().default('USD'),
    donationType: z.enum(['one-time', 'monthly', 'quarterly', 'annual', 'recurring']).default('one-time'),
    recurringDetails: z.object({
        frequency: z.enum(['monthly', 'quarterly', 'annual']).optional(),
        nextPaymentDate: z.string().optional(), // Keep as string for JSON parsing
        endDate: z.string().optional(), // Keep as string for JSON parsing
        isActive: z.boolean().default(true)
    }).optional(),
    // Payment Information
    paymentMethod: z.enum(['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cryptocurrency', 'check', 'cash']),
    paymentProvider: z.enum(['stripe', 'paypal', 'razorpay', 'square', 'manual']).default('stripe'),
    transactionId: z.string().optional(), // Made optional since backend generates it
    // Project/Campaign Information
    project: z.string().optional(),
    campaign: z.string().optional(),
    designation: z.enum(['general', 'specific-project', 'emergency-fund', 'education', 'healthcare', 'environment']).default('general'),
    // Donor Interaction
    message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
    isAnonymous: z.boolean().default(false),
    publicDisplay: z.boolean().default(true),
    donorConsent: z.object({
        marketing: z.boolean().default(false),
        updates: z.boolean().default(true),
        newsletter: z.boolean().default(false),
        dataProcessing: z.boolean().refine(val => val === true, 'Data processing consent is required')
    }),
    // Tracking and Analytics
    source: z.enum(['website', 'mobile-app', 'email-campaign', 'social-media', 'event', 'direct-mail', 'referral']).default('website'),
    referralSource: z.string().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    deviceInfo: z.object({
        userAgent: z.string().optional(),
        ipAddress: z.string().optional(),
        device: z.string().optional(),
        browser: z.string().optional()
    }).optional(),
    // Additional fields for processing
    panNumber: z.string().optional()
});
//# sourceMappingURL=validation.js.map