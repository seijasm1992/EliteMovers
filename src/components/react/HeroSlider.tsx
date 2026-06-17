import { useEffect, useState } from "react";
import type { HeroSlide } from "../../types/content";

interface Props {
  slides: HeroSlide[];
  interval?: number;
}

/**
 * Background-only slider: crossfades between images and applies a slow Ken Burns
 * zoom to the active slide. Hero text/content stays fixed (rendered separately).
 */
export default function HeroSlider({ slides, interval = 6000 }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setActive((cur) => (cur + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      {slides.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: isActive ? 1 : 0 }}
          >
            <img
              src={slide.src}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              className="h-full w-full object-cover will-change-transform"
              style={{
                animation: isActive ? "kenburns 8s ease-out forwards" : "none",
              }}
            />
          </div>
        );
      })}
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/75" />
      <div className="absolute inset-0 bg-ink/20" />
    </div>
  );
}
