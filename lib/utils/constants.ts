export const APP_NAME = 'Signifik';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@signifik.app';

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
export const TRIAL_DAYS = 30;

export const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';
export const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
export const SITE_BASE_DOMAIN = 'signifik-sites.vercel.app';

export const MAX_SITES_PER_USER = 3;
export const MAX_GALLERY_IMAGES = 12;
export const MAX_FILE_SIZE_MB = 5;

export const STYLE_TOKENS = {
  'minimalist-gold': {
    label: 'Minimalist Gold',
    primaryColor: '#B8960C',
    accentColor: '#F5E642',
    bg: 'bg-neutral-950',
    text: 'text-amber-400',
  },
  'cyber-dark': {
    label: 'Cyber Dark',
    primaryColor: '#00F5FF',
    accentColor: '#7B2FBE',
    bg: 'bg-gray-950',
    text: 'text-cyan-400',
  },
  'organic-soft': {
    label: 'Organic Soft',
    primaryColor: '#4A7C59',
    accentColor: '#C8E6C9',
    bg: 'bg-stone-50',
    text: 'text-emerald-800',
  },
  minimal: {
    label: 'Minimal',
    primaryColor: '#000000',
    accentColor: '#FFFFFF',
    bg: 'bg-white',
    text: 'text-gray-900',
  },
  bold: {
    label: 'Bold',
    primaryColor: '#FF3B30',
    accentColor: '#FF9500',
    bg: 'bg-gray-950',
    text: 'text-red-400',
  },
} as const;

export const NICHES = [
  { value: 'law', label: 'Law & Legal' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'beauty', label: 'Beauty & Wellness' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'fitness', label: 'Fitness & Sports' },
  { value: 'consulting', label: 'Consulting & Business' },
  { value: 'tech', label: 'Technology' },
  { value: 'other', label: 'Other' },
] as const;

export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter (Modern)' },
  { value: 'playfair', label: 'Playfair (Elegant)' },
  { value: 'geist', label: 'Geist (Technical)' },
  { value: 'satoshi', label: 'Satoshi (Friendly)' },
] as const;

export const SITE_COMPONENTS = [
  { value: 'direct-call', label: 'Direct Call Button', icon: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp Chat', icon: 'MessageCircle' },
  { value: 'email', label: 'Email Contact', icon: 'Mail' },
  { value: 'waze', label: 'Waze Navigation', icon: 'MapPin' },
  { value: 'facebook', label: 'Facebook Page', icon: 'Facebook' },
  { value: 'instagram', label: 'Instagram Profile', icon: 'Instagram' },
  { value: 'image-gallery', label: 'Image Gallery', icon: 'Image' },
] as const;
