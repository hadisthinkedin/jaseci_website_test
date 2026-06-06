import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Cascadia_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const cascadiaMono = Cascadia_Mono({
  variable: "--font-cascadia-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jac — the AI-native programming language | Jaseci",
  description:
    "Jac is an AI-native programming language for full-stack apps — backend, frontend, and AI in one file. Built by Jaseci Labs, powered by the Jaseci runtime. Full PyPI, npm, and C-ABI access; deploys to Kubernetes with one flag.",
  keywords: [
    "Jac",
    "Jac language",
    "Jac programming language",
    "AI-native programming language",
    "Jaseci",
    "Jaseci Jac",
    "full-stack AI programming language",
    "by llm()",
    "Jaseci Labs",
  ],
  openGraph: {
    title: "Jac — the AI-native programming language",
    description:
      "One file. Backend, frontend, AI. Built by Jaseci Labs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${cascadiaMono.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
