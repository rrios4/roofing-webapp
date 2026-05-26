import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addQuoteFormSchema } from '../../validations/quote-form-validations';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import {
  FileTextIcon,
  ListIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  StickyNoteIcon,
  TrashIcon,
  UsersIcon
} from 'lucide-react';
import { AddressAutocomplete } from '../common/address-autocomplete';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { formatMoneyValue } from '../../lib/utils';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import DefaultSelectDataItems from '../select-data-items';
import { useQuoteStatuses } from '../../hooks/useAPI/use-quote-status';
import { useFetchQuotes } from '../../hooks/useAPI/use-quotes';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import supabase from '../../lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import AddCustomerForm from './add-customer-form';
import { SectionCard } from '../ui/section-card';
import listOfUSStates from '../../data/state_titlecase.json';

function toDateString(d: Date | undefined): string {
  if (!d) return '';
  return d.toISOString().split('T')[0];
}

function fromDateString(s: string): Date {
  return s ? new Date(s) : new Date();
}

export default function AddQuoteForm() {
  const queryClient = useQueryClient();
  const { quotes } = useFetchQuotes();
  const { customers } = useFetchCustomers();
  const { data: roofingServices, isLoading: isRoofingServicesLoading } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  const [customAddressOpen, setCustomAddressOpen] = useState(false);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof addQuoteFormSchema>>({
    resolver: zodResolver(addQuoteFormSchema),
    defaultValues: {
      quote_number: undefined,
      customer_id: 0,
      service_id: undefined,
      status_id: undefined,
      quote_date: new Date(),
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      line_items: [{ description: '', qty: 1, amount: 0, subtotal: 0 }],
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

  function calculateNextQuoteNumber(qs: { quote_number: number }[] | undefined): number {
    if (!qs || qs.length === 0) return 1;
    return Math.max(...qs.map((q) => q.quote_number)) + 1;
  }

  const nextQuoteNumber = calculateNextQuoteNumber(quotes);
  const lineItems = form.watch('line_items');

  React.useEffect(() => {
    const updated = (lineItems ?? []).map((item) => ({
      ...item,
      subtotal: item.qty * item.amount
    }));
    form.setValue('line_items', updated);
  }, [lineItems, form]);

  const subtotal = (lineItems ?? []).reduce((sum, item) => sum + item.subtotal, 0);
  const total: number = subtotal;

  async function createQuote(newQuote: any) {
    const { data, error } = await supabase.from('quote').insert(newQuote);
    if (error) throw error;
    return data;
  }

  async function createQuoteLineItems(quoteLineItems: any) {
    const { data, error } = await supabase.from('quote_line_item').insert(quoteLineItems);
    if (error) console.error('Error creating quote line items', error.message);
    return data;
  }

  const quoteMutation = useMutation(createQuote);
  const quoteLineItemMutation = useMutation(createQuoteLineItems);

  const onSubmit = async (values: z.infer<typeof addQuoteFormSchema>) => {
    const { line_items, ...quote } = values;
    const updatedQuote = { ...quote, total, subtotal };
    const updatedLineItems = line_items?.map((item) => ({
      ...item,
      quote_id: values.quote_number,
      service_id: values.service_id
    }));

    try {
      await quoteMutation.mutateAsync(updatedQuote);
      await quoteLineItemMutation.mutateAsync(updatedLineItems);
      queryClient.invalidateQueries(['quotes']);
      form.reset();
    } catch (error) {
      alert('Failed to create quote: ' + error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 px-5 py-4">

              {/* ── Customer ─────────────────────────────────── */}
              <SectionCard
                iconBg="bg-violet-500/10"
                iconText="text-violet-600"
                icon={<UsersIcon className="h-3.5 w-3.5" />}
                label="Customer"
              >
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Customer</FormLabel>
                      <div className="flex gap-2 w-full">
                        <div className="flex-1">
                          <SearchCustomerCombobox data={customers} form={form} field={field} />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setCustomerSheetOpen(true)}
                          className="shrink-0 h-10 w-10"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="quote_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote #</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                            }
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
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value && field.value !== 0 ? String(field.value) : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <DefaultSelectDataItems data={quoteStatuses} />
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SectionCard>

              {/* ── Quote Details ────────────────────────────── */}
              <SectionCard
                iconBg="bg-sky-500/10"
                iconText="text-sky-600"
                icon={<FileTextIcon className="h-3.5 w-3.5" />}
                label="Quote Details"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="quote_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={toDateString(field.value)}
                            onChange={(e) => field.onChange(fromDateString(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiration_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={toDateString(field.value)}
                            onChange={(e) => field.onChange(fromDateString(e.target.value))}
                          />
                        </FormControl>
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
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value && field.value !== 0 ? String(field.value) : undefined}
                        disabled={isRoofingServicesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isRoofingServicesLoading ? 'Loading...' : 'Select a roofing service...'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <DefaultSelectDataItems data={roofingServices} />
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SectionCard>

              {/* ── Line Items ───────────────────────────────── */}
              <SectionCard
                iconBg="bg-teal-500/10"
                iconText="text-teal-600"
                icon={<ListIcon className="h-3.5 w-3.5" />}
                label="Line Items"
              >
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-muted/20 p-3 flex flex-col gap-3"
                  >
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Line item description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`line_items.${index}.qty`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? parseFloat(e.target.value) : 1)
                                }
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
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                  $
                                </span>
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  className="pl-7"
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(e) =>
                                    field.onChange(e.target.value ? parseFloat(e.target.value) : '')
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="self-end text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                      >
                        <TrashIcon className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: '', qty: 1, amount: 0, subtotal: 0 })}
                  className="w-full"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                  Add Line Item
                </Button>
              </SectionCard>

              {/* ── Totals ───────────────────────────────────── */}
              <div className="rounded-xl border border-border bg-muted/40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${formatMoneyValue(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${formatMoneyValue(total)}</span>
                </div>
              </div>

              {/* ── Custom Address ───────────────────────────── */}
              <SectionCard
                iconBg="bg-emerald-500/10"
                iconText="text-emerald-600"
                icon={<MapPinIcon className="h-3.5 w-3.5" />}
                label="Custom Address"
                headerClassName={customAddressOpen ? 'bg-emerald-500/10' : 'bg-muted/40'}
                headerRight={
                  <Switch
                    checked={customAddressOpen}
                    onCheckedChange={setCustomAddressOpen}
                  />
                }
              >
                {!customAddressOpen ? (
                  <p className="text-sm text-muted-foreground italic">
                    Enable to add a custom billing address for this quote.
                  </p>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="custom_street_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete
                              value={field.value ?? ''}
                              onChange={field.onChange}
                              onAddressSelect={(parts) => {
                                field.onChange(parts.street_address);
                                form.setValue('custom_city', parts.city, { shouldValidate: true });
                                form.setValue('custom_state', parts.state, { shouldValidate: true });
                                form.setValue('custom_zipcode', parts.zipcode, {
                                  shouldValidate: true
                                });
                              }}
                              placeholder="Start typing a street address..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="custom_city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="City" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="custom_state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <DefaultSelectDataItems
                                  data={listOfUSStates || []}
                                  valueKey="abbreviation"
                                  labelKey="name"
                                />
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="custom_zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="Zip code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </SectionCard>

              {/* ── Notes ────────────────────────────────────── */}
              <SectionCard
                iconBg="bg-muted"
                iconText="text-muted-foreground"
                icon={<StickyNoteIcon className="h-3.5 w-3.5" />}
                label="Notes"
              >
                <FormField
                  control={form.control}
                  name="private_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Note</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Jot down any internal notes here..."
                          className="resize-y min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="public_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Note</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell the customer a custom message..."
                          className="resize-y min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measurement_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement Note</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write down any roof measurements here..."
                          className="resize-y min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SectionCard>

            </div>
          </ScrollArea>

          {/* ── Sticky footer ────────────────────────────────── */}
          <div className="flex-shrink-0 px-5 py-4 border-t bg-card">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Create Quote
            </Button>
          </div>
        </form>
      </Form>

      {/* Add Customer Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-4 border-b">
            <SheetTitle>Add New Customer</SheetTitle>
          </SheetHeader>
          <AddCustomerForm setOpen={setCustomerSheetOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
