import express, { Request, Response } from 'express';
import Member from '../models/Member.js';
import Donation from '../models/Donation.js';
import emailService from '../services/emailService.js';
import certificateService from '../services/certificateService.js';
import { membershipSchema, donationSchema } from '../middleware/validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper function to generate random password
const generatePassword = (length: number = 8): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Helper function to calculate membership duration in months
const getMembershipDuration = (type: string): number => {
  switch (type) {
    case 'basic': return 12; // 1 year
    case 'premium': return 24; // 2 years
    case 'lifetime': return 1200; // 100 years (lifetime)
    default: return 12;
  }
};

// POST /api/membership - Create new membership
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = membershipSchema.parse(req.body);

    // Generate unique membership ID and login credentials
    const membershipId = `HH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const loginId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const plainPassword = generatePassword(8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Calculate membership duration
    const duration = getMembershipDuration(validatedData.membershipType);

    const member = new Member({
      ...validatedData,
      membershipId,
      loginId,
      password: hashedPassword,
      membershipDuration: duration,
      approvalStatus: 'pending'
    });

    await member.save();

    // Send login credentials via email
    const credentialsSent = await emailService.sendMembershipCredentials({
      name: member.name,
      email: member.email,
      loginId: loginId,
      password: plainPassword, // Send plain password via email
      membershipId: member.membershipId,
      membershipType: member.membershipType
    });

    res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully! Check your email for login credentials.',
      data: {
        membershipId: member.membershipId,
        loginId: loginId,
        status: 'pending',
        credentialsSent
      }
    });

  } catch (error) {
    console.error('Membership creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create membership'
    });
  }
});

// POST /api/membership/login - Member login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login ID and password are required'
      });
    }

    // Find member by login ID
    const member = await Member.findOne({ loginId });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials'
      });
    }

    // Update last login
    member.lastLogin = new Date();
    await member.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: member._id,
        loginId: member.loginId,
        membershipId: member.membershipId,
        role: 'member'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          membershipId: member.membershipId,
          membershipType: member.membershipType,
          approvalStatus: member.approvalStatus,
          hasVerificationBadge: member.hasVerificationBadge,
          membershipStartDate: member.membershipStartDate,
          membershipEndDate: member.membershipEndDate,
          isActive: member.isActive
        }
      }
    });

  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET /api/membership/status/:loginId - Check membership status
router.get('/status/:loginId', async (req: Request, res: Response) => {
  try {
    const { loginId } = req.params;

    const member = await Member.findOne({ loginId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if membership has expired
    const now = new Date();
    if (member.membershipEndDate && now > member.membershipEndDate) {
      member.approvalStatus = 'expired';
      member.hasVerificationBadge = false;
      await member.save();
    }

    res.json({
      success: true,
      data: {
        membershipId: member.membershipId,
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
        approvalStatus: member.approvalStatus,
        hasVerificationBadge: member.hasVerificationBadge,
        joinDate: member.joinDate,
        membershipStartDate: member.membershipStartDate,
        membershipEndDate: member.membershipEndDate,
        membershipDuration: member.membershipDuration,
        isActive: member.isActive,
        lastLogin: member.lastLogin
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check status'
    });
  }
});

// POST /api/membership/approve/:membershipId - Approve membership (Admin only)
router.post('/approve/:membershipId', async (req: Request, res: Response) => {
  try {
    const { membershipId } = req.params;

    const member = await Member.findOne({ membershipId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Set approval status and dates
    const now = new Date();
    member.approvalStatus = 'approved';
    member.hasVerificationBadge = true;
    member.membershipStartDate = now;

    // Calculate end date based on duration
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + member.membershipDuration);
    member.membershipEndDate = endDate;

    await member.save();

    // Generate and send certificate with approval email
    const certificateBuffer = certificateService.generateMembershipCertificate({
      name: member.name,
      membershipId: member.membershipId,
      membershipType: member.membershipType,
      joinDate: member.joinDate
    });

    const emailSent = await emailService.sendMembershipApprovalEmail({
      name: member.name,
      email: member.email,
      membershipId: member.membershipId,
      membershipType: member.membershipType,
      joinDate: member.joinDate,
      membershipStartDate: member.membershipStartDate,
      membershipEndDate: member.membershipEndDate
    }, certificateBuffer);

    if (emailSent) {
      member.certificateSent = true;
      await member.save();
    }

    res.json({
      success: true,
      message: 'Membership approved successfully',
      data: {
        membershipId: member.membershipId,
        approvalStatus: member.approvalStatus,
        hasVerificationBadge: member.hasVerificationBadge,
        membershipStartDate: member.membershipStartDate,
        membershipEndDate: member.membershipEndDate,
        certificateSent: emailSent
      }
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve membership'
    });
  }
});

// GET /api/membership/certificate/:membershipId - Download membership certificate
router.get('/certificate/:membershipId', async (req: Request, res: Response) => {
  try {
    const { membershipId } = req.params;

    const member = await Member.findOne({ membershipId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (member.approvalStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Certificate only available for approved members'
      });
    }

    // Generate certificate
    const certificateBuffer = certificateService.generateMembershipCertificate({
      name: member.name,
      membershipId: member.membershipId,
      membershipType: member.membershipType,
      joinDate: member.joinDate
    });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="membership-certificate-${member.membershipId}.pdf"`);
    res.setHeader('Content-Length', certificateBuffer.length);

    res.send(certificateBuffer);

  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
});

// POST /api/membership/extend/:membershipId - Extend membership
router.post('/extend/:membershipId', async (req: Request, res: Response) => {
  try {
    const { membershipId } = req.params;
    const { additionalMonths } = req.body;

    const member = await Member.findOne({ membershipId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Extend membership
    const currentEndDate = member.membershipEndDate || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + (additionalMonths || 12));

    member.membershipEndDate = newEndDate;
    member.approvalStatus = 'approved';
    member.hasVerificationBadge = true;
    member.isActive = true;

    await member.save();

    res.json({
      success: true,
      message: 'Membership extended successfully',
      data: {
        membershipId: member.membershipId,
        newEndDate: member.membershipEndDate,
        hasVerificationBadge: member.hasVerificationBadge
      }
    });

  } catch (error) {
    console.error('Extension error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extend membership'
    });
  }
});

// POST /api/donation - Process donation
router.post('/donation', async (req: Request, res: Response) => {
  try {
    const validatedData = donationSchema.parse(req.body);

    const donation = new Donation(validatedData);
    await donation.save();

    // Generate and send certificate
    const certificateBuffer = certificateService.generateDonationCertificate({
      donorName: donation.donorName,
      amount: donation.amount,
      currency: donation.currency,
      transactionId: donation.transactionId,
      donationDate: donation.donationDate,
      project: donation.project?.toString()
    });

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
      await donation.save();
    }

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully!',
      data: {
        transactionId: donation.transactionId,
        certificateSent: emailSent
      }
    });

  } catch (error) {
    console.error('Donation processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process donation'
    });
  }
});

export default router;
