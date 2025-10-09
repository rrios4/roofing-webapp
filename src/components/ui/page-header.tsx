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
  subheading?: string;
  // Action button props
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonIcon?: React.ReactNode;
  actionButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
  onActionClick?: () => void;
  // Sheet props (when using sheet for action)
  useSheet?: boolean;
  sheetTitle?: string;
  sheetDescription?: string;
  sheetContent?: React.ReactNode;
  SheetContentBody?: any;
  // Custom action buttons (for multiple buttons)
  customActions?: React.ReactNode;
  // Layout options
  showSeparator?: boolean;
  headerClassName?: string;
  titleClassName?: string;
  subheadingClassName?: string;
  // Legacy props for backward compatibility
  addItemTextButton?: string;
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
              <Button variant={'primary'} size={'sm'}>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                {addItemTextButton}
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
        <Button
          variant={'outline'}
          onClick={() =>
            window.open('https://github.com/rrios4/roofing-webapp/issues/new', '_blank')
          }>
          <GithubIcon className="mr-2 h-4 w-4" /> Open issue
        </Button>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subheading,
  showActionButton = true,
  actionButtonText,
  actionButtonIcon = <PlusCircleIcon className="mr-2 h-4 w-4" />,
  actionButtonVariant = 'primary',
  onActionClick,
  useSheet = true,
  sheetTitle,
  sheetDescription,
  sheetContent,
  SheetContentBody,
  customActions,
  showSeparator = true,
  headerClassName,
  titleClassName,
  subheadingClassName,
  // Legacy prop support
  addItemTextButton
}: Props) {
  const [open, setOpen] = React.useState(false);

  // Support legacy prop
  const buttonText = actionButtonText || addItemTextButton || 'Add Item';

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    } else if (useSheet) {
      setOpen(true);
    }
  };

  return (
    <div className={`flex flex-col w-full gap-4 ${headerClassName || ''}`}>
      <div className="flex flex-col w-full justify-between mt-4 md:mt-4 md:flex-row gap-4">
        <div>
          <p className={`text-[24px] md:text-[24px] font-bold ${titleClassName || ''}`}>{title}</p>
          {subheading && (
            <p
              className={`text-[14px] font-[400] text-muted-foreground ${subheadingClassName || ''}`}>
              {subheading}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {/* Custom actions take precedence */}
          {customActions ||
            (showActionButton &&
              (useSheet ? (
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant={actionButtonVariant} size={'sm'}>
                      {actionButtonIcon}
                      {buttonText}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl px-2">
                    <SheetHeader className="px-4 space-y-0">
                      <SheetTitle className="text-[18px]">{sheetTitle}</SheetTitle>
                      {sheetDescription && <SheetDescription>{sheetDescription}</SheetDescription>}
                    </SheetHeader>
                    <ScrollArea className="w-full h-full pb-8 pt-6 px-4">
                      {SheetContentBody ? <SheetContentBody setOpen={setOpen} /> : sheetContent}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant={actionButtonVariant} size={'sm'} onClick={handleActionClick}>
                  {actionButtonIcon}
                  {buttonText}
                </Button>
              )))}
        </div>
      </div>
      {showSeparator && (
        <div className="w-full">
          <Separator className="mt-0" />
        </div>
      )}
    </div>
  );
}
