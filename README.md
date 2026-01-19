# 🚀 Blazing Job Tracker (React + localStorage)

A clean, fast **Job Application Tracker Dashboard** built with **React (JS)** and **localStorage**. Track applications like a product: add roles, filter by status, search by company/role, update outcomes, and keep notes — all saved automatically in your browser.

---

## ✨ Features

* ✅ Add job applications (Company, Role, Status, Date, Link, Notes)
* 🔎 Search by **company** or **role**
* 🧩 Filter by status: **Applied / OA / Interview / Offer / Rejected**
* 📊 Status summary cards with counts
* 📝 Notes stored per application
* 🔁 Update status instantly from the table
* 💾 Auto-save to **localStorage** (no backend needed)
* 🎨 Premium-looking dark UI (inline styles)

---

## 🧱 Tech Stack

* **React (JavaScript)**
* **Hooks:** `useState`, `useEffect`, `useMemo`
* **Storage:** Browser `localStorage`
* **Build tool:** Vite (recommended)

---

## ✅ Getting Started (Local)

### 1) Create a Vite React app

```bash
npm create vite@latest blazing-job-tracker -- --template react
cd blazing-job-tracker
npm install
```

### 2) Replace the default App

Replace:

* `src/App.jsx` with your provided code

Then run:

```bash
npm run dev
```

Open the shown localhost URL.

---

## 🧠 Data Persistence

This app saves automatically using:

```js
const STORAGE_KEY = "blazing-job-tracker:v1";
```

Your data lives in the browser here:

* DevTools → Application → Local Storage → `blazing-job-tracker:v1`

To reset:

* Clear that localStorage key, or clear site data.

---

## 🧪 Usage

1. Fill **Company** + **Role**
2. Pick **Status**, set **Date**, optionally add **Link** and **Notes**
3. Click **Add Job**
4. Use:

   * Summary cards to filter quickly
   * Search box to find roles/com
   * Status dropdown to update progress

---

## 🌍 Deploy to GitHub Pages (Vite)

### 1) Install `gh-pages`

```bash
npm i -D gh-pages
```

### 2) Update `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/<YOUR_REPO_NAME>/",
});
```

Example:

* repo name: `blazing-job-tracker`
* base becomes: `"/blazing-job-tracker/"`

### 3) Add deploy scripts in `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4) Deploy

```bash
npm run deploy
```

Then:

* GitHub → Repo → **Settings → Pages**
* Branch: `gh-pages` (root)
* Your site will be live at:
  `https://<username>.github.io/<repo-name>/`

---

## 🔒 Notes

* This app is **frontend-only** (no backend).
* Data is stored per-device/per-browser via localStorage.
* If you open it on another laptop/browser, it starts fresh.

---

## 📌 Roadmap (Easy upgrades)

* Export/Import JSON backup
* Sort by status or company
* “Follow-up date” + reminder tag
* Attach recruiter name + contact field
* Analytics: weekly application count chart

---

## 📄 License

MIT — use it freely and modify as you like.
