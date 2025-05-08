import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Care",
  description: "this app was made by nextjs and tailwind and chart.js",
};
import NavBar from "./NavBar";
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
        <NavBar />
        {children}
      </body>
    </html>
  );
}
