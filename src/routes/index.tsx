import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { TranslationKey } from "@/lib/translations";
import image from "@/assets/slider-1.jpg";
import image2 from "@/assets/slider-2.jpg";
import image3 from "@/assets/slider-3.jpg";
import image4 from "@/assets/slider-4.jpg";
import image5 from "@/assets/slider-5.jpg";
import image6 from "@/assets/slider-6.jpg";
import image7 from "@/assets/slider-7.jpg";
import image8 from "@/assets/slider-8.jpg";
import image9 from "@/assets/slider-9.jpg";
import image10 from "@/assets/slider-10.jpg";

import startFrame from "@/assets/start.jpeg";
import endFrame   from "@/assets/end.jpeg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// ─── Data ────────────────────────────────────────────────────────────────────

const GALLERY_IMAGES = [image, image2, image3, image4, image5, image6, image7, image8, image9, image10];

const FACILITIES: Array<{ key: TranslationKey; icon: ReactNode }> = [
  { key: "fac_pool",     icon: <PoolIcon /> },
  { key: "fac_bedrooms", icon: <BedIcon /> },
  { key: "fac_baths",    icon: <BathIcon /> },
  { key: "fac_kitchen",  icon: <KitchenIcon /> },
  { key: "fac_bbq",      icon: <BbqIcon /> },
  { key: "fac_lounge",   icon: <LoungeIcon /> },
  { key: "fac_wifi",     icon: <WifiIcon /> },
  { key: "fac_ac",       icon: <AcIcon /> },
  { key: "fac_tv",       icon: <TvIcon /> },
  { key: "fac_house",    icon: <HouseIcon /> },
  { key: "fac_parking",  icon: <ParkingIcon /> },
  { key: "fac_roof",     icon: <RoofIcon /> },
];

const REVIEWS: Array<{ key: TranslationKey; name: string; country: string }> = [
  { key: "review_1", name: "Sarah M.",    country: "United Kingdom" },
  { key: "review_2", name: "François D.", country: "France" },
  { key: "review_3", name: "Marco V.",    country: "Italy" },
  { key: "review_4", name: "Anna K.",     country: "Germany" },
  { key: "review_5", name: "Nikos P.",    country: "Greece" },
];

// ─── Scroll progress hook ─────────────────────────────────────────────────────

function useScrollProgress(startPx: number, endPx: number) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setProgress(Math.min(1, Math.max(0, (y - startPx) / (endPx - startPx))));
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [startPx, endPx]);
  return progress;
}

// ─── HomePage ────────────────────────────────────────────────────────────────

