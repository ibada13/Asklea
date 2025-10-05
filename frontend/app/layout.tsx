'use client'
import AuthProvider from "./state/AuthProvider";
import "./globals.css"


import Toast from "./Toast";

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

        <Toast/>
        <AuthProvider>

      
        {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
