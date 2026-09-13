/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Cool Light / Sky" — bright, airy, photographic (Homy/Ayano direction).
        ink: "#14181B",        // near-black — text, buttons, footer
        paper: "#F5F7F8",      // cool near-white canvas
        "paper-2": "#ECEFF1",  // alt-section mist
        line: "#DCE1E4",       // cool hairline
        muted: "#5A646B",      // cool grey body (passes 4.5:1 on canvas)
        dark: "#14181B",       // footer
        // Single slate-blue accent. Kept under the `brass` name too so existing
        // refs recolor automatically.
        slate: { DEFAULT: "#456071", light: "#5B7B8C" },
        brass: { DEFAULT: "#456071", light: "#5B7B8C" },
        // Legacy tokens kept defined (mapped to neutral/slate) so stray refs can't break.
        aqua: { DEFAULT: "#456071", light: "#5B7B8C" },
        estate: { DEFAULT: "#2A333A", light: "#3C4853" },
        laterite: { DEFAULT: "#456071", deep: "#33485A" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "Inter", "sans-serif"],
        serif: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem" },
      letterSpacing: { tightest: "-0.03em" },
      boxShadow: {
        glass: "0 24px 60px rgba(20,24,27,0.10)",
        "glass-sm": "0 12px 32px rgba(20,24,27,0.08)",
        "glass-lift": "0 36px 90px rgba(20,24,27,0.18)",
        card: "0 20px 50px rgba(20,24,27,0.12)",
      },
    },
  },
  plugins: [],
}
