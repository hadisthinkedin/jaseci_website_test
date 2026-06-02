"use client";

import Logo from "@components/Logo";
import menu from "@config/menu.json";
import SearchModal from "@layouts/partials/SearchModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

// Global cache to prevent multiple components from making simultaneous requests
let globalStatsCache = null;
let globalFetchPromise = null;

const Header = () => {

  const { main } = menu;
  const pathname = usePathname();

  const [searchModal, setSearchModal] = useState(false);
  const [stats, setStats] = useState({ stars: '--', forks: '--' });
  const [topBarHeight, setTopBarHeight] = useState(40);

  useEffect(() => {
    // Calculate top bar height dynamically
    const calculateTopBarHeight = () => {
      const topBar = document.querySelector('.top-bar');
      if (topBar) {
        const height = topBar.offsetHeight;
        setTopBarHeight(height);
      }
    };

    // Calculate on mount and on resize
    calculateTopBarHeight();
    window.addEventListener('resize', calculateTopBarHeight);

    return () => {
      window.removeEventListener('resize', calculateTopBarHeight);
    };
  }, []);

  useEffect(() => {
    // If we already have cached data, use it immediately
    if (globalStatsCache) {
      setStats({
        stars: globalStatsCache.stars ?? '--',
        forks: globalStatsCache.forks ?? '--',
      });
      return;
    }

    // If there's already a fetch in progress, wait for it
    if (globalFetchPromise) {
      globalFetchPromise.then((data) => {
        setStats({
          stars: data.stars ?? '--',
          forks: data.forks ?? '--',
        });
      }).catch(() => {
        setStats({ stars: '--', forks: '--' });
      });
      return;
    }

    // Start a new fetch
    globalFetchPromise = fetch('/api/github-stats')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => {
        globalStatsCache = data; // Cache the result globally
        setStats({
          stars: data.stars ?? '--',
          forks: data.forks ?? '--',
        });
        console.log('GitHub stats updated:', data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching GitHub stats:', error);
        setStats({ stars: '--', forks: '--' });
        throw error;
      })
      .finally(() => {
        globalFetchPromise = null; // Clear the promise
      });
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar w-full bg-dark-bg text-white text-xs sm:text-sm py-2 px-4 flex justify-center items-center fixed top-0 left-0 z-[101]">
        <div className="top-bar-content flex flex-col sm:flex-row w-full max-w-7xl items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-medium leading-tight">The Jac Programming Language and Jaseci Stack</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/jaseci-labs/jaseci" 
              className="flex items-center gap-2 hover:text-primary-orange transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>GitHub</span>
              <span className="text-xs opacity-80">
                ⭐ {stats.stars} 🍴 {stats.forks}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className="w-full z-50 fixed transition-all duration-300"
        style={{ top: `${topBarHeight}px` }}
      >
        <nav className="container max-w-7xl mx-auto px-3 py-3 rounded-2xl transition-all duration-300 bg-medium-bg/45 backdrop-blur-md shadow-xl border border-light-bg/30">
          <div className="flex items-center justify-between">
            {/* Left section - Logo and Brand */}
            <div className="flex items-center gap-3">
              <Logo />
              <Link href="/" className="hidden sm:block text-lg font-semibold text-white hover:opacity-80 transition-opacity duration-200">
                Jac & Jaseci
              </Link>
            </div>

            {/* Center section - Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-1">
              {main.map((menuItem, i) => (
                <React.Fragment key={`menu-${i}`}>
                  {menuItem.hasChildren ? (
                    <li className="relative group">
                      <button className="flex items-center gap-1 px-4 py-2 text-dark-text hover:text-white transition-colors duration-200 rounded-full whitespace-nowrap">
                        {menuItem.name}
                        <svg className="h-4 w-4 fill-current transition-transform group-hover:rotate-180" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </button>
                      <ul className="absolute top-full left-0 mt-2 py-2 bg-medium-bg/95 backdrop-blur-md rounded-xl border border-light-bg/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                        {menuItem.children?.map((child, j) => (
                          <li key={`children-${j}`}>
                            <Link
                              href={child.url}
                              className="block px-4 py-2 text-dark-text hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-lg mx-2"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      {menuItem.target ? (
                        <a
                          href={menuItem.url}
                          target={menuItem.target}
                          rel={menuItem.rel}
                          className={`block px-4 py-2 transition-all duration-200 rounded-full whitespace-nowrap ${
                            pathname === menuItem.url
                              ? "bg-primary-orange text-white"
                              : "text-dark-text hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {menuItem.name}
                        </a>
                      ) : (
                        <Link
                          href={menuItem.url}
                          className={`block px-4 py-2 transition-all duration-200 rounded-full whitespace-nowrap ${
                            pathname === menuItem.url
                              ? "bg-primary-orange text-white"
                              : "text-dark-text hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {menuItem.name}
                        </Link>
                      )}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>

            {/* Right section - Search and Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchModal(true)}
                className="p-2 text-dark-text hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                aria-label="Open search"
              >
                <IoSearch className="h-5 w-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <input id="nav-toggle" type="checkbox" className="hidden peer" />
                <label
                  htmlFor="nav-toggle"
                  className="flex flex-col cursor-pointer p-2 peer-checked:hidden"
                  aria-label="Open menu"
                >
                  <span className="w-6 h-0.5 bg-white mb-1 transition-all"></span>
                  <span className="w-6 h-0.5 bg-white mb-1 transition-all"></span>
                  <span className="w-6 h-0.5 bg-white transition-all"></span>
                </label>
                <label
                  htmlFor="nav-toggle"
                  className="hidden peer-checked:flex cursor-pointer p-2"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </label>

                {/* Mobile Menu */}
                <div className="absolute top-full right-0 mt-2 w-64 py-4 bg-medium-bg/95 backdrop-blur-md rounded-xl border border-light-bg/50 shadow-xl opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-200">
                  <ul className="space-y-1 px-2">
                    {main.map((menuItem, i) => (
                      <li key={`mobile-menu-${i}`}>
                        {menuItem.target ? (
                          <a
                            href={menuItem.url}
                            target={menuItem.target}
                            rel={menuItem.rel}
                            className="block px-4 py-3 text-dark-text hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {menuItem.name}
                          </a>
                        ) : (
                          <Link
                            href={menuItem.url}
                            className="block px-4 py-3 text-dark-text hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {menuItem.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <SearchModal searchModal={searchModal} setSearchModal={setSearchModal} />
    </>
  );
};

export default Header;
