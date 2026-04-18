export type Niche =
  | 'law'
  | 'real-estate'
  | 'beauty'
  | 'health'
  | 'restaurant'
  | 'fitness'
  | 'consulting'
  | 'tech'
  | 'other';

export type StyleToken = 'minimalist-gold' | 'cyber-dark' | 'organic-soft' | 'minimal' | 'bold';

export type FontFamily = 'inter' | 'playfair' | 'geist' | 'satoshi';

export type SiteComponent =
  | 'direct-call'
  | 'whatsapp'
  | 'email'
  | 'waze'
  | 'facebook'
  | 'instagram'
  | 'image-gallery';

export interface SiteDesign {
  primaryColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  styleToken: StyleToken;
}

export interface SiteMedia {
  logoUrl?: string;
  heroImageUrl?: string;
  galleryUrls?: string[];
}

export interface SiteHero {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
}

export interface SiteContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  wazeAddress?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface SiteSEO {
  title: string;
  description: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  niche: Niche;
  hero: SiteHero;
  components: SiteComponent[];
  design: SiteDesign;
  media: SiteMedia;
  contact: SiteContact;
  seo: SiteSEO;
}

export type DeploymentStatus = 'idle' | 'pending' | 'building' | 'ready' | 'error' | 'disabled';

export interface SiteDeployment {
  status: DeploymentStatus;
  vercelProjectId?: string;
  vercelDeploymentId?: string;
  url?: string;
  deployedAt?: string;
  error?: string;
}

export interface Site {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  customDomain?: string;
  config: SiteConfig;
  deployment: SiteDeployment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSitePayload {
  config: SiteConfig;
  slug: string;
  customDomain?: string;
}

export interface UpdateSitePayload {
  config?: Partial<SiteConfig>;
  customDomain?: string;
}
