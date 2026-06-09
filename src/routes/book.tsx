import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/book")({
  component: BookPage,
});

const RATE = 350;

function BookPage() {
  useScrollAnimation();
  const { t } = useTranslation();
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [sent, setSent] = useState(false);

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    const a = new Date(checkin).getTime();
    const b = new Date(checkout).getTime();
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkin, checkout]);

  const total = nights * RATE;

  return (
    <>
      <section className="page-hero minimal">
        <div className="page-hero-inner">
          <span className="eyebrow">{t("booking_eyebrow")}</span>
          <h1>{t("booking_title")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="form-grid">
            <form
              className="fade-up"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <div className="field">
                <label>{t("checkin")}</label>
                <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
              </div>
              <div className="field">
                <label>{t("checkout")}</label>
                <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} required />
              </div>
              <div className="field">
                <label>{t("guests")}</label>
                <select required defaultValue="2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t("full_name")}</label>
                <input type="text" required placeholder={t("full_name")} />
              </div>
              <div className="field">
                <label>{t("email_address")}</label>
                <input type="email" required placeholder={t("email_address")} />
              </div>
              <div className="field">
                <label>{t("phone_number")}</label>
                <input type="tel" required placeholder={t("phone_number")} />
              </div>
              <div className="field">
                <label>{t("special_requests")}</label>
                <textarea placeholder={t("special_requests")} />
              </div>
              <button type="submit" className="btn btn-filled btn-block">{t("request_booking")}</button>

              {sent && (
                <div className="form-success" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 5-6" />
                  </svg>
                  <span>{t("booking_success")}</span>
                </div>
              )}
            </form>

            <aside className="summary-panel fade-up">
              <div className="brand">POLYTELEIA</div>
              <div className="eyebrow" style={{ marginTop: 8 }}>{t("location_title")}</div>
              <div className="summary-row">
                <span>{t("nightly_rate")}</span>
                <span>€{RATE}</span>
              </div>
              <div className="summary-row">
                <span>{t("nights")}</span>
                <span>{nights > 0 ? nights : t("select_dates")}</span>
              </div>
              <div className="summary-row" style={{ borderBottom: "none", marginTop: 12 }}>
                <span style={{ textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.75rem", color: "var(--color-stone)" }}>{t("total")}</span>
                <span className="summary-total">€{total.toLocaleString()}</span>
              </div>
              <p className="summary-note">{t("prices_indicative")}</p>
              <hr className="gold-divider" />
              <p style={{ color: "var(--color-cream)", fontSize: "0.85rem", lineHeight: 1.8 }}>
                {t("free_cancel")}<br />
                {t("responds_24")}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
