import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="brand">POLYTELEIA</span>
            <p className="footer-tag">{t("footer_tag")}</p>
          </div>
          <div>
            <h5>{t("navigation")}</h5>
            <ul>
              <li><Link to="/">{t("nav_home")}</Link></li>
              <li><Link to="/villa">{t("nav_villa")}</Link></li>
              <li><Link to="/area">{t("nav_area")}</Link></li>
              <li><Link to="/contact">{t("nav_contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t("reservations")}</h5>
            <ul>
              <li><Link to="/book">{t("nav_book")}</Link></li>
              <li><Link to="/book">{t("availability")}</Link></li>
              <li><Link to="/book">{t("rates")}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t("nav_contact")}</h5>
            <ul style={{ color: "var(--color-stone)", fontSize: "0.88rem", lineHeight: 1.9 }}>
              <li>{t("address_full")}</li>
              <li>+30 2810 000000</li>
              <li>info@polyteleia.gr</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("copyright")}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
