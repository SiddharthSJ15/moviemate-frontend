
# Movie Hub — React + Vite

A small React app built with Vite for tracking movies. This README has quick instructions for running locally, configuring environment variables, and deploying to Render (so the repo displays a useful README on GitHub).

## Quick start (local)

1. Install dependencies

```bash
npm install
```

1. Create a local `.env` from the example and add your OMDb API key:

```bash
cp .env.example .env
# then open .env and set VITE_OMDB_API_KEY
```

1. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment variables

Create `.env` in the project root (do not commit it). Example:

```bash
VITE_OMDB_API_KEY=your_real_api_key_here
VITE_API_URL=http://127.0.0.1:8000/api/
```

Access them in code with `import.meta.env.VITE_OMDB_API_KEY` and `import.meta.env.VITE_API_URL`.

## Deploying to Render (static site)

To host this app on Render as a Static Site (recommended for a frontend-only deployment):

1. Push the repo to GitHub (or your Git provider) and sign in to Render.
2. Create a new **Static Site** on Render and connect your repo and branch.
3. Use these settings:

    - Build Command: `npm run build`
    - Publish Directory: `dist`

4. Add environment variables in Render (Dashboard → Environment):

    - `VITE_OMDB_API_KEY` = your OMDb API key
    - (optional) `VITE_API_URL` = your backend API base URL

    Important: Render injects env vars at build time. Vite will bake these values into the generated files during `npm run build`.

5. Trigger a deploy. After the build finishes Render will publish the static site at the provided URL.

Tips and gotchas

- If you change env vars on Render, re-deploy the site so Vite can rebuild with the new values.
- Ensure public API keys (like OMDb) are allowed to be used in client-side apps — they are visible in the final bundle.
- Move any secrets that should not be client-visible to a backend service; call the backend from the frontend.

## Adding a Render badge to this README

After deployment, Render provides a badge URL for your service. Add it near the top of this README like:

```markdown
[![Live on Render](https://render.com/badges/{SERVICE_ID})](https://your-site.onrender.com)
```

Replace `{SERVICE_ID}` and `https://your-site.onrender.com` with the values Render gives you.

## What to do before pushing to Render

1. Confirm `package.json` has these scripts (it does):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

1. Ensure `.gitignore` contains `.env` so you don't accidentally push secrets.
1. Add `.env.example` with the var names so others know what to set.
1. Commit and push your branch to GitHub.

Example git commands to push:

```bash
git add .
git commit -m "chore: prepare repo for Render deployment and add README"
git push origin dev
```

After this, create the Render site and connect the repo/branch.

---

If you want, I can also:

- Add `VITE_API_URL` references to `src/services/api.js` and show how to fallback to a default.
- Add a tiny `.github/workflows` GitHub Actions file to automatically build the app and optionally deploy to Render via the Render deploy API.

Which would you like next?

