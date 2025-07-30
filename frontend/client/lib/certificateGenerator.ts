import jsPDF from "jspdf";

export interface CertificateData {
  memberName: string;
  memberId: string;
  joinDate: string;
  ngoName?: string;
  logoUrl?: string;
  founderSignature?: string;
}

export const generateMembershipCertificate = async (
  data: CertificateData,
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Modern gradient background with yellow-green theme
  pdf.setFillColor(254, 254, 248); // Very light yellow-green background
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Top decorative band with gradient effect
  pdf.setFillColor(34, 197, 94); // Green gradient start
  pdf.rect(0, 0, pageWidth, 25, "F");

  pdf.setFillColor(59, 130, 246); // Yellow-green gradient end
  pdf.rect(0, 15, pageWidth, 10, "F");

  // Main certificate border with rounded corners
  pdf.setDrawColor(34, 197, 94); // Green border
  pdf.setLineWidth(2);
  pdf.roundedRect(15, 35, pageWidth - 30, pageHeight - 55, 8, 8);

  // Inner shadow effect
  pdf.setDrawColor(254, 240, 138); // Light yellow
  pdf.setLineWidth(1);
  pdf.roundedRect(20, 40, pageWidth - 40, pageHeight - 65, 6, 6);

  // Header Section with elegant design
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(32);
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text("CERTIFICATE", pageWidth / 2, 60, { align: "center" });

  pdf.setFontSize(18);
  pdf.setTextColor(202, 138, 4); // Golden yellow
  pdf.text("OF MEMBERSHIP", pageWidth / 2, 72, { align: "center" });

  // Decorative elements
  const centerX = pageWidth / 2;

  // Left decorative flourish
  pdf.setDrawColor(34, 197, 94); // Green
  pdf.setLineWidth(2);
  pdf.line(centerX - 80, 76, centerX - 40, 76);
  pdf.setFillColor(202, 138, 4); // Golden yellow
  pdf.circle(centerX - 85, 76, 3, "F");

  // Right decorative flourish
  pdf.setDrawColor(34, 197, 94);
  pdf.line(centerX + 40, 76, centerX + 80, 76);
  pdf.setFillColor(202, 138, 4);
  pdf.circle(centerX + 85, 76, 3, "F");

  // NGO Logo and Name Section
  if (data.logoUrl) {
    // Modern logo placeholder with HopeHands theme
    pdf.setFillColor(254, 240, 138); // Light yellow
    pdf.circle(50, 55, 12, "F");

    pdf.setFillColor(34, 197, 94); // Green
    pdf.circle(50, 55, 10, "F");

    pdf.setFillColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text("H", 50, 58, { align: "center" });
  }

  // NGO Name with enhanced styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(51, 65, 85);
  pdf.text(data.ngoName || "HOPEHANDS NGO", pageWidth / 2, 90, {
    align: "center",
  });

  // Tagline
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    "Empowering Communities • Creating Hope • Building Futures",
    pageWidth / 2,
    98,
    { align: "center" },
  );

  // Certificate Content with modern typography
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(16);
  pdf.setTextColor(71, 85, 105);
  pdf.text("This certificate is proudly presented to", pageWidth / 2, 120, {
    align: "center",
  });

  // Member name with elegant styling and underline
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(202, 138, 4); // Golden yellow
  const displayName = data.memberName || "Member Name";
  pdf.text(displayName.toUpperCase(), pageWidth / 2, 140, { align: "center" });

  // Decorative underline for name
  const nameWidth = (pdf.getTextWidth(displayName.toUpperCase()) * 28) / 100; // Approximate width scaling
  pdf.setDrawColor(34, 197, 94); // Green underline
  pdf.setLineWidth(1.5);
  pdf.line(centerX - nameWidth / 2, 145, centerX + nameWidth / 2, 145);

  // Achievement text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(16);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    "for becoming an esteemed member of our organization",
    pageWidth / 2,
    158,
    { align: "center" },
  );
  pdf.text(
    "and committing to our shared mission of creating",
    pageWidth / 2,
    170,
    { align: "center" },
  );
  pdf.text(
    "positive change in communities around the world.",
    pageWidth / 2,
    182,
    { align: "center" },
  );

  // Member details card with modern design
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(1);
  pdf.roundedRect(60, 195, pageWidth - 120, 35, 5, 5, "FD");

  // Details content
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(51, 65, 85);
  pdf.text("MEMBERSHIP DETAILS", centerX, 207, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 116, 139);

  // Left side details
  pdf.text(`Member ID: ${data.memberId}`, 70, 217);
  pdf.text(`Membership Date: ${data.joinDate}`, 70, 224);

  // Right side details
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  pdf.text(`Certificate Issued: ${currentDate}`, pageWidth - 70, 217, {
    align: "right",
  });
  pdf.text(`Valid: Lifetime`, pageWidth - 70, 224, { align: "right" });

  // Signature section with enhanced design
  const signatureY = 245;

  // Left signature block
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(50, signatureY, 80, 25, 3, 3, "F");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Date of Issue", 90, signatureY + 8, { align: "center" });

  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1);
  pdf.line(60, signatureY + 12, 120, signatureY + 12);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text(currentDate, 90, signatureY + 18, { align: "center" });

  // Right signature block
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(pageWidth - 130, signatureY, 80, 25, 3, 3, "F");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Authorized Signature", pageWidth - 90, signatureY + 8, {
    align: "center",
  });

  pdf.setDrawColor(59, 130, 246);
  pdf.line(pageWidth - 120, signatureY + 12, pageWidth - 60, signatureY + 12);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text("Dr. Sarah Mitchell", pageWidth - 90, signatureY + 18, {
    align: "center",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Founder & Executive Director", pageWidth - 90, signatureY + 22, {
    align: "center",
  });

  // Footer with inspirational message
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    '"Together, we create the change we wish to see in the world."',
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" },
  );

  // Decorative corner elements
  pdf.setFillColor(59, 130, 246);

  // Top left corner
  pdf.circle(25, 45, 2, "F");
  pdf.circle(35, 50, 1.5, "F");

  // Top right corner
  pdf.circle(pageWidth - 25, 45, 2, "F");
  pdf.circle(pageWidth - 35, 50, 1.5, "F");

  // Bottom left corner
  pdf.circle(25, pageHeight - 25, 2, "F");
  pdf.circle(35, pageHeight - 30, 1.5, "F");

  // Bottom right corner
  pdf.circle(pageWidth - 25, pageHeight - 25, 2, "F");
  pdf.circle(pageWidth - 35, pageHeight - 30, 1.5, "F");

  // Security watermark (simplified - no rotation due to jsPDF limitations)
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(40);
  pdf.setTextColor(245, 245, 245);
  pdf.text("HOPEHANDS", pageWidth / 2, pageHeight / 2, {
    align: "center",
  });

  // Download the PDF
  const fileName = `HopeHands_Membership_Certificate_${data.memberName.replace(/\s+/g, "_")}_${data.memberId}.pdf`;
  pdf.save(fileName);
};

export const generateCertificatePreview = (data: CertificateData): string => {
  // Return a preview URL or base64 string for display
  // In a real implementation, you might generate a preview image
  return "/placeholder.svg"; // Placeholder for preview
};
