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
 * VS Code's current default theme is Dark Modern (replaced Dark+ as the
 * default in 2023). Dark Modern's theme JSON overrides only workbench
 * colors and inherits Dark+ for all syntax token colors. So we base on
 * Monaco's built-in `vs-dark` (Dark+ tokens) and override only the
 * editor.* workbench values with the exact Dark Modern hexes from
 * microsoft/vscode/extensions/theme-defaults/themes/dark_modern.json.
 *
 * The custom Jac token rules (orange sigil/gold by-llm overlay) used to
 * live here; they were a Jaseci embellishment, not Dark Modern, so this
 * function now leaves token rules empty so Jac renders with the same
 * defaults VS Code would use if it didn't know the language.
 */
export function defineJaseciTheme(monaco: any): void {
  monaco.editor.defineTheme("vs-dark-modern", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1F1F1F",
      "editor.foreground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorLineNumber.activeForeground": "#CCCCCC",
    },
  });
}
