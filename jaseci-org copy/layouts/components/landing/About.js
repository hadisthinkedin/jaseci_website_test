import Image from "next/image";

const About = () => {
  return (
    <section className="py-20 bg-dark-bg border-t border-gray-800" id="about">
      <div className="max-w-3xl mx-auto text-center px-5">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold mb-5">
            Built by Nerds and Innovators
          </h2>
          <p className="text-lg text-primary-orange italic">
            ~ Imagine, Create, Launch ~
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-10 text-left">
          <div className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Jaseci Logo"
              width={80}
              height={80}
              className="rounded-3xl shadow-[0_10px_30px_rgba(255,107,53,0.3)]"
            />
          </div>
          <div className="flex-1">
            <p className="text-base leading-relaxed text-dark-text mb-5">
              Jac is an innovative programming language that extends Python's
              semantics while maintaining full interoperability with the Python
              ecosystem. Created by{" "}
              <strong>
                <a
                  href="https://github.com/marsninja"
                  target="_blank"
                  className="fancy-link"
                >
                  @marsninja
                </a>
              </strong>
              with contributors of{" "}
              <strong>
                <a
                  href="https://docs.jaseci.org/communityhub/top_contributors/"
                  className="fancy-link"
                >
                  Jac Hackers Everywhere
                </a>
              </strong>
              , it introduces cutting-edge programming models and abstractions
              specifically designed to minimize complexity and embrace
              AI-forward development.
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              Our mission is to automate categories of common software systems
              that typically require manual implementation, making advanced
              programming paradigms accessible to developers worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
