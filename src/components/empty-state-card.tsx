import React from 'react';
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';

type Props = {
  icon: React.ReactNode;
  entity: string;
  activateModal: any;
};

export default function EmptyStateCard({ icon, entity, activateModal }: Props) {
  return (
    <div className="flex w-full justify-center p-8 mx-auto mt-4 max-w-[600px] shadow-sm border rounded-lg dark:bg-zinc-800">
      <div className="flex flex-col gap-2">
          <div className='mx-auto p-3 border rounded-lg w-max dark:border-zinc-700'>{icon}</div>
          <p className="font-[600] text-18px text-center">No {entity}s found</p>
          <p className="text-[14px] font-[400] mb-6">
            Click on the button below to add a new {entity} to system.
          </p>
          <div className="flex justify-center text-[16px]">
            <Button variant={'primary'} onClick={activateModal}>
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add {entity}
            </Button>
          </div>
        </div>
    </div>
  );
}
