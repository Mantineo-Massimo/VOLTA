import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                neon: "#00ffcc",
            },
            fontFamily: {
                sans: ["Inter", "Helvetica Now", "sans-serif"],
            },
            letterSpacing: {
                tighter: "-0.05em",
                widest: "0.2em",
            },
        },
    },
    plugins: [],
};
export default config;
