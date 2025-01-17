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
      <Skeleton className="flex flex-col p-6 rounded-lg shadow-xs w-full md:w-[35%] h-[131px] md:h-[140px]" />
    );
  }

  return (
    <div className="flex flex-col border p-6 rounded-lg shadow-xs w-full md:w-[35%] md:h-[140px] justify-center bg-slate-100 dark:bg-zinc-800">
      <div className="flex w-full justify-between">
        <p className="font-[500]">{title}</p>
        {/* <UsersIcon size={'20px'} /> */}
        {icon}
      </div>
      <div className="flex mt-2 font-[600]">
        <p className="text-[32px] w-[60%] ">{totalCount}</p>
        <div className="flex w-[40%] justify-end">
          <div className="mb-1 w-[80px] h-[34px] border-2 border-green-500 mt-auto rounded-2xl">
            <div className="flex w-full h-full justify-center gap-1">
              <div className="flex flex-col justify-center">
                <ChevronUpIcon size={'20px'} className="text-green-700" />
              </div>
              <p className="text-[14px] font-[500] my-auto text-green-500">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
