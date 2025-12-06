import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#003CC0",        // สีน้ำเงินเข้ม
          "primary-focus": "#002A99",  // สีน้ำเงินเข้มกว่า
          "primary-content": "#ffffff", // ขาว
          "secondary": "#6689DA",      
          "accent": "#E5EBF9",
          "neutral": "#2b3440",
          "base-100": "#FDFDFD",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "dark", // เก็บ dark theme ไว้ในกรณีที่ต้องการใช้ภายหลัง
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}

export default config
