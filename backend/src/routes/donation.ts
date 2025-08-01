import express, { Request, Response } from 'express';
import { z } from 'zod';
import Donation from '../models/Donation.js';
import certificateService from '../services/certificateService.js';
import emailService from '../services/emailService.js';
import { donationSchema } from '../middleware/validation.js';

const router = express.Router();

// POST /api/donations - Create a new donation
router.post('/', async (req: Request, res: Response) => {
  try {
    // Generate transaction ID if not provided
    if (!req.body.transactionId) {
      req.body.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    }

    // Add device info from request
    if (!req.body.deviceInfo) {
      req.body.deviceInfo = {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        device: req.get('User-Agent')?.includes('Mobile') ? 'Mobile' : 'Desktop',
        browser: req.get('User-Agent')?.split(' ')[0] || 'Unknown'
      };
    }

    // Set payment status to completed for demo purposes
    req.body.paymentStatus = 'completed';

    const validatedData = donationSchema.parse(req.body);

    // Create and save donation
    const donation = new Donation(validatedData);
    await donation.save();

    // Generate and send certificate via email (asynchronously to not block response)
    setImmediate(async () => {
      try {
        const certificateBuffer = certificateService.generateDonationCertificate({
          donorName: donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          transactionId: donation.transactionId,
          donationDate: donation.donationDate,
          project: donation.project?.toString()
        });

        // Send certificate via email
        const emailSent = await emailService.sendDonationCertificate({
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          currency: donation.currency,
          transactionId: donation.transactionId,
          donationDate: donation.donationDate
        }, certificateBuffer);

        // Update donation status
        if (emailSent) {
          donation.certificateSent = true;
          donation.certificateSentDate = new Date();
          donation.thankYouEmailSent = true;
          await donation.save();
        }
      } catch (certError) {
        console.error('Certificate generation/email error:', certError);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully! Certificate will be sent to your email.',
      data: {
        _id: donation._id,
        transactionId: donation.transactionId,
        amount: donation.amount,
        currency: donation.currency,
        donationDate: donation.donationDate,
        paymentStatus: donation.paymentStatus,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail
      }
    });

  } catch (error: any) {
    console.error('Donation processing error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process donation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/donations - Get all donations (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'donationDate' } = req.query;
    
    const query: any = {};
    if (status) {
      query.paymentStatus = status;
    }

    const donations = await Donation.find(query)
      .sort({ [sortBy as string]: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit))
      .populate('project', 'title')
      .populate('campaign', 'title');

    const totalDonations = await Donation.countDocuments(query);

    res.json({
      success: true,
      data: donations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalDonations,
        pages: Math.ceil(totalDonations / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donations'
    });
  }
});

// GET /api/donations/:id - Get donation by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('project', 'title description')
      .populate('campaign', 'title description');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error: any) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donation'
    });
  }
});

// POST /api/donations/:id/certificate - Generate and send certificate
router.post('/:id/certificate', async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be generated for completed donations'
      });
    }

    // Generate certificate
    const certificateBuffer = certificateService.generateDonationCertificate({
      donorName: donation.donorName,
      amount: donation.amount,
      currency: donation.currency,
      transactionId: donation.transactionId,
      donationDate: donation.donationDate,
      project: donation.project?.toString()
    });

    // Send certificate via email
    const emailSent = await emailService.sendDonationCertificate({
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      amount: donation.amount,
      currency: donation.currency,
      transactionId: donation.transactionId,
      donationDate: donation.donationDate
    }, certificateBuffer);

    if (emailSent) {
      donation.certificateSent = true;
      donation.certificateSentDate = new Date();
      await donation.save();
    }

    res.json({
      success: true,
      message: emailSent ? 'Certificate sent successfully!' : 'Certificate generated but email failed',
      data: {
        certificateSent: emailSent,
        certificateUrl: emailSent ? `Certificate sent to ${donation.donorEmail}` : null
      }
    });

  } catch (error: any) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
});

// GET /api/donations/stats - Get donation statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const { year, projectId } = req.query;

    const matchQuery: any = { paymentStatus: 'completed' };
    if (year) {
      matchQuery.fiscalYear = Number(year);
    }
    if (projectId) {
      matchQuery.project = projectId;
    }

    const stats = await Donation.getStatistics(year ? Number(year) : undefined);

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
});

// GET /api/donations/user/:email - Get donations by user email
router.get('/user/:email', async (req: Request, res: Response) => {
  try {
    const donations = await Donation.getDonationsByDonor(req.params.email);

    res.json({
      success: true,
      data: donations
    });
  } catch (error: any) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user donations'
    });
  }
});

// PUT /api/donations/:id/status - Update donation status (admin only)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.paymentStatus = status;
    if (notes) {
      donation.notes = (donation.notes || '') + `\n${new Date().toISOString()}: ${notes}`;
    }

    await donation.save();

    res.json({
      success: true,
      message: 'Donation status updated successfully',
      data: donation
    });
  } catch (error: any) {
    console.error('Update donation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update donation status'
    });
  }
});

export default router;
