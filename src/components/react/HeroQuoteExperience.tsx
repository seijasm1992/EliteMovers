import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QuoteFormContent } from "../../types/content";
import type { QuoteFormValues } from "../../lib/validations/quoteSchema";
import QuoteForm from "./QuoteForm";

interface Props {
  content: QuoteFormContent;
  geoapifyApiKey?: string;
}

const homeSizeLabels: Record<NonNullable<QuoteFormValues["homeSize"]>, string> = {
  studio: "Studio",
  "one-bedroom": "1 Bedroom",
  "two-bedroom": "2 Bedrooms",
  "three-bedroom": "3 Bedrooms",
  "four-plus": "4+ Bedrooms",
};

const formatMoveDate = (value?: string) => {
  if (!value) return "Flexible";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf())
    ? "Flexible"
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function HeroQuoteExperience({ content, geoapifyApiKey }: Props) {
  const [move, setMove] = useState<Partial<QuoteFormValues>>({});
  const [routeAnimationId, setRouteAnimationId] = useState(0);
  const wasRouteReady = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const updateMove = useCallback((values: Partial<QuoteFormValues>) => setMove(values), []);
  const origin = move.originCity?.trim() || "Origin";
  const destination = move.destinationCity?.trim() || "Destination";
  const routeReady = Boolean(move.originCity?.trim() && move.destinationCity?.trim());
  const moveSize = useMemo(() => move.homeSize ? homeSizeLabels[move.homeSize] : "Not selected", [move.homeSize]);

  useEffect(() => {
    if (routeReady && !wasRouteReady.current) {
      setRouteAnimationId((current) => current + 1);
    }
    wasRouteReady.current = routeReady;
  }, [routeReady]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateVideoPlayback = () => {
      if (mediaQuery.matches) {
        videoRef.current?.pause();
      } else {
        void videoRef.current?.play().catch(() => undefined);
      }
    };
    updateVideoPlayback();
    mediaQuery.addEventListener("change", updateVideoPlayback);
    return () => mediaQuery.removeEventListener("change", updateVideoPlayback);
  }, []);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,1.72fr)_minmax(23rem,0.95fr)] lg:items-stretch">
      <div className="relative min-h-[32rem] overflow-hidden rounded-2xl bg-brand-primary-soft sm:min-h-[39rem] lg:min-h-[calc(100svh-8rem)]">
        <video ref={videoRef} autoPlay muted loop playsInline poster="/images/hero/movers-loading.webp" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[50%_48%] brightness-[0.88] saturate-[0.9]">
          <source src="/images/hero/movers-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/45 via-transparent to-brand-primary/55" aria-hidden="true" />
        <div className="hero-image-light absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-brand-primary/75 to-transparent" aria-hidden="true" />
        <p className="absolute left-6 top-6 font-accent text-xs font-bold uppercase tracking-[0.13em] text-white sm:left-10 sm:top-10 sm:text-sm lg:left-12 lg:top-12">Free moving cost calculator <span aria-hidden="true">→</span></p>

        <aside aria-label="Your move at a glance" className="absolute left-6 right-6 top-20 rounded-xl border border-white/15 bg-brand-primary/85 p-4 text-white shadow-[0_12px_28px_rgba(2,12,21,0.25)] backdrop-blur-sm transition-[transform,opacity] duration-300 motion-reduce:transition-none sm:left-10 sm:right-auto sm:top-24 sm:w-[22rem] lg:bottom-10 lg:left-12 lg:top-auto">
          <p className="font-accent text-xs font-bold uppercase tracking-[0.12em] text-brand-yellow">Your move at a glance</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="max-w-[7.5rem] truncate font-accent text-sm font-bold sm:max-w-[8.5rem]">{origin}</span>
            <span className={`relative h-px flex-1 transition-colors duration-300 motion-reduce:transition-none ${routeReady ? "bg-brand-yellow" : "bg-white/30"}`} aria-hidden="true">
              {routeReady && <span key={routeAnimationId} className="route-connector-spark absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-brand-yellow shadow-[0_0_12px_rgba(255,216,77,0.95)]" />}
              <span className={`absolute -right-0.5 -top-1.5 h-3 w-3 rounded-full border-2 border-brand-primary transition-colors duration-300 motion-reduce:transition-none ${routeReady ? "bg-brand-yellow" : "bg-white/30"}`} />
            </span>
            <span className="max-w-[7.5rem] truncate text-right font-accent text-sm font-bold sm:max-w-[8.5rem]">{destination}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/12 pt-3 text-xs">
            <div><dt className="text-white/60">Moving date</dt><dd className="mt-1 font-semibold text-white">{formatMoveDate(move.moveDate)}</dd></div>
            <div><dt className="text-white/60">Move size</dt><dd className="mt-1 font-semibold text-white">{moveSize}</dd></div>
          </dl>
        </aside>
      </div>
      <div id="hero-quote" className="scroll-mt-24 lg:flex lg:flex-col lg:justify-start">
        <QuoteForm content={content} variant="hero" onValuesChange={updateMove} geoapifyApiKey={geoapifyApiKey} />
      </div>
    </div>
  );
}
