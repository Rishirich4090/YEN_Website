interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType: string;
    }>;
}
declare class EmailService {
    private transporter;
    constructor();
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendContactFormEmail(contactData: {
        name: string;
        email: string;
        phone: string;
        message: string;
    }): Promise<boolean>;
    sendMembershipCredentials(memberData: {
        name: string;
        email: string;
        loginId: string;
        password: string;
        membershipId: string;
        membershipType: string;
    }): Promise<boolean>;
    sendMembershipApprovalEmail(memberData: {
        name: string;
        email: string;
        membershipId: string;
        membershipType: string;
        joinDate: Date;
        membershipStartDate: Date;
        membershipEndDate: Date;
    }, certificateBuffer: Buffer): Promise<boolean>;
    sendMembershipCertificate(memberData: {
        name: string;
        email: string;
        membershipId: string;
        membershipType: string;
        joinDate: Date;
    }, certificateBuffer: Buffer): Promise<boolean>;
    sendDonationCertificate(donationData: {
        donorName: string;
        donorEmail: string;
        amount: number;
        currency: string;
        transactionId: string;
        donationDate: Date;
    }, certificateBuffer: Buffer): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=emailService.d.ts.map