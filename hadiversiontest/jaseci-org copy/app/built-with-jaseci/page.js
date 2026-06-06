"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SeoMeta from "@layouts/partials/SeoMeta";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaPlus,
  FaArrowRight,
  FaPlay,
  FaTimes,
  FaGlobe,
  FaTrophy,
} from "react-icons/fa";

// --- Companies in production ---
const companies = [
  {
    name: "Ally",
    logo: "/images/assets/partners/Ally_Financial.png",
    href: "https://www.ally.com/",
    blurb: "Digital banking & financial services",
  },
  {
    name: "Tobu",
    logo: "/images/assets/partners/tobu.png",
    href: "https://tobu.life/",
    blurb: "AI-powered creative tools",
  },
  {
    name: "Pocketnest",
    logo: "/images/assets/partners/pocketnest.png",
    href: "https://pocketnest.com/",
    blurb: "Personal finance platform",
  },
];

// --- Featured projects ---
// Data shape:
//   thumbnail: poster image shown in the card (use a screenshot/preview).
//              If empty: auto-derived from a YouTube videoUrl, or first frame of an .mp4 videoUrl.
//   videoUrl: YouTube/Vimeo embed URL or direct .mp4 — opens in modal on play
//   liveUrl:  link to the running app / Devpost / project page
//   githubUrl: optional source link
//   team:     array of { initials } shown as avatar badges
const projects = [
  {
    name: "Skooch",
    description:
      "An AI-powered dynamic scheduler that optimizes your schedule to your capabilities. Automatically plans tasks, homework, social events, and more, catered to your energy level and work style preferences.",
    thumbnail: "",
    videoUrl:
      "https://dsmbbmpkcxdbqlhrmuva.supabase.co/storage/v1/object/public/assets/skooch_landing_demo.mp4",
    liveUrl: "https://www.skooch.ai/",
    githubUrl: "",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "GraphClaw",
    description:
      "A multi-agent AI platform where memory lives in a property graph, agents are graph walkers, and skills can be installed from the internet at runtime. Specialist agents collaborate across Telegram, Discord, Slack, and email.",
    team: [
      { initials: "MK" },
      { initials: "AM" },
    ],
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/6xdpZwHekME",
    liveUrl: "https://graphclaw.vercel.app",
    githubUrl: "https://github.com/zero-abd/graphclaw",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "EdgeCast",
    description:
      "A clean MVP that helps users discover active Kalshi prediction markets, inspect price action, and ask an AI analyst for a YES/NO lean with confidence score and rationale.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/TyPN8ViaIOI?start=1",
    liveUrl: "https://www.edgecastapp.com/",
    githubUrl: "",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "GhostWatch",
    description:
      "Autonomous code defense with graph-native clarity. GhostWatch builds a living graph of your codebase to flag risky dependencies and pull requests, runs sandboxed tests for evidence, and can ship auto-fix PRs and Discord alerts to cut alert fatigue.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/ZN0UVnNUpRs?start=3",
    liveUrl: "",
    githubUrl: "https://github.com/ayushmk7/GhostWatch",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "MaizeMind",
    description:
      "A visual reasoning tool that creates a graph of an argument complete with claims, evidence, and reasoning. Build off different nodes and connect information to explore complex ideas visually.",
    thumbnail: "",
    videoUrl:
      "https://drive.google.com/file/d/1pM3xXK0HfE4KdOHwB7ozztQUWIxW6NC-/preview",
    liveUrl: "https://www.maizemind.com/",
    githubUrl: "https://github.com/kelmegan/maizemind-juncture",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "AI4Careers",
    description:
      "An AI-powered assistant that helps students navigate job applications and career fairs by optimizing resumes, matching roles to individual profiles, and generating tailored recruiter talking points in real time.",
    thumbnail: "",
    videoUrl:
      "https://drive.google.com/file/d/1Pom22VWcbC5nhvKJJZkEfNFAfF76nR6z/preview",
    liveUrl: "",
    githubUrl: "https://github.com/YuzhangMei/AI4Careers",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "ChainViz",
    description:
      "An interactive 3D supply-chain risk analyzer that maps npm's most dangerous dependencies as a force-directed graph. Autonomous Jac agents investigate any package's blast radius in real time, combining risk heatmaps, attack replays, and vulnerability scanning.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/R1tjGuE_HS8",
    liveUrl: "https://supply-chain-frontend-nu.vercel.app/",
    githubUrl: "https://github.com/drPod/chainviz",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "Hijac",
    description:
      "A mobile-first AI agent that reads phone sensors in real time and performs automated actions based on learned patterns or user-defined rules. It detects episodes like picking up your phone or leaving a location, then suggests or executes relevant actions.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/SeP5gTAS4j0",
    liveUrl: "",
    githubUrl: "https://github.com/chess10kp/jachacks",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "SybilScope",
    description:
      "Detects fake wallet clusters in crypto airdrops by analyzing on-chain transaction history and wallet relationships. Combines Jac's native graph walker with GPT-4o reasoning to surface coordinated Sybils, like shared funding sources and identical transfer amounts, as visual clusters with evidence trails.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/6xC28FnsD9Y",
    liveUrl: "",
    githubUrl: "https://github.com/shrimannmyneni/sybilscope",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "Jac in the Block",
    description:
      "An accessible learning toolkit for Jac that combines block-based visual programming, real-time graph visualization, and VS Code dev tools. Drag-and-drop blocks generate live Jac code while showing the running graph, with linting and debugging for the leap to professional development.",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/embed/nxqcHtGdQfo",
    liveUrl: "https://jac-in-the-block.vercel.app/",
    githubUrl: "https://github.com/krishdeshmukhhh/jac-dev-tools",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
  {
    name: "PolyWatch",
    description:
      "An autonomous AI investigator for Polymarket that detects informed trading using a Tree-of-Thought reasoning engine across 26 specialized tools: market data, statistical analysis, news correlation, wallet profiling, and network analysis.",
    thumbnail: "",
    videoUrl: "",
    liveUrl: "",
    githubUrl: "https://devpost.com/software/polywatch",
    accent: "from-primary-orange via-rose-400 to-primary-yellow",
  },
];

const BuiltWithJaseciPage = () => {
  const [activeProject, setActiveProject] = useState(null);

  // Lock body scroll + close on ESC while modal is open
  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeProject]);

  return (
    <div className="bg-dark-bg text-white relative overflow-hidden">
      <SeoMeta
        title="Built with Jaseci"
        meta_title="Built with Jaseci: Companies & Projects in Production"
        description="Companies and projects shipping AI-native applications with Jac and the Jaseci stack."
        image="/images/logo.png"
      />

      {/* Warm radial wash — keeps the dark theme but gives the page heat */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249,115,22,0.05), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(247,147,30,0.04), transparent 65%)",
        }}
      ></div>

      {/* Subtle grid texture for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
        }}
      ></div>

      {/* Ambient color blobs — warm core with cool & rose counter-tones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-[5%] w-[34rem] h-[34rem] bg-primary-orange/12 rounded-full blur-[160px] animate-blob-pulse"></div>
        <div className="absolute top-[20%] right-[-8%] w-[36rem] h-[36rem] bg-primary-yellow/10 rounded-full blur-[180px] animate-blob-pulse animation-delay-2000"></div>
        <div className="absolute top-[45%] left-[-6%] w-[32rem] h-[32rem] bg-rose-400/10 rounded-full blur-[180px] animate-blob-pulse"></div>
        <div className="absolute top-[55%] right-[5%] w-[30rem] h-[30rem] bg-teal-400/8 rounded-full blur-[180px] animate-blob-pulse animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[38rem] h-[38rem] bg-fuchsia-500/9 rounded-full blur-[200px] animate-blob-pulse"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[28rem] h-[28rem] bg-violet-500/8 rounded-full blur-[180px] animate-blob-pulse animation-delay-2000"></div>
      </div>

      <main className="relative pt-16 md:pt-20">
        <HeroSection />
        <CompaniesSection />
        <ProjectsSection onPlay={setActiveProject} />
      </main>

      {activeProject && (
        <VideoModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradientShift 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

// =====================================================================
// Hero
// =====================================================================
const HeroSection = () => (
  <section className="relative pt-20 pb-16 text-center overflow-hidden">
    {/* Soft halo glow behind the title */}
    <div className="absolute inset-x-0 top-10 h-[26rem] pointer-events-none flex items-start justify-center">
      <div className="relative w-[44rem] h-[44rem] -mt-40">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_60%)]"></div>
        <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(247,147,30,0.07),transparent_65%)]"></div>
      </div>
    </div>

    <div className="container max-w-5xl mx-auto px-5 relative z-10">
      <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-primary-orange/40 bg-gradient-to-r from-primary-orange/20 to-primary-yellow/15 backdrop-blur-sm text-xs font-bold tracking-[0.2em] uppercase text-primary-orange shadow-[0_0_24px_-4px_rgba(249,115,22,0.55)]">
        ✦ Showcase
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
        <span className="block bg-gradient-to-b from-white via-orange-50 to-amber-100/90 bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
          Built with
        </span>
        <span className="block bg-gradient-to-r from-primary-orange via-primary-yellow to-primary-orange bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(249,115,22,0.45)] animate-gradient-x">
          Jaseci
        </span>
      </h1>

      <p className="text-lg md:text-xl text-orange-50/85 leading-relaxed max-w-2xl mx-auto">
        From idea to production, all in Jac. Meet the companies and projects
        shipping AI-native applications with Jac and the Jaseci stack.
      </p>
    </div>
  </section>
);

