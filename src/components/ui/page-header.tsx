import React from 'react';
import { Button } from './button';
import { LifeBuoyIcon, PlusIcon, GithubIcon, PlusCircleIcon } from 'lucide-react';
import { Separator } from './separator';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useAuth } from '../../hooks/useAuth';
import { abbreviateName } from '../../lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './sheet';
import { ScrollArea } from './scroll-area';

type Props = {
  title: string;
  subheading: string;
  addItemTextButton: string;
  sheetTitle?: string;
  sheetDescription?: string;
  sheetContent?: React.ReactNode;
  SheetContentBody?: any;
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function DefaultPageHeader({
  title,
  subheading,
  addItemTextButton,
  sheetTitle,
  sheetDescription,
  sheetContent,
  SheetContentBody
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full justify-between mt-4 md:mt-4 md:flex-row gap-4">
        <div>
          <p className="text-[24px] md:text-[24px] font-bold">{title}</p>
          <p className="text-[14px] font-[400] text-muted-foreground">{subheading}</p>
        </div>
        <div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={'primary'} className="" size={'sm'}>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> {addItemTextButton}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl px-2">
              <SheetHeader className="px-4 space-y-0">
                <SheetTitle className="text-[18px]">{sheetTitle}</SheetTitle>
                <SheetDescription>{sheetDescription}</SheetDescription>
              </SheetHeader>
              {/* <div className="w-full pt-6 pb-8 h-full overflow-auto px-2">
                <SheetContentBody />
              </div> */}
              <ScrollArea className="w-full h-full pb-8 pt-6">
                <SheetContentBody setOpen={setOpen} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="w-full">
        <Separator className="mt-2" />
      </div>
    </div>
  );
}

export function DashboardPageHeader() {
  const auth = useAuth();
  return (
    <div className="flex w-full justify-between mt-4 flex-col lg:flex-row gap-4">
      <div>
        <p className="text-[24px] font-[600]">Dashboard</p>
        <p className="text-[14px] text-muted-foreground">
          Welcome! Have a look at the analytics for your business here.
        </p>
      </div>
      {/* <div className="flex mt-auto gap-4 px-4 py-2">
        <Avatar className="mt-auto">
          <AvatarImage src={auth?.user ? auth?.user?.user_metadata.avatar_url : 'https://www.google.com/'}/>
          <AvatarFallback className="mt-auto">
            {abbreviateName(auth?.user?.user_metadata.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className='my-auto'>
          <p className='text-[14px] font-[600] -mb-[2px]'>{auth?.user?.user_metadata.full_name}</p>
          <p className='text-[12px] font-[400]'>User</p>
        </div>
      </div> */}
      <div className="mt-auto">
        <Button variant={'outline'}>
          <GithubIcon className="mr-2 h-4 w-4" /> Open issue
        </Button>
      </div>
    </div>
  );
}
