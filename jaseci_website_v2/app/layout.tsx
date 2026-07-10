import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jac — The solution to 50 years of developer's hell",
  description:
    "Jac is the programming language built to program AI. Applications. Agents. Workflows. Everything AI.",
};

// Runs before anything paints (parser-blocking, first thing in <body>) so a
// returning dark-mode visitor never flashes white: saved choice first, then
// the OS preference. ThemeToggle (in the nav) flips data-theme + this key.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("jac-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme script mutates data-theme on <html>
    // before React hydrates, which is an expected server/client mismatch
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {/*
          Adobe Fonts — Mr Eaves XL Sans (the paragraph face; see --font-body in
          globals.css). It's licensed, so it loads only through YOUR Adobe
          web-project kit — there is no public URL to import:
            1. fonts.adobe.com → "Create a Web Project", add "Mr Eaves XL Sans"
            2. copy the kit id, then uncomment the <link> below and paste it in
            3. make sure the family name your kit shows matches "mr-eaves-xl-sans"
               in --font-body (adjust either side if Adobe names it differently)
          Until the kit is live, paragraphs fall back to the current sans — no
          visual change. React 19 hoists this <link> into <head> automatically.
        */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" /> */}
        {children}
      </body>
    </html>
  );
}
