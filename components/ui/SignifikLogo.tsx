import { cn } from '@/lib/utils/cn';

interface SignifikLogoProps {
  /** height in px — width scales proportionally (≈4.4:1 ratio) */
  height?: number;
  className?: string;
}

/**
 * Full wordmark logo — "Signifik" rendered as a bespoke SVG.
 * The "S" and final "k" carry accent highlights; the middle letters
 * use a subtler indigo-to-violet gradient.  A thin underline glow
 * anchors the mark.
 */
export function SignifikLogo({ height = 36, className }: SignifikLogoProps) {
  const w = Math.round(height * 4.4);
  const h = height;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 220 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="Signifik"
    >
      <defs>
        {/* Main wordmark gradient — left indigo → right violet */}
        <linearGradient id="wm-grad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#818cf8" />
          <stop offset="45%"  stopColor="#6366f1" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Accent highlight on S */}
        <linearGradient id="s-accent" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#e0e7ff" />
          <stop offset="60%"  stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Accent highlight on k */}
        <linearGradient id="k-accent" x1="190" y1="0" x2="220" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Glow filter behind entire wordmark */}
        <filter id="wm-glow" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0.6 0 0.8 0 0.2  0 0 0.9 0 0.1  0.8 0 1 0 0.3  0 0 0 0.55 0"
            result="colored" />
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Underline glow */}
        <filter id="line-glow" x="-2%" y="-100%" width="104%" height="400%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Shine mask — top 40% of letters brighter */}
        <linearGradient id="shine" x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="white" stopOpacity="0.12" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle underline glow bar */}
      <rect
        x="2" y="44" width="216" height="1.5"
        rx="1"
        fill="url(#wm-grad)"
        opacity="0.5"
        filter="url(#line-glow)"
      />

      {/* ── Wordmark — all letters as a single text block ── */}
      {/* Shadow/glow layer */}
      <text
        x="110" y="38"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="38"
        letterSpacing="-1.5"
        fill="url(#wm-grad)"
        filter="url(#wm-glow)"
        opacity="0.9"
      >
        Signifik
      </text>

      {/* Main sharp layer */}
      <text
        x="110" y="38"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="38"
        letterSpacing="-1.5"
        fill="url(#wm-grad)"
      >
        Signifik
      </text>

      {/* S accent overlay */}
      <text
        x="110" y="38"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="38"
        letterSpacing="-1.5"
        fill="url(#s-accent)"
      >
        S
        {/* invisible rest — just for clip-path effect, fill rest transparent */}
        <tspan fill="transparent">ignifik</tspan>
      </text>

      {/* Shine overlay */}
      <text
        x="110" y="38"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="38"
        letterSpacing="-1.5"
        fill="url(#shine)"
      >
        Signifik
      </text>
    </svg>
  );
}
