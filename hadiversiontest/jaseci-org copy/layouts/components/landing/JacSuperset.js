"use client";

import React, { useState, useEffect, useRef } from "react";
import { CodeBlock } from "../CodeBlock";

const CompilationDiagram = ({ isVisible }) => {
  const outputs = [
    {
      label: "Pure Python",
      sublabel: "Full PyPI Access",
      color: "from-blue-500 to-blue-400",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
    },
    {
      label: "Pure JavaScript",
      sublabel: "Full npm Access",
      color: "from-yellow-500 to-yellow-400",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      glowColor: "shadow-yellow-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.086.567.326.733.696.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.986.366-1.262.718-.869 1.028-.616 2.834.427 3.576 1.029.784 2.538.955 2.73 1.692.186.879-.652 1.162-1.475 1.058-.608-.116-.939-.451-1.304-.979l-1.372.788c.164.33.352.472.638.79 1.374 1.374 4.812 1.303 5.427-1.024.021-.067.18-.553.069-1.148zM13.356 13.025H11.83v4.155c0 .884.046 1.695-.091 1.943-.224.461-.808.399-1.072.315-.271-.136-.405-.326-.566-.586-.045-.078-.079-.136-.113-.17l-1.373.84c.229.471.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.167 1.092-.508 1.36-1.013.384-.676.3-1.506.3-2.428l.009-4.497z"/>
        </svg>
      ),
    },
    {
      label: "Pure Machine Code",
      sublabel: "C-ABI Compatible",
      color: "from-emerald-500 to-emerald-400",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      glowColor: "shadow-emerald-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M9 3v1H4v2h1v11a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z" opacity="0"/>
          <path d="M15 9H9a1 1 0 01-1-1V4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1zm-5-2h4V5h-4v2zM20 21H4a1 1 0 01-1-1v-4a1 1 0 011-1h16a1 1 0 011 1v4a1 1 0 01-1 1zm-15-2h14v-2H5v2zM15 14H9a1 1 0 01-1-1v-2a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1zm-5-2h4v0h-4v0z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col items-center gap-6 py-4">
      {/* Jac Source Node */}
      <div
        className="relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.6s ease-out 0.3s',
        }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-orange via-primary-yellow to-primary-orange rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-dark-bg via-medium-bg to-dark-bg border border-primary-orange/50 rounded-2xl px-8 py-5 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-orange to-primary-yellow bg-clip-text text-transparent mb-1">
              .jac
            </div>
            <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">
              Write Once
            </div>
          </div>
        </div>
      </div>

      {/* Arrow down from Jac to Compiler */}
      <div
        className="flex flex-col items-center gap-0"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-out 0.6s',
        }}
      >
        <div className="w-px h-6 bg-gradient-to-b from-primary-orange/80 to-primary-orange/40"></div>
        <svg className="w-3 h-3 text-primary-orange/60" viewBox="0 0 12 8" fill="currentColor">
          <path d="M6 8L0 0h12z"/>
        </svg>
      </div>

      {/* Compiler Node */}
      <div
        className="relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.5s ease-out 0.7s',
        }}
      >
        <div className="bg-gradient-to-br from-medium-bg to-dark-bg border border-light-bg/40 rounded-xl px-6 py-3 text-center">
          <div className="text-sm font-semibold text-white/90 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Jac Compiler
          </div>
        </div>
      </div>

      {/* Branching arrows */}
      <div
        className="relative w-full max-w-sm"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-out 0.9s',
        }}
      >
        <svg className="w-full h-12" viewBox="0 0 300 48" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Center line down */}
          <line x1="150" y1="0" x2="150" y2="12" stroke="url(#arrowGrad)" strokeWidth="1.5"/>
          {/* Horizontal bar */}
          <line x1="42" y1="12" x2="258" y2="12" stroke="url(#arrowGradH)" strokeWidth="1.5"/>
          {/* Left line down */}
          <line x1="42" y1="12" x2="42" y2="40" stroke="url(#arrowGradBlue)" strokeWidth="1.5"/>
          <polygon points="42,48 38,40 46,40" fill="#60a5fa" opacity="0.7"/>
          {/* Center line down */}
          <line x1="150" y1="12" x2="150" y2="40" stroke="url(#arrowGradYellow)" strokeWidth="1.5"/>
          <polygon points="150,48 146,40 154,40" fill="#facc15" opacity="0.7"/>
          {/* Right line down */}
          <line x1="258" y1="12" x2="258" y2="40" stroke="url(#arrowGradGreen)" strokeWidth="1.5"/>
          <polygon points="258,48 254,40 262,40" fill="#34d399" opacity="0.7"/>
          <defs>
            <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="arrowGradH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5"/>
              <stop offset="50%" stopColor="#ff6b35" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.5"/>
            </linearGradient>
            <linearGradient id="arrowGradBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="arrowGradYellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#facc15" stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="arrowGradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Output Targets */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
        {outputs.map((output, index) => (
          <div
            key={index}
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.5s ease-out ${1.0 + index * 0.15}s`,
            }}
          >
            <div className={`group bg-gradient-to-br from-dark-bg/95 to-medium-bg/80 border ${output.borderColor} rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg ${output.glowColor} h-full flex flex-col items-center justify-center gap-2`}>
              <div className={`${output.textColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {output.icon}
              </div>
              <div>
                <div className={`text-xs sm:text-sm font-bold ${output.textColor}`}>
                  {output.label}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  {output.sublabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JacSuperset = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const PythonInJacCode = `
import math; #import python libraries
import from random { uniform } #import specific functions

with entry{
  value =  math.pi * uniform(0, 10);
  print(value);
}
`;

  const NpmInJacCode = `
cl import from '@mui/material' { Button, TextField }

cl {
  def app() -> any {
    has count: int = 0;  # Auto becomes useState!

    return (
      <div>
        <TextField label="Count" value={count} />
        <Button onClick={lambda -> None { count += 1; }}>
          Increment
        </Button>
      </div>
    );
  }
}
`;

  // --- Animation Logic ---
  const ANIMATION_DURATION = '0.9s';
  const TRANSLATION_Y = '30px';

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Helper function for staggered entry animation
  const getChildAnimationStyle = (delayMultiplier) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${TRANSLATION_Y})`,
    transition: `opacity ${ANIMATION_DURATION} ease-out ${delayMultiplier}s, transform ${ANIMATION_DURATION} ease-out ${delayMultiplier}s`,
  });

  const getHeaderAnimationStyle = isVisible
    ? { animation: `fadeInUp ${ANIMATION_DURATION} ease-out both` }
    : { opacity: 0, transform: `translateY(${TRANSLATION_Y})` };

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-medium-bg via-dark-bg to-dark-bg relative overflow-hidden"
      ref={sectionRef} // Attach ref here
    >
      <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
        <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-24 w-80 h-80 bg-gradient-to-br from-primary-orange via-primary-yellow to-amber-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full blur-2xl animate-blob-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Stagger 0s */}
        <div
          className="text-center mb-12 sm:mb-14 lg:mb-16"
          style={getHeaderAnimationStyle}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-primary-orange to-primary-yellow bg-clip-text text-transparent">
            Jac Replaces Python, JavaScript & C/Zig/Rust
          </h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent mx-auto w-32 mb-5"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            One language that generates pure <span className="text-blue-400 font-medium">Python</span>, pure <span className="text-yellow-400 font-medium">JavaScript</span>, and pure <span className="text-emerald-400 font-medium">machine code</span>
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {/* Mobile Diagram Block - Stagger 0.2s */}
          <div
            className="lg:hidden"
            style={getChildAnimationStyle(0.2)}
          >
            <div className="bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-light-bg/30 p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:border-primary-orange/40 transition-all duration-300 mx-2 sm:mx-0">
              <CompilationDiagram isVisible={isVisible} />
            </div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Desktop Left Column (Diagram) - Stagger 0.2s */}
            <div
              className="relative"
              style={getChildAnimationStyle(0.2)}
            >
              <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-light-bg/30 p-8 shadow-card hover:shadow-card-hover hover:border-primary-orange/40 transition-all duration-300 hover:scale-[1.02]">
                <CompilationDiagram isVisible={isVisible} />
              </div>

              <div className="bg-gradient-to-r from-primary-orange/15 to-primary-yellow/15 backdrop-blur-md rounded-2xl border border-primary-orange/30 p-6 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 mt-6">
                <div className="text-center">
                  <h3 className="text-primary-orange font-bold text-xl mb-3">
                    Write Once, Run Everywhere
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Jac compiles to pure Python, pure JavaScript, and pure machine code. Import any PyPI package, any npm package, or link with any C-ABI library — all from a single language.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Right Column (Code Examples) - Stagger 0.4s */}
            <div
              className="space-y-6"
              style={getChildAnimationStyle(0.4)}
            >
              <div className="space-y-4">
                <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-card hover:shadow-card-hover hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-2 flex-shrink-0 group-hover:shadow-glow-sm group-hover:shadow-blue-500/50 transition-all duration-300"></div>
                    <div className="w-full min-w-0">
                      <h3 className="text-blue-400 font-bold text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300">Use Any Python Library (PyPI)</h3>
                      <div className="overflow-x-auto overflow-y-auto max-h-64 rounded-xl border border-gray-700/50 bg-black/20">
                        <div className="min-w-max p-4">
                          <CodeBlock
                            code={PythonInJacCode}
                            language="jac"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-yellow-500/20 p-6 shadow-card hover:shadow-card-hover hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full mt-2 flex-shrink-0 group-hover:shadow-glow-sm group-hover:shadow-yellow-500/50 transition-all duration-300"></div>
                    <div className="w-full min-w-0">
                      <h3 className="text-yellow-400 font-bold text-xl mb-3 group-hover:text-yellow-300 transition-colors duration-300">Use Any npm Package (React, MUI, etc.)</h3>
                      <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-black/20">
                        <div className="min-w-max p-4">
                          <CodeBlock
                            code={NpmInJacCode}
                            language="jac"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Code Examples Block - Stagger 0.4s */}
          <div
            className="lg:hidden space-y-5 sm:space-y-6"
            style={getChildAnimationStyle(0.4)}
          >
            <div className="space-y-4">
              <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-blue-500/20 p-4 sm:p-6 shadow-card hover:shadow-card-hover hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.01] mx-2 sm:mx-0">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-2 flex-shrink-0 group-hover:shadow-glow-sm group-hover:shadow-blue-500/50 transition-all duration-300"></div>
                    <h3 className="text-blue-400 font-bold text-base sm:text-xl mb-2 group-hover:text-blue-300 transition-colors duration-300">Use Any Python Library (PyPI)</h3>
                  </div>
                  <div className="w-full overflow-x-auto rounded-xl border border-gray-700/50 bg-black/20">
                    <div className="min-w-max p-4 sm:p-5">
                      <CodeBlock
                        code={PythonInJacCode}
                        language="jac"
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-yellow-500/20 p-4 sm:p-6 shadow-card hover:shadow-card-hover hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.01] mx-2 sm:mx-0">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full mt-2 flex-shrink-0 group-hover:shadow-glow-sm group-hover:shadow-yellow-500/50 transition-all duration-300"></div>
                  <h3 className="text-yellow-400 font-bold text-base sm:text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-300">Use Any npm Package (React, MUI, etc.)</h3>
                </div>
                <div className="w-full overflow-x-auto overflow-y-visible rounded-xl border border-gray-700/50 bg-black/20">
                  <div className="min-w-max p-4 sm:p-5">
                    <CodeBlock
                      code={NpmInJacCode}
                      language="jac"
                      className="text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          
          {/* Mobile Bottom Text Block - Stagger 0.6s */}
          <div
            className="lg:hidden"
            style={getChildAnimationStyle(0.6)}
          >
            <div className="bg-gradient-to-r from-primary-orange/15 to-primary-yellow/15 backdrop-blur-md rounded-2xl border border-primary-orange/30 p-5 sm:p-6 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 mx-2 sm:mx-0">
              <div className="text-center">
                <h3 className="text-primary-orange font-bold text-lg sm:text-xl mb-3">
                  Write Once, Run Everywhere
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Jac compiles to pure Python, pure JavaScript, and pure machine code. Import any PyPI package, any npm package, or link with any C-ABI library — all from a single language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(${TRANSLATION_Y});
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default JacSuperset;
