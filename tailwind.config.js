/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      width: {
        128: "32rem", // You can adjust the value as needed
      },
    },
  },
  plugins: [],
};
