"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const SearchModal = ({ searchModal, setSearchModal }) => {
  const router = useRouter();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (searchModal) {
      document.getElementById("searchModal")?.focus();
      // Prevent background scroll while modal is open
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          router.push(`/search?key=${encodeURIComponent(input)}`);
          setSearchModal(false);
        }
        if (e.key === "Escape") {
          setSearchModal(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [searchModal, input, router, setSearchModal]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={`search-modal ${searchModal ? "open" : ""}`}
      onClick={() => setSearchModal(false)}
    >
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Close search"
          onClick={() => setSearchModal(false)}
          className="search-close"
        >
          <IoCloseCircleOutline />
        </button>
        <input
          type="text"
          className="form-input"
          id="searchModal"
          placeholder="Search posts, tags, authors…"
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default SearchModal;
