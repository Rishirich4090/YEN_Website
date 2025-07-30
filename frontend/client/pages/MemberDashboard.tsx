import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateMembershipCertificate } from "@/lib/certificateGenerator";
import { chatService, type ChatMessage as ChatMsg } from "@/lib/chatService";
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
  CheckCircle
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

// Remove local ChatMessage interface as we're using the one from chatService

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isRegistered: boolean;
}

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [memberData, setMemberData] = useState<MemberData>({
    id: "NGO-2024-001234",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    joinDate: "March 15, 2024",
    status: "approved",
    avatar: "/placeholder.svg"
  });

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [isConnectedToChat, setIsConnectedToChat] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "New Water Project in Kenya",
      message: "We're excited to announce our new clean water initiative in rural Kenya. This project will provide clean drinking water to over 2,000 families.",
      date: "January 10, 2024",
      priority: "high",
      read: false
    },
    {
      id: "2",
      title: "Member Appreciation Event",
      message: "Join us for our annual member appreciation event on February 20th. It will be a virtual celebration of our collective impact.",
      date: "January 8, 2024", 
      priority: "medium",
      read: true
    },
    {
      id: "3",
      title: "Monthly Impact Report Available",
      message: "Our December impact report is now available for download in your member portal. See the amazing progress we've made together!",
      date: "January 5, 2024",
      priority: "low",
      read: true
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Virtual Project Review Meeting",
      description: "Monthly review of ongoing projects and planning for Q2 initiatives",
      date: "January 25, 2024",
      time: "2:00 PM EST",
      location: "Zoom Meeting",
      attendees: 45,
      isRegistered: true
    },
    {
      id: "2",
      title: "Member Appreciation Gala",
      description: "Annual celebration of our community's incredible impact and achievements",
      date: "February 20, 2024",
      time: "7:00 PM EST",
      location: "Virtual Event",
      attendees: 120,
      isRegistered: false
    },
    {
      id: "3",
      title: "Skills Development Workshop",
      description: "Learn new skills to enhance your contribution to our projects",
      date: "March 5, 2024",
      time: "1:00 PM EST",
      location: "Online Workshop",
      attendees: 32,
      isRegistered: false
    }
  ]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "member") {
      navigate("/login");
      return;
    }

    // Initialize chat service
    chatService.connect('member').then(() => {
      setIsConnectedToChat(true);
      setChatMessages(chatService.getRecentMessages());
    });

    // Listen for new messages
    const unsubscribeMessages = chatService.onMessage((message) => {
      setChatMessages(prev => [...prev, message]);
    });

    // Listen for connection changes
    const unsubscribeConnection = chatService.onConnectionChange((connected) => {
      setIsConnectedToChat(connected);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      chatService.disconnect();
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      chatService.sendMessage(newMessage, memberData.name, 'member');
      setNewMessage("");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      await generateMembershipCertificate({
        memberName: memberData.name,
        memberId: memberData.id,
        joinDate: memberData.joinDate,
        ngoName: "HopeHands NGO",
        logoUrl: "/placeholder.svg",
        founderSignature: "/placeholder.svg"
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error generating certificate. Please try again.");
    }
  };

  const handleMarkAsRead = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === announcementId ? { ...ann, read: true } : ann
      )
    );
  };

  const handleEventRegistration = (eventId: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId 
          ? { ...event, isRegistered: !event.isRegistered, attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1 }
          : event
      )
    );
  };

  const stats = [
    { label: "Member Since", value: memberData.joinDate, icon: Calendar },
    { label: "Projects Supported", value: "12", icon: Target },
    { label: "Community Impact", value: "2.5K Lives", icon: Heart },
    { label: "Recognition Level", value: "Gold Member", icon: Award }
  ];

  const unreadCount = announcements.filter(ann => !ann.read).length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back, {memberData.name}!</h1>
              <div className="text-muted-foreground flex items-center gap-2">
                <span>Member ID: {memberData.id} • Status:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Active Member</Badge>
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
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certificate">Certificate</TabsTrigger>
              <TabsTrigger value="chat">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="announcements">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Announcements</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      {unreadCount}
                    </Badge>
                  )}
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
                    <Button className="w-full justify-start" onClick={() => setActiveTab("certificate")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Membership Certificate
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("chat")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Join Member Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("announcements")}>
                      <Bell className="mr-2 h-4 w-4" />
                      View Announcements {unreadCount > 0 && `(${unreadCount} new)`}
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
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Certificate Generated</p>
                          <p className="text-xs text-muted-foreground">Your membership certificate is ready for download</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Project Impact Update</p>
                          <p className="text-xs text-muted-foreground">Clean Water Initiative reached 2,500 families</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">New Chat Messages</p>
                          <p className="text-xs text-muted-foreground">3 new messages in member chat</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{event.date} at {event.time}</span>
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={event.isRegistered ? "secondary" : "default"}
                          onClick={() => handleEventRegistration(event.id)}
                        >
                          {event.isRegistered ? "Registered" : "Register"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                          <h3 className="text-xl font-bold">Official Membership Certificate</h3>
                          <p className="text-muted-foreground">HopeHands NGO</p>
                        </div>
                        <div className="border-t pt-4">
                          <p className="font-semibold">{memberData.name}</p>
                          <p className="text-sm text-muted-foreground">Member ID: {memberData.id}</p>
                          <p className="text-sm text-muted-foreground">Joined: {memberData.joinDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Your Official Certificate</h3>
                      <p className="text-muted-foreground">
                        This certificate recognizes your commitment to our mission and your valuable contribution to positive change worldwide.
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

            <TabsContent value="chat">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>Member Group Chat</span>
                    <Badge variant={isConnectedToChat ? "secondary" : "destructive"}>
                      {isConnectedToChat ? `${chatService.getOnlineUsers().length} members online` : "Connecting..."}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex items-start space-x-3 ${
                          message.type === 'announcement' ? 'bg-blue-50 p-3 rounded-lg border border-blue-200' :
                          message.type === 'system' ? 'bg-gray-50 p-3 rounded-lg border border-gray-200' : ''
                        }`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback>{message.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${
                                message.userRole === 'admin' ? 'text-blue-600' : 'text-gray-900'
                              }`}>
                                {message.user}
                                {message.userRole === 'admin' && (
                                  <Badge variant="outline" className="ml-1 text-xs">Admin</Badge>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <p className={`text-sm ${
                              message.type === 'announcement' ? 'font-medium text-blue-800' :
                              message.type === 'system' ? 'italic text-gray-600' : 'text-gray-900'
                            }`}>
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements">
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className={`${!announcement.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{announcement.title}</h3>
                            <Badge 
                              variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}
                            >
                              {announcement.priority}
                            </Badge>
                            {!announcement.read && (
                              <Badge variant="default">New</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{announcement.message}</p>
                          <p className="text-sm text-muted-foreground">{announcement.date}</p>
                        </div>
                        {!announcement.read && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(announcement.id)}>
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                      <AvatarFallback className="text-lg">{memberData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{memberData.name}</h3>
                      <p className="text-muted-foreground">Member since {memberData.joinDate}</p>
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
                            onChange={(e) => setMemberData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={memberData.email}
                          disabled={!isEditing}
                          onChange={(e) => setMemberData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={memberData.phone}
                          disabled={!isEditing}
                          onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
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
                          onChange={(e) => setMemberData(prev => ({ ...prev, address: e.target.value }))}
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
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
