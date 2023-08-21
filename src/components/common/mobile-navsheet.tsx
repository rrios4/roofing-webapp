import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { navLinks } from './nav-links';
import NavLinkTooltip from '../navlink-tooltip';
import { Link } from 'react-router-dom';

type Props = {};

export default function MobileNavSheet({}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={'icon'} variant={'outline'}>
          <MenuIcon size={'18px'} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex gap-2 h-[50px]">
              <div className="w-[50px] h-[50px] bg-blue-600 rounded-2xl">
                <img src="/assets/LogoRR.png" className="shadow-xs p-[1px]" />
              </div>
              <div className="flex flex-col -space-y-4 my-auto">
                <p className="text-[8px] text-left font-[400] uppercase">The</p>
                <p className="text-[18px] font-[900] uppercase tracking-tight">Roofing</p>
                <p className="text-[8px] text-right font-[400] uppercase">Application</p>
              </div>
            </div>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="my-4">
          <div className='grid grid-flow-row grid-cols-1 gap-2 pb-6'>
            {navLinks.map((item, index) => (
                <React.Fragment key={index}>
                    {/* <NavLinkTooltip title={item.title} path={item.path} icon={item.icon}/> */}
                    <Link to={item.path}>
                        <div className='flex gap-4 py-4 px-4 hover:bg-secondary rounded-lg'>
                            {item.icon}
                            <p className='font-[500]'>{item.title}</p>
                        </div>
                    </Link>
                </React.Fragment>
            ))}
          </div>
          <div className='px-2'>
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
