// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui")],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#21913F",
        // primary: "#27272A",
        secondary: "#3D4A3D",
        tertiary: "#015605",
        accent: "#3D4A3D",
        quaternary: "#005605",
        "dark-gray": "#27272A",
        "light-gray": "#525255",
        "custom-gray": "#7E8C8D",
        neutral: "#ffffff",
        "forest-green": {
          50: "#f1fcf3",
          100: "#dff9e5",
          200: "#c0f2cd",
          300: "#8fe6a6",
          400: "#57d177",
          500: "#30b754",
          600: "#21913f",
          700: "#1e7736",
          800: "#1d5e2f",
          900: "#194e29",
          950: "#092a14",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};