import { useEffect, useCallback } from 'react';
import { getSessionHistory } from '@/services/apiService';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import ChatArea from '@/components/chat/chat-area';
import ChatInput from '@/components/chat/chat-input';
import { useSocket } from '@/contexts/socket-context';
import { AppSidebar } from '@/components/app-sidebar';

function ChatScreen(): JSX.Element {
  const {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    streamingText,
    isLoading,
    sendMessage: socketSendMessage,
  } = useSocket();

  const loadSessionHistory = useCallback(async (sid: string): Promise<void> => {
    try {
      const data = await getSessionHistory(sid);
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  }, [setMessages]);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadSessionHistory(savedSessionId);
    }
  }, [setSessionId, loadSessionHistory]);

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

  const handleNewChat = (): void => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem('chatSessionId');
  };


  return (
    <SidebarProvider>
      <AppSidebar onNewChat={handleNewChat} />
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
    </SidebarProvider>
  );
}

export default ChatScreen;
