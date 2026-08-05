import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
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

  const fallbackImage = service.image.endsWith(".webp")
    ? service.image.replace(/\.webp$/, ".jpg")
    : service.image;
  const imageBase = service.image.replace(/\.webp$/, "");

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center overflow-y-auto p-3 sm:items-center sm:p-6 lg:p-10"
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
        className="relative z-10 flex max-h-[calc(100svh-1.5rem)] w-full max-w-4xl animate-fade-up flex-col overflow-hidden bg-white shadow-bubble sm:max-h-[calc(100svh-3rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-64 lg:h-72">
          <picture className="block h-full w-full">
            <source
              srcSet={`${imageBase}-480.webp 480w, ${imageBase}-720.webp 720w, ${service.image} 960w`}
              sizes="(min-width: 640px) 56rem, calc(100vw - 1.5rem)"
              type="image/webp"
            />
            <img
              src={fallbackImage}
              width={960}
              height={720}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </picture>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-text-subtle shadow-soft backdrop-blur-sm transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:right-6 sm:top-6"
            aria-label={`Close ${service.title} details`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="relative overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="h-0.5 w-12 bg-green" aria-hidden="true" />

          <p className="eyebrow mt-6 text-green">Service Details</p>

          <h2
            id={titleId}
            className="type-ui-card-title mt-3 text-pretty text-text-strong"
          >
            {service.title}
          </h2>

          <div id={descId} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            <p className="text-base leading-relaxed text-text-medium sm:text-lg">
              {service.details}
            </p>
            <p className="type-body-lead text-text-subtle">
              {service.detailsExtended}
            </p>
          </div>

          {service.highlights.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-text-medium"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
