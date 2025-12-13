import { Layout } from '@/components/layout';
import { SocketProvider } from '@/contexts/socket-context';
import { ChatPage } from '@/pages/chat-page';
import { HomePage } from '@/pages/home-page';
import { QueryProvider } from '@/providers/query-provider';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <QueryProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="chat/:chatId" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </QueryProvider>
  );
}

export default App;

