import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addQuoteFormSchema } from '../validations/quote-form-validations';
import { Popover } from './ui/popover';
import SearchCustomerCombobox from './customer-combobox';
import { useFetchCustomers } from '../hooks/useAPI/useCustomers';
import { MapIcon, RulerIcon, StickyNoteIcon, User2Icon } from 'lucide-react';
import { Switch } from './ui/switch';

type Props = {
  setOpen: any;
};

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
            <div className="grid grid-flow-row grid-cols-2 gap-2">
              <div className="grid grid-flow-row grid-cols-10 border rounded-lg h-14 gap-2 px-2">
                <StickyNoteIcon className="w-5 h-5 my-auto col-span-2 mx-auto" />
                <div className="flex flex-col my-auto col-span-6">
                  <p className="font-[600] text-[10px] md:text-[12px]">General Notes</p>
                  <p className="text-muted-foreground text-[10px] md:text-[10px]">
                    To jot down general info
                  </p>
                </div>
                <div className="flex justify-end w-full my-auto col-span-2 mx-auto">
                  <Switch className="my-auto mx-auto" />
                </div>
              </div>
              <div className="grid grid-flow-row grid-cols-10 border rounded-lg h-14 gap-2 px-2">
                <MapIcon className="w-5 h-5 my-auto col-span-2 mx-auto" />
                <div className="flex flex-col my-auto col-span-6">
                  <p className="font-[600] text-[10px] md:text-[12px]">Custom Address</p>
                  <p className="text-muted-foreground text-[10px] md:text-[10px]">
                    Manual input for address
                  </p>
                </div>
                <div className="flex justify-end w-full my-auto col-span-2 mx-auto">
                  <Switch className="my-auto mx-auto" />
                </div>
              </div>
              <div className="grid grid-flow-row grid-cols-10 border rounded-lg h-14 gap-2 px-2">
                <RulerIcon className="w-5 h-5 my-auto col-span-2 mx-auto" />
                <div className="flex flex-col my-auto col-span-6">
                  <p className="font-[600] text-[10px] md:text-[12px]">Measurements Note</p>
                  <p className="text-muted-foreground text-[10px] md:text-[10px]">
                    To write roof measurement
                  </p>
                </div>
                <div className="flex justify-end w-full my-auto col-span-2 mx-auto">
                  <Switch className="my-auto mx-auto" />
                </div>
              </div>
              <div className="grid grid-flow-row grid-cols-10 border rounded-lg h-14 gap-2 px-2">
                <User2Icon className="w-5 h-5 my-auto col-span-2 mx-auto" />
                <div className="flex flex-col my-auto col-span-6">
                  <p className="font-[600] text-[10px] md:text-[12px]">Customer Note</p>
                  <p className="text-muted-foreground text-[10px] md:text-[10px]">
                    Write a note to customer
                  </p>
                </div>
                <div className="flex justify-end w-full my-auto col-span-2 mx-auto">
                  <Switch className="my-auto mx-auto" />
                </div>
              </div>
            </div>
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
          </div>
        </form>
      </Form>
    </div>
  );
}
