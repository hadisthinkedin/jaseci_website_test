"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Jac language registration for Monaco. Uses Monarch (Monaco's native
 * grammar format) since Monaco can't load TextMate JSON directly. Covers
 * the distinctive Jac constructs the design calls out — node/walker/enum,
 * def variants, `by llm()`, the graph sigils, [root-->] / [?:Type].
 */
export function registerJacLanguage(monaco: any): void {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === "jac")) {
    return;
  }

  monaco.languages.register({ id: "jac", extensions: [".jac"] });

  monaco.languages.setMonarchTokensProvider("jac", {
    defaultToken: "",
    tokenPostfix: ".jac",

    keywords: [
      "node", "edge", "walker", "obj", "enum", "has", "can", "sem",
      "import", "from", "as", "async", "await", "return", "lambda",
      "for", "if", "else", "elif", "try", "except", "finally",
      "in", "not", "and", "or", "is",
      "True", "False", "None", "null",
      "report", "print", "with", "entry",
    ],

    builtinTypes: [
      "str", "int", "float", "bool", "list", "dict", "set", "tuple",
      "type", "Exception", "JsxElement", "ChangeEvent", "KeyboardEvent",
    ],

    operators: [
      "++>", "-->", "<++", "<--",
      "==", "!=", "<=", ">=", "<", ">",
      "=", "+", "-", "*", "/", "%",
    ],

    symbols: /[=><!~?:&|+\-*/^%]+/,

    tokenizer: {
      root: [
        // 'by llm()' — distinctive payoff token
        [/\bby\s+llm\b/, "keyword.special"],

        // def variants (must come before generic keyword matcher)
        [/\bdef\s*:\s*(pub|priv)\b/, "keyword.def"],
        [/\b(cl|na)\s+def(?:\s*:\s*(pub|priv))?\b/, "keyword.def"],
        [/\bdef\b/, "keyword.def"],

        // 'with entry'
        [/\bwith\s+entry\b/, "keyword"],

        // Graph sigils
        [/\+\+>|<\+\+|-->|<--/, "operator.sigil"],

        // [root-->], [root-->][?:Type], etc.
        [/\[\s*root[^\]]*\]/, "type.special"],
        [/\[\s*\?\s*:\s*\w+\s*\]/, "type.special"],

        // Identifiers / keywords / builtin types
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@builtinTypes": "type",
              "@default": "identifier",
            },
          },
        ],

        // Strings
        [/"([^"\\]|\\.)*"/, "string"],
        [/'([^'\\]|\\.)*'/, "string"],

        // Numbers
        [/\d+\.\d+/, "number.float"],
        [/\d+/, "number"],

        // Comments
        [/#.*$/, "comment"],

        // Whitespace
        [/[\s\t\r\n]+/, "white"],

        // Brackets + delimiters
        [/[{}()[\]]/, "@brackets"],
        [/[,;.]/, "delimiter"],

        // Operators (after sigils so sigils win)
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "",
            },
          },
        ],
      ],
    },
  });
}

/**
 * A dark theme tuned to the design system: `--code-bg #0a0a0a` background,
 * `--code-text #f3efe6` foreground, `--accent #ee5a24` accent for the Jac
 * graph sigils and `by llm()` highlight.
 */
export function defineJaseciTheme(monaco: any): void {
  monaco.editor.defineTheme("jaseci-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.def", foreground: "569cd6", fontStyle: "bold" },
      { token: "keyword.special", foreground: "f4a93c", fontStyle: "bold" },
      { token: "operator.sigil", foreground: "ee5a24", fontStyle: "bold" },
      { token: "type.special", foreground: "4ec9b0" },
    ],
    colors: {
      "editor.background": "#0a0a0a",
      "editor.foreground": "#f3efe6",
      // VS Code Dark+ defaults for line numbers (muted gray, active brighter)
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
      "editor.lineHighlightBackground": "#141414",
      "editor.lineHighlightBorder": "#14141400",
      "editorGutter.background": "#0a0a0a",
      "editorCursor.foreground": "#f3efe6",
      "scrollbarSlider.background": "#3a3a3a55",
      "scrollbarSlider.hoverBackground": "#5a5a5a55",
      "scrollbarSlider.activeBackground": "#7a7a7a55",
    },
  });
}
