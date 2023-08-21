import React from 'react';
import { Button } from './button';
import { PlusIcon } from 'lucide-react';
import { Separator } from './separator';

type Props = {
  title: string;
  subheading: string;
  addItemTextButton: string;
};

export default function DefaultPageHeader({ title, subheading, addItemTextButton }: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full justify-between md:mt-2 md:flex-row gap-4">
        <div>
          <p className="text-[24px] md:text-[30px] font-bold">{title}</p>
          <p className="text-[16px] font-[400]">{subheading}</p>
        </div>
        <div>
          <Button variant={'primary'} className='text-[14px]'>
            <PlusIcon className="mr-2 h-4 w-4" /> {addItemTextButton}
          </Button>
        </div>
      </div>
      <div className='w-full'>
        <Separator className='mt-2'/>
      </div>
    </div>
  );
}
