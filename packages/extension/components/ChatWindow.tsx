import { useState } from 'react';
import { trpc } from '../src/utils/trpc';
import { MessageSquare, Send, X } from 'lucide-react';

export function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    // In a real app, this would use a mutation or streaming subscription
    const hello = trpc.hello.useQuery({ text: 'AI' }, { enabled: false });

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
                        <div className="flex justify-start">
                            <div className="bg-white/10 text-white/90 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                                Hello! How can I help you today?
                            </div>
                        </div>
                        {/* Example User Message */}
                        {message && (
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                                    {message}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask anything..."
                                className="w-full bg-black/20 text-white placeholder-white/30 rounded-xl py-3 pl-4 pr-10 border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setMessage(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-400">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
