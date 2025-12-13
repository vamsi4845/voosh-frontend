import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/contexts/socket-context';
import { useChats, useDeleteChat, type Chat } from '@/hooks/use-chats';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { ChatItem } from '@/components/sidebar-history-item';
type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.timestamp);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats
  );
};

export function SidebarHistory() {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: chats = [], isLoading } = useChats();
  const { setMessages, setSessionId } = useSocket();
  const deleteChat = useDeleteChat();

  const handleDelete = (chatIdToDelete: string) => {
    deleteChat.mutate(chatIdToDelete, {
      onSuccess: () => {
        if (chatIdToDelete === chatId) {
          setMessages([]);
          setSessionId(null);
          localStorage.removeItem('chatSessionId');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Today</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                className="flex h-8 items-center gap-2 rounded-md px-2"
                key={item}
              >
                <div
                  className="h-4 max-w-[var(--skeleton-width)] flex-1 rounded-md bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (chats.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const groupedChats = groupChatsByDate(chats);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className="flex flex-col gap-6">
            {groupedChats.today.length > 0 && (
              <div>
                <SidebarGroupLabel>Today</SidebarGroupLabel>
                {groupedChats.today.map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chatId === chat.id}
                    key={chat.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {groupedChats.yesterday.length > 0 && (
              <div>
                <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
                {groupedChats.yesterday.map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chatId === chat.id}
                    key={chat.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {groupedChats.lastWeek.length > 0 && (
              <div>
                <SidebarGroupLabel>Last 7 days</SidebarGroupLabel>
                {groupedChats.lastWeek.map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chatId === chat.id}
                    key={chat.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {groupedChats.lastMonth.length > 0 && (
              <div>
                <SidebarGroupLabel>Last 30 days</SidebarGroupLabel>
                {groupedChats.lastMonth.map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chatId === chat.id}
                    key={chat.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {groupedChats.older.length > 0 && (
              <div>
                <SidebarGroupLabel>Older than last month</SidebarGroupLabel>
                {groupedChats.older.map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chatId === chat.id}
                    key={chat.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
