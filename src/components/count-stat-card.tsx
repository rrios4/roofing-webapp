import { ChevronUpIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import { Skeleton } from './ui/skeleton';

type Props = {
  title: string;
  totalCount: number;
  icon: React.ReactNode;
  isLoading: boolean;
};

export default function CountStatCard({ title, totalCount, icon, isLoading }: Props) {
  if (isLoading) {
    return (
      <Skeleton className="flex flex-col p-3 sm:p-6 rounded-lg shadow-xs w-full h-[100px] sm:h-[131px] md:h-[140px]" />
    );
  }

  return (
    <div className="flex flex-col border p-3 sm:p-6 rounded-lg shadow-xs w-full justify-center bg-slate-100 dark:bg-zinc-800 min-h-[100px] sm:min-h-[140px]">
      <div className="flex w-full justify-between items-start">
        <p className="font-medium text-xs sm:text-sm md:text-base truncate pr-2">{title}</p>
        <div className="flex-shrink-0">
          {React.cloneElement(icon as React.ReactElement, {
            size: '18px',
            className: 'sm:w-6 sm:h-6 w-4 h-4'
          })}
        </div>
      </div>
      <div className="flex mt-2 font-semibold items-end justify-between">
        <p className="text-lg sm:text-2xl md:text-3xl flex-1 truncate">{totalCount}</p>
        <div className="hidden sm:flex justify-end flex-shrink-0">
          <div className="mb-1 w-[60px] sm:w-[80px] h-[28px] sm:h-[34px] border-2 border-green-500 rounded-2xl">
            <div className="flex w-full h-full justify-center items-center gap-1">
              <ChevronUpIcon size={'16px'} className="text-green-700 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-sm font-medium text-green-500">0%</p>
            </div>
          </div>
        </div>
        {/* Mobile percentage indicator */}
        <div className="flex sm:hidden items-center">
          <span className="text-xs text-green-600 font-medium">+0%</span>
        </div>
      </div>
    </div>
  );
}
