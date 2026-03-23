import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'rounded-2xl border border-zinc-800/80 bg-surface-800/80 p-5 shadow-card backdrop-blur-sm',
        hover && 'transition-transform hover:-translate-y-0.5 hover:border-brand-600/30',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
