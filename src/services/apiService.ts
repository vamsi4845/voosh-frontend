import axios, { AxiosError } from 'axios';
import { ChatResponse, SessionHistoryResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sendMessage(sessionId: string | undefined, message: string): Promise<ChatResponse> {
  try {
    const response = await apiClient.post<ChatResponse>('/api/chat', {
      sessionId,
      message,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    throw new Error(axiosError.response?.data?.error || 'Failed to send message');
  }
}

export async function getSessionHistory(sessionId: string): Promise<SessionHistoryResponse> {
  try {
    const response = await apiClient.get<SessionHistoryResponse>(`/api/session/${sessionId}/history`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    throw new Error(axiosError.response?.data?.error || 'Failed to fetch session history');
  }
}

export async function clearSession(sessionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/session/${sessionId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    throw new Error(axiosError.response?.data?.error || 'Failed to clear session');
  }
}

