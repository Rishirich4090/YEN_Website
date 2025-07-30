import express from 'express';
import Contact from '../models/Contact.js';
import emailService from '../services/emailService.js';
import { validateContactForm } from '../middleware/validation.js';
const router = express.Router();
// POST /api/contact - Handle contact form submission
router.post('/', validateContactForm, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // Save contact to database
        const contact = new Contact({
            name,
            email,
            phone,
            message
        });
        await contact.save();
        // Send email to admin
        const emailSent = await emailService.sendContactFormEmail({
            name,
            email,
            phone,
            message
        });
        if (!emailSent) {
            console.error('Failed to send contact email, but contact was saved');
        }
        res.status(201).json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!',
            data: {
                id: contact._id,
                emailSent
            }
        });
    }
    catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
// GET /api/contact - Get all contacts (admin only)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: contacts
        });
    }
    catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});
// PATCH /api/contact/:id/status - Update contact status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['new', 'read', 'responded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        res.json({
            success: true,
            data: contact
        });
    }
    catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status'
        });
    }
});
export default router;
//# sourceMappingURL=contact.js.map