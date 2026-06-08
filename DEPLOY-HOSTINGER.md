# Handoff: Deploying the new Luxury Supercars Dubai site to the Hostinger VPS

## Plain-English summary (for Nathan)

The new website is a **Next.js app** (today it auto-deploys to a Vercel staging URL). The **live `luxurysupercarsdubai.com` is still the old WordPress site**, which runs on this same Hostinger VPS under CloudPanel.

The plan is a **safe, staged switch**:

1. Stand the new site up on a **temporary staging address** (`staging.luxurysupercarsdubai.com`) and fully test it. **WordPress is untouched and stays live the whole time.**
2. When it's approved, **flip the live domain** over to the new site.
3. Keep WordPress in place as an **instant rollback** for a couple of weeks.

Because both sites are on the **same server**, the flip is a server-side change — effectively instant, with **no DNS waiting** and **easy to undo**. Nothing breaks during setup.

Hand the section below to a developer.

---

## Developer handoff

### Server (confirmed from CloudPanel)
- **Hostinger KVM 8** — 8 vCPU / 32 GB RAM / 400 GB disk, **Ubuntu 24.04**, **CloudPanel**. Plenty of headroom to build *and* run on the box.
- Root: `ssh root@72.60.206.251`.
- **Existing site — DO NOT MODIFY/DELETE:** WordPress (PHP). CloudPanel site `luxurysupercarsdubai.com`, site user `luxurysupercarsdubai`, root `/home/luxurysupercarsdubai/htdocs/luxurysupercarsdubai.com`.

### The app
- **Next.js 16**, App Router. **Must run as a Node process** (`next build` + `next start`) — not a static export. It uses **Server Actions** (contact form + promo-popup signup), **SSR/SSG**, **`next/image`**, and an **embedded Sanity Studio at `/studio`**.
- **No middleware, no edge runtime** → plain Node, runs anywhere with Node 20+.
- Repo: `https://github.com/orchestra-ventures/Luxury-Supercar-Rental` (branch `main`).
- Optional but recommended before deploy (ask the maintainer): add `output: "standalone"` to `next.config.ts` for a leaner runtime, and confirm `lib/site.ts` env detection uses `NEXT_PUBLIC_SITE_URL` (it currently also checks Vercel-only `VERCEL_ENV`/`VERCEL_URL`, which won't exist here).

---

### Phase 1 — Stage the new site (zero impact on WordPress)

1. **DNS:** add an A record `staging.luxurysupercarsdubai.com → 72.60.206.251`.

2. **CloudPanel → Add Site → "Create a Node.js Site":**
   - Domain: `staging.luxurysupercarsdubai.com`
   - Node.js version: **20 (LTS)**
   - App port: **3000**
   - Site user: e.g. `lsrnext`
   This creates an isolated site (own Linux user + home), an Nginx **reverse proxy → port 3000**, and lets you issue SSL. It does **not** touch the WordPress site.

3. **SSL:** on the new site → **SSL/TLS** tab → issue a Let's Encrypt certificate for the staging subdomain.

4. **Install Node + PM2** (if the box doesn't have them yet), as root:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

5. **Deploy the code** (as the new site user, inside its home dir):
   ```bash
   git clone https://github.com/orchestra-ventures/Luxury-Supercar-Rental.git app
   cd app
   # create the .env file (see "Environment variables" below)
   npm ci
   npm run build            # runs the Sanity content export — needs SANITY_API_TOKEN
   pm2 start npm --name lsr -- start
   pm2 save
   pm2 startup              # then run the command it prints (so it survives reboots)
   curl -I http://127.0.0.1:3000   # should return HTTP 200
   ```

6. **Test `https://staging.luxurysupercarsdubai.com` thoroughly:** all pages, currency switcher, **contact form** (submit a test enquiry), **promo popup** (clear `localStorage` to retrigger), `/studio` (Sanity), image loading, mobile.

### Environment variables (`.env` in the app directory)
Copy the values from the **Vercel project → Settings → Environment Variables**.
```
NEXT_PUBLIC_SITE_URL=https://luxurysupercarsdubai.com
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=...
SANITY_API_TOKEN=...            # required at build (content export)
RESEND_API_KEY=re_...           # contact form + promo emails (falls back to logging if absent)
ENQUIRY_TO=info@luxurysupercarsdubai.com
ENQUIRY_FROM="LSR Enquiries <enquiries@notifications.luxurysupercarsdubai.com>"
RESEND_AUDIENCE_ID=...          # promo-popup marketing list (optional)
```

---

### Phase 2 — Go live (the switch)

**Pre-flight:** take a **Hostinger VPS snapshot** (rollback safety). Confirm where `luxurysupercarsdubai.com`'s DNS A record currently points — it's most likely already `72.60.206.251`. If it points somewhere else, the cutover is a DNS change instead; if it already points here, it's a same-box server-side change (instant).

**Recommended cutover (clean + reversible) in CloudPanel:**
1. On the **WordPress** site → **Settings**, change its domain from `luxurysupercarsdubai.com` to a holding name like `wp-old.luxurysupercarsdubai.com` (add a matching DNS A record → `72.60.206.251`). WordPress stays fully alive there for rollback/reference.
2. On the **Node.js** site → set its domain to `luxurysupercarsdubai.com` **and** `www.luxurysupercarsdubai.com`, then **SSL/TLS** → issue Let's Encrypt for both.
3. Verify `https://luxurysupercarsdubai.com` now serves the new site over HTTPS; submit one more test enquiry.

This is a server-side reverse-proxy/vhost change on the same box — effectively instant, no DNS propagation wait.

### Rollback (if anything's wrong)
- Reverse step 1–2 above: give the apex domain back to the WordPress site in CloudPanel. Instant.
- Or restore the pre-cutover VPS snapshot.
- **Keep WordPress in place for ~2 weeks** before considering removing it.

---

### Ongoing updates after launch

**Manual (simple):**
```bash
cd ~/app && git pull origin main && npm ci && npm run build && pm2 reload lsr
```

**Automated push-to-deploy (recommended)** — a GitHub Action that deploys on every push to `main`. Add this as `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: 72.60.206.251
          username: lsrnext            # the Node site's user
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/app
            git pull origin main
            npm ci
            npm run build
            pm2 reload lsr
```
Setup: generate an SSH keypair; paste the **public** key into the new site's **SSH Keys** field in CloudPanel (Settings tab); add the **private** key as the GitHub repo secret `VPS_SSH_KEY`. After that, day-to-day updates are just `git push` — same as Vercel today.

### Housekeeping
- **Firewall:** currently 0 rules — restrict inbound to **22, 80, 443**.
- Keep **VPS snapshots** running (nightly).
- The **Vercel** deployment can stay on as a preview/staging environment, or be retired after launch (the GitHub repo stays the single source of truth either way).
- The site sets cookies via GTM / Google Ads / Meta Pixel; a cookie-consent banner exists in the code but is currently disabled (`<CookieConsent/>` in `components/SiteChrome.tsx`) — re-enable if required for compliance.

---

*Trade-off vs Vercel, for awareness:* this self-hosted setup gives full control and keeps everything on the client's VPS, but you take on server maintenance (OS/Node updates, monitoring) and lose Vercel's per-branch preview URLs and one-click rollbacks. With this hardware and CloudPanel, the ongoing load is light.
