/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        header: "#fff9",
        body: "#fff6",
        "record-button-bg": "#860909",
        "download-button-bg": "#104275",
        "play-button-bg": "#0F4C01",
      },
      fontSize: {
        header: "22px",
        body: "14px",
      },
    },
  },
  plugins: [],
};
