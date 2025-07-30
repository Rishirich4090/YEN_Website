import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Shield,
  Award,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  FileText,
  Download,
  MessageCircle,
  Bell,
  Settings,
  Camera,
  Send,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

// Redux imports
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { 
  sendContactMessage,
  selectContactLoading,
  selectContactError,
  clearError
} from "../../src/redux/slices/contactSlice";
import { useToastHelpers } from "../../src/components/providers/ToastProvider";
import VerificationBadge from "@/components/VerificationBadge";

interface MembershipFormData {
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
}

export default function Membership() {
  const [activeTab, setActiveTab] = useState("apply");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [loginData, setLoginData] = useState({ loginId: "", password: "" });
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => state.contact?.isLoading || false);
  const error = useAppSelector((state) => state.contact?.error || null);
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [formData, setFormData] = useState<MembershipFormData>({
    name: "",
    email: "",
    phone: "",
    membershipType: "basic"
  });

  // Clear errors on mount and unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send membership application through contact API
      await dispatch(sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Membership Application - ${formData.membershipType}`,
        message: `I would like to apply for ${formData.membershipType} membership. 

Membership Type: ${formData.membershipType.charAt(0).toUpperCase() + formData.membershipType.slice(1)}
Phone: ${formData.phone}

Please process my application and send me the login credentials.

Thank you!`
      })).unwrap();

      setIsSubmitted(true);
      showSuccessToast("Application Submitted! Check your email for login credentials.");

      // Switch to status tab after submission
      setTimeout(() => {
        setActiveTab("login");
      }, 2000);

    } catch (error: any) {
      console.error("Membership application failed:", error);
      showErrorToast(error.message || "Something went wrong. Please try again.");
    }
  };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/membership/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setMemberData(data.data.member);
        localStorage.setItem('memberToken', data.data.token);

        showSuccessToast("Login successful! Welcome to your dashboard.");

        // Switch to dashboard tab
        setActiveTab("status");
      } else {
        showErrorToast(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      showErrorToast("Login failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const benefits = [
    {
      icon: Heart,
      title: "Make Direct Impact",
      description: "Your membership directly funds life-changing projects worldwide"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with like-minded changemakers from around the world"
    },
    {
      icon: FileText,
      title: "Official Certificate",
      description: "Receive a personalized membership certificate upon approval"
    },
    {
      icon: MessageCircle,
      title: "Member Chat",
      description: "Access to exclusive member-only group chat and discussions"
    },
    {
      icon: Bell,
      title: "Project Updates",
      description: "Get exclusive updates on projects and impact reports"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Be recognized for your contributions to positive change"
    }
  ];

  const requirements = [
    "Be at least 18 years old",
    "Provide valid contact information",
    "Upload a recent photograph",
    "Explain your motivation for joining",
    "Agree to our code of conduct",
    "Commit to our mission and values"
  ];

  const process = [
    {
      step: "1",
      title: "Submit Application",
      description: "Fill out the membership form with all required information",
      icon: FileText
    },
    {
      step: "2",
      title: "Review Process",
      description: "Our admin team reviews your application within 3-5 business days",
      icon: Clock
    },
    {
      step: "3",
      title: "Approval & Certificate",
      description: "Upon approval, receive your membership certificate and dashboard access",
      icon: Award
    }
  ];

  // Mock member data removed - using real memberData state instead

  const renderApplicationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Membership Application</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">Application Submitted Successfully!</h3>
            <p className="text-muted-foreground">
              Thank you for applying. Check your email for login credentials to track your application status.
            </p>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Status: Pending Approval
            </Badge>
            <Button onClick={() => setActiveTab("login")} className="mt-4">
              Login to Check Status
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Membership Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Choose Membership Type</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: 'basic', name: 'Basic', duration: '1 Year', price: 'Free', features: ['Certificate', 'Community Access', 'Project Updates'] },
                  { type: 'premium', name: 'Premium', duration: '2 Years', price: '$25', features: ['All Basic Features', 'Priority Support', 'Exclusive Events'] },
                  { type: 'lifetime', name: 'Lifetime', duration: 'Lifetime', price: '$100', features: ['All Premium Features', 'Lifetime Access', 'Special Recognition'] }
                ].map((plan) => (
                  <Card
                    key={plan.type}
                    className={`cursor-pointer transition-all ${formData.membershipType === plan.type ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, membershipType: plan.type as any }))}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-lg">{plan.name}</h4>
                      <p className="text-2xl font-bold text-primary">{plan.price}</p>
                      <p className="text-sm text-muted-foreground">{plan.duration}</p>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                        {plan.features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Membership Application
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );

  const renderLoginForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Member Login</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginId">Login ID</Label>
            <Input
              id="loginId"
              value={loginData.loginId}
              onChange={(e) => setLoginData(prev => ({ ...prev, loginId: e.target.value }))}
              placeholder="Enter your login ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Logging in...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Don't have login credentials?</p>
              <p className="text-blue-700">
                Submit a membership application first, then check your email for login details.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMemberStatus = () => {
    if (!isLoggedIn || !memberData) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Please Login</h3>
            <p className="text-muted-foreground mb-6">
              Login to check your membership status and access member features.
            </p>
            <Button onClick={() => setActiveTab("login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      );
    }

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
        case 'approved':
          return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved ✓</Badge>;
        case 'rejected':
          return <Badge variant="destructive">Rejected</Badge>;
        case 'expired':
          return <Badge variant="destructive">Expired</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    };

    const getDaysRemaining = () => {
      if (!memberData.membershipEndDate) return null;
      const endDate = new Date(memberData.membershipEndDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysRemaining = getDaysRemaining();

    return (
      <div className="space-y-6">
        {/* Member Status Card */}
        <Card className={`${memberData.approvalStatus === 'approved' ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-gradient-to-r from-yellow-50 to-orange-50'}`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <User className="h-8 w-8 text-primary" />
                  {memberData.hasVerificationBadge && (
                    <VerificationBadge
                      isVerified={true}
                      size="lg"
                      className="absolute -bottom-1 -right-1 bg-white rounded-full p-1"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>{memberData.name}</span>
                    {memberData.hasVerificationBadge && <VerificationBadge isVerified={true} size="md" />}
                  </h2>
                  <p className="text-muted-foreground">Member ID: {memberData.membershipId}</p>
                  <p className="text-sm text-muted-foreground">
                    {memberData.membershipType.charAt(0).toUpperCase() + memberData.membershipType.slice(1)} Member
                  </p>
                </div>
              </div>
              {getStatusBadge(memberData.approvalStatus)}
            </div>

            {/* Membership Duration Info */}
            {memberData.approvalStatus === 'approved' && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold">
                      {memberData.membershipStartDate ? new Date(memberData.membershipStartDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-semibold">
                      {memberData.membershipEndDate ? new Date(memberData.membershipEndDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                    <p className={`font-semibold ${daysRemaining && daysRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {daysRemaining ? `${daysRemaining} days` : 'Calculating...'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Status-specific content */}
            {memberData.approvalStatus === 'pending' && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Application Under Review</h4>
                </div>
                <p className="text-yellow-700 mt-2">
                  Your membership application is being reviewed by our admin team. You'll receive an email notification once it's processed.
                </p>
              </div>
            )}

            {memberData.approvalStatus === 'approved' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Membership Approved!</h4>
                </div>
                <p className="text-green-700 mt-2">
                  Congratulations! Your membership has been approved and you now have access to all member benefits.
                </p>
              </div>
            )}

            {memberData.approvalStatus === 'expired' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Membership Expired</h4>
                </div>
                <p className="text-red-700 mt-2">
                  Your membership has expired. Please extend your membership to continue enjoying member benefits.
                </p>
                <Button className="mt-3" onClick={() => setActiveTab("apply")}>
                  Extend Membership
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {memberData.approvalStatus === 'approved' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Your Certificate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Award className="h-12 w-12 text-primary mx-auto" />
                  <p className="text-muted-foreground">
                    Your official membership certificate is ready for download.
                  </p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Member Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Join Member Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  View Announcements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  View Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">Join Our Mission</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Become a{" "}
              <span className="text-primary">HopeHands Member</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join our global community of changemakers and help us create lasting positive impact in communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="apply">Apply</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="benefits" className="space-y-12">
              {/* Membership Benefits */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Membership Benefits</h2>
                  <p className="text-lg text-muted-foreground">
                    Discover what makes being a HopeHands member special
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="p-0 space-y-4">
                          <div className="flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                              <Icon className="h-6 w-6 text-primary-foreground" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold">{benefit.title}</h3>
                          <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Application Process */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Application Process</h2>
                  <p className="text-lg text-muted-foreground">
                    Simple steps to join our community
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {process.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                              <Icon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                              {step.step}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements */}
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Membership Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="apply">
              <div className="max-w-2xl mx-auto">
                {renderApplicationForm()}
              </div>
            </TabsContent>

            <TabsContent value="login">
              <div className="max-w-md mx-auto">
                {renderLoginForm()}
              </div>
            </TabsContent>

            <TabsContent value="status">
              <div className="max-w-4xl mx-auto">
                {renderMemberStatus()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
