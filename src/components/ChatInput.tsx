import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors mb-1 cursor-pointer">
          <Paperclip size={20} />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-1"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
