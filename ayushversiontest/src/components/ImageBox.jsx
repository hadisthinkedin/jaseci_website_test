// Black/white placeholder box marking where an image/visual goes.
const ratios = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[2/1]",
  tall: "aspect-[3/4]",
};

export default function ImageBox({ label = "Image", aspect = "video", className = "" }) {
  const ratio = ratios[aspect] || aspect;
  return (
    <div
      className={`flex w-full items-center justify-center border border-black bg-neutral-100 ${ratio} ${className}`}
    >
      <span className="px-4 text-center text-xs uppercase tracking-widest text-neutral-400">
        {label}
      </span>
    </div>
  );
}
