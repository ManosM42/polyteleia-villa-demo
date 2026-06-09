import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// --- LOCAL ASSET IMPORTS ---
import bgEnd from "../assets/end.jpeg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  useScrollAnimation();
  const { t } = useTranslation();

  return (
    <div 
      className="contact-page-fixed-wrapper"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.25)), url(${bgEnd})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "#ffffff"
      }}
    >
      {/* MINIMAL HERO SECTION */}
      <section className="page-hero minimal" style={{ paddingTop: "120px", paddingBottom: "40px" }}>
        <div className="page-hero-inner" style={{ textAlign: "center", textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>
          <span className="eyebrow" style={{ color: "#c5a880", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
            {t("contact_eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300 }}>{t("contact_title")}</h1>
        </div>
      </section>

      {/* CORE CONTACT MATRIX SECTION */}
      <section className="section" style={{ padding: "40px 0 100px 0" }}>
        <div className="container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          
          {/* LIQUID GLASS TWIN FRAME HOUSING */}
          <div className="contact-liquid-glass-card fade-up">
            
            {/* LEFT COLUMN: HIGH-CONTRAST BLURRED INFORMATION MATRIX */}
            <div className="contact-info-panel">
              <h2 className="display" style={{ fontSize: "2rem", fontWeight: 400, color: "#fcfaf5", marginBottom: "32px", letterSpacing: "0.5px" }}>
                {t("reach_us")}
              </h2>
              
              <div className="info-items-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="contact-info-item">
                  <span className="icon-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <a href="tel:+302810000000" className="info-text-link">+30 2810 000000</a>
                </div>

                <div className="contact-info-item">
                  <span className="icon-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </span>
                  <a href="mailto:info@polyteleia.gr" className="info-text-link">info@polyteleia.gr</a>
                </div>

                <div className="contact-info-item">
                  <span className="icon-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 22s-8-7.58-8-13a8 8 0 0 1 16 0c0 5.42-8 13-8 13z" />
                      <circle cx="12" cy="9" r="3" />
                    </svg>
                  </span>
                  <span className="info-text-static">{t("address_full")}</span>
                </div>
              </div>

              <hr className="gold-accent-line" />

              <p className="contact-editorial-note">
                {t("contact_note")}
              </p>
            </div>

            {/* RIGHT COLUMN: RE-ENGINEERED MAP ATTACHMENT WINDOW */}
            <div className="contact-map-panel">
              <iframe
                title="Polyteleia Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1328.6495883803489!2d25.23018550365675!3d35.29971911208043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149a5e86222c7939%3A0xcbcef8b845ae225c!2sPOLYTELIA%20%7C%20Luxury%20Living!5e0!3m2!1sel!2sgr!4v1781007886053!5m2!1sel!2sgr"
                loading="lazy"
                allowFullScreen
              />
            </div>

          </div>
          
        </div>
      </section>

      {/* Styled Global Components Block */}
      <style>{`
        /* Core Two-Column Liquid Glass Architectural Grid */
        .contact-liquid-glass-card {
          display: flex;
          min-height: 520px;
          border-radius: 32px;
          overflow: hidden;
          
          /* --- LIQUID GLASS --- */
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 100%);
          backdrop-filter: blur(28px) saturate(160%) brightness(88%);
          WebkitBackdropFilter: blur(28px) saturate(160%) brightness(88%);
          
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-top: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        /* Information Column Layout Rules */
        .contact-info-panel {
          flex: 1.1;
          padding: 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Structural row blocks for addresses and contacts */
        .contact-info-item {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* Glass Icon framing design */
        .icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #c5a880;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .info-text-link {
          color: #ffffff !important;
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.2s ease, transform 0.2s ease;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .info-text-link:hover {
          color: #c5a880 !important;
          transform: translateX(2px);
        }

        .info-text-static {
          color: #ffffff;
          font-size: 1.1rem;
          line-height: 1.5;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .gold-accent-line {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, #c5a880, rgba(255,255,255,0.05));
          width: 100%;
          margin: 36px 0 24px 0;
        }

        .contact-editorial-note {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        /* Map Segment Layout Window */
        .contact-map-panel {
          flex: 0.9;
          position: relative;
          background: rgba(0, 0, 0, 0.2);
        }

        .contact-map-panel iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          filter: grayscale(20%) contrast(105%) brightness(95%);
          transition: filter 0.3s ease;
        }

        .contact-liquid-glass-card:hover .contact-map-panel iframe {
          filter: grayscale(0%) contrast(100%) brightness(100%);
        }

        /* Responsive Mobile Layout Adjustments */
        @media (max-width: 868px) {
          .contact-liquid-glass-card {
            flex-direction: column;
            border-radius: 24px;
          }
          .contact-info-panel {
            padding: 40px 24px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .contact-map-panel {
            height: 350px;
            flex: none;
            width: 100%;
          }
          .contact-map-panel iframe {
            position: relative;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}