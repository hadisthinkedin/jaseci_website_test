import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css"; // Or your preferred theme

export const useSyntaxHighlighting = (dependencies = []) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      // Find all code blocks within the ref
      const blocks = codeRef.current.querySelectorAll("pre code");
      blocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
    // Using a proper dependency array (not referencing .current directly)
  }, [dependencies]);

  return codeRef;
};
