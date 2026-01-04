interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] px-6 py-4 rounded-[30px] ${
          isBot
            ? 'bg-white/70 text-black'
            : 'bg-[rgba(255,173,77,0.6)] text-black'
        }`}
      >
        <p className="font-['Unna:Regular',sans-serif] leading-relaxed">
          {message.text}
        </p>
        <div className="mt-2 opacity-60">
          <span className="font-['Unna:Regular',sans-serif]">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
