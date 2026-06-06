import Carousel from "../Carousel.jsx";

const STUDIES = [
  {
    stat: "73%",
    qualifier: "More members completing a financial plan",
    quote:
      "Pocketnest turned passive account-holders into engaged members chasing real financial goals.",
    name: "Jordan Avery",
    title: "VP of Partnerships",
    company: "Pocketnest",
    initials: "JA",
  },
  {
    stat: "3×",
    qualifier: "Higher cross-sell conversion for partner institutions",
    quote:
      "We finally meet the next generation where they are, and the engagement data speaks for itself.",
    name: "Riley Morgan",
    title: "Head of Product",
    company: "Pocketnest",
    initials: "RM",
  },
  {
    stat: "<3 min",
    qualifier: "A week to move members' money forward",
    quote:
      "Behavioral nudges plus AI mean members actually finish what they start, not just sign up.",
    name: "Sam Patel",
    title: "Behavioral Science Lead",
    company: "Pocketnest",
    initials: "SP",
  },
];

function Study({ stat, qualifier, quote, name, title, company, initials }) {
  return (
    <div className="px-2">
      <div className="mx-auto max-w-2xl border border-black p-8 text-center md:p-12">
        <p className="text-6xl font-bold tracking-tight md:text-7xl">{stat}</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
          {qualifier}
        </p>
        <p className="mt-8 text-xl leading-relaxed">&ldquo;{quote}&rdquo;</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black text-xs font-bold">
            {initials}
          </span>
          <div className="text-left text-sm">
            <p className="font-medium">{name}</p>
            <p className="text-neutral-600">
              {title} · {company}
            </p>
          </div>
        </div>
        <a href="#" className="mt-6 inline-block text-sm font-medium underline">
          Read story →
        </a>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          Case studies
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Real teams, real numbers.
        </h2>
        <div className="mt-12">
          <Carousel slides={STUDIES.map((s) => <Study key={s.name} {...s} />)} interval={6000} />
        </div>
      </div>
    </section>
  );
}
