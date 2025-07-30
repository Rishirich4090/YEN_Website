import jsPDF from 'jspdf';

class CertificateService {
  generateMembershipCertificate(memberData: {
    name: string;
    membershipId: string;
    membershipType: string;
    joinDate: Date;
  }): Buffer {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set red color theme
    const redPrimary = '#dc2626';
    const redSecondary = '#fef2f2';

    // Background
    doc.setFillColor(254, 242, 242); // Light red background
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setDrawColor(220, 38, 38); // Red border
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(20, 20, 257, 170);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38);
    doc.text('🤝 HOPEHANDS NGO', 148.5, 45, { align: 'center' });

    doc.setFontSize(20);
    doc.text('MEMBERSHIP CERTIFICATE', 148.5, 60, { align: 'center' });

    // Main content
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', 148.5, 85, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text(memberData.name.toUpperCase(), 148.5, 105, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`is a valued ${memberData.membershipType.toUpperCase()} member of HopeHands NGO`, 148.5, 125, { align: 'center' });

    // Details
    doc.setFontSize(12);
    doc.text(`Membership ID: ${memberData.membershipId}`, 148.5, 145, { align: 'center' });
    doc.text(`Date of Joining: ${memberData.joinDate.toLocaleDateString()}`, 148.5, 155, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is issued electronically and is valid without signature.', 148.5, 175, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 148.5, 185, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
  }

  generateDonationCertificate(donationData: {
    donorName: string;
    amount: number;
    currency: string;
    transactionId: string;
    donationDate: Date;
    project?: string;
  }): Buffer {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set red color theme
    const redPrimary = '#dc2626';
    const redSecondary = '#fef2f2';

    // Background
    doc.setFillColor(254, 242, 242); // Light red background
    doc.rect(0, 0, 210, 297, 'F');

    // Border
    doc.setDrawColor(220, 38, 38); // Red border
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(20, 20, 170, 257);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38);
    doc.text('🤝 HOPEHANDS NGO', 105, 45, { align: 'center' });

    doc.setFontSize(20);
    doc.text('DONATION CERTIFICATE', 105, 65, { align: 'center' });

    // Main content
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to acknowledge the generous donation made by', 105, 95, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text(donationData.donorName.toUpperCase(), 105, 115, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(`Amount: ${donationData.currency} ${donationData.amount}`, 105, 140, { align: 'center' });

    // Details
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${donationData.transactionId}`, 105, 160, { align: 'center' });
    doc.text(`Date of Donation: ${donationData.donationDate.toLocaleDateString()}`, 105, 170, { align: 'center' });
    
    if (donationData.project) {
      doc.text(`Project: ${donationData.project}`, 105, 180, { align: 'center' });
    }

    // Message
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Thank you for making a difference!', 105, 210, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Your generosity helps us continue our mission to serve', 105, 225, { align: 'center' });
    doc.text('communities in need around the world.', 105, 235, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is issued electronically and is valid without signature.', 105, 255, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 265, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
  }
}

export default new CertificateService();
