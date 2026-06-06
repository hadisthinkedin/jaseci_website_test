import Link from "next/link";
import SeoMeta from "@layouts/partials/SeoMeta";
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaNewspaper,
} from "react-icons/fa";

// --- Data for Cards ---
const channels = [
  {
    icon: <FaDiscord size={24} />,
    title: "Discord",
    description: "Jump into the conversation and get help from the community.",
    href: "https://discord.gg/6j3QNdtcN6",
    cta: "Visit Discord",
  },
  {
    icon: <FaGithub size={24} />,
    title: "GitHub",
    description: "Have an idea or found a bug? Help us improve Jaseci.",
    href: "https://github.com/jaseci-labs/jaseci",
    cta: "Visit GitHub",
  },
  {
    icon: <FaLinkedin size={24} />,
    title: "LinkedIn",
    description: "Follow our journey and connect with the team professionally.",
    href: "https://www.linkedin.com/company/jaseci-labs/",
    cta: "Visit LinkedIn",
  },
  {
    icon: <FaNewspaper size={24} />,
    title: "Newsletter",
    description:
      "Read our biweekly newsletter for the latest updates and insights.",
    href: "https://newsletter.jaseci.org/",
    cta: "Visit Newsletter",
  },
];

// --- Main Page Component ---
const CommunityPage = () => {
  return (
    <div className="bg-community-background text-community-text">
      <SeoMeta
        title="Community Hub - Jaseci"
        description="Build the Future of AI with the Jaseci Community. Connect, learn, and contribute."
      />

      <main className="pt-16 md:pt-20">
        <HeroSection />
        <ChannelsSection />
        <ContactSection />
      </main>
    </div>
  );
};

// --- Section Components ---

const HeroSection = () => (
  <section className="relative py-14 text-center overflow-hidden">
    <div className="absolute inset-0 bg-radial-gradient from-about-background/50 via-[rgba(109,40,217,0.1)] to-about-background"></div>
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-orange/10 rounded-full filter blur-3xl animate-blob-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-yellow/5 rounded-full filter blur-3xl animate-blob-pulse animation-delay-2000"></div>
    </div>
    <div className="container relative z-10 max-w-4xl mx-auto px-5">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-primary text-transparent bg-clip-text">
        Community
      </h1>
      <div className="my-6 inline-block">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Build the Future of AI with the Jaseci Community
        </h2>
      </div>
      <p className="text-lg leading-relaxed max-w-3xl mx-auto text-community-text">
        Whether you&apos;re a developer building your first program, a
        researcher pushing the boundaries of what&apos;s possible, or an
        enthusiast exploring the future of technology, this is your hub to
        connect, learn, and contribute.
      </p>
      <p className="mt-4 font-semibold text-community-primary">
        Join us in building the next generation of AI applications.
      </p>
    </div>
  </section>
);

const ChannelsSection = () => (
  <section className="py-16">
    <div className="container max-w-5xl mx-auto px-5">
      <h2 className="text-center font-extrabold text-3xl mb-8">
        Connect & Discuss
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {channels.map((card) => (
          <article
            key={card.title}
            className="bg-community-card-bg border border-community-border rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-community-card-bg-hover hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-community-primary">
              {card.icon}
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-community-muted flex-grow mb-6">
              {card.description}
            </p>
            <Link
              href={card.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 font-semibold text-base px-5 py-2.5 rounded-lg border-2 border-community-primary text-community-primary transition-all duration-300 hover:bg-community-primary hover:text-black"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-20 text-center">
    <div className="container max-w-2xl mx-auto px-5">
      <h2 className="font-extrabold text-3xl mb-4">
        Have a Question or Feedback?
      </h2>
      <p className="text-community-muted leading-relaxed mb-6">
        For general inquiries, partnership opportunities, or feedback about the
        community itself, please don&apos;t hesitate to reach out to us
        directly.
      </p>
      <Link
        href="mailto:community@jaseci.org"
        className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-6 py-3 rounded-lg border-2 border-community-primary bg-community-primary text-black transition-all duration-300 hover:bg-primary-orange/80 hover:border-primary-orange/80"
      >
        <FaEnvelope />
        Send Email
      </Link>
    </div>
  </section>
);

export default CommunityPage;
