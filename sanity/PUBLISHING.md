# Editing, previewing & publishing

How the CMS preview and "publish → live" flow works for this site.

## For editors — the Preview tab

Every page and every car/brand/blog/service has a **Preview** tab next to the
edit form (top of the document). It shows the real page in a panel beside your
edits.

Because the website is built for speed + SEO, it doesn't update *as you type*.
The flow is:

1. Make your edits in the form.
2. Click **Publish**.
3. The site rebuilds automatically (~1–2 minutes).
4. Back on the **Preview** tab, click **↻ Refresh** to see your change.

(The Preview tab always shows the **published** page — so you can also use it
just to look at a page while you edit.)

## One-time setup — "publish → rebuild" webhook

This makes a Publish in the Studio automatically rebuild the site. Do it once.

> **Which environment?** The steps below are for the **Vercel** staging
> deployment. When the site goes live on the Hostinger VPS, the live rebuild
> trigger is different (a GitHub deploy dispatch, not a Vercel hook) — see
> **DEPLOY-HOSTINGER.md → "Content publishing"**. The in-Studio Preview tab
> works the same on both, since it just loads whatever domain the Studio is on.

### 1. Create a Vercel Deploy Hook
Vercel dashboard → the site's project → **Settings → Git → Deploy Hooks**:
- Name: `Sanity publish`
- Branch: `main`
- **Create**, then copy the generated URL
  (`https://api.vercel.com/v1/integrations/deploy/…`).

### 2. Create the Sanity webhook
[sanity.io/manage](https://sanity.io/manage) → this project → **API → Webhooks → Create webhook**:
- **Name:** `Rebuild site on publish`
- **URL:** paste the Vercel Deploy Hook URL from step 1
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:** `!(_id in path("drafts.**"))`
  — so only **Publish** (not every draft keystroke) triggers a rebuild.
- **HTTP method:** `POST`
- **Projection / payload:** leave blank
- **Save**

That's it. Publishing any document now triggers one rebuild, which re-runs the
Sanity → JSON export (`scripts/sanity/export-to-json.ts`) and ships the new
content.

> Tip: rebuilds are quick but not instant. If several people publish at once,
> Vercel coalesces them — the latest content always wins.
