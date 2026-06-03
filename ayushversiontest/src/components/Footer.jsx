import { Link } from "react-router-dom";

const columns = [
  {
    title: "Product",
    items: [
      { to: "/built-with-jaseci", label: "Built with Jaseci" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    items: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Community",
    items: [
      { to: "/community", label: "Community" },
      { to: "/community", label: "GitHub" },
      { to: "/community", label: "Discord" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold tracking-tight">Jaseci</p>
            <p className="mt-2 text-sm text-neutral-600">
              Skeleton build. Black & white.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-neutral-300 pt-6 text-xs text-neutral-600">
          © {2026} Jaseci. Skeleton — not the final design.
        </p>
      </div>
    </footer>
  );
}
