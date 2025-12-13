import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/services/socketService';
import { Message, SocketSessionData, SocketSourcesData, SocketResponseData, SocketErrorData, SocketMessageData } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import type { Chat } from '@/hooks/use-chats';

interface SocketContextValue {
  isConnected: boolean;
  sessionId: string | null;
  messages: Message[];
  streamingText: string;
  isLoading: boolean;
  sendMessage: (text: string, currentSessionId?: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setStreamingText: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const socket = connectSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat:session', (data: SocketSessionData) => {
      setSessionId(data.sessionId);
      localStorage.setItem('chatSessionId', data.sessionId);
    });

    socket.on('chat:user_message', (message: Message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        return updated;
      });
    });

    socket.on('chat:sources', (_data: SocketSourcesData) => {
    });

    socket.on('chat:response', (data: SocketResponseData) => {
      setStreamingText((prev) => prev + data.text);
    });

    socket.on('chat:complete', (message: Message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        return updated;
      });
      setStreamingText('');
      setIsLoading(false);
    });

    socket.on('chat:error', (data: SocketErrorData) => {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${data.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
      setIsLoading(false);
    });

    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }

    return () => {
      disconnectSocket();
    };
  }, [queryClient]);

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
        const chats = queryClient.getQueryData<Chat[]>(['chats']) || [];
        const existingChatIndex = chats.findIndex(c => c.id === sessionId);
        
        if (existingChatIndex >= 0) {
          if (chats[existingChatIndex].title !== title) {
            const updatedChats = [...chats];
            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              title,
            };
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            queryClient.setQueryData(['chats'], updatedChats);
          }
        } else {
          const newChat: Chat = {
            id: sessionId,
            title,
            timestamp: new Date().toISOString(),
          };
          const updatedChats = [newChat, ...chats];
          localStorage.setItem('chats', JSON.stringify(updatedChats));
          queryClient.setQueryData(['chats'], updatedChats);
        }
      }
    }
  }, [sessionId, messages, queryClient]);

  const sendMessage = useCallback((text: string, currentSessionId?: string | null) => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      alert('Not connected to server. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setStreamingText('');

    const messageData: SocketMessageData = {
      sessionId: currentSessionId || undefined,
      message: text,
    };

    socket.emit('chat:message', messageData);
  }, []);

  const value: SocketContextValue = {
    isConnected,
    sessionId,
    messages,
    streamingText,
    isLoading,
    sendMessage,
    setMessages,
    setStreamingText,
    setIsLoading,
    setSessionId,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

