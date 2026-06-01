import { useEffect, useRef, useState } from "react";
import type { NavItem, SiteConfig } from "../../types/content";

interface Props {
  navigation: NavItem[];
  site: SiteConfig;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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
    className="h-4 w-4"
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

export default function NavMenu({ navigation, site }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close dropdowns / mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close desktop dropdown when focus leaves the nav
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

  const dark = scrolled || mobileOpen; // dark text on light bg
  const textColor = dark ? "text-text-strong" : "text-white";
  const overlayVisible = openDropdown !== null;

  return (
    <header
      ref={navRef}
      onBlur={handleBlur}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        dark
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(17,17,17,0.08)] border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      {/* Subtle overlay over the page when a dropdown is open */}
      <div
        className={`fixed inset-0 -z-10 bg-ink/20 backdrop-blur-[1px] transition-opacity duration-300 ${
          overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onMouseEnter={scheduleClose}
      />

      <nav className="container-x flex h-[var(--nav-h,4.75rem)] items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#top"
          className={`group flex items-baseline gap-1 transition-colors ${textColor}`}
          aria-label={`${site.name} home`}
        >
          <span className="font-display text-2xl leading-none tracking-tight">
            {site.wordmark.primary}
            <span className="text-gold">.</span>
          </span>
          <span className="font-accent text-[0.6rem] font-semibold uppercase tracking-[0.4em] opacity-80">
            {site.wordmark.secondary}
          </span>
        </a>

        {/* Desktop center nav */}
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
                    dark ? "hover:bg-ink/5" : "hover:bg-white/10"
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
                        ? "visible opacity-100 translate-y-0"
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

        {/* Desktop right CTA */}
        <a
          href={site.phoneHref}
          className={`hidden items-center gap-2 rounded-full px-5 py-2.5 font-accent text-sm font-semibold transition-all lg:inline-flex ${
            dark
              ? "bg-ink text-white hover:bg-text-strong"
              : "bg-white text-ink hover:bg-gold"
          }`}
        >
          <PhoneIcon />
          <span className="flex flex-col leading-none">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider opacity-70">
              Call Now
            </span>
            <span>{site.phone}</span>
          </span>
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${textColor} ${
            dark ? "hover:bg-ink/5" : "hover:bg-white/10"
          }`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <div className="relative h-5 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "top-2.5 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "top-2.5 -rotate-45" : "top-4"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`absolute inset-x-0 top-full origin-top overflow-hidden bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-[calc(100vh-4.75rem)] border-t border-ink/5" : "max-h-0"
        }`}
      >
        <div className="container-x max-h-[calc(100vh-4.75rem)] overflow-y-auto py-4">
          <ul className="divide-y divide-ink/5">
            {navigation.map((item) => {
              const isOpen = mobileSection === item.label;
              return (
                <li key={item.label} className="py-1">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl px-2 py-3 text-left font-accent text-base font-semibold text-text-strong"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setMobileSection((cur) => (cur === item.label ? null : item.label))
                        }
                      >
                        {item.label}
                        <ChevronIcon open={isOpen} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <ul className="pb-2 pl-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className="block rounded-lg px-3 py-2.5 font-accent text-sm text-text-subtle transition-colors hover:bg-offwhite hover:text-ink"
                                onClick={() => setMobileOpen(false)}
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
                      className="block rounded-xl px-2 py-3 font-accent text-base font-semibold text-text-strong"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href={site.phoneHref}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 font-accent text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            <PhoneIcon />
            Call Now · {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
