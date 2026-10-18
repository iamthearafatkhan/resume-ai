/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    deep: "#1A05A2",
                    purple: "#8F0177",
                    pink: "#DE1A58",
                    orange: "#F67D31",
                },
            },
        },
    },
    plugins: [],
};