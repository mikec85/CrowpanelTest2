import React from 'react';
import { cn } from '../lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-12 grid-rows-6 gap-3 h-full", className)}>
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  title?: string;
  noBorder?: boolean;
}

export function BentoItem({ children, className, colSpan = 3, rowSpan = 2, title, noBorder }: BentoItemProps) {
  const colClasses = {
    1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
    5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
    9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12'
  };
  
  const rowClasses = {
    1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3', 4: 'row-span-4',
    5: 'row-span-5', 6: 'row-span-6'
  };

  return (
    <div className={cn(
      "bg-slate-900/50 border rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm",
      noBorder ? "border-transparent" : "border-slate-800",
      colClasses[colSpan],
      rowClasses[rowSpan],
      className
    )}>
      {title && (
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </h3>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
