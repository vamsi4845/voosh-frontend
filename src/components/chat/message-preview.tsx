
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface MessagePreviewProps {
  message: Message;
}

function MessagePreview({ message }: MessagePreviewProps): JSX.Element {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={cn("max-w-3xl rounded-2xl px-4 py-3", isUser ? " text-white" : "text-gray-100")}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs font-semibold text-gray-400 mb-2">Sources:</div>
            {message.sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:text-blue-300 underline"
              >
                {source.title || 'Source'}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default MessagePreview;

