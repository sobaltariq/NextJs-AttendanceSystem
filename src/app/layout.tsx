import type { Metadata } from "next";
import localFont from "next/font/local";
import "./../styles/global_style.scss";
import AllDataWrapper from "./AllDataWrapper";
import chillaxFont from ".././fonts/chillaxFont";
import { Providers } from "@/redux/Providers";
import { MessageModalProvider } from "@/components/modal/providers/MessageModalProvider";

export const metadata: Metadata = {
  title: "Attendance System",
  description: "Attendance System app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chillaxFont.variable}`}>
        <Providers>
          <MessageModalProvider>
            <AllDataWrapper>{children}</AllDataWrapper>
          </MessageModalProvider>
        </Providers>
      </body>
    </html>
  );
}

// npm i sass
// npm i axios
// npm install formik
// npm i yup
// npm i socket.io-client
// npm install react-icons --save
// npm install @reduxjs/toolkit react-redux
