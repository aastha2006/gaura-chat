import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md'
            : 'bg-white text-gray-800 shadow-sm border border-gray-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {timestamp}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}
