import React from 'react';
import { LayoutDashboardIcon, HomeIcon, HammerIcon, InboxIcon, SendIcon, ClipboardSignatureIcon, UsersIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavLinkTooltip from '../navlink-tooltip';
import { Separator } from '../ui/separator';
import { ModeToggle } from './mode-toggle';
import { Button } from '../ui/button';
import MobileNavbar from './mobile-navbar';
import { navLinks } from './nav-links';
import { IGoogleUser } from '../../types/global_types';

type Props = {
  userData: IGoogleUser;
};

export default function SideNavbar({userData}: Props) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden z-40 fixed px-2 border-r-1 lg:w-[80px] lg:h-screen lg:flex lg:flex-col bg-white border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col mx-auto w-full my-4 h-full gap-10">
          <div className="mx-auto">
            <div className="w-[50px] bg-blue-600 rounded-2xl">
              <img src="/assets/LogoRR.png" className="shadow-xs p-[2px]" />
            </div>
          </div>
          <div className="flex flex-col mx-auto gap-2">
            {navLinks.map((item, index) => (
              <React.Fragment key={index}>
                <NavLinkTooltip title={item.title} icon={item.icon} path={item.path} />
                {item.lastOfGroup === true && <Separator className='mb-2' />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-col mt-auto gap-2 mx-auto">
            <div><Button variant={'primary'} className='rounded-full' size={'icon'}><PlusIcon size={'18px'}/></Button></div>
            <div className='flex justify-center w-full'><ModeToggle/></div>
          </div>
        </div>
      </div>
      <MobileNavbar userData={userData}/>
    </>
  );
}
