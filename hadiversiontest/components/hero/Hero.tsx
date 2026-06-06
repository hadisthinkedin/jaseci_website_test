import AnnouncementPill from "./AnnouncementPill";
import Headline from "./Headline";
import TypewriterDescription from "./TypewriterDescription";
import InstallBlock from "./InstallBlock";
import BenchmarkWidget from "./BenchmarkWidget";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__left">
          <AnnouncementPill />
          <Headline />
          <TypewriterDescription />
          <InstallBlock />
        </div>
        <div className="hero__right">
          <BenchmarkWidget />
        </div>
      </div>
    </section>
  );
}
