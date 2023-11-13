import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      colors: {
        themeColorMain: "#E13C30",
        themeColorDark: "#B92228",
        themeColorLight: "#e03c31",
        themeColorLighter: "#F1D4D4",
        themeBlack: "#2C2B2D",
        themeGrey: "#F2F2F2",
        themeGreyDark: "#c4c4c4",
        themeGreenLight: "#D1F0D3",
        themeGreenDark: "#249824",
        themeNavy: "#0E2638",
      },
      fontSize: {
        xxs: ["0.5rem", "1rem"],
        "5xl": ["3rem", "3.5rem"],
        "6xl": ["3.75rem", "4.25rem"],
        "7xl": ["4.5rem", "5rem"],
        "8xl": ["6rem", "6.5rem"],
        "9xl": ["7rem", "7.5rem"],
        "10xl": ["8rem", "8.5rem"],
      },
      screens: {
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "425px",
        "3xl": "1700px",
        "4xl": "1920px",
        "5xl": "2000px",
        "6xl": "2300px",
        "7xl": "2560px",
      },
    },
    container: {
      center: true,
      padding: {
        "mobile-s": "10px",
        // "mobile-m": "1rem",
        // "mobile-l": "1.25rem",

        sm: "2rem",
        md: "3rem",
        lg: "3.5rem",
        xl: "2rem",
      },
    },
  }
};
export default config;
