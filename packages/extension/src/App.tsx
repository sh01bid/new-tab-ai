import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/trpc';
import { SearchBar } from '../components/SearchBar';
import { ShortcutsGrid } from '../components/ShortcutsGrid';
import { ChatWindow } from '../components/ChatWindow';

function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/api/trpc',
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-5xl flex-1 flex flex-col justify-center">
                        <div className="text-center mb-12">
                            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight mb-4">
                                New Tab AI
                            </h1>
                            <p className="text-xl text-white/60">Your intelligent workspace.</p>
                        </div>

                        <SearchBar />
                        <ShortcutsGrid />
                    </div>

                    <ChatWindow />
                </div>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

export default App;
