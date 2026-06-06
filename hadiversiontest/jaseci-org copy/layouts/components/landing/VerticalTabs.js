"use client";

import React, { useState, useEffect, useRef } from "react";
import { CodeBlock } from "../CodeBlock";

import { jacTabsData, pythonTabsData, tabsData } from "@lib/data/verticalTabs";

// Icon component remains the same
const LearnMoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
  </svg>
);

const VerticalTabs = () => {
  const [activeVerticalTab, setActiveVerticalTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null); 

  // Effect to set up the Intersection Observer
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

  const handleVerticalTabClick = (index) => {
    setActiveVerticalTab(index);
  };
  
  const currentJacCode = jacTabsData[activeVerticalTab].code;
  const currentPythonCode = pythonTabsData[activeVerticalTab].code;

  const ANIMATION_DURATION = '0.8s'; 
  const BASE_DELAY = 0.80; 
  const STAGGER_DELAY = 0.6; // Additional delay between staggered elements

  // Calculate line counts for both code snippets
  const lineCountJac = currentJacCode.trim().split('\n').length;
  const lineCountPython = currentPythonCode.trim().split('\n').length;

  // Helper function to get the appropriate animation class
  const getTabAnimationName = (index) => {
    switch (index) {
        case 0:                         // Left tab: comes from left
            return `slideInLeft`;
        case 1:                         // Middle tab: comes from down to up (default fadeInUp)
            return `fadeInUp`;
        case 2:                         // Right tab: comes from right
            return `slideInRight`;  
        default:
            return `fadeInUp`;
    }
  };
  
  const getChildAnimationStyle = (index) => {
      
      const animationName = getTabAnimationName(index);  // Determine the specific animation to use
      const delay = BASE_DELAY + (index * STAGGER_DELAY);  // Calculate a staggered delay
      
      // Determine initial transform based on the target animation direction
      const initialTransform = 
          animationName === 'slideInLeft' ? 'translateX(-30px)' :
          animationName === 'slideInRight' ? 'translateX(30px)' :
          'translateY(30px)'; // Default for fadeInUp

      return {
          opacity: isVisible ? 1 : 0,
          // Use separate animation properties to avoid shorthand/longhand conflict
          animationName: isVisible ? animationName : 'none',
          animationDuration: ANIMATION_DURATION,
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
          animationDelay: `${delay}s`,
          transform: isVisible ? 'none' : initialTransform,
      };
  };

  return (
    <section 
      className="py-8 sm:py-12 lg:py-16 bg-dark-bg relative overflow-hidden" 
      id="what-is-jac"
      ref={sectionRef} 
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-16 sm:top-32 right-8 sm:right-20 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-br from-primary-orange to-primary-yellow rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-6 sm:left-16 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-br from-primary-yellow to-primary-orange rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-8 sm:mb-10"
          style={getChildAnimationStyle(1)}
        >
          <div className="inline-block">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-primary-orange to-primary-yellow bg-clip-text text-transparent">
              AI Native Programming Language
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent mx-auto w-24 mb-3"></div>
          </div>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-normal">
            Meaning Typed Programming with byLLM and agentic Object-Spatial Programming
          </p>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div
          className="mb-6 sm:mb-8" 
        >
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2 sm:px-0">
            {tabsData.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleVerticalTabClick(index)}
                style={getChildAnimationStyle(index)}
                className={`group px-2 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-1 sm:gap-2 backdrop-blur-sm border shadow-lg
                  ${activeVerticalTab === index
                    ? 'bg-gradient-to-r from-primary-orange to-primary-yellow text-white shadow-primary-orange/25 border-primary-orange/30'
                    : 'bg-dark-bg/40 text-gray-300 hover:text-white hover:bg-dark-bg/60 border-light-bg/20 hover:border-primary-orange/30 hover:shadow-primary-orange/10'
                  }`}
              >
                <span className="font-semibold text-center leading-tight">{tab.title}</span>
                <a
                  href={tab.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block opacity-70 hover:opacity-100 transition-all duration-300 p-1.5 hover:bg-white/10 rounded-lg hover:scale-110"
                >
                  <LearnMoreIcon />
                </a>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div
          className="text-center mb-6 sm:mb-8"
          style={isVisible ? { animation: `fadeInUp 0.8s ease-out 0.45s both` } : { opacity: 0, transform: 'translateY(30px)' }}
        >
          <div className="bg-gradient-to-r from-dark-bg/60 via-dark-bg/40 to-dark-bg/60 backdrop-blur-sm rounded-xl border border-light-bg/20 p-3 sm:p-4 lg:p-6 shadow-xl mx-2 sm:mx-0">
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg leading-normal max-w-3xl mx-auto">
              {tabsData[activeVerticalTab].summary}
            </p>
          </div>
        </div>

        {/* Side by Side Code Comparison */}
        <div
          className="bg-gradient-to-br from-dark-bg/80 via-dark-bg/60 to-dark-bg/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-light-bg/20 overflow-hidden shadow-2xl hover:border-primary-orange/30 transition-all duration-500 mx-2 sm:mx-0"
          style={isVisible ? { animation: `fadeInUp 1s ease-out 0.45s both` } : { opacity: 0, transform: 'translateY(30px)' }}
        >
          <div className="grid lg:grid-cols-2 min-h-[500px]">

            {/* Jac Code */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-light-bg/20">
              <div
                className="bg-gradient-to-r from-primary-orange/20 to-primary-yellow/20 backdrop-blur-sm p-2 sm:p-3 lg:p-4 border-b border-light-bg/20"
                style={getChildAnimationStyle(1)}
              >
                <h3 className="text-primary-orange font-bold text-sm sm:text-base lg:text-lg flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-primary-orange to-primary-yellow rounded-full shadow-lg shadow-primary-orange/50"></div>
                  Jac Programming
                </h3>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#0d1117] to-[#161b22] overflow-hidden">
                <div 
                  style={getChildAnimationStyle(1)} 
                  className={`h-[420px] ${lineCountJac > 21 ? 'overflow-auto custom-scrollbar-orange' : ''}`}
                >
                  <div className="flex min-w-full">
                    {/* Line Numbers - Fixed positioning */}
                    <div className="bg-[#161b22]/80 border-r border-gray-700/50 flex-shrink-0 select-none sticky left-0 z-10">
                      <div className="px-3 py-4 font-mono leading-[1.4] text-gray-500" style={{ fontSize: '0.8rem' }}>
                        {Array.from({ length: Math.max(21, currentJacCode.trim().split('\n').length) }, (_, index) => (
                          <div key={index} className="text-right min-h-[1.4em] flex items-center justify-end">
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Code Content */}
                    <div className="flex-1 min-w-0">
                      <div className="px-4 py-4 font-mono leading-[1.4] whitespace-pre" style={{ fontSize: '0.8rem' }}>
                        <CodeBlock code={currentJacCode.trim()} language="jac" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Python Code */}
            <div className="flex flex-col">
              <div
                className="bg-gradient-to-r from-blue-500/20 to-blue-400/20 backdrop-blur-sm p-2 sm:p-3 lg:p-4 border-b border-light-bg/20"
                style={getChildAnimationStyle(1)}
              >
                <h3 className="text-blue-400 font-bold text-sm sm:text-base lg:text-lg flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full shadow-lg shadow-blue-400/50"></div>
                  Traditional Programming
                </h3>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#0d1117] to-[#161b22] overflow-hidden">
                <div 
                  style={getChildAnimationStyle(1)} 
                  className={`h-[420px] ${lineCountPython > 21 ? 'overflow-auto custom-scrollbar-blue' : ''}`}
                >
                  <div className="flex min-w-full">
                    {/* Line Numbers - Fixed positioning */}
                    <div className="bg-[#161b22]/80 border-r border-gray-700/50 flex-shrink-0 select-none sticky left-0 z-10">
                      <div className="px-3 py-4 font-mono leading-[1.4] text-gray-500" style={{ fontSize: '0.8rem' }}>
                        {Array.from({ length: Math.max(25, currentPythonCode.trim().split('\n').length) }, (_, index) => (
                          <div key={index} className="text-right min-h-[1.4em] flex items-center justify-end">
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Code Content */}
                    <div className="flex-1 min-w-0">
                      <div className="px-4 py-4 font-mono leading-[1.4] whitespace-pre" style={{ fontSize: '0.8rem' }}>
                        <CodeBlock code={currentPythonCode.trim()} language="python" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Changed duration to 0.3s (from 0.6s) for the keyframe animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Animation for the leftmost tab */
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Animation for the rightmost tab */
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Custom scrollbar styling - Orange (Jac) */
        .custom-scrollbar-orange {
          scrollbar-width: thin;
          scrollbar-color: rgba(249, 115, 22, 0.5) rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar-orange::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar-orange::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar-orange::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.6) 0%, rgba(251, 191, 36, 0.6) 100%);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.8) 0%, rgba(251, 191, 36, 0.8) 100%);
        }

        /* Custom scrollbar styling - Blue (Python) */
        .custom-scrollbar-blue {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar-blue::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar-blue::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar-blue::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(96, 165, 250, 0.6) 100%);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar-blue::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(96, 165, 250, 0.8) 100%);
        }
      `}</style>
    </section>
  );
};

export default VerticalTabs;