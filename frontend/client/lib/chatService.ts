// Mock real-time chat service
// In a production environment, this would connect to an actual Socket.io server

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  avatar: string;
  type: 'message' | 'announcement' | 'system';
  userRole?: 'member' | 'admin';
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: 'member' | 'admin';
  isOnline: boolean;
}

type MessageListener = (message: ChatMessage) => void;
type UserListListener = (users: ChatUser[]) => void;
type ConnectionListener = (isConnected: boolean) => void;

class ChatService {
  private messages: ChatMessage[] = [
    {
      id: "1",
      user: "Dr. Sarah Mitchell",
      message: "Welcome to our member community chat! This is a space for all approved members to connect, share ideas, and collaborate on our mission.",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      avatar: "/placeholder.svg",
      type: "announcement",
      userRole: "admin"
    },
    {
      id: "2",
      user: "Sarah Johnson",
      message: "Thank you for the warm welcome! I'm excited to be part of this amazing community.",
      timestamp: new Date(Date.now() - 3000000).toLocaleString(),
      avatar: "/placeholder.svg",
      type: "message",
      userRole: "member"
    },
    {
      id: "3",
      user: "Michael Chen",
      message: "Looking forward to contributing to the education initiative. Count me in for the next planning session!",
      timestamp: new Date(Date.now() - 2400000).toLocaleString(),
      avatar: "/placeholder.svg",
      type: "message",
      userRole: "member"
    },
    {
      id: "4",
      user: "Elena Rodriguez",
      message: "The clean water project results from Kenya are incredible! 2,500 families now have access to clean water. 🎉",
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      avatar: "/placeholder.svg",
      type: "message",
      userRole: "member"
    }
  ];

  private users: ChatUser[] = [
    {
      id: "admin1",
      name: "Dr. Sarah Mitchell",
      avatar: "/placeholder.svg",
      role: "admin",
      isOnline: true
    },
    {
      id: "member1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true
    },
    {
      id: "member2", 
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true
    },
    {
      id: "member3",
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: false
    },
    {
      id: "member4",
      name: "Demo Member",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true
    }
  ];

  private messageListeners: MessageListener[] = [];
  private userListListeners: UserListListener[] = [];
  private connectionListeners: ConnectionListener[] = [];
  private isConnected: boolean = false;

  constructor() {
    // Simulate connection after a brief delay
    setTimeout(() => {
      this.isConnected = true;
      this.notifyConnectionListeners(true);
    }, 1000);
  }

  // Connection management
  connect(userRole: 'member' | 'admin' = 'member'): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.notifyConnectionListeners(true);
        resolve();
      }, 500);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    this.notifyConnectionListeners(false);
  }

  isConnectedToChat(): boolean {
    return this.isConnected;
  }

  // Message management
  sendMessage(message: string, userName: string, userRole: 'member' | 'admin' = 'member'): void {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: userName,
      message,
      timestamp: new Date().toLocaleString(),
      avatar: "/placeholder.svg",
      type: "message",
      userRole
    };

    this.messages.push(newMessage);
    this.notifyMessageListeners(newMessage);
  }

  sendAnnouncement(message: string, title?: string): void {
    const announcement: ChatMessage = {
      id: Date.now().toString(),
      user: "HopeHands Admin",
      message: title ? `📢 ${title}: ${message}` : `📢 ${message}`,
      timestamp: new Date().toLocaleString(),
      avatar: "/placeholder.svg",
      type: "announcement",
      userRole: "admin"
    };

    this.messages.push(announcement);
    this.notifyMessageListeners(announcement);
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  getRecentMessages(limit: number = 50): ChatMessage[] {
    return this.messages.slice(-limit);
  }

  // User management
  getOnlineUsers(): ChatUser[] {
    return this.users.filter(user => user.isOnline);
  }

  getAllUsers(): ChatUser[] {
    return [...this.users];
  }

  // Event listeners
  onMessage(listener: MessageListener): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onUserListUpdate(listener: UserListListener): () => void {
    this.userListListeners.push(listener);
    return () => {
      this.userListListeners = this.userListListeners.filter(l => l !== listener);
    };
  }

  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  // Private notification methods
  private notifyMessageListeners(message: ChatMessage): void {
    this.messageListeners.forEach(listener => listener(message));
  }

  private notifyUserListListeners(users: ChatUser[]): void {
    this.userListListeners.forEach(listener => listener(users));
  }

  private notifyConnectionListeners(isConnected: boolean): void {
    this.connectionListeners.forEach(listener => listener(isConnected));
  }

  // Simulate real-time activity
  simulateActivity(): void {
    const activities = [
      () => {
        // Simulate user joining
        const newUser: ChatUser = {
          id: `member_${Date.now()}`,
          name: "New Member",
          avatar: "/placeholder.svg",
          role: "member",
          isOnline: true
        };
        this.users.push(newUser);
        this.notifyUserListListeners(this.users);
      },
      () => {
        // Simulate system message
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          user: "System",
          message: "A new member has joined the community! 👋",
          timestamp: new Date().toLocaleString(),
          avatar: "/placeholder.svg",
          type: "system"
        };
        this.messages.push(systemMessage);
        this.notifyMessageListeners(systemMessage);
      }
    ];

    // Randomly trigger activities
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        const activity = activities[Math.floor(Math.random() * activities.length)];
        activity();
      }
    }, 30000); // Every 30 seconds
  }
}

// Export singleton instance
export const chatService = new ChatService();

// Start simulating activity
chatService.simulateActivity();
