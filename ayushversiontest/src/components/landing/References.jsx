import { docs } from "../../lib/links.js";

export default function References() {
  return (
    <section id="ref-1" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-xl font-bold tracking-tight">
          References
        </h2>
        <div className="mx-auto mt-8 max-w-3xl border-l-4 border-black pl-5">
          <p className="text-sm leading-relaxed text-neutral-700">
            <span className="font-medium">[1]</span> Jayanaka L. Dantanarayana,
            Yiping Kang, Kugesan Sivasothynathan, Christopher Clarke, Baichuan
            Li, Savini Kashmira, Krisztian Flautner, Lingjia Tang, and Jason
            Mars. 2025.
          </p>
          <p className="mt-1 text-sm italic leading-relaxed text-neutral-700">
            "MTP: A Meaning-Typed Language Abstraction for AI-Integrated
            Programming."
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            Proc. ACM Program. Lang. 9, OOPSLA2, Article 314 (October 2025), 29
            pages.{" "}
            <a
              href={docs.reference}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://doi.org/10.1145/3763092
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
