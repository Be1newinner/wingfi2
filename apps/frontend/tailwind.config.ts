import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          foreground: "#ffffff",
        },
        secondary: "#1e40af", // blue-800 or custom
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
