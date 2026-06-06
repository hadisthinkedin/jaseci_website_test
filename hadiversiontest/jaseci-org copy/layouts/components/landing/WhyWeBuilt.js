"use client";

import React, { useState, useEffect, useRef } from "react";

// --- Custom Hook for Intersection Observer ---
const useIntersectionObserver = (ref, options) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // We only care when it starts intersecting. Once it's in view, we stop observing.
      if (entry.isIntersecting) {
        setInView(true);
        // Optional: stop observing once it has been revealed
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return inView;
};
// ------------------------------------------

const WhyWeBuilt = () => {
  const hl = "text-white font-medium";
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Smooth scroll handler
  const handleCardClick = (e, link) => {
    e.preventDefault();
    const targetId = link.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const cards = [
    {
      title: "Full Stack in One File",
      link: "#jac-client",
      subtitle: (<>Replaces Python, JavaScript, and C/Zig/Rust with full access to PyPI, npm, and C-ABI — backend, frontend, and AI in one language.</>),
      subtext: (<>Jac replaces the need for Python, JavaScript, and C/Zig/Rust while maintaining full native compatibility. Import any PyPI package, use any npm package, and link with any C-ABI library. Write React components, backend logic, and AI integrations all in the same file. No more juggling three languages across three codebases.</>),
      gradient: "from-orange-400 to-orange-500",
      borderColor: "border-orange-400/30",
      hoverBorder: "hover:border-orange-400/50",
      titleColor: "text-orange-400",
      iconBg: "bg-gradient-to-r from-orange-500 to-orange-400",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Kill the Glue Code",
      link: "#jac-client",
      subtitle: (<>No REST endpoints. No HTTP clients. No CORS. Frontend calls backend directly.</>),
      subtext: (<>In traditional stacks, half your code is just connecting things: writing API routes, serializing data, configuring fetch calls. In Jac, frontend and backend live in the same file, so calling a backend service is just a function call. Authentication, type safety, and serialization are handled for you.</>),
      gradient: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500/30",
      hoverBorder: "hover:border-orange-500/50",
      titleColor: "text-orange-500",
      iconBg: "bg-gradient-to-r from-orange-600 to-orange-500",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.5 8.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" strokeDasharray="2 2" />
        </svg>
      )
    },
    {
      title: "AI with No Manual Prompts",
      link: "#what-is-jac",
      subtitle: (<>by llm() turns your function signature into the prompt. No prompt engineering required.</>),
      subtext: (<>Declare what you want, not how to ask for it. Jac extracts the semantics from your code: function names, types, docstrings, and generates the right prompt automatically. Research shows developers complete tasks 3.2x faster with 45% fewer lines of code.{" "}<span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); e.preventDefault(); document.getElementById('ref-1')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer">[1]</span></>),
      gradient: "from-orange-600 to-orange-700",
      borderColor: "border-orange-600/30",
      hoverBorder: "hover:border-orange-600/50",
      titleColor: "text-orange-600",
      iconBg: "bg-gradient-to-r from-orange-700 to-orange-600",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      )
    },
    {
      title: "Deploy Without DevOps",
      link: "#jac-scale",
      subtitle: (<>Same code, laptop to Kubernetes. Databases, auth, and API docs auto-provisioned.</>),
      subtext: (<><code className="bg-white/10 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">jac start app.jac</code> runs locally. Add <code className="bg-white/10 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">--scale</code> and you get Kubernetes deployments with MongoDB, Redis, JWT auth, and Swagger docs: all auto-configured. No Dockerfile, no manifests, no infrastructure setup.</>),
      gradient: "from-orange-700 to-orange-800",
      borderColor: "border-orange-700/30",
      hoverBorder: "hover:border-orange-700/50",
      titleColor: "text-orange-700",
      iconBg: "bg-gradient-to-r from-orange-800 to-orange-700",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    }
  ];

  // Create a ref for the header element
  const headerRef = useRef(null);
  const headerInView = useIntersectionObserver(headerRef, { threshold: 0.1 });

  return (
    <>
    <section id="why-jaseci" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-medium-bg via-dark-bg to-dark-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
        <div className="absolute top-20 left-32 w-96 h-96 bg-gradient-to-br from-primary-orange via-orange-500 to-amber-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-24 w-80 h-80 bg-gradient-to-br from-amber-500 via-primary-yellow to-orange-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-orange-600/40 to-red-600/40 rounded-full blur-2xl animate-blob-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
    <div
          ref={headerRef} // Attach ref for observation
          className={`text-center mb-12 sm:mb-14 lg:mb-16 transition-all duration-700 ease-out ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-orange to-amber-500 bg-clip-text text-transparent">
            Why Jaseci
          </h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent mx-auto w-32 mb-5"></div>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jaseci provides native <span className="text-primary-orange font-medium">AI integration</span>, <span className="text-primary-orange font-medium">full-stack capabilities</span>, and <span className="text-primary-orange font-medium">seamless deployment and scaling</span> in one unified stack.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card, index) => {
            // Use a separate ref for each card
            const cardRef = useRef(null);
            const cardInView = useIntersectionObserver(cardRef, { threshold: 0.1 });

            return (
              <a
                href={card.link}
                onClick={(e) => handleCardClick(e, card.link)}
                key={index}
                ref={cardRef} // Attach ref for observation
                className={`
                  block bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border ${card.borderColor} ${card.hoverBorder} p-7 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-700 ease-out group mx-2 sm:mx-0 cursor-pointer
                  // Scroll animation classes
                  ${cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  // Hover effects
                  hover:transform hover:scale-[1.02]
                `}
                style={{
                  transitionDelay: cardInView ? `${index * 0.15}s` : '0s' // Staggered delay only on reveal
                }}
              >
                {/* Card Icon Badge */}
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 ${card.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-glow-sm transition-all duration-300 shadow-lg`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`${card.titleColor} font-bold text-lg sm:text-xl group-hover:brightness-110 transition-all duration-300`}>
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 italic leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pl-0 mt-5">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {card.subtext}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

    </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-primary-orange to-amber-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg 
          className="w-6 h-6 text-white group-hover:translate-y-[-2px] transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  );
};

export default WhyWeBuilt;