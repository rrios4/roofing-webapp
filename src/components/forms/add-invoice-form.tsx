import React, { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addInvoiceFormSchema } from '../../validations/invoice-form-validations';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import {
  CalendarIcon,
  Loader2Icon,
  MapIcon,
  PlusIcon,
  RulerIcon,
  StickyNoteIcon,
  TrashIcon,
  User2Icon,
  DollarSignIcon
} from 'lucide-react';
import { SwitchCardTwo } from '../switch-card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import DefaultSelectDataItems from '../select-data-items';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { cn, formatMoneyValue } from '../../lib/utils';
import { format } from 'date-fns';
import { Label } from '../ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter } from '../ui/sheet';
import AddCustomerForm from './add-customer-form';
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/use-invoice-status';
import { useFetchAllInvoices } from '../../hooks/useAPI/use-invoice';

type Props = {
  setOpen?: any;
  onSuccess?: () => void;
};

const formSwitches = [
  {
    title: 'Custom Bill To Address',
    description: 'Different billing address',
    icon: <MapIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'General Notes',
    description: 'Internal notes',
    icon: <StickyNoteIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'SQFT Measurement',
    description: 'Square footage details',
    icon: <RulerIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Customer Note',
    description: 'Note visible to customer',
    icon: <User2Icon className="w-5 h-5 my-auto mx-auto" />
  }
];

