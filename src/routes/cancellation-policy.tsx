import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import endFrame from "@/assets/end.jpeg";

export const Route = createFileRoute("/cancellation")({
  head: () => ({ meta: [{ title: "Cancellation Policy — Polyteleia" }] }),
  component: CancellationPolicy,
});

function CancellationPolicy() {
  useScrollAnimation();
  const { t, language } = useTranslation();
  const isGr = language === "el";

  return (
    <>
      {/* Background — end.jpeg fixed */}
      <div
        aria-hidden
        style={{
          position:           "fixed",
          inset:              0,
          zIndex:             -1,
          pointerEvents:      "none",
          backgroundImage:    `url(${endFrame})`,
          backgroundRepeat:   "no-repeat",
          backgroundSize:     "cover",
          backgroundPosition: "center center",
        }}
      >
        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.60) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position:      "relative",
          zIndex:        1,
          minHeight:     "100vh",
          padding:       "120px 24px 100px",
          maxWidth:      800,
          margin:        "0 auto",
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 64 }}>
          <span style={eyebrow}>
            {isGr ? "Νομικές Πληροφορίες" : "Legal Information"}
          </span>
          <h1 style={pageTitle}>
            {isGr ? "Πολιτική Ακυρώσεων" : "Cancellation Policy"}
          </h1>
          <p style={subtitle}>
            {isGr
              ? "Παρακαλούμε διαβάστε προσεκτικά τους όρους ακύρωσης κράτησης πριν ολοκληρώσετε τη διαδικασία."
              : "Please read our cancellation terms carefully before completing your reservation."}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Zone 1 — Free */}
          <div style={glassCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ ...iconBadge, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}>
                <CheckIcon color="#4ade80" />
              </div>
              <div>
                <p style={cardEyebrow}>
                  {isGr ? "Ζώνη 1 — Δωρεάν Ακύρωση" : "Zone 1 — Free Cancellation"}
                </p>
                <h3 style={cardTitle}>
                  {isGr ? "Άνω των 30 ημερών" : "More than 30 days before"}
                </h3>
              </div>
            </div>
            <p style={cardBody}>
              {isGr
                ? "Ακυρώσεις που πραγματοποιούνται τουλάχιστον 30 ημέρες πριν από την ημερομηνία άφιξης δικαιούνται πλήρη επιστροφή χρημάτων, χωρίς καμία επιβάρυνση."
                : "Cancellations made at least 30 days before the check-in date are entitled to a full refund with no charges applied."}
            </p>
            <div style={tagGreen}>
              {isGr ? "✓ Πλήρης επιστροφή 100%" : "✓ Full refund 100%"}
            </div>
          </div>

          {/* Zone 2 — 50% */}
          <div style={glassCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ ...iconBadge, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <HalfIcon color="#fbbf24" />
              </div>
              <div>
                <p style={cardEyebrow}>
                  {isGr ? "Ζώνη 2 — Μερική Επιστροφή" : "Zone 2 — Partial Refund"}
                </p>
                <h3 style={cardTitle}>
                  {isGr ? "15–30 ημέρες πριν" : "15–30 days before"}
                </h3>
              </div>
            </div>
            <p style={cardBody}>
              {isGr
                ? "Ακυρώσεις που πραγματοποιούνται μεταξύ 15 και 30 ημερών πριν από την ημερομηνία άφιξης δικαιούνται επιστροφή του 50% του συνολικού ποσού κράτησης."
                : "Cancellations made between 15 and 30 days before the check-in date are entitled to a 50% refund of the total booking amount."}
            </p>
            <div style={tagGold}>
              {isGr ? "⚠ Επιστροφή 50%" : "⚠ 50% refund"}
            </div>
          </div>

          {/* Zone 3 — Non-refundable */}
          <div style={glassCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ ...iconBadge, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <XIcon color="#ef4444" />
              </div>
              <div>
                <p style={cardEyebrow}>
                  {isGr ? "Ζώνη 3 — Μη Επιστρεπτέα" : "Zone 3 — Non-Refundable"}
                </p>
                <h3 style={cardTitle}>
                  {isGr ? "Εντός 15 ημερών" : "Within 15 days"}
                </h3>
              </div>
            </div>
            <p style={cardBody}>
              {isGr
                ? "Ακυρώσεις εντός 15 ημερών από την ημερομηνία άφιξης δεν δικαιούνται επιστροφή χρημάτων. Το σύνολο του ποσού κράτησης παρακρατείται."
                : "Cancellations within 15 days of the check-in date are non-refundable. The full booking amount will be retained."}
            </p>
            <div style={tagRed}>
              {isGr ? "✕ Μη επιστρεπτέα" : "✕ No refund"}
            </div>
          </div>

          {/* Timeline visual */}
          <div style={{ ...glassCard, padding: "28px 32px" }}>
            <p style={{ ...cardEyebrow, marginBottom: 24 }}>
              {isGr ? "Σύνοψη Χρονοδιαγράμματος" : "Timeline Summary"}
            </p>
            <div style={{ position: "relative" }}>
              {/* Line */}
              <div style={{
                position: "absolute", top: 18, left: 0, right: 0, height: 2,
                background: "linear-gradient(to right, #4ade80, #fbbf24, #ef4444)",
                borderRadius: 2,
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                {[
                  { label: isGr ? "Σήμερα" : "Today", color: "#4ade80" },
                  { label: isGr ? "30 μέρες" : "30 days", color: "#a3e635" },
                  { label: isGr ? "15 μέρες" : "15 days", color: "#fbbf24" },
                  { label: isGr ? "Check-in" : "Check-in", color: "#ef4444" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, border: "2px solid rgba(0,0,0,0.3)", zIndex: 1 }} />
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ ...glassCard, background: "rgba(201,168,76,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
            <p style={{ ...cardEyebrow, color: "rgba(201,168,76,0.9)", marginBottom: 16 }}>
              {isGr ? "Σημαντικές Σημειώσεις" : "Important Notes"}
            </p>
            {(isGr ? [
              "Όλες οι ακυρώσεις πρέπει να γίνουν εγγράφως μέσω email στο info@polyteleia.gr.",
              "Η ημερομηνία ακύρωσης θεωρείται η ημερομηνία παραλαβής του email.",
              "Τυχόν επιστροφές χρημάτων πραγματοποιούνται εντός 5–10 εργάσιμων ημερών.",
              "Σε περίπτωση ανωτέρας βίας, εξετάζεται κάθε περίπτωση ξεχωριστά.",
            ] : [
              "All cancellations must be made in writing via email to info@polyteleia.gr.",
              "The cancellation date is considered the date the email is received.",
              "Refunds are processed within 5–10 business days.",
              "In cases of force majeure, each situation will be reviewed individually.",
            ]).map((note, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.75rem", marginTop: 2, flexShrink: 0 }}>✦</span>
                <p style={{ ...cardBody, margin: 0 }}>{note}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: 48, letterSpacing: "0.05em" }}>
          {isGr
            ? "Η πολιτική αυτή ισχύει για όλες τις κρατήσεις που πραγματοποιούνται μέσω της παρούσας ιστοσελίδας."
            : "This policy applies to all bookings made through this website."}
        </p>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  color: "var(--color-gold, #c9a84c)",
  letterSpacing: "0.22em",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 12,
};

const pageTitle: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
  fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
  fontWeight: 300,
  color: "#fff",
  margin: "0 0 20px",
  letterSpacing: "0.05em",
  textShadow: "0 2px 30px rgba(0,0,0,0.4)",
};

const subtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "1rem",
  fontWeight: 300,
  lineHeight: 1.7,
  maxWidth: 540,
  margin: "0 auto",
};

const glassCard: React.CSSProperties = {
  backdropFilter: "blur(22px) saturate(1.8)",
  WebkitBackdropFilter: "blur(22px) saturate(1.8)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderTop: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 18,
  padding: "28px 28px 24px",
  boxShadow: "0 4px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
};

const iconBadge: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const cardEyebrow: React.CSSProperties = {
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: "rgba(255,255,255,0.4)",
  margin: "0 0 4px",
};

const cardTitle: React.CSSProperties = {
  fontSize: "1.15rem",
  fontWeight: 400,
  color: "#fff",
  margin: 0,
  letterSpacing: "0.02em",
};

const cardBody: React.CSSProperties = {
  color: "rgba(255,255,255,0.65)",
  fontSize: "0.9rem",
  lineHeight: 1.75,
  margin: "0 0 16px",
};

const tagBase: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 30,
  fontSize: "0.72rem",
  letterSpacing: "0.08em",
  fontWeight: 500,
};

const tagGreen: React.CSSProperties = {
  ...tagBase,
  background: "rgba(74,222,128,0.1)",
  border: "1px solid rgba(74,222,128,0.3)",
  color: "#4ade80",
};

const tagGold: React.CSSProperties = {
  ...tagBase,
  background: "rgba(251,191,36,0.1)",
  border: "1px solid rgba(251,191,36,0.3)",
  color: "#fbbf24",
};

const tagRed: React.CSSProperties = {
  ...tagBase,
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
  color: "#ef4444",
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function HalfIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18" fill={color} fillOpacity="0.3" stroke="none" />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}