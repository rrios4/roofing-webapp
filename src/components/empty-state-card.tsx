import React from 'react';
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';

type Props = {
  icon: React.ReactNode;
  entity: string;
  activateModal: any;
  sheetTitle: string;
  sheetDescription: string;
  SheetContentBody?: any;
};

export default function EmptyStateCard({
  icon,
  entity,
  activateModal,
  sheetTitle,
  sheetDescription,
  SheetContentBody
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex w-full justify-center p-8 mx-auto mt-4 max-w-[600px] shadow-sm border rounded-lg dark:bg-zinc-800">
      <div className="flex flex-col gap-2">
        <div className="mx-auto p-3 border rounded-lg w-max dark:border-zinc-700">{icon}</div>
        <p className="font-[600] text-18px text-center">No {entity}s found</p>
        <p className="text-[14px] font-[400] mb-6">
          Click on the button below to add a new {entity} to system.
        </p>
        <div className="flex justify-center text-[16px]">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={'primary'} onClick={activateModal}>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add {entity}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="text-[18px]">
                <SheetTitle>{sheetTitle}</SheetTitle>
                <SheetDescription>{sheetDescription}</SheetDescription>
              </SheetHeader>
              <SheetContentBody open={open} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
