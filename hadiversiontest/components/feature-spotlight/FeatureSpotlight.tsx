/* Two-column "feature spotlight" — text + CTA on one side, large rounded
   media block on the other. Pattern adapted from a generic reference card;
   content + colors come from Jaseci's tokens.

   The heading is two-part: a main statement followed by a muted
   continuation (like "Do this big thing." + "and this supporting thing").

   Set `reversed` to put the media on the left for visual variety between
   stacked instances. */

type Props = {
  headingMain: string;
  headingMuted: string;
  ctaLabel: string;
  ctaHref: string;
  mediaSrc?: string;
  mediaPoster?: string;
  mediaAlt?: string;
  reversed?: boolean;
};

export default function FeatureSpotlight({
  headingMain,
  headingMuted,
  ctaLabel,
  ctaHref,
  mediaSrc,
  mediaPoster,
  mediaAlt,
  reversed = false,
}: Props) {
  return (
    <section
      className={`spotlight${reversed ? " spotlight--reversed" : ""}`}
      aria-label={headingMain}
    >
      <div className="spotlight__inner">
        <div className="spotlight__text">
          <h3 className="spotlight__heading">
            <span>{headingMain} </span>
            <span className="spotlight__heading-muted">{headingMuted}</span>
          </h3>
          <a className="spotlight__cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
        <div className="spotlight__media">
          {mediaSrc ? (
            mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".webm") ? (
              <video
                className="spotlight__video"
                src={mediaSrc}
                poster={mediaPoster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={mediaAlt}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="spotlight__video"
                src={mediaSrc}
                alt={mediaAlt ?? ""}
              />
            )
          ) : (
            <div className="spotlight__placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}
