import jsPDF from "jspdf";
import { DonationData } from "./donationService";

export interface DonationCertificateData {
  donorName: string;
  donationId: string;
  amount: number;
  donationDate: string;
  purpose: string;
  receiptNumber: string;
  ngoName?: string;
  logoUrl?: string;
  panNumber?: string;
  isAnonymous?: boolean;
}

export const generateDonationCertificate = async (
  data: DonationCertificateData,
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Modern gradient background with yellow-green theme
  pdf.setFillColor(254, 255, 245); // Very light yellow-green background
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Top decorative header with gradient effect
  pdf.setFillColor(34, 197, 94); // Green
  pdf.rect(0, 0, pageWidth, 20, "F");

  pdf.setFillColor(234, 179, 8); // Golden yellow
  pdf.rect(0, 15, pageWidth, 10, "F");

  // Certificate border with elegant design
  pdf.setDrawColor(34, 197, 94); // Green border
  pdf.setLineWidth(3);
  pdf.roundedRect(12, 30, pageWidth - 24, pageHeight - 45, 10, 10);

  // Inner decorative border
  pdf.setDrawColor(254, 240, 138); // Light yellow
  pdf.setLineWidth(1.5);
  pdf.roundedRect(18, 36, pageWidth - 36, pageHeight - 57, 8, 8);

  // Receipt number in header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Receipt No: ${data.receiptNumber}`, pageWidth - 15, 12, {
    align: "right",
  });

  // Main title with elegant typography
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text("CERTIFICATE", pageWidth / 2, 55, { align: "center" });

  pdf.setFontSize(16);
  pdf.setTextColor(202, 138, 4); // Golden yellow
  pdf.text("OF APPRECIATION", pageWidth / 2, 67, { align: "center" });

  // Decorative flourish under title
  const centerX = pageWidth / 2;
  pdf.setDrawColor(34, 197, 94); // Green
  pdf.setLineWidth(2);

  // Left flourish
  pdf.line(centerX - 60, 72, centerX - 20, 72);
  pdf.setFillColor(202, 138, 4); // Golden yellow
  pdf.circle(centerX - 65, 72, 3, "F");

  // Center decorative element (circle instead of diamond)
  pdf.setFillColor(34, 197, 94); // Green
  pdf.circle(centerX, 72, 3, "F");

  // Inner decorative circle
  pdf.setFillColor(254, 240, 138); // Light yellow
  pdf.circle(centerX, 72, 1.5, "F");

  // Right flourish
  pdf.setDrawColor(34, 197, 94);
  pdf.line(centerX + 20, 72, centerX + 60, 72);
  pdf.setFillColor(202, 138, 4);
  pdf.circle(centerX + 65, 72, 3, "F");

  // NGO branding section
  if (data.logoUrl) {
    // Enhanced logo design
    pdf.setFillColor(217, 119, 6);
    pdf.circle(35, 50, 10, "F");

    pdf.setFillColor(255, 255, 255);
    pdf.circle(35, 50, 8, "F");

    pdf.setFillColor(217, 119, 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text("H", 35, 53, { align: "center" });
  }

  // NGO name and details
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(51, 51, 51);
  pdf.text(data.ngoName || "HOPEHANDS NGO", pageWidth / 2, 85, {
    align: "center",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(120, 113, 108);
  pdf.text(
    "Regd. Office: 123 Hope Street, Global City, State 12345",
    pageWidth / 2,
    92,
    { align: "center" },
  );
  pdf.text(
    "PAN: AABCH1234E | 80G Registration: DIT(E)/12A/2015-16",
    pageWidth / 2,
    98,
    { align: "center" },
  );

  // Certificate content with enhanced design
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(15);
  pdf.setTextColor(87, 83, 78);
  pdf.text("This certificate is gratefully presented to", pageWidth / 2, 115, {
    align: "center",
  });

  // Donor name with elegant styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(202, 138, 4); // Golden yellow
  const displayName = data.isAnonymous
    ? "A GENEROUS ANONYMOUS DONOR"
    : data.donorName.toUpperCase();
  pdf.text(displayName, pageWidth / 2, 135, { align: "center" });

  // Decorative underline for donor name
  const nameWidth = (pdf.getTextWidth(displayName) * 24) / 100; // Approximate width scaling
  pdf.setDrawColor(34, 197, 94); // Green underline
  pdf.setLineWidth(2);
  pdf.line(centerX - nameWidth / 2, 140, centerX + nameWidth / 2, 140);

  // Donation details
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(15);
  pdf.setTextColor(87, 83, 78);
  pdf.text("for the generous contribution of", pageWidth / 2, 155, {
    align: "center",
  });

  // Amount with elegant styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(34, 197, 94); // Green
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.amount);
  pdf.text(formattedAmount, pageWidth / 2, 175, { align: "center" });

  // Amount in words with enhanced styling
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(120, 113, 108);
  const amountInWords = convertToWords(data.amount);
  pdf.text(`(Rupees ${amountInWords} Only)`, pageWidth / 2, 185, {
    align: "center",
  });

  // Purpose section
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(15);
  pdf.setTextColor(87, 83, 78);
  pdf.text("towards our noble cause:", pageWidth / 2, 200, { align: "center" });

  // Purpose with quote styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(202, 138, 4); // Golden yellow
  pdf.text(`"${data.purpose}"`, pageWidth / 2, 215, { align: "center" });

  // Enhanced donation details card
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(254, 215, 170);
  pdf.setLineWidth(1.5);
  pdf.roundedRect(25, 230, pageWidth - 50, 35, 5, 5, "FD");

  // Card header
  pdf.setFillColor(254, 240, 138);
  pdf.roundedRect(25, 230, pageWidth - 50, 12, 5, 5, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(146, 64, 14);
  pdf.text("DONATION DETAILS", pageWidth / 2, 238, { align: "center" });

  // Details content
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(87, 83, 78);

  // Left column
  pdf.text(`Donation ID: ${data.donationId}`, 35, 248);
  pdf.text(`Date: ${data.donationDate}`, 35, 254);
  pdf.text(`Mode: Online Payment`, 35, 260);

  // Right column
  if (data.panNumber) {
    pdf.text(`Donor PAN: ${data.panNumber}`, pageWidth - 35, 248, {
      align: "right",
    });
  }
  pdf.text(`Certificate ID: CERT-${data.donationId}`, pageWidth - 35, 254, {
    align: "right",
  });
  pdf.text(`Status: Verified`, pageWidth - 35, 260, { align: "right" });

  // Tax exemption notice with enhanced design
  pdf.setFillColor(254, 249, 195);
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(1);
  pdf.roundedRect(25, 275, pageWidth - 50, 18, 3, 3, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(146, 64, 14);
  pdf.text("TAX EXEMPTION NOTICE", pageWidth / 2, 281, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 113, 108);
  pdf.text(
    "This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.",
    pageWidth / 2,
    287,
    { align: "center" },
  );
  pdf.text(
    "Please retain this certificate for your income tax records.",
    pageWidth / 2,
    291,
    { align: "center" },
  );

  // Signature section with modern design
  const signatureY = 305;

  // Date section
  pdf.setFillColor(254, 252, 232);
  pdf.setDrawColor(254, 215, 170);
  pdf.roundedRect(30, signatureY, 60, 22, 3, 3, "FD");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 113, 108);
  pdf.text("Date of Issue", 60, signatureY + 6, { align: "center" });

  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(1);
  pdf.line(35, signatureY + 10, 85, signatureY + 10);

  const currentDate = new Date().toLocaleDateString("en-IN");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(87, 83, 78);
  pdf.text(currentDate, 60, signatureY + 16, { align: "center" });

  // Signature section
  pdf.setFillColor(254, 252, 232);
  pdf.roundedRect(pageWidth - 90, signatureY, 60, 22, 3, 3, "FD");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 113, 108);
  pdf.text("Authorized Signatory", pageWidth - 60, signatureY + 6, {
    align: "center",
  });

  pdf.setDrawColor(217, 119, 6);
  pdf.line(pageWidth - 85, signatureY + 10, pageWidth - 35, signatureY + 10);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(87, 83, 78);
  pdf.text("Dr. Sarah Mitchell", pageWidth - 60, signatureY + 16, {
    align: "center",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 113, 108);
  pdf.text("Founder & Executive Director", pageWidth - 60, signatureY + 20, {
    align: "center",
  });

  // Footer with gratitude message
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.setTextColor(146, 64, 14);
  pdf.text(
    "Your generosity creates ripples of hope that reach far beyond what you can imagine.",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" },
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(87, 83, 78);
  pdf.text(
    "Thank you for being a catalyst for positive change!",
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" },
  );

  // Decorative corner elements
  pdf.setFillColor(217, 119, 6);

  // Ornamental corners
  for (let i = 0; i < 4; i++) {
    const x = i < 2 ? 25 : pageWidth - 25;
    const y = i % 2 === 0 ? 40 : pageHeight - 15;

    pdf.circle(x, y, 2, "F");
    pdf.setFillColor(254, 215, 170);
    pdf.circle(x, y, 1, "F");
    pdf.setFillColor(217, 119, 6);
  }

  // Security watermark (simplified - no rotation due to jsPDF limitations)
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(35);
  pdf.setTextColor(252, 247, 233);
  pdf.text("AUTHENTIC", pageWidth / 2, pageHeight / 2, {
    align: "center",
  });

  // Download the PDF
  const fileName = `HopeHands_Donation_Certificate_${data.donorName.replace(/\s+/g, "_")}_${data.donationId}.pdf`;
  pdf.save(fileName);
};

// Enhanced helper function to convert number to words
function convertToWords(amount: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (amount === 0) return "Zero";

  let words = "";

  if (amount >= 10000000) {
    // Crores
    const crores = Math.floor(amount / 10000000);
    words += convertToWords(crores) + " Crore ";
    amount %= 10000000;
  }

  if (amount >= 100000) {
    // Lakhs
    const lakhs = Math.floor(amount / 100000);
    words += convertToWords(lakhs) + " Lakh ";
    amount %= 100000;
  }

  if (amount >= 1000) {
    // Thousands
    const thousands = Math.floor(amount / 1000);
    words += convertToWords(thousands) + " Thousand ";
    amount %= 1000;
  }

  if (amount >= 100) {
    // Hundreds
    const hundreds = Math.floor(amount / 100);
    words += ones[hundreds] + " Hundred ";
    amount %= 100;
  }

  if (amount >= 20) {
    words += tens[Math.floor(amount / 10)] + " ";
    amount %= 10;
  } else if (amount >= 10) {
    words += teens[amount - 10] + " ";
    amount = 0;
  }

  if (amount > 0) {
    words += ones[amount] + " ";
  }

  return words.trim();
}

export const generateDonationCertificateForData = async (
  donation: DonationData,
): Promise<void> => {
  await generateDonationCertificate({
    donorName: donation.donorName,
    donationId: donation.id,
    amount: donation.amount,
    donationDate: donation.donationDate,
    purpose: donation.purpose,
    receiptNumber: `HOPE-${donation.id}`,
    ngoName: "HopeHands NGO",
    logoUrl: "default",
    panNumber: donation.panNumber,
    isAnonymous: donation.isAnonymous,
  });
};
