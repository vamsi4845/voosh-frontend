import ChatArea from '@/components/chat/chat-area';
import { ChatHeader } from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import {
  SidebarInset
} from '@/components/ui/sidebar';
import { useSocket } from '@/contexts/socket-context';
import { useChats } from '@/hooks/use-chats';
import { getSessionHistory } from '@/services/apiService';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
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

  const { data: chats = [] } = useChats();

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
    if (chatId) {
      const chatExists = chats.some(c => c.id === chatId);
      if (!chatExists && chats.length > 0) {
        navigate('/');
        return;
      }
      setSessionId(chatId);
      localStorage.setItem('chatSessionId', chatId);
      loadSessionHistory(chatId);
    } else {
      const savedSessionId = localStorage.getItem('chatSessionId');
      if (savedSessionId) {
        navigate(`/chat/${savedSessionId}`, { replace: true });
      } else {
        setSessionId(null);
        setMessages([]);
      }
    }
  }, [chatId, chats, navigate, setSessionId, setMessages, loadSessionHistory]);

  const handleSendMessage = (text: string): void => {
    if (!text.trim()) return;

    const currentId = chatId || sessionId;
    socketSendMessage(text, currentId);
    
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
         <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
         <ChatHeader/>
            <ChatArea
            messages={messages}
            streamingText={streamingText}
            isLoading={isLoading}
            />
            <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
              <ChatInput
                onSend={handleSendMessage}
              />
          </div>
        </div>
    </SidebarInset>
  );
}

