import React from 'react';
import { Button } from './button';
import { LifeBuoyIcon, PlusIcon, GithubIcon, PlusCircleIcon } from 'lucide-react';
import { Separator } from './separator';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useAuth } from '../../hooks/useAuth';
import { abbreviateName } from '../../lib/utils';

type Props = {
  title: string;
  subheading: string;
  addItemTextButton: string;
};

export default function DefaultPageHeader({ title, subheading, addItemTextButton }: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full justify-between mt-4 md:mt-4 md:flex-row gap-4">
        <div>
          <p className="text-[24px] md:text-[24px] font-bold">{title}</p>
          <p className="text-[14px] font-[400] text-muted-foreground">{subheading}</p>
        </div>
        <div>
          <Button variant={'primary'} className="">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> {addItemTextButton}
          </Button>
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
      <div className='mt-auto'>
        <Button variant={'outline'}><GithubIcon className="mr-2 h-4 w-4"/> Open issue</Button>
      </div>
    </div>
  );
}
