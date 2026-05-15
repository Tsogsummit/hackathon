import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#183248",
          ink: "#10283A",
          blue: "#2563A9",
          sky: "#2BA7C9",
          red: "#ED1C24",
          pale: "#F3F7FA",
          line: "#D7E2EA",
          mist: "#EAF2F7"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 40, 58, 0.12)",
        crisp: "0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 12px 28px rgba(16, 40, 58, 0.10)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
