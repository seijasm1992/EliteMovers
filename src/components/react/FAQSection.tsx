import { useMemo, useState } from "react";
import type { FAQItem } from "../../types/content";

interface Props {
  items: FAQItem[];
}

const MAX_VISIBLE_ITEMS = 6;
const FAQ_ROW_STAGGER_MS = 35;

const getCategoryItems = (items: FAQItem[], category: string) =>
  items
    .filter((item) => item.category === category)
    .slice(0, MAX_VISIBLE_ITEMS);

export default function FAQSection({ items }: Props) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  );
  const initialCategory = categories[0] ?? "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openIds, setOpenIds] = useState<Set<string>>(
    () =>
      new Set(
        getCategoryItems(items, initialCategory)
          .slice(0, 2)
          .map((item) => item.id),
      ),
  );

  const visibleItems = useMemo(
    () => getCategoryItems(items, activeCategory),
    [activeCategory, items],
  );

  const selectCategory = (category: string) => {
    if (category === activeCategory) return;

    const nextItems = getCategoryItems(items, category);
    setActiveCategory(category);
    setOpenIds(new Set(nextItems.slice(0, 2).map((item) => item.id)));
  };

  const toggleItem = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (categories.length === 0) return null;

  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-b border-ink/10"
        role="group"
        aria-label="FAQ categories"
      >
        {categories.map((category) => {
          const active = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => selectCategory(category)}
              className={`relative min-h-11 px-1 pb-3 pt-2 font-accent text-xs font-semibold transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-green after:transition-transform after:duration-200 after:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] sm:text-sm motion-reduce:transition-none motion-reduce:after:transition-none ${
                active
                  ? "text-green after:scale-x-100"
                  : "text-text-subtle hover:text-text-strong"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        className="mt-8 grid sm:grid-cols-2 sm:gap-x-10 lg:mt-10 lg:gap-x-14"
        aria-live="polite"
      >
        {visibleItems.map((item, index) => {
          const open = openIds.has(item.id);
          const triggerId = `faq-trigger-${item.id}`;
          const panelId = `faq-panel-${item.id}`;

          return (
            <article
              key={`${activeCategory}-${item.id}`}
              className="faq-filter-enter relative border-b border-ink/10"
              style={{ animationDelay: `${index * FAQ_ROW_STAGGER_MS}ms` }}
            >
              <span
                className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left bg-green transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  open ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden="true"
              />

              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="group flex w-full items-center justify-between gap-5 py-5 text-left sm:min-h-[4.5rem] sm:py-6"
                >
                  <span
                    className={`font-accent text-[0.95rem] leading-snug transition-colors duration-200 sm:text-base motion-reduce:transition-none ${
                      open
                        ? "font-bold text-ink"
                        : "font-semibold text-text-strong group-hover:text-green"
                    }`}
                  >
                    {item.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-90 motion-reduce:scale-100 motion-reduce:transition-none ${
                      open
                        ? "rotate-180 scale-105 bg-green text-white ring-4 ring-green/10"
                        : "bg-ink/[0.04] text-text-subtle group-hover:bg-green/10 group-hover:text-green"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-4 w-4"
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
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`max-w-[34rem] pb-6 pr-10 font-accent text-sm leading-relaxed text-text-subtle transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none ${
                      open
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-1.5 opacity-0"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
