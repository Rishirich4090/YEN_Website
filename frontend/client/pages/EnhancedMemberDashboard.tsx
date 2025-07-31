import Layout from "@/components/Layout";
import DonationHistoryDialog from "@/components/DonationHistoryDialog";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateMembershipCertificate } from "@/lib/certificateGenerator";
import { chatService, type ChatMessage as ChatMsg } from "@/lib/chatService";
import {
  memberService,
  type Member,
  type PrivateMessage,
} from "@/lib/memberService";
import { donationService, type DonationData } from "@/lib/donationService";
import { generateDonationCertificateForData } from "@/lib/donationCertificateGenerator";
import {
  User,
  Download,
  MessageCircle,
  Bell,
  Settings,
  Calendar,
  Heart,
  Award,
  FileText,
  Send,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Users,
  Target,
  CheckCircle,
  Search,
  UserPlus,
  MessageSquare,
  Globe,
  Hash,
  Circle,
  Gift,
  IndianRupee,
  CreditCard,
  Calendar as CalendarIcon,
  Eye,
} from "lucide-react";

interface MemberData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: "approved" | "pending";
  avatar: string;
}

export default function EnhancedMemberDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newPrivateMessage, setNewPrivateMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isConnectedToChat, setIsConnectedToChat] = useState(false);
  const [userDonations, setUserDonations] = useState<DonationData[]>([]);
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const privateScrollRef = useRef<HTMLDivElement>(null);

  const [memberData, setMemberData] = useState<MemberData>({
    id: "NGO-2024-001234",
    name: "Demo Member",
    email: "member@hopehands.org",
    phone: "+1 (555) 555-0001",
    address: "456 Demo Street, Demo City, State 11111",
    joinDate: "January 1, 2024",
    status: "approved",
    avatar: "community",
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (!token || role !== "member") {
      navigate("/login");
      return;
    }

    // Update member data from localStorage
    if (email) {
      setMemberData((prev) => ({ ...prev, email }));
    }

    // Initialize chat service
    chatService.connect("member").then(() => {
      setIsConnectedToChat(true);
      setChatMessages(chatService.getRecentMessages());
    });

    // Listen for new messages
    const unsubscribeMessages = chatService.onMessage((message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    // Listen for connection changes
    const unsubscribeConnection = chatService.onConnectionChange(
      (connected) => {
        setIsConnectedToChat(connected);
      },
    );

    // Listen for private messages
    const unsubscribePrivateMessages = memberService.onPrivateMessage(
      (message) => {
        if (
          selectedMember &&
          (message.senderId === selectedMember.id ||
            message.receiverId === selectedMember.id)
        ) {
          setPrivateMessages((prev) => [...prev, message]);
        }
      },
    );

    // Initialize search results
    setSearchResults(memberService.getApprovedMembers());

    // Load user donations
    const allDonations = donationService.getAllDonations();
    const userEmail = localStorage.getItem("userEmail");
    const userDonationHistory = allDonations.filter(
      (donation) => donation.email === userEmail,
    );
    setUserDonations(userDonationHistory);

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      unsubscribePrivateMessages();
      chatService.disconnect();
    };
  }, [navigate, selectedMember]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (privateScrollRef.current) {
      privateScrollRef.current.scrollTop =
        privateScrollRef.current.scrollHeight;
    }
  }, [privateMessages]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Dispatch custom event to notify Layout component of auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      chatService.sendMessage(newMessage, memberData.name, "member");
      setNewMessage("");
    }
  };

  const handleSendPrivateMessage = () => {
    if (newPrivateMessage.trim() && selectedMember) {
      const message = memberService.sendPrivateMessage(
        memberData.id,
        selectedMember.id,
        newPrivateMessage,
      );
      setPrivateMessages((prev) => [...prev, message]);
      setNewPrivateMessage("");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      await generateMembershipCertificate({
        memberName: memberData.name,
        memberId: memberData.id,
        joinDate: memberData.joinDate,
        ngoName: "HopeHands NGO",
        logoUrl: "default",
        founderSignature: "default",
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error generating certificate. Please try again.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchResults(memberService.searchMembers(query));
  };

  const openPrivateChat = (member: Member) => {
    setSelectedMember(member);
    const conversation = memberService.getConversation(
      memberData.id,
      member.id,
    );
    setPrivateMessages(conversation);
    memberService.markMessagesAsRead(memberData.id, member.id);
  };

  const stats = [
    { label: "Member Since", value: memberData.joinDate, icon: Calendar },
    { label: "Projects Supported", value: "12", icon: Target },
    { label: "Community Impact", value: "2.5K Lives", icon: Heart },
    { label: "Recognition Level", value: "Gold Member", icon: Award },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Welcome back, {memberData.name}!
              </h1>
              <div className="text-muted-foreground flex items-center gap-2">
                <span>Member ID: {memberData.id} • Status:</span>
                <Badge
                  variant="secondary"
                  className="bg-ngo-purple-light text-ngo-purple"
                >
                  Active Member
                </Badge>
              </div>
            </div>

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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certificate">Certificate</TabsTrigger>
              <TabsTrigger value="donations">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Donations</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="members">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Members</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="global-chat">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Global Chat</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="private-chat">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Private Chat</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full justify-start"
                      onClick={handleDownloadCertificate}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Membership Certificate
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowDonationHistory(true)}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      View My Donations ({userDonations.length})
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("global-chat")}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Join Global Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("members")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Find Members
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-ngo-purple mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Certificate Generated
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your membership certificate is ready for download
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Project Impact Update
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Clean Water Initiative reached 2,500 families
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 text-ngo-pink mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">New Messages</p>
                          <p className="text-xs text-muted-foreground">
                            3 new messages in your conversations
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificate">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Membership Certificate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Award className="h-16 w-16 text-primary mx-auto" />
                        <div>
                          <h3 className="text-xl font-bold">
                            Official Membership Certificate
                          </h3>
                          <p className="text-muted-foreground">HopeHands NGO</p>
                        </div>
                        <div className="border-t pt-4">
                          <p className="font-semibold">{memberData.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Member ID: {memberData.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Joined: {memberData.joinDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        Your Official Certificate
                      </h3>
                      <p className="text-muted-foreground">
                        This certificate recognizes your commitment to our
                        mission and your valuable contribution to positive
                        change worldwide.
                      </p>
                    </div>
                    <Button size="lg" onClick={handleDownloadCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Donation Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <span>Donation Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {donationService.formatAmount(
                          userDonations.reduce(
                            (sum, donation) => sum + donation.amount,
                            0,
                          ),
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Donated
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-semibold">
                          {userDonations.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Donations
                        </p>
                      </div>
                      <div>
                        <div className="text-xl font-semibold">
                          {
                            userDonations.filter((d) => d.certificateGenerated)
                              .length
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Certificates
                        </p>
                      </div>
                    </div>
                    {userDonations.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span>First Donation:</span>
                          <span className="font-medium">
                            {new Date(
                              Math.min(
                                ...userDonations.map((d) =>
                                  new Date(d.donationDate).getTime(),
                                ),
                              ),
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Latest Donation:</span>
                          <span className="font-medium">
                            {new Date(
                              Math.max(
                                ...userDonations.map((d) =>
                                  new Date(d.donationDate).getTime(),
                                ),
                              ),
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
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
                    <Button className="w-full justify-start" asChild>
                      <a href="/donate">
                        <Gift className="mr-2 h-4 w-4" />
                        Make New Donation
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const pendingCerts = userDonations.filter(
                          (d) => d.certificateGenerated,
                        );
                        if (pendingCerts.length > 0) {
                          pendingCerts.forEach(async (donation) => {
                            try {
                              await generateDonationCertificateForData(
                                donation,
                              );
                            } catch (error) {
                              console.error(
                                "Error generating certificate:",
                                error,
                              );
                            }
                          });
                        } else {
                          alert("No certificates available for download.");
                        }
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download All Certificates (
                      {
                        userDonations.filter((d) => d.certificateGenerated)
                          .length
                      }
                      )
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowDonationHistory(true)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Complete History
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userDonations.slice(0, 3).map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center space-x-3 text-sm"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ngo-purple-light">
                            <Gift className="h-3 w-3 text-ngo-purple" />
                          </div>
                          <div className="flex-1">
                            <p>
                              Donated{" "}
                              <strong>
                                {donationService.formatAmount(donation.amount)}
                              </strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {donation.donationDate}
                            </p>
                          </div>
                        </div>
                      ))}
                      {userDonations.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No donations yet. Start making a difference today!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Donation History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span>Complete Donation History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDonations.length === 0 ? (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No donations yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start your journey of giving by making your first
                        donation.
                      </p>
                      <Button asChild>
                        <a href="/donate">
                          <Gift className="mr-2 h-4 w-4" />
                          Make Your First Donation
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userDonations.slice(0, 5).map((donation) => (
                        <Card
                          key={donation.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ngo-purple-light">
                                  <Gift className="h-5 w-5 text-ngo-purple" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    {donationService.formatAmount(
                                      donation.amount,
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {donation.purpose} •{" "}
                                    {new Date(
                                      donation.donationDate,
                                    ).toLocaleDateString("en-IN")}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      donation.donationDate,
                                    ).toLocaleTimeString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                    <CreditCard className="h-3 w-3" />
                                    <span className="capitalize">
                                      {donation.paymentMethod}
                                    </span>
                                    {donation.panNumber && (
                                      <>
                                        <span>•</span>
                                        <span>PAN: {donation.panNumber}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge
                                  variant={
                                    donation.certificateGenerated
                                      ? "secondary"
                                      : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {donation.certificateGenerated
                                    ? "Certificate Ready"
                                    : "Processing"}
                                </Badge>
                                <div className="flex space-x-1">
                                  {donation.certificateGenerated && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={async () => {
                                        try {
                                          await generateDonationCertificateForData(
                                            donation,
                                          );
                                        } catch (error) {
                                          console.error(
                                            "Error generating certificate:",
                                            error,
                                          );
                                          alert(
                                            "Error generating certificate. Please try again.",
                                          );
                                        }
                                      }}
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowDonationHistory(true)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Additional Details */}
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="font-medium">Donor Name</p>
                                  <p className="text-muted-foreground">
                                    {donation.isAnonymous
                                      ? "Anonymous"
                                      : donation.donorName}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Phone</p>
                                  <p className="text-muted-foreground">
                                    {donation.phone}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Address</p>
                                  <p className="text-muted-foreground">
                                    {donation.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Member Account</p>
                                  <p className="text-muted-foreground">
                                    {donation.memberAccountCreated
                                      ? "✓ Created"
                                      : "Not created"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {userDonations.length > 5 && (
                        <div className="text-center">
                          <Button
                            variant="outline"
                            onClick={() => setShowDonationHistory(true)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View All {userDonations.length} Donations
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Find Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members by name or email..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Online Members */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-ngo-purple flex items-center gap-2">
                        <Circle className="h-2 w-2 fill-green-600" />
                        Online Members (
                        {memberService.getOnlineMembers().length})
                      </h3>
                      <div className="grid gap-3">
                        {searchResults
                          .filter((member) => member.isOnline)
                          .map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-ngo-pink-light0 rounded-full border-2 border-background" />
                                </div>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.role === "admin"
                                      ? "Admin"
                                      : "Member"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => openPrivateChat(member)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* All Members */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">All Members</h3>
                      <div className="grid gap-3">
                        {searchResults
                          .filter((member) => !member.isOnline)
                          .map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.role === "admin"
                                      ? "Admin"
                                      : "Member"}{" "}
                                    • Last seen: {member.lastSeen}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPrivateChat(member)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="global-chat">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-5 w-5 text-primary" />
                    <span>Global Member Chat</span>
                    <Badge
                      variant={isConnectedToChat ? "secondary" : "destructive"}
                    >
                      {isConnectedToChat
                        ? `${chatService.getOnlineUsers().length} members online`
                        : "Connecting..."}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-6" ref={chatScrollRef}>
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.type === "announcement"
                              ? "bg-ngo-pink-light p-3 rounded-lg border border-ngo-pink"
                              : message.type === "system"
                                ? "bg-muted p-3 rounded-lg border border-border"
                                : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback>
                              {message.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-semibold ${
                                  message.userRole === "admin"
                                    ? "text-ngo-pink"
                                    : "text-foreground"
                                }`}
                              >
                                {message.user}
                                {message.userRole === "admin" && (
                                  <Badge
                                    variant="outline"
                                    className="ml-1 text-xs"
                                  >
                                    Admin
                                  </Badge>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${
                                message.type === "announcement"
                                  ? "font-medium text-ngo-purple"
                                  : message.type === "system"
                                    ? "italic text-muted-foreground"
                                    : "text-foreground"
                              }`}
                            >
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-6 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="private-chat">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {memberService
                        .getUserConversations(memberData.id)
                        .map((conv) => {
                          const otherUserId = conv.participants.find(
                            (id) => id !== memberData.id,
                          );
                          const otherUser = memberService.getMemberById(
                            otherUserId!,
                          );

                          return otherUser ? (
                            <div
                              key={conv.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedMember?.id === otherUser.id
                                  ? "bg-primary/10"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => openPrivateChat(otherUser)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={otherUser.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {otherUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  {otherUser.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-ngo-pink-light0 rounded-full border-2 border-background" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {otherUser.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {conv.lastMessage?.message ||
                                      "No messages yet"}
                                  </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="h-5 w-5 text-xs p-0 flex items-center justify-center"
                                  >
                                    {conv.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ) : null;
                        })}

                      {memberService.getUserConversations(memberData.id)
                        .length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No conversations yet. Search for members to start
                          chatting!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2">
                  {selectedMember ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={selectedMember.avatar} />
                              <AvatarFallback>
                                {selectedMember.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {selectedMember.isOnline && (
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-ngo-pink-light0 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {selectedMember.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedMember.isOnline
                                ? "Online now"
                                : `Last seen: ${selectedMember.lastSeen}`}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-0">
                        <ScrollArea
                          className="flex-1 p-6 h-[400px]"
                          ref={privateScrollRef}
                        >
                          <div className="space-y-4">
                            {privateMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.senderId === memberData.id ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    message.senderId === memberData.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      message.senderId === memberData.id
                                        ? "text-primary-foreground/70"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="p-6 border-t">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Type a message..."
                              value={newPrivateMessage}
                              onChange={(e) =>
                                setNewPrivateMessage(e.target.value)
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSendPrivateMessage()
                              }
                            />
                            <Button onClick={handleSendPrivateMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-[500px]">
                      <div className="text-center space-y-4">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                        <div>
                          <h3 className="font-semibold">
                            No conversation selected
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Choose a member to start chatting
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Profile Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={memberData.avatar} />
                      <AvatarFallback className="text-lg">
                        {memberData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {memberData.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Member since {memberData.joinDate}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="name"
                            value={memberData.name}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setMemberData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={memberData.email}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setMemberData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={memberData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setMemberData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={memberData.address}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setMemberData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={() => setIsEditing(false)}>
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

              {/* Donation History in Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <span>My Donation History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDonations.length === 0 ? (
                    <div className="text-center py-6">
                      <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        You haven't made any donations yet.
                      </p>
                      <Button className="mt-3" asChild>
                        <a href="/donate">
                          <Gift className="mr-2 h-4 w-4" />
                          Make Your First Donation
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {donationService.formatAmount(
                              userDonations.reduce(
                                (sum, donation) => sum + donation.amount,
                                0,
                              ),
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Total Donated
                          </p>
                        </div>
                        <div className="text-center p-4 bg-ngo-pink-light rounded-lg">
                          <div className="text-2xl font-bold text-ngo-purple">
                            {userDonations.length}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Total Donations
                          </p>
                        </div>
                        <div className="text-center p-4 bg-ngo-pink-light rounded-lg">
                          <div className="text-2xl font-bold text-ngo-pink">
                            {
                              userDonations.filter(
                                (d) => d.certificateGenerated,
                              ).length
                            }
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Certificates Available
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {userDonations.slice(0, 5).map((donation) => (
                          <div
                            key={donation.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ngo-purple-light">
                                <Gift className="h-4 w-4 text-ngo-purple" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {donationService.formatAmount(
                                    donation.amount,
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {donation.purpose} •{" "}
                                  {new Date(
                                    donation.donationDate,
                                  ).toLocaleDateString("en-IN")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    donation.donationDate,
                                  ).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                            </div>
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
                                  ? "Certificate Ready"
                                  : "Processing"}
                              </Badge>
                              {donation.certificateGenerated && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={async () => {
                                    try {
                                      await generateDonationCertificateForData(
                                        donation,
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Error generating certificate:",
                                        error,
                                      );
                                      alert(
                                        "Error generating certificate. Please try again.",
                                      );
                                    }
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => setShowDonationHistory(true)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Complete Donation History
                        </Button>
                        {userDonations.length > 5 && (
                          <p className="text-sm text-muted-foreground text-center">
                            Showing recent 5 of {userDonations.length} donations
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Donation History Dialog */}
      <DonationHistoryDialog
        open={showDonationHistory}
        onOpenChange={setShowDonationHistory}
        userEmail={memberData.email}
      />
    </Layout>
  );
}
