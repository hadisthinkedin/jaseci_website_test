export default function AnnouncementPill() {
  return (
    <a
      className="pill"
      href="https://jac-builder.jaseci.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      JacBuilder v2 is here!
      <span className="pill__arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}
