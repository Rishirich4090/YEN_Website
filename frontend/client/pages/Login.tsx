import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Heart
} from "lucide-react";

// Redux imports
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { 
  loginUser, 
  registerUser, 
  clearError,
  selectAuth,
  selectAuthLoading,
  selectAuthError 
} from "../../src/redux/slices/authSlice";
import { useToastHelpers } from "../../src/components/providers/ToastProvider";

interface LoginFormData {
  email: string;
  password: string;
  role: "member" | "admin";
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  membershipType: string;
  role: string;
  address: string;
  dateOfBirth: string;
  avatar: string;
  reason: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  
  // Redux state
  const auth = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const authError = useAppSelector((state) => state.auth.error);
  
  // Local state
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: "member"
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    membershipType: "basic",
    role: "member",
    address: "",
    dateOfBirth: "",
    avatar: "",
    reason: ""
  });

  // Handle successful authentication
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      console.log('🔄 Login: User authenticated, preparing redirect...', {
        userRole: auth.user.role,
        userEmail: auth.user.email,
        redirectState: location.state
      });
      
      showSuccessToast(`Welcome back, ${auth.user.email}!`);
      
      // Let the Router and ProtectedRoute handle the redirect logic
      // This prevents the blinking issue caused by competing redirects
      console.log('🔄 Login: Auth successful, letting Router handle navigation');
    }
  }, [auth.isAuthenticated, auth.user, showSuccessToast]);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      showErrorToast(authError);
      dispatch(clearError());
    }
  }, [authError, showErrorToast, dispatch]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(loginUser({
        email: loginData.email,
        password: loginData.password
      })).unwrap();
      
      // Success is handled in useEffect above
    } catch (error) {
      // Error is handled in useEffect above
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (signupData.password !== signupData.confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    if (signupData.password.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return;
    }

    if (!signupData.phone.trim()) {
      showErrorToast("Phone number is required.");
      return;
    }

    if (!/^\+?\d{10,15}$/.test(signupData.phone)) {
      showErrorToast("Invalid phone number format.");
      return;
    }

    if (signupData.dateOfBirth) {
      const dob = new Date(signupData.dateOfBirth);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
      if (dob > minDate) {
        showErrorToast("You must be at least 18 years old.");
        return;
      }
    }

    try {
      await dispatch(registerUser({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        phone: signupData.phone,
        membershipType: signupData.membershipType as 'basic' | 'premium' | 'lifetime'
      })).unwrap();

      setSuccess("Account created successfully! Please check your email for verification.");
      setActiveTab("login");
      
      // Reset form
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        membershipType: "basic",
        role: "member",
        address: "",
        dateOfBirth: "",
        avatar: "",
        reason: ""
      });
    } catch (error) {
      // Error is handled in useEffect above
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    dispatch(clearError());
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSignupData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    dispatch(clearError());
  };

  const features = [
    {
      icon: Heart,
      title: "Make Direct Impact",
      description: "Your membership directly funds life-changing projects"
    },
    {
      icon: User,
      title: "Global Community",
      description: "Connect with changemakers worldwide"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  return (
    <Layout>
      <section className="py-20 min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary">Join Our Mission</Badge>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Welcome to{" "}
                  <span className="text-primary">HopeHands</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join our global community of changemakers creating positive impact in communities worldwide.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">New to HopeHands?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your member account to access our community, projects, and resources.
                </p>
                <Link to="/membership" className="text-primary hover:underline text-sm font-medium">
                  Learn more about membership →
                </Link>
              </div>

              {/* Demo Credentials */}
              <div className="p-6 bg-ngo-pink-light border border-ngo-pink rounded-lg">
                <h3 className="font-semibold mb-2 text-ngo-purple">Demo Credentials</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-ngo-purple-light">Member Account:</p>
                    <p className="text-ngo-purple">Email: member@hopehands.org</p>
                    <p className="text-ngo-purple">Password: member123</p>
                  </div>
                  <div>
                    <p className="font-medium text-ngo-purple-light">Admin Account:</p>
                    <p className="text-ngo-purple">Email: admin@hopehands.org</p>
                    <p className="text-ngo-purple">Password: admin123</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="max-w-md mx-auto w-full">
              <Card>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Access Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login" className="flex items-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Success Message */}
                    {success && (
                      <div className="p-4 bg-ngo-pink-light border border-ngo-pink rounded-lg flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-ngo-purple" />
                        <span className="text-ngo-purple text-sm">{success}</span>
                      </div>
                    )}

                    {/* Error Message */}
                    {authError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <span className="text-destructive text-sm">{authError}</span>
                      </div>
                    )}

                    <TabsContent value="login" className="space-y-4">
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="loginEmail">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="loginEmail"
                              name="email"
                              type="email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              placeholder="Enter your email"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="loginPassword">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="loginPassword"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={handleLoginChange}
                              placeholder="Enter your password"
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Login As</Label>
                          <Select
                            value={loginData.role}
                            onValueChange={(value: "member" | "admin") => 
                              setLoginData(prev => ({ ...prev, role: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>Member</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Admin</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Signing In...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In
                            </>
                          )}
                        </Button>

                        <div className="text-center">
                          <button
                            type="button"
                            className="text-sm text-primary hover:underline"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <div className="text-center mb-4">
                        <Badge variant="outline">Member Registration Only</Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Admin accounts are created by existing administrators
                        </p>
                      </div>

                      <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signupRole">Role</Label>
                          <Select value={signupData.role} onValueChange={(value) => setSignupData(prev => ({...prev, role: value}))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="signupFirstName">First Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="signupFirstName"
                                name="firstName"
                                value={signupData.firstName}
                                onChange={handleSignupChange}
                                placeholder="Enter your first name"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signupLastName">Last Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="signupLastName"
                                name="lastName"
                                value={signupData.lastName}
                                onChange={handleSignupChange}
                                placeholder="Enter your last name"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupEmail">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signupEmail"
                              name="email"
                              type="email"
                              value={signupData.email}
                              onChange={handleSignupChange}
                              placeholder="Enter your email"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupPhone">Phone Number</Label>
                          <Input
                            id="signupPhone"
                            name="phone"
                            type="tel"
                            value={signupData.phone}
                            onChange={handleSignupChange}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="signupPassword">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="signupPassword"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={signupData.password}
                                onChange={handleSignupChange}
                                placeholder="Create a password"
                                className="pl-10 pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Password must be at least 8 characters long
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={signupData.confirmPassword}
                                onChange={handleSignupChange}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupMembershipType">Membership Type</Label>
                          <Select value={signupData.membershipType} onValueChange={(value) => setSignupData(prev => ({...prev, membershipType: value}))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="lifetime">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupAddress">Address (Optional)</Label>
                          <Input
                            id="signupAddress"
                            name="address"
                            value={signupData.address}
                            onChange={handleSignupChange}
                            placeholder="Enter your address"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="signupDateOfBirth">Date of Birth (Optional)</Label>
                            <Input
                              id="signupDateOfBirth"
                              name="dateOfBirth"
                              type="date"
                              value={signupData.dateOfBirth}
                              onChange={handleSignupChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signupAvatar">Avatar URL (Optional)</Label>
                            <Input
                              id="signupAvatar"
                              name="avatar"
                              type="url"
                              value={signupData.avatar}
                              onChange={handleSignupChange}
                              placeholder="Enter avatar URL"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupReason">Reason for Joining (Optional)</Label>
                          <Input
                            id="signupReason"
                            name="reason"
                            value={signupData.reason}
                            onChange={handleSignupChange}
                            placeholder="Why do you want to join?"
                          />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                          By creating an account, you agree to our{" "}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
