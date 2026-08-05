import { useEffect, useState } from "react";
import type { IncludedContent } from "../../types/content";

interface Props {
  content: IncludedContent;
}

const CheckIcon = () => (
  <svg
    className="mt-0.5 h-4 w-4 shrink-0 text-green"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function IncludedAccordion({ content }: Props) {
  const [openId, setOpenId] = useState(content.items[0]?.id ?? "");

  const activeItem =
    content.items.find((item) => item.id === openId) ?? content.items[0];

  useEffect(() => {
    content.items.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, [content.items]);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20">
      {/* Left: heading + image (aligned with accordion top) */}
      <div>
        <span className="eyebrow text-green">{content.eyebrow}</span>
        <h2 className="type-section-title mt-4 text-text-strong">
          {content.title}
        </h2>
        <p className="type-body-lead mt-4 max-w-md text-text-subtle sm:mt-5">
          {content.description}
        </p>

        <div
          className="relative mt-8 aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-neutral-soft sm:mt-10 lg:mt-12"
          aria-live="polite"
          aria-atomic="true"
        >
          {content.items.map((item, index) => {
            const isActive = item.id === activeItem.id;
            return (
              <img
                key={item.id}
                src={item.image}
                alt={isActive ? item.imageAlt : ""}
                aria-hidden={!isActive}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isActive
                    ? "z-[2] pointer-events-auto opacity-100"
                    : "z-[1] pointer-events-none opacity-0"
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Right: accordion — horizontal dividers only, green line on active item */}
      <div>
        {content.items.map((item, index) => {
          const open = item.id === openId;
          const isLast = index === content.items.length - 1;

          return (
            <div
              key={item.id}
              className={!isLast ? "border-b border-ink/10" : undefined}
            >
              <div
                className={`h-0.5 w-full transition-colors duration-300 motion-reduce:transition-none ${
                  open ? "bg-green" : "bg-transparent"
                }`}
                aria-hidden="true"
              />

              <h3 className="type-item-title">
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6 lg:py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  aria-expanded={open}
                  aria-controls={`panel-${item.id}`}
                  id={`trigger-${item.id}`}
                  onClick={() => setOpenId(item.id)}
                >
                  <span
                    className={`min-w-0 flex-1 ${
                      open
                        ? "font-bold text-ink"
                        : "font-medium text-text-strong group-hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center text-text-subtle transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
              </h3>

              <div
                id={`panel-${item.id}`}
                role="region"
                aria-labelledby={`trigger-${item.id}`}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 sm:pb-8">
                    <p className="text-base leading-relaxed text-text-subtle">
                      {item.description}
                    </p>
                    {item.includes.length > 0 && (
                      <ul className="mt-5 flex flex-col gap-3">
                        {item.includes.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-3 text-sm leading-relaxed text-text-medium"
                          >
                            <CheckIcon />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
