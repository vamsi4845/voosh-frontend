export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    title?: string;
    url?: string;
    score?: number;
  }>;
}

export interface SessionHistoryResponse {
  sessionId: string;
  messages: Message[];
}

export interface ChatResponse {
  sessionId: string;
  response: Message;
}

export interface SocketSessionData {
  sessionId: string;
}

export interface SocketSourcesData {
  sources: Array<{
    title?: string;
    url?: string;
    score?: number;
  }>;
}

export interface SocketResponseData {
  text: string;
}

export interface SocketErrorData {
  message: string;
}

export interface SocketMessageData {
  sessionId?: string;
  message: string;
}

