import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Users, Wifi, WifiOff } from "lucide-react";
import { chatService, type ChatMessage } from "@/lib/chatService";

interface ChatWidgetProps {
  userName: string;
  userRole: 'member' | 'admin';
  className?: string;
}

export default function ChatWidget({ userName, userRole, className = "" }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat
    chatService.connect(userRole).then(() => {
      setIsConnected(true);
      setMessages(chatService.getRecentMessages());
      setOnlineUsers(chatService.getOnlineUsers().length);
    });

    // Listen for new messages
    const unsubscribeMessages = chatService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for connection changes
    const unsubscribeConnection = chatService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    // Listen for user list updates
    const unsubscribeUsers = chatService.onUserListUpdate((users) => {
      setOnlineUsers(users.filter(u => u.isOnline).length);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      unsubscribeUsers();
    };
  }, [userRole]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      chatService.sendMessage(newMessage, userName, userRole);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (message: ChatMessage) => {
    switch (message.type) {
      case 'announcement':
        return 'bg-blue-50 border border-blue-200 rounded-lg p-3';
      case 'system':
        return 'bg-gray-50 border border-gray-200 rounded-lg p-3';
      default:
        return '';
    }
  };

  const getMessageTextStyle = (message: ChatMessage) => {
    switch (message.type) {
      case 'announcement':
        return 'font-medium text-blue-800';
      case 'system':
        return 'italic text-gray-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span>Community Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "secondary" : "destructive"} className="text-xs">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  {onlineUsers} online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Connecting...
                </>
              )}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={getMessageStyle(message)}>
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback className="text-xs">
                        {message.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-semibold truncate ${
                          message.userRole === 'admin' ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {message.user}
                        </span>
                        {message.userRole === 'admin' && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${getMessageTextStyle(message)}`}>
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder={isConnected ? "Type your message..." : "Connecting to chat..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!isConnected || !newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-muted-foreground mt-2">
              Connecting to chat server...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
