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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import AddCustomerForm from '../forms/add-customer-form';
import AddQuoteForm from '../forms/add-quote-form';
import AddInvoiceForm from '../forms/add-invoice-form';

type Props = {
  userData: IGoogleUser;
};

export default function SideNavbar({ userData }: Props) {
  const auth = useAuth();
  const [customerSheetOpen, setCustomerSheetOpen] = React.useState(false);
  const [quoteSheetOpen, setQuoteSheetOpen] = React.useState(false);
  const [invoiceSheetOpen, setInvoiceSheetOpen] = React.useState(false);
  return (
    <>
      {/* Desktop */}
      <div className="hidden z-40 fixed px-2 border-r-1 lg:w-[80px] lg:h-screen lg:flex lg:flex-col bg-white border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col mx-auto w-full my-4 h-full gap-6">
          <div className="mx-auto">
            <div className="w-[50px] bg-blue-600 rounded-2xl transition ease-in-out duration-300 hover:scale-105">
              <Link to={'/'}>
                <img src="/assets/TRA-logo.png" className="shadow-xs p-[0px]" />
              </Link>
            </div>
            {auth?.user && (
              <div className="w-full flex justify-center mt-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:border-2 hover:border-blue-500 transition ease-in-out duration-300 hover:scale-110">
                      {/* @ts-ignore */}
                      <AvatarImage src={auth.user.user_metadata.avatar_url} />
                      <AvatarFallback>
                        {/* @ts-ignore */}
                        {abbreviateName(auth?.user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                          <UsersIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'primary'} className="rounded-full" size={'icon'}>
                      <PlusIcon size={'18px'} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="w-48 p-2">
                    <div className="space-y-1">
                      <button
                        onClick={() => setCustomerSheetOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left">
                        <UsersIcon size={16} />
                        <span>New Customer</span>
                      </button>
                      <button
                        onClick={() => setQuoteSheetOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left">
                        <ClipboardSignatureIcon size={16} />
                        <span>New Quote</span>
                      </button>
                      <button
                        onClick={() => setInvoiceSheetOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left">
                        <SendIcon size={16} />
                        <span>New Invoice</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="flex justify-center w-full">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <MobileNavbar userData={userData} />

      {/* Customer Form Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Add New Customer</SheetTitle>
            <SheetDescription>Fill out the details for the new customer.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddCustomerForm setOpen={setCustomerSheetOpen} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Quote Form Sheet */}
      <Sheet open={quoteSheetOpen} onOpenChange={setQuoteSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Create New Quote</SheetTitle>
            <SheetDescription>Fill out the details for the new quote.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddQuoteForm />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Invoice Form Sheet */}
      <Sheet open={invoiceSheetOpen} onOpenChange={setInvoiceSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4 space-y-0 mb-4">
            <SheetTitle>Create New Invoice</SheetTitle>
            <SheetDescription>Fill out the details for the new invoice.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <AddInvoiceForm setOpen={setInvoiceSheetOpen} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
