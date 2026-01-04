"use client";

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
// Lucide icons for Send button
import { Send } from 'lucide-react';

export default function ChatInterface() {
    // Initial State consistent with App.tsx design
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'ai',
            content: "Ready to map your existing knowledge to a new syntax? Let's dive into idiomatic patterns and advanced concepts.",
            type: 'text'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: inputValue,
            type: 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Gemini history logic (filtering logic remains same)
            const firstUserIndex = messages.findIndex(m => m.role === 'user');
            const validHistory = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : [];

            const history = validHistory.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: history
                }),
            });

            const data = await res.json();

            // Handling response
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch');
            }

            const aiMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: data.content,
                type: data.type || 'text',
                codeData: data.codeData
            };

            // Server now handles parsing, so we use the structured data directly
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: error.message || "Sorry, I encountered an error. Please try again.",
                type: 'text'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleCodeSuccess = () => { };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ffe5cc] to-[#ffd4a8] flex items-center justify-center p-4 font-sans">
            <div className="bg-[rgba(255,173,77,0.27)] rounded-[50px] w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden backdrop-blur-sm">

                {/* Header */}
                <div className="p-10 border-b border-black/10 text-center">
                    <h1 className="font-['Fresca',sans-serif] text-black text-6xl tracking-[-2px]">
                        Polyglot AI
                    </h1>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onSuccess={handleCodeSuccess}
                        />
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/70 text-black px-6 py-4 rounded-[30px] font-['Unna',sans-serif]">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-black/10">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me about coding..."
                            className="flex-1 px-6 py-3 rounded-full bg-white/60 border-2 border-black/20 focus:border-black/40 focus:outline-none font-['Unna',sans-serif] text-black placeholder:text-black/50 text-lg shadow-sm"
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-[rgba(255,173,77,0.8)] hover:bg-[rgba(255,173,77,1)] disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
                        >
                            <Send className="w-6 h-6 text-black" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
