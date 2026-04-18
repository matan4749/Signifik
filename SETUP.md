# Signifik — Setup Guide

Complete step-by-step instructions to go from zero to a running production deployment.

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd signifik
npm install
cp .env.local.example .env.local
```

---

## 2. Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Create Project**
2. Enable **Authentication** → Sign-in Methods → **Email/Password**
3. Enable **Firestore** → Create database → **Production mode**
4. Enable **Storage** → Default bucket

### Client SDK credentials
- Project Settings → **General** → scroll down to "Your apps" → **Add app** → Web
- Copy the `firebaseConfig` values into `.env.local`:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  ```

### Admin SDK credentials
- Project Settings → **Service Accounts** → **Generate New Private Key** → download JSON
- From the JSON, fill in:
  ```
  FIREBASE_ADMIN_PROJECT_ID=        # "project_id"
  FIREBASE_ADMIN_CLIENT_EMAIL=      # "client_email"
  FIREBASE_ADMIN_PRIVATE_KEY=       # "private_key" (keep quotes, keep \n)
  ```

### Firestore Security Rules
In Firebase Console → Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /sites/{siteId} {
      allow read, write: if request.auth != null &&
        resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /sites/{uid}/{siteId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid
        && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 3. Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → **API keys**
2. Copy **Secret key** and **Publishable key** into `.env.local`

### Create a Price
- Stripe Dashboard → **Products** → **Add product**
  - Name: `Signifik Pro`
  - Price: `$29.00` / month (recurring)
  - Copy the **Price ID** (`price_...`) → `STRIPE_PRICE_ID`

### Webhook (local development)
```bash
npm install -g stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Webhook (production)
- Stripe Dashboard → **Webhooks** → **Add endpoint**
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `customer.subscription.trial_will_end`
  - `invoice.payment_failed`

### Customer Portal
- Stripe Dashboard → **Billing** → **Customer portal** → **Activate**

---

## 4. Vercel API Setup

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a token with full scope → copy to `VERCEL_TOKEN`
3. If using a team: Settings → Team → copy Team ID → `VERCEL_TEAM_ID`
4. Leave `VERCEL_TEAM_ID` blank for personal accounts

---

## 5. SendGrid Setup

1. Go to [app.sendgrid.com](https://app.sendgrid.com) → Settings → **API Keys** → Create
2. Copy to `SENDGRID_API_KEY`
3. Set `SENDGRID_FROM_EMAIL` to a verified sender (Settings → Sender Authentication)
4. Set `ADMIN_EMAIL` to your email address for site-launch notifications

---

## 6. App URL

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

For local dev: `http://localhost:3000`

---

## 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 8. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and add all environment variables in the project settings.

**Important:** Set all `.env.local` variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## 9. Post-Deploy Checklist

- [ ] Firebase Auth domain added: `yourdomain.com` (Firebase → Auth → Settings → Authorized domains)
- [ ] Stripe webhook URL updated to production URL
- [ ] `NEXT_PUBLIC_APP_URL` updated to production URL in Vercel env vars
- [ ] SendGrid sender domain verified
- [ ] Test full flow: signup → builder → deploy → billing
