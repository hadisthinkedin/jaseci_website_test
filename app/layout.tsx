import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaseci — one language for backend, frontend, and AI",
  description:
    "Jac is one language for backend, frontend, and AI. Replaces Python, JavaScript, and C/Zig/Rust with full PyPI, npm, and C-ABI access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
