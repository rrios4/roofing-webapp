import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from '../lib/utils';
import { FormControl } from './ui/form';

type Props = {
  data: any;
  form: any;
  field: any;
};

export default function SearchCustomerCombobox({ data, form, field }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    console.log(data);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
            {field.value
              ? data.find((item) => item.id === field.value)?.email
              : 'Select customer...'}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Select customer..." />
          <CommandEmpty>No customer found.</CommandEmpty>
          <CommandGroup>
            {data?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => {
                  form.setValue('customer_id', item.id);
                }}
                className="gap-4">
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    item.id === field.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div>
                  <p className="font-[500]">
                    {item.first_name} {item.last_name}
                  </p>
                  <p>{item.email}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
