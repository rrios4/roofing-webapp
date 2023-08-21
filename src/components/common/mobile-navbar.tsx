import React from 'react';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import MobileNavSheet from './mobile-navsheet';

type Props = {};

export default function MobileNavbar({}: Props) {
  return (
    <div className="w-full border border-b lg:hidden">
      <div className="container flex my-2 justify-between">
        <div className="flex gap-2">
          <div className="w-[40px] bg-blue-600 rounded-xl">
            <img src="/assets/LogoRR.png" className="shadow-xs p-[1px]" />
          </div>
          <div className='flex flex-col -space-y-2 my-auto'>
            <p className='my-auto text-[8px] mb-[-0px] text-left font-[400] uppercase'>The</p>
            <p className='text-[16px] font-[900] uppercase tracking-tight'>Roofing</p>
            <p className='text-[8px] text-right pt-[1px] font-[400] uppercase'>Application</p>
          </div>
        </div>
        <div className="">
          <MobileNavSheet/>
        </div>
      </div>
    </div>
  );
}
