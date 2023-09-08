import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addQuoteFormSchema } from '../validations/quote-form-validations';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import SearchCustomerCombobox from './customer-combobox';
import { useFetchCustomers } from '../hooks/useAPI/useCustomers';
import { CalendarIcon, MapIcon, RulerIcon, StickyNoteIcon, User2Icon } from 'lucide-react';
import DefaultSwitchCard from './switch-card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { SheetClose, SheetFooter } from './ui/sheet';

type Props = {
  setOpen: any;
};

const formSwitches = [
  {
    title: 'General Notes',
    description: 'To jot down general info',
    icon: <StickyNoteIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Custom Address',
    description: 'Manual input for address',
    icon: <MapIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Measurements Note',
    description: 'To write roof measurement',
    icon: <RulerIcon className="w-5 h-5 my-auto col-span-2 mx-auto" />
  },
  {
    title: 'Customer Note',
    description: 'Write a note to customer',
    icon: <User2Icon className="w-5 h-5 my-auto col-span-2 mx-auto" />
  }
];

export default function AddQuoteForm({ setOpen }: Props) {
  const { customers } = useFetchCustomers();
  React.useEffect(() => {
    console.log(customers);
  }, []);
  const form = useForm<z.infer<typeof addQuoteFormSchema>>({
    resolver: zodResolver(addQuoteFormSchema)
  });

  function onSubmit(values: z.infer<typeof addQuoteFormSchema>) {
    console.log(values);
  }
  return (
    <div className="w-full my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Search for customer</FormLabel>
                  <SearchCustomerCombobox data={customers} form={form} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="quote_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quote #</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quote_status_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status for quote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* {customerTypes?.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                          <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
                            {item.name}
                          </SelectItem>
                        </React.Fragment>
                      ))} */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="quote_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quote date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 text-start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 text-start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a roofing service..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {customerTypes?.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                          <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
                            {item.name}
                          </SelectItem>
                        </React.Fragment>
                      ))} */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-flow-row grid-cols-2 gap-2 py-6">
              {formSwitches.map((item, index) => (
                <React.Fragment key={index}>
                  <DefaultSwitchCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                </React.Fragment>
              ))}
            </div>
            <SheetFooter className="pt-8 gap-2">
              <SheetClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </SheetClose>
              {/* {isAddCustomerMutationLoading ? (
                <ButtonLoading variant="primary" />
              ) : (
                <Button variant={'primary'} type="submit">
                  Save changes
                </Button>
              )} */}

              {/* <SheetClose>
              <Button variant={'primary'}>Save changes</Button>
            </SheetClose> */}
            </SheetFooter>
          </div>
        </form>
      </Form>
    </div>
  );
}
