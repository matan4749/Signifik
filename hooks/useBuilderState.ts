'use client';

import { useReducer, useCallback } from 'react';
import type { SiteConfig, SiteComponent, Niche, StyleToken, FontFamily } from '@/types/site';

export const TOTAL_STEPS = 6;

export interface BuilderState {
  step: number;
  config: SiteConfig;
  slug: string;
  customDomain?: string;
  errors: Partial<Record<string, string>>;
  isSubmitting: boolean;
  deployedSiteId: string | null;
}

const defaultConfig: SiteConfig = {
  businessName: '',
  tagline: '',
  niche: 'other',
  hero: {
    headline: '',
    subheadline: '',
    ctaText: 'Contact Us',
    ctaHref: '#contact',
  },
  components: [],
  design: {
    primaryColor: '#6366f1',
    accentColor: '#a78bfa',
    fontFamily: 'inter',
    styleToken: 'minimal',
  },
  media: {},
  contact: {},
  seo: {
    title: '',
    description: '',
  },
};

const initialState: BuilderState = {
  step: 1,
  config: defaultConfig,
  slug: '',
  errors: {},
  isSubmitting: false,
  deployedSiteId: null,
};

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SET_BUSINESS_INFO'; businessName: string; tagline: string; niche: Niche }
  | { type: 'SET_DESIGN'; design: Partial<SiteConfig['design']> }
  | { type: 'TOGGLE_COMPONENT'; component: SiteComponent }
  | { type: 'SET_CONTACT'; contact: Partial<SiteConfig['contact']> }
  | { type: 'SET_HERO'; hero: Partial<SiteConfig['hero']> }
  | { type: 'SET_MEDIA'; media: Partial<SiteConfig['media']> }
  | { type: 'SET_SEO'; seo: Partial<SiteConfig['seo']> }
  | { type: 'SET_SLUG'; slug: string }
  | { type: 'SET_CUSTOM_DOMAIN'; customDomain?: string }
  | { type: 'SET_ERRORS'; errors: Partial<Record<string, string>> }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_DEPLOYED'; siteId: string }
  | { type: 'RESET' };

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'SET_BUSINESS_INFO':
      return {
        ...state,
        config: {
          ...state.config,
          businessName: action.businessName,
          tagline: action.tagline,
          niche: action.niche,
          seo: {
            title: `${action.businessName} — ${action.tagline}`,
            description: `Welcome to ${action.businessName}. ${action.tagline}`,
          },
        },
      };
    case 'SET_DESIGN':
      return {
        ...state,
        config: { ...state.config, design: { ...state.config.design, ...action.design } },
      };
    case 'TOGGLE_COMPONENT': {
      const has = state.config.components.includes(action.component);
      const components = has
        ? state.config.components.filter((c) => c !== action.component)
        : [...state.config.components, action.component];
      return { ...state, config: { ...state.config, components } };
    }
    case 'SET_CONTACT':
      return {
        ...state,
        config: { ...state.config, contact: { ...state.config.contact, ...action.contact } },
      };
    case 'SET_HERO':
      return {
        ...state,
        config: { ...state.config, hero: { ...state.config.hero, ...action.hero } },
      };
    case 'SET_MEDIA':
      return {
        ...state,
        config: { ...state.config, media: { ...state.config.media, ...action.media } },
      };
    case 'SET_SEO':
      return {
        ...state,
        config: { ...state.config, seo: { ...state.config.seo, ...action.seo } },
      };
    case 'SET_SLUG':
      return { ...state, slug: action.slug };
    case 'SET_CUSTOM_DOMAIN':
      return { ...state, customDomain: action.customDomain };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_DEPLOYED':
      return { ...state, deployedSiteId: action.siteId };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useBuilderState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const goToStep = useCallback((step: number) => dispatch({ type: 'GO_TO_STEP', step }), []);

  const setBusinessInfo = useCallback(
    (businessName: string, tagline: string, niche: Niche) =>
      dispatch({ type: 'SET_BUSINESS_INFO', businessName, tagline, niche }),
    []
  );

  const setDesign = useCallback(
    (design: Partial<SiteConfig['design']>) => dispatch({ type: 'SET_DESIGN', design }),
    []
  );

  const toggleComponent = useCallback(
    (component: SiteComponent) => dispatch({ type: 'TOGGLE_COMPONENT', component }),
    []
  );

  const setContact = useCallback(
    (contact: Partial<SiteConfig['contact']>) => dispatch({ type: 'SET_CONTACT', contact }),
    []
  );

  const setHero = useCallback(
    (hero: Partial<SiteConfig['hero']>) => dispatch({ type: 'SET_HERO', hero }),
    []
  );

  const setMedia = useCallback(
    (media: Partial<SiteConfig['media']>) => dispatch({ type: 'SET_MEDIA', media }),
    []
  );

  const setSEO = useCallback(
    (seo: Partial<SiteConfig['seo']>) => dispatch({ type: 'SET_SEO', seo }),
    []
  );

  const setSlug = useCallback((slug: string) => dispatch({ type: 'SET_SLUG', slug }), []);

  const setCustomDomain = useCallback(
    (customDomain?: string) => dispatch({ type: 'SET_CUSTOM_DOMAIN', customDomain }),
    []
  );

  const setErrors = useCallback(
    (errors: Partial<Record<string, string>>) => dispatch({ type: 'SET_ERRORS', errors }),
    []
  );

  const setSubmitting = useCallback(
    (value: boolean) => dispatch({ type: 'SET_SUBMITTING', value }),
    []
  );

  const setDeployed = useCallback(
    (siteId: string) => dispatch({ type: 'SET_DEPLOYED', siteId }),
    []
  );

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    nextStep,
    prevStep,
    goToStep,
    setBusinessInfo,
    setDesign,
    toggleComponent,
    setContact,
    setHero,
    setMedia,
    setSEO,
    setSlug,
    setCustomDomain,
    setErrors,
    setSubmitting,
    setDeployed,
    reset,
  };
}
