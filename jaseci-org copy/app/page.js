"use client";

import SeoMeta from "@layouts/partials/SeoMeta";
import Hero from "@layouts/components/landing/Hero";
import JacSuperset from "@layouts/components/landing/JacSuperset";
import JacClient from "@layouts/components/landing/JacClient";
import JacScale from "@layouts/components/landing/JacScale";
import Carousel from "@layouts/components/landing/Carousel";
import {
  gettingStartedSlides,
} from "@lib/landing-page-content";
import VerticalTabs from "@layouts/components/landing/VerticalTabs";
import WhyWeBuilt from '@layouts/components/landing/WhyWeBuilt';

const LandingPage = () => {
  return (
    <>
      <SeoMeta
        title="Jac & Jaseci: One Language for AI-Native Full-Stack Development"
        meta_title="Jac & Jaseci: One Language for AI-Native Full-Stack Development"
        description="Build complete applications with backend, frontend, and AI in one unified language. Access PyPI and npm ecosystems, deploy from laptop to cloud with zero code changes."
        image="/images/logo.png"
      />
      <div className="bg-dark-bg pt-16 md:pt-20">
        <main className="max-w-none mx-auto px-5">
          <Hero />
        </main>
        <WhyWeBuilt />
        <JacSuperset />
        <JacClient />
        <JacScale />
        <VerticalTabs />
        <Carousel
          slides={gettingStartedSlides}
          title="The Jaseci Stack"
          sectionId="learn"
        />

        {/* References */}
        <section id="ref-1" className="py-8 bg-dark-bg pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                References
              </h2>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto w-20"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-dark-bg/90 via-medium-bg/80 to-dark-bg/90 backdrop-blur-md rounded-xl border border-white/10 p-6 sm:p-8">
                <div className="border-l-4 border-primary-orange pl-5">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    <span className="text-gray-300 font-medium">[1]</span>{" "}
                    Jayanaka L. Dantanarayana, Yiping Kang, Kugesan Sivasothynathan, Christopher Clarke, Baichuan Li, Savini Kashmira, Krisztian Flautner, Lingjia Tang, and Jason Mars. 2025.
                  </p>
                  <p className="text-sm text-gray-400 italic mt-1 leading-relaxed">
                    &quot;MTP: A Meaning-Typed Language Abstraction for AI-Integrated Programming.&quot;
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Proc. ACM Program. Lang. 9, OOPSLA2, Article 314 (October 2025), 29 pages.{" "}
                    <a href="https://dl.acm.org/doi/10.1145/3763092" target="_blank" rel="noopener noreferrer" className="text-primary-orange underline hover:text-orange-300 transition-colors">
                      https://doi.org/10.1145/3763092
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
