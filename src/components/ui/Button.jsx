import { cn } from '../../lib/utils';

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 shadow-glow border border-brand-500/40',
  secondary:
    'bg-surface-700 text-zinc-100 hover:bg-surface-600 border border-zinc-600/80',
  ghost: 'bg-transparent hover:bg-surface-700 text-zinc-200 border border-transparent',
  danger: 'bg-red-600/90 text-white hover:bg-red-500 border border-red-500/40',
  outline:
    'bg-transparent border border-zinc-600 text-zinc-200 hover:border-brand-500/60 hover:text-brand-300',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant] || variants.primary,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
