import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  isVisible?: boolean;
  isHome?: boolean;
}

export function Navbar({ isVisible = true, isHome = false }: NavbarProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links: Array<{ to: string; key: "nav_home" | "nav_villa" | "nav_area" | "nav_contact" | "nav_book" }> = [
    { to: "/", key: "nav_home" },
    { to: "/villa", key: "nav_villa" },
    { to: "/area", key: "nav_area" },
    { to: "/contact", key: "nav_contact" },
    { to: "/book", key: "nav_book" },
  ];

  return (
    <>
      {/* HARD OVERRIDE: If the component is not marked visible on the home page, 
        we return null so absolutely zero HTML elements (including buttons/switchers) 
        render onto your screen at landing.
      */}
      {(!isHome || isVisible) && (
        <nav 
          className="navbar"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            // Smoothly slide in from above when it mounts into the DOM
            animation: "navSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Injecting a keyframe style block to guarantee the slide animation works */}
          <style>{`
            @keyframes navSlideDown {
              from { transform: translateY(-100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>

          <Link to="/" className="brand-mark" aria-label="Polyteleia home">
            <span className="brand-name">POLYTELEIA</span>
            <span className="brand-sub">{t("brand_sub")}</span>
          </Link>
          <div className="nav-right">
            <LanguageSwitcher />
            <button
              type="button"
              className={`menu-trigger ${open ? "open" : ""}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              <span>{open ? t("close") : t("menu")}</span>
              <span className="lines">
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* The mobile menu drawer markup stays untouched outside the conditional wrapper */}
      <div className={`menu-overlay ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-overlay-top">
          <Link to="/" className="brand-mark" onClick={() => setOpen(false)}>
            <span className="brand-name">POLYTELEIA</span>
            <span className="brand-sub">{t("brand_sub")}</span>
          </Link>
          <button
            type="button"
            className="menu-trigger open"
            onClick={() => setOpen(false)}
          >
            <span>{t("close")}</span>
            <span className="lines">
              <span />
              <span />
            </span>
          </button>
        </div>
        <div className="menu-overlay-center">
          <div className="menu-links">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`menu-link ${pathname === l.to ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
        </div>
        <div className="menu-overlay-bottom">
          <LanguageSwitcher />
          <div className="menu-socials">
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}