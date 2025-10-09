import React from 'react';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import MobileNavSheet from './mobile-navsheet';
import { IGoogleUser } from '../../types/global_types';

type Props = {
  userData: IGoogleUser;
};

export default function MobileNavbar({ userData }: Props) {
  return (
    <div className="fixed z-50 border-b-2 w-full  lg:hidden bg-white dark:bg-zinc-900">
      <div className="max-w-screen px-3 flex my-3 justify-between">
        <div className="flex gap-2">
          <div className="w-[40px] bg-blue-600 rounded-xl">
            <img src="/assets/TRA-logo.png" className="shadow-xs p-[0px]" />
          </div>
          <div className="flex flex-col -space-y-2 my-auto">
            <p className="my-auto text-[8px] mb-[-0px] text-left font-[400] uppercase">The</p>
            <p className="text-[16px] font-[900] uppercase tracking-tight">Roofing</p>
            <p className="text-[8px] text-right pt-[1px] font-[400] uppercase">Application</p>
          </div>
        </div>
        <div className="">
          <MobileNavSheet userData={userData} />
        </div>
      </div>
    </div>
  );
}
