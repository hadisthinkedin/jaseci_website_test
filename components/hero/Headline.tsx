/**
 * The page's single <h1>. The accent on "one" is purely visual — the
 * sentence reads correctly as plain text without styling.
 */
export default function Headline() {
  return (
    <h1 className="headline">
      Jac is <em className="headline__accent">one</em> language for backend,
      frontend, and AI.
    </h1>
  );
}
