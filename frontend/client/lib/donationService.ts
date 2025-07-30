export interface DonationData {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  currency: "INR";
  paymentMethod: "card" | "upi" | "netbanking";
  donationDate: string;
  certificateGenerated: boolean;
  memberAccountCreated: boolean;
  memberId?: string;
  memberPassword?: string;
  purpose: string;
  panNumber?: string;
  isAnonymous: boolean;
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  thisMonthAmount: number;
  donorCount: number;
  averageDonation: number;
}

class DonationService {
  private donations: DonationData[] = [
    {
      id: "DON-2024-001",
      donorName: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543210",
      address: "Mumbai, Maharashtra",
      amount: 5000,
      currency: "INR",
      paymentMethod: "upi",
      donationDate: "2024-01-10 14:30:00",
      certificateGenerated: true,
      memberAccountCreated: true,
      memberId: "NGO-2024-DON-001",
      memberPassword: "donor123",
      purpose: "Clean Water Initiative",
      panNumber: "ABCDE1234F",
      isAnonymous: false
    },
    {
      id: "DON-2024-002",
      donorName: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543211",
      address: "Delhi, India",
      amount: 2500,
      currency: "INR",
      paymentMethod: "card",
      donationDate: "2024-01-12 16:45:00",
      certificateGenerated: true,
      memberAccountCreated: true,
      memberId: "NGO-2024-DON-002",
      memberPassword: "donor456",
      purpose: "Education for All",
      isAnonymous: false
    },
    {
      id: "DON-2024-003",
      donorName: "Anonymous Donor",
      email: "anonymous@email.com",
      phone: "+91 9876543212",
      address: "Bangalore, Karnataka",
      amount: 10000,
      currency: "INR",
      paymentMethod: "netbanking",
      donationDate: "2024-01-15 09:15:00",
      certificateGenerated: true,
      memberAccountCreated: false,
      purpose: "General Support",
      isAnonymous: true
    }
  ];

  private listeners: ((donations: DonationData[]) => void)[] = [];

  // Predefined donation amounts in INR
  getPredefinedAmounts(): number[] {
    return [500, 1000, 2500, 5000, 10000, 25000];
  }

  // Create new donation
  async createDonation(donationData: Omit<DonationData, 'id' | 'donationDate' | 'certificateGenerated' | 'memberAccountCreated'>): Promise<DonationData> {
    const newDonation: DonationData = {
      ...donationData,
      id: `DON-${Date.now()}`,
      donationDate: new Date().toLocaleString(),
      certificateGenerated: false,
      memberAccountCreated: false
    };

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Auto-generate member account for non-anonymous donors
    if (!newDonation.isAnonymous) {
      newDonation.memberAccountCreated = true;
      newDonation.memberId = `NGO-2024-DON-${this.donations.length + 1}`;
      newDonation.memberPassword = `donor${Math.random().toString(36).substring(2, 8)}`;
    }

    // Auto-generate certificate
    newDonation.certificateGenerated = true;

    this.donations.push(newDonation);
    this.notifyListeners();

    return newDonation;
  }

  // Get all donations
  getAllDonations(): DonationData[] {
    return [...this.donations].sort((a, b) => 
      new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
    );
  }

  // Get donation by ID
  getDonationById(id: string): DonationData | undefined {
    return this.donations.find(donation => donation.id === id);
  }

  // Get recent donations
  getRecentDonations(limit: number = 10): DonationData[] {
    return this.getAllDonations().slice(0, limit);
  }

  // Get donation statistics
  getStats(): DonationStats {
    const total = this.donations.reduce((sum, d) => sum + d.amount, 0);
    const thisMonth = this.donations
      .filter(d => {
        const donationMonth = new Date(d.donationDate).getMonth();
        const currentMonth = new Date().getMonth();
        return donationMonth === currentMonth;
      })
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      totalDonations: this.donations.length,
      totalAmount: total,
      thisMonthAmount: thisMonth,
      donorCount: new Set(this.donations.map(d => d.email)).size,
      averageDonation: total / this.donations.length || 0
    };
  }

  // Search donations
  searchDonations(query: string): DonationData[] {
    const lowerQuery = query.toLowerCase();
    return this.donations.filter(donation =>
      donation.donorName.toLowerCase().includes(lowerQuery) ||
      donation.email.toLowerCase().includes(lowerQuery) ||
      donation.id.toLowerCase().includes(lowerQuery) ||
      donation.purpose.toLowerCase().includes(lowerQuery)
    );
  }

  // Event listeners
  onDonationUpdate(listener: (donations: DonationData[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.donations));
  }

  // Format currency
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Validate PAN number
  validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  // Generate receipt number
  generateReceiptNumber(): string {
    return `HOPE-${Date.now()}`;
  }
}

export const donationService = new DonationService();
