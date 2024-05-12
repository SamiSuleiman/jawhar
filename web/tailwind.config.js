/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import tailwindscrollbar from "tailwind-scrollbar";

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, tailwindscrollbar],
  daisyui: {
    themes: ["retro", "coffee"],
  },
};
