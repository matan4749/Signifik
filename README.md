<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Signifik&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Modern%20SaaS%20Platform&descAlignY=58&descSize=20" width="100%"/>
</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-626CD9?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)](https://signifik.vercel.app)

</div>

<br/>

## ✨ What is Signifik?

Signifik is a **production-ready SaaS platform** built with the latest bleeding-edge stack — Next.js 16, React 19, and Tailwind CSS 4. It features full user authentication, Stripe subscription payments, and a polished dashboard experience.

> 🔗 **Live Demo:** [signifik.vercel.app](https://signifik.vercel.app)

<br/>

## 🖼️ Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Landing Page</strong></td>
      <td align="center"><strong>Dashboard</strong></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/480x300/1a1a2e/ffffff?text=Landing+Page" alt="Landing Page" width="480"/></td>
      <td><img src="https://via.placeholder.com/480x300/16213e/ffffff?text=Dashboard" alt="Dashboard" width="480"/></td>
    </tr>
    <tr>
      <td align="center"><strong>Auth Flow</strong></td>
      <td align="center"><strong>Payments</strong></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/480x300/0f3460/ffffff?text=Auth+Flow" alt="Auth" width="480"/></td>
      <td><img src="https://via.placeholder.com/480x300/533483/ffffff?text=Stripe+Checkout" alt="Payments" width="480"/></td>
    </tr>
  </table>
</div>

<br/>

## 🚀 Features

- 🔐 **Authentication** — Sign in / Sign up with Firebase Auth, persistent sessions via secure cookies
- 💳 **Stripe Payments** — Full subscription billing with webhooks
- 📊 **Dashboard** — Protected routes with real-time data from Firestore
- 📧 **Email** — Transactional emails via SendGrid
- 🎨 **Modern UI** — Framer Motion animations, Radix UI components, Tailwind CSS 4
- 📱 **Responsive** — Mobile-first design with smooth transitions
- ☁️ **Cloud Storage** — Firebase Storage for file uploads with signed URLs

<br/>

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Framer Motion |
| Auth & DB | Firebase 12 (Auth + Firestore + Storage) |
| Payments | Stripe |
| Email | SendGrid |
| State | Zustand |
| Components | Radix UI |
| Deployment | Vercel |

<br/>

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/matan4749/Signifik.git
cd Signifik

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in Firebase, Stripe, and SendGrid keys

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br/>

## 📁 Project Structure

```
Signifik/
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── (dashboard)/     # Protected dashboard routes
│   └── api/             # API routes (Stripe, webhooks, storage)
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Firebase, Stripe, utility helpers
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

<br/>

## 🌍 Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# SendGrid
SENDGRID_API_KEY=
```

<br/>

<div align="center">

Made with ❤️ by [Matan Amar](https://matan.life)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=80&section=footer" width="100%"/>
</div>
