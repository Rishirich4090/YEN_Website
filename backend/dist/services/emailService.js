import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: `"HopeHands NGO" <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: options.attachments
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
    async sendContactFormEmail(contactData) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">🤝 HopeHands NGO</h1>
          <p style="color: #666; margin: 5px 0;">New Contact Form Submission</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #dc2626; margin-top: 0;">Contact Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Name:</strong>
            <span style="margin-left: 10px; color: #666;">${contactData.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Email:</strong>
            <span style="margin-left: 10px; color: #666;">${contactData.email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Phone:</strong>
            <span style="margin-left: 10px; color: #666;">${contactData.phone}</span>
          </div>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #dc2626; margin-top: 0;">Message:</h3>
          <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 14px; margin: 0;">
            This email was sent from the HopeHands NGO contact form.
          </p>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
            Received: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;
        return this.sendEmail({
            to: process.env.ADMIN_EMAIL || 'myngoofficial@gmail.com',
            subject: `New Contact Message from ${contactData.name}`,
            html
        });
    }
    async sendMembershipCredentials(memberData) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">🤝 Welcome to HopeHands NGO!</h1>
          <p style="color: #666; margin: 5px 0;">Your Membership Application Received</p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #16a34a;">
          <h2 style="color: #16a34a; margin-top: 0;">Dear ${memberData.name},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Thank you for applying to become a ${memberData.membershipType} member of HopeHands NGO!
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Your application has been received and is under review. Below are your login credentials to check your membership status:
          </p>
        </div>

        <div style="background: #fff; padding: 20px; border: 2px solid #16a34a; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #16a34a; margin-top: 0;">🔐 Your Login Credentials</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>Login ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${memberData.loginId}</code></p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${memberData.password}</code></p>
            <p style="margin: 5px 0;"><strong>Membership ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${memberData.membershipId}</code></p>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 20px;">
          <h4 style="color: #92400e; margin-top: 0;">📋 Next Steps:</h4>
          <ol style="color: #92400e; margin: 10px 0;">
            <li>Your application is currently under review</li>
            <li>You will receive email notification about approval status</li>
            <li>Use the login credentials above to check your status anytime</li>
            <li>Once approved, you'll receive a verification badge and certificate</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888; font-size: 14px;">
            Login at: <a href="https://hopehands.org/login" style="color: #16a34a;">hopehands.org/login</a>
          </p>
          <p style="color: #888; font-size: 12px; margin: 15px 0 0 0;">
            Keep your credentials safe and do not share them with others.
          </p>
        </div>
      </div>
    `;
        return this.sendEmail({
            to: memberData.email,
            subject: 'Your HopeHands NGO Login Credentials - Application Received',
            html
        });
    }
    async sendMembershipApprovalEmail(memberData, certificateBuffer) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">🎉 Membership Approved!</h1>
          <p style="color: #666; margin: 5px 0;">Welcome to HopeHands NGO</p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #16a34a;">
          <h2 style="color: #16a34a; margin-top: 0;">🎊 Congratulations ${memberData.name}!</h2>
          <p style="color: #374151; line-height: 1.6; font-size: 16px;">
            <strong>Your membership application has been APPROVED!</strong> We are thrilled to welcome you as an official ${memberData.membershipType} member of HopeHands NGO.
          </p>

          <div style="background: #dcfce7; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h3 style="color: #16a34a; margin-top: 0; margin-bottom: 10px;">✅ You now have access to:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>🏆 Verification badge on your profile</li>
              <li>📜 Official membership certificate (attached)</li>
              <li>💬 Members-only community chat</li>
              <li>📧 Exclusive project updates</li>
              <li>🎯 Priority support</li>
              <li>📱 Full member dashboard access</li>
            </ul>
          </div>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #16a34a; margin-top: 0;">📋 Your Membership Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Membership ID:</td>
              <td style="padding: 8px 0; color: #6b7280;">${memberData.membershipId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Membership Type:</td>
              <td style="padding: 8px 0; color: #6b7280;">${memberData.membershipType.charAt(0).toUpperCase() + memberData.membershipType.slice(1)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Start Date:</td>
              <td style="padding: 8px 0; color: #6b7280;">${memberData.membershipStartDate.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Valid Until:</td>
              <td style="padding: 8px 0; color: #6b7280;">${memberData.membershipEndDate.toLocaleDateString()}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 20px;">
          <h4 style="color: #92400e; margin-top: 0;">🚀 Next Steps:</h4>
          <ol style="color: #92400e; margin: 10px 0; padding-left: 20px;">
            <li>Download your certificate (attached to this email)</li>
            <li>Login to your member dashboard to explore features</li>
            <li>Join our member community chat</li>
            <li>Check out current projects you can support</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://hopehands.org/membership"
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            🔗 Access Member Dashboard
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #888; font-size: 14px; margin: 0;">
            Together, we're building a better world! 🌍💚
          </p>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
            HopeHands NGO - Empowering Communities, Creating Hope
          </p>
        </div>
      </div>
    `;
        return this.sendEmail({
            to: memberData.email,
            subject: '🎉 Membership Approved! Welcome to HopeHands NGO',
            html,
            attachments: [{
                    filename: `membership-certificate-${memberData.membershipId}.pdf`,
                    content: certificateBuffer,
                    contentType: 'application/pdf'
                }]
        });
    }
    async sendMembershipCertificate(memberData, certificateBuffer) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">🤝 Welcome to HopeHands NGO!</h1>
          <p style="color: #666; margin: 5px 0;">Your Membership Certificate</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin-top: 0;">Dear ${memberData.name},</h2>
          <p style="color: #444; line-height: 1.6;">
            Congratulations! We are delighted to welcome you as a ${memberData.membershipType} member of HopeHands NGO.
          </p>
          <p style="color: #444; line-height: 1.6;">
            Your membership ID is: <strong>${memberData.membershipId}</strong>
          </p>
          <p style="color: #444; line-height: 1.6;">
            Please find your official membership certificate attached to this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888; font-size: 14px;">
            Thank you for joining our mission to make a difference!
          </p>
        </div>
      </div>
    `;
        return this.sendEmail({
            to: memberData.email,
            subject: 'Your HopeHands NGO Membership Certificate',
            html,
            attachments: [{
                    filename: `membership-certificate-${memberData.membershipId}.pdf`,
                    content: certificateBuffer,
                    contentType: 'application/pdf'
                }]
        });
    }
    async sendDonationCertificate(donationData, certificateBuffer) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">🤝 Thank You for Your Donation!</h1>
          <p style="color: #666; margin: 5px 0;">HopeHands NGO Donation Receipt</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #dc2626; margin-top: 0;">Dear ${donationData.donorName},</h2>
          <p style="color: #444; line-height: 1.6;">
            Thank you for your generous donation of ${donationData.currency} ${donationData.amount}. Your contribution makes a real difference in the lives of those we serve.
          </p>
          <p style="color: #444; line-height: 1.6;">
            Transaction ID: <strong>${donationData.transactionId}</strong>
          </p>
          <p style="color: #444; line-height: 1.6;">
            Please find your official donation certificate attached to this email for your records.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888; font-size: 14px;">
            Together, we're building a better world!
          </p>
        </div>
      </div>
    `;
        return this.sendEmail({
            to: donationData.donorEmail,
            subject: 'Your HopeHands NGO Donation Certificate',
            html,
            attachments: [{
                    filename: `donation-certificate-${donationData.transactionId}.pdf`,
                    content: certificateBuffer,
                    contentType: 'application/pdf'
                }]
        });
    }
}
export default new EmailService();
//# sourceMappingURL=emailService.js.map