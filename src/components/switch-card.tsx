import React from 'react';
import { Switch } from './ui/switch';

type Props = {
  title: string | undefined;
  description: string | undefined;
  icon: React.ReactNode | undefined;
};

export default function DefaultSwitchCard({ title, description, icon }: Props) {
  return (
    <div className="grid grid-flow-row grid-cols-6 border rounded-lg h-14 gap-2 w-full px-2">
      <div className="flex gap-2 w-full col-span-5">
        {icon}
        <div className="flex flex-col my-auto w-full">
          <p className="font-[600] text-[10px] md:text-[12px]">{title}</p>
          <p className="text-muted-foreground text-[10px] md:text-[10px]">{description}</p>
        </div>
      </div>
      <div className="flex justify-end w-full my-auto col-span-1 mx-auto">
        <Switch className="my-auto mx-auto" />
      </div>
    </div>
  );
}
