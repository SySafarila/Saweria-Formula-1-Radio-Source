/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts}", "./dist/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        ferrari: "#e80020",
        mercedes: "#27f4d2",
        redbull: "#3671c6",
        mclaren: "#ff8000",
        "aston-martin": "#229971",
        haas: "#b6babd",
        rb: "#6692ff",
        williams: "#64c4ff",
        alpine: "#0093cc",
        sauber: "#00E701",
      },
    },
  },
  plugins: [],
};
