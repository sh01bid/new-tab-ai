import type { Config } from 'tailwindcss'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./entrypoints/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config
