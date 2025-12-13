import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import ChatArea from '@/components/chat/chat-area';
import ChatInput from '@/components/chat/chat-input';
import { useSocket } from '@/contexts/socket-context';

export function HomePage() {
  const navigate = useNavigate();
  const {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    streamingText,
    isLoading,
    sendMessage: socketSendMessage,
  } = useSocket();

  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      navigate(`/chat/${savedSessionId}`, { replace: true });
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [navigate, setSessionId, setMessages]);

  useEffect(() => {
    if (sessionId && !window.location.pathname.includes('/chat/')) {
      navigate(`/chat/${sessionId}`, { replace: true });
    }
  }, [sessionId, navigate]);

  const handleSendMessage = (text: string): void => {
    if (!text.trim()) return;

    socketSendMessage(text, sessionId);
    
    setMessages((prev) => {
      return [...prev, {
        role: 'user' as const,
        content: text,
        timestamp: new Date().toISOString(),
      }];
    });
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatArea
          messages={messages}
          streamingText={streamingText}
          isLoading={isLoading}
        />
        <ChatInput
          onSend={handleSendMessage}
        />
      </div>
    </SidebarInset>
  );
}

