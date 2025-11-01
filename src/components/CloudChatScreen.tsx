import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { useEffect } from 'react';

export function CloudChatScreen() {
  const { messages, sendMessage, isTyping, mode, setMode } = useChat();

  // Force mode to 'cloud' when this screen mounts
  useEffect(() => {
    setMode('cloud');
  }, [setMode]);

  return (
    <div className="flex flex-col h-full w-full">
      <ChatArea messages={messages} isLoading={isTyping} />
      <ChatInput
        onSend={sendMessage}
        disabled={isTyping}
        placeholder="Type your message to cloud AI..."
      />
    </div>
  );
}
