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

Signifik היא **פלטפורמת SaaS מודרנית** לבניית דפי נחיתה עסקיים — ללא קוד, ללא עיצובים, ללא מצעד. Built with the latest bleeding-edge stack — Next.js 16, React 19, and Tailwind CSS 4.

> 🔗 **Live Demo:** [signifik.vercel.app](https://signifik.vercel.app)

<br/>

## 🖼️ Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Landing Page</strong></td>
      <td align="center"><strong>Features Section</strong></td>
    </tr>
    <tr>
      <td><img src="https://raw.githubusercontent.com/matan4749/Signifik/main/docs/screenshot-home.png" width="480"/></td>
      <td><img src="https://raw.githubusercontent.com/matan4749/Signifik/main/docs/screenshot-features.png" width="480"/></td>
    </tr>
  </table>
</div>

<br/>

## 🚀 Features

- 🔐 **Authentication** — Sign in / Sign up with Firebase Auth, persistent sessions via secure cookies
- 💳 **Stripe Payments** — Full subscription billing with webhooks
- 📊 **Dashboard** — Protected routes with real-time Firestore data
- 📧 **Email** — Transactional emails via SendGrid
- 🎨 **Modern UI** — Framer Motion animations, Radix UI components, Tailwind CSS 4
- 📱 **Responsive** — Mobile-first with smooth transitions
- ☁️ **Cloud Storage** — Firebase Storage with signed URLs

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
git clone https://github.com/matan4749/Signifik.git
cd Signifik
npm install
cp .env.example .env.local
# Fill in Firebase, Stripe, and SendGrid keys
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
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SENDGRID_API_KEY=
```

<br/>

<div align="center">

Made with ❤️ by [Matan Amar](https://matan.life)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=80&section=footer" width="100%"/>
</div>
