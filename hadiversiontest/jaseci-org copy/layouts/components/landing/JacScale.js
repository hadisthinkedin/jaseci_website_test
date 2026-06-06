"use client";

import React, { useState, useEffect, useRef } from "react";
import { CodeBlock } from "../CodeBlock";

const JacScale = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMode, setActiveMode] = useState(0);
  const sectionRef = useRef(null);

  const deploymentModes = [
    {
      title: "Development",
      command: "jac start app.jac",
      description: "Local development with hot reload",
      features: ["SQLite storage", "Fast iteration", "Hot module replacement"],
      color: "blue",
    },
    {
      title: "Production",
      command: "jac start app.jac --scale",
      description: "Deploy to Kubernetes instantly",
      features: ["Auto-provisioned Redis", "Auto-provisioned MongoDB", "Load balancing"],
      color: "green",
    },
    {
      title: "Build & Deploy",
      command: "jac start app.jac --scale --build",
      description: "Production with Docker versioning",
      features: ["Docker image builds", "Version control", "CI/CD ready"],
      color: "purple",
    },
  ];

  const infrastructureFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Kubernetes Orchestration",
      description: "Auto-scaling deployments, health checks, and service discovery",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Persistent Storage",
      description: "MongoDB for data, Redis for caching - auto-provisioned",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Built-in Auth",
      description: "JWT authentication and SSO support out of the box",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Auto API Docs",
      description: "Swagger/OpenAPI documentation generated automatically",
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

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-500/20 to-blue-600/20",
        border: "border-blue-500/30",
        text: "text-blue-400",
        dot: "from-blue-400 to-blue-500",
        shadow: "shadow-blue-500/25",
      },
      green: {
        bg: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
        text: "text-green-400",
        dot: "from-green-400 to-emerald-400",
        shadow: "shadow-green-500/25",
      },
      purple: {
        bg: "from-purple-500/20 to-violet-500/20",
        border: "border-purple-500/30",
        text: "text-purple-400",
        dot: "from-purple-400 to-violet-400",
        shadow: "shadow-purple-500/25",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-dark-bg via-medium-bg to-dark-bg relative overflow-hidden"
      ref={sectionRef}
      id="jac-scale"
    >
      <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
        <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-to-br from-purple-500 via-violet-400 to-fuchsia-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-24 w-80 h-80 bg-gradient-to-br from-primary-orange via-primary-yellow to-amber-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500/40 to-purple-500/40 rounded-full blur-2xl animate-blob-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16" style={getHeaderAnimationStyle}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full border border-purple-500/40 mb-5 shadow-glow-sm shadow-purple-500/20">
            <span className="text-purple-400 font-bold text-sm uppercase tracking-wide">NEW</span>
            <span className="text-gray-300 text-sm font-medium">jac-scale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Zero to Infinite Scale Without Code Changes
          </h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto w-32 mb-5"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Deploy the same code locally or to <span className="text-purple-400 font-medium">Kubernetes production</span>. No Docker, no manifests, no configuration.
          </p>
        </div>

        {/* Deployment Mode Selector */}
        <div className="mb-10" style={getChildAnimationStyle(0.2)}>
          <div className="flex flex-wrap justify-center gap-4">
            {deploymentModes.map((mode, index) => {
              const colors = getColorClasses(mode.color);
              return (
                <button
                  key={index}
                  onClick={() => setActiveMode(index)}
                  className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border backdrop-blur-md ${
                    activeMode === index
                      ? `bg-gradient-to-r ${colors.bg} ${colors.text} ${colors.border} shadow-card hover:shadow-card-hover`
                      : "bg-dark-bg/60 text-gray-300 border-light-bg/30 hover:border-light-bg/50 hover:bg-medium-bg/50"
                  }`}
                >
                  {mode.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Mode Details */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12" style={getChildAnimationStyle(0.3)}>
          {/* Command Display */}
          <div className={`group bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border ${getColorClasses(deploymentModes[activeMode].color).border} p-7 shadow-card hover:shadow-card-hover transition-all duration-300`}>
            <div className="mb-5">
              <span className={`text-base font-semibold ${getColorClasses(deploymentModes[activeMode].color).text}`}>
                {deploymentModes[activeMode].description}
              </span>
            </div>
            <div className="bg-[#0d1117] rounded-xl p-5 font-mono border border-gray-800/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-500 text-lg">$</span>
                <span className={`${getColorClasses(deploymentModes[activeMode].color).text} text-base`}>
                  {deploymentModes[activeMode].command}
                </span>
              </div>
              <div className="text-gray-500 text-sm mt-4 border-t border-gray-700/50 pt-4">
                {activeMode === 0 && "# App running at http://localhost:8000"}
                {activeMode === 1 && "# App deployed to Kubernetes at http://localhost:30001"}
                {activeMode === 2 && "# Docker image built and deployed to Kubernetes"}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {deploymentModes[activeMode].features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300 text-base">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(deploymentModes[activeMode].color).dot} shadow-sm`}></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* What Gets Created */}
          <div className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-purple-500/20 p-7 shadow-card hover:shadow-card-hover hover:border-purple-500/30 transition-all duration-300">
            <h3 className="text-white font-bold text-xl mb-5 group-hover:text-purple-100 transition-colors duration-300">What Gets Created Automatically</h3>
            <div className="space-y-3">
              {[
                { name: "Kubernetes Deployment", desc: "With load balancing & health checks" },
                { name: "Redis StatefulSet", desc: "For caching & session management" },
                { name: "MongoDB StatefulSet", desc: "For persistent data storage" },
                { name: "ConfigMaps & Secrets", desc: "Secure configuration management" },
                { name: "Persistent Volumes", desc: "Data survives restarts" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-dark-bg/50 border border-light-bg/20 hover:border-purple-500/20 transition-all duration-300">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="text-white font-semibold text-base">{item.name}</span>
                    <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Infrastructure Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={getChildAnimationStyle(0.5)}>
          {infrastructureFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-dark-bg/90 via-medium-bg/70 to-dark-bg/90 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 shadow-card hover:shadow-card-hover hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/25 to-violet-500/25 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 group-hover:shadow-glow-sm group-hover:shadow-purple-500/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h4 className="text-white font-semibold text-base mb-2 group-hover:text-purple-100 transition-colors duration-300">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 text-center" style={getChildAnimationStyle(0.6)}>
          <div className="bg-gradient-to-r from-purple-500/15 to-violet-500/15 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 max-w-3xl mx-auto shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
            <p className="text-gray-300 text-lg leading-relaxed">
              <span className="text-purple-400 font-bold text-xl">Zero DevOps Required.</span> No Dockerfile, no Kubernetes manifests, no infrastructure setup.
              The same code that runs on your laptop scales to production with a single flag.
            </p>
          </div>
          <div className="mt-8">
            <a
              href="https://docs.jaseci.org/tutorials/production/kubernetes/"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Learn jac-scale</span>
              <svg className="relative ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
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
      `}</style>
    </section>
  );
};

export default JacScale;
