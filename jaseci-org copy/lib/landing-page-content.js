import { HiCodeBracket, HiComputerDesktop, HiRocketLaunch, HiSparkles } from "react-icons/hi2";

export const gettingStartedSlides = [
  {
    icon: <HiCodeBracket className="w-8 h-8 text-primary-orange" />,
    title: "Jac Lang",
    description:
      "The core language that replaces Python, JavaScript, and C/Zig/Rust — with full native compatibility for PyPI, npm, and C-ABI. Build AI systems with graph-based Object-Spatial Programming.",
    link: "https://docs.jaseci.org/reference/language/foundation/",
    linkText: "Read Handbook",
  },
  {
    icon: <HiComputerDesktop className="w-8 h-8 text-primary-orange" />,
    title: "jac-client",
    description:
      "Build full-stack web applications entirely in Jac. React components, state management, and backend APIs in one file.",
    link: "https://docs.jaseci.org/reference/plugins/jac-client/",
    linkText: "Explore Client",
  },
  {
    icon: <HiRocketLaunch className="w-8 h-8 text-primary-orange" />,
    title: "jac-scale",
    description:
      "Zero to infinite scale without code changes. Deploy to Kubernetes with auto-provisioned databases and authentication.",
    link: "https://docs.jaseci.org/reference/plugins/jac-scale/",
    linkText: "Learn Scale",
  },
  {
    icon: <HiSparkles className="w-8 h-8 text-primary-orange" />,
    title: "byLLM",
    description:
      "AI integration without prompt engineering. Replace function bodies with LLMs.",
    link: "https://www.byllm.ai/",
    linkText: "Learn byLLM",
  },
];

export const featuresSlides = [
  {
    icon: "🐍",
    title: "Replaces Python, JavaScript & C/Zig/Rust",
    description:
      "Jac replaces Python, JavaScript, and C/Zig/Rust with full native compatibility. Import any PyPI package, use any npm package, and link with any C-ABI library.",
  },
  {
    icon: "🧠",
    title: "AI Without Prompt Engineering",
    description:
      "Replace function bodies with LLMs using Meaning Typed Programming. The function signature IS the specification - no complex prompts needed.",
  },
  {
    icon: "🌐",
    title: "Object-Spatial Programming",
    description:
      "Model data as traversable graphs with nodes and walkers. Perfect for knowledge graphs, AI agents, and complex data relationships.",
  },
  {
    icon: "🖥️",
    title: "Full-Stack in One Language",
    description:
      "Write React components, backend APIs, and AI integrations in a single .jac file. No more context switching between languages.",
  },
  {
    icon: "🚀",
    title: "Zero to Infinite Scale",
    description:
      "Deploy locally with jac start, scale to Kubernetes production with --scale flag. Same code, auto-provisioned infrastructure.",
  },
  {
    icon: "⚡",
    title: "One Command Deployment",
    description:
      "No Dockerfile, no Kubernetes manifests, no infrastructure setup. Just jac start app.jac --scale and you're in production.",
  },
];
