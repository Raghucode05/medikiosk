'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none';

    const variants = {
      default:
        'bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-xs hover:shadow-md hover:shadow-blue-900/20',
      outline:
        'border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] hover:border-[#1E3A8A]',
      ghost:
        'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800',
      secondary:
        'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 hover:bg-blue-100/80 dark:hover:bg-blue-950/60',
      link:
        'text-[#1E3A8A] underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 rounded-xl text-xs sm:text-sm',
      sm: 'h-7 px-3 rounded-lg text-xs',
      lg: 'h-11 px-6 rounded-xl text-sm sm:text-base',
      icon: 'h-8 w-8 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
