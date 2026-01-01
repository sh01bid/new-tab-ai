import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all shadow-lg"
                    placeholder="Search everything..."
                    autoFocus
                />
            </div>
        </form>
    );
}
