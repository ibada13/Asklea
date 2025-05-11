'use client'
import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "react-redux";

import NavBar from "./NavBar";
import { store } from "./state/store";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" />
            </head>
      <body
        className={` antialiased text-text p-3 bg-background flex flex-col gap-y-5`}
      >
        <Provider store={store}>

        <NavBar />
        {children}
        </Provider>
      </body>
    </html>
  );
}
