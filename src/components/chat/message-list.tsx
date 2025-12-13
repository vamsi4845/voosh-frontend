import { Greeting } from "@/components/chat/greeting";
import { useEffect, useRef } from "react";
import { Message } from '@/types';
import MessagePreview from "@/components/chat/message-preview";


interface MessagesProps {
  messages: Message[];
  streamingText: string;
}

export function Messages({messages, streamingText }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (): void => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages, streamingText]);

  return (
    <div className="relative flex-1">
        <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
          {messages.length === 0 && <Greeting />}

          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <MessagePreview key={index} message={message} />
            ))}
            {streamingText && (
              <div className="message-bubble bot streaming">
                <div className="message-content">
                  <div className="message-text">{streamingText}</div>
                  <span className="streaming-cursor">|</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* {status === "submitted" && <ThinkingMessage />} */}

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
      </div>

      {/* <button
        aria-label="Scroll to bottom"
        className={`-translate-x-1/2 absolute bottom-4 left-1/2 z-10 rounded-full border bg-background p-2 shadow-lg transition-all hover:bg-muted ${
          isAtBottom
            ? "pointer-events-none scale-0 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-4" />
      </button> */}
    </div>
  );
}

