'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PatientAvatarProps {
  id?: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PatientAvatar({
  id = 'P001',
  name,
  gender = 'Male',
  size = 'md',
  className,
}: PatientAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const isFemale = gender === 'Female' || name.includes('Devi') || name.includes('Varma');
  const isDoctor = name.includes('Sharma');
  const avatarTitle = `${name} (${id})`;

  return (
    <div
      title={avatarTitle}
      className={cn(
        'relative shrink-0 rounded-full flex items-center justify-center overflow-hidden border border-slate-200/80 shadow-2xs select-none',
        sizeClasses[size],
        className
      )}
      style={{
        background: isDoctor
          ? 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)'
          : isFemale
          ? 'linear-gradient(135deg, #FDE2E4 0%, #FFCAD4 100%)'
          : 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      }}
    >
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="20" r="10" fill="#E8B490" />
        {isFemale ? (
          <>
            <path
              d="M14 20C14 13 18 9 24 9C30 9 34 13 34 20C34 22 33 25 32 27C31 23 29 20 28 19C25 18 20 18 18 20C17 21 16 23 16 27C15 25 14 22 14 20Z"
              fill="#2D1B14"
            />
            <path d="M13 22C12 25 13 32 16 34C15 31 15 28 15 25Z" fill="#2D1B14" />
            <path d="M35 22C36 25 35 32 32 34C33 31 33 28 33 25Z" fill="#2D1B14" />
          </>
        ) : (
          <path
            d="M14 19C14 13.5 18 9 24 9C30 9 34 13.5 34 19C34 20 33 17 31 16C28 15 20 15 17 16C15 17 14 20 14 19Z"
            fill="#1E293B"
          />
        )}
        <circle cx="20.5" cy="20" r="1.2" fill="#1E293B" />
        <circle cx="27.5" cy="20" r="1.2" fill="#1E293B" />
        <path
          d="M22 24.5C23 25.5 25 25.5 26 24.5"
          stroke="#1E293B"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {isDoctor ? (
          <>
            <path d="M10 46C10 38 16 34 24 34C32 34 38 38 38 46H10Z" fill="#1E3A8A" />
            <path d="M17 36L24 46L31 36H17Z" fill="#FFFFFF" />
            <path d="M22 38L24 44L26 38" stroke="#1E3A8A" strokeWidth="1.5" />
          </>
        ) : (
          <path
            d="M10 46C10 37 16 33 24 33C32 33 38 37 38 46H10Z"
            fill={isFemale ? '#E11D48' : '#2563EB'}
          />
        )}
      </svg>
    </div>
  );
}
