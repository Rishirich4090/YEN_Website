import Layout from "@/components/Layout";
import NGOImage from "@/components/NGOImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Shield,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Calendar,
  Award,
  Users,
  Target,
  TrendingUp,
  Key,
  Bell,
  Lock,
} from "lucide-react";

interface AdminData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  role: "admin";
  avatar: string;
  department: string;
  permissions: string[];
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState<AdminData>({
    id: "ADMIN-001",
    name: "HopeHands Admin",
    email: "admin@hopehands.org",
    phone: "+1 (555) 123-4567",
    address: "123 Hope Street, Suite 400, Global City, State 12345",
    joinDate: "January 1, 2015",
    role: "admin",
    avatar: "community",
    department: "Executive Management",
    permissions: [
      "User Management",
      "Content Management",
      "System Administration",
      "Certificate Generation",
      "Announcement Broadcasting",
      "Event Management",
      "Project Management",
      "Analytics Access",
    ],
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    // Update admin data from localStorage
    if (email) {
      setAdminData((prev) => ({ ...prev, email }));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Dispatch custom event to notify Layout component of auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const stats = [
    { label: "Admin Since", value: adminData.joinDate, icon: Calendar },
    { label: "Members Managed", value: "500+", icon: Users },
    { label: "Projects Overseen", value: "150+", icon: Target },
    { label: "System Uptime", value: "99.9%", icon: TrendingUp },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Profile
              </h1>
              <div className="text-muted-foreground flex items-center gap-2">
                <span>
                  Admin ID: {adminData.id} • Department: {adminData.department}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Personal Info</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={adminData.avatar} />
                      <AvatarFallback className="text-2xl">
                        {adminData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {adminData.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Administrator since {adminData.joinDate}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Administrator
                        </Badge>
                        <Badge variant="outline">{adminData.department}</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={adminData.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setAdminData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={adminData.email}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setAdminData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={adminData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setAdminData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={adminData.department}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setAdminData((prev) => ({
                              ...prev,
                              department: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Office Address</Label>
                        <Textarea
                          id="address"
                          value={adminData.address}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setAdminData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5 text-primary" />
                    <span>Admin Permissions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      As an administrator, you have access to the following
                      system capabilities:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {adminData.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{permission}</span>
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <span>Security Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-muted-foreground">
                            Last changed 30 days ago
                          </p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button variant="outline">Configure 2FA</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Login Sessions</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage active sessions
                          </p>
                        </div>
                        <Button variant="outline">View Sessions</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Security Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span>
                          Successful login from Chrome (Current session)
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          Just now
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span>Password changed successfully</span>
                        <span className="text-muted-foreground ml-auto">
                          30 days ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        <span>Profile information updated</span>
                        <span className="text-muted-foreground ml-auto">
                          45 days ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Admin Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system events
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Dashboard Widgets</h3>
                        <p className="text-sm text-muted-foreground">
                          Customize your dashboard layout
                        </p>
                      </div>
                      <Button variant="outline">Customize</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">System Theme</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred interface theme
                        </p>
                      </div>
                      <Button variant="outline">Change Theme</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Export Data</h3>
                        <p className="text-sm text-muted-foreground">
                          Download system reports and analytics
                        </p>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
