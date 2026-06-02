import { createHighlighter, type Highlighter, type LanguageRegistration } from "shiki";

import jacGrammar from "./jac.tmLanguage.json";

export type SupportedLang = "python" | "tsx" | "css" | "jac";

const THEME = "dark-plus";

let _hl: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!_hl) {
    _hl = createHighlighter({
      themes: [THEME],
      langs: [
        "python",
        "tsx",
        "css",
        { ...(jacGrammar as unknown as LanguageRegistration), name: "jac" },
      ],
    });
  }
  return _hl;
}

export async function highlight(code: string, lang: SupportedLang): Promise<string> {
  const hl = await getHighlighter();
  const html = hl.codeToHtml(code, { lang, theme: THEME });
  return stripPreBackground(html);
}

function stripPreBackground(html: string): string {
  return html.replace(
    /(<pre\b[^>]*\sstyle=")([^"]*)(")/i,
    (_m, open, style, close) => {
      const cleaned = style
        .replace(/(?:^|;)\s*background-color\s*:[^;]*/gi, "")
        .replace(/(?:^|;)\s*background\s*:[^;]*/gi, "")
        .replace(/^;+/, "")
        .replace(/;{2,}/g, ";")
        .trim();
      return `${open}${cleaned}${close}`;
    },
  );
}
