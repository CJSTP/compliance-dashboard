# Deployment Guide

Two services to deploy: backend → Render, frontend → Vercel. Both are free.

---

## Step 1 — Push to GitHub

```bash
cd "/Users/christinest.pierre/Python/regulatory compliance"
git init
git add .
git commit -m "Initial commit"
```

Then create a new repo at https://github.com/new (keep it private) and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

---

## Step 2 — Deploy Backend (Render)

1. Go to https://render.com → sign up / log in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Render will detect `render.yaml` automatically — confirm settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free
5. Click **Create Web Service**
6. Wait ~2 minutes for the first deploy
7. Copy your service URL — it will look like `https://compliance-dashboard-api.onrender.com`

---

## Step 3 — Deploy Frontend (Vercel)

1. Go to https://vercel.com → sign up / log in with GitHub
2. Click **Add New → Project**
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Vercel will detect `vercel.json` — build settings are pre-configured
6. Before deploying, add an **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: your Render URL from Step 2 (e.g. `https://compliance-dashboard-api.onrender.com`)
7. Click **Deploy**
8. Your frontend URL will look like `https://your-app.vercel.app`

---

## Step 4 — Connect Frontend → Backend (CORS)

Go back to Render → your service → **Environment** tab and update:

- `ALLOWED_ORIGINS` → your Vercel URL (e.g. `https://your-app.vercel.app`)

Then click **Save Changes** — Render will redeploy automatically.

---

## Sharing

Send the Vercel URL to anyone. No login required. The sample data is seeded automatically on first startup.

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds to wake up — warn viewers of this.