function HomePage() {
  useScrollAnimation();
  const { t } = useTranslation();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);

  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Inject Google Fonts for Playfair Display + Jost
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    // Override CSS variables used throughout the app
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      :root {
        --font-display: 'Playfair Display', Georgia, serif;
        --font-body:    'Jost', system-ui, sans-serif;
      }
      html, body, #root, [data-reactroot], .app-wrapper, main {
        background: transparent !important;
        background-color: transparent !important;
        font-family: var(--font-body);
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      link.remove();
      styleEl.remove();
    };
  }, []);

  const startFadeProgress = useScrollProgress(vh * 0.10, vh * 0.75);
  const endFadeProgress   = useScrollProgress(vh * 0.10, vh * 0.70);

  const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const startOpacity = 1 - ease(startFadeProgress);
  const endOpacity   = ease(endFadeProgress);

  const ctaOpacity    = Math.max(0, (startFadeProgress - 0.45) / 0.55);
  const ctaTranslateY = (1 - ctaOpacity) * 50;
  const scrollIndicatorOpacity = Math.max(0, 1 - startFadeProgress * 3);

  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined" ? window.innerHeight > window.innerWidth : false
  );
  useEffect(() => {
    const update = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    update();
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const bgSize = isPortrait ? "auto 100svh" : "cover";

  return (
    <>
      <style>{`
        @keyframes marqueeLeftToRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .reviews-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marqueeLeftToRight 35s linear infinite;
        }
      `}</style>

      {/* ── Layer 1: start.jpeg ─── */}
      <div
        aria-hidden
        style={{
          position:           "fixed",
          inset:              0,
          zIndex:             -2,
          pointerEvents:      "none",
          backgroundImage:    `url(${startFrame})`,
          backgroundRepeat:   "no-repeat",
          backgroundSize:     bgSize,
          backgroundPosition: "center center",
          opacity:            startOpacity,
          willChange:         "opacity",
          transition:         "opacity 0.05s linear",
        }}
      />

      {/* ── Layer 2: end.jpeg ──── */}
      <div
        aria-hidden
        style={{
          position:           "fixed",
          inset:              0,
          zIndex:             -1,
          pointerEvents:      "none",
          backgroundImage:    `url(${endFrame})`,
          backgroundRepeat:   "no-repeat",
          backgroundSize:     bgSize,
          backgroundPosition: isPortrait ? "25% center" : "center center",
          opacity:            endOpacity,
          willChange:         "opacity",
          transition:         "opacity 0.05s linear",
        }}
      >
        <div
          style={{
            position:      "absolute",
            inset:         0,
            background:    "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ═══ HERO ═══ */}
      <section
        style={{
          position:       "relative",
          zIndex:         1,
          height:         "100svh",
          minHeight:      "100vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "transparent",
        }}
      >
        <div
          className="scroll-indicator"
          style={{ opacity: scrollIndicatorOpacity, pointerEvents: "none" }}
        >
          <span className="line" />
          <span className="label" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.3em", fontSize: "0.65rem" }}>
            {t("scroll")}
          </span>
        </div>
      </section>

      {/* ── Hero CTA ─────────── */}
      <div
        style={{
          position:      "relative",
          zIndex:        1,
          textAlign:     "center",
          color:         "#fff",
          padding:       "60px 24px 80px",
          opacity:       ctaOpacity,
          transform:     `translateY(${ctaTranslateY}px)`,
          willChange:    "opacity, transform",
          pointerEvents: ctaOpacity < 0.05 ? "none" : "auto",
          transition:    "opacity 0.05s, transform 0.05s",
        }}
      >
        <span
          style={{
            color:         "var(--color-gold, #c9a84c)",
            letterSpacing: "0.35em",
            fontSize:      "0.68rem",
            textTransform: "uppercase",
            display:       "block",
            marginBottom:  24,
            fontWeight:    500,
            fontFamily:    "var(--font-body)",
          }}
        >
          {t("hero_eyebrow")}
        </span>
        <h1
          style={{
            fontFamily:    "var(--font-display)",
            fontSize:      "clamp(3rem, 7.5vw, 6.5rem)",
            fontWeight:    700,
            letterSpacing: "0.02em",
            color:         "#fff",
            margin:        "0 0 24px",
            lineHeight:    1.1,
            textShadow:    "0 2px 40px rgba(0,0,0,0.5)",
          }}
        >
          {t("hero_1_title")}
        </h1>
        <p
          style={{
            fontFamily:    "var(--font-body)",
            fontSize:      "clamp(1rem, 1.6vw, 1.25rem)",
            color:         "rgba(255,255,255,0.82)",
            marginBottom:  48,
            fontWeight:    300,
            letterSpacing: "0.06em",
            textShadow:    "0 1px 20px rgba(0,0,0,0.5)",
          }}
        >
          {t("hero_1_sub")}
        </p>
        <Link to="/villa" className="btn btn-outline">
          {t("explore_villa")}
        </Link>
      </div>

      {/* ═══ STATS STRIP ═══ */}
      <section style={liquidGlassSection}>
        <div className="container">
          <div className="stats-grid stagger-parent">
            {[
              { num: "2",  label: t("bedrooms") },
              { num: "2",  label: t("pool") },
              { num: "5★", label: t("rating") },
            ].map(({ num, label }) => (
              <div key={label as string} className="stagger-child fade-up" style={{ color: "#fff", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize:   "clamp(2.8rem, 6vw, 4.5rem)",
                    fontWeight: 700,
                    color:      "var(--color-gold, #c9a84c)",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily:    "var(--font-body)",
                    fontSize:      "0.68rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         "rgba(255,255,255,0.65)",
                    marginTop:     10,
                    fontWeight:    500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3D GALLERY ═══ */}
      <section className="section gallery-3d" style={transparentSection}>
        <div className="container text-center">
          <span className="eyebrow fade-up" style={eyebrowStyle}>{t("the_space")}</span>
          <h2 className="display fade-up" style={sectionTitleStyle}>{t("visual_journey")}</h2>
        </div>
        <div className="gallery-stage">
          <button
            className="gallery-arrow left"
            onClick={() => setGalleryIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="gallery-track">
            {GALLERY_IMAGES.map((src, i) => {
              const diff = i - galleryIdx;
              const total = GALLERY_IMAGES.length;
              let norm = diff;
              if (norm > total / 2) norm -= total;
              if (norm < -total / 2) norm += total;
              const abs = Math.abs(norm);
              if (abs > 2) return null;
              return (
                <div
                  key={i}
                  className="gallery-card"
                  style={{
                    transform:     `translateX(${norm * 60}%) translateZ(${-abs * 200}px) rotateY(${norm * -35}deg)`,
                    opacity:       abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25,
                    zIndex:        10 - abs,
                    pointerEvents: abs === 0 ? "auto" : "none",
                  }}
                >
                  <img src={src} alt="" loading="lazy" />
                </div>
              );
            })}
          </div>
          <button
            className="gallery-arrow right"
            onClick={() => setGalleryIdx((i) => (i + 1) % GALLERY_IMAGES.length)}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="gallery-dots">
          {GALLERY_IMAGES.map((_, i) => (
            <button
              key={i}
              className={i === galleryIdx ? "active" : ""}
              onClick={() => setGalleryIdx(i)}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* ═══ FACILITIES ═══ */}
      <section className="section" style={transparentSection}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 64 }}>
            <span className="eyebrow fade-up" style={eyebrowStyle}>{t("amenities")}</span>
            <h2 className="display fade-up" style={sectionTitleStyle}>{t("everything_need")}</h2>
          </div>
          <div className="facilities-grid stagger-parent">
            {FACILITIES.map((f) => (
              <div key={f.key} className="stagger-child fade-up" style={liquidGlassCard}>
                <div style={iconCircle}>{f.icon}</div>
                <h4 style={cardTitleStyle}>{t(f.key)}</h4>
                <p style={cardBodyStyle}>{t("fac_short")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ═══ REVIEWS ═══ */}
      <section className="section" style={{ ...transparentSection, overflow: "hidden" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 64 }}>
            <span className="eyebrow fade-up" style={eyebrowStyle}>{t("testimonials")}</span>
            <h2 className="display fade-up" style={sectionTitleStyle}>{t("guests_say")}</h2>
          </div>
        </div>
        <div
          style={{ width: "100%", overflow: "hidden", padding: "20px 0", cursor: "pointer" }}
          onMouseDown={() => setIsReviewPaused(true)}
          onMouseUp={() => setIsReviewPaused(false)}
          onMouseLeave={() => setIsReviewPaused(false)}
          onTouchStart={() => setIsReviewPaused(true)}
          onTouchEnd={() => setIsReviewPaused(false)}
        >
          <div
            className="reviews-track"
            style={{ animationPlayState: isReviewPaused ? "paused" : "running" }}
          >
            {[...REVIEWS, ...REVIEWS].map((r, index) => (
              <div key={`${r.key}-${index}`} style={{ ...liquidGlassReviewCard, flexShrink: 0 }}>
                <div style={{ fontSize: "3.2rem", lineHeight: 1, color: "var(--color-gold, #c9a84c)", marginBottom: 6, fontFamily: "var(--font-display)", opacity: 0.65 }}>
                  "
                </div>
                <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.88)", fontSize: "0.95rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: 20, flexGrow: 1, fontWeight: 300 }}>
                  {t(r.key)}
                </p>
                <div style={{ display: "flex", gap: 3, marginBottom: 10, color: "var(--color-gold, #c9a84c)" }}>
                  {[...Array(5)].map((_, i) => <Star key={i} />)}
                </div>
                <div style={{ fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600, fontSize: "0.88rem", letterSpacing: "0.08em" }}>{r.name}</div>
                <div style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.45)", fontSize: "0.76rem", marginTop: 3, letterSpacing: "0.05em" }}>{r.country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ═══ MAP ═══ */}
      <section className="section" style={transparentSection}>
        <div className="container text-center" style={{ marginBottom: 48 }}>
          <span className="eyebrow fade-up" style={eyebrowStyle}>{t("find_us")}</span>
          <h2 className="display fade-up" style={sectionTitleStyle}>{t("location_title")}</h2>
        </div>
        <div
          style={{
            margin:               "0 auto",
            maxWidth:             1200,
            borderRadius:         16,
            overflow:             "hidden",
            border:               "1px solid rgba(255,255,255,0.18)",
            boxShadow:            "0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            backdropFilter:       "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <iframe
            title="Polyteleia Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1328.6495883803489!2d25.23018550365675!3d35.29971911208043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149a5e86222c7939%3A0xcbcef8b845ae225c!2sPOLYTELIA%20%7C%20Luxury%20Living!5e0!3m2!1sel!2sgr!4v1781007886053!5m2!1sel!2sgr"
            style={{ width: "100%", height: 460, border: 0, display: "block" }}
            loading="lazy"
          />
        </div>
        <div
          style={{
            display:        "flex",
            justifyContent: "center",
            gap:            56,
            marginTop:      48,
            flexWrap:       "wrap",
          }}
        >
          {[
            { label: t("address"), value: t("address_full") },
            { label: t("phone"),   value: "+30 2810 000000" },
            { label: t("email"),   value: "info@polyteleia.gr" },
          ].map(({ label, value }) => (
            <div
              key={label as string}
              style={{ ...liquidGlassCard, padding: "20px 32px", minWidth: 160, textAlign: "center" }}
            >
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-gold, #c9a84c)", marginBottom: 8, fontWeight: 600 }}>
                {label}
              </div>
              <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.85)", margin: 0, fontSize: "0.92rem", fontWeight: 300 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 100, position: "relative", zIndex: 1 }} />
    </>
  );
}

// ─── Style tokens ─────────────────────────────────────────────────────────────

const transparentSection: React.CSSProperties = {
  position:   "relative",
  zIndex:     1,
  background: "transparent",
};

const liquidGlassSection: React.CSSProperties = {
  position:             "relative",
  zIndex:               1,
  padding:              "40px 0",
  background:           "rgba(0,0,0,0.22)",
  backdropFilter:       "blur(20px) saturate(1.6)",
  WebkitBackdropFilter: "blur(20px) saturate(1.6)",
  borderTop:            "1px solid rgba(255,255,255,0.10)",
  borderBottom:         "1px solid rgba(255,255,255,0.07)",
};

const liquidGlassCard: React.CSSProperties = {
  backdropFilter:       "blur(22px) saturate(1.8) brightness(1.05)",
  WebkitBackdropFilter: "blur(22px) saturate(1.8) brightness(1.05)",
  border:               "1px solid rgba(255,255,255,0.15)",
  borderTop:            "1px solid rgba(255,255,255,0.30)",
  borderRadius:         16,
  padding:              "30px 24px",
  display:              "flex",
  flexDirection:        "column",
  alignItems:           "center",
  textAlign:            "center",
  boxShadow:            "0 4px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.20)",
  transition:           "border-color 0.35s, background 0.35s, box-shadow 0.35s",
};

const liquidGlassReviewCard: React.CSSProperties = {
  background:           "rgba(255,255,255,0.06)",
  backdropFilter:       "blur(24px) saturate(1.7) brightness(1.04)",
  WebkitBackdropFilter: "blur(24px) saturate(1.7) brightness(1.04)",
  border:               "1px solid rgba(255,255,255,0.14)",
  borderTop:            "1px solid rgba(255,255,255,0.28)",
  borderRadius:         16,
  padding:              "32px 28px",
  display:              "flex",
  flexDirection:        "column",
  minWidth:             280,
  flex:                 "0 0 300px",
  boxShadow:            "0 4px 28px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.18)",
};

const iconCircle: React.CSSProperties = {
  width:          54,
  height:         54,
  borderRadius:   "50%",
  background:     "rgba(201,168,76,0.12)",
  border:         "1px solid rgba(201,168,76,0.28)",
  boxShadow:      "0 2px 16px rgba(201,168,76,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  marginBottom:   16,
  color:          "var(--color-gold, #c9a84c)",
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily:    "var(--font-body)",
  color:         "var(--color-gold, #c9a84c)",
  letterSpacing: "0.30em",
  fontSize:      "0.67rem",
  textTransform: "uppercase",
  display:       "block",
  marginBottom:  14,
  fontWeight:    600,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily:   "var(--font-display)",
  fontSize:     "clamp(2.4rem, 5vw, 4rem)",
  fontWeight:   700,
  color:        "#fff",
  marginBottom: 64,
  textShadow:   "0 2px 20px rgba(0,0,0,0.3)",
  lineHeight:   1.15,
  letterSpacing: "0.01em",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily:    "var(--font-body)",
  color:         "#fff",
  marginBottom:  6,
  fontWeight:    600,
  fontSize:      "0.82rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const cardBodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  color:      "rgba(255,255,255,0.50)",
  fontSize:   "0.80rem",
  margin:     0,
  fontWeight: 300,
};

// ─── Divider ─────────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div
      style={{
        position:   "relative",
        zIndex:     1,
        maxWidth:   800,
        margin:     "0 auto",
        height:     1,
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.40), transparent)",
      }}
    />
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  );
}
function PoolIcon()    { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /><path d="M2 22c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /><path d="M6 14V5a2 2 0 0 1 4 0v9M14 14V5a2 2 0 0 1 4 0v9" /></svg>; }
function BedIcon()     { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 9v10M22 19V13a4 4 0 0 0-4-4H2" /><circle cx="7" cy="13" r="2" /><path d="M22 17H2" /></svg>; }
function BathIcon()    { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 12h18v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4z" /><path d="M6 12V6a2 2 0 0 1 2-2h2" /><path d="M5 20l-1 2M19 20l1 2" /></svg>; }
function KitchenIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 12h16" /><circle cx="8" cy="7.5" r="1" /><circle cx="8" cy="16.5" r="1" /></svg>; }
function BbqIcon()     { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 9h16l-2 8a3 3 0 0 1-3 2H9a3 3 0 0 1-3-2L4 9z" /><path d="M8 5c1 1-1 2 0 4M12 3c1 1-1 2 0 4M16 5c1 1-1 2 0 4" /></svg>; }
function LoungeIcon()  { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 18v-3a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3" /><path d="M5 18v3M19 18v3M3 12V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /></svg>; }
function WifiIcon()    { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0M8.5 17a6 6 0 0 1 7 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></svg>; }
function AcIcon()      { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="4" width="20" height="8" rx="2" /><path d="M6 16v2M10 16v3M14 16v2M18 16v3" /></svg>; }
function TvIcon()      { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8" /></svg>; }
function HouseIcon()   { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>; }
function ParkingIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>; }
function RoofIcon()    { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 12L12 4l10 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>; }