import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Calendar, Users, Mail, Phone, User, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

// --- LOCAL ASSET IMPORTS ---
import bgEnd from "../assets/end.jpeg";

export const Route = createFileRoute("/book")({
  component: BookPage,
});

// DEFAULT FALLBACK RATE (Used if database load delays or falls through)
const DEFAULT_RATE = 350;

// ── DATE MATHEMATICS HELPERS ────────────────────────────────────────────────
function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function addMonths(d: Date, n: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur < end) {
    dates.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}
function getCalDays(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1).getDay();
  const days = new Date(year, m + 1, 0).getDate();
  return { first: first === 0 ? 6 : first - 1, days };
}

// ── LIQUID GLASS INPUT FIELD ──────────────────────────────────────────────
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}
function LiquidField({ label, icon, ...rest }: FieldProps) {
  return (
    <div className="liquid-field-wrapper">
      <label className="liquid-label">{label}</label>
      <div className="liquid-input-container">
        <span className="liquid-input-icon">{icon}</span>
        <input {...rest} className="liquid-input" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
function BookPage() {
  useScrollAnimation();
  const { t, language } = useTranslation();

  // Form Field States
  const [fullName, setFullName]         = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [guests, setGuests]             = useState(2);
  const [specialRequests, setRequests] = useState("");

  // Calendar Management States
  const [checkIn, setCheckIn]           = useState<string | null>(null);
  const [checkOut, setCheckOut]         = useState<string | null>(null);
  const [hovered, setHovered]           = useState<string | null>(null);
  const [calMonth, setCalMonth]         = useState(new Date());

  // 📡 Live Synchronized Dynamic Database Controls
  const [blocked, setBlocked]           = useState<string[]>([]); 
  const [ratePerNight, setRatePerNight] = useState<number>(DEFAULT_RATE);
  const [state, setState]               = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  // Initialize browser-safe validation check
  const today = useMemo(() => {
    if (typeof window !== "undefined") {
      return formatDate(new Date());
    }
    return ""; // Fallback baseline string literal anchor for Node processes
  }, []);

  const isGreek = language === "gr";
  const locale = isGreek ? "el-GR" : "en-GB";
  const dayLabels = isGreek
    ? ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // ── FETCH SYNCHRONIZED SUPABASE VALUES ────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function fetchSupabaseData() {
      try {
        const [blockedResponse, pricingResponse] = await Promise.all([
          supabase.from("blocked_dates").select("date"),
          supabase.from("pricing").select("price_per_night").single()
        ]);

        if (!isMounted) return;

        // Sync Dynamic Blocked Array Mapping
        if (blockedResponse.data) {
          const formattedBlocked = blockedResponse.data.map((d: { date: string }) => d.date);
          setBlocked(formattedBlocked);
        }

        // Sync Dynamic Nightly Baseline Variable Configuration
        if (pricingResponse.data?.price_per_night) {
          setRatePerNight(Number(pricingResponse.data.price_per_night));
        }
      } catch (err) {
        console.error("Critical extraction failure handling Supabase variables:", err);
      }
    }

    fetchSupabaseData();
    return () => { isMounted = false; };
  }, []);

  // Calculate Length of Stay and Total Cost
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn).getTime();
    const b = new Date(checkOut).getTime();
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = nights * ratePerNight;

  function isInRange(dateStr: string) {
    if (!checkIn) return false;
    const end = checkOut || hovered;
    if (!end) return false;
    return dateStr > checkIn && dateStr < end;
  }

  function handleDayClick(dateStr: string) {
    if ((today && dateStr < today) || blocked.includes(dateStr)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
      } else {
        const range = getDatesInRange(new Date(checkIn), new Date(dateStr));
        if (range.some((d) => blocked.includes(d))) {
          setError(isGreek ? "Η επιλογή περιέχει μη διαθέσιμες ημέρες." : "Selection contains unavailable dates.");
          return;
        }
        setCheckOut(dateStr);
        setError(null);
      }
    }
  }

  // ── SUBMIT SYSTEM RECORD DIRECTLY INTO SUPABASE ─────────────────────────────
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !phone || !checkIn || !checkOut) {
      setError(isGreek ? "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία." : "Please complete all mandatory parameters.");
      return;
    }

    setLoading(true);
    setError(null);
    setState("sending");

    // Breakdown parsed name logic structures
    const nameArray = fullName.trim().split(/\s+/);
    const firstName = nameArray[0] || "";
    const lastName = nameArray.slice(1).join(" ") || "—";

    try {
      const { error: insertError } = await supabase.from("bookings").insert({
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        phone: phone.trim(),
        guests: Number(guests),
        check_in: checkIn,
        check_out: checkOut,
        nights: Number(nights),
        total_price: Number(total),
        status: "unread", // Sets it as new for your admin suite dashboard rows
      });

      if (insertError) throw insertError;

      setState("ok");
    } catch (err: any) {
      console.error("Data tracking record submission failure:", err);
      setState("error");
      setError(
        isGreek 
          ? "Παρουσιάστηκε σφάλμα κατά την επεξεργασία. Παρακαλώ δοκιμάστε ξανά." 
          : err.message || "An unhandled transaction anomaly occurred. Please retry."
      );
    } finally {
      setLoading(false);
    }
  }

  const { first: startDay, days: daysInMonth } = getCalDays(calMonth);

  return (
    <div 
      className="booking-fixed-wrapper"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url(${bgEnd})` }}
    >
      <AnimatePresence mode="wait">
        {state === "ok" ? (
          /* ── NEW IMMERSIVE LIQUID GLASS SUCCESS STAGE ── */
          <motion.div 
            key="success-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="booking-fixed-wrapper flex-center liquid-glass-stage"
          >
            {/* Animated underlying soft ambient blobs for true organic fluid refraction */}
            <div className="fluid-ambient-orb orb-gold" />
            <div className="fluid-ambient-orb orb-bronze" />

            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="hyper-glass-card"
            >
              {/* Inner glass light reflections */}
              <div className="glass-shine-overlay" />

              {/* Status Header Icon Module */}
              <div className="success-header-wrapper">
                <motion.div 
                  initial={{ rotate: -45, scale: 0 }} 
                  animate={{ rotate: 0, scale: 1 }} 
                  transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                  className="hyper-icon-ring"
                >
                  <div className="hyper-icon-inner">
                    <Check className="w-7 h-7 text-[#121212]" strokeWidth={2.5} />
                  </div>
                </motion.div>
                <span className="success-eyebrow-badge">
                  <Sparkles className="w-3 h-3 text-[#c5a880]" />
                  {isGreek ? "Επιτυχής Καταχώρηση" : "Reservation Received"}
                </span>
              </div>

              {/* Core Information Section */}
              <h2 className="display-title-premium">
                {isGreek ? "Ευχαριστούμε, " : "Thank You, "}
                <span className="name-highlight">{fullName.split(" ")[0]}</span>!
              </h2>
              
              <p className="success-message-premium">
                {t("booking_success")}
              </p>

              {/* Summary Statement Blueprint Inline */}
              <div className="receipt-summary-capsule">
                <div className="receipt-date-block">
                  <span className="receipt-label">{t("checkin")}</span>
                  <span className="receipt-value">{checkIn}</span>
                </div>
                <div className="receipt-arrow">
                  <ArrowRight className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div className="receipt-date-block text-right">
                  <span className="receipt-label">{t("checkout")}</span>
                  <span className="receipt-value">{checkOut}</span>
                </div>
              </div>

              {/* Safe Secure Protocol Signature Tag */}
              <div className="secure-footer-signature">
                <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                <span>{isGreek ? "Επιβεβαίωση μέσω Supabase Auth Layer" : "Secured through Supabase Database Engine"}</span>
              </div>

              {/* Interactive Reset Layout Trigger Button */}
              <button
                onClick={() => {
                  setState("idle");
                  setCheckIn(null); setCheckOut(null);
                  setFullName(""); setEmail(""); setPhone(""); setRequests("");
                }}
                className="liquid-btn-submit hyper-btn-reset"
              >
                {isGreek ? "Νέα Κράτηση" : "New Booking Request"}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* ── MAIN INTERFACE FORM VIEW ── */
          <motion.div 
            key="form-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="booking-scroll-container"
          >
            {/* HERO HEADER */}
            <section className="booking-hero text-center">
              <span className="booking-eyebrow">{t("booking_eyebrow")}</span>
              <h1 className="booking-title">{t("booking_title")}</h1>
            </section>

            {/* CORE DOUBLE BLOCK ARCHITECTURE GRID */}
            <div className="booking-interface-grid">
              
              {/* LEFT LAYOUT PANEL: PROCEDURAL SELECTION CALENDAR */}
              <div className="liquid-glass-block split-card fade-up">
                <div className="card-header-row">
                  <Calendar className="header-icon" />
                  <h2 className="card-heading">{isGreek ? "Επιλογή Ημερομηνιών" : "Select Target Dates"}</h2>
                </div>
                
                <p className="calendar-status-prompt">
                  {checkIn && checkOut
                    ? `${t("checkin")}: ${checkIn}  →  ${t("checkout")}: ${checkOut}`
                    : checkIn
                    ? (isGreek ? "Επιλέξτε ημερομηνία αναχώρησης" : "Select checkout date parameters")
                    : (isGreek ? "Επιλέξτε ημερομηνία άφιξης" : "Select arrival date parameters")}
                </p>

                <div className="calendar-nav-bar">
                  <button onClick={() => setCalMonth((m) => addMonths(m, -1))} className="nav-arrow-btn">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="current-month-label">
                    {calMonth.toLocaleDateString(locale, { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={() => setCalMonth((m) => addMonths(m, 1))} className="nav-arrow-btn">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="calendar-days-header">
                  {dayLabels.map((d) => <div key={d} className="day-header-cell">{d}</div>)}
                </div>

                <div className="calendar-dates-grid">
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isPast       = today ? dateStr < today : false;
                    const isBlockedDay = blocked.includes(dateStr);
                    const isStart      = dateStr === checkIn;
                    const isEnd        = dateStr === checkOut;
                    const inRange      = isInRange(dateStr);

                    let dateClass = "date-cell-active";
                    if (isPast || isBlockedDay) {
                      dateClass = isBlockedDay && !isPast ? "date-cell-blocked" : "date-cell-past";
                    } else if (isStart || isEnd) {
                      dateClass = "date-cell-selected";
                    } else if (inRange) {
                      dateClass = "date-cell-range";
                    }

                    return (
                      <div
                        key={dateStr}
                        className={`date-grid-cell ${dateClass}`}
                        onClick={() => handleDayClick(dateStr)}
                        onMouseEnter={() => checkIn && !checkOut && setHovered(dateStr)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <span>{day}</span>
                        {isBlockedDay && !isPast && <span className="blocked-dot-indicator" />}
                      </div>
                    );
                  })}
                </div>

                {/* CUSTOMER GUEST FIELDS SEGMENT */}
                <form onSubmit={handleFormSubmit} className="calendar-embedded-form-fields">
                  <div className="input-fields-structural-grid">
                    <LiquidField
                      label={t("full_name")}
                      icon={<User size={16} />}
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Smith"
                    />
                    <LiquidField
                      label={t("email_address")}
                      icon={<Mail size={16} />}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@polyteleia.gr"
                    />
                    <LiquidField
                      label={t("phone_number")}
                      icon={<Phone size={16} />}
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+30 697..."
                    />

                    <div className="liquid-field-wrapper">
                      <label className="liquid-label">{t("guests")}</label>
                      <div className="liquid-input-container">
                        <span className="liquid-input-icon"><Users size={16} /></span>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="liquid-select-menu"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n} className="select-dark-option">{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="liquid-field-wrapper full-width-block">
                      <label className="liquid-label">{t("special_requests")}</label>
                      <div className="liquid-input-container">
                        <span className="liquid-input-icon" style={{ top: "14px", transform: "none" }}><MessageSquare size={16} /></span>
                        <textarea
                          value={specialRequests}
                          onChange={(e) => setRequests(e.target.value)}
                          placeholder="..."
                          className="liquid-textarea-input"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <div className="error-alert-banner" style={{ marginTop: "24px" }}>{error}</div>}

                  <button
                    type="submit"
                    disabled={loading || state === "sending" || !checkIn || !checkOut || !fullName || !email || !phone}
                    className="liquid-btn-submit"
                    style={{ marginTop: "28px" }}
                  >
                    {state === "sending" ? "..." : t("request_booking")}
                  </button>
                </form>
              </div>

              {/* RIGHT LAYOUT PANEL: INVOICE STATEMENT ASIDE SUMMARY CARD */}
              <aside className="right-stack-column flex-column fade-up">
                <div className="liquid-glass-block split-card premium-summary-card">
                  <div className="brand-header">POLYTELEIA</div>
                  <div className="summary-eyebrow-line">{t("location_title")}</div>
                  
                  <div className="invoice-rows-wrapper">
                    <div className="summary-row-line">
                      <span className="row-label">{t("nightly_rate")}</span>
                      <span className="row-value">€{ratePerNight}</span>
                    </div>
                    <div className="summary-row-line">
                      <span className="row-label">{t("nights")}</span>
                      <span className="row-value">{nights > 0 ? nights : t("select_dates")}</span>
                    </div>

                    <hr className="gold-accent-split" />

                    <div className="summary-row-line total-highlight-row">
                      <span className="row-label total-label">{t("total")}</span>
                      <span className="row-value total-sum">€{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="summary-note-disclaimer">{t("prices_indicative")}</p>
                  
                  <div className="premium-policy-capsules-footer">
                    <p className="policy-text-node">✦ {t("free_cancel")}</p>
                    <p className="policy-text-node">✦ {t("responds_24")}</p>
                  </div>
                </div>
              </aside>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPACT INTERFACE SCOPED STYLESHEET */}
      <style>{`
        .booking-fixed-wrapper {
          min-height: 100vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: #ffffff;
        }
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .flex-column { display: flex; flex-direction: column; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        .booking-scroll-container {
          max-width: 1150px;
          margin: 0 auto;
          padding: 130px 24px 90px 24px;
        }
        .booking-hero { margin-bottom: 44px; }
        .booking-eyebrow {
          color: #c5a880;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: 0.85rem;
          display: block;
          margin-bottom: 12px;
        }
        .booking-title {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 300;
          margin: 0;
          letter-spacing: -0.5px;
        }

        /* Architectural Split Responsive Layout Frame Grid */
        .booking-interface-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 968px) {
          .booking-interface-grid { grid-template-columns: 1fr; }
        }

        /* Premium Blurred Liquid Glass Foundation Blocks */
        .liquid-glass-block {
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(26px) saturate(160%) brightness(88%);
          WebkitBackdropFilter: blur(26px) saturate(160%) brightness(88%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        .split-card { padding: 44px; }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .header-icon { color: #c5a880; width: 22px; height: 22px; }
        .card-heading { font-size: 1.35rem; font-weight: 400; margin: 0; letter-spacing: 0.5px; }

        /* Integrated Custom Date Picker Styles */
        .calendar-status-prompt {
          font-size: 0.85rem;
          color: #c5a880;
          margin-bottom: 24px;
          background: rgba(197, 168, 128, 0.07);
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid rgba(197, 168, 128, 0.22);
          display: inline-block;
        }
        .calendar-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .nav-arrow-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.55);
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-arrow-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .current-month-label { font-size: 1.1rem; font-weight: 400; letter-spacing: 0.5px; }
        
        .calendar-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 14px;
        }
        .day-header-cell {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 500;
        }
        .calendar-dates-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .date-grid-cell {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        .date-cell-active { color: rgba(255, 255, 255, 0.9); }
        .date-cell-active:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .date-cell-past { color: rgba(255, 255, 255, 0.12); cursor: not-allowed; text-decoration: line-through; }
        .date-cell-blocked { color: rgba(239, 68, 68, 0.3); cursor: not-allowed; text-decoration: line-through; }
        .blocked-dot-indicator {
          position: absolute;
          bottom: 5px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgb(239, 68, 68);
        }
        .date-cell-selected {
          background: #c5a880 !important;
          color: #121212 !important;
          font-weight: 600;
          box-shadow: 0 4px 18px rgba(197, 168, 128, 0.4);
        }
        .date-cell-range {
          background: rgba(197, 168, 128, 0.14);
          color: #c5a880;
          border-color: rgba(197, 168, 128, 0.2);
          border-radius: 8px;
        }

        /* Form Layout Configuration */
        .calendar-embedded-form-fields {
          margin-top: 40px;
          padding-top: 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .input-fields-structural-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 568px) {
          .input-fields-structural-grid { grid-template-columns: 1fr; }
          .full-width-block { grid-column: span 1 !important; }
        }
        .full-width-block { grid-column: span 2; }

        .liquid-field-wrapper { display: flex; flex-direction: column; gap: 8px; }
        .liquid-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          padding-left: 2px;
        }
        .liquid-input-container { position: relative; display: flex; align-items: center; }
        .liquid-input-icon {
          position: absolute;
          left: 16px;
          color: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          pointer-events: none;
          top: 50%;
          transform: translateY(-50%);
        }
        .liquid-input, .liquid-select-menu, .liquid-textarea-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 16px 14px 44px;
          border-radius: 14px;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.25s ease;
        }
        .liquid-textarea-input {
          min-height: 100px;
          resize: vertical;
          line-height: 1.5;
        }
        .liquid-input::placeholder, .liquid-textarea-input::placeholder { color: rgba(255, 255, 255, 0.18); }
        .liquid-input:focus, .liquid-select-menu:focus, .liquid-textarea-input:focus {
          border-color: rgba(197, 168, 128, 0.5);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.08);
        }
        .liquid-select-menu { cursor: pointer; appearance: none; }
        .select-dark-option { background: #161616; color: #ffffff; }

        /* Premium Statement Aside Invoice Block Card Styles */
        .right-stack-column { gap: 24px; }
        .premium-summary-card {
          padding: 44px;
          border-color: rgba(197, 168, 128, 0.15);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%);
        }
        .brand-header {
          font-size: 1.6rem;
          font-weight: 300;
          letter-spacing: 6px;
          color: #ffffff;
        }
        .summary-eyebrow-line {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #c5a880;
          margin-top: 6px;
          margin-bottom: 36px;
        }
        .invoice-rows-wrapper { display: flex; flex-direction: column; gap: 18px; }
        .summary-row-line { display: flex; justify-content: space-between; align-items: center; }
        .row-label { font-size: 0.9rem; color: rgba(255, 255, 255, 0.55); }
        .row-value { font-size: 1rem; color: #ffffff; font-weight: 400; }
        
        .gold-accent-split {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, rgba(197, 168, 128, 0.4), rgba(255, 255, 255, 0.03));
          width: 100%;
          margin: 10px 0;
        }
        .total-highlight-row { margin-top: 4px; }
        .total-label {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .total-sum { font-size: 1.8rem; font-weight: 300; color: #c5a880; }
        
        .summary-note-disclaimer {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          line-height: 1.5;
          margin: 24px 0 0 0;
          border-left: 2px solid rgba(197, 168, 128, 0.2);
          padding-left: 12px;
        }
        
        .premium-policy-capsules-footer {
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .policy-text-node {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.6;
          margin: 0;
        }

        /* Interaction Components & Notification Framework */
        .error-alert-banner {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: rgba(239, 68, 68, 0.85);
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .liquid-btn-submit {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #c5a880 0%, #a3855c 100%);
          color: #121212;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 10px 25px rgba(197, 168, 128, 0.15);
        }
        .liquid-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(197, 168, 128, 0.3);
          filter: brightness(106%);
        }
        .liquid-btn-submit:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }


        /* ─────────────────────────────────────────────────────────────────────
           🔮 LIQUID GLASS MULTI-LAYER STAGE SYSTEM
        ───────────────────────────────────────────────────────────────────── */
        .liquid-glass-stage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 100;
          overflow: hidden;
          perspective: 1000px;
        }

        /* Fluid background ambient accent shapes */
        .fluid-ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.45;
          mix-blend-mode: plus-lightning;
          animation: fluidFloat 12s infinite alternate ease-in-out;
          pointer-events: none;
        }
        .orb-gold {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #c5a880 0%, transparent 70%);
          top: 20%;
          left: 25%;
        }
        .orb-bronze {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #a3855c 0%, transparent 70%);
          bottom: 15%;
          right: 20%;
          animation-delay: -4s;
        }

        @keyframes fluidFloat {
          0% { transform: translateY(0px) scale(1) rotate(0deg); }
          100% { transform: translateY(-40px) scale(1.15) rotate(15deg); }
        }

        /* The Hyper-Refractive Glass Body Card */
        .hyper-glass-card {
          position: relative;
          width: 100%;
          max-width: 520px;
          padding: 60px 48px;
          border-radius: 36px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
          
          /* Advanced Refraction Stack */
          backdrop-filter: blur(40px) saturate(220%) brightness(95%);
          -webkit-backdrop-filter: blur(40px) saturate(220%) brightness(95%);
          
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-left: 1px solid rgba(255, 255, 255, 0.25);
          
          box-shadow: 
            0 40px 90px rgba(0, 0, 0, 0.65), 
            inset 0 1px 2px rgba(255, 255, 255, 0.25),
            0 0 0 1px rgba(197, 168, 128, 0.08);
            
          text-align: center;
          overflow: hidden;
        }

        /* Glass Surface Specular Light Layer */
        .glass-shine-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
          transform: skewY(-6deg);
          transform-origin: top left;
          pointer-events: none;
        }

        /* Success Header Architecture */
        .success-header-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
        }
        .hyper-icon-ring {
          padding: 3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c5a880 0%, rgba(197, 168, 128, 0.1) 100%);
          box-shadow: 0 10px 30px rgba(197, 168, 128, 0.25);
        }
        .hyper-icon-inner {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #c5a880;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
        }
        .success-eyebrow-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #c5a880;
          background: rgba(197, 168, 128, 0.1);
          padding: 6px 14px;
          border-radius: 30px;
          border: 1px solid rgba(197, 168, 128, 0.2);
        }

        /* Typography & Layout Detail Parameters */
        .display-title-premium {
          font-size: 2.2rem;
          font-weight: 300;
          letter-spacing: -0.5px;
          margin: 0 0 16px 0;
          color: #ffffff;
        }
        .name-highlight {
          color: #c5a880;
          font-weight: 400;
        }
        .success-message-premium {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.7;
          margin: 0 auto 36px auto;
          max-width: 380px;
        }

        /* Dynamic Visual Booking Receipt Capsule */
        .receipt-summary-capsule {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 24px;
          border-radius: 20px;
          margin-bottom: 36px;
        }
        .receipt-date-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .receipt-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.4);
        }
        .receipt-value {
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
          font-family: monospace;
        }
        .receipt-arrow {
          opacity: 0.7;
          background: rgba(255, 255, 255, 0.04);
          padding: 8px;
          border-radius: 50%;
        }

        /* Secure Infrastructure Node signature footer */
        .secure-footer-signature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 32px;
        }

        /* Reset Button Modifier styles override */
        .hyper-btn-reset {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%);
          color: #121212;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          border: 1px solid #ffffff;
        }
        .hyper-btn-reset:hover:not(:disabled) {
          background: #ffffff;
          box-shadow: 0 15px 40px rgba(197, 168, 128, 0.25);
          color: #000000;
        }
      `}</style>
    </div>
  );
}