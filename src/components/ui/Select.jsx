import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Select = forwardRef(function Select(
  { className, label, error, children, id, ...props },
  ref
) {
  const sid = id || props.name;
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-zinc-300">
          {label}
        </span>
      )}
      <select
        ref={ref}
        id={sid}
        className={cn(
          'w-full rounded-xl border bg-surface-800 px-4 py-2.5 text-sm text-zinc-100',
          'border-zinc-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40',
          error && 'border-red-500/60',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
});
