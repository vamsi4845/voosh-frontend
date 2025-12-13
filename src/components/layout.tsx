import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useSocket } from '@/contexts/socket-context';

export function Layout() {
  const { setMessages, setSessionId } = useSocket();

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem('chatSessionId');
  };

  return (
    <SidebarProvider>
      <AppSidebar onNewChat={handleNewChat} />
      <Outlet />
    </SidebarProvider>
  );
}

