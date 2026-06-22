# Circular font (Supabase's brand typeface)

Circular is a **commercial, licensed** font from Lineto (https://lineto.com). It is
**not** included in this repo and cannot be — you must own a license and supply the
files yourself.

The `@font-face` rules in `app/globals.css` expect these exact files in **this folder**
(`/public/fonts/`), all in **woff2** format:

| File                    | Weight | Circular cut |
| ----------------------- | ------ | ------------ |
| `circular-book.woff2`   | 400    | Book         |
| `circular-medium.woff2` | 500    | Medium       |
| `circular-bold.woff2`   | 700    | Bold         |

## How to install

1. Get the licensed Circular `.woff2` files (or convert your `.otf`/`.ttf` cuts to
   woff2, e.g. with https://transfonts.org or `fonttools`).
2. Rename them to match the table above and place them in this folder.
3. Restart the dev server. Text now renders in Circular automatically — no code change.

Until the files are present, the browser falls back to **Geist** (the next font in
`--font-sans`), so the site looks exactly as it did before. You'll just see harmless
404s for the missing font files in the console.

### Different weights / italics?

Add or edit the matching `@font-face` block in `app/globals.css`. Each block maps one
file to one `font-weight`/`font-style`, so to add e.g. Black (900) or italics, copy a
block, point `src` at the new file, and set the weight/style.
