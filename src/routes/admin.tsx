import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Polyteleia" }] }),
  component: Admin,
});

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

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function addMonths(d: Date, n: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
function getCalDays(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1).getDay();
  return { first: first === 0 ? 6 : first - 1, days: new Date(year, m + 1, 0).getDate() };
}

// ── VILLA SELECTOR ────────────────────────────────────────────────────────
interface VillaSelectorProps {
  selected: 1 | 2;
  onSelect: (v: 1 | 2) => void;
}
function VillaSelector({ selected, onSelect }: VillaSelectorProps) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {([1, 2] as const).map((v) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "12px 28px",
            borderRadius: 14,
            cursor: "pointer",
            border: selected === v
              ? "1px solid rgba(197,168,128,0.55)"
              : "1px solid rgba(255,255,255,0.08)",
            borderTop: selected === v
              ? "1px solid rgba(197,168,128,0.75)"
              : "1px solid rgba(255,255,255,0.14)",
            background: selected === v
              ? "linear-gradient(135deg, rgba(197,168,128,0.14) 0%, rgba(197,168,128,0.04) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(20px)",
            color: selected === v ? "#c5a880" : "rgba(255,255,255,0.45)",
            transition: "all 0.2s ease",
            boxShadow: selected === v
              ? "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(197,168,128,0.1), inset 0 1px 1px rgba(197,168,128,0.15)"
              : "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.06)",
            minWidth: 100,
          }}
        >
          <span style={{ fontSize: "1.4rem", fontWeight: 200, letterSpacing: 2, lineHeight: 1 }}>
            {v === 1 ? "I" : "II"}
          </span>
          <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: 3, fontWeight: 500 }}>
            VILLA {v === 1 ? "I" : "II"}
          </span>
        </button>
      ))}
    </div>
  );
}

