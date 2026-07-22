/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { paper: "#f5f0e6", paper2: "#efe7d6", ink: "#141414",
      brand: { orange:"#ff5c2b", yellow:"#ffd23f", blue:"#2b4bff", green:"#12b886", pink:"#ff7eb6" } },
    boxShadow: { hard: "4px 4px 0 #141414", hard2: "6px 6px 0 #141414" },
    borderWidth: { 3: "3px" },
  }},
};
