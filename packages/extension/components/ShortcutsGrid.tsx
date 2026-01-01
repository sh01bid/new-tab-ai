import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface TopSite {
    id: string;
    title: string;
    url: string;
}

export function ShortcutsGrid() {
    const [shortcuts, setShortcuts] = useState<TopSite[]>([]);

    useEffect(() => {
        // Fetch top sites from Chrome API
        console.log('Checking chrome.topSites:', chrome?.topSites);

        if (chrome?.topSites) {
            chrome.topSites.get((sites) => {
                console.log('Top sites received:', sites);
                const topSites = sites.slice(0, 8).map((site, index) => ({
                    id: String(index),
                    title: site.title || new URL(site.url).hostname,
                    url: site.url,
                }));
                setShortcuts(topSites);
            });
        } else {
            // Fallback mock data for development
            console.warn('chrome.topSites not available, using fallback');
            setShortcuts([
                { id: '1', title: 'GitHub', url: 'https://github.com' },
                { id: '2', title: 'YouTube', url: 'https://youtube.com' },
                { id: '3', title: 'ChatGPT', url: 'https://chat.openai.com' },
                { id: '4', title: 'Gmail', url: 'https://mail.google.com' },
            ]);
        }
    }, []);

    const handleAddShortcut = () => {
        const url = prompt('Enter website URL (e.g., https://example.com):');
        if (!url) return;

        try {
            const urlObj = new URL(url);
            const title = prompt('Enter website name:', urlObj.hostname) || urlObj.hostname;

            const newShortcut: TopSite = {
                id: String(Date.now()),
                title,
                url: urlObj.href,
            };

            setShortcuts(prev => [...prev, newShortcut]);

            // Save to chrome.storage
            chrome.storage.sync.get(['customShortcuts'], (result) => {
                const customShortcuts = result.customShortcuts || [];
                customShortcuts.push(newShortcut);
                chrome.storage.sync.set({ customShortcuts });
            });
        } catch (error) {
            alert('Invalid URL. Please enter a valid URL starting with http:// or https://');
        }
    };

    return (
        <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
            {shortcuts.map((shortcut) => (
                <a
                    key={shortcut.id}
                    href={shortcut.url}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
                >
                    <div className="w-12 h-12 mb-3 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(shortcut.url).hostname}&sz=64`}
                            alt={shortcut.title}
                            className="w-6 h-6"
                        />
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white truncate w-full text-center px-1">
                        {shortcut.title}
                    </span>
                </a>
            ))}
            {shortcuts.length < 12 && (
                <button
                    onClick={handleAddShortcut}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 transition-all duration-200"
                >
                    <div className="w-12 h-12 mb-3 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Plus className="w-6 h-6 text-white/40 group-hover:text-white/80" />
                    </div>
                    <span className="text-sm text-white/40 group-hover:text-white/80">Add Shortcut</span>
                </button>
            )}
        </div>
    );
}
