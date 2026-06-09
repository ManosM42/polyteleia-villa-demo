import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, Check, X, Calendar, Euro, Mail, Phone, Users,
  Eye, EyeOff, ChevronLeft, ChevronRight, ShieldAlert, Sliders, DollarSign, Layers
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Polyteleia" }] }),
  component: Admin,
});

// ── Types ──────────────────────────────────────────────────────────────────
type Booking = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  guests: number;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  status: "read" | "unread";
  created_at: string;
};

// ── Auth Secrets ───────────────────────────────────────────────────────────
const SECRET = "eliapolyteleia2026!!";
const SESSION_KEY = "polyteleia_admin_auth";

// ── Helpers ────────────────────────────────────────────────────────────────
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
  return { first: first === 0 ? 6 : first - 1, days: new Date(year, m + 1, 0).getDate() };
}

// ══════════════════════════════════════════════════════════════════════════
function Admin() {
  // ── Auth States
const [authed, setAuthed] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    }
    return false; // Safe fallback value when processing code on the server
  });
  const [code, setCode] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  // ── Data States
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [blocked, setBlocked] = React.useState<string[]>([]);
  const [pricePerNight, setPrice] = React.useState<number>(0);
  const [newPrice, setNewPrice] = React.useState<string>("");

  // ── UI Control States
  const [tab, setTab] = React.useState<"bookings" | "calendar" | "pricing">("bookings");
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");
  const [calMonth, setCalMonth] = React.useState(new Date());
  const [selected, setSelected] = React.useState<Booking | null>(null);
  const [priceSaved, setPriceSaved] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  const today = formatDate(new Date());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === SECRET) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setErr(false);
    } else {
      setErr(true);
      setShake(true);
      setCode("");
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setCode("");
    setBookings([]);
    setSelected(null);
  };

  React.useEffect(() => {
    if (!authed) return;
    setLoadingData(true);
    Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("blocked_dates").select("date"),
      supabase.from("pricing").select("price_per_night").single(),
    ]).then(([b, bl, p]) => {
      if (b.data) setBookings(b.data as Booking[]);
      if (bl.data) setBlocked(bl.data.map((d: { date: string }) => d.date));
      if (p.data) {
        setPrice(Number(p.data.price_per_night));
        setNewPrice(String(p.data.price_per_night));
      }
      setLoadingData(false);
    });
  }, [authed]);

  const markStatus = async (id: string, status: "read" | "unread") => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  };

  const deleteBooking = async (id: string) => {
    if(!confirm("Are you sure you want to permanently purge this entry?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelected(null);
  };

  const toggleBlocked = async (dateStr: string) => {
    if (blocked.includes(dateStr)) {
      await supabase.from("blocked_dates").delete().eq("date", dateStr);
      setBlocked((prev) => prev.filter((d) => d !== dateStr));
    } else {
      await supabase.from("blocked_dates").insert({ date: dateStr });
      setBlocked((prev) => [...prev, dateStr]);
    }
  };

  const isBookedDate = (dateStr: string) =>
    bookings.some((b) => dateStr >= b.check_in && dateStr < b.check_out);

  const savePrice = async () => {
    const val = Number(newPrice);
    if (isNaN(val) || val < 0) return;
    const { data } = await supabase.from("pricing").select("id").single();
    if (data?.id) {
      await supabase.from("pricing").update({ price_per_night: val, updated_at: new Date().toISOString() }).eq("id", data.id);
    }
    setPrice(val);
    setPriceSaved(true);
    setTimeout(() => setPriceSaved(false), 2500);
  };

  const filtered = bookings.filter((b) => filter === "all" ? true : b.status === filter);
  const unreadCount = bookings.filter((b) => b.status === "unread").length;
  const { first: startDay, days: daysInMonth } = getCalDays(calMonth);

  // ══ SCREEN STATE: LIQUID GLASS AUTHENTICATION VIEW ═════════════════════════
  if (!authed) {
    return (
      <div className="admin-fixed-viewport flex-center">
        <div className="ambient-radial-glow" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="text-center mb-8">
            <div className="admin-auth-badge">
              <span className="brand-badge-text">P</span>
            </div>
            <h1 className="admin-main-logo">POLYTELEIA</h1>
            <p className="admin-logo-sub">Management Suite</p>
          </div>

          <motion.form
            onSubmit={handleLogin}
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="liquid-glass-card panel-padding"
          >
            <div className="liquid-field-stack">
              <label className="liquid-field-label">System Access Token</label>
              <div className="liquid-input-wrapper">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setErr(false); }}
                  placeholder="•••••••••••••"
                  autoFocus
                  className="liquid-input-node"
                  style={{
                    borderColor: err ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.12)",
                    boxShadow: err ? "0 0 0 3px rgba(239, 68, 68, 0.08)" : "none"
                  }}
                />
              </div>
              <AnimatePresence>
                {err && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="auth-error-string"
                  >
                    <ShieldAlert size={12} style={{ display: "inline", marginRight: "4px" }} /> Secure key rejected.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" className="liquid-action-button" style={{ marginTop: "20px" }}>
              Authenticate System
            </button>
          </motion.form>
        </motion.div>
      </div>
    );
  }

  // ══ SCREEN STATE: CORE HIGH FIDELITY MANAGEMENT INTERFACE ════════════════
  return (
    <div className="admin-fixed-viewport">
      <div className="ambient-radial-glow-top" />

      {/* FIXED TOP UTILITY COMPONENT BAR */}
      <header className="liquid-navbar-frame">
        <div className="navbar-left-identity">
          <div className="identity-token">P</div>
          <span className="identity-brand">POLYTELEIA</span>
          <span className="identity-pill-tag">Control Core</span>
        </div>
        <button onClick={handleLogout} className="navbar-signout-btn">
          <LogOut size={13} /> <span>Sign Out Terminal</span>
        </button>
      </header>

      {/* CORE CONTROL FILTER NAVIGATION SYSTEM */}
      <nav className="liquid-navigation-tab-container">
        {([
          { key: "bookings", label: "Κρατήσεις", icon: <Layers size={14} /> },
          { key: "calendar", label: "Ημερολόγιο", icon: <Calendar size={14} /> },
          { key: "pricing",  label: "Τιμολόγηση", icon: <Sliders size={14} /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`navigation-tab-node ${tab === t.key ? "tab-active" : ""}`}
          >
            <span className="tab-icon-wrapper">{t.icon}</span>
            <span>{t.label}</span>
            {t.key === "bookings" && unreadCount > 0 && (
              <span className="live-unread-counter">{unreadCount}</span>
            )}
            {tab === t.key && (
              <motion.div layoutId="navbar-indicator" className="active-nav-underline" />
            )}
          </button>
        ))}
      </nav>

      {/* VIEWPORT SCROLL CONTENT FRAME CONTAINER */}
      <main className="admin-workspace-scroll-area">
        
        {/* VIEW SEGMENT BLOCK: BOOKINGS ARCHIVE OVERVIEW */}
        {tab === "bookings" && (
          <div className="workspace-double-pane">
            
            {/* ARCHIVE COLUMN CONTAINER SPLIT */}
            <div className="split-column-archive-list">
              <div className="archive-pill-filter-row">
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`archive-filter-pill ${filter === f ? "pill-active" : ""}`}
                  >
                    {f === "all" ? "Όλες" : f === "unread" ? "Αδιάβαστες" : "Διαβασμένες"}
                  </button>
                ))}
              </div>

              {loadingData && <div className="loading-state-placeholder">Retrieving Database Rows...</div>}
              {!loadingData && filtered.length === 0 && (
                <div className="loading-state-placeholder">Δεν υπάρχουν εγγραφές κρατήσεων</div>
              )}

              <div className="procedural-cards-stack">
                {filtered.map((b) => (
                  <motion.div
                    key={b.id}
                    layout
                    onClick={() => { setSelected(b); markStatus(b.id, "read"); }}
                    className={`booking-list-row-card ${selected?.id === b.id ? "row-selected" : ""} ${b.status === "unread" ? "row-unread-glow" : ""}`}
                    whileHover={{ y: -1 }}
                  >
                    <div className="row-card-top-line">
                      <div>
                        <h4 className="row-card-customer-name">{b.first_name} {b.last_name}</h4>
                        <p className="row-card-date-range">{b.check_in}  →  {b.check_out}</p>
                      </div>
                      <div className="row-card-metrics-block">
                        {b.status === "unread" && <span className="unread-dot" />}
                        <span className="row-card-price-value">€{b.total_price ?? "—"}</span>
                      </div>
                    </div>
                    <div className="row-card-sub-metadata">
                      <span>{b.guests} επισκ.</span>
                      <span>•</span>
                      <span>{b.nights} {b.nights === 1 ? "βράδυ" : "βράδια"}</span>
                      <span className="spacer-pushed-right">{new Date(b.created_at).toLocaleDateString("el-GR")}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* DETAIL DISPLAY VIEWPLANE SPLIT */}
            <div className="split-column-viewport-panel">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="liquid-glass-card panel-padding full-height"
                  >
                    <div className="detail-header-block">
                      <div>
                        <h2 className="detail-customer-fullname">{selected.first_name} {selected.last_name}</h2>
                        <p className="detail-creation-stamp">
                          Υποβλήθηκε: {new Date(selected.created_at).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`status-capsule-badge ${selected.status === "unread" ? "badge-unread" : "badge-read"}`}>
                        {selected.status === "unread" ? "Αδιάβαστη" : "Διαβασμένη"}
                      </span>
                    </div>

                    <div className="detail-metrics-structural-grid">
                      {[
                        { icon: <Mail size={14} />, label: "Email Address", value: selected.email },
                        { icon: <Phone size={14} />, label: "Τηλέφωνο Επικοινωνίας", value: selected.phone },
                        { icon: <Users size={14} />, label: "Σύνολο Επισκεπτών", value: `${selected.guests} άτομα` },
                        { icon: <Euro size={14} />, label: "Ολική Χρέωση", value: selected.total_price ? `€${selected.total_price}` : "—" },
                        { icon: <Calendar size={14} />, label: "Ημερομηνία Check-In", value: selected.check_in },
                        { icon: <Calendar size={14} />, label: "Ημερομηνία Check-Out", value: selected.check_out },
                      ].map((item, index) => (
                        <div key={index} className="metric-isolated-capsule">
                          <div className="metric-capsule-label-row">
                            {item.icon} <span>{item.label}</span>
                          </div>
                          <p className="metric-capsule-value">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="detail-invoice-summary-block">
                      <div className="invoice-split-flex">
                        <div>
                          <span className="invoice-label-tag">Συνολικό Ποσό</span>
                          <h3 className="invoice-grand-total">€{selected.total_price ?? "—"}</h3>
                        </div>
                        <div className="invoice-breakdown-meta">
                          <p>{selected.nights} {selected.nights === 1 ? "διανυκτέρευση" : "διανυκτερεύσεις"}</p>
                          <p>€{pricePerNight} ανά βράδυ (Βάση)</p>
                        </div>
                      </div>
                    </div>

                    <div className="detail-actions-button-footer-row">
                      {selected.status === "unread" ? (
                        <button onClick={() => markStatus(selected.id, "read")} className="liquid-action-button footer-btn">
                          <Eye size={14} /> <span>Σήμανση ως Διαβασμένη</span>
                        </button>
                      ) : (
                        <button onClick={() => markStatus(selected.id, "unread")} className="liquid-action-button-outline footer-btn">
                          <EyeOff size={14} /> <span>Σήμανση ως Αδιάβαστη</span>
                        </button>
                      )}
                      <button onClick={() => deleteBooking(selected.id)} className="liquid-destructive-button footer-btn">
                        <X size={14} /> <span>Διαγραφή Αρχείου</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-selection-fallback flex-center">
                    <div className="fallback-inner-icon-container">
                      <Layers size={24} className="fallback-icon" />
                    </div>
                    <p className="fallback-text-prompt">Παρακαλώ επιλέξτε μια καταχωρημένη κράτηση από τη λίστα</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* VIEW SEGMENT BLOCK: INTERACTIVE SCHEDULER BLOCKING CALENDAR */}
        {tab === "calendar" && (
          <div className="max-width-restrictor-frame">
            <div className="liquid-glass-card panel-padding">
              <h2 className="panel-headline-title">Διαχείριση Διαθεσιμότητας Ημερών</h2>
              <p className="panel-headline-sub">Κάντε κλικ επάνω σε μια ημερολογιακή ημέρα για εναλλαγή κατάστασης μεταξύ Ανοιχτής και Κλειστής.</p>
              
              <div className="calendar-legend-guide-row">
                <span className="legend-item"><span className="legend-swatch swatch-blocked" /> Κλειστή / Μπλοκαρισμένη</span>
                <span className="legend-item"><span className="legend-swatch swatch-booked" /> Επιβεβαιωμένη Κράτηση</span>
              </div>

              <div className="calendar-month-selector-bar">
                <button onClick={() => setCalMonth((m) => addMonths(m, -1))} className="calendar-nav-arrow">
                  <ChevronLeft size={16} />
                </button>
                <h3 className="calendar-current-month-heading">
                  {calMonth.toLocaleDateString("el-GR", { month: "long", year: "numeric" })}
                </h3>
                <button onClick={() => setCalMonth((m) => addMonths(m, 1))} className="calendar-nav-arrow">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="calendar-days-structural-grid-header">
                {["Δε","Τρ","Τε","Πε","Πα","Σα","Κυ"].map((d) => (
                  <div key={d} className="calendar-header-day-label">{d}</div>
                ))}
              </div>

              <div className="calendar-numerical-days-grid-layout">
                {Array.from({ length: startDay }).map((_, i) => <div key={`empty-cell-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isPast = dateStr < today;
                  const isBlock = blocked.includes(dateStr);
                  const isBooked = isBookedDate(dateStr);

                  let calculatedModifierStyleClass = "day-node-open";
                  if (isPast) calculatedModifierStyleClass = "day-node-past";
                  else if (isBlock) calculatedModifierStyleClass = "day-node-blocked";
                  else if (isBooked) calculatedModifierStyleClass = "day-node-booked";

                  return (
                    <div
                      key={dateStr}
                      onClick={() => !isPast && toggleBlocked(dateStr)}
                      className={`calendar-render-day-node ${calculatedModifierStyleClass}`}
                      title={isBlock ? "Κλειστή" : isBooked ? "Κρατημένη" : "Διαθέσιμη"}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW SEGMENT BLOCK: PRICING VALUE DATA VARIABLES */}
        {tab === "pricing" && (
          <div className="max-width-restrictor-frame compact-width">
            <div className="liquid-glass-card panel-padding">
              <h2 className="panel-headline-title">Ρύθμιση Τιμολογιακής Πολιτικής</h2>
              <p className="panel-headline-sub">Ορίστε τη βασική τιμή ανά διανυκτέρευση. Οι αλλαγές εφαρμόζονται αυτόματα στην φόρμα υπολογισμού κρατήσεων.</p>

              <div className="pricing-input-form-block">
                <label className="liquid-field-label">Τιμή ανά βράδυ (€)</label>
                <div className="pricing-inline-input-group">
                  <div className="pricing-input-icon-adornment"><DollarSign size={15} /></div>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="liquid-input-node customized-padding"
                    placeholder="450"
                  />
                  <button onClick={savePrice} className="liquid-action-button pricing-submit-btn">
                    <Check size={14} /> <span>{priceSaved ? "Αποθηκεύτηκε!" : "Αποθήκευση"}</span>
                  </button>
                </div>
              </div>

              <div className="pricing-matrix-preview-panel">
                <h4 className="preview-panel-title">Προεπισκόπηση Υπολογιστικού Μοντέλου</h4>
                <div className="preview-matrix-rows-wrapper">
                  {[2, 3, 5, 7].map((n) => (
                    <div key={n} className="preview-matrix-row-item">
                      <span className="matrix-row-nights-label">{n} {n === 1 ? "βράδυ" : "βράδια"}</span>
                      <span className="matrix-row-calculated-sum">€{(n * Number(newPrice || 0)).toLocaleString("el-GR")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* COMPACT INTERFACE SCOPED STYLESHEET */}
      <style>{`
        .admin-fixed-viewport {
          min-height: 100vh;
          width: 100%;
          background-color: #0a0e1a;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .panel-padding { padding: 40px; }
        .full-height { height: 100%; box-sizing: border-box; }

        /* Ambient Glow Vectors */
        .ambient-radial-glow {
          position: fixed;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          pointer-events: none;
          background: radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, transparent 70%);
          z-index: 1;
        }
        .ambient-radial-glow-top {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 450px;
          pointer-events: none;
          background: radial-gradient(circle, rgba(197, 168, 128, 0.05) 0%, transparent 75%);
          z-index: 1;
        }

        /* Authentication View Specific Components */
        .admin-auth-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(197, 168, 128, 0.07);
          border: 1px solid rgba(197, 168, 128, 0.25);
          margin-bottom: 20px;
        }
        .brand-badge-text {
          font-size: 1.3rem;
          color: #c5a880;
          font-weight: 300;
          letter-spacing: 1px;
        }
        .admin-main-logo {
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 6px;
          margin: 0;
        }
        .admin-logo-sub {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: rgba(255, 255, 255, 0.35);
          margin: 6px 0 0 0;
        }
        .auth-error-string {
          font-size: 0.75rem;
          color: #ef4444;
          margin: 8px 0 0 0;
          display: flex;
          align-items: center;
        }

        /* High Fidelity Liquid Glass Structural Cards */
        .liquid-glass-card {
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(24px) saturate(140%);
          WebkitBackdropFilter: blur(24px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        /* Input Controls Framework */
        .liquid-field-stack { display: flex; flex-direction: column; gap: 8px; }
        .liquid-field-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }
        .liquid-input-wrapper { position: relative; width: 100%; }
        .liquid-input-node {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 16px;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .liquid-input-node:focus {
          border-color: rgba(197, 168, 128, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Top Layout Header Nav Bars */
        .liquid-navbar-frame {
          position: relative;
          z-index: 10;
          height: 64px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(10, 14, 26, 0.8);
          backdrop-filter: blur(20px);
        }
        .navbar-left-identity { display: flex; align-items: center; gap: 12px; }
        .identity-token {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(197, 168, 128, 0.1);
          border: 1px solid rgba(197, 168, 128, 0.3);
          color: #c5a880;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .identity-brand { font-size: 1rem; letter-spacing: 3px; font-weight: 300; }
        .identity-pill-tag {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: rgba(255, 255, 255, 0.25);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 12px;
          margin-left: 4px;
        }
        .navbar-signout-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .navbar-signout-btn:hover { color: rgba(255, 255, 255, 0.8); }

        /* Navigation Tab Controllers */
        .liquid-navigation-tab-container {
          position: relative;
          z-index: 10;
          padding: 0 40px;
          display: flex;
          gap: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .navigation-tab-node {
          background: transparent;
          border: none;
          position: relative;
          padding: 20px 0;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s ease;
        }
        .navigation-tab-node:hover { color: rgba(255, 255, 255, 0.85); }
        .tab-active { color: #c5a880 !important; }
        .tab-icon-wrapper { display: flex; align-items: center; opacity: 0.7; }
        .active-nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, #c5a880 0%, transparent 100%);
        }
        .live-unread-counter {
          padding: 2px 6px;
          border-radius: 20px;
          font-size: 0.65rem;
          background: #c5a880;
          color: #0a0e1a;
          font-weight: 700;
          margin-left: 2px;
        }

        /* Workspace Grid Split Layout Architecture */
        .admin-workspace-scroll-area {
          position: relative;
          z-index: 10;
          max-width: 1250px;
          margin: 0 auto;
          padding: 32px 40px;
          box-sizing: border-box;
        }
        .workspace-double-pane {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 32px;
          align-items: start;
          min-height: calc(100vh - 180px);
        }
        @media (max-width: 992px) {
          .workspace-double-pane { grid-template-columns: 1fr; }
          .split-column-viewport-panel { display: none !important; } /* Managed via fallback toggle logic */
        }
        .split-column-archive-list { display: flex; flex-direction: column; gap: 16px; }
        
        /* Archive Pills Filtering UI */
        .archive-pill-filter-row { display: flex; gap: 8px; }
        .archive-filter-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 8px 16px;
          border-radius: 30px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .archive-filter-pill:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.8);
        }
        .pill-active {
          background: rgba(197, 168, 128, 0.12) !important;
          border-color: rgba(197, 168, 128, 0.35) !important;
          color: #c5a880 !important;
        }
        .procedural-cards-stack { display: flex; flex-direction: column; gap: 12px; }
        
        /* Individual List Archive Rows Cards */
        .booking-list-row-card {
          border-radius: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .booking-list-row-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .row-selected {
          background: rgba(197, 168, 128, 0.06) !important;
          border-color: rgba(197, 168, 128, 0.3) !important;
        }
        .row-unread-glow {
          border-left: 2px solid #c5a880 !important;
        }
        .row-card-top-line { display: flex; justify-content: space-between; align-items: start; }
        .row-card-customer-name { font-size: 0.95rem; font-weight: 500; margin: 0; color: rgba(255, 255, 255, 0.9); }
        .row-card-date-range { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); margin: 4px 0 0 0; }
        .row-card-metrics-block { display: flex; align-items: center; gap: 8px; }
        .unread-dot { width: 6px; height: 6px; border-radius: 50%; background: #c5a880; }
        .row-card-price-value { font-size: 0.9rem; color: #c5a880; font-weight: 500; }
        .row-card-sub-metadata {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          align-items: center;
        }
        .spacer-pushed-right { margin-left: auto; }
        .loading-state-placeholder {
          padding: 40px 0;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.25);
        }

        /* Sub layout Component Details Pane Block */
        .split-column-viewport-panel { height: 100%; position: sticky; top: 32px; }
        .detail-header-block {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .detail-customer-fullname { font-size: 1.8rem; font-weight: 300; margin: 0; letter-spacing: -0.5px; }
        .detail-creation-stamp { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); margin: 6px 0 0 0; }
        
        .status-capsule-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }
        .badge-unread { background: rgba(197, 168, 128, 0.15); color: #c5a880; }
        .badge-read { background: rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.4); }

        .detail-metrics-structural-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .metric-isolated-capsule {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 16px;
          border-radius: 14px;
        }
        .metric-capsule-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #c5a880;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 6px;
          opacity: 0.8;
        }
        .metric-capsule-value { font-size: 0.9rem; margin: 0; color: rgba(255, 255, 255, 0.85); font-weight: 400; }

        .detail-invoice-summary-block {
          background: rgba(197, 168, 128, 0.06);
          border: 1px solid rgba(197, 168, 128, 0.15);
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
        }
        .invoice-split-flex { display: flex; justify-content: space-between; align-items: center; }
        .invoice-label-tag { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(197, 168, 128, 0.7); }
        .invoice-grand-total { font-size: 2rem; font-weight: 300; margin: 4px 0 0 0; color: #ffffff; }
        .invoice-breakdown-meta { text-align: right; font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); line-height: 1.5; }

        .detail-actions-button-footer-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .footer-btn { width: auto !important; padding: 12px 24px !important; margin: 0 !important; }

        /* Empty Selections Fallbacks Frame Layout */
        .empty-selection-fallback {
          height: 100%;
          min-height: 400px;
          flex-direction: column;
          gap: 16px;
          border-radius: 24px;
          border: 1px dashed rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.01);
        }
        .fallback-inner-icon-container {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .fallback-icon { color: rgba(255, 255, 255, 0.15); }
        .fallback-text-prompt { font-size: 0.85rem; color: rgba(255, 255, 255, 0.3); }

        /* Global View Scoped Panels Formatting Shared */
        .max-width-restrictor-frame { max-width: 680px; margin: 0 auto; }
        .compact-width { max-width: 480px; }
        .panel-headline-title { font-size: 1.5rem; font-weight: 400; margin: 0 0 6px 0; letter-spacing: 0.5px; }
        .panel-headline-sub { font-size: 0.85rem; color: rgba(255, 255, 255, 0.35); margin: 0 0 24px 0; line-height: 1.6; }

        /* Calendar Render Configurations Elements Grid */
        .calendar-legend-guide-row { display: flex; gap: 20px; margin-bottom: 32px; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255, 255, 255, 0.4); }
        .legend-swatch { width: 12px; height: 12px; border-radius: 4px; }
        .swatch-blocked { background: rgba(239, 68, 68, 0.4); border: 1px solid rgba(239, 68, 68, 0.6); }
        .swatch-booked { background: rgba(197, 168, 128, 0.2); border: 1px solid rgba(197, 168, 128, 0.4); }

        .calendar-month-selector-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .calendar-nav-arrow {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.5);
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .calendar-nav-arrow:hover { background: rgba(255, 255, 255, 0.08); color: #ffffff; }
        .calendar-current-month-heading { font-size: 1.2rem; font-weight: 400; margin: 0; }
        
        .calendar-days-structural-grid-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 12px; }
        .calendar-header-day-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255, 255, 255, 0.25); }
        .calendar-numerical-days-grid-layout { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        
        .calendar-render-day-node {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          border-radius: 10px;
          transition: all 0.15s ease;
          user-select: none;
          border: 1px solid transparent;
        }
        .day-node-open { color: rgba(255, 255, 255, 0.8); cursor: pointer; }
        .day-node-open:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.12); }
        .day-node-past { color: rgba(255, 255, 255, 0.15); cursor: default; text-decoration: line-through; }
        .day-node-blocked { background: rgba(239, 68, 68, 0.25) !important; color: #ffffff !important; border-color: rgba(239, 68, 68, 0.4) !important; cursor: pointer; }
        .day-node-booked { background: rgba(197, 168, 128, 0.14) !important; color: #c5a880 !important; border-color: rgba(197, 168, 128, 0.25) !important; cursor: default; }

        /* Pricing Configuration Layout Block Modules */
        .pricing-input-form-block { margin-bottom: 32px; }
        .pricing-inline-input-group { display: flex; relative; width: 100%; align-items: center; }
        .pricing-input-icon-adornment {
          position: absolute;
          left: 16px;
          color: rgba(255, 255, 255, 0.25);
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .customized-padding { padding-left: 36px !important; border-radius: 12px 0 0 12px !important; }
        .pricing-submit-btn { width: auto !important; border-radius: 0 12px 12px 0 !important; padding: 14px 24px !important; white-space: nowrap; }

        .pricing-matrix-preview-panel {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
        }
        .preview-panel-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: rgba(197, 168, 128, 0.7); margin: 0 0 18px 0; }
        .preview-matrix-rows-wrapper { display: flex; flex-direction: column; gap: 14px; }
        .preview-matrix-row-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
        .matrix-row-nights-label { color: rgba(255, 255, 255, 0.45); }
        .matrix-row-calculated-sum { color: #c5a880; font-weight: 500; }

        /* Unified Master Custom Action Interaction Buttons CSS Elements */
        .liquid-action-button {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #c5a880 0%, #a3855c 100%);
          color: #0a0e1a;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 8px 20px rgba(197, 168, 128, 0.15);
        }
        .liquid-action-button:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(197, 168, 128, 0.25); filter: brightness(105%); }
        .liquid-action-button-outline {
          background: transparent;
          border: 1px solid rgba(197, 168, 128, 0.4);
          color: #c5a880;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .liquid-action-button-outline:hover { background: rgba(197, 168, 128, 0.05); border-color: rgba(197, 168, 128, 0.6); }
        .liquid-destructive-button {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: rgba(239, 68, 68, 0.85);
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .liquid-destructive-button:hover { background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.5); }
      `}</style>
    </div>
  );
}