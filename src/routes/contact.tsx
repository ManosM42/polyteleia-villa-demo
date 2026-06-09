import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  useScrollAnimation();
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="page-hero minimal">
        <div className="page-hero-inner">
          <span className="eyebrow">{t("contact_eyebrow")}</span>
          <h1>{t("contact_title")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="form-grid">
            <div className="fade-up">
              <h2 className="display" style={{ fontSize: "2rem", marginBottom: 32 }}>{t("reach_us")}</h2>
              <div className="contact-info-item">
                <span className="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" /></svg></span>
                <span>+30 2810 000000</span>
              </div>
              <div className="contact-info-item">
                <span className="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></span>
                <span>info@polyteleia.gr</span>
              </div>
              <div className="contact-info-item">
                <span className="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 22s-8-7.58-8-13a8 8 0 0 1 16 0c0 5.42-8 13-8 13z" /><circle cx="12" cy="9" r="3" /></svg></span>
                <span>{t("address_full")}</span>
              </div>
              <p style={{ marginTop: 32, fontSize: "0.85rem", color: "var(--color-stone)", lineHeight: 1.8 }}>
                {t("contact_note")}
              </p>
            </div>

            <form
              className="fade-up"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <div className="field">
                <label>{t("full_name")}</label>
                <input type="text" required placeholder={t("full_name")} />
              </div>
              <div className="field">
                <label>{t("email_address")}</label>
                <input type="email" required placeholder={t("email_address")} />
              </div>
              <div className="field">
                <label>{t("phone_optional")}</label>
                <input type="tel" placeholder={t("phone_optional")} />
              </div>
              <div className="field">
                <label>{t("message")}</label>
                <textarea required placeholder={t("message")} />
              </div>
              <button type="submit" className="btn btn-outline btn-block">{t("send_message")}</button>
              {sent && <div className="form-success">{t("contact_success")}</div>}
            </form>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "2px solid var(--color-gold)" }}>
        <iframe
          title="Polyteleia Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1328.6495883803489!2d25.23018550365675!3d35.29971911208043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149a5e86222c7939%3A0xcbcef8b845ae225c!2sPOLYTELIA%20%7C%20Luxury%20Living!5e0!3m2!1sel!2sgr!4v1781007886053!5m2!1sel!2sgr"
          style={{ width: "100%", height: 480, border: 0, display: "block" }}
          loading="lazy"
        />
      </div>
    </>
  );
}
