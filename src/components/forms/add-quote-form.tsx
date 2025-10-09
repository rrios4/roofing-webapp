import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addQuoteFormSchema } from '../../validations/quote-form-validations';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import {
  CalendarIcon,
  MapIcon,
  PlusIcon,
  RulerIcon,
  StickyNoteIcon,
  TrashIcon,
  User2Icon
} from 'lucide-react';
import DefaultSwitchCard, { SwitchCardTwo } from '../switch-card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { cn, formatMoneyValue } from '../../lib/utils';
import { format } from 'date-fns';
import { SheetClose, SheetFooter } from '../ui/sheet';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import DefaultSelectDataItems from '../select-data-items';
import { useQuoteStatuses } from '../../hooks/useAPI/use-quote-status';
import { useFetchQuotes } from '../../hooks/useAPI/use-quotes';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '@tremor/react';
import supabase from '../../lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import AddCustomerForm from './add-customer-form';

type Props = {};

const formSwitches = [
  {
    title: 'Custom Address',
    description: 'Manual input for address',
    icon: <MapIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'General Notes',
    description: 'To jot down general info',
    icon: <StickyNoteIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Measurements Note',
    description: 'To write roof measurement',
    icon: <RulerIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Customer Note',
    description: 'Write a note to customer',
    icon: <User2Icon className="w-5 h-5 my-auto mx-auto" />
  }
];

export default function AddQuoteForm() {
  const queryClient = useQueryClient();
  const { quotes } = useFetchQuotes();
  const { customers } = useFetchCustomers();
  const {
    data: roofingServices,
    isLoading: isRoofingServicesLoading,
    isError: isRoofingServicesError
  } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  const [customAddressSwitch, setCustomAddressSwitch] = React.useState(false);
  const [generalNoteSwitch, setGeneralNoteSwitch] = useState(false);
  const [measurementNoteSwitch, setMeasurementNoteSwitch] = useState(false);
  const [customerNoteSwitch, setCustomerNoteSwitch] = useState(false);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof addQuoteFormSchema>>({
    resolver: zodResolver(addQuoteFormSchema),
    defaultValues: {
      quote_number: undefined, // Change from 0 to undefined so placeholder shows
      customer_id: 0,
      service_id: undefined, // Change from 0 to undefined
      status_id: undefined, // Change from 0 to undefined
      quote_date: new Date(),
      expiration_date: new Date(),
      line_items: [{ description: '', qty: 1, amount: 0, subtotal: 0 }], // Start with one empty line item
      custom_street_address: '',
      custom_city: '',
      custom_state: '',
      custom_zipcode: '',
      private_note: '',
      public_note: '',
      measurement_note: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'line_items'
  });

  function calculateNextQuoteNumber(quotes: { quote_number: number }[] | undefined): number {
    if (!quotes || quotes.length === 0) {
      return 1; // Start with 1 if no quotes exist
    }
    return Math.max(...quotes.map((quote) => quote.quote_number)) + 1;
  }

  // Watch the quotes array for changes
  const quoteNumbers = form.watch('quote_number');

  // Calculate the next quote number dynamically
  const nextQuoteNumber = calculateNextQuoteNumber(quotes);

  const lineItems = form.watch('line_items');
  // Use useEffect to calculate subtotals whenever quantity or amount changes
  React.useEffect(() => {
    const updatedLineItems = (lineItems ?? []).map((item) => ({
      ...item,
      subtotal: item.qty * item.amount
    }));
    form.setValue('line_items', updatedLineItems);
    // calculateNextQuoteNumber(quotes);
  }, [lineItems, form]);

  const calculateSubtotal = () => {
    return (lineItems ?? []).reduce((sum, item) => sum + item.subtotal, 0);
  };

  const subtotal = calculateSubtotal();
  // const taxRate = 0.0825; // Example tax rate (5%)
  // const discountRate = 0.1; // Example discount rate (10%)
  // const discountAmount: number = subtotal * discountRate;
  // const adjustedSubtotal = subtotal - discountAmount;
  // const tax = adjustedSubtotal * taxRate;
  // const total = adjustedSubtotal + tax;
  const total: number = subtotal;

  // Need to define the types for parameter
  async function createQuote(newQuote: any) {
    const { data, error } = await supabase.from('quote').insert(newQuote);

    if (error) throw error;

    return data;
  }

  // Need to define the types for parameter
  async function createQuoteLineItems(quoteLineItems: any) {
    const { data, error } = await supabase.from('quote_line_item').insert(quoteLineItems);

    if (error) {
      console.error('Error creating quote line items', error.message);
    }

    return console.log('Quote line items created: ', data);
  }

  // const mutation = useMutation(createQuote, {
  //   onSuccess: (data) => {
  //     // Invalidate the 'quotes' query to refresh
  //     queryClient.invalidateQueries(['quotes']);
  //   },
  //   onError: (error) => {
  //     console.log('Error creating quote: ', error);
  //   }
  // });
  const quoteMutation = useMutation(createQuote);
  const quoteLineItemMutation = useMutation(createQuoteLineItems);

  const onSubmit = async (values: z.infer<typeof addQuoteFormSchema>) => {
    // console.log(values);
    const { line_items, ...quote } = values;
    const updatedQuote = { ...quote, total: total, subtotal: subtotal };
    const updatedLineItems = line_items?.map((item) => ({
      ...item,
      quote_id: values.quote_number,
      service_id: values.service_id
    }));

    console.log('line_items', updatedLineItems);
    console.log('quote', updatedQuote);

    try {
      await quoteMutation.mutateAsync(updatedQuote);
      await quoteLineItemMutation.mutateAsync(updatedLineItems);
      queryClient.invalidateQueries(['quotes']);
      form.reset();
    } catch (error) {
      alert('Failed to create quote: ' + error);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* General Invoice Section */}
          <div className="space-y-4 h-full px-4 pb-6">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Search for customer</FormLabel>
                  <div className="flex gap-2 w-full">
                    <div className="flex-1">
                      <SearchCustomerCombobox data={customers} form={form} field={field} />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCustomerSheetOpen(true)}
                      className="shrink-0 h-10 w-10">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
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
                      <Input
                        {...field}
                        className="w-full"
                        value={field.value || ''} // Show empty string when undefined, not 0
                        onChange={(e) => {
                          // Convert the value to a number if not empty, otherwise set to undefined
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined);
                        }}
                        placeholder={String(nextQuoteNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                      {' '}
                      {/* Use undefined instead of empty string */}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status for quote" />
                        </SelectTrigger>
                      </FormControl>
                      <DefaultSelectDataItems data={quoteStatuses} />
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
                          // disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
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
                          // disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                    {' '}
                    {/* Use undefined instead of empty string */}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a roofing service..." />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems data={roofingServices} />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Line items section */}
            <div className="flex flex-col py-2 gap-6">
              <Label>Line Items</Label>
              {fields.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="grid w-full grid-cols-8 grid-flow-row gap-4">
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          {/*<FormMessage />*/}
                        </FormItem>
                      )}
                      name={`line_items.${index}.description`}
                    />
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input disabled {...field} />
                          </FormControl>
                          {/*<FormMessage />*/}
                        </FormItem>
                      )}
                      name={`line_items.${index}.qty`}
                    />

                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-3 sm:col-span-2">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              {...field}
                              onChange={(e) => {
                                // Convert the value to a number before passing it to the field
                                field.onChange(e.target.value ? parseFloat(e.target.value) : '');
                              }}
                              value={field.value || ''}
                            />
                          </FormControl>
                          {/*<FormMessage/>*/}
                        </FormItem>
                      )}
                      name={`line_items.${index}.amount`}
                    />

                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="hidden col-span-3 sm:col-span-2">
                          <FormLabel>Subtotal</FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              {...field}
                              onChange={(e) => {
                                // Convert the value to a number before passing it to the field
                                field.onChange(e.target.value ? parseFloat(e.target.value) : '');
                              }}
                              value={field.value || ''}
                            />
                          </FormControl>
                          {/*<FormMessage/>*/}
                        </FormItem>
                      )}
                      name={`line_items.${index}.subtotal`}
                    />

                    <div className="sm:col-span-1 mx-auto mt-auto">
                      <Button type="button" variant={'secondary'} onClick={() => remove(index)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => append({ description: '', qty: 1, amount: 0, subtotal: 0 })}>
                + Add Line Item
              </Button>
            </div>

            <div className={'w-full mx-auto pt-2 px-6'}>
              <div className={'w-full flex flex-col gap-2 text-sm'}>
                {/* Subtotal */}
                <div className={'flex justify-between w-full'}>
                  <p className={'my-auto font-light'}>Subtotal</p>
                  <p className={'my-auto font-light'}>${formatMoneyValue(subtotal)}</p>
                </div>
                {/* TODO: Payment Processing Fee */}
                {/* Discount */}
                {/*<div className={'flex justify-between w-full'}>*/}
                {/*  <p className={'my-auto font-light'}>*/}
                {/*    Discount <span className={'text-xs'}>({discountRate * 100}%)</span>*/}
                {/*  </p>*/}
                {/*  <p className={'my-auto font-light'}>- ${formatMoneyValue(discountAmount)}</p>*/}
                {/*</div>*/}
                {/* Taxes */}
                {/*<div className={'flex justify-between w-full'}>*/}
                {/*  <p className={'my-auto font-light'}>*/}
                {/*    Taxes <span className={'text-xs'}>({taxRate * 100}%)</span>*/}
                {/*  </p>*/}
                {/*  <p className={'my-auto font-light'}>${formatMoneyValue(tax)}</p>*/}
                {/*</div>*/}
              </div>
            </div>

            <div className={'w-full mx-auto py-4'}>
              <div className={'w-full bg-blue-500 h-[50px] rounded-xl'}>
                <div className={'flex justify-between w-full h-full px-6'}>
                  <p className={'my-auto font-bold text-white'}>Total</p>
                  <p className={'my-auto font-light text-white'}>${formatMoneyValue(total)}</p>
                </div>
              </div>
            </div>

            {/* <div className="grid grid-flow-row grid-cols-2 gap-2 py-4">
                {formSwitches.map((item, index) => (
                  <React.Fragment key={index}>
                    <DefaultSwitchCard
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                    />
                  </React.Fragment>
                ))}
              </div> */}

            {/* Optional  */}
            <div className="flex flex-col gap-4 pt-2">
              <Label>Extra Options</Label>
              {customAddressSwitch && (
                <div className={'flex gap-4 flex-col w-full mb-2'}>
                  <div className={'w-full'}>
                    <FormField
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder={'Enter address'} {...field} defaultValue={''} />
                          </FormControl>
                        </FormItem>
                      )}
                      name={'custom_street_address'}
                    />
                  </div>
                  <div className={'flex gap-6'}>
                    <div className={'w-full'}>
                      <FormField
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder={'Enter city'} {...field} defaultValue={''} />
                            </FormControl>
                          </FormItem>
                        )}
                        name={'custom_city'}
                      />
                    </div>
                    <div className={'w-full'}>
                      <FormField
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder={'Enter state'} {...field} defaultValue={''} />
                            </FormControl>
                          </FormItem>
                        )}
                        name={'custom_state'}
                      />
                    </div>
                  </div>
                  <div>
                    <FormField
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zipcode</FormLabel>
                          <FormControl>
                            <Input placeholder={'Enter zipcode'} {...field} defaultValue={''} />
                          </FormControl>
                        </FormItem>
                      )}
                      name={'custom_zipcode'}
                    />
                  </div>
                </div>
              )}
              <SwitchCardTwo
                title={formSwitches[0].title}
                description={formSwitches[0].description}
                icon={formSwitches[0].icon}
                switchValue={customAddressSwitch}
                setSwitchValue={setCustomAddressSwitch}
              />
              {generalNoteSwitch && (
                <>
                  <FormField
                    control={form.control}
                    name={'private_note'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Jot down any notes here..."
                            className="resize-y rounded-lg h-[150px]"
                            defaultValue={''}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
              <SwitchCardTwo
                title={formSwitches[1].title}
                description={formSwitches[1].description}
                icon={formSwitches[1].icon}
                switchValue={generalNoteSwitch}
                setSwitchValue={setGeneralNoteSwitch}
              />
              {measurementNoteSwitch && (
                <>
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write down any measurements about the roof here..."
                            className="resize-y rounded-lg h-[150px]"
                            defaultValue={''}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                    name={'measurement_note'}
                  />
                </>
              )}
              <SwitchCardTwo
                title={formSwitches[2].title}
                description={formSwitches[2].description}
                icon={formSwitches[2].icon}
                switchValue={measurementNoteSwitch}
                setSwitchValue={setMeasurementNoteSwitch}
              />
              {customerNoteSwitch && (
                <>
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell the customer a custom message..."
                            className="resize-y rounded-lg h-[150px]"
                            defaultValue={''}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                    name={'public_note'}
                  />
                </>
              )}
              <SwitchCardTwo
                title={formSwitches[3].title}
                description={formSwitches[3].description}
                icon={formSwitches[3].icon}
                switchValue={customerNoteSwitch}
                setSwitchValue={setCustomerNoteSwitch}
              />
            </div>

            <SheetFooter className="pt-4 gap-2">
              <SheetClose asChild>
                <Button type={'submit'} disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
                </Button>
              </SheetClose>
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

      {/* Add Customer Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg px-2">
          <SheetHeader className="px-4">
            <SheetTitle>Add New Customer</SheetTitle>
          </SheetHeader>
          <AddCustomerForm setOpen={setCustomerSheetOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
