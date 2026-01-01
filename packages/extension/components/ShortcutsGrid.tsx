import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface TopSite {
    id: string;
    title: string;
    url: string;
    isCustom?: boolean;
}

export function ShortcutsGrid() {
    const [shortcuts, setShortcuts] = useState<TopSite[]>([]);

    const loadShortcuts = async () => {
        try {
            // 1. Load custom shortcuts from storage
            const storage = await chrome.storage.sync.get(['customShortcuts']);
            const custom: TopSite[] = (storage.customShortcuts || []).map((s: TopSite) => ({ ...s, isCustom: true }));

            // 2. Load Top Sites from Chrome API
            let topSites: TopSite[] = [];
            if (chrome?.topSites) {
                const sites = await new Promise<chrome.topSites.MostVisitedURL[]>((resolve) => {
                    chrome.topSites.get(resolve);
                });
                topSites = sites.map((site, index) => ({
                    id: `top-${index}`,
                    title: site.title || new URL(site.url).hostname,
                    url: site.url,
                    isCustom: false,
                }));
            } else {
                // Fallback mock data
                topSites = [
                    { id: 'mock-1', title: 'GitHub', url: 'https://github.com', isCustom: false },
                    { id: 'mock-2', title: 'YouTube', url: 'https://youtube.com', isCustom: false },
                    { id: 'mock-3', title: 'ChatGPT', url: 'https://chat.openai.com', isCustom: false },
                    { id: 'mock-4', title: 'Gmail', url: 'https://mail.google.com', isCustom: false },
                ];
            }

            // 3. Merge: Custom first, then Top Sites (filtering duplicates)
            const customUrls = new Set(custom.map(s => new URL(s.url).origin)); // Compare origins to avoid loose matches
            const uniqueTopSites = topSites.filter(site => {
                try {
                    return !customUrls.has(new URL(site.url).origin);
                } catch {
                    return true;
                }
            });

            // Limit total to 11 to always allow space for "Add" button if we want, or 12 if full.
            // Let's go with 12 max total items.
            const combined = [...custom, ...uniqueTopSites].slice(0, 11);
            setShortcuts(combined);

        } catch (error) {
            console.error("Failed to load shortcuts:", error);
        }
    };

    useEffect(() => {
        loadShortcuts();
    }, []);

    const handleAddShortcut = async () => {
        const urlInput = prompt('Enter website URL (e.g., https://example.com):');
        if (!urlInput) return;

        try {
            let urlStr = urlInput;
            if (!urlStr.startsWith('http')) {
                urlStr = `https://${urlStr}`;
            }
            const urlObj = new URL(urlStr);
            const title = prompt('Enter website name:', urlObj.hostname) || urlObj.hostname;

            const newShortcut: TopSite = {
                id: String(Date.now()),
                title,
                url: urlObj.href,
                isCustom: true,
            };

            // Save to storage
            const result = await chrome.storage.sync.get(['customShortcuts']);
            const customShortcuts = result.customShortcuts || [];
            const updatedShortcuts = [...customShortcuts, newShortcut];

            await chrome.storage.sync.set({ customShortcuts: updatedShortcuts });

            // Reload grid
            loadShortcuts();

        } catch (error) {
            alert('Invalid URL. Please try again.');
        }
    };



    // We need to incorporate the blockedSites filtering into loadShortcuts
    // Updating loadShortcuts logic to filter blocked sites would be better.
    // Let's simplify for now: Only allow deleting CUSTOM shortcuts. 
    // Top sites are automatic. If user really wants to remove a top site, standard behavior is usually they can't 
    // or we need complex blacklist. Let's start with deleting Custom ones.

    // REVISED handleDelete:
    const handleDeleteCustom = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Delete this shortcut?')) {
            const result = await chrome.storage.sync.get(['customShortcuts']);
            const customShortcuts = result.customShortcuts || [];
            const updatedShortcuts = customShortcuts.filter((s: TopSite) => s.id !== id);
            await chrome.storage.sync.set({ customShortcuts: updatedShortcuts });
            loadShortcuts();
        }
    };

    return (
        <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
            {shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="relative group">
                    <a
                        href={shortcut.url}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 h-32 w-32"
                    >
                        <div className="w-12 h-12 mb-3 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${new URL(shortcut.url).hostname}&sz=64`}
                                alt={shortcut.title}
                                className="w-6 h-6"
                                onError={(e) => {
                                    // Fallback if favicon fails
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>';
                                }}
                            />
                        </div>
                        <span className="text-sm text-white/70 group-hover:text-white truncate w-full text-center px-1">
                            {shortcut.title}
                        </span>
                    </a>
                    {shortcut.isCustom && (
                        <button
                            onClick={(e) => handleDeleteCustom(e, shortcut.id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                            title="Delete Shortcut"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            ))}
            {shortcuts.length < 12 && (
                <button
                    onClick={handleAddShortcut}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 transition-all duration-200 h-32 w-32 group"
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
