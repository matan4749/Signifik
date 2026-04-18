/**
 * Signifik Motion System — Apple Liquid Glass 2026
 *
 * All transitions use spring physics instead of cubic-bezier curves
 * for the "premium physical feel" characteristic of iOS 26 / visionOS.
 */

// ── Spring presets ────────────────────────────────────────────────────────────

/** Standard interactive spring — used for buttons, toggles, cards */
export const spring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/** Gentle spring — used for large panel slides */
export const springGentle = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 28,
  mass: 1,
};

/** Snappy spring — used for badge pops, status indicators */
export const springSnappy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

// ── Directional slide variants ────────────────────────────────────────────────

/** Step wizard: slide from right (forward) */
export const slideFromRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: springGentle },
  exit:    { opacity: 0, x: -40, transition: { ...springGentle, stiffness: 280 } },
};

/** Step wizard: slide from left (back) */
export const slideFromLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: springGentle },
  exit:    { opacity: 0, x: 40, transition: { ...springGentle, stiffness: 280 } },
};

/** Panel appears from below (bottom sheet, modal) */
export const riseUp = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: springGentle },
  exit:    { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.15, ease: 'easeIn' as const } },
};

/** Fade scale — used for overlays */
export const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: spring },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.12 } },
};

/** Stagger container for lists */
export const staggerContainer = (delayMs = 60) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delayMs / 1000 },
  },
});

/** Stagger child item */
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: springGentle },
};

// ── Micro-interactions ───────────────────────────────────────────────────────

/** Hover lift — glass cards */
export const cardHover = {
  whileHover:  { y: -3, scale: 1.01, transition: spring },
  whileTap:    { y: 0,  scale: 0.99, transition: springSnappy },
};

/** Button press */
export const buttonPress = {
  whileTap: { scale: 0.97, transition: springSnappy },
};

/** Glow pulse for deploy/live indicators */
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(99,102,241,0)',
      '0 0 0 8px rgba(99,102,241,0.25)',
      '0 0 0 0 rgba(99,102,241,0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeOut' as const },
  },
};
