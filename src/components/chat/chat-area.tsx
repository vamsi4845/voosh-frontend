import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="relative flex-1">
    <div
      className="absolute inset-0 touch-pan-y overflow-y-auto"
    >
    <div className="flex-1 flex flex-col bg-[#0f0f0f] overflow-hidden max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-2",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-3xl rounded-2xl",
                message.role === 'user'
                  ? "bg-blue-600 text-white px-4 py-2"
                  : "text-gray-100"
              )}
            >
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4">
                    <Accordion type="single" collapsible className="w-full bg-[#212121] rounded-2xl p-4">
                      <AccordionItem value="sources" className="border-none !text-xs !text-white">
                        <AccordionTrigger className="py-0 hover:no-underline [&>svg]:hidden [&[data-state=open]_div_svg]:rotate-180">
                              Sources: {message.sources.length} {message.sources.length === 1 ? 'source' : 'sources'}
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0">
                          <div className="space-y-2">
                            {message.sources.map((source, idx) => (
                              <Link
                                key={idx}
                                to={source.url || '/'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-300 hover:text-gray-100 transition-colors hover:underline group flex items-center gap-1"
                              >
                                {source.title || 'Source'}
                                <ArrowUpRight  className="hidden group-hover:block w-3 h-3 text-gray-400 group-hover:text-gray-100 transition-colors" />
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
              {/* {message.role === 'assistant' && (
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
              )} */}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="max-w-3xl rounded-2xl px-4 py-3 text-white">
              <div className="whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse">|</span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-2 justify-start items-center">
              Thinking...
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

