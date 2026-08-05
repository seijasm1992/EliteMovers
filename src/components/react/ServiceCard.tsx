import type { MovingService } from "../../types/content";

interface Props {
  service: MovingService;
  onMoreInfo: (
    service: MovingService,
    trigger: HTMLButtonElement,
  ) => void;
}

const ChevronIcon = () => (
  <svg
    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function ServiceCard({ service, onMoreInfo }: Props) {
  const fallbackImage = service.image.endsWith(".webp")
    ? service.image.replace(/\.webp$/, ".jpg")
    : service.image;

  return (
    <article
      className="group flex h-full flex-col gap-4 sm:gap-7"
    >
      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden">
        <picture className="block h-full w-full">
          <source srcSet={service.image} type="image/webp" />
          <img
            src={fallbackImage}
            alt={service.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </picture>
      </div>

      <div className="flex flex-1 flex-col bg-white p-7 sm:min-h-[300px] sm:p-12">
        <h3 className="type-ui-card-title text-pretty text-text-strong">
          {service.title}
        </h3>

        <p className="type-body-lead mt-4 flex-1 text-text-subtle sm:mt-5">
          {service.description}
        </p>

        <button
          type="button"
          onClick={(event) => onMoreInfo(service, event.currentTarget)}
          className="type-label group/btn mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-7 text-ink transition-colors hover:text-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:pt-10"
          aria-haspopup="dialog"
        >
          {service.buttonLabel}
          <ChevronIcon />
        </button>
      </div>
    </article>
  );
}
