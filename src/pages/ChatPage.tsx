import { Header } from '@/components/layout/Header';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';

export function ChatPage() {
  const { messages, sendMessage, isTyping, mode, setMode } = useChat();

  const handleModeChange = (newMode: 'home' | 'cloud' | 'local') => {
    if (newMode === 'home') {
      // Optional: add navigation logic or reset conversation
      setMode('cloud'); // Default back to cloud if you want
    } else {
      setMode(newMode);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header activeMode={mode as 'home' | 'cloud' | 'local'} onModeChange={handleModeChange} />
      <ChatArea messages={messages} isLoading={isTyping} />
      <ChatInput onSend={sendMessage} disabled={isTyping} placeholder={`Type your message to ${mode} AI...`} />
    </div>
  );
}
