import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "bookings" | "reviews" | "gallery" | "settings";

const BOOKINGS = [
  { name: "Sarah Mitchell", email: "sarah@email.com", checkin: "2025-07-12", checkout: "2025-07-19", guests: 4, status: "Confirmed" },
  { name: "François Dubois", email: "francois@email.com", checkin: "2025-07-22", checkout: "2025-07-29", guests: 2, status: "Pending" },
  { name: "Marco Verdi", email: "marco@email.com", checkin: "2025-08-03", checkout: "2025-08-10", guests: 6, status: "Confirmed" },
  { name: "Anna Klein", email: "anna@email.com", checkin: "2025-08-15", checkout: "2025-08-22", guests: 3, status: "Pending" },
  { name: "Nikos Papas", email: "nikos@email.com", checkin: "2025-09-01", checkout: "2025-09-05", guests: 2, status: "Cancelled" },
];

const REVIEWS = [
  { name: "Sarah Mitchell", stars: 5, text: "An extraordinary escape. Every detail speaks of care and craftsmanship.", date: "2025-05-20" },
  { name: "François Dubois", stars: 5, text: "The pool, the silence, the marble — we never wanted to leave.", date: "2025-05-15" },
  { name: "Marco Verdi", stars: 5, text: "Perfect for our family. Elia is magic and Polyteleia made it unforgettable.", date: "2025-05-08" },
  { name: "Anna Klein", stars: 5, text: "The most beautiful villa we've stayed in. We'll be back every summer.", date: "2025-04-29" },
  { name: "Nikos Papas", stars: 5, text: "Woke up every morning feeling like royalty. Truly five-star in every sense.", date: "2025-04-17" },
];

function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="admin-layout site-bg">
      <aside className="admin-sidebar">
        <span className="brand">POLYTELEIA Admin</span>
        <nav className="admin-nav">
          {([
            ["dashboard", "Dashboard"],
            ["bookings", "Bookings"],
            ["reviews", "Reviews"],
            ["gallery", "Gallery"],
            ["settings", "Settings"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        {tab === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <div className="admin-stats">
              {[
                { num: "24", lbl: "Total Bookings" },
                { num: "3", lbl: "Pending Requests" },
                { num: "€8,400", lbl: "Revenue This Month" },
                { num: "4.9★", lbl: "Average Rating" },
              ].map((s) => (
                <div key={s.lbl} className="admin-stat-card">
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "bookings" && (
          <>
            <h1>Bookings</h1>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Guest</th><th>Email</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {BOOKINGS.map((b, i) => (
                    <tr key={i}>
                      <td>{b.name}</td>
                      <td>{b.email}</td>
                      <td>{b.checkin}</td>
                      <td>{b.checkout}</td>
                      <td>{b.guests}</td>
                      <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        <button className="btn-sm">Confirm</button>
                        <button className="btn-sm danger">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "reviews" && (
          <>
            <h1>Reviews</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {REVIEWS.map((r, i) => (
                <div key={i} className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <strong style={{ color: "var(--color-white)" }}>{r.name}</strong>
                    <span style={{ color: "var(--color-gold)" }}>{"★".repeat(r.stars)}</span>
                  </div>
                  <p style={{ fontStyle: "italic", color: "var(--color-cream)", marginBottom: 12 }}>"{r.text}"</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-stone)" }}>{r.date}</span>
                    <div>
                      <button className="btn-sm">Approve</button>
                      <button className="btn-sm danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "gallery" && (
          <>
            <h1>Gallery</h1>
            <button className="btn btn-filled" style={{ marginBottom: 24 }}>Add Photo</button>
            <div className="gallery-admin">
              {[
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=600&q=70",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=70",
              ].map((src, i) => (
                <div key={i} className="gallery-admin-tile">
                  <img src={src} alt="" loading="lazy" />
                  <button className="remove" aria-label="Remove">×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "settings" && (
          <>
            <h1>Settings</h1>
            <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 520 }}>
              <div className="field"><label>Villa Name</label><input defaultValue="Polyteleia Luxury Living" /></div>
              <div className="field"><label>Contact Email</label><input defaultValue="info@polyteleia.gr" /></div>
              <div className="field"><label>Phone</label><input defaultValue="+30 2810 000000" /></div>
              <div className="field"><label>Nightly Rate (€)</label><input type="number" defaultValue={350} /></div>
              <div className="field"><label>Max Guests</label><input type="number" defaultValue={8} /></div>
              <button className="btn btn-filled" type="submit">Save</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
