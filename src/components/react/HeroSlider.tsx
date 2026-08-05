const VIDEO_MP4 = "/hero-slideshow.mp4";
const VIDEO_WEBM = "/hero-slideshow.webm";
const VIDEO_POSTER = "/hero-slideshow-poster.jpg";

/**
 * Background hero media. The slideshow is optimized for first-viewport playback
 * and falls back to the poster when the user prefers reduced motion.
 */
export default function HeroSlider() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      <img
        src={VIDEO_POSTER}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={VIDEO_POSTER}
      >
        <source src={VIDEO_WEBM} type="video/webm" />
        <source src={VIDEO_MP4} type="video/mp4" />
      </video>

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/75" />
      <div className="absolute inset-0 bg-ink/20" />
    </div>
  );
}
