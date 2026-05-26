import React from 'react';
import { cn } from '../../lib/utils';

export function SectionCard({
  iconBg,
  iconText,
  icon,
  label,
  headerRight,
  headerClassName,
  children,
}: {
  iconBg: string;
  iconText: string;
  icon: React.ReactNode;
  label: string;
  headerRight?: React.ReactNode;
  headerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div
        className={cn(
          'px-4 py-3 border-b border-border flex items-center gap-2.5 transition-colors',
          headerClassName ?? 'bg-muted/40'
        )}
      >
        <div
          className={cn(
            'h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0',
            iconBg,
            iconText
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold flex-1">{label}</span>
        {headerRight}
      </div>
      <div className="p-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}
