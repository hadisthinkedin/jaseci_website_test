import { Link } from "react-router-dom";
import { social } from "../lib/links.js";
import { GithubIcon, DiscordIcon, XIcon, LinkedinIcon } from "./icons.jsx";

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
      {children} ↗
    </a>
  );
}

const socials = [
  { Icon: GithubIcon, href: social.github, label: "GitHub" },
  { Icon: DiscordIcon, href: social.discord, label: "Discord" },
  { Icon: XIcon, href: social.x, label: "X" },
  { Icon: LinkedinIcon, href: social.linkedin, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black">
      {/* Columns */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold tracking-tight">Jaseci</p>
            <p className="mt-2 text-sm text-neutral-600">
              One language for your backend, frontend, and AI.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Resources</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Ext href="https://docs.jaseci.org/learn/tour/">Docs</Ext></li>
              <li><Ext href="https://jaseci.engin.umich.edu/">Research</Ext></li>
              <li><Ext href="https://blogs.jaseci.org/">Blog</Ext></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about-us" className="hover:underline">About Us</Link></li>
              <li><Link to="/built-with-jaseci" className="hover:underline">Built with Jaseci</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Community</p>
            <ul className="mt-3 space-y-2 text-sm">
              {socials.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Icon className="h-4 w-4" />
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar (dope-style, inverted) */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-4 text-xs md:flex-row md:justify-between">
          <p>© 2026 Jaseci. Open source.</p>
          <p>Made with ♥ in Ann Arbor, Michigan</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4">
              <a href={`${social.github}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                License
              </a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white hover:text-neutral-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
