import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  CreditCard, 
  Smartphone,
  Building2,
  Download,
  CheckCircle,
  Gift,
  Users,
  Target,
  Droplets,
  GraduationCap,
  Home,
  Globe,
  User,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Lock,
  Shield,
  Award,
  UserPlus,
  AlertCircle
} from "lucide-react";

// Redux imports
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { 
  createDonation,
  initiatePayment,
  verifyPayment,
  generateDonationCertificate,
  clearError,
  selectDonationLoading,
  selectPaymentLoading,
  selectDonationError,
  selectPaymentError 
} from "../../src/redux/slices/donationSlice";
import { useToastHelpers } from "../../src/components/providers/ToastProvider";
import { useAuth } from "../../src/contexts/AuthContext";
import { isAuthenticated } from "../../src/utils/tokenManager";

interface DonationFormData {
  // Donor Information
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Donation Details
  amount: number;
  customAmount: string;
  currency: string;
  donationType: "one-time" | "monthly" | "quarterly" | "annual" | "recurring";
  recurringDetails?: {
    frequency: "monthly" | "quarterly" | "annual";
    endDate?: Date;
  };
  
  // Payment Information
  paymentMethod: "credit-card" | "debit-card" | "paypal" | "bank-transfer" | "cryptocurrency" | "check" | "cash";
  paymentProvider: "stripe" | "paypal" | "razorpay" | "square" | "manual";
  
  // Project/Campaign Information
  project?: string;
  campaign?: string;
  designation: "general" | "specific-project" | "emergency-fund" | "education" | "healthcare" | "environment";
  
  // Donor Interaction
  message: string;
  isAnonymous: boolean;
  publicDisplay: boolean;
  donorConsent: {
    marketing: boolean;
    updates: boolean;
    newsletter: boolean;
    dataProcessing: boolean;
  };
  
  // Tracking and Analytics
  source: "website" | "mobile-app" | "email-campaign" | "social-media" | "event" | "direct-mail" | "referral";
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Tax Information
  panNumber?: string;
}

