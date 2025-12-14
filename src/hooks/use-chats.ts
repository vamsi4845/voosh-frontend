import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clearSession } from '@/services/apiService';

export interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

const CHATS_STORAGE_KEY = 'chats';

function getChatsFromStorage(): Chat[] {
  const savedChats = localStorage.getItem(CHATS_STORAGE_KEY);
  if (savedChats) {
    try {
      return JSON.parse(savedChats);
    } catch (error) {
      console.error('Failed to parse chats from storage:', error);
      return [];
    }
  }
  return [];
}

function saveChatsToStorage(chats: Chat[]): void {
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
}

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => getChatsFromStorage(),
    staleTime: 0,
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      try {
        await clearSession(chatId);
      } catch (error) {
        console.error('Failed to clear session on backend:', error);
      }
      
      const chats = getChatsFromStorage();
      const updatedChats = chats.filter((c) => c.id !== chatId);
      saveChatsToStorage(updatedChats);
      return updatedChats;
    },
    onSuccess: (updatedChats) => {
      queryClient.setQueryData(['chats'], updatedChats);
      toast.success('Chat deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete chat:', error);
      toast.error('Failed to delete chat');
    },
  });
}

export function useDeleteAllChats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const chats = getChatsFromStorage();
      
      const clearPromises = chats.map((chat) =>
        clearSession(chat.id).catch((error) => {
          console.error(`Failed to clear session ${chat.id}:`, error);
        })
      );
      
      await Promise.allSettled(clearPromises);
      
      saveChatsToStorage([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(['chats'], []);
      toast.success('All chats deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete all chats:', error);
      toast.error('Failed to delete all chats');
    },
  });
}

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, updates }: { chatId: string; updates: Partial<Chat> }) => {
      const chats = getChatsFromStorage();
      const updatedChats = chats.map((c) =>
        c.id === chatId ? { ...c, ...updates } : c
      );
      saveChatsToStorage(updatedChats);
      return updatedChats;
    },
    onSuccess: (updatedChats) => {
      queryClient.setQueryData(['chats'], updatedChats);
    },
  });
}

export function useAddChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chat: Chat) => {
      const chats = getChatsFromStorage();
      const updatedChats = [chat, ...chats];
      saveChatsToStorage(updatedChats);
      return updatedChats;
    },
    onSuccess: (updatedChats) => {
      queryClient.setQueryData(['chats'], updatedChats);
    },
  });
}

