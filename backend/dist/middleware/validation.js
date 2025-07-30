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
    donorName: z.string().min(1, 'Donor name is required').trim(),
    donorEmail: z.string().email('Please enter a valid email address'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    currency: z.string().default('USD'),
    donationType: z.enum(['one-time', 'monthly', 'annual']).default('one-time'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    project: z.string().optional(),
    message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
    isAnonymous: z.boolean().default(false)
});
//# sourceMappingURL=validation.js.map