declare class CertificateService {
    generateMembershipCertificate(memberData: {
        name: string;
        membershipId: string;
        membershipType: string;
        joinDate: Date;
    }): Buffer;
    generateDonationCertificate(donationData: {
        donorName: string;
        amount: number;
        currency: string;
        transactionId: string;
        donationDate: Date;
        project?: string;
    }): Buffer;
}
declare const _default: CertificateService;
export default _default;
//# sourceMappingURL=certificateService.d.ts.map