import type { SiteConfig } from '@/types/site';
import { STYLE_TOKENS } from '@/lib/utils/constants';

export interface VercelFile {
  file: string;
  data: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getStyleVars(config: SiteConfig): string {
  const token = STYLE_TOKENS[config.design.styleToken] ?? STYLE_TOKENS.minimal;
  return [
    `--primary: ${config.design.primaryColor || token.primaryColor}`,
    `--accent: ${config.design.accentColor || token.accentColor}`,
    `--font: '${config.design.fontFamily}', system-ui, -apple-system, sans-serif`,
  ].join('; ');
}

function isDarkTheme(config: SiteConfig): boolean {
  return ['minimalist-gold', 'cyber-dark', 'bold'].includes(config.design.styleToken);
}

// ── JSON-LD structured data ───────────────────────────────────────────────────

function buildJsonLd(config: SiteConfig, siteUrl: string): string {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.businessName,
    description: config.seo.description,
    url: siteUrl,
  };

  if (config.contact.phone)  ld.telephone = config.contact.phone;
  if (config.contact.email)  ld.email = config.contact.email;
  if (config.contact.wazeAddress) {
    ld.address = { '@type': 'PostalAddress', streetAddress: config.contact.wazeAddress };
  }
  if (config.media.logoUrl) {
    ld.logo = { '@type': 'ImageObject', url: config.media.logoUrl };
    ld.image = config.media.heroImageUrl || config.media.logoUrl;
  }
  if (config.contact.facebookUrl) {
    ld.sameAs = [config.contact.facebookUrl];
    if (config.contact.instagramUrl) (ld.sameAs as string[]).push(config.contact.instagramUrl);
  }

  return JSON.stringify(ld, null, 2);
}

// ── Contact components HTML ───────────────────────────────────────────────────

function renderCTAs(config: SiteConfig): string {
  const btns: string[] = [];

  if (config.components.includes('direct-call') && config.contact.phone) {
    btns.push(`<a href="tel:${escape(config.contact.phone)}" class="cta-btn cta-call" aria-label="Call ${escape(config.businessName)}">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.45a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.29-1.29a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
      <span>Call Now</span>
    </a>`);
  }

  if (config.components.includes('whatsapp') && config.contact.whatsapp) {
    const num = config.contact.whatsapp.replace(/\D/g, '');
    btns.push(`<a href="https://wa.me/${num}" target="_blank" rel="noopener noreferrer" class="cta-btn cta-whatsapp" aria-label="WhatsApp ${escape(config.businessName)}">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413A11.815 11.815 0 0 0 12.05 0zm0 21.785h-.004a9.869 9.869 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>
      <span>WhatsApp</span>
    </a>`);
  }

  if (config.components.includes('email') && config.contact.email) {
    btns.push(`<a href="mailto:${escape(config.contact.email)}" class="cta-btn cta-email" aria-label="Email ${escape(config.businessName)}">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      <span>Email Us</span>
    </a>`);
  }

  if (config.components.includes('waze') && config.contact.wazeAddress) {
    const url = `https://waze.com/ul?q=${encodeURIComponent(config.contact.wazeAddress)}`;
    btns.push(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="cta-btn cta-waze" aria-label="Get directions to ${escape(config.businessName)} on Waze">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>Get Directions</span>
    </a>`);
  }

  const socials: string[] = [];
  if (config.components.includes('facebook') && config.contact.facebookUrl) {
    socials.push(`<a href="${escape(config.contact.facebookUrl)}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${escape(config.businessName)} on Facebook">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>`);
  }
  if (config.components.includes('instagram') && config.contact.instagramUrl) {
    socials.push(`<a href="${escape(config.contact.instagramUrl)}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${escape(config.businessName)} on Instagram">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>`);
  }

  let gallery = '';
  if (config.components.includes('image-gallery') && config.media.galleryUrls?.length) {
    const imgs = config.media.galleryUrls
      .map((u, i) => `<li class="gallery-item"><img src="${escape(u)}" alt="${escape(config.businessName)} gallery image ${i + 1}" loading="lazy" width="400" height="300" /></li>`)
      .join('');
    gallery = `
<section id="gallery" class="gallery-section" aria-label="Photo gallery">
  <h2>Gallery</h2>
  <ul class="gallery-grid" role="list">${imgs}</ul>
</section>`;
  }

  return `
<div class="cta-group" role="group" aria-label="Contact options">
  ${btns.join('\n  ')}
</div>
${socials.length ? `<nav class="social-links" aria-label="Social media links">${socials.join('\n')}</nav>` : ''}
${gallery}`;
}

// ── Analytics snippet ─────────────────────────────────────────────────────────
// Minimal vanilla JS that logs "view" + "click" events to the Signifik analytics
// endpoint on the parent platform (postMessage for cross-origin iframe support).

function analyticsScript(siteId: string): string {
  return `
<script>
(function(){
  var sid = "${siteId}";
  var base = "https://app.signifik.app";

  function send(ev, meta) {
    try {
      fetch(base + "/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: sid, event: ev, meta: meta, ts: Date.now() }),
        keepalive: true
      });
    } catch(e) {}
  }

  // Page view
  send("view", { ref: document.referrer, path: location.pathname });

  // Button clicks
  document.addEventListener("click", function(e) {
    var el = e.target.closest("a[href]");
    if (!el) return;
    var href = el.getAttribute("href") || "";
    var label = el.getAttribute("aria-label") || el.textContent.trim().slice(0,40);
    send("click", { href: href, label: label });
  });
})();
</script>`;
}

// ── CSS ───────────────────────────────────────────────────────────────────────

function buildCss(config: SiteConfig): string {
  const dark = isDarkTheme(config);
  return `
:root { ${getStyleVars(config)} }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  background: ${dark ? '#050505' : '#fafafa'};
  color: ${dark ? '#f5f5f7' : '#1d1d1f'};
  line-height: 1.6;
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

/* ── Glass nav ── */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px;
  background: ${dark ? 'rgba(5,5,5,0.75)' : 'rgba(250,250,250,0.75)'};
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'};
}
.logo { height: 36px; width: auto; border-radius: 8px; }
.brand-name { font-weight: 600; font-size: 17px; letter-spacing: -.01em; }

/* ── Hero ── */
.hero {
  position: relative; min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: brightness(.35) saturate(1.2);
}
.hero-bg-gradient {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%,
      color-mix(in srgb, var(--primary) 28%, transparent), transparent 68%),
    ${dark ? '#050505' : '#fafafa'};
}
.hero-content {
  position: relative; z-index: 1;
  padding: 100px 24px 48px; max-width: 820px;
}
.tagline {
  font-size: 12px; font-weight: 600; letter-spacing: .18em;
  text-transform: uppercase; color: var(--primary); margin-bottom: 18px;
}
h1 {
  font-size: clamp(2.25rem, 5.5vw, 4.25rem);
  font-weight: 700; line-height: 1.06; letter-spacing: -.03em;
  margin-bottom: 20px;
}
.subheadline {
  font-size: clamp(.9rem, 1.8vw, 1.2rem);
  color: ${dark ? 'rgba(245,245,247,.55)' : 'rgba(29,29,31,.55)'};
  max-width: 540px; margin: 0 auto 36px;
}
.hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 15px 32px; background: var(--primary); color: #fff;
  text-decoration: none; border-radius: 100px;
  font-weight: 600; font-size: 16px; letter-spacing: -.01em;
  transition: transform .15s ease, box-shadow .15s ease;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent);
}
.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--primary) 45%, transparent);
}
.hero-cta:active { transform: translateY(0); }

/* ── Contact section ── */
.contact-section {
  padding: 80px 24px;
  max-width: 900px; margin: 0 auto;
}
.cta-group {
  display: flex; flex-wrap: wrap; gap: 14px;
  justify-content: center; margin-bottom: 36px;
}
.cta-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 26px; border-radius: 100px;
  font-weight: 600; font-size: 15px; text-decoration: none;
  border: 1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'};
  transition: transform .15s ease, box-shadow .15s ease;
}
.cta-btn:hover { transform: translateY(-2px); }
.cta-btn span { pointer-events: none; }
.cta-call      { background: #007AFF; color: #fff; }
.cta-whatsapp  { background: #25D366; color: #fff; }
.cta-email     { background: ${dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'}; color: inherit; }
.cta-waze      { background: #33CCFF; color: #000; }

/* ── Social links ── */
.social-links {
  display: flex; gap: 14px; justify-content: center; margin-bottom: 36px;
}
.social-link {
  display: flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 50%;
  background: ${dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'};
  border: 1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'};
  color: inherit; transition: transform .15s ease, background .15s ease; text-decoration: none;
}
.social-link:hover { transform: translateY(-2px); background: var(--primary); color: #fff; }

/* ── Gallery ── */
.gallery-section { padding: 40px 0; }
.gallery-section h2 {
  text-align: center; font-size: 1.875rem; font-weight: 700;
  letter-spacing: -.02em; margin-bottom: 28px;
}
.gallery-grid {
  list-style: none; display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;
}
.gallery-item img {
  width: 100%; height: 220px; object-fit: cover;
  border-radius: 14px; transition: transform .2s ease;
  display: block;
}
.gallery-item img:hover { transform: scale(1.02); }

/* ── Footer ── */
.site-footer {
  padding: 24px; text-align: center; font-size: 13px;
  color: ${dark ? 'rgba(245,245,247,.35)' : 'rgba(29,29,31,.35)'};
  border-top: 1px solid ${dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'};
  background: ${dark ? 'rgba(5,5,5,.6)' : 'rgba(250,250,250,.6)'};
  backdrop-filter: blur(12px);
}
.site-footer a { color: var(--primary); text-decoration: none; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .cta-btn { width: 100%; justify-content: center; }
  h1 { font-size: 2.25rem; }
}

/* ── Skip link (accessibility) ── */
.skip-link {
  position: absolute; top: -40px; left: 0; background: var(--primary); color: #fff;
  padding: 8px 16px; z-index: 200; border-radius: 0 0 8px 0; text-decoration: none;
  transition: top .15s;
}
.skip-link:focus { top: 0; }
`;
}

// ── Main template builder ─────────────────────────────────────────────────────

export function generateSiteFiles(config: SiteConfig, siteId: string): VercelFile[] {
  const dark = isDarkTheme(config);
  const ctasHtml = renderCTAs(config);
  const siteUrl = `https://signifik-${siteId}.vercel.app`;
  const jsonLd = buildJsonLd(config, siteUrl);
  const analytics = analyticsScript(siteId);

  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="${config.design.primaryColor}" />

  <!-- SEO -->
  <title>${escape(config.seo.title)}</title>
  <meta name="description" content="${escape(config.seo.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${siteUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:title" content="${escape(config.seo.title)}" />
  <meta property="og:description" content="${escape(config.seo.description)}" />
  ${config.media.heroImageUrl ? `<meta property="og:image" content="${escape(config.media.heroImageUrl)}" />` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(config.seo.title)}" />
  <meta name="twitter:description" content="${escape(config.seo.description)}" />

  <!-- Favicon -->
  ${config.media.logoUrl ? `<link rel="icon" href="${escape(config.media.logoUrl)}" />` : '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>" />'}

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />

  <!-- Styles -->
  <link rel="stylesheet" href="/style.css" />

  <!-- Structured data (JSON-LD) -->
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body class="${dark ? 'dark' : 'light'}">

  <!-- Accessibility: skip to main content -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Site header -->
  <header class="site-header" role="banner">
    ${config.media.logoUrl
      ? `<img src="${escape(config.media.logoUrl)}" alt="${escape(config.businessName)} logo" class="logo" width="36" height="36" />`
      : ''}
    <span class="brand-name">${escape(config.businessName)}</span>
  </header>

  <!-- Main content -->
  <main id="main-content" role="main">

    <!-- Hero section -->
    <section class="hero" aria-label="Introduction">
      ${config.media.heroImageUrl
        ? `<div class="hero-bg" role="img" aria-label="${escape(config.businessName)} hero image" style="background-image:url('${escape(config.media.heroImageUrl)}')"></div>`
        : '<div class="hero-bg-gradient" aria-hidden="true"></div>'}

      <div class="hero-content">
        <p class="tagline" aria-label="Tagline">${escape(config.tagline)}</p>
        <h1>${escape(config.hero.headline)}</h1>
        <p class="subheadline">${escape(config.hero.subheadline)}</p>
        <a href="${escape(config.hero.ctaHref)}" class="hero-cta" aria-label="${escape(config.hero.ctaText)} — ${escape(config.businessName)}">
          ${escape(config.hero.ctaText)}
        </a>
      </div>
    </section>

    <!-- Contact section -->
    <section id="contact" class="contact-section" aria-label="Contact and social links">
      ${ctasHtml}
    </section>

  </main>

  <!-- Site footer -->
  <footer class="site-footer" role="contentinfo">
    <p>
      &copy; <time datetime="${new Date().getFullYear()}">${new Date().getFullYear()}</time>
      ${escape(config.businessName)}.
      Built with <a href="https://signifik.app" target="_blank" rel="noopener">Signifik</a>.
    </p>
  </footer>

  ${analytics}
</body>
</html>`;

  return [
    { file: 'index.html', data: html },
    { file: 'style.css',  data: buildCss(config) },
  ];
}