function Admin() {
  const [authed, setAuthed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginErr, setLoginErr] = React.useState("");
  const [loggingIn, setLoggingIn] = React.useState(false);

  // Villa selection
  const [villa, setVilla] = React.useState<1 | 2>(1);

  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [blocked, setBlocked] = React.useState<string[]>([]);
  const [pricePerNight, setPrice] = React.useState(0);
  const [newPrice, setNewPrice] = React.useState("");
  const [priceSaved, setPriceSaved] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  const [tab, setTab] = React.useState<"bookings" | "calendar" | "pricing">("bookings");
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");
  const [calMonth, setCalMonth] = React.useState(new Date());
  const [selected, setSelected] = React.useState<Booking | null>(null);

  const today = formatDate(new Date());

  // Session check
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    supabase.auth.getSession()
      .then(({ data }) => {
        setAuthed(!!data.session);
        setLoading(false);
        clearTimeout(timer);
      })
      .catch(() => {
        setLoading(false);
        clearTimeout(timer);
      });
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginErr("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginErr("Invalid email or password.");
        setPassword("");
      } else {
        setAuthed(true);
      }
    } catch {
      setLoginErr("Connection error. Please try again.");
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setBookings([]);
    setSelected(null);
  };

  // Fetch data based on selected villa
  const fetchVillaData = React.useCallback(async (v: 1 | 2) => {
    if (!authed) return;
    setLoadingData(true);
    setSelected(null);

    const bookingsTable = v === 1 ? "bookings" : "bookings2";
    const blockedTable = v === 1 ? "blocked_dates" : "blocked_dates2";

    Promise.all([
      supabase.from(bookingsTable).select("*").order("created_at", { ascending: false }),
      supabase.from(blockedTable).select("date"),
      supabase.from("pricing").select("price_per_night").single(),
    ]).then(([b, bl, p]) => {
      if (b.data) setBookings(b.data as Booking[]);
      else setBookings([]);
      if (bl.data) setBlocked(bl.data.map((d: { date: string }) => d.date));
      else setBlocked([]);
      if (p.data) {
        setPrice(Number(p.data.price_per_night));
        setNewPrice(String(p.data.price_per_night));
      }
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [authed]);

  // Load data when authed
  React.useEffect(() => {
    if (authed) fetchVillaData(villa);
  }, [authed]);

  // Reload when villa changes
  const handleVillaChange = (v: 1 | 2) => {
    setVilla(v);
    fetchVillaData(v);
  };

  const markStatus = async (id: string, status: "read" | "unread") => {
    const bookingsTable = villa === 1 ? "bookings" : "bookings2";
    await supabase.from(bookingsTable).update({ status }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Permanently delete this booking?")) return;
    const bookingsTable = villa === 1 ? "bookings" : "bookings2";
    await supabase.from(bookingsTable).delete().eq("id", id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setSelected(null);
  };

  const toggleBlocked = async (dateStr: string) => {
    const blockedTable = villa === 1 ? "blocked_dates" : "blocked_dates2";
    if (blocked.includes(dateStr)) {
      await supabase.from(blockedTable).delete().eq("date", dateStr);
      setBlocked(prev => prev.filter(d => d !== dateStr));
    } else {
      await supabase.from(blockedTable).insert({ date: dateStr });
      setBlocked(prev => [...prev, dateStr]);
    }
  };

  const isBookedDate = (dateStr: string) =>
    bookings.some(b => dateStr >= b.check_in && dateStr < b.check_out);

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

  const filtered = bookings.filter(b => filter === "all" ? true : b.status === filter);
  const unreadCount = bookings.filter(b => b.status === "unread").length;
  const { first: startDay, days: daysInMonth } = getCalDays(calMonth);

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase" }}>
          Loading…
        </p>
      </div>
    );
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...styles.page, justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={styles.badge}>P</div>
            <h1 style={styles.logo}>POLYTELEIA</h1>
            <p style={styles.logoSub}>Management Suite</p>
          </div>
          <form onSubmit={handleLogin} style={styles.card}>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginErr(""); }}
                placeholder="admin@polyteleia.gr"
                required
                autoFocus
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginErr(""); }}
                placeholder="••••••••••••"
                required
                style={{
                  ...styles.input,
                  borderColor: loginErr ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
                }}
              />
            </div>
            {loginErr && (
              <p style={{ color: "#ef4444", fontSize: "0.78rem", margin: "4px 0 12px" }}>{loginErr}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              style={{ ...styles.btnPrimary, marginTop: 16, opacity: loggingIn ? 0.6 : 1 }}
            >
              {loggingIn ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ ...styles.badge, width: 28, height: 28, fontSize: "0.75rem" }}>P</div>
          <span style={{ letterSpacing: 3, fontWeight: 300 }}>POLYTELEIA</span>
          <span style={styles.pillTag}>Admin</span>
        </div>
        {/* Villa Selector in header */}
        <VillaSelector selected={villa} onSelect={handleVillaChange} />
        <button onClick={handleLogout} style={styles.btnGhost}>Sign Out</button>
      </header>

      {/* Tabs */}
      <nav style={styles.tabs}>
        {(["bookings", "calendar", "pricing"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tabBtn,
              color: tab === t ? "#c5a880" : "rgba(255,255,255,0.45)",
              borderBottom: tab === t ? "1px solid #c5a880" : "1px solid transparent",
            }}
          >
            {t === "bookings"
              ? `Κρατήσεις${unreadCount > 0 ? ` (${unreadCount})` : ""}`
              : t === "calendar"
              ? "Ημερολόγιο"
              : "Τιμολόγηση"}
          </button>
        ))}
        {/* Villa badge next to tabs */}
        <span style={{
          marginLeft: "auto",
          alignSelf: "center",
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: 2.5,
          color: "rgba(197,168,128,0.6)",
          paddingRight: 4,
        }}>
          Villa {villa === 1 ? "I" : "II"}
        </span>
      </nav>

      {/* Content */}
      <main style={styles.main}>

        {/* BOOKINGS */}
        {tab === "bookings" && (
          <div style={styles.splitPane}>
            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                {(["all", "unread", "read"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    ...styles.pill,
                    background: filter === f ? "rgba(197,168,128,0.12)" : "rgba(255,255,255,0.03)",
                    borderColor: filter === f ? "rgba(197,168,128,0.35)" : "rgba(255,255,255,0.06)",
                    color: filter === f ? "#c5a880" : "rgba(255,255,255,0.5)",
                  }}>
                    {f === "all" ? "Όλες" : f === "unread" ? "Αδιάβαστες" : "Διαβασμένες"}
                  </button>
                ))}
              </div>
              {loadingData && <p style={styles.muted}>Φόρτωση…</p>}
              {!loadingData && filtered.length === 0 && (
                <p style={styles.muted}>Δεν υπάρχουν κρατήσεις για Villa {villa === 1 ? "I" : "II"}</p>
              )}
              {filtered.map(b => (
                <div
                  key={b.id}
                  onClick={() => { setSelected(b); markStatus(b.id, "read"); }}
                  style={{
                    ...styles.card,
                    cursor: "pointer",
                    borderColor: selected?.id === b.id ? "rgba(197,168,128,0.4)" : b.status === "unread" ? "rgba(197,168,128,0.2)" : "rgba(255,255,255,0.06)",
                    borderLeft: b.status === "unread" ? "2px solid #c5a880" : undefined,
                    background: selected?.id === b.id ? "rgba(197,168,128,0.06)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{b.first_name} {b.last_name}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{b.check_in} → {b.check_out}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {b.status === "unread" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c5a880", display: "inline-block" }} />}
                      <span style={{ color: "#c5a880", fontWeight: 500 }}>€{b.total_price ?? "—"}</span>
                    </div>
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                    {b.guests} επισκ. · {b.nights} βράδια · {new Date(b.created_at).toLocaleDateString("el-GR")}
                  </p>
                </div>
              ))}
            </div>

            {/* Detail */}
            <div>
              {selected ? (
                <div style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <h2 style={{ margin: 0, fontWeight: 300, fontSize: "1.6rem" }}>{selected.first_name} {selected.last_name}</h2>
                      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                        {new Date(selected.created_at).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: 1,
                        background: selected.status === "unread" ? "rgba(197,168,128,0.15)" : "rgba(255,255,255,0.06)",
                        color: selected.status === "unread" ? "#c5a880" : "rgba(255,255,255,0.4)",
                      }}>
                        {selected.status === "unread" ? "Αδιάβαστη" : "Διαβασμένη"}
                      </span>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: 1,
                        background: "rgba(197,168,128,0.08)", color: "rgba(197,168,128,0.7)",
                        border: "1px solid rgba(197,168,128,0.2)",
                      }}>
                        Villa {villa === 1 ? "I" : "II"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[
                      ["Email", selected.email],
                      ["Τηλέφωνο", selected.phone],
                      ["Επισκέπτες", `${selected.guests} άτομα`],
                      ["Σύνολο", selected.total_price ? `€${selected.total_price}` : "—"],
                      ["Check-In", selected.check_in],
                      ["Check-Out", selected.check_out],
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 12 }}>
                        <p style={{ margin: "0 0 4px", fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: 1.5, color: "rgba(197,168,128,0.8)" }}>{label}</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(197,168,128,0.06)", border: "1px solid rgba(197,168,128,0.15)", padding: 20, borderRadius: 14, marginBottom: 24 }}>
                    <p style={{ margin: "0 0 4px", fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: 1.5, color: "rgba(197,168,128,0.7)" }}>Συνολικό Ποσό</p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: 300 }}>€{selected.total_price ?? "—"}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{selected.nights} διανυκτερεύσεις · €{pricePerNight}/βράδυ</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                    {selected.status === "unread"
                      ? <button onClick={() => markStatus(selected.id, "read")} style={{ ...styles.btnPrimary, width: "auto", padding: "10px 20px" }}>✓ Διαβασμένη</button>
                      : <button onClick={() => markStatus(selected.id, "unread")} style={{ ...styles.btnOutline, width: "auto", padding: "10px 20px" }}>↺ Αδιάβαστη</button>
                    }
                    <button onClick={() => deleteBooking(selected.id)} style={{ ...styles.btnDanger, width: "auto", padding: "10px 20px" }}>✕ Διαγραφή</button>
                  </div>
                </div>
              ) : (
                <div style={{ ...styles.card, textAlign: "center", padding: "80px 40px", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
                  Επιλέξτε μια κράτηση
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {tab === "calendar" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={styles.card}>
              <h2 style={styles.panelTitle}>
                Διαχείριση Διαθεσιμότητας
                <span style={{ fontSize: "0.8rem", fontWeight: 300, color: "#c5a880", marginLeft: 12 }}>
                  — Villa {villa === 1 ? "I" : "II"}
                </span>
              </h2>
              <p style={styles.panelSub}>Κλικ σε ημέρα για εναλλαγή Ανοιχτής / Κλειστής.</p>
              <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <span style={styles.legend}><span style={{ ...styles.swatch, background: "rgba(239,68,68,0.4)", border: "1px solid rgba(239,68,68,0.6)" }} /> Κλειστή</span>
                <span style={styles.legend}><span style={{ ...styles.swatch, background: "rgba(197,168,128,0.2)", border: "1px solid rgba(197,168,128,0.4)" }} /> Κράτηση</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <button onClick={() => setCalMonth(m => addMonths(m, -1))} style={styles.calBtn}>‹</button>
                <h3 style={{ margin: 0, fontWeight: 400 }}>{calMonth.toLocaleDateString("el-GR", { month: "long", year: "numeric" })}</h3>
                <button onClick={() => setCalMonth(m => addMonths(m, 1))} style={styles.calBtn}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", marginBottom: 10 }}>
                {["Δε","Τρ","Τε","Πε","Πα","Σα","Κυ"].map(d => (
                  <div key={d} style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1 }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isPast = dateStr < today;
                  const isBlock = blocked.includes(dateStr);
                  const isBooked = isBookedDate(dateStr);
                  return (
                    <div
                      key={dateStr}
                      onClick={() => !isPast && !isBooked && toggleBlocked(dateStr)}
                      style={{
                        height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 8, fontSize: "0.88rem", border: "1px solid transparent",
                        cursor: isPast || isBooked ? "default" : "pointer",
                        background: isBlock ? "rgba(239,68,68,0.25)" : isBooked ? "rgba(197,168,128,0.14)" : "transparent",
                        borderColor: isBlock ? "rgba(239,68,68,0.4)" : isBooked ? "rgba(197,168,128,0.25)" : "transparent",
                        color: isPast ? "rgba(255,255,255,0.15)" : isBooked ? "#c5a880" : "rgba(255,255,255,0.8)",
                        textDecoration: isPast ? "line-through" : "none",
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PRICING */}
        {tab === "pricing" && (
          <div style={{ maxWidth: 440, margin: "0 auto" }}>
            <div style={styles.card}>
              <h2 style={styles.panelTitle}>Τιμολόγηση</h2>
              <p style={styles.panelSub}>
                Κοινή τιμή βάσης ανά διανυκτέρευση και για τις δύο βίλες.
              </p>
              <label style={styles.label}>Τιμή ανά βράδυ (€)</label>
              <div style={{ display: "flex", marginBottom: 24 }}>
                <input
                  type="number" min="0" value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  placeholder="450"
                  style={{ ...styles.input, borderRadius: "12px 0 0 12px", flex: 1 }}
                />
                <button onClick={savePrice} style={{ ...styles.btnPrimary, width: "auto", borderRadius: "0 12px 12px 0", padding: "14px 20px" }}>
                  {priceSaved ? "✓ Αποθηκεύτηκε" : "Αποθήκευση"}
                </button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20 }}>
                <p style={{ margin: "0 0 14px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "rgba(197,168,128,0.7)" }}>Προεπισκόπηση</p>
                {[2, 3, 5, 7].map(n => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: "0.85rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.45)" }}>{n} βράδια</span>
                    <span style={{ color: "#c5a880", fontWeight: 500 }}>€{(n * Number(newPrice || 0)).toLocaleString("el-GR")}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 20, fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.6, borderLeft: "2px solid rgba(197,168,128,0.2)", paddingLeft: 12 }}>
                Η τιμή ισχύει και για τις δύο βίλες (Villa I & Villa II).
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh", width: "100%",
    background: "#0a0e1a", color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex", flexDirection: "column" as const,
  },
  header: {
    width: "100%", height: 64, padding: "0 40px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,14,26,0.9)", backdropFilter: "blur(20px)",
    boxSizing: "border-box" as const,
  },
  tabs: {
    width: "100%", display: "flex", gap: 0, alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "0 40px", boxSizing: "border-box" as const,
  },
  tabBtn: {
    background: "transparent", border: "none", padding: "18px 24px",
    fontSize: "0.85rem", cursor: "pointer", letterSpacing: 0.5,
    transition: "color 0.2s",
  },
  main: {
    width: "100%", maxWidth: 1280,
    padding: "32px 40px", boxSizing: "border-box" as const,
  },
  splitPane: {
    display: "grid", gridTemplateColumns: "360px 1fr",
    gap: 28, alignItems: "start",
  },
  card: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderTop: "1px solid rgba(255,255,255,0.14)",
    padding: 24,
    boxSizing: "border-box" as const,
  },
  badge: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 52, height: 52, borderRadius: "50%",
    background: "rgba(197,168,128,0.07)", border: "1px solid rgba(197,168,128,0.25)",
    color: "#c5a880", fontSize: "1.2rem", fontWeight: 300,
    marginBottom: 16,
  },
  logo: { fontSize: "1.7rem", fontWeight: 300, letterSpacing: 6, margin: 0 },
  logoSub: { fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: 4, color: "rgba(255,255,255,0.3)", margin: "6px 0 0" },
  label: { display: "block", fontSize: "0.68rem", textTransform: "uppercase" as const, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 8 },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
    padding: "13px 16px", borderRadius: 12, color: "#fff", fontSize: "0.9rem", outline: "none",
  },
  btnPrimary: {
    width: "100%", padding: 14, borderRadius: 12, border: "none",
    background: "linear-gradient(135deg, #c5a880 0%, #a3855c 100%)",
    color: "#0a0e1a", fontSize: "0.8rem", fontWeight: 600,
    textTransform: "uppercase" as const, letterSpacing: 1.5, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnOutline: {
    width: "100%", padding: 14, borderRadius: 12,
    background: "transparent", border: "1px solid rgba(197,168,128,0.4)",
    color: "#c5a880", fontSize: "0.8rem", fontWeight: 600,
    textTransform: "uppercase" as const, letterSpacing: 1.5, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnDanger: {
    width: "100%", padding: 14, borderRadius: 12,
    background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
    color: "rgba(239,68,68,0.85)", fontSize: "0.8rem", fontWeight: 600,
    textTransform: "uppercase" as const, letterSpacing: 1.5, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnGhost: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.35)",
    fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: 1.5, cursor: "pointer",
  },
  pillTag: {
    fontSize: "0.6rem", textTransform: "uppercase" as const, letterSpacing: 2.5,
    color: "rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.15)",
    paddingLeft: 12, marginLeft: 4,
  },
  pill: {
    padding: "7px 14px", borderRadius: 30, fontSize: "0.7rem",
    textTransform: "uppercase" as const, letterSpacing: 1, cursor: "pointer",
    border: "1px solid", transition: "all 0.2s",
  },
  muted: { textAlign: "center" as const, color: "rgba(255,255,255,0.25)", fontSize: "0.85rem", padding: "32px 0" },
  panelTitle: { fontSize: "1.4rem", fontWeight: 400, margin: "0 0 6px", letterSpacing: 0.5 },
  panelSub: { fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", margin: "0 0 24px", lineHeight: 1.6 },
  calBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)", padding: "6px 14px", borderRadius: "50%",
    cursor: "pointer", fontSize: "1.2rem",
  },
  legend: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: 1 },
  swatch: { width: 12, height: 12, borderRadius: 3, display: "inline-block" },
};