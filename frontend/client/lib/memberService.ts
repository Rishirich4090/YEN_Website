export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'admin';
  isOnline: boolean;
  lastSeen: string;
  joinDate: string;
  status: 'approved' | 'pending';
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: PrivateMessage;
  unreadCount: number;
}

class MemberService {
  private members: Member[] = [
    {
      id: "admin1",
      name: "Dr. Sarah Mitchell",
      email: "admin@hopehands.org",
      avatar: "/placeholder.svg",
      role: "admin",
      isOnline: true,
      lastSeen: "Online now",
      joinDate: "2015-01-01",
      status: "approved"
    },
    {
      id: "member1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true,
      lastSeen: "2 minutes ago",
      joinDate: "2024-01-10",
      status: "approved"
    },
    {
      id: "member2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: false,
      lastSeen: "1 hour ago",
      joinDate: "2024-01-08",
      status: "approved"
    },
    {
      id: "member3",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@email.com",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true,
      lastSeen: "Online now",
      joinDate: "2024-01-12",
      status: "approved"
    },
    {
      id: "member4",
      name: "Demo Member",
      email: "member@hopehands.org",
      avatar: "/placeholder.svg",
      role: "member",
      isOnline: true,
      lastSeen: "Online now",
      joinDate: "2024-01-01",
      status: "approved"
    }
  ];

  private privateMessages: PrivateMessage[] = [
    {
      id: "pm1",
      senderId: "member1",
      receiverId: "member4",
      message: "Hey! Welcome to HopeHands. How are you finding the experience so far?",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      read: true
    },
    {
      id: "pm2",
      senderId: "member4",
      receiverId: "member1",
      message: "Thank you! It's been amazing. I'm really excited about the upcoming water project.",
      timestamp: new Date(Date.now() - 3000000).toLocaleString(),
      read: true
    },
    {
      id: "pm3",
      senderId: "member2",
      receiverId: "member4",
      message: "Hi there! I saw your message in the group chat about the education initiative. Would love to collaborate!",
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      read: false
    }
  ];

  private conversations: ChatConversation[] = [];

  constructor() {
    this.updateConversations();
  }

  // Member search and retrieval
  searchMembers(query: string): Member[] {
    if (!query.trim()) return this.getApprovedMembers();
    
    const lowerQuery = query.toLowerCase();
    return this.members.filter(member => 
      member.status === 'approved' &&
      (member.name.toLowerCase().includes(lowerQuery) ||
       member.email.toLowerCase().includes(lowerQuery))
    );
  }

  getApprovedMembers(): Member[] {
    return this.members.filter(member => member.status === 'approved');
  }

  getMemberById(id: string): Member | undefined {
    return this.members.find(member => member.id === id);
  }

  getOnlineMembers(): Member[] {
    return this.members.filter(member => member.isOnline && member.status === 'approved');
  }

  // Private messaging
  sendPrivateMessage(senderId: string, receiverId: string, message: string): PrivateMessage {
    const newMessage: PrivateMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      message,
      timestamp: new Date().toLocaleString(),
      read: false
    };

    this.privateMessages.push(newMessage);
    this.updateConversations();
    return newMessage;
  }

  getConversation(userId1: string, userId2: string): PrivateMessage[] {
    return this.privateMessages
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getUserConversations(userId: string): ChatConversation[] {
    return this.conversations.filter(conv => conv.participants.includes(userId));
  }

  markMessagesAsRead(userId: string, otherUserId: string): void {
    this.privateMessages.forEach(msg => {
      if (msg.senderId === otherUserId && msg.receiverId === userId) {
        msg.read = true;
      }
    });
    this.updateConversations();
  }

  private updateConversations(): void {
    const conversationMap = new Map<string, ChatConversation>();

    this.privateMessages.forEach(msg => {
      const participants = [msg.senderId, msg.receiverId].sort();
      const convId = participants.join('-');

      if (!conversationMap.has(convId)) {
        conversationMap.set(convId, {
          id: convId,
          participants,
          unreadCount: 0
        });
      }

      const conv = conversationMap.get(convId)!;
      
      // Update last message
      if (!conv.lastMessage || new Date(msg.timestamp) > new Date(conv.lastMessage.timestamp)) {
        conv.lastMessage = msg;
      }

      // Count unread messages
      if (!msg.read) {
        conv.unreadCount++;
      }
    });

    this.conversations = Array.from(conversationMap.values());
  }

  // Real-time updates simulation
  private messageListeners: ((message: PrivateMessage) => void)[] = [];
  private memberListeners: ((members: Member[]) => void)[] = [];

  onPrivateMessage(listener: (message: PrivateMessage) => void): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onMemberUpdate(listener: (members: Member[]) => void): () => void {
    this.memberListeners.push(listener);
    return () => {
      this.memberListeners = this.memberListeners.filter(l => l !== listener);
    };
  }

  private notifyMessageListeners(message: PrivateMessage): void {
    this.messageListeners.forEach(listener => listener(message));
  }

  private notifyMemberListeners(): void {
    this.memberListeners.forEach(listener => listener(this.members));
  }
}

export const memberService = new MemberService();
