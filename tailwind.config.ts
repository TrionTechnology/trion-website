import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
          colors: {
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            card: {
              DEFAULT: "hsl(var(--card))",
              foreground: "hsl(var(--card-foreground))",
            },
            popover: {
              DEFAULT: "hsl(var(--popover))",
              foreground: "hsl(var(--popover-foreground))",
            },
            primary: {
              DEFAULT: "hsl(var(--primary))",
              foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
              DEFAULT: "hsl(var(--secondary))",
              foreground: "hsl(var(--secondary-foreground))",
            },
            muted: {
              DEFAULT: "hsl(var(--muted))",
              foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
              DEFAULT: "hsl(var(--accent))",
              foreground: "hsl(var(--accent-foreground))",
            },
            destructive: {
              DEFAULT: "hsl(var(--destructive))",
              foreground: "hsl(var(--destructive-foreground))",
            },
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            chart: {
              "1": "hsl(var(--chart-1))",
              "2": "hsl(var(--chart-2))",
              "3": "hsl(var(--chart-3))",
              "4": "hsl(var(--chart-4))",
              "5": "hsl(var(--chart-5))",
            },
            // Trion brand color palette (matching logo)
            trion: {
              50: "#f0fdfa",
              100: "#ccfbf1",
              200: "#99f6e4",
              300: "#5eead4",
              400: "#2dd4bf",
              500: "#14b8a6",
              600: "#0d9488",
              700: "#0f766e",
              800: "#115e59",
              900: "#134e4a",
            },
            // Teal accent colors
            teal: {
              50: "#f0fdfa",
              100: "#ccfbf1",
              200: "#99f6e4",
              300: "#5eead4",
              400: "#2dd4bf",
              500: "#14b8a6",
              600: "#0d9488",
              700: "#0f766e",
              800: "#115e59",
              900: "#134e4a",
            },
            jet: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0A0A0A",
            },
            // Custom gold colors - more white/off-white
            gold: {
              50: "#fefefe",
              100: "#fdfdfd",
              200: "#fafafa",
              300: "#f7f7f7",
              400: "#f0f0f0",
              500: "#e8e8e8", // Main gold color - off-white
              600: "#d8d8d8",
              700: "#c8c8c8",
              800: "#b8b8b8",
              900: "#a8a8a8",
            },
          },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "gradient": "gradient 8s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          },
        },
      },
          backgroundImage: {
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            "trion-gradient": "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #5eead4 100%)",
            "teal-gradient": "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)",
            "futuristic-gradient": "linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #0A0A0A 100%)",
            "cyber-gradient": "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #14b8a6 100%)",
            "dark-gradient": "linear-gradient(135deg, #000000 0%, #0A0A0A 100%)",
          },
          boxShadow: {
            "trion": "0 0 20px rgba(20, 184, 166, 0.3)",
            "trion-lg": "0 0 40px rgba(20, 184, 166, 0.4)",
            "teal-glow": "0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(45, 212, 191, 0.1)",
            "teal-glow-lg": "0 0 40px rgba(20, 184, 166, 0.4), 0 0 60px rgba(45, 212, 191, 0.2)",
            "cyber-glow": "0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(45, 212, 191, 0.1)",
            "cyber-glow-lg": "0 0 40px rgba(20, 184, 166, 0.4), 0 0 60px rgba(45, 212, 191, 0.2)",
            "dark": "0 10px 25px rgba(0, 0, 0, 0.5)",
            "dark-lg": "0 20px 40px rgba(0, 0, 0, 0.6)",
            "futuristic": "0 0 30px rgba(20, 184, 166, 0.2), 0 0 60px rgba(0, 0, 0, 0.3)",
          },
    },
  },
  plugins: [],
};

export default config;
