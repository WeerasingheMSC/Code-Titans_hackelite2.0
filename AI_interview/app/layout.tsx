import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSync - AI Interview Platform",
  description: "An AI-powered platform for preparing for mock interviews and skill development",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${monaSans.className} antialiased pattern`}>
        {/* Floating lines overlay for both horizontal and vertical movement */}
        <div className="floating-lines">
          {/* Horizontal floating lines */}
          <div className="floating-line-horizontal" />
          <div className="floating-line-horizontal" />
          <div className="floating-line-horizontal" />
          <div className="floating-line-horizontal" />
          <div className="floating-line-horizontal" />
          
          {/* Vertical floating lines */}
          <div className="floating-line-vertical" />
          <div className="floating-line-vertical" />
          <div className="floating-line-vertical" />
          <div className="floating-line-vertical" />
          <div className="floating-line-vertical" />
        </div>
        
        {children}

        <Toaster />
      </body>
    </html>
  );
}