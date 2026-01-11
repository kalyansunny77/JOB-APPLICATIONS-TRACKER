import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "blazing-job-tracker:v1";

const STATUSES = [
  { key: "Applied", color: "#60a5fa" },
  { key: "OA", color: "#fbbf24" },
  { key: "Interview", color: "#a78bfa" },
  { key: "Offer", color: "#34d399" },
  { key: "Rejected", color: "#fb7185" },
];

function uid() {
  return Math.floor(Date.now() + Math.random() * 1000);
}

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const [form, setForm] = useState({
    company: "",
    role: "",
    link: "",
    status: "Applied",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setJobs(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const counts = useMemo(() => {
    const map = { All: jobs.length };
    for (const s of STATUSES) map[s.key] = 0;
    for (const j of jobs) map[j.status] = (map[j.status] || 0) + 1;
    return map;
  }, [jobs]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs
      .filter((j) => (status === "All" ? true : j.status === status))
      .filter((j) =>
        query
          ? j.company.toLowerCase().includes(query) ||
            j.role.toLowerCase().includes(query)
          : true
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [jobs, q, status]);

  function addJob() {
    if (!form.company.trim() || !form.role.trim()) return;

    const newJob = { id: uid(), ...form };
    setJobs((prev) => [newJob, ...prev]);

    setForm((prev) => ({
      ...prev,
      company: "",
      role: "",
      link: "",
      notes: "",
      status: "Applied",
      date: new Date().toISOString().slice(0, 10),
    }));
  }

  function removeJob(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  function updateJob(id, patch) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.h1}>Job Tracker Dashboard</h1>
            <p style={ui.sub}>
              Track applications like a product. Build signal. Ship results.
            </p>
          </div>
          <div style={ui.pill}>localStorage • React (JS)</div>
        </header>

        <section style={ui.cards}>
          <StatCard
            title="All"
            value={counts.All}
            color="#93c5fd"
            active={status === "All"}
            onClick={() => setStatus("All")}
          />
          {STATUSES.map((s) => (
            <StatCard
              key={s.key}
              title={s.key}
              value={counts[s.key] || 0}
              color={s.color}
              active={status === s.key}
              onClick={() => setStatus(s.key)}
            />
          ))}
        </section>

        <section style={ui.grid}>
          <div style={ui.panel}>
            <h2 style={ui.h2}>Add Application</h2>

            <div style={ui.formGrid}>
              <Field label="Company *">
                <input
                  style={ui.input}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="DoorDash"
                />
              </Field>

              <Field label="Role *">
                <input
                  style={ui.input}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer Intern"
                />
              </Field>

              <Field label="Status">
                <select
                  style={ui.input}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Date">
                <input
                  style={ui.input}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>

              <Field label="Job Link">
                <input
                  style={ui.input}
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                />
              </Field>

              <Field label="Notes">
                <textarea
                  style={{ ...ui.input, minHeight: 90, resize: "vertical" }}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Recruiter call notes, next steps, etc."
                />
              </Field>

              <button style={ui.primaryBtn} onClick={addJob}>
                Add Job
              </button>
              <div style={ui.hint}>
                Tip: Add 15–25 apps/day + track outcomes.
              </div>
            </div>
          </div>

          <div style={ui.panel}>
            <div style={ui.tableHeader}>
              <div>
                <h2 style={ui.h2}>Applications</h2>
                <p style={ui.subSmall}>
                  Search, update status, keep notes.
                </p>
              </div>

              <div style={ui.tableControls}>
                <input
                  style={{ ...ui.input, width: 220 }}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search company/role"
                />
                <select
                  style={{ ...ui.input, width: 160 }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={ui.tableWrap}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    <th style={ui.th}>Company</th>
                    <th style={ui.th}>Role</th>
                    <th style={ui.th}>Status</th>
                    <th style={ui.th}>Date</th>
                    <th style={ui.th}>Link</th>
                    <th style={ui.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td style={ui.td} colSpan={6}>
                        No items yet. Add your first application 👈
                      </td>
                    </tr>
                  ) : (
                    filtered.map((j) => (
                      <tr key={j.id} style={ui.tr}>
                        <td style={ui.td}>
                          <strong>{j.company}</strong>
                          {j.notes ? (
                            <div style={ui.note}>{j.notes}</div>
                          ) : null}
                        </td>
                        <td style={ui.td}>{j.role}</td>
                        <td style={ui.td}>
                          <select
                            style={ui.badgeSelect}
                            value={j.status}
                            onChange={(e) =>
                              updateJob(j.id, { status: e.target.value })
                            }
                          >
                            {STATUSES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.key}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={ui.td}>{j.date}</td>
                        <td style={ui.td}>
                          {j.link ? (
                            <a style={ui.a} href={j.link} target="_blank">
                              Open
                            </a>
                          ) : (
                            <span style={ui.dim}>—</span>
                          )}
                        </td>
                        <td style={ui.td}>
                          <button
                            style={ui.dangerBtn}
                            onClick={() => removeJob(j.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <footer style={ui.footer}>
              <span style={ui.dim}>Saved automatically</span>
              <span style={ui.dim}>{STORAGE_KEY}</span>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...ui.cardBtn,
        borderColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
        transform: active ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div style={{ ...ui.dot, background: color }} />
      <div style={{ textAlign: "left" }}>
        <div style={ui.cardTitle}>{title}</div>
        <div style={ui.cardValue}>{value}</div>
      </div>
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={ui.field}>
      <div style={ui.label}>{label}</div>
      {children}
    </label>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background: "radial-gradient(1200px 800px at 10% 10%, #0b1220, #05070f)",
    color: "#e5e7eb",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  shell: { width: "min(1200px, 100%)", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  h1: { margin: 0, fontSize: 28, letterSpacing: 0.2 },
  sub: { margin: "6px 0 0", opacity: 0.75 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    opacity: 0.9,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 14,
  },
  cardBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
    cursor: "pointer",
    color: "inherit",
    transition: "transform 0.15s ease, border-color 0.15s ease",
  },
  dot: { width: 10, height: 10, borderRadius: 999 },
  cardTitle: { fontSize: 12, opacity: 0.75 },
  cardValue: { fontSize: 22, fontWeight: 800, marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "420px 1fr", gap: 14 },
  panel: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
    padding: 14,
  },
  h2: { margin: 0, fontSize: 18 },
  subSmall: { margin: "6px 0 0", opacity: 0.75, fontSize: 13 },
  formGrid: { display: "grid", gap: 10, marginTop: 12 },
  field: { display: "grid", gap: 6 },
  label: { fontSize: 12, opacity: 0.75 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    outline: "none",
  },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#07130b",
  },
  hint: { opacity: 0.7, fontSize: 12, marginTop: -2 },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  tableControls: { display: "flex", gap: 10, alignItems: "center" },
  tableWrap: {
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.3,
    opacity: 0.8,
    padding: 12,
    background: "rgba(255,255,255,0.04)",
  },
  td: {
    padding: 12,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    verticalAlign: "top",
    fontSize: 14,
  },
  tr: { background: "rgba(255,255,255,0.02)" },
  badgeSelect: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(248,113,113,0.12)",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 700,
  },
  a: { color: "#93c5fd", textDecoration: "underline" },
  note: { marginTop: 6, opacity: 0.85, whiteSpace: "pre-wrap" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dim: { opacity: 0.7 },
};