export default function AddInvoiceForm({ setOpen, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const { data: invoices } = useFetchAllInvoices();
  const { customers } = useFetchCustomers();
  const {
    data: roofingServices,
    isLoading: isRoofingServicesLoading,
    isError: isRoofingServicesError
  } = useFetchAllServices();
  const { data: invoiceStatuses } = useFetchAllInvoiceStatuses();

  const [billToSwitch, setBillToSwitch] = useState(false);
  const [generalNoteSwitch, setGeneralNoteSwitch] = useState(false);
  const [measurementNoteSwitch, setMeasurementNoteSwitch] = useState(false);
  const [customerNoteSwitch, setCustomerNoteSwitch] = useState(false);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof addInvoiceFormSchema>>({
    resolver: zodResolver(addInvoiceFormSchema),
    defaultValues: {
      invoice_number: undefined, // Will be calculated
      customer_id: 0,
      service_type_id: 0, // Initialize as 0 instead of undefined
      invoice_status_id: 0, // Initialize as 0 instead of undefined
      invoice_date: new Date(),
      issue_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      line_items: [{ description: '', qty: 1, rate: 0, amount: 0, sq_ft: 0, fixed_item: true }],
      bill_from_street_address: '150 Tallant St',
      bill_from_city: 'Houston',
      bill_from_state: 'TX',
      bill_from_zipcode: '77076',
      bill_from_email: '',
      bill_to_street_address: '',
      bill_to_city: '',
      bill_to_state: '',
      bill_to_zipcode: '',
      bill_to: false,
      private_note: '',
      public_note: '',
      cust_note: '',
      sqft_measurement: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'line_items'
  });

  function calculateNextInvoiceNumber(invoices: { invoice_number: number }[] | undefined): number {
    if (!invoices || invoices.length === 0) {
      return 1;
    }
    return Math.max(...invoices.map((invoice) => invoice.invoice_number)) + 1;
  }

  const nextInvoiceNumber = calculateNextInvoiceNumber(invoices);

  const lineItems = form.watch('line_items');

  useEffect(() => {
    // Set default values for new line items but don't auto-calculate amounts
    const updatedLineItems = (lineItems ?? []).map((item, index) => {
      const qty = item.qty || 1;
      const rate = 0; // Always set rate to 0 for fixed pricing
      // Keep the amount as entered by user, don't calculate it

      return {
        ...item,
        qty,
        rate, // Always 0 for fixed pricing
        amount: item.amount || 0 // Keep user-entered amount
      };
    });

    // Only update if there's an actual change to prevent infinite loops
    const hasChanged = updatedLineItems.some((item, index) => {
      const currentItem = lineItems?.[index];
      return !currentItem || item.qty !== currentItem.qty || item.rate !== currentItem.rate;
    });

    if (hasChanged) {
      form.setValue('line_items', updatedLineItems, { shouldValidate: false });
    }
  }, [lineItems, form]);

  const calculateSubtotal = () => {
    return (lineItems ?? []).reduce((sum, item) => sum + item.amount, 0);
  };

  const subtotal = calculateSubtotal();
  const total: number = subtotal;

  // Function to create invoice
  async function createInvoice(newInvoice: any) {
    const { data, error } = await supabase.from(TABLES.INVOICE).insert(newInvoice).select();
    if (error) throw error;
    return data;
  }

  // Function to create invoice line items
  async function createInvoiceLineItems(invoiceLineItems: any) {
    const { data, error } = await supabase
      .from(TABLES.INVOICE_LINE_SERVICE)
      .insert(invoiceLineItems);
    if (error) {
      console.error('Error creating invoice line items', error.message);
      throw error;
    }
    return data;
  }

  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['totalPaidInvoices'] });
      queryClient.invalidateQueries({ queryKey: ['totalPendingInvoices'] });
      queryClient.invalidateQueries({ queryKey: ['totalOverdueInvoices'] });
    }
  });

  const invoiceLineItemMutation = useMutation({
    mutationFn: createInvoiceLineItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoiceLineItems'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  const onSubmit = async (values: z.infer<typeof addInvoiceFormSchema>) => {
    const { line_items, ...invoice } = values;
    const updatedInvoice = {
      ...invoice,
      total: total,
      subtotal: subtotal,
      amount_due: total,
      invoice_date: values.invoice_date.toISOString().split('T')[0],
      issue_date: values.issue_date.toISOString().split('T')[0],
      due_date: values.due_date.toISOString().split('T')[0],
      invoice_number: values.invoice_number || nextInvoiceNumber
    };

    const updatedLineItems = line_items?.map((item) => ({
      ...item,
      invoice_id: updatedInvoice.invoice_number,
      service_id: values.service_type_id,
      amount: item.amount, // Use the manually entered amount
      rate: 0 // Always 0 for fixed pricing
    }));

    console.log('Creating invoice:', updatedInvoice);
    console.log('Creating line items:', updatedLineItems);

    try {
      await invoiceMutation.mutateAsync(updatedInvoice);
      if (updatedLineItems) {
        await invoiceLineItemMutation.mutateAsync(updatedLineItems);
      }

      form.reset();
      if (setOpen) {
        setOpen(false);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
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

      alert('Failed to create invoice: ' + errorMessage);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                name="invoice_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Invoice #</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full"
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        placeholder={String(nextInvoiceNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice_status_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value && field.value > 0 ? String(field.value) : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        avoidCollisions={true}
                        position="popper">
                        <DefaultSelectDataItems data={invoiceStatuses || []} />
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
                name="invoice_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Invoice Date</FormLabel>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Due Date</FormLabel>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
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
              name="service_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Service</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value && field.value > 0 ? String(field.value) : ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      avoidCollisions={true}
                      position="popper">
                      <DefaultSelectDataItems data={roofingServices || []} />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Line items section */}
            <div className="flex flex-col py-2 gap-6">
              <Label>Line Items</Label>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`line_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter item description"
                            value={field.value || ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.qty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              value={field.value || 1}
                              onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`line_items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate (Disabled)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value="Fixed Pricing"
                              disabled
                              className="bg-gray-100 dark:bg-gray-700 opacity-50 text-center"
                              placeholder="Fixed rate (future feature)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`line_items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow typing numbers and decimal points
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  field.onChange(value === '' ? 0 : Number(value) || 0);
                                }
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              placeholder="Enter fixed amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant={'secondary'}
                onClick={() =>
                  append({
                    description: '',
                    qty: 1,
                    rate: 0,
                    amount: 0,
                    sq_ft: 0,
                    fixed_item: true
                  })
                }>
                + Add Line Item
              </Button>
            </div>

            {/* Totals section */}
            <div className="w-full mx-auto pt-2 px-6">
              <div className="w-full flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${formatMoneyValue(subtotal)}</span>
                </div>
              </div>
            </div>

            <div className="w-full mx-auto py-4">
              <div className="w-full bg-blue-500 h-[50px] rounded-xl">
                <div className="flex justify-between items-center text-white px-6 py-3">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">${formatMoneyValue(total)}</span>
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
                switchValue={billToSwitch}
                setSwitchValue={setBillToSwitch}
              />
              {billToSwitch && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name="bill_to_street_address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter billing street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bill_to_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bill_to_state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="TX" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bill_to_zipcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zipcode</FormLabel>
                        <FormControl>
                          <Input placeholder="77076" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  name="private_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Notes (Internal)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter internal notes here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                  name="sqft_measurement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Footage Measurement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter measurement details..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  control={form.control}
                  name="cust_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter note visible to customer..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <SheetFooter className="pt-4 gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={invoiceMutation.isLoading || invoiceLineItemMutation.isLoading}>
                {invoiceMutation.isLoading || invoiceLineItemMutation.isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Create Invoice'
                )}
              </Button>
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
