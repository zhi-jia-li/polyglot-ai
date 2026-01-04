import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { Send } from 'lucide-react';
import imgTeaching11 from "figma:asset/01290d24115f39bd7d51541a98643fc045a3b087.png";
import imgProblem11 from "figma:asset/7221d865f7eeb15f5ea2f584822eb2f910f7bdac.png";
import imgIdea11 from "figma:asset/17f9aa6b4dc25aef2d2be502ab9b14c0e29dacfb.png";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help make learning more enjoyable. Ask me anything about interactive learning methods!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! How can I help you today with your learning journey?';
    }
    if (input.includes('interactive') || input.includes('method')) {
      return 'The interactive approach focuses on making the learning experience more enjoyable for children. Their eagerness to learn and self-study develops, while they are being prepared for better grades at school.';
    }
    if (input.includes('teaching') || input.includes('learn')) {
      return 'Interactive teaching methods engage students through hands-on activities, discussions, and real-world applications. This keeps them motivated and curious!';
    }
    if (input.includes('problem') || input.includes('question')) {
      return 'Questions and problems are great learning opportunities! They help develop critical thinking skills and encourage students to explore solutions creatively.';
    }
    if (input.includes('idea') || input.includes('creative')) {
      return 'Encouraging creativity and new ideas is essential for effective learning. When children feel free to express their thoughts, they become more confident learners!';
    }
    return 'That\'s an interesting question! Interactive learning helps children stay engaged and develop a love for education. What else would you like to know?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffe5cc] to-[#ffd4a8] flex items-center justify-center p-4">
      <div className="bg-[rgba(255,173,77,0.27)] rounded-[50px] w-full max-w-3xl h-[700px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-black/10">
          <h1 className="font-['Fresca:Regular',sans-serif] text-black tracking-[-2px] mb-4">
            Interactive Learning Chat
          </h1>
          <div className="flex gap-6 justify-center">
            <img src={imgTeaching11} alt="Teaching" className="w-16 h-16 object-contain" />
            <img src={imgProblem11} alt="Problem solving" className="w-16 h-16 object-contain" />
            <img src={imgIdea11} alt="Ideas" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-black/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about interactive learning..."
              className="flex-1 px-6 py-3 rounded-full bg-white/60 border-2 border-black/20 focus:border-black/40 focus:outline-none font-['Unna:Regular',sans-serif] text-black placeholder:text-black/50"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-[rgba(255,173,77,0.8)] hover:bg-[rgba(255,173,77,1)] disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-3 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Send className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
