import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

const botResponses: Record<string, string> = {
  hello: "Hello! Welcome to our community! How can I help you today?",
  hi: "Hi there! Great to have you here! What would you like to know?",
  help: "I'm here to help! You can ask me about:\n• Creating a profile\n• Finding connections\n• Messaging features\n• Community guidelines",
  profile: "To create your profile, click on 'Get Started' and sign up. You can add photos, your location, and interests!",
  message: "You can send messages to your connections. Just visit their profile and click the message button!",
  connect: "To connect with someone, visit their profile and send a connection request. Once accepted, you can start chatting!",
  safety: "Your safety is our priority! Check out our Safety Tips page for guidance on staying safe while connecting.",
  thanks: "You're welcome! Feel free to ask if you have more questions. Enjoy your time here! 💕",
  bye: "Goodbye! Have a wonderful day and happy connecting! 👋",
  default: "I'm not sure I understand. Try asking about profiles, messages, connections, or safety tips!"
};

const WelcomeBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setHasShownWelcome(true);
      setTimeout(() => {
        addBotMessage("👋 Welcome! I'm your friendly assistant. How can I help you today?");
      }, 500);
      setTimeout(() => {
        addBotMessage("You can ask me about profiles, messaging, connections, or safety tips!");
      }, 1500);
    }
  }, [isOpen, hasShownWelcome]);

  // Handle mouse/touch drag
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      
      const newX = window.innerWidth - clientX - dragOffset.x;
      const newY = window.innerHeight - clientY - dragOffset.y;
      
      // Keep within bounds
      const maxX = window.innerWidth - 64;
      const maxY = window.innerHeight - 64;
      
      setPosition({
        x: Math.max(8, Math.min(newX, maxX)),
        y: Math.max(8, Math.min(newY, maxY))
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: rect.right - clientX,
      y: rect.bottom - clientY
    });
    setIsDragging(true);
  };

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content,
      isBot: true,
      timestamp: new Date()
    }]);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(getBotResponse(inputValue));
    }, 1000 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Draggable */}
      <button
        ref={buttonRef}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        className={cn(
          "fixed z-50 p-4 rounded-full shadow-lg transition-all duration-150",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "hover:shadow-xl",
          isDragging ? "cursor-grabbing scale-110" : "cursor-grab",
          !isDragging && "hover:scale-105"
        )}
      >
        <div className="relative">
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {!isOpen && (
            <GripVertical className="h-3 w-3 absolute -top-1 -right-1 text-primary-foreground/60" />
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div
        style={{
          right: `${position.x}px`,
          bottom: `${position.y + 64}px`,
        }}
        className={cn(
          "fixed z-50 w-80 sm:w-96 bg-card rounded-2xl shadow-2xl border border-border",
          "transition-all duration-300 transform",
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary-foreground/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">🤖</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Welcome Bot</h3>
              <p className="text-xs opacity-80">Drag me anywhere!</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in",
                message.isBot ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl whitespace-pre-line",
                  message.isBot
                    ? "bg-muted text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-[10px] opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-primary"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="rounded-full shrink-0"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeBot;
