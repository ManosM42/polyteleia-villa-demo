import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
// Import your logo from assets
import logoImg from "../assets/logo.jpg"; 

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
      {(!isHome || isVisible) && (
        <nav 
          className="navbar"
          style={{
            position: "fixed",
            top: "20px",            
            left: "50%", 
            zIndex: 100,
            borderRadius: "24px", /* More rounded for a premium look */
            padding: "16px 40px", /* Extra horizontal breathing space inside */
            
            /* Tightened layout width so it looks like a centralized floating dock */
            width: "92%",
            maxWidth: "800px", 
            
            /* --- LIQUID GLASS --- */
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)",
            backdropFilter: "blur(24px) saturate(160%) brightness(92%)", 
            WebkitBackdropFilter: "blur(24px) saturate(160%) brightness(92%)",
            
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)", 
            
            boxShadow: "0 15px 45px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
            animation: "navCenterSlideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <style>{`
            @keyframes navCenterSlideDown {
              from { transform: translate(-50%, -130%); opacity: 0; filter: blur(4px); }
              to { transform: translate(-50%, 0); opacity: 1; filter: blur(0); }
            }
            
            .navbar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              transition: transform 0.3s ease, border 0.3s ease, box-shadow 0.3s ease;
            }

            /* --- TEXT & ELEMENT SHADOWS --- */
            .navbar .brand-mark,
            .navbar .nav-right,
            .navbar .menu-trigger,
            .navbar .LanguageSwitcher {
              filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
              color: #ffffff !important; 
            }

            /* Compact, high-visibility menu capsule */
            .navbar .menu-trigger {
              background: rgba(0, 0, 0, 0.35) !important;
              padding: 10px 20px;
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.15);
              transition: all 0.2s ease;
              backdrop-filter: blur(8px); 
            }

            .navbar .menu-trigger:hover {
              background: rgba(255, 255, 255, 0.2) !important;
              border-color: rgba(255, 255, 255, 0.4);
              box-shadow: 0 0 14px rgba(197, 168, 128, 0.3);
            }

            /* --- LARGER LOGO DESIGN --- */
            .nav-logo-img {
              height: 75px; /* Significantly larger layout height on Mobile */
              width: auto;
              object-fit: contain;
              display: block;
              filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
              transition: height 0.3s ease;
            }

            /* Even larger logo on Desktop viewports */
            @media (min-width: 768px) {
              .nav-logo-img {
                height: 95px; 
              }
            }

            .navbar:hover {
              border: 1px solid rgba(197, 168, 128, 0.35);
              border-top: 1px solid rgba(255, 255, 255, 0.45);
              box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.25);
            }
          `}</style>

          <Link to="/" className="brand-mark" aria-label="Polyteleia home">
            <img 
              src={logoImg} 
              alt="Polyteleia Luxury Living Logo" 
              className="nav-logo-img"
            />
          </Link>
          
          <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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

      {/* Mobile menu drawer overlay remains untouched */}
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