import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'silver' | 'emerald' | 'zinc';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className = '' }) => {
  const variantStyles = {
    gold: 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border-amber-500/40 text-amber-300',
    silver: 'bg-zinc-800 border-zinc-600 text-zinc-300',
    emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    zinc: 'bg-zinc-900 border-zinc-700 text-zinc-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
