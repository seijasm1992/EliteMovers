import { useEffect, useRef, useState } from "react";
import { site } from "../../data/site";

const SMS_MESSAGE = "Hi, I'd like help planning my move.";
const smsNumber = site.phoneHref.replace(/^tel:/, "");
const encodedSmsMessage = encodeURIComponent(SMS_MESSAGE).replace(/'/g, "%27");
const smsHref = `sms:${smsNumber}?body=${encodedSmsMessage}`;

const isEditableField = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.matches("input, select, textarea");

export default function Contacto() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const form = linkRef.current?.closest("form");
    if (!form) return;

    let focusFrame: number | undefined;
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => setIsFormVisible(entry?.isIntersecting ?? false),
          {
            rootMargin: "-72px 0px -72px 0px",
            threshold: 0.01,
          },
        )
      : null;

    if (observer) {
      observer.observe(form);
    } else {
      setIsFormVisible(true);
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (focusFrame !== undefined) window.cancelAnimationFrame(focusFrame);
      setIsEditing(isEditableField(event.target));
    };
    const handleFocusOut = () => {
      focusFrame = window.requestAnimationFrame(() => {
        setIsEditing(form.contains(document.activeElement) && isEditableField(document.activeElement));
      });
    };

    form.addEventListener("focusin", handleFocusIn);
    form.addEventListener("focusout", handleFocusOut);

    return () => {
      observer?.disconnect();
      if (focusFrame !== undefined) window.cancelAnimationFrame(focusFrame);
      form.removeEventListener("focusin", handleFocusIn);
      form.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const isVisible = isFormVisible && !isEditing;

  return (
    <a
      ref={linkRef}
      href={smsHref}
      aria-label={`Send ${site.name} a text message`}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? undefined : -1}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 flex min-h-12 items-center gap-2 rounded-full border border-brand-primary/10 bg-brand-yellow px-4 py-3 font-accent text-sm font-extrabold text-brand-primary shadow-[0_14px_34px_rgba(2,12,21,0.28)] transition-[opacity,transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#ffe36f] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-yellow active:scale-[0.97] motion-reduce:translate-y-0 motion-reduce:transition-[opacity,background-color] motion-reduce:active:scale-100 lg:hidden ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 shrink-0"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-3.8-.8L3 21l1.7-4.4A8.3 8.3 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.5 8.4 8.4 0 0 1 9 8.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
      </svg>
      <span>Chat Us</span>
    </a>
  );
}
