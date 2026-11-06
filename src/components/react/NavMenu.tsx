import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavItem, SiteConfig } from "../../types/content";

/** Only the fields the menu renders, so the island does not serialize the whole config. */
type NavSite = Pick<SiteConfig, "name" | "phone" | "phoneHref">;

interface Props {
  navigation: NavItem[];
  site: NavSite;
}

const MOBILE_DRAWER_ID = "mobile-nav-drawer";
/** Grace period before a desktop dropdown closes after the mouse leaves it. */
const CLOSE_DELAY_MS = 300;
/** Same width as Tailwind's `lg`, where the desktop menu replaces the drawer. */
const DESKTOP_QUERY = "(min-width: 64rem)";
const slugify = (label: string) => label.toLowerCase().replace(/\s+/g, "-");
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out ${
      open ? "rotate-180" : "rotate-0"
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

function BrandBadge({
  site,
  tone,
}: {
  site: NavSite;
  tone: "light" | "dark";
}) {
  return (
    <img
      src="/images/brand/proelite-movers-logo.webp"
      width={220}
      height={86}
      alt={`${site.name} logo`}
      className={`h-12 w-auto rounded-lg border object-contain p-0.5 transition-colors sm:h-14 ${
        tone === "dark" ? "border-brand-yellow/80 bg-brand-primary" : "border-brand-primary/15 bg-white"
      }`}
    />
  );
}

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

export default function NavMenu({ navigation, site }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Pointer type of the last press on a dropdown trigger: decides whether a click opens or navigates. */
  const lastPointerType = useRef<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const triggerRefs = useRef(new Map<string, HTMLAnchorElement>());

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenuNow = useCallback(
    (label: string) => {
      clearCloseTimer();
      setOpenMenu(label);
    },
    [clearCloseTimer],
  );

  const closeMenuNow = useCallback(() => {
    clearCloseTimer();
    setOpenMenu(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setOpenMenu(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  /**
   * Whether a point lies over a dropdown's trigger or its panel (the panel wrapper
   * includes the gap below the trigger). Uses geometry instead of hover events,
   * because some browsers report a pointer leave while the cursor is still on the menu.
   */
  const isInMenuZone = useCallback((label: string, x: number, y: number) => {
    const item = itemRefs.current.get(label);
    if (!item) return false;
    return [item.querySelector(":scope > a"), item.querySelector(":scope > div")].some((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveAccordion(null);
    window.setTimeout(() => hamburgerRef.current?.focus(), 0);
  }, []);

  const openMobileMenu = useCallback(() => {
    closeMenuNow();
    setIsMobileMenuOpen(true);
  }, [closeMenuNow]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  // Any press outside the open dropdown closes it, including the dimmed overlay.
  useEffect(() => {
    if (openMenu === null) return;
    const onPointerDown = (event: PointerEvent) => {
      const item = itemRefs.current.get(openMenu);
      if (item && event.target instanceof Node && item.contains(event.target)) return;
      if (isInMenuZone(openMenu, event.clientX, event.clientY)) return;
      closeMenuNow();
    };
    // While open, the mouse position alone decides: inside the menu cancels a pending
    // close, outside starts the grace period. Spurious leave events cannot close it.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (isInMenuZone(openMenu, event.clientX, event.clientY)) clearCloseTimer();
      else if (!closeTimer.current) scheduleClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [openMenu, closeMenuNow, clearCloseTimer, scheduleClose, isInMenuZone]);

  // Crossing the desktop breakpoint closes whichever menu no longer applies.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
        setActiveAccordion(null);
      } else {
        closeMenuNow();
      }
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [closeMenuNow]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const drawer = document.getElementById(MOBILE_DRAWER_ID);
    if (!drawer) return;

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    closeButtonRef.current?.focus();
    drawer.addEventListener("keydown", trapFocus);
    return () => drawer.removeEventListener("keydown", trapFocus);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isMobileMenuOpen) {
        closeMobileMenu();
      } else if (openMenu !== null) {
        const focusInside = itemRefs.current.get(openMenu)?.contains(document.activeElement);
        const trigger = triggerRefs.current.get(openMenu);
        closeMenuNow();
        if (focusInside) trigger?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen, closeMobileMenu, openMenu, closeMenuNow]);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const textColor = "text-white";
  const overlayVisible = openMenu !== null;

  const mobileMenu = (
    <>
      {/* Portaled overlay keeps fixed positioning outside the header backdrop filter. */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      {/* Drawer */}
      <div
        id={MOBILE_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`fixed inset-y-0 left-0 z-[210] flex w-[min(85vw,24rem)] flex-col bg-white shadow-bubble transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="h-1 shrink-0 bg-gold" aria-hidden="true" />

        <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-4">
          <div>
            <span className="eyebrow text-green">Navigation</span>
            <a href="/" aria-label={`${site.name} home`} onClick={closeMobileMenu}>
              <BrandBadge site={site} tone="light" />
            </a>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 text-text-strong transition-colors hover:border-ink/20"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-5 py-2">
          <ul className="divide-y divide-ink/8">
            {navigation.map((item) => {
              const isOpen = activeAccordion === item.label;
              const submenuId = `mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        id={`mobile-accordion-${submenuId}`}
                        className="flex w-full items-center justify-between py-4 text-left font-accent text-base font-semibold text-text-strong transition-colors hover:text-ink"
                        aria-expanded={isOpen}
                        aria-controls={submenuId}
                        onClick={() =>
                          setActiveAccordion((cur) => (cur === item.label ? null : item.label))
                        }
                      >
                        {item.label}
                        <ChevronIcon open={isOpen} />
                      </button>
                      <div
                        id={submenuId}
                        role="region"
                        aria-labelledby={`mobile-accordion-${submenuId}`}
                        aria-hidden={!isOpen}
                        inert={!isOpen}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="space-y-0.5 pb-3 pl-1">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className="block py-2.5 pl-3 font-accent text-sm font-medium text-text-subtle transition-colors hover:text-ink"
                                onClick={closeMobileMenu}
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block py-4 font-accent text-base font-semibold text-text-strong transition-colors hover:text-ink"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-ink/8 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a
            href={site.phoneHref}
            className="flex items-center justify-center gap-2.5 rounded-full bg-ink px-5 py-3.5 font-accent text-sm font-semibold text-white transition-colors hover:bg-text-strong"
            onClick={closeMobileMenu}
          >
            <PhoneIcon />
            <span>
              Call Now: <span className="font-medium">{site.phone}</span>
            </span>
          </a>
        </div>
      </div>
    </>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
          : ""
      }`}
    >
      {mounted && createPortal(mobileMenu, document.body)}

      {/* Desktop dropdown overlay */}
      <div
        className={`fixed inset-0 -z-10 bg-ink/20 backdrop-blur-[1px] transition-opacity duration-300 ${
          overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMenuNow}
      />

      <nav className="container-x relative z-10 flex h-[var(--nav-h,4.75rem)] items-center justify-between gap-4">
        <a
          href="/"
          className="transition-transform hover:-translate-y-0.5 focus-visible:outline-brand-yellow"
          aria-label={`${site.name} home`}
        >
          <BrandBadge site={site} tone={scrolled ? "light" : "dark"} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const hasMenu = Boolean(item.children);
            const isOpen = openMenu === item.label;
            const panelId = `desktop-submenu-${slugify(item.label)}`;
            // Fade out only when the last menu closes; when switching menus the old one hides at once.
            const panelState = isOpen
              ? "visible translate-y-0 opacity-100 transition-all duration-200"
              : openMenu !== null
                ? "invisible -translate-y-1 opacity-0 transition-none"
                : "invisible -translate-y-1 opacity-0 transition-all duration-200";
            return (
              <li
                key={item.label}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.label, el);
                  else itemRefs.current.delete(item.label);
                }}
                className="relative"
                onPointerEnter={(e) => {
                  if (hasMenu && e.pointerType === "mouse") openMenuNow(item.label);
                }}
                onPointerLeave={(e) => {
                  // Covers leaving the window, where no further pointermove arrives.
                  if (hasMenu && e.pointerType === "mouse" && !isInMenuZone(item.label, e.clientX, e.clientY)) {
                    scheduleClose();
                  }
                }}
                onBlur={(e) => {
                  // A null relatedTarget (e.g. Safari clicking a link) must not close the menu.
                  const next = e.relatedTarget;
                  if (isOpen && next instanceof Node && !e.currentTarget.contains(next)) {
                    closeMenuNow();
                  }
                }}
              >
                <a
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.label, el);
                    else triggerRefs.current.delete(item.label);
                  }}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-accent text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline-brand-yellow ${textColor}`}
                  aria-expanded={hasMenu ? isOpen : undefined}
                  aria-controls={hasMenu ? panelId : undefined}
                  onPointerDown={(e) => {
                    lastPointerType.current = e.pointerType;
                  }}
                  onClick={(e) => {
                    const pointer = lastPointerType.current;
                    lastPointerType.current = null;
                    if (!hasMenu) return;
                    // First tap opens the menu; a second tap on the open menu follows the link.
                    if ((pointer === "touch" || pointer === "pen") && !isOpen) {
                      e.preventDefault();
                      openMenuNow(item.label);
                      return;
                    }
                    closeMenuNow();
                  }}
                  onKeyDown={(e) => {
                    if (!hasMenu) return;
                    if (e.key === " ") {
                      e.preventDefault();
                      if (isOpen) closeMenuNow();
                      else openMenuNow(item.label);
                    } else if (e.key === "Enter" && !isOpen) {
                      e.preventDefault();
                      openMenuNow(item.label);
                    }
                  }}
                >
                  {item.label}
                  {item.children && <ChevronIcon open={isOpen} />}
                </a>

                {item.children && (
                  <div
                    id={panelId}
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 motion-reduce:translate-y-0 motion-reduce:transition-none ${panelState}`}
                  >
                    <div className="min-w-[16rem] rounded-[var(--radius-bubble)] border border-ink/8 bg-white p-2.5 shadow-bubble">
                      <ul className="grid gap-0.5">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className="block rounded-xl px-4 py-2.5 font-accent text-sm font-medium text-text-medium transition-colors hover:bg-offwhite hover:text-ink"
                              onClick={closeMenuNow}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <a
          href={site.phoneHref}
          className="hidden items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 font-accent text-sm font-semibold text-brand-primary transition-colors hover:bg-[#ffe36f] focus-visible:outline-white lg:inline-flex"
        >
          <PhoneIcon />
          <span className="flex flex-col leading-none">
            <span className="text-xs font-medium uppercase tracking-wider opacity-70">
              Call Now
            </span>
            <span>{site.phone}</span>
          </span>
        </a>

        {!isMobileMenuOpen && (
          <button
            ref={hamburgerRef}
            type="button"
            className={`relative z-[220] flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-brand-yellow lg:hidden ${textColor}`}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={MOBILE_DRAWER_ID}
            onClick={toggleMobileMenu}
          >
            <div className="relative h-5 w-6">
              <span className="absolute left-0 top-1 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out" />
              <span className="absolute left-0 top-2.5 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out" />
              <span className="absolute left-0 top-4 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out" />
            </div>
          </button>
        )}
      </nav>
    </header>
  );
}
