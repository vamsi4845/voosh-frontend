import { Button } from "@/components/ui/button"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ArrowUp } from "lucide-react"
import { useState } from "react"

function ChatInput({onSend}: {onSend: (text: string) => void}) {
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (input.trim()) {
      setIsLoading(true)
      await onSend(input)
      setInput("")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <PromptInputTextarea placeholder="Ask me anything..." />
      <PromptInputActions className="justify-end pt-2">
        <PromptInputAction tooltip="Send message">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()} 
            variant="default" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/80 disabled:bg-stone-300 disabled:text-white text-black hover:bg-white/90"
          >
            <ArrowUp className="size-5" />
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
    </div>
  )
}

export default ChatInput;