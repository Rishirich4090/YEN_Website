import Layout from "@/components/Layout";
import NGOImage from "@/components/NGOImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateMembershipCertificate } from "@/lib/certificateGenerator";
import { chatService } from "@/lib/chatService";
import { donationService, type DonationData } from "@/lib/donationService";
import { generateDonationCertificateForData } from "@/lib/donationCertificateGenerator";
import {
  Shield,
  Users,
  CheckCircle,
  X,
  FileText,
  Bell,
  Calendar,
  Send,
  LogOut,
  Eye,
  Download,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  Award,
  Clock,
  MessageCircle,
  User,
  Gift,
  IndianRupee,
  CreditCard,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  joinDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  avatar: string;
  lastActive: string;
  loginCount: number;
  certificateDownloaded: boolean;
  eventsAttended: number;
  messagesPosted: number;
  profileCompleteness: number;
}

interface MemberActivity {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  details: string;
  timestamp: string;
  type: "login" | "certificate" | "chat" | "event" | "profile";
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  targetAudience: "all" | "members" | "admins";
  createdAt: string;
  createdBy: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: "upcoming" | "ongoing" | "completed";
  createdBy: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [donationStats, setDonationStats] = useState(
    donationService.getStats(),
  );
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    priority: "medium" as "high" | "medium" | "low",
    targetAudience: "all" as "all" | "members" | "admins",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, City, State 12345",
      dateOfBirth: "1990-05-15",
      joinDate: "2024-01-15",
      status: "pending",
      reason:
        "I want to contribute to meaningful projects that help communities in need and make a positive impact on the world.",
      avatar: "community",
      lastActive: "Never",
      loginCount: 0,
      certificateDownloaded: false,
      eventsAttended: 0,
      messagesPosted: 0,
      profileCompleteness: 85,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Avenue, Town, State 67890",
      dateOfBirth: "1985-08-22",
      joinDate: "2024-01-10",
      status: "approved",
      reason:
        "As someone passionate about education and community development, I believe HopeHands aligns perfectly with my values.",
      avatar: "community",
      lastActive: "2 hours ago",
      loginCount: 47,
      certificateDownloaded: true,
      eventsAttended: 3,
      messagesPosted: 25,
      profileCompleteness: 100,
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Road, Village, State 54321",
      dateOfBirth: "1992-12-03",
      joinDate: "2024-01-08",
      status: "approved",
      reason:
        "I have experience in project management and want to use my skills to help underserved communities access clean water and education.",
      avatar: "community",
      lastActive: "1 day ago",
      loginCount: 32,
      certificateDownloaded: true,
      eventsAttended: 2,
      messagesPosted: 18,
      profileCompleteness: 95,
    },
    {
      id: "4",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@email.com",
      phone: "+1 (555) 456-7890",
      address: "321 Elm Street, City, State 98765",
      dateOfBirth: "1988-03-17",
      joinDate: "2024-01-12",
      status: "rejected",
      reason: "I want to help but my application was incomplete.",
      avatar: "community",
      lastActive: "Never",
      loginCount: 0,
      certificateDownloaded: false,
      eventsAttended: 0,
      messagesPosted: 0,
      profileCompleteness: 60,
    },
    {
      id: "5",
      name: "Demo Member",
      email: "member@hopehands.org",
      phone: "+1 (555) 555-0001",
      address: "456 Demo Street, Demo City, State 11111",
      dateOfBirth: "1991-06-20",
      joinDate: "2024-01-01",
      status: "approved",
      reason:
        "Demo member account for testing the platform features and functionality.",
      avatar: "community",
      lastActive: "Online now",
      loginCount: 156,
      certificateDownloaded: true,
      eventsAttended: 5,
      messagesPosted: 89,
      profileCompleteness: 100,
    },
  ]);

  const [memberActivities, setMemberActivities] = useState<MemberActivity[]>([
    {
      id: "1",
      memberId: "2",
      memberName: "Sarah Johnson",
      action: "Downloaded Certificate",
      details: "Downloaded membership certificate PDF",
      timestamp: "2 hours ago",
      type: "certificate",
    },
    {
      id: "2",
      memberId: "5",
      memberName: "Demo Member",
      action: "Logged In",
      details: "Accessed member dashboard",
      timestamp: "5 minutes ago",
      type: "login",
    },
    {
      id: "3",
      memberId: "3",
      memberName: "Michael Chen",
      action: "Posted Message",
      details: "Posted message in member group chat",
      timestamp: "1 hour ago",
      type: "chat",
    },
    {
      id: "4",
      memberId: "2",
      memberName: "Sarah Johnson",
      action: "Registered for Event",
      details: "Registered for Member Appreciation Gala",
      timestamp: "3 hours ago",
      type: "event",
    },
    {
      id: "5",
      memberId: "5",
      memberName: "Demo Member",
      action: "Updated Profile",
      details: "Updated contact information",
      timestamp: "1 day ago",
      type: "profile",
    },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "New Water Project in Kenya",
      message:
        "We're excited to announce our new clean water initiative in rural Kenya. This project will provide clean drinking water to over 2,000 families.",
      priority: "high",
      targetAudience: "all",
      createdAt: "2024-01-15 10:30 AM",
      createdBy: "Admin",
    },
    {
      id: "2",
      title: "Monthly Member Meeting",
      message:
        "Don't forget about our monthly member meeting this Friday at 2 PM EST. We'll be discussing upcoming projects and volunteer opportunities.",
      priority: "medium",
      targetAudience: "members",
      createdAt: "2024-01-14 02:15 PM",
      createdBy: "Admin",
    },
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Member Appreciation Gala",
      description:
        "Annual celebration of our community's incredible impact and achievements",
      date: "2024-02-20",
      time: "19:00",
      location: "Virtual Event",
      maxAttendees: 200,
      currentAttendees: 145,
      status: "upcoming",
      createdBy: "Admin",
    },
    {
      id: "2",
      title: "Project Planning Workshop",
      description: "Collaborative session to plan our Q2 initiatives",
      date: "2024-01-25",
      time: "14:00",
      location: "Zoom Meeting",
      maxAttendees: 50,
      currentAttendees: 32,
      status: "upcoming",
      createdBy: "Admin",
    },
  ]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    // Initialize donations
    setDonations(donationService.getAllDonations());
    setDonationStats(donationService.getStats());

    // Listen for donation updates
    const unsubscribeDonations = donationService.onDonationUpdate(
      (updatedDonations) => {
        setDonations(updatedDonations);
        setDonationStats(donationService.getStats());
      },
    );

    return () => {
      unsubscribeDonations();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Dispatch custom event to notify Layout component of auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  const handleUserAction = async (
    userId: string,
    action: "approve" | "reject",
  ) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: action === "approve" ? "approved" : "rejected" }
          : u,
      ),
    );

    if (action === "approve" && user) {
      // Auto-generate certificate for approved member
      try {
        await generateMembershipCertificate({
          memberName: user.name,
          memberId: user.id,
          joinDate: user.joinDate,
          ngoName: "HopeHands NGO",
          logoUrl: "default",
          founderSignature: "default",
        });

        // Send announcement about new member
        chatService.sendAnnouncement(
          `Welcome our newest member, ${user.name}! Their membership has been approved and certificate has been generated.`,
          "New Member Approved",
        );

        alert(
          `${user.name} has been approved and their certificate has been generated!`,
        );
      } catch (error) {
        console.error("Error generating certificate:", error);
        alert(
          `${user.name} has been approved, but there was an error generating their certificate.`,
        );
      }
    } else if (action === "reject" && user) {
      alert(`${user.name}'s membership application has been rejected.`);
    }
  };

  const handleGenerateCertificate = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      await generateMembershipCertificate({
        memberName: user.name,
        memberId: user.id,
        joinDate: user.joinDate,
        ngoName: "HopeHands NGO",
        logoUrl: "/placeholder.svg",
        founderSignature: "/placeholder.svg",
      });
      alert(`Certificate generated successfully for ${user.name}!`);
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error generating certificate. Please try again.");
    }
  };

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.message) {
      const announcement: Announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        createdAt: new Date().toLocaleString(),
        createdBy: "Admin",
      };
      setAnnouncements((prev) => [announcement, ...prev]);

      // Send announcement to chat if targeting members or all
      if (
        newAnnouncement.targetAudience === "all" ||
        newAnnouncement.targetAudience === "members"
      ) {
        chatService.sendAnnouncement(
          newAnnouncement.message,
          newAnnouncement.title,
        );
      }

      setNewAnnouncement({
        title: "",
        message: "",
        priority: "medium",
        targetAudience: "all",
      });

      alert("Announcement created and sent successfully!");
    }
  };

  const handleCreateEvent = () => {
    if (
      newEvent.title &&
      newEvent.description &&
      newEvent.date &&
      newEvent.time
    ) {
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
        maxAttendees: parseInt(newEvent.maxAttendees) || 50,
        currentAttendees: 0,
        status: "upcoming",
        createdBy: "Admin",
      };
      setEvents((prev) => [event, ...prev]);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Members",
      value: users.filter((u) => u.status === "approved").length.toString(),
      icon: Users,
      change: "+12%",
    },
    {
      label: "Total Donations",
      value: donationStats.totalDonations.toString(),
      icon: Gift,
      change: "+25%",
    },
    {
      label: "Funds Raised",
      value: `₹${(donationStats.totalAmount / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      change: "+32%",
    },
    {
      label: "Pending Applications",
      value: users.filter((u) => u.status === "pending").length.toString(),
      icon: Clock,
      change: "-5%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-ngo-purple-light text-ngo-purple";
      case "pending":
        return "bg-ngo-pink-light text-ngo-pink";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span>Admin Management Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Comprehensive management tools for NGO operations
              </p>
            </div>

          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-ngo-purple">
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Members</span>
                  {users.filter((u) => u.status === "pending").length > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1.5 py-0.5"
                    >
                      {users.filter((u) => u.status === "pending").length}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="donations">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Donations</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Recent Applications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users
                        .filter((u) => u.status === "pending")
                        .slice(0, 3)
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUserAction(user.id, "approve")
                                }
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction(user.id, "reject")
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <Bell className="mr-2 h-4 w-4" />
                          Send Announcement
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Announcement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={newAnnouncement.title}
                              onChange={(e) =>
                                setNewAnnouncement((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              placeholder="Announcement title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={newAnnouncement.message}
                              onChange={(e) =>
                                setNewAnnouncement((prev) => ({
                                  ...prev,
                                  message: e.target.value,
                                }))
                              }
                              placeholder="Your announcement message..."
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <Select
                                value={newAnnouncement.priority}
                                onValueChange={(
                                  value: "high" | "medium" | "low",
                                ) =>
                                  setNewAnnouncement((prev) => ({
                                    ...prev,
                                    priority: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Audience</Label>
                              <Select
                                value={newAnnouncement.targetAudience}
                                onValueChange={(
                                  value: "all" | "members" | "admins",
                                ) =>
                                  setNewAnnouncement((prev) => ({
                                    ...prev,
                                    targetAudience: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Users</SelectItem>
                                  <SelectItem value="members">
                                    Members Only
                                  </SelectItem>
                                  <SelectItem value="admins">
                                    Admins Only
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            onClick={handleCreateAnnouncement}
                            className="w-full"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Announcement
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Create Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="eventTitle">Event Title</Label>
                            <Input
                              id="eventTitle"
                              value={newEvent.title}
                              onChange={(e) =>
                                setNewEvent((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              placeholder="Event title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventDescription">
                              Description
                            </Label>
                            <Textarea
                              id="eventDescription"
                              value={newEvent.description}
                              onChange={(e) =>
                                setNewEvent((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Event description..."
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="eventDate">Date</Label>
                              <Input
                                id="eventDate"
                                type="date"
                                value={newEvent.date}
                                onChange={(e) =>
                                  setNewEvent((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="eventTime">Time</Label>
                              <Input
                                id="eventTime"
                                type="time"
                                value={newEvent.time}
                                onChange={(e) =>
                                  setNewEvent((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventLocation">Location</Label>
                            <Input
                              id="eventLocation"
                              value={newEvent.location}
                              onChange={(e) =>
                                setNewEvent((prev) => ({
                                  ...prev,
                                  location: e.target.value,
                                }))
                              }
                              placeholder="Event location"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxAttendees">Max Attendees</Label>
                            <Input
                              id="maxAttendees"
                              type="number"
                              value={newEvent.maxAttendees}
                              onChange={(e) =>
                                setNewEvent((prev) => ({
                                  ...prev,
                                  maxAttendees: e.target.value,
                                }))
                              }
                              placeholder="50"
                            />
                          </div>
                          <Button
                            onClick={handleCreateEvent}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Event
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("members")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Manage Members
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Donations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <span>Recent Donations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {donations.slice(0, 4).map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center space-x-3 text-sm"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ngo-purple-light">
                            <Gift className="h-3 w-3 text-ngo-purple" />
                          </div>
                          <div className="flex-1">
                            <p>
                              <strong>
                                {donation.isAnonymous
                                  ? "Anonymous"
                                  : donation.donorName}
                              </strong>{" "}
                              donated{" "}
                              {donationService.formatAmount(donation.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {donation.donationDate}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setActiveTab("donations")}
                      >
                        View All Donations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Members List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              {user.status === "approved" && (
                                <Badge variant="outline" className="text-xs">
                                  {user.profileCompleteness}% Complete
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <p>
                                  <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {user.phone}
                                </p>
                                <p>
                                  <strong>Applied:</strong> {user.joinDate}
                                </p>
                              </div>
                              {user.status === "approved" && (
                                <div className="space-y-1">
                                  <p>
                                    <strong>Last Active:</strong>{" "}
                                    {user.lastActive}
                                  </p>
                                  <p>
                                    <strong>Logins:</strong> {user.loginCount}
                                  </p>
                                  <p>
                                    <strong>Events:</strong>{" "}
                                    {user.eventsAttended} attended
                                  </p>
                                  <p>
                                    <strong>Messages:</strong>{" "}
                                    {user.messagesPosted} posted
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="max-w-2xl">
                              <p className="text-sm">
                                <strong>Reason:</strong> {user.reason}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {user.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUserAction(user.id, "approve")
                                }
                              >
                                <UserCheck className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction(user.id, "reject")
                                }
                              >
                                <UserX className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          {user.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateCertificate(user.id)}
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              Generate Certificate
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-3 w-3 mr-1" />
                                View Profile
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] md:w-full overflow-hidden">
                              <DialogHeader className="pb-4 border-b">
                                <DialogTitle className="flex items-center space-x-3 text-lg md:text-xl">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-primary">
                                    {user.name} - Member Profile
                                  </span>
                                </DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="max-h-[70vh] pr-4">
                                <div className="space-y-6 py-2">
                                  {/* Personal Information */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 text-primary">
                                      Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="font-medium">Full Name</p>
                                        <p className="text-muted-foreground">
                                          {user.name}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">
                                          {user.email}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-muted-foreground">
                                          {user.phone}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          Date of Birth
                                        </p>
                                        <p className="text-muted-foreground">
                                          {user.dateOfBirth}
                                        </p>
                                      </div>
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Address</p>
                                        <p className="text-muted-foreground break-words">
                                          {user.address}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Activity Statistics */}
                                  {user.status === "approved" && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold border-b pb-2 text-primary">
                                        Activity Statistics
                                      </h3>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Card>
                                          <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-primary">
                                              {user.loginCount}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Total Logins
                                            </p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-ngo-purple">
                                              {user.eventsAttended}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Events Attended
                                            </p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-ngo-pink">
                                              {user.messagesPosted}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Messages Posted
                                            </p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-ngo-purple">
                                              {user.profileCompleteness}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Profile Complete
                                            </p>
                                          </CardContent>
                                        </Card>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Last Active:</span>
                                          <span className="font-medium">
                                            {user.lastActive}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Certificate Downloaded:</span>
                                          <span
                                            className={`font-medium ${user.certificateDownloaded ? "text-ngo-purple" : "text-red-600"}`}
                                          >
                                            {user.certificateDownloaded
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Membership Details */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 text-primary">
                                      Membership Details
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Status:</span>
                                        <Badge
                                          className={getStatusColor(
                                            user.status,
                                          )}
                                        >
                                          {user.status}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Join Date:</span>
                                        <span className="font-medium">
                                          {user.joinDate}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium mb-1">
                                          Reason for Joining:
                                        </p>
                                        <p className="text-muted-foreground break-words">
                                          {user.reason}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                                    {user.status === "approved" && (
                                      <Button
                                        onClick={() =>
                                          handleGenerateCertificate(user.id)
                                        }
                                        className="w-full sm:w-auto"
                                      >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Certificate
                                      </Button>
                                    )}
                                    {user.status === "pending" && (
                                      <>
                                        <Button
                                          onClick={() =>
                                            handleUserAction(user.id, "approve")
                                          }
                                          className="w-full sm:w-auto"
                                        >
                                          <UserCheck className="mr-2 h-4 w-4" />
                                          Approve Member
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            handleUserAction(user.id, "reject")
                                          }
                                          className="w-full sm:w-auto"
                                        >
                                          <UserX className="mr-2 h-4 w-4" />
                                          Reject Application
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              {/* Donation Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {donationStats.totalDonations}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Donations
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <IndianRupee className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {donationService.formatAmount(donationStats.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Raised
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {donationStats.donorCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unique Donors
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {donationService.formatAmount(
                        donationStats.averageDonation,
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Donation
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Donations List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <span>Recent Donations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donations.slice(0, 10).map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ngo-purple-light">
                            <Gift className="h-5 w-5 text-ngo-purple" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {donation.isAnonymous
                                ? "Anonymous Donor"
                                : donation.donorName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {donation.email} • {donation.purpose}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {donation.donationDate} • via{" "}
                              {donation.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-lg font-bold text-ngo-purple">
                            {donationService.formatAmount(donation.amount)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                donation.certificateGenerated
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {donation.certificateGenerated
                                ? "Certificate Generated"
                                : "Certificate Pending"}
                            </Badge>
                            {donation.memberAccountCreated && (
                              <Badge variant="outline" className="text-xs">
                                Member Created
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            {donation.certificateGenerated && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  generateDonationCertificateForData(donation)
                                }
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Member Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {memberActivities.map((activity) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case "login":
                            return (
                              <LogOut className="h-4 w-4 text-ngo-purple" />
                            );
                          case "certificate":
                            return <Award className="h-4 w-4 text-ngo-pink" />;
                          case "chat":
                            return (
                              <MessageCircle className="h-4 w-4 text-ngo-purple" />
                            );
                          case "event":
                            return (
                              <Calendar className="h-4 w-4 text-ngo-pink" />
                            );
                          case "profile":
                            return <User className="h-4 w-4 text-ngo-purple-light" />;
                          default:
                            return <Users className="h-4 w-4 text-muted-foreground" />;
                        }
                      };

                      const getActivityColor = (type: string) => {
                        switch (type) {
                          case "login":
                            return "bg-ngo-purple-light/50 border-ngo-purple";
                          case "certificate":
                            return "bg-ngo-pink-light/50 border-ngo-pink";
                          case "chat":
                            return "bg-ngo-purple-light border-ngo-purple";
                          case "event":
                            return "bg-ngo-pink-light border-ngo-pink";
                          case "profile":
                            return "bg-ngo-purple-light border-ngo-purple-light";
                          default:
                            return "bg-muted border-border";
                        }
                      };

                      return (
                        <div
                          key={activity.id}
                          className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                  {activity.memberName}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {activity.timestamp}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                {activity.action}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {activity.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Today's Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>New Logins:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Messages Posted:</span>
                        <span className="font-medium">34</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Certificates Downloaded:</span>
                        <span className="font-medium">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Most Active Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {users
                        .filter((u) => u.status === "approved")
                        .sort((a, b) => b.loginCount - a.loginCount)
                        .slice(0, 3)
                        .map((user, index) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <span className="text-muted-foreground">
                              #{index + 1}
                            </span>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="flex-1">{user.name}</span>
                            <span className="font-medium">
                              {user.loginCount}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Engagement Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg. Profile Completion:</span>
                        <span className="font-medium">
                          {Math.round(
                            users
                              .filter((u) => u.status === "approved")
                              .reduce(
                                (acc, u) => acc + u.profileCompleteness,
                                0,
                              ) /
                              users.filter((u) => u.status === "approved")
                                .length,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Certificate Rate:</span>
                        <span className="font-medium">
                          {Math.round(
                            (users.filter((u) => u.certificateDownloaded)
                              .length /
                              users.filter((u) => u.status === "approved")
                                .length) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Event Participation:</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-6">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {announcement.title}
                            </h3>
                            <Badge
                              variant={
                                announcement.priority === "high"
                                  ? "destructive"
                                  : announcement.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {announcement.priority}
                            </Badge>
                            <Badge variant="outline">
                              {announcement.targetAudience}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {announcement.message}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created by {announcement.createdBy} on{" "}
                            {announcement.createdAt}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {event.title}
                            </h3>
                            <Badge
                              variant={
                                event.status === "upcoming"
                                  ? "default"
                                  : event.status === "ongoing"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              {event.date} at {event.time}
                            </span>
                            <span>{event.location}</span>
                            <span>
                              {event.currentAttendees}/{event.maxAttendees}{" "}
                              attendees
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
