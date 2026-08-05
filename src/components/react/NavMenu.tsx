import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavItem, SiteConfig } from "../../types/content";

interface Props {
  navigation: NavItem[];
  site: SiteConfig;
}

const MOBILE_DRAWER_ID = "mobile-nav-drawer";

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
  site: SiteConfig;
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveAccordion(null);
    window.setTimeout(() => hamburgerRef.current?.focus(), 0);
  }, []);

  const openMobileMenu = useCallback(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(true);
  }, []);

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
    closeButtonRef.current?.focus();
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) {
          closeMobileMenu();
        } else {
          setOpenDropdown(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleBlur = (e: React.FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) {
      setOpenDropdown(null);
    }
  };

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const textColor = "text-white";
  const overlayVisible = openDropdown !== null;

  const mobileMenu = (
    <>
      {/* Overlay — portaled to body so fixed positioning is not broken by header backdrop-filter */}
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
              Call Now · <span className="font-medium">{site.phone}</span>
            </span>
          </a>
        </div>
      </div>
    </>
  );

  return (
    <header
      ref={navRef}
      onBlur={handleBlur}
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
        onMouseEnter={scheduleClose}
      />

      <nav className="container-x relative z-10 flex h-[var(--nav-h,4.75rem)] items-center justify-between gap-4">
        <a
          href="/"
          className="transition-transform hover:-translate-y-0.5"
          aria-label={`${site.name} home`}
        >
          <BrandBadge site={site} tone={scrolled ? "light" : "dark"} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isOpen = openDropdown === item.label;
            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <a
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-accent text-sm font-medium transition-colors ${textColor} ${
                    "hover:bg-white/10"
                  }`}
                  aria-haspopup={item.children ? "true" : undefined}
                  aria-expanded={item.children ? isOpen : undefined}
                  onFocus={() => item.children && openMenu(item.label)}
                >
                  {item.label}
                  {item.children && <ChevronIcon open={isOpen} />}
                </a>

                {item.children && (
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ${
                      isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                    onMouseEnter={() => openMenu(item.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="min-w-[16rem] rounded-[var(--radius-bubble)] border border-ink/8 bg-white p-2.5 shadow-bubble">
                      <ul className="grid gap-0.5">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className="block rounded-xl px-4 py-2.5 font-accent text-sm font-medium text-text-medium transition-colors hover:bg-offwhite hover:text-ink"
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
          className={`hidden items-center gap-2 rounded-full px-5 py-2.5 font-accent text-sm font-semibold transition-all lg:inline-flex ${
            scrolled
              ? "bg-ink text-white hover:bg-text-strong"
          : "bg-brand-yellow text-brand-primary hover:bg-[#ffe36f]"
          }`}
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
            className={`relative z-[220] flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${textColor} ${
              "hover:bg-white/10"
            }`}
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
