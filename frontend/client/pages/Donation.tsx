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
  UserPlus
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

interface DonationFormData {
  donorName: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  customAmount: string;
  paymentMethod: "card" | "upi" | "netbanking";
  purpose: string;
  panNumber: string;
  isAnonymous: boolean;
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

  // Component state
  const [activeTab, setActiveTab] = useState("donate");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<any | null>(null);

  const [formData, setFormData] = useState<DonationFormData>({
    donorName: "",
    email: "",
    phone: "",
    address: "",
    amount: 0,
    customAmount: "",
    paymentMethod: "upi",
    purpose: "General Support",
    panNumber: "",
    isAnonymous: false
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

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDonate = async () => {
    if (!selectedAmount || selectedAmount < 100) {
      showErrorToast("Minimum donation amount is ₹100");
      return;
    }

    if (!formData.donorName || !formData.email || !formData.phone) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    try {
      // Create donation using Redux
      const donationResult = await dispatch(createDonation({
        donorName: formData.donorName,
        donorEmail: formData.email,
        amount: selectedAmount,
        currency: "INR",
        donationType: 'one-time',
        paymentMethod: formData.paymentMethod,
        project: formData.purpose,
        message: "",
        isAnonymous: formData.isAnonymous
      })).unwrap();

      // Initiate payment
      const paymentResult = await dispatch(initiatePayment({
        donationId: donationResult._id,
        amount: selectedAmount,
        currency: "INR",
        paymentMethod: formData.paymentMethod
      })).unwrap();

      // For demo purposes, simulate successful payment
      // In real implementation, this would be handled by payment gateway callback
      setTimeout(async () => {
        try {
          await dispatch(verifyPayment({
            donationId: donationResult._id,
            paymentId: paymentResult.transactionId,
            status: "success"
          })).unwrap();

          setCompletedDonation({
            ...donationResult,
            paymentStatus: "completed",
            transactionId: paymentResult.transactionId
          });
          setShowSuccessDialog(true);
          showSuccessToast("Donation completed successfully!");
        } catch (verifyError) {
          console.error("Payment verification failed:", verifyError);
          showErrorToast("Payment verification failed. Please contact support.");
        }
      }, 2000);

    } catch (error: any) {
      console.error("Donation failed:", error);
      showErrorToast(error.message || "Donation failed. Please try again.");
    }
  };

  const handleDownloadCertificate = async () => {
    if (completedDonation) {
      try {
        await dispatch(generateDonationCertificate(completedDonation._id)).unwrap();
        
        showSuccessToast("Certificate downloaded successfully!");
      } catch (error: any) {
        console.error("Certificate generation failed:", error);
        showErrorToast(error.message || "Failed to generate certificate. Please try again.");
      }
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "upi":
        return <Smartphone className="h-4 w-4" />;
      case "netbanking":
        return <Building2 className="h-4 w-4" />;
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
                            setFormData(prev => ({ ...prev, purpose: cause.name }));
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
                        <Label htmlFor="purpose">Donation Purpose</Label>
                        <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {causes.map((cause) => (
                              <SelectItem key={cause.id} value={cause.name}>
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
                          onValueChange={(value: "card" | "upi" | "netbanking") => handleInputChange("paymentMethod", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer">
                              <Smartphone className="h-4 w-4" />
                              <span>UPI Payment</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                              <CreditCard className="h-4 w-4" />
                              <span>Credit/Debit Card</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="netbanking" id="netbanking" />
                            <Label htmlFor="netbanking" className="flex items-center space-x-2 cursor-pointer">
                              <Building2 className="h-4 w-4" />
                              <span>Net Banking</span>
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
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 9876543210"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter your address"
                            className="pl-10"
                            rows={3}
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
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
                      Donation ID: {completedDonation.id}
                    </p>
                  </div>

                  {completedDonation.memberAccountCreated && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Member Account Created!</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Member ID:</strong> {completedDonation.memberId}</p>
                        <p><strong>Password:</strong> {completedDonation.memberPassword}</p>
                        <p className="text-blue-700">
                          You can now login to connect with other members!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full" onClick={handleDownloadCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Donation Certificate
                    </Button>
                    
                    {completedDonation.memberAccountCreated && (
                      <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                        <User className="mr-2 h-4 w-4" />
                        Login to Member Area
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" onClick={() => setShowSuccessDialog(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