export default function Donation() {
  const navigate = useNavigate();
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const donationLoading = useAppSelector((state) => state.donation?.isLoading || false);
  const paymentLoading = useAppSelector((state) => (state.donation as any)?.isProcessingPayment || false);
  const donationError = useAppSelector((state) => state.donation?.error || null);
  const paymentError = useAppSelector((state) => (state.donation as any)?.paymentError || null);
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  
  // Authentication
  const { user, isAuthenticated: userIsAuthenticated } = useAuth();

  // Component state
  const [activeTab, setActiveTab] = useState("donate");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<any | null>(null);
  const [showAuthRequiredDialog, setShowAuthRequiredDialog] = useState(false);

  const [formData, setFormData] = useState<DonationFormData>({
    // Donor Information - Initialize with user data if authenticated
    donorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
    donorEmail: user?.email || "",
    donorPhone: user?.phone || "",
    donorAddress: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "India"
    },
    
    // Donation Details
    amount: 0,
    customAmount: "",
    currency: "INR",
    donationType: "one-time",
    
    // Payment Information
    paymentMethod: "credit-card",
    paymentProvider: "razorpay",
    
    // Project/Campaign Information
    designation: "general",
    
    // Donor Interaction
    message: "",
    isAnonymous: false,
    publicDisplay: true,
    donorConsent: {
      marketing: false,
      updates: true,
      newsletter: false,
      dataProcessing: false
    },
    
    // Tracking and Analytics
    source: "website",
    
    // Tax Information (optional)
    panNumber: ""
  });

  // Mock data (will be replaced with Redux selectors)
  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];
  const stats = {
    totalDonors: 5247,
    totalAmount: 2847396,
    averageDonation: 1847,
    projectsFunded: 127,
  };

  // Helper function for formatting amounts
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Clear errors on mount and unmount
  useEffect(() => {
    return () => {
      if (donationError || paymentError) {
        dispatch(clearError());
      }
    };
  }, [dispatch, donationError, paymentError]);

  // Update form data when user data is available
  useEffect(() => {
    if (user && userIsAuthenticated) {
      setFormData(prev => ({
        ...prev,
        donorName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        donorEmail: user.email || '',
        donorPhone: user.phone || '',
        donorAddress: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        }
      }));
    }
  }, [user, userIsAuthenticated]);

  const causes = [
    {
      id: "water",
      name: "Clean Water Initiative",
      description: "Provide clean drinking water to rural communities",
      icon: Droplets,
      raised: "₹2,50,000",
      target: "₹5,00,000",
      progress: 50
    },
    {
      id: "education",
      name: "Education for All",
      description: "Build schools and provide educational resources",
      icon: GraduationCap,
      raised: "₹1,80,000",
      target: "₹3,00,000",
      progress: 60
    },
    {
      id: "housing",
      name: "Housing Project",
      description: "Construct affordable homes for displaced families",
      icon: Home,
      raised: "₹3,20,000",
      target: "₹8,00,000",
      progress: 40
    },
    {
      id: "general",
      name: "General Support",
      description: "Support our overall mission and operations",
      icon: Heart,
      raised: "₹4,50,000",
      target: "₹10,00,000",
      progress: 45
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setFormData(prev => ({ ...prev, amount, customAmount: "" }));
  };

  const handleCustomAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, customAmount: value }));
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
      setFormData(prev => ({ ...prev, amount: numValue }));
      setIsCustomAmount(true);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | object) => {
    // Support nested fields like 'donorConsent.dataProcessing'
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        if (parent === 'donorConsent' && typeof prev.donorConsent === 'object') {
          // Always coerce to boolean for checkboxes
          let newValue = value;
          if (typeof value !== 'boolean') {
            newValue = Boolean(value);
          }
          return {
            ...prev,
            donorConsent: {
              ...prev.donorConsent,
              [child]: newValue
            }
          };
        }
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof DonationFormData] as object),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDonate = async () => {
    // Check authentication first
    if (!userIsAuthenticated) {
      setShowAuthRequiredDialog(true);
      return;
    }

    if (!selectedAmount || selectedAmount < 100) {
      showErrorToast("Minimum donation amount is ₹100");
      return;
    }

    if (!formData.donorName || !formData.donorEmail || !formData.donorPhone) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    // Debug: Log the consent state
    console.log("Consent state:", formData.donorConsent);
    console.log("Data processing consent:", formData.donorConsent.dataProcessing);

    if (!formData.donorConsent.dataProcessing) {
      showErrorToast("Please check the required data processing consent checkbox to continue with your donation");
      return;
    }

    try {
      // Use createDonation API which integrates with backend properly
      const donationResult = await dispatch(createDonation({
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        donorPhone: formData.donorPhone,
        donorAddress: formData.donorAddress,
        amount: selectedAmount,
        currency: formData.currency,
        donationType: formData.donationType,
        recurringDetails: formData.recurringDetails,
        paymentMethod: formData.paymentMethod,
        paymentProvider: formData.paymentProvider,
        project: formData.project,
        campaign: formData.campaign,
        designation: formData.designation,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
        publicDisplay: formData.publicDisplay,
        donorConsent: formData.donorConsent,
        source: formData.source,
        referralSource: formData.referralSource,
        utmSource: formData.utmSource,
        utmMedium: formData.utmMedium,
        utmCampaign: formData.utmCampaign,
        panNumber: formData.panNumber
      })).unwrap();

      // Set completed donation for success dialog
      setCompletedDonation({
        ...donationResult,
        paymentStatus: "completed"
      });
      setShowSuccessDialog(true);
      showSuccessToast("Donation completed successfully! Certificate sent to your email.");

    } catch (error: any) {
      console.error("Donation failed:", error);
      showErrorToast(error.message || "Donation failed. Please try again.");
    }
  };

  const handleAuthRequired = () => {
    setShowAuthRequiredDialog(false);
    navigate('/login', { state: { from: '/donate' } });
  };

  const handleDownloadCertificate = async () => {
    if (completedDonation) {
      try {
        await dispatch(generateDonationCertificate(completedDonation._id)).unwrap();
        showSuccessToast("Certificate sent to your email successfully!");
      } catch (error: any) {
        console.error("Certificate generation failed:", error);
        showErrorToast(error.message || "Failed to send certificate. Please try again.");
      }
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit-card":
      case "debit-card":
        return <CreditCard className="h-4 w-4" />;
      case "paypal":
        return <Smartphone className="h-4 w-4" />;
      case "bank-transfer":
        return <Building2 className="h-4 w-4" />;
      case "cryptocurrency":
        return <Globe className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="mb-4">Make a Difference</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Donate to{" "}
              <span className="text-primary">Change Lives</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your generous donation helps us create lasting positive impact in communities worldwide. Every contribution matters.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalDonors}</p>
                <p className="text-sm text-muted-foreground">Total Donations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <IndianRupee className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{formatAmount(stats.totalAmount)}</p>
                <p className="text-sm text-muted-foreground">Total Raised</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalDonors}</p>
                <p className="text-sm text-muted-foreground">Generous Donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{formatAmount(stats.averageDonation)}</p>
                <p className="text-sm text-muted-foreground">Average Donation</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="donate">Donate Now</TabsTrigger>
                <TabsTrigger value="causes">Our Causes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="causes" className="space-y-8">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">Choose Your Cause</h2>
                <p className="text-lg text-muted-foreground">
                  Support a specific initiative that resonates with your values
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {causes.map((cause) => {
                  const Icon = cause.icon;
                  return (
                    <Card key={cause.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{cause.name}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{cause.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Raised: {cause.raised}</span>
                            <span>Target: {cause.target}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${cause.progress}%` }}
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setFormData(prev => ({ ...prev, designation: cause.id as any }));
                            setActiveTab("donate");
                          }}
                        >
                          Donate to This Cause
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="donate" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Donation Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <span>Make Your Donation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Amount Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Select Donation Amount</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {predefinedAmounts.map((amount) => (
                            <Button
                              key={amount}
                              variant={selectedAmount === amount && !isCustomAmount ? "default" : "outline"}
                              onClick={() => handleAmountSelect(amount)}
                              className="flex items-center justify-center space-x-1"
                            >
                              <IndianRupee className="h-4 w-4" />
                              <span>{amount.toLocaleString('en-IN')}</span>
                            </Button>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customAmount">Custom Amount (₹)</Label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="customAmount"
                              type="number"
                              value={formData.customAmount}
                              onChange={(e) => handleCustomAmountChange(e.target.value)}
                              placeholder="Enter custom amount"
                              className="pl-10"
                              min="100"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Minimum donation: ₹100</p>
                        </div>
                      </div>

                      {/* Purpose Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="designation">Donation Purpose</Label>
                        <Select value={formData.designation} onValueChange={(value) => handleInputChange("designation", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {causes.map((cause) => (
                              <SelectItem key={cause.id} value={cause.id}>
                                {cause.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Payment Method</Label>
                        <RadioGroup 
                          value={formData.paymentMethod} 
                          onValueChange={(value: any) => handleInputChange("paymentMethod", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <Label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
                              <CreditCard className="h-4 w-4" />
                              <span>Credit Card</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="debit-card" id="debit-card" />
                            <Label htmlFor="debit-card" className="flex items-center space-x-2 cursor-pointer">
                              <CreditCard className="h-4 w-4" />
                              <span>Debit Card</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                              <Smartphone className="h-4 w-4" />
                              <span>PayPal</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Label htmlFor="bank-transfer" className="flex items-center space-x-2 cursor-pointer">
                              <Building2 className="h-4 w-4" />
                              <span>Bank Transfer</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cryptocurrency" id="cryptocurrency" />
                            <Label htmlFor="cryptocurrency" className="flex items-center space-x-2 cursor-pointer">
                              <Globe className="h-4 w-4" />
                              <span>Cryptocurrency</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Anonymous Donation */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="anonymous" 
                          checked={formData.isAnonymous}
                          onCheckedChange={(checked) => handleInputChange("isAnonymous", checked === true)}
                        />
                        <Label htmlFor="anonymous" className="text-sm">
                          Make this donation anonymous
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Donor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-primary" />
                        <span>Donor Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="donorName">Full Name *</Label>
                        <Input
                          id="donorName"
                          value={formData.donorName}
                          onChange={(e) => handleInputChange("donorName", e.target.value)}
                          placeholder="Enter your full name"
                          disabled={formData.isAnonymous}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="donorEmail"
                            type="email"
                            value={formData.donorEmail}
                            onChange={(e) => handleInputChange("donorEmail", e.target.value)}
                            placeholder="Enter your email"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donorPhone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="donorPhone"
                            value={formData.donorPhone}
                            onChange={(e) => handleInputChange("donorPhone", e.target.value)}
                            placeholder="+91 9876543210"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Address</Label>
                        
                        <div className="space-y-2">
                          <Input
                            placeholder="Street Address"
                            value={formData.donorAddress?.street || ""}
                            onChange={(e) => handleInputChange("donorAddress.street", e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="City"
                            value={formData.donorAddress?.city || ""}
                            onChange={(e) => handleInputChange("donorAddress.city", e.target.value)}
                          />
                          <Input
                            placeholder="State"
                            value={formData.donorAddress?.state || ""}
                            onChange={(e) => handleInputChange("donorAddress.state", e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="ZIP Code"
                            value={formData.donorAddress?.zipCode || ""}
                            onChange={(e) => handleInputChange("donorAddress.zipCode", e.target.value)}
                          />
                          <Input
                            placeholder="Country"
                            value={formData.donorAddress?.country || "United States"}
                            onChange={(e) => handleInputChange("donorAddress.country", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                        <Input
                          id="panNumber"
                          value={formData.panNumber}
                          onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                        <p className="text-xs text-muted-foreground">
                          Required for tax benefits under Section 80G
                        </p>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Share a message with your donation..."
                          rows={3}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.message?.length || 0}/1000 characters
                        </p>
                      </div>

                      {/* Donation Type Selection */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Donation Type</Label>
                        <RadioGroup 
                          value={formData.donationType} 
                          onValueChange={(value: any) => handleInputChange("donationType", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-time" id="one-time" />
                            <Label htmlFor="one-time" className="cursor-pointer">One-time Donation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="cursor-pointer">Monthly Recurring</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quarterly" id="quarterly" />
                            <Label htmlFor="quarterly" className="cursor-pointer">Quarterly Recurring</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual" id="annual" />
                            <Label htmlFor="annual" className="cursor-pointer">Annual Recurring</Label>
                          </div>

                           <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recurring" id="recurring" />
                            <Label htmlFor="recurring" className="cursor-pointer">Recurring Donation</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Consent Checkboxes */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Communication Preferences</Label>
                        
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2 p-3 border rounded-lg bg-red-50 border-red-200">
                            <Checkbox 
                              id="dataProcessing" 
                              checked={formData.donorConsent.dataProcessing}
                              onCheckedChange={(checked) => handleInputChange("donorConsent.dataProcessing", checked === true)}
                              required
                              className="mt-1"
                            />
                            <div className="flex flex-col">
                              <Label htmlFor="dataProcessing" className="text-sm font-medium text-red-800">
                                I consent to the processing of my personal data for donation processing *
                              </Label>
                              <p className="text-xs text-red-600 mt-1">
                                This consent is required by law and necessary to process your donation.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="updates" 
                              checked={formData.donorConsent.updates}
                              onCheckedChange={(checked) => handleInputChange("donorConsent.updates", checked === true)}
                            />
                            <Label htmlFor="updates" className="text-sm">
                              Send me updates about project progress
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="newsletter" 
                              checked={formData.donorConsent.newsletter}
                              onCheckedChange={(checked) => handleInputChange("donorConsent.newsletter", checked === true)}
                            />
                            <Label htmlFor="newsletter" className="text-sm">
                              Subscribe to our newsletter
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="marketing" 
                              checked={formData.donorConsent.marketing}
                              onCheckedChange={(checked) => handleInputChange("donorConsent.marketing", checked === true)}
                            />
                            <Label htmlFor="marketing" className="text-sm">
                              Send me marketing communications about events and campaigns
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Public Display Option */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="publicDisplay" 
                          checked={formData.publicDisplay}
                          onCheckedChange={(checked) => handleInputChange("publicDisplay", checked === true)}
                        />
                        <Label htmlFor="publicDisplay" className="text-sm">
                          Display my name on the public donor wall (unless anonymous)
                        </Label>
                      </div>

                      {/* Security Notice */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your payment information is encrypted and secure. We never store your payment details.
                        </p>
                      </div>

                      {/* Donate Button */}
                      <Button 
                        size="lg" 
                        className="w-full" 
                        onClick={handleDonate}
                        disabled={!selectedAmount || donationLoading || paymentLoading}
                      >
                        {(donationLoading || paymentLoading) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            {donationLoading ? "Creating Donation..." : "Processing Payment..."}
                          </>
                        ) : (
                          <>
                            {getPaymentIcon(formData.paymentMethod)}
                            <span className="ml-2">
                              Donate {selectedAmount ? formatAmount(selectedAmount) : "Now"}
                            </span>
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Success Dialog */}
          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ngo-purple-light">
                      <CheckCircle className="h-8 w-8 text-ngo-purple" />
                    </div>
                  </div>
                  Thank You for Your Donation!
                </DialogTitle>
              </DialogHeader>
              
              {completedDonation && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {formatAmount(completedDonation.amount)}
                    </p>
                    <p className="text-muted-foreground">
                      Transaction ID: {completedDonation.transactionId}
                    </p>
                    <p className="text-sm text-green-600">
                      ✅ Certificate sent to {completedDonation.donorEmail}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" onClick={handleDownloadCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Resend Certificate to Email
                    </Button>
                    
                    <Button variant="outline" className="w-full" onClick={() => setShowSuccessDialog(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Authentication Required Dialog */}
          <Dialog open={showAuthRequiredDialog} onOpenChange={setShowAuthRequiredDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                      <AlertCircle className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  Authentication Required
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Please log in to your account to make a donation. This helps us:
                  </p>
                  <ul className="text-left text-sm text-muted-foreground space-y-1 mt-4">
                    <li>• Send you donation certificates and receipts</li>
                    <li>• Track your donation history</li>
                    <li>• Provide tax-deductible receipts</li>
                    <li>• Keep you updated on project progress</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" onClick={handleAuthRequired}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Login to Continue
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={() => setShowAuthRequiredDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
