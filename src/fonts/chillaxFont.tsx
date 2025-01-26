import localFont from "next/font/local";

const chillaxFont = localFont({
  src: [
    { path: "./chillax/Chillax-Extralight.woff2", weight: "200" },
    { path: "./chillax/Chillax-Regular.woff2", weight: "400" },
    { path: "./chillax/Chillax-Light.woff2", weight: "300" },
    { path: "./chillax/Chillax-Medium.woff2", weight: "500" },
    { path: "./chillax/Chillax-Semibold.woff2", weight: "600" },
  ],
  variable: "--chillax-font",
  display: "swap",
});

export default chillaxFont;
