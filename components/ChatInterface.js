"use client";

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
// Lucide icons for Send button
import { Send } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { supabase } from '../lib/supabase';

export default function ChatInterface() {
    const { user, isLoaded } = useUser();
    // Use user.id as key to force re-render when user changes (login/logout)
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load initial messages from Supabase
    useEffect(() => {
        if (!isLoaded) {
            return; // Wait for Clerk to load
        }

        if (!user) {
            // Default welcome message if not logged in (though middleware usually protects this now)
            setMessages([{
                id: 'welcome',
                role: 'ai',
                content: "Ready to map your existing knowledge to a new syntax? Let's dive into idiomatic patterns and advanced concepts.",
                type: 'text'
            }]);
            return;
        }

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
                return;
            }

            if (data && data.length > 0) {
                setMessages(data);
            } else {
                setMessages([{
                    id: 'welcome',
                    role: 'ai',
                    content: "Ready to map your existing knowledge to a new syntax? Let's dive into idiomatic patterns and advanced concepts.",
                    type: 'text'
                }]);
            }
        };

        fetchMessages();
    }, [user, isLoaded]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        const tempId = Date.now();

        // Optimistic UI update
        const userMsgOptimistic = {
            id: tempId,
            role: 'user',
            content: currentInput,
            type: 'text'
        };
        setMessages(prev => [...prev, userMsgOptimistic]);

        try {
            // Save User Message to DB
            if (user) {
                await supabase.from('messages').insert({
                    user_id: user.id,
                    role: 'user',
                    content: currentInput
                });
            }

            // Prepare history for API
            const history = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    history: history
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch');
            }

            const aiContent = data.content;

            // Save AI Message to DB
            if (user) {
                await supabase.from('messages').insert({
                    user_id: user.id,
                    role: 'ai',
                    content: aiContent
                });
            }

            const aiMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: aiContent,
                type: data.type || 'text',
                codeData: data.codeData
            };

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
                <div className="p-10 border-b border-black/10 text-center relative">
                    <div className="absolute top-6 right-8">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-black/10 hover:bg-black/20 text-black px-4 py-2 rounded-xl transition-all font-['Unna',sans-serif]">
                                    Login
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
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
