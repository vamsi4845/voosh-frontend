import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Copy, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatAreaProps {
  messages: Message[];
  streamingText: string;
  isLoading: boolean;
}

function ChatArea({ messages, streamingText, isLoading }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative flex-1">
    <div
      className="absolute inset-0 touch-pan-y overflow-y-auto"
    >
    <div className="flex-1 flex flex-col bg-[#0f0f0f] overflow-hidden max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !streamingText && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Start a conversation</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-4",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-3xl rounded-2xl px-4 py-2",
                message.role === 'user'
                  ? "bg-blue-600 text-white"
                  : "text-gray-100"
              )}
            >
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs font-semibold text-gray-400 mb-2">Sources:</div>
                    <div className="space-y-1">
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          {source.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                  <button
                    onClick={() => handleCopy(message.content)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Thumbs up"
                  >
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title="Thumbs down"
                  >
                    <ThumbsDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <div className="max-w-3xl rounded-2xl px-4 py-3 bg-gray-800 text-gray-100">
              <div className="whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse">|</span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gray-400 animate-pulse" />
            </div>
            <div className="max-w-3xl rounded-2xl px-4 py-3 bg-gray-800 text-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
    </div>
    </div>
  );
}

export default ChatArea;

