# Signifik — Production Deployment

Zero-to-live in 5 steps.

---

## Required Environment Variables

Copy these into Vercel → Project → Settings → Environment Variables (all environments).

```bash
# ── App ────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://app.signifik.app       # your Vercel deployment URL
ADMIN_EMAIL=you@yourdomain.com                     # admin notification target

# ── Firebase (client) ──────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ── Firebase Admin SDK ─────────────────────────────────────────────
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ── Vercel API (for deploying customer sites) ──────────────────────
VERCEL_TOKEN=                  # vercel.com/account/tokens — full access
VERCEL_TEAM_ID=                # leave blank for personal accounts

# ── Stripe ────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...      # the monthly recurring price ID

# ── SendGrid ──────────────────────────────────────────────────────
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@app.signifik.app
```

---

## Step 1 — Push to GitHub

```bash
cd /path/to/signifik
git add -A
git commit -m "feat: Signifik full-stack SaaS platform"
git remote add origin git@github.com:YOUR_USERNAME/signifik.git
git push -u origin main
```

---

## Step 2 — Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel --prod
```
Follow the prompts. When asked "Set up and deploy?", say **Y**.

### Option B — GitHub Integration
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add all env vars from above
5. Click **Deploy**

---

## Step 3 — Configure Stripe Webhook (Production)

1. Stripe Dashboard → **Webhooks** → **Add endpoint**
2. URL: `https://app.signifik.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_failed`
4. Copy **Signing secret** → paste into `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Step 4 — Firebase Auth Domain

Add your production domain to Firebase's authorized list:
- Firebase Console → Authentication → Settings → **Authorized domains** → Add `app.signifik.app`

---

## Step 5 — Firestore Indexes

The analytics query requires a composite index. Run this in the Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:indexes
```

Or create manually in Firebase Console → Firestore → Indexes:
- Collection: `analytics` (sub-collection)
- Fields: `date ASC`

---

## Post-Deploy Smoke Test

| Action | Expected result |
|--------|----------------|
| Visit `https://app.signifik.app` | Marketing homepage loads |
| Sign up → dashboard | Empty site list with "Create" CTA |
| Create a site through wizard | Deploy progress screen → site goes live |
| Open live site | HTML page with business info + contact buttons |
| Click a contact button | Event logged in Firestore `analytics` sub-collection |
| Go back to dashboard → edit page | Signifik Insight widget shows 1 view |
| Billing → Start Trial | Stripe Checkout opens with 30-day trial |
| Use Stripe test card `4242 4242 4242 4242` | Subscription created, status = trialing |

---

## Architecture Summary

```
User → signifik.app (Next.js on Vercel)
  │
  ├─ Auth:       Firebase Auth + session cookies
  ├─ Data:       Firestore (users, sites, analytics)
  ├─ Storage:    Firebase Storage (logos, images)
  ├─ Deploy:     Vercel API (each site = its own Vercel project)
  ├─ Payments:   Stripe (subscription + 30-day trial)
  ├─ Email:      SendGrid (welcome, trial warning, payment failed, admin alert)
  └─ Analytics:  Vanilla JS snippet → /api/analytics → Firestore
```

### Kill Switch Flow
```
Stripe: payment_failed (×4) or subscription.deleted
  → stripe/webhooks.ts: killUserSites(uid)
    → Vercel API: disableSite() — deploys offline page
    → Firestore: status = "disabled"
    → SendGrid: sendSiteDisabledEmail()
```
