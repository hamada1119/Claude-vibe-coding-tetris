import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tetris Game",
  description: "Classic Tetris game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
