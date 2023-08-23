import React from 'react';
import {
  LayoutDashboardIcon,
  HomeIcon,
  HammerIcon,
  InboxIcon,
  SendIcon,
  ClipboardSignatureIcon,
  UsersIcon,
  PlusIcon,
  SettingsIcon,
  LogOutIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NavLinkTooltip from '../navlink-tooltip';
import { Separator } from '../ui/separator';
import { ModeToggle } from './mode-toggle';
import { Button } from '../ui/button';
import MobileNavbar from './mobile-navbar';
import { navLinks } from './nav-links';
import { IGoogleUser } from '../../types/global_types';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { abbreviateName } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

type Props = {
  userData: IGoogleUser;
};

export default function SideNavbar({ userData }: Props) {
  const auth = useAuth();
  return (
    <>
      {/* Desktop */}
      <div className="hidden z-40 fixed px-2 border-r-1 lg:w-[80px] lg:h-screen lg:flex lg:flex-col bg-white border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col mx-auto w-full my-4 h-full gap-6">
          <div className="mx-auto">
            <div className="w-[50px] bg-blue-600 rounded-2xl transition ease-in-out duration-300 hover:scale-105">
              <Link to={'/'}>
                <img src="/assets/LogoRR.png" className="shadow-xs p-[2px]" />
              </Link>
            </div>
            {auth?.user && (
              <div className="w-full flex justify-center mt-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:border-2 hover:border-blue-500 transition ease-in-out duration-300 hover:scale-110">
                      <AvatarImage src={auth.user.user_metadata.avatar_url} />
                      <AvatarFallback>
                        {abbreviateName(auth?.user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <UsersIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => auth.signOut()}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="flex flex-col mx-auto gap-2">
            {navLinks.map((item, index) => (
              <React.Fragment key={index}>
                <NavLinkTooltip title={item.title} icon={item.icon} path={item.path} />
                {item.lastOfGroup === true && <Separator className="mb-2" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-col mt-auto gap-2 mx-auto">
            {auth?.user && (
              <div>
                <Button variant={'primary'} className="rounded-full" size={'icon'}>
                  <PlusIcon size={'18px'} />
                </Button>
              </div>
            )}
            <div className="flex justify-center w-full">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <MobileNavbar userData={userData} />
    </>
  );
}
