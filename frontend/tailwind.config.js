/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7F5",
        ink: "#0D0D0C",
        rust: "#A63D22",
        line: "#D9D9D6",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ["Outfit", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};

