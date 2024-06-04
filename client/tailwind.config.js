/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
    theme: {
        extend: {
            colors: {
                'dark-text': '#f8fdd8',
                'dark-bg': '#0d0e01',
                'dark-primary': '#ebf782',
                'dark-secondary': '#1b990a',
                'dark-accent': '#14f047',
                'dark-accent-hover': '#12C63C',
                'text': '#222702',
                'bg': '#fdfef1',
                'primary': '#717d08',
                'secondary': '#76f566',
                'accent': '#0feb42',
                'accent-hover': '#4EF374',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