// =====================================================================
// Companies (Section 1)
// =====================================================================
const CompaniesSection = () => (
  <section className="relative py-20">
    {/* Soft warm wash so the section doesn't feel flat */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.08), transparent 70%)",
      }}
    ></div>

    <div className="container max-w-7xl mx-auto px-5 relative">
      <SectionHeader
        eyebrow="Companies & organizations"
        title="Building solutions with Jaseci"
        description="Industry teams using Jaseci to ship AI-native experiences in production."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {companies.map((c, i) => (
          <CompanyTile key={c.name} company={c} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const CompanyTile = ({ company, index }) => (
  <Link
    href={company.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={company.name}
    className="group relative block"
    style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
  >
    {/* Animated gradient border */}
    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary-orange/0 via-primary-yellow/0 to-primary-orange/0 group-hover:from-primary-orange/60 group-hover:via-primary-yellow/40 group-hover:to-primary-orange/60 transition-all duration-500 opacity-70 blur-sm"></div>

    <div className="relative h-full bg-gradient-to-br from-[#4a3622]/95 via-[#352618]/95 to-[#3d2c1c]/95 backdrop-blur-xl rounded-2xl border border-primary-yellow/45 p-6 transition-all duration-300 group-hover:border-primary-yellow/75 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary-yellow/40 shadow-[inset_0_1px_0_0_rgba(247,147,30,0.5),0_0_0_1px_rgba(247,147,30,0.08),0_10px_36px_-8px_rgba(0,0,0,0.6),0_0_24px_-8px_rgba(247,147,30,0.25)]">
      <div className="relative flex items-center justify-center h-20 mb-4">
        {/* Soft light pillow behind the logo to lift dark-mode-unfriendly marks */}
        <div className="absolute inset-x-6 inset-y-1 rounded-2xl bg-white/[0.92] shadow-[0_8px_30px_-6px_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_10px_40px_-6px_rgba(249,115,22,0.35)]"></div>
        <Image
          src={company.logo}
          alt={`${company.name} logo`}
          width={160}
          height={64}
          className="relative max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold text-orange-50 tracking-wide">
          {company.name}
        </h3>
        <p className="text-xs text-amber-200/55 mt-1">{company.blurb}</p>
      </div>

      {/* Corner shine */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary-orange/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  </Link>
);

// =====================================================================
// Projects (Section 2 — grid cards with video modal)
// =====================================================================
const ProjectsSection = ({ onPlay }) => (
  <section className="relative py-20">
    {/* Section accent: gradient hairline at the top + warm wash */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-orange/40 to-transparent"></div>
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 30% 0%, rgba(247,147,30,0.08), transparent 70%), radial-gradient(ellipse 70% 50% at 70% 100%, rgba(249,115,22,0.07), transparent 70%)",
      }}
    ></div>

    <div className="container max-w-7xl mx-auto px-5 relative">
      <SectionHeader
        eyebrow="Featured projects"
        title="What developers are building"
        description="A curated set of products, platforms, and research projects built with Jac and the Jaseci stack."
      />

      <div
        className={`mt-14 grid gap-7 ${
          projects.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : projects.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {projects.map((p, i) => (
          <ProjectCard
            key={p.name}
            project={p}
            index={i}
            onPlay={() => onPlay(p)}
          />
        ))}
      </div>
    </div>
  </section>
);

const AVATAR_PALETTE = [
  "from-primary-orange to-primary-yellow",
  "from-fuchsia-500 to-primary-orange",
  "from-blue-500 to-cyan-400",
  "from-emerald-400 to-primary-yellow",
  "from-violet-500 to-fuchsia-500",
];

const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&]+)/i,
    /youtu\.be\/([^?&]+)/i,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
};

const getDriveId = (url) => {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  return m ? m[1] : null;
};

const ProjectCard = ({ project, index, onPlay }) => {
  const [thumbErrored, setThumbErrored] = useState(false);
  const hasVideo = Boolean(project.videoUrl);
  const ytId = getYouTubeId(project.videoUrl);
  const driveId = getDriveId(project.videoUrl);
  const isMp4Video = /\.(mp4|webm|ogg)(\?.*)?$/i.test(project.videoUrl || "");
  const rawThumbnail =
    project.thumbnail ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null) ||
    (driveId
      ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w640`
      : null);
  const thumbnail = thumbErrored ? null : rawThumbnail;
  const isExternalThumb = thumbnail && /^https?:\/\//i.test(thumbnail);
  // Use the first frame of the mp4 as a thumbnail preview when nothing else is provided
  const mp4PreviewSrc =
    !thumbnail && isMp4Video ? `${project.videoUrl}#t=0.5` : null;

  return (
    <article
      className="group relative h-full"
      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.07}s both` }}
    >
      {/* Gradient halo */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-60 blur-md transition duration-500`}
      ></div>

      <div className="relative h-full flex flex-col bg-gradient-to-br from-[#5a4633] via-[#473628] to-[#52402e] rounded-2xl border border-orange-300/25 overflow-hidden transition-all duration-300 group-hover:border-primary-orange/55 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary-orange/25 shadow-[inset_0_1px_0_0_rgba(247,147,30,0.25),0_10px_36px_-8px_rgba(0,0,0,0.55),0_0_22px_-8px_rgba(247,147,30,0.2)]">
        {/* Top accent stripe */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${project.accent}`}
        ></div>

        {/* Body — flex-1 grows to absorb extra space so the video aligns across cards */}
        <div className="flex-1 px-6 pt-5 pb-4">
          <h3 className="text-2xl font-extrabold mb-2 tracking-tight pb-1 leading-tight bg-gradient-to-r from-primary-orange via-rose-300 to-primary-yellow bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(249,115,22,0.25)]">
            {project.name}
          </h3>
          <p className="text-sm text-orange-50/85 leading-relaxed">
            {project.description}
          </p>

          {project.award && (
            <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-yellow/30 bg-primary-yellow/10 text-[11px] font-semibold text-primary-yellow tracking-wide">
              <FaTrophy size={10} />
              {project.award}
            </div>
          )}
        </div>

        {/* Media / thumbnail with play overlay */}
        <button
          type="button"
          onClick={hasVideo ? onPlay : undefined}
          disabled={!hasVideo}
          aria-label={hasVideo ? `Play ${project.name} demo` : project.name}
          className={`relative block w-full aspect-video overflow-hidden ${
            hasVideo ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {/* Always-on warm gradient bg — visible if no thumbnail/video, or if external thumbnail fails to load */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3d3024] via-[#322619] to-[#251c14]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(247,147,30,0.15),transparent_60%)]"></div>
          </div>

          {/* Thumbnail or first-frame video preview, layered on top of the bg */}
          {thumbnail ? (
            isExternalThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setThumbErrored(true)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <Image
                src={thumbnail}
                alt={`${project.name} preview`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )
          ) : mp4PreviewSrc ? (
            <video
              src={mp4PreviewSrc}
              preload="metadata"
              muted
              playsInline
              aria-label={`${project.name} preview`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none"
            />
          ) : null}

          {/* Subtle dark overlay for legibility (only when there's content underneath) */}
          {(thumbnail || mp4PreviewSrc) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          )}

          {/* "Demo coming soon" label — only when there's no video at all */}
          {!hasVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                <FaPlay className="text-white/25 ml-1" size={20} />
              </div>
              <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-orange-50/60">
                Demo coming soon
              </div>
            </div>
          )}

          {/* Active play button overlay — only when there's a playable video */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25 shadow-2xl">
                <FaPlay className="text-white ml-1 drop-shadow" size={20} />
              </div>
            </div>
          )}
        </button>

        {/* Footer actions */}
        <div className="px-5 py-4 flex items-center gap-2 border-t border-orange-300/15 bg-[#3a2d22]/60">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-primary-orange to-primary-yellow shadow-md shadow-primary-orange/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-orange/35 transition-all duration-300"
            >
              <FaGlobe size={12} />
              Live App
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition"
            >
              <FaGithub size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

// =====================================================================
// Video modal (lightbox)
// =====================================================================
// Convert an embeddable video URL to its public/external watch URL so the
// "open externally" button takes the user to the full video page.
const toExternalVideoUrl = (url) => {
  if (!url) return url;
  // YouTube /embed/ → /watch
  const yt = url.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (yt) {
    const id = yt[1];
    const startMatch = url.match(/[?&]start=(\d+)/);
    const t = startMatch ? `&t=${startMatch[1]}s` : "";
    return `https://www.youtube.com/watch?v=${id}${t}`;
  }
  // Google Drive /preview → /view
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (drive) {
    return `https://drive.google.com/file/d/${drive[1]}/view`;
  }
  return url;
};

const VideoModal = ({ project, onClose }) => {
  const url = project.videoUrl || "";
  const isMp4 = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  const externalVideoUrl = toExternalVideoUrl(url);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} demo`}
    >
      <div className="min-h-full flex items-center justify-center px-4 pt-28 pb-8 sm:pt-32 sm:pb-12">
        <div
          className="relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action buttons anchored above the video so they always clear the page header */}
          <div className="absolute -top-12 right-0 flex items-center gap-2">
            {externalVideoUrl && (
              <a
                href={externalVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on YouTube"
                title="Watch on YouTube"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition"
              >
                <FaExternalLinkAlt size={14} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {url ? (
              isMp4 ? (
                <video
                  src={url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={url}
                  title={`${project.name} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-text/70 text-sm">
                No demo video available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Section header — pass full Tailwind class strings (Tailwind scans literals).
// =====================================================================
const SectionHeader = ({
  eyebrow,
  title,
  description,
  eyebrowClass = "text-primary-orange",
  eyebrowGlow = "rgba(249,115,22,0.5)",
  lineLeftClass = "bg-gradient-to-r from-transparent to-primary-orange/70",
  lineRightClass = "bg-gradient-to-l from-transparent to-primary-orange/70",
  titleClass = "bg-gradient-to-b from-white via-orange-50 to-amber-200/90",
  underlineClass = "bg-gradient-to-r from-transparent via-primary-orange to-transparent",
}) => (
  <div className="text-center max-w-3xl mx-auto">
    <div className="inline-flex items-center gap-2 mb-4">
      <span className={`h-px w-8 ${lineLeftClass}`}></span>
      <span
        className={`text-[11px] font-bold tracking-[0.28em] uppercase ${eyebrowClass}`}
        style={{ filter: `drop-shadow(0 0 12px ${eyebrowGlow})` }}
      >
        {eyebrow}
      </span>
      <span className={`h-px w-8 ${lineRightClass}`}></span>
    </div>
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-[1.15] pb-2 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)] ${titleClass}`}
    >
      {title}
    </h2>
    <div className={`h-0.5 mx-auto w-32 mb-5 ${underlineClass}`}></div>
    <p className="text-base md:text-lg text-orange-50/80 leading-relaxed">
      {description}
    </p>
  </div>
);

export default BuiltWithJaseciPage;
