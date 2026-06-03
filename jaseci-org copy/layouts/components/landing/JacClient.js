"use client";

import React, { useState, useEffect, useRef } from "react";
import { CodeBlock } from "../CodeBlock";

const JacClient = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const fullStackCode = `
# Full-stack Todo app in ONE file
node Todo {
    has text: str;
}

walker:pub create_todo {
    has text: str;
    can create with \`root entry {
        here ++> Todo(text=self.text);
    }
}

walker:pub get_todos {
    can fetch with \`root entry {
        report [-->(\`?Todo)];
    }
}

# Frontend React component in Jac
cl {
    def:pub app() -> any {
        has todos: list = [];
        has text: str = "";

        async def addTodo() -> None {
            create_todo(
                text=text
            ) spawn root;
            text = "";
            result = get_todos() spawn root;
            todos = result.reports[0];
        }

        return (
            <div>
                <h1>Todo List</h1>
                <input value={text}
                    onChange={
                      lambda e: any -> None {text = e.target.value;}
                    }
                />
                <button onClick={addTodo}>Add Todo</button>
                <ul>
                    {todos.map(lambda todo: any -> any {
                        return <li>{todo.text}</li>;
                    })}
                </ul>
            </div>
        );
    }
}
# Backend + Frontend in one file!
`;

  const deploymentSteps = [
    {
      step: "1",
      title: "Write Once",
      description: "Backend logic, frontend UI, and AI - all in one .jac file",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      step: "2",
      title: "Run Locally",
      description: "jac start app.jac - instant dev server",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      step: "3",
      title: "Deploy to Production",
      description: "jac start app.jac --scale - same code, infinite scale",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  const ANIMATION_DURATION = '0.9s';
  const TRANSLATION_Y = '30px';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

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
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-dark-bg via-medium-bg to-dark-bg relative overflow-hidden"
      ref={sectionRef}
      id="jac-client"
    >
      <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
        <div className="absolute top-20 left-32 w-96 h-96 bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-24 w-80 h-80 bg-gradient-to-br from-primary-orange via-primary-yellow to-amber-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/40 to-green-500/40 rounded-full blur-2xl animate-blob-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16" style={getHeaderAnimationStyle}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/40 mb-5 shadow-glow-sm shadow-green-500/20">
            <span className="text-green-400 font-bold text-sm uppercase tracking-wide">NEW</span>
            <span className="text-gray-300 text-sm font-medium">jac-client</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Full-Stack Applications in One Language
          </h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto w-32 mb-5"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Build complete web applications with <span className="text-green-400 font-medium">backend</span>, <span className="text-emerald-400 font-medium">frontend</span>, and <span className="text-teal-400 font-medium">AI</span> - all in Jac. No more context switching between languages.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Code Example */}
          <div style={getChildAnimationStyle(0.2)}>
            <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-green-500/20 overflow-hidden shadow-card hover:shadow-card-hover hover:border-green-500/40 transition-all duration-300 hover:scale-[1.01]">
              <div className="bg-gradient-to-r from-green-500/25 to-emerald-500/25 backdrop-blur-md p-4 border-b border-green-500/20">
                <h3 className="text-green-400 font-bold text-lg flex items-center gap-3 group-hover:text-green-300 transition-colors duration-300">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-glow-sm shadow-green-500/50 group-hover:shadow-glow-md transition-all duration-300"></div>
                  Full-Stack Todo App (One File)
                </h3>
              </div>
              <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] overflow-auto max-h-[595px] custom-scrollbar-green">
                <div className="p-5 font-mono text-sm">
                  <CodeBlock code={fullStackCode.trim()} language="jac" />
                </div>
              </div>
            </div>
          </div>

          {/* Features & Deployment Steps */}
          <div className="space-y-6" style={getChildAnimationStyle(0.4)}>
            {/* Key Benefits */}
            <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-green-500/20 p-7 shadow-card hover:shadow-card-hover hover:border-green-500/40 transition-all duration-300">
              <h3 className="text-white font-bold text-xl mb-5 flex items-center gap-3 group-hover:text-green-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                What You Get
              </h3>
              <ul className="space-y-3.5">
                {[
                  "React components written in Jac syntax",
                  "Automatic state management (has → useState)",
                  "Direct walker invocation (no HTTP boilerplate)",
                  "Type safety across frontend and backend",
                  "Hot module replacement for fast development",
                  "Full npm ecosystem access (MUI, Tailwind, etc.)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300 text-base group-hover:text-gray-200 transition-colors duration-300">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deployment Steps */}
            <div className="space-y-4">
              {deploymentSteps.map((step, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-green-500/20 p-5 shadow-card hover:shadow-card-hover hover:border-green-500/40 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/25 to-emerald-500/25 rounded-xl flex items-center justify-center text-green-400 group-hover:scale-110 group-hover:shadow-glow-sm group-hover:shadow-green-500/30 transition-all duration-300 flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base mb-1.5 group-hover:text-green-100 transition-colors duration-300">{step.title}</h4>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center" style={getChildAnimationStyle(0.6)}>
          <div className="inline-flex flex-col sm:flex-row gap-5">
            <a
              href="https://docs.jaseci.org/tutorials/fullstack/setup/"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Learn jac-client</span>
              <svg className="relative ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://github.com/jaseci-labs/jaseci/tree/main/jac-client/jac_client/examples"
              className="group inline-flex items-center justify-center px-8 py-4 border-2 border-green-500/40 text-green-400 font-semibold rounded-xl hover:bg-green-500/10 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
            >
              <span>View Examples</span>
              <svg className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
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

        .custom-scrollbar-green {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 197, 94, 0.5) rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar-green::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar-green::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .custom-scrollbar-green::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%);
          border-radius: 4px;
        }

        .custom-scrollbar-green::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%);
        }
      `}</style>
    </section>
  );
};

export default JacClient;
