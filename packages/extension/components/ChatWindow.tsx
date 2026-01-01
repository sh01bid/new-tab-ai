import { useState } from 'react';
import { trpc } from '../src/utils/trpc';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
    isPolicyError?: boolean;
}

export function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am your AI assistant. How can I help you today?',
        },
    ]);

    const sendMessageMutation = trpc.chat.sendMessage.useMutation({
        onSuccess: (data) => {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.response,
                },
            ]);
        },
        onError: (error) => {
            let errorMessage = error.message;
            let isPolicyError = false;

            if (errorMessage.includes("data policy") || errorMessage.includes("privacy settings")) {
                isPolicyError = true;
                errorMessage = "To use the free model, you must enable model training in OpenRouter settings.";
            } else if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
                errorMessage = "Too many requests. The AI provider is currently busy. Please try again in 1 minute.";
            }

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: errorMessage,
                    isError: true,
                    isPolicyError,
                },
            ]);
        },
    });

    const handleSend = () => {
        if (!input.trim() || sendMessageMutation.isPending) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message immediately
        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                content: userMessage,
            },
        ]);

        // Send to AI
        sendMessageMutation.mutate({
            message: userMessage,
            history: messages.map(m => ({ role: m.role, content: m.content })),
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}

            {isOpen && (
                <div className="w-[360px] h-[600px] bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="font-medium text-white">AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-2xl max-w-[80%] text-sm ${message.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : message.isError
                                            ? 'bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-none'
                                            : 'bg-white/10 text-white/90 rounded-tl-none'
                                        }`}
                                >
                                    {message.content}
                                    {message.isPolicyError && (
                                        <a
                                            href="https://openrouter.ai/settings/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-2 text-blue-400 hover:text-blue-300 underline text-xs"
                                        >
                                            Go to OpenRouter Settings
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                        {sendMessageMutation.isPending && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white/90 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask anything..."
                                disabled={sendMessageMutation.isPending}
                                className="w-full bg-black/20 text-white placeholder-white/30 rounded-xl py-3 pl-4 pr-10 border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || sendMessageMutation.isPending}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
