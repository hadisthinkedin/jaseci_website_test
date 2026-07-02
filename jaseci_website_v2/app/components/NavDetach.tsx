"use client";

import { useEffect } from "react";

/* Drives the floating-nav animation. Once the page scrolls past a few pixels
   it adds `nav-detached` to <html>; the CSS (see .navDock / .nav in
   page.module.css) then morphs the top bar from a flush, full-width strip
   into a centred, fully-bordered box that floats away from the top edge.
   Renders nothing — it only toggles the class — and syncs to the initial
   scroll position on mount (e.g. a reload partway down the page). */
export default function NavDetach() {
  useEffect(() => {
    const root = document.documentElement;
    let detached = false;

    const update = () => {
      const next = window.scrollY > 6;
      if (next !== detached) {
        detached = next;
        root.classList.toggle("nav-detached", next);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.classList.remove("nav-detached");
    };
  }, []);

  return null;
}
