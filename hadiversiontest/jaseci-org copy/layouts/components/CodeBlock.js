import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/components/prism-python';
import '../../lib/syntax/jacSyntax.css';
import { highlightJacCode } from '../../lib/syntax/syntaxHighlighting';

export const CodeBlock = ({
  code,
  language = 'bash',
  className = '',
  showLineNumbers = false
}) => {
  const [copied, setCopied] = useState(false);
  const [highlightedJac, setHighlightedJac] = useState('');
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (language === 'jac') {
      let isMounted = true;
      (async () => {
        const result = code ? await highlightJacCode(code.trim()) : '';
        if (isMounted) {
          setHighlightedJac(result);
          // Count actual lines in the original code
          setLineCount(code ? code.trim().split('\n').length : 0);
        }
      })();
      return () => { isMounted = false; };
    } else {
      setLineCount(code ? code.trim().split('\n').length : 0);
      Prism.highlightAll();
    }
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate line numbers array
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  if (language === 'jac') {
    // Use custom Jac syntax highlighting
    return (
      <div className={`relative group ${className}`}>
        <pre className="jac-code overflow-x-auto" style={{ margin: 0, padding: 0, background: 'transparent' }}>
          <code
            className="jac-code-block font-mono"
            style={{
              fontSize: '0.8rem',
              lineHeight: '1.4',
              display: 'block',
              padding: 0,
              margin: 0,
              background: 'transparent'
            }}
            dangerouslySetInnerHTML={{ __html: highlightedJac }}
          />
        </pre>
      </div>
    );
  }

  // Use PrismJS for Python and other languages
  return (
    <div className={`relative group ${className}`}>
      <pre 
        className="font-mono" 
        style={{ 
          margin: 0, 
          padding: 0, 
          background: 'transparent',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          overflow: 'visible',
          whiteSpace: 'pre'
        }}
      >
        <code 
          className={`language-${language} font-mono`}
          style={{
            fontSize: '0.8rem',
            lineHeight: '1.4',
            display: 'block',
            padding: 0,
            margin: 0,
            background: 'transparent',
            overflow: 'visible',
            whiteSpace: 'pre'
          }}
        >
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};