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
                foreground: "#ffffff",
                neon: {
                    DEFAULT: "#ccff00", // A neon lime/yellow for brutalist accent
                    blue: "#00f0ff",
                    purple: "#bf00ff",
                },
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            fontWeight: {
                thin: "100",
                bold: "700",
            },
        },
    },
    plugins: [],
};
export default config;
