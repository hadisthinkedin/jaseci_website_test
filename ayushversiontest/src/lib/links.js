// Real jaseci.org links, copied from the live site source (config/menu.json,
// config/social.json, layouts/components/landing/Hero.js).

export const nav = [
  { name: "Docs", url: "https://docs.jaseci.org/learn/tour/", external: true },
  { name: "Community", url: "/community" },
  { name: "Built with Jaseci", url: "/built-with-jaseci" },
  { name: "About Us", url: "/about-us" },
  { name: "Research", url: "https://jaseci.engin.umich.edu/", external: true },
  { name: "Blogs", url: "https://blogs.jaseci.org/", external: true },
];

export const social = {
  github: "https://github.com/Jaseci-Labs/jaseci",
  discord: "https://discord.gg/6j3QNdtcN6",
  linkedin: "https://www.linkedin.com/company/jaseci-labs/",
  x: "https://x.com/Jaseci_Labs",
  email: "community@jaseci.org",
  docs: "https://docs.jaseci.org/",
};

export const hero = {
  install:
    "curl -fsSL https://raw.githubusercontent.com/jaseci-labs/jaseci/main/scripts/install.sh | bash",
  launch: "jac create myapp --use fullstack\ncd myapp && jac start main.jac",
  mcp: "pip install jac-mcp",
  docs: "https://docs.jaseci.org/quick-guide/",
  jacCoder: "https://jac-coder.jaseci.org/",
  jacBuilder: "https://jac-builder-studio.jaseci.org/",
};

export const docs = {
  jacClientSetup: "https://docs.jaseci.org/tutorials/fullstack/setup/",
  jacClientExamples:
    "https://github.com/jaseci-labs/jaseci/tree/main/jac-client/jac_client/examples",
  jacScale: "https://docs.jaseci.org/tutorials/production/kubernetes/",
  withLlm: "https://docs.jaseci.org/learn/jac-byllm/with_llm/",
  osp: "https://docs.jaseci.org/reference/language/osp/",
  langFoundation: "https://docs.jaseci.org/reference/language/foundation/",
  jacClientRef: "https://docs.jaseci.org/reference/plugins/jac-client/",
  jacScaleRef: "https://docs.jaseci.org/reference/plugins/jac-scale/",
  byllm: "https://www.byllm.ai/",
  reference: "https://dl.acm.org/doi/10.1145/3763092",
};
