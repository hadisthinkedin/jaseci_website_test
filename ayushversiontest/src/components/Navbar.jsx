import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/about", label: "About" },
  { to: "/community", label: "Community" },
  { to: "/built-with-jaseci", label: "Built with Jaseci" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-black bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Jaseci
        </Link>
        <ul className="flex flex-wrap gap-4 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? "font-bold underline" : "hover:underline"
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
