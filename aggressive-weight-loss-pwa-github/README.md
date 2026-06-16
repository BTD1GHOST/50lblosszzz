# WARPATH — 50 lbs. No Mercy.

Aggressive weight loss and self-improvement tracker (React + Vite PWA).

Live site: **https://btd1-ghost.github.io/50lblossbray/**

## Deploy to GitHub Pages (required)

Uploading source files alone will **not** work — GitHub cannot run TypeScript directly. You must use the GitHub Actions workflow included in this repo.

1. Upload **all files** from this project to your `50lblossbray` repo on GitHub (including the `.github/workflows/deploy.yml` folder).
2. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** (not "Deploy from a branch").
3. Go to **Actions** tab and run **Deploy to GitHub Pages** (or push any commit to `main`).
4. Wait for the green checkmark, then refresh your site.

If you only see the repo name on a blank white page, GitHub is showing the README — the app has not been built and deployed yet.

## Local development

```bash
npm install
npm run dev
```

## Data storage

All progress is saved in your browser (`localStorage`). Use Export in the app to back up your data.
