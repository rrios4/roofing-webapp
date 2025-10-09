import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import { abbreviateName, cn } from '../lib/utils';
import { FormControl } from './ui/form';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

type Props = {
  data: any;
  form: any;
  field: any;
};

export default function SearchCustomerCombobox({ data, form, field }: Props) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState('');
  React.useEffect(() => {
    // console.log(data);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            role="combobox"
            // aria-expanded={open}
            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
            {field.value
              ? data.find((item: any) => item.id === field.value)?.email
              : 'Select customer'}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-[350px]">
        <Command>
          <CommandInput placeholder="Select customer..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {data?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      form.setValue('customer_id', item.id);
                      setOpen(false);
                    }}
                    className="gap-4 hover:cursor-pointer">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback className={'bg-gray-300 dark:bg-gray-700'}>
                          {item.first_name.charAt(0)}
                          {item.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={'flex flex-col gap-0'}>
                        <p className="font-[500]">
                          {item.first_name} {item.last_name}
                        </p>
                        <p className={'text-xs'}>{item.email}</p>
                      </div>
                    </div>
                    <CheckIcon
                      className={cn(
                        'mr-0 h-4 w-4',
                        item.id === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                </React.Fragment>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
