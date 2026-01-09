/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#64748B', // Neutral Slate Blue
                secondary: '#10B981',
                'secondary-light': '#34D399',
                accent: '#F59E0B',
                'accent-light': '#FBBF24',
            },
        },
    },
    plugins: [],
}
