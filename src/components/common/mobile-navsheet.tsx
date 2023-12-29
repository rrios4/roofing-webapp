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
import { LogInIcon, LogOutIcon, MenuIcon } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { navLinks } from './nav-links';
import NavLinkTooltip from '../navlink-tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { IGoogleUser } from '../../types/global_types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { abbreviateName } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  userData: IGoogleUser;
};

export default function MobileNavSheet({ userData }: Props) {
  const navigate = useNavigate();
  const auth = useAuth();
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
                <img src="/assets/TRA-logo.png" className="shadow-xs p-[0px]" />
              </div>
              <div className="flex flex-col -space-y-4 my-auto">
                <p className="text-[8px] text-left font-[400] uppercase">The</p>
                <p className="text-[18px] font-[900] uppercase tracking-tight">Roofing</p>
                <p className="text-[8px] text-right font-[400] uppercase">Application</p>
              </div>
            </div>
          </SheetTitle>
          {/* <SheetDescription></SheetDescription> */}
        </SheetHeader>
        <ScrollArea className="w-full h-full py-6">
          <div className="my-4">
            <div className="grid grid-flow-row grid-cols-1 gap-2 pb-6">
              {navLinks.map((item, index) => (
                <React.Fragment key={index}>
                  {/* <NavLinkTooltip title={item.title} path={item.path} icon={item.icon}/> */}
                  <SheetClose asChild>
                    <Link to={item.path}>
                      <div className="flex gap-4 py-4 px-4 hover:bg-secondary rounded-lg">
                        {item.icon}
                        <p className="font-[500]">{item.title}</p>
                      </div>
                    </Link>
                  </SheetClose>
                </React.Fragment>
              ))}
            </div>
            {auth?.user && (
              <div>
                <div className="grid grid-flow-row grid-cols-1 w-full">
                  <div className="flex px-2 gap-4 pb-6 w-full">
                    <Avatar>
                      <AvatarImage src={userData.avatar_url} alt={userData.full_name} />
                      <AvatarFallback>{abbreviateName(userData.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-[700] text-[14px]">{userData.full_name}</p>
                      <p className="font-[400] text-[14px]">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full">
                    <SheetClose asChild>
                      <Button
                        className="mr-auto"
                        variant={'primary'}
                        onClick={() => auth.signOut()}>
                        <LogOutIcon className="mr-2 h-4 w-4" /> SignOut
                      </Button>
                    </SheetClose>
                  </div>
                </div>
                <div className="px-2 mt-4">
                  <ModeToggle />
                </div>
              </div>
            )}

            {!auth.user && (
              <div className="flex px-2 gap-4 pb-6">
                <SheetClose asChild>
                  <Button variant={'primary'} onClick={() => navigate('/login')}>
                    <LogInIcon className="mr-2 h-4 w-4" /> Login
                  </Button>
                </SheetClose>
                <div className="px-2">
                  <ModeToggle />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
