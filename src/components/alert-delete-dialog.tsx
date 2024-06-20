import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { Trash2Icon, TrashIcon } from 'lucide-react';
import ButtonLoading from './button-states';

type Props = {
  title: string;
  description: string;
  onSubmit: () => any;
  itemId: any;
  open: any;
  onOpenChange: any;
  isLoading: any;
};

export default function DefaultDeleteAlertDialog({
  title,
  description,
  onSubmit,
  open,
  onOpenChange,
  isLoading
}: Props) {
  function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onSubmit();
    // console.log('Button was pressed!')
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className="px-3 rounded-md bg-secondary">
        <TrashIcon className="w-4 h-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-4 w-full gap-6">
          <div className="w-[80px] h-[80px] mx-auto sm:w-full sm:h-full">
            <div className="w-full h-full rounded-full bg-red-100 mx-auto p-4 dark:bg-red-300/80">
              <div className="w-full h-full bg-red-200 rounded-full dark:bg-red-500/50">
                <div className="flex w-full flex-col h-full justify-center">
                  <Trash2Icon className="w-6 h-6 mx-auto text-red-600 dark:text-red-800" />
                </div>
              </div>
            </div>
          </div>
          <AlertDialogHeader className="sm:col-span-3">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <ButtonLoading variant="default" />
          ) : (
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-500/80 dark:text-white"
              onClick={handleOnClick}>
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}