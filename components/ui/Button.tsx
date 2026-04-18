'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { springSnappy } from '@/lib/utils/motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/25',
  secondary:
    'bg-white/10 text-white border border-white/15 hover:bg-white/15',
  ghost:
    'text-white/70 hover:text-white hover:bg-white/8',
  danger:
    'bg-red-500/90 text-white hover:bg-red-400',
  glass:
    'bg-white/5 border border-white/12 text-white hover:bg-white/10 hover:border-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-7 text-base rounded-2xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        whileTap={isDisabled ? {} : { scale: 0.96, transition: springSnappy }}
        whileHover={isDisabled ? {} : { scale: 1.01, transition: springSnappy }}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
          'disabled:opacity-40 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        style={style}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 14 : 16} />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
