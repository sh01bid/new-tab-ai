import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    dev: {
        server: {
            hostname: '127.0.0.1',
        },
    },
    manifest: {
        name: 'New Tab AI',
        description: 'AI-powered New Tab Dashboard',
        version: '1.0.0',
        permissions: ['storage', 'tabs', 'topSites'],
    },
});
