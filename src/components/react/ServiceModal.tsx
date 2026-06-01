import { useCallback, useEffect, useId, useRef } from "react";
import type { MovingService } from "../../types/content";

interface Props {
  service: MovingService | null;
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

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

export default function ServiceModal({
  service,
  isOpen,
  onClose,
  returnFocusRef,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [isOpen, onClose, returnFocusRef, trapFocus]);

  if (!isOpen || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-10"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 my-auto w-full max-w-3xl animate-fade-up overflow-hidden bg-white shadow-bubble"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[2.4/1]">
          <img
            src={service.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-text-subtle shadow-soft backdrop-blur-sm transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:right-6 sm:top-6"
            aria-label={`Close ${service.title} details`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="relative p-8 sm:p-10 lg:p-12">
          <div className="h-0.5 w-12 bg-green" aria-hidden="true" />

          <p className="eyebrow mt-6 text-green">Elite Moving Service</p>

          <h2
            id={titleId}
            className="mt-3 font-accent text-3xl font-bold leading-tight text-text-strong sm:text-4xl"
          >
            {service.title}
          </h2>

          <div id={descId} className="mt-8 space-y-5">
            <p className="text-base leading-relaxed text-text-medium sm:text-lg">
              {service.details}
            </p>
            <p className="text-base leading-relaxed text-text-subtle sm:text-[1.05rem]">
              {service.detailsExtended}
            </p>
          </div>

          {service.highlights.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-snug text-text-medium sm:text-[0.95rem]"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
