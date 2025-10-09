import React, { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateQuoteFormSchema } from '../../validations/quote-form-validations';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import {
  CalendarIcon,
  MapIcon,
  RulerIcon,
  StickyNoteIcon,
  TrashIcon,
  User2Icon
} from 'lucide-react';
import { SwitchCardTwo } from '../switch-card';
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
import { Label } from '../ui/label';
import { Textarea } from '@tremor/react';
import supabase from '../../lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quote, QuoteLineItem } from '../../types/db_types';

type Props = {
  quote: Quote;
  quoteLineItems?: QuoteLineItem[];
  onSuccess?: () => void;
};

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

export default function UpdateQuoteForm({ quote, quoteLineItems, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const { customers } = useFetchCustomers();
  const {
    data: roofingServices,
    isLoading: isRoofingServicesLoading,
    isError: isRoofingServicesError
  } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  const [customAddressSwitch, setCustomAddressSwitch] = useState(!!quote.custom_address);
  const [generalNoteSwitch, setGeneralNoteSwitch] = useState(!!quote.private_note);
  const [measurementNoteSwitch, setMeasurementNoteSwitch] = useState(!!quote.measurement_note);
  const [customerNoteSwitch, setCustomerNoteSwitch] = useState(!!quote.public_note);

  const form = useForm<z.infer<typeof updateQuoteFormSchema>>({
    resolver: zodResolver(updateQuoteFormSchema),
    defaultValues: {
      id: quote.id,
      quote_number: quote.quote_number,
      customer_id: quote.customer_id,
      service_id: quote.service_id,
      status_id: quote.status_id,
      quote_date: new Date(quote.quote_date),
      expiration_date: new Date(quote.expiration_date),
      line_items: quoteLineItems?.map((item) => ({
        id: item.id,
        description: item.description || '',
        qty: item.qty,
        amount: item.amount,
        subtotal: item.subtotal
      })) || [{ description: '', qty: 1, amount: 0, subtotal: 0 }],
      custom_street_address: quote.custom_street_address || '',
      custom_city: quote.custom_city || '',
      custom_state: quote.custom_state || '',
      custom_zipcode: quote.custom_zipcode || '',
      private_note: quote.private_note || '',
      public_note: quote.public_note || '',
      measurement_note: quote.measurement_note || ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'line_items'
  });

  const lineItems = form.watch('line_items');

  // Use useEffect to calculate subtotals whenever quantity or amount changes
  useEffect(() => {
    const updatedLineItems = (lineItems ?? []).map((item) => ({
      ...item,
      subtotal: item.qty * item.amount
    }));
    form.setValue('line_items', updatedLineItems);
  }, [lineItems, form]);

  const calculateSubtotal = () => {
    return (lineItems ?? []).reduce((sum, item) => sum + item.subtotal, 0);
  };

  const subtotal = calculateSubtotal();
  const total: number = subtotal;

  // Function to update quote
  async function updateQuote(updatedQuote: any) {
    const { data, error } = await supabase
      .from('quote')
      .update(updatedQuote)
      .eq('id', quote.id)
      .select();

    if (error) throw error;
    return data;
  }

  // Function to update quote line items
  async function updateQuoteLineItems(quoteLineItems: any) {
    // Delete existing line items for this quote
    await supabase.from('quote_line_item').delete().eq('quote_id', quote.quote_number);

    // Prepare line items for insertion (remove id field for new items)
    const itemsToInsert = quoteLineItems.map((item: any) => {
      const { id, ...itemWithoutId } = item;
      return {
        ...itemWithoutId,
        // Ensure required fields are present
        quote_id: item.quote_id,
        service_id: item.service_id,
        description: item.description || '',
        qty: item.qty || 1,
        amount: item.amount || 0,
        subtotal: item.subtotal || 0,
        rate: item.rate || item.amount || 0, // Use amount as rate if rate is not provided
        sq_ft: item.sq_ft || 0, // Default to 0 if not provided
        fixed_item: item.fixed_item || false // Default to false if not provided
      };
    });

    // Insert new/updated line items
    const { data, error } = await supabase.from('quote_line_item').insert(itemsToInsert);

    if (error) {
      console.error('Error updating quote line items', error.message);
      console.error('Line items that failed:', itemsToInsert);
      throw error;
    }

    return data;
  }

  const quoteMutation = useMutation({
    mutationFn: updateQuote,
    onSuccess: () => {
      // Invalidate the main quotes list
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // Invalidate the specific quote by ID and quote number
      queryClient.invalidateQueries({ queryKey: ['quoteById', quote.quote_number] });
      queryClient.invalidateQueries({ queryKey: ['quoteById'] });
      // Invalidate quote status counts for the stats cards
      queryClient.invalidateQueries({ queryKey: ['totalPendingQuotes'] });
      queryClient.invalidateQueries({ queryKey: ['totalAcceptedQuotes'] });
      queryClient.invalidateQueries({ queryKey: ['totalRejectedQuotes'] });
    }
  });

  const quoteLineItemMutation = useMutation({
    mutationFn: updateQuoteLineItems,
    onSuccess: () => {
      // Invalidate quote line items queries
      queryClient.invalidateQueries({ queryKey: ['quoteLineItems'] });
      // Also invalidate the quote data since line items affect totals
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quoteById', quote.quote_number] });
    }
  });

  const onSubmit = async (values: z.infer<typeof updateQuoteFormSchema>) => {
    const { line_items, id, ...quoteData } = values;
    const updatedQuote = {
      ...quoteData,
      total: total,
      subtotal: subtotal,
      custom_address: customAddressSwitch,
      quote_date: quoteData.quote_date.toISOString().split('T')[0],
      expiration_date: quoteData.expiration_date.toISOString().split('T')[0]
    };

    const updatedLineItems = line_items?.map((item) => ({
      ...item,
      quote_id: values.quote_number,
      service_id: values.service_id
    }));

    console.log('Updating quote:', updatedQuote);
    console.log('Updating line items:', updatedLineItems);

    try {
      await quoteMutation.mutateAsync(updatedQuote);
      if (updatedLineItems) {
        await quoteLineItemMutation.mutateAsync(updatedLineItems);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
      let errorMessage = 'Unknown error occurred';

      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = (error as any).message;
        } else if ('details' in error) {
          errorMessage = (error as any).details;
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      alert('Failed to update quote: ' + errorMessage);
    }
  };

  return (
    <div className="w-full pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* General Quote Section */}
          <div className="space-y-4 h-full pb-6">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Search for customer</FormLabel>
                  <SearchCustomerCombobox data={customers || []} form={form} field={field} />
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
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined);
                        }}
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
                      value={field.value ? String(field.value) : undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status for quote" />
                        </SelectTrigger>
                      </FormControl>
                      <DefaultSelectDataItems data={quoteStatuses || []} />
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
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
                    value={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a roofing service..." />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems data={roofingServices || []} />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Line items section */}
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
                                field.onChange(e.target.value ? parseFloat(e.target.value) : 0);
                              }}
                              value={field.value || ''}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                      name={`line_items.${index}.amount`}
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

            {/* Totals section */}
            <div className={'w-full mx-auto pt-2 px-6'}>
              <div className={'w-full flex flex-col gap-2 text-sm'}>
                <div className={'flex justify-between w-full'}>
                  <p className={'my-auto font-light'}>Subtotal</p>
                  <p className={'my-auto font-light'}>${formatMoneyValue(subtotal)}</p>
                </div>
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

            {/* Optional fields */}
            <div className="flex flex-col gap-4 pt-2">
              <Label>Extra Options</Label>

              <SwitchCardTwo
                title={formSwitches[0].title}
                description={formSwitches[0].description}
                icon={formSwitches[0].icon}
                switchValue={customAddressSwitch}
                setSwitchValue={setCustomAddressSwitch}
              />

              {customAddressSwitch && (
                <div className={'flex gap-4 flex-col w-full mb-2'}>
                  <div className={'w-full'}>
                    <FormField
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder={'Enter address'} {...field} />
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
                              <Input placeholder={'Enter city'} {...field} />
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
                              <Input placeholder={'Enter state'} {...field} />
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
                            <Input placeholder={'Enter zipcode'} {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                      name={'custom_zipcode'}
                    />
                  </div>
                </div>
              )}

              <SwitchCardTwo
                title={formSwitches[1].title}
                description={formSwitches[1].description}
                icon={formSwitches[1].icon}
                switchValue={generalNoteSwitch}
                setSwitchValue={setGeneralNoteSwitch}
              />

              {generalNoteSwitch && (
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
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <SwitchCardTwo
                title={formSwitches[2].title}
                description={formSwitches[2].description}
                icon={formSwitches[2].icon}
                switchValue={measurementNoteSwitch}
                setSwitchValue={setMeasurementNoteSwitch}
              />

              {measurementNoteSwitch && (
                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write down any measurements about the roof here..."
                          className="resize-y rounded-lg h-[150px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  name={'measurement_note'}
                />
              )}

              <SwitchCardTwo
                title={formSwitches[3].title}
                description={formSwitches[3].description}
                icon={formSwitches[3].icon}
                switchValue={customerNoteSwitch}
                setSwitchValue={setCustomerNoteSwitch}
              />

              {customerNoteSwitch && (
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell the customer a custom message..."
                          className="resize-y rounded-lg h-[150px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  name={'public_note'}
                />
              )}
            </div>

            <SheetFooter className="pt-4 gap-2">
              <SheetClose asChild>
                <Button
                  type={'submit'}
                  disabled={
                    form.formState.isSubmitting ||
                    quoteMutation.isPending ||
                    quoteLineItemMutation.isPending
                  }>
                  {form.formState.isSubmitting ||
                  quoteMutation.isPending ||
                  quoteLineItemMutation.isPending
                    ? 'Updating...'
                    : 'Update Quote'}
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </form>
      </Form>
    </div>
  );
}
