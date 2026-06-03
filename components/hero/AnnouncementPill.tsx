export default function AnnouncementPill() {
  return (
    <a
      className="pill"
      href="https://jac-builder.jaseci.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Try Jac in your browser
      <span className="pill__arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}
