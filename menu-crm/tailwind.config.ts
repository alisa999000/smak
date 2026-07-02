import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        chip: "var(--chip)",
      },
      boxShadow: {
        card: "0 8px 28px rgba(26, 26, 26, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
