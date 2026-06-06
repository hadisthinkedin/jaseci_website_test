import { useState } from "react";
import { Link } from "react-router-dom";
import { hero, social, docs } from "../lib/links.js";
import { GithubIcon, DiscordIcon, LinkedinIcon, XIcon } from "./icons.jsx";

const products = [
  { name: "JacCoder", desc: "AI coding agent for Jac.", url: hero.jacCoder },
  { name: "JacBuilder", desc: "Visual studio for building with Jac.", url: hero.jacBuilder },
  { name: "jac-client", desc: "Full stack apps in one file.", url: docs.jacClientRef },
  { name: "jac-scale", desc: "Laptop to cloud, no config.", url: docs.jacScaleRef },
  { name: "byLLM", desc: "AI without the prompt wrangling.", url: docs.byllm },
];

const resources = [
  { name: "Docs", url: "https://docs.jaseci.org/learn/tour/" },
  { name: "Handbook", url: docs.langFoundation },
  { name: "Quick guide", url: hero.docs },
  { name: "Blog", url: "https://blogs.jaseci.org/" },
  { name: "Research", url: "https://jaseci.engin.umich.edu/" },
  { name: "GitHub", url: social.github },
  { name: "Discord", url: social.discord },
];

const community = [
  { name: "GitHub", desc: "Source, issues, and contributions.", url: social.github, Icon: GithubIcon },
  { name: "Discord", desc: "Chat with us in real time.", url: social.discord, Icon: DiscordIcon },
  { name: "LinkedIn", desc: "Company updates and news.", url: social.linkedin, Icon: LinkedinIcon },
  { name: "X / Twitter", desc: "Announcements and highlights.", url: social.x, Icon: XIcon },
];

const pages = [
  { name: "About", url: "/about-us" },
  { name: "Built with Jaseci", url: "/built-with-jaseci" },
];

function Dropdown({ label, items }) {
  return (
    <li className="group relative">
      <button className="flex items-center gap-1 py-2 hover:underline">
        {label}
        <span className="text-[10px] transition-transform duration-150 group-hover:rotate-180">
          ▾
        </span>
      </button>
      <div className="invisible absolute left-0 top-full z-20 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="w-72 divide-y divide-neutral-200 border border-black bg-white">
          {items.map((it) => {
            const Icon = it.Icon;
            const body = (
              <span className="flex items-start gap-3">
                {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>
                  <span className="block text-sm font-medium">
                    {it.name}
                    {!it.internal && " ↗"}
                  </span>
                  {it.desc && (
                    <span className="mt-0.5 block text-xs text-neutral-600">{it.desc}</span>
                  )}
                </span>
              </span>
            );
            return (
              <li key={it.name}>
                {it.internal ? (
                  <Link to={it.url} className="block px-4 py-3 hover:bg-neutral-100">
                    {body}
                  </Link>
                ) : (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 hover:bg-neutral-100"
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight" onClick={close}>
          Jaseci
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-6 text-sm lg:flex">
          <Dropdown label="Tools" items={products} />
          <Dropdown label="Resources" items={resources} />
          <Dropdown label="Community" items={community} />
          {pages.map((p) => (
            <li key={p.name}>
              <Link to={p.url} className="hover:underline">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-black hover:text-neutral-500"
          >
            <GithubIcon />
          </a>
          <a
            href={hero.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
          >
            Get started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="border border-black px-3 py-1.5 text-sm font-medium lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black bg-white lg:hidden">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <MobileSection title="Tools" items={products} onNavigate={close} />
            <MobileSection title="Resources" items={resources} onNavigate={close} />
            <MobileSection title="Community" items={community} onNavigate={close} />
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-neutral-500">
              Pages
            </p>
            <ul className="mt-2 space-y-2">
              {pages.map((p) => (
                <li key={p.name}>
                  <Link to={p.url} onClick={close} className="hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
              >
                GitHub ↗
              </a>
              <a
                href={hero.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileSection({ title, items, onNavigate }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((it) => {
          const Icon = it.Icon;
          return (
            <li key={it.name}>
              {it.internal ? (
                <Link to={it.url} onClick={onNavigate} className="flex items-center gap-2 hover:underline">
                  {Icon && <Icon className="h-4 w-4" />}
                  {it.name}
                </Link>
              ) : (
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {it.name} ↗
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
