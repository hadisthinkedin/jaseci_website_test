"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const Hero = () => {
  const cursorRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert to percentage for smooth movement
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        cursorRef.current.style.transform = `translate(${xPercent - 50}%, ${yPercent - 50}%)`;
        cursorRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <>
  <section ref={heroRef} className="min-h-[70vh] lg:min-h-[80vh] flex items-center py-8 sm:py-12 lg:py-16 bg-dark-bg relative overflow-hidden mt-0 pt-[108px]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 bg-gradient-to-br from-primary-orange to-primary-yellow rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-yellow to-primary-orange rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-primary-orange/50 to-primary-yellow/50 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div 
          ref={cursorRef}
          className="absolute w-96 h-96 pointer-events-none opacity-0 transition-all duration-300 ease-out z-0"
          style={{
            background: 'radial-gradient(circle, rgba(255, 149, 0, 0.06) 0%, rgba(255, 193, 7, 0.04) 30%, transparent 70%)',
            filter: 'blur(40px)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-32 h-32 opacity-0 transition-all duration-700 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(255, 149, 0, 0.05) 0%, transparent 60%)',
              filter: 'blur(20px)',
              animation: 'cursorTrail 3s infinite ease-in-out'
            }}
          />
          <div 
            className="absolute w-24 h-24 opacity-0 transition-all duration-500 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(255, 193, 7, 0.04) 0%, transparent 50%)',
              filter: 'blur(15px)',
              animation: 'cursorTrail 2.5s infinite ease-in-out 0.5s'
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid lg:grid-cols-8 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 text-center lg:text-left">
              {/* Announcement pill */}
              <div
                className="inline-flex items-center gap-2 mb-7 px-1 pr-4 py-1.5 rounded-full border border-primary-orange/40 bg-gradient-to-r from-primary-orange/15 to-primary-yellow/10 backdrop-blur-sm shadow-[0_0_20px_-4px_rgba(249,115,22,0.3)] text-sm font-medium text-white transition-all duration-300 hover:border-primary-orange/70 hover:shadow-[0_0_28px_-4px_rgba(249,115,22,0.5)] hover:scale-[1.02] cursor-default"
                style={{ animation: 'fadeInUp 0.6s ease-out 0s both' }}
              >
                <span className="flex items-center gap-1 bg-gradient-to-r from-primary-orange to-primary-yellow text-white px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold tracking-wider uppercase">
                  ✦ New
                </span>
                <a
                  href="https://jac-coder.jaseci.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary-yellow transition-colors duration-200"
                >
                  JacCoder
                </a>
                <span className="text-white/30">·</span>
                <a
                  href="https://jac-builder-studio.jaseci.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary-yellow transition-colors duration-200"
                >
                  JacBuilder
                </a>
                <svg className="w-3.5 h-3.5 text-primary-orange" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div className="mb-6">
                <h1 className="font-display font-medium tracking-tight text-balance leading-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                  <span
                    className="block text-white"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0s both' }}
                  >
                    One Language for
                  </span>
                  <span
                    className="block bg-gradient-to-r from-primary-orange via-primary-yellow to-primary-orange bg-clip-text text-transparent drop-shadow-sm"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                  >
                    AI-Native Full-Stack
                  </span>
                  <span
                    className="block text-white"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
                  >
                    Development
                  </span>
                </h1>
                <div className="h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent mx-auto lg:mx-0 w-64 mt-4" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}></div>
              </div>

              <p
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg xl:text-xl text-dark-text/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}
              >
                Build complete applications with
                <span className="text-primary-orange font-medium hover:text-primary-yellow transition-colors duration-300"> backend + frontend + AI</span> in a single unified language.
                Access both <span className="text-primary-orange font-medium hover:text-primary-yellow transition-colors duration-300">PyPI and npm</span> ecosystems,
                deploy from laptop to cloud with <span className="text-primary-orange font-medium hover:text-primary-yellow transition-colors duration-300">zero code changes</span>.
              </p>

              <div
                className="mt-8 sm:mt-10 max-w-xl mx-auto lg:mx-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 1s both' }}
              >
                <p className="text-xs sm:text-sm text-dark-text/60 mb-2 font-medium tracking-wide uppercase">Install with one command</p>
                <div className="group relative rounded-xl border border-light-bg/40 bg-dark-bg/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-primary-orange/50 hover:shadow-lg hover:shadow-primary-orange/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-primary-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center px-4 sm:px-5 py-3 sm:py-4">
                    <span className="text-primary-orange font-mono text-sm mr-3 select-none">$</span>
                    <code className="flex-1 text-sm sm:text-base font-mono text-light-text/90 select-all">curl -fsSL https://raw.githubusercontent.com/jaseci-labs/jaseci/main/scripts/install.sh | bash</code>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/jaseci-labs/jaseci/main/scripts/install.sh | bash');
                        const btn = e.currentTarget;
                        btn.querySelector('.copy-icon').classList.add('hidden');
                        btn.querySelector('.check-icon').classList.remove('hidden');
                        setTimeout(() => {
                          btn.querySelector('.copy-icon').classList.remove('hidden');
                          btn.querySelector('.check-icon').classList.add('hidden');
                        }, 2000);
                      }}
                      className="ml-3 p-2 rounded-lg text-dark-text/50 hover:text-primary-orange hover:bg-light-bg/30 transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      <svg className="copy-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg className="check-icon w-4 h-4 hidden text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-dark-text/60 mb-2 mt-4 font-medium tracking-wide uppercase">Then launch a full-stack app</p>
                <div className="group relative rounded-xl border border-light-bg/40 bg-dark-bg/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-primary-orange/50 hover:shadow-lg hover:shadow-primary-orange/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-primary-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-4 sm:px-5 py-3 sm:py-4 space-y-1">
                    <div className="flex items-center">
                      <span className="text-primary-orange font-mono text-sm mr-3 select-none">$</span>
                      <code className="flex-1 text-sm sm:text-base font-mono text-light-text/90">jac create myapp --use fullstack</code>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-orange font-mono text-sm mr-3 select-none">$</span>
                      <code className="flex-1 text-sm sm:text-base font-mono text-light-text/90">cd myapp && jac start main.jac</code>
                    </div>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText('jac create myapp --use fullstack && cd myapp && jac start main.jac');
                        const btn = e.currentTarget;
                        btn.querySelector('.copy-icon-2').classList.add('hidden');
                        btn.querySelector('.check-icon-2').classList.remove('hidden');
                        setTimeout(() => {
                          btn.querySelector('.copy-icon-2').classList.remove('hidden');
                          btn.querySelector('.check-icon-2').classList.add('hidden');
                        }, 2000);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg text-dark-text/50 hover:text-primary-orange hover:bg-light-bg/30 transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      <svg className="copy-icon-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg className="check-icon-2 w-4 h-4 hidden text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="mt-6 flex justify-center lg:justify-start"
                style={{ animation: 'fadeInUp 0.6s ease-out 1.4s both' }}
              >
                <a
                  href="https://docs.jaseci.org/quick-guide/"
                  onClick={() =>
                    import("@lib/gtag").then(({ event }) =>
                      event({
                        action: "click_docs",
                        category: "engagement",
                        label: "home_hero_docs",
                        value: 1,
                        transport_type: "beacon",
                      })
                    )
                  }
                  className="group relative inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-orange to-primary-yellow shadow-md shadow-primary-orange/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-orange/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-yellow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-primary-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">See Docs to Learn More</span>
                  <svg className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div
              className="hidden lg:block lg:col-span-3 order-first  lg:order-last transform translate-x-[-12px]"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
            >
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-primary-orange/3 via-primary-yellow/2 to-primary-orange/3 rounded-full blur-3xl opacity-10 scale-110 animate-breathe"></div>
                <div className="absolute -inset-8 bg-gradient-to-br from-primary-orange/2 to-primary-yellow/2 rounded-full blur-2xl opacity-5 animate-slow-pulse"></div>
                
                <div className="relative flex items-center justify-center min-h-[500px]">
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="hero-particle hero-particle-1"></div>
                    <div className="hero-particle hero-particle-2"></div>
                    <div className="hero-particle hero-particle-3"></div>
                    <div className="hero-particle hero-particle-4"></div>
                    <div className="hero-particle hero-particle-5"></div>
                    <div className="hero-particle hero-particle-6"></div>
                    <div className="hero-particle hero-particle-7"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/4 to-primary-yellow/4 rounded-2xl blur-2xl opacity-15 scale-110 animate-glow-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/3 via-transparent to-primary-yellow/3 rounded-xl blur-xl opacity-20 animate-shimmer"></div>
                    
                    <Image
                      src="/images/assets/hero.png"
                      alt="Jaseci Stack"
                      width={3400}
                      height={2600}
                      className="w-full h-auto max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto animate-professional-float drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] transform-gpu"
                      priority
                    />
                    
                    <div className="absolute -top-4 -right-4 w-3 h-3 bg-gradient-to-r from-primary-orange to-primary-yellow rounded-full animate-orbit opacity-70 shadow-lg shadow-primary-orange/50"></div>
                    <div className="absolute -bottom-6 -left-6 w-5 h-5 border-2 border-primary-yellow/50 rounded-full animate-reverse-orbit opacity-50 backdrop-blur-sm"></div>
                    <div className="absolute top-1/4 -right-6 w-1.5 h-1.5 bg-primary-orange/60 rounded-full animate-float-up opacity-60"></div>
                    <div className="absolute bottom-1/3 -left-4 w-2 h-2 border border-primary-yellow/40 rounded-full animate-float-down opacity-50"></div>
                    
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-12 h-0.5 bg-gradient-to-r from-primary-orange/30 to-transparent animate-magnetic-line-1 rounded-full"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-16 h-0.5 bg-gradient-to-l from-primary-yellow/25 to-transparent animate-magnetic-line-2 rounded-full"></div>
                      <div className="absolute top-2/3 left-1/3 w-10 h-0.5 bg-gradient-to-r from-primary-orange/20 to-transparent animate-magnetic-line-3 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
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

          @keyframes cursorTrail {
            0%, 100% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.2);
            }
          }

          @keyframes professionalFloat {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            }
            25% { 
              transform: translateY(-15px) rotate(0.5deg); 
            }
            50% { 
              transform: translateY(-20px) rotate(0deg); 
            }
            75% { 
              transform: translateY(-10px) rotate(-0.5deg); 
            }
          }

          @keyframes breathe {
            0%, 100% { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.4; 
            }
            50% { 
              transform: scale(1.1) rotate(1deg); 
              opacity: 0.7; 
            }
          }

          @keyframes slowPulse {
            0%, 100% { 
              opacity: 0.2; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.4; 
              transform: scale(1.05); 
            }
          }

          @keyframes glowPulse {
            0%, 100% { 
              opacity: 0; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: scale(1.1); 
            }
          }

          @keyframes shimmer {
            0% { 
              transform: translateX(-100%) rotate(0deg); 
              opacity: 0; 
            }
            50% { 
              transform: translateX(0%) rotate(2deg); 
              opacity: 0.8; 
            }
            100% { 
              transform: translateX(100%) rotate(0deg); 
              opacity: 0; 
            }
          }

          @keyframes orbit {
            0% { 
              transform: rotate(0deg) translateX(20px) rotate(0deg); 
            }
            100% { 
              transform: rotate(360deg) translateX(20px) rotate(-360deg); 
            }
          }

          @keyframes reverseOrbit {
            0% { 
              transform: rotate(0deg) translateX(25px) rotate(0deg); 
            }
            100% { 
              transform: rotate(-360deg) translateX(25px) rotate(360deg); 
            }
          }

          @keyframes floatUp {
            0%, 100% { 
              transform: translateY(0px) scale(1); 
              opacity: 0.6; 
            }
            50% { 
              transform: translateY(-30px) scale(1.2); 
              opacity: 1; 
            }
          }

          @keyframes floatDown {
            0%, 100% { 
              transform: translateY(0px) scale(1); 
              opacity: 0.5; 
            }
            50% { 
              transform: translateY(25px) scale(0.8); 
              opacity: 0.8; 
            }
          }

          @keyframes magneticLine1 {
            0%, 100% { 
              opacity: 0; 
              transform: translateX(0) scaleX(0); 
            }
            25% { 
              opacity: 0.3; 
              transform: translateX(10px) scaleX(1); 
            }
            75% { 
              opacity: 0.6; 
              transform: translateX(5px) scaleX(1.2); 
            }
          }

          @keyframes magneticLine2 {
            0%, 100% { 
              opacity: 0; 
              transform: translateX(0) scaleX(0); 
            }
            33% { 
              opacity: 0.25; 
              transform: translateX(-15px) scaleX(1); 
            }
            66% { 
              opacity: 0.5; 
              transform: translateX(-8px) scaleX(1.1); 
            }
          }

          @keyframes magneticLine3 {
            0%, 100% { 
              opacity: 0; 
              transform: translateX(0) scaleX(0); 
            }
            40% { 
              opacity: 0.2; 
              transform: translateX(12px) scaleX(1); 
            }
            80% { 
              opacity: 0.4; 
              transform: translateX(6px) scaleX(0.9); 
            }
          }

          .hero-particle {
            position: absolute;
            background: rgba(255, 149, 0, 0.5);
            border-radius: 50%;
            pointer-events: none;
            filter: blur(0.5px);
          }

          .hero-particle-1 {
            width: 2px; height: 2px;
            top: 15%; left: 10%;
            animation: heroParticleFloat1 12s infinite ease-in-out;
          }

          .hero-particle-2 {
            width: 1.5px; height: 1.5px;
            top: 70%; right: 15%;
            animation: heroParticleFloat2 10s infinite ease-in-out 2s;
          }

          .hero-particle-3 {
            width: 2.5px; height: 2.5px;
            bottom: 60%; left: 15%;
            animation: heroParticleFloat3 15s infinite ease-in-out 4s;
          }

          .hero-particle-4 {
            width: 1px; height: 1px;
            top: 30%; right: 25%;
            animation: heroParticleFloat4 8s infinite ease-in-out 1s;
          }

          .hero-particle-5 {
            width: 2px; height: 2px;
            bottom: 25%; right: 40%;
            animation: heroParticleFloat5 14s infinite ease-in-out 3s;
          }

          .hero-particle-6 {
            width: 1.5px; height: 1.5px;
            top: 50%; left: 5%;
            animation: heroParticleFloat6 11s infinite ease-in-out 5s;
          }

          .hero-particle-7 {
            width: 2px; height: 2px;
            top: 80%; right: 5%;
            animation: heroParticleFloat7 13s infinite ease-in-out 6s;
          }

          @keyframes heroParticleFloat1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            25% { transform: translate(40px, -50px) scale(1.5); opacity: 0.8; }
            50% { transform: translate(-20px, -80px) scale(1.2); opacity: 1; }
            75% { transform: translate(60px, -30px) scale(0.8); opacity: 0.6; }
          }

          @keyframes heroParticleFloat2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            33% { transform: translate(-35px, 60px) scale(1.3); opacity: 0.7; }
            66% { transform: translate(25px, -40px) scale(0.9); opacity: 0.9; }
          }

          @keyframes heroParticleFloat3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            50% { transform: translate(50px, -70px) scale(1.8); opacity: 1; }
          }

          @keyframes heroParticleFloat4 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(-30px, 40px) scale(1.4); opacity: 0.6; }
            75% { transform: translate(35px, -55px) scale(1.1); opacity: 0.8; }
          }

          @keyframes heroParticleFloat5 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            40% { transform: translate(45px, -35px) scale(1.3); opacity: 0.9; }
            80% { transform: translate(-25px, 25px) scale(0.7); opacity: 0.7; }
          }

          @keyframes heroParticleFloat6 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            50% { transform: translate(30px, -45px) scale(1.5); opacity: 0.8; }
          }

          @keyframes heroParticleFloat7 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            33% { transform: translate(-40px, -30px) scale(1.2); opacity: 0.7; }
            66% { transform: translate(20px, 50px) scale(0.9); opacity: 0.9; }
          }

          .animate-professional-float {
            animation: professionalFloat 16s ease-in-out infinite;
          }

          .animate-breathe {
            animation: breathe 8s ease-in-out infinite;
          }

          .animate-slow-pulse {
            animation: slowPulse 6s ease-in-out infinite;
          }

          .animate-glow-pulse {
            animation: glowPulse 4s ease-in-out infinite;
          }

          .animate-shimmer {
            animation: shimmer 8s ease-in-out infinite;
          }

          .animate-orbit {
            animation: orbit 20s linear infinite;
          }

          .animate-reverse-orbit {
            animation: reverseOrbit 25s linear infinite;
          }

          .animate-float-up {
            animation: floatUp 7s ease-in-out infinite;
          }

          .animate-float-down {
            animation: floatDown 9s ease-in-out infinite;
          }

          .animate-magnetic-line-1 {
            animation: magneticLine1 6s ease-in-out infinite;
          }

          .animate-magnetic-line-2 {
            animation: magneticLine2 8s ease-in-out infinite 2s;
          }

          .animate-magnetic-line-3 {
            animation: magneticLine3 7s ease-in-out infinite 4s;
          }

          @media (max-width: 768px) {
            .hero-particle {
              width: 1px !important;
              height: 1px !important;
              opacity: 0.7;
            }
            
            .animate-professional-float {
              animation: professionalFloat 12s ease-in-out infinite;
            }
          }
        `}</style>
      </section>

      <section className="pt-0 pb-6 bg-gradient-to-b from-medium-bg/50 to-dark-bg relative">
        <div className="container mx-auto max-w-6xl px-4">
          <div
            className="text-center py-4 sm:py-6 px-6 sm:px-8 transition-all duration-500"
            style={{ animation: 'fadeInUp 0.6s ease-out 1.8s both' }}
          >

            <div className="flex flex-col sm:flex-row items-center justify-center max-w-5xl mx-auto">
              {[
                {
                  logo: "/images/assets/org1_logo.png",
                  text: "Part of Nvidia Inception Program, supporting cutting edge AI innovation and scalability",
                },
                {
                  logo: "/images/assets/org2_logo.png",
                  text: "Research led by faculty and researchers at University of Michigan, United States",
                },
                {
                  logo: "/images/assets/org3_logo.png",
                  text: "Sponsored by NSF, advancing community driven open source ecosystem",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="group flex flex-col items-center gap-3 text-center p-4 sm:p-6 rounded-xl hover:bg-dark-bg/20 transition-all duration-300 hover:transform hover:scale-105 flex-1"
                    style={{ animation: `fadeInUp 0.6s ease-out ${2 + index * 0.1}s both` }}
                  >
                    <div className="relative">
                      <Image
                        src={item.logo}
                        alt={`Affiliation ${index + 1}`}
                        width={200}
                        height={100}
                        className="h-16 sm:h-20 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-orange/5 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <p className="text-xs text-[#9AA0A6] leading-relaxed group-hover:text-white/80 transition-colors duration-300 max-w-xs">
                      {item.text}
                    </p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden sm:block w-px h-20 bg-gradient-to-b from-transparent via-light-bg/30 to-transparent mx-4 lg:mx-6">
                      <div className="w-full h-full bg-gradient-to-b from-transparent via-primary-orange/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
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
        `}</style>
      </section>
    </>
  );
};

export default Hero;
