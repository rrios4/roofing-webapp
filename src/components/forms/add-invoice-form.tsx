import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addInvoiceFormSchema } from '../../validations/invoice-form-validations';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import {
  CalendarIcon,
  Loader2Icon,
  ListIcon,
  MapPinIcon,
  PlusIcon,
  ReceiptIcon,
  StickyNoteIcon,
  TrashIcon,
  UsersIcon,
  DollarSignIcon,
} from 'lucide-react';
import { AddressAutocomplete } from '../common/address-autocomplete';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import DefaultSelectDataItems from '../select-data-items';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import { Button } from '../ui/button';
import { formatMoneyValue } from '../../lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import AddCustomerForm from './add-customer-form';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/use-invoice-status';
import { useFetchAllInvoices } from '../../hooks/useAPI/use-invoice';
import { ScrollArea } from '../ui/scroll-area';
import { SectionCard } from '../ui/section-card';

type Props = {
  setOpen?: any;
  onSuccess?: () => void;
};

function toDateString(d: Date | undefined): string {
  if (!d) return '';
  return d.toISOString().split('T')[0];
}

function fromDateString(s: string): Date {
  return s ? new Date(s) : new Date();
}

export default function AddInvoiceForm({ setOpen, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const { data: invoices } = useFetchAllInvoices();
  const { customers } = useFetchCustomers();
  const { data: roofingServices } = useFetchAllServices();
  const { data: invoiceStatuses } = useFetchAllInvoiceStatuses();

  const [billToOpen, setBillToOpen] = useState(false);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);

  function calculateNextInvoiceNumber(invoices: { invoice_number: number }[] | undefined): number {
    if (!invoices || invoices.length === 0) return 1;
    return Math.max(...invoices.map((i) => i.invoice_number)) + 1;
  }
  const nextInvoiceNumber = calculateNextInvoiceNumber(invoices);

  const form = useForm<z.infer<typeof addInvoiceFormSchema>>({
    resolver: zodResolver(addInvoiceFormSchema),
    defaultValues: {
      invoice_number: undefined,
      customer_id: 0,
      service_type_id: 0,
      invoice_status_id: 0,
      invoice_date: new Date(),
      issue_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'line_items' });
  const lineItems = form.watch('line_items');

  useEffect(() => {
    const updatedLineItems = (lineItems ?? []).map((item) => ({
      ...item,
      qty: item.qty || 1,
      rate: 0,
      amount: item.amount || 0
    }));
    const hasChanged = updatedLineItems.some((item, i) => {
      const cur = lineItems?.[i];
      return !cur || item.qty !== cur.qty || item.rate !== cur.rate;
    });
    if (hasChanged) form.setValue('line_items', updatedLineItems, { shouldValidate: false });
  }, [lineItems, form]);

  const subtotal = (lineItems ?? []).reduce((s, item) => s + item.amount, 0);
  const total = subtotal;

  async function createInvoice(newInvoice: any) {
    const { data, error } = await supabase.from(TABLES.INVOICE).insert(newInvoice).select();
    if (error) throw error;
    return data;
  }

  async function createInvoiceLineItems(invoiceLineItems: any) {
    const { data, error } = await supabase.from(TABLES.INVOICE_LINE_SERVICE).insert(invoiceLineItems);
    if (error) throw error;
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
      total,
      subtotal,
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
      amount: item.amount,
      rate: 0
    }));
    try {
      await invoiceMutation.mutateAsync(updatedInvoice);
      if (updatedLineItems) await invoiceLineItemMutation.mutateAsync(updatedLineItems);
      form.reset();
      if (setOpen) setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      alert('Failed to create invoice: ' + (error?.message ?? JSON.stringify(error)));
    }
  };

  const isLoading = invoiceMutation.isLoading || invoiceLineItemMutation.isLoading;

  return (
    <>
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
                      <FormItem>
                        <FormLabel>Customer <span className="text-destructive">*</span></FormLabel>
                        <div className="flex gap-2">
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
                      name="invoice_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice #</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
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
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(Number(v))}
                            value={field.value && field.value > 0 ? String(field.value) : ''}
                          >
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <DefaultSelectDataItems data={invoiceStatuses || []} />
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                {/* ── Billing ──────────────────────────────────── */}
                <SectionCard
                  iconBg="bg-sky-500/10"
                  iconText="text-sky-600"
                  icon={<ReceiptIcon className="h-3.5 w-3.5" />}
                  label="Billing"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="invoice_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="h-3 w-3" /> Invoice Date
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={toDateString(field.value)}
                              onChange={(e) => field.onChange(fromDateString(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="h-3 w-3" /> Due Date
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={toDateString(field.value)}
                              onChange={(e) => field.onChange(fromDateString(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="service_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value && field.value > 0 ? String(field.value) : ''}
                        >
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <DefaultSelectDataItems data={roofingServices || []} />
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
                  <div className="flex flex-col gap-3">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border bg-muted/20 p-3 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Item {index + 1}
                          </span>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Item description" {...field} value={field.value || ''} />
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
                                    min="1"
                                    value={field.value || 1}
                                    onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                                  />
                                </FormControl>
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
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                                      $
                                    </span>
                                    <Input
                                      type="text"
                                      className="pl-7"
                                      placeholder="0.00"
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === '' || /^\d*\.?\d*$/.test(v))
                                          field.onChange(v === '' ? 0 : Number(v) || 0);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ description: '', qty: 1, rate: 0, amount: 0, sq_ft: 0, fixed_item: true })}
                    className="w-full mt-1"
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

                {/* ── Bill To Address ──────────────────────────── */}
                <SectionCard
                  iconBg="bg-emerald-500/10"
                  iconText="text-emerald-600"
                  icon={<MapPinIcon className="h-3.5 w-3.5" />}
                  label="Bill To Address"
                  headerClassName={billToOpen ? 'bg-emerald-500/10' : 'bg-muted/40'}
                  headerRight={
                    <Switch checked={billToOpen} onCheckedChange={setBillToOpen} />
                  }
                >
                  {billToOpen ? (
                    <>
                      <FormField
                        control={form.control}
                        name="bill_to_street_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <AddressAutocomplete
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onAddressSelect={(parts) => {
                                  field.onChange(parts.street_address);
                                  form.setValue('bill_to_city', parts.city, { shouldValidate: true });
                                  form.setValue('bill_to_state', parts.state, { shouldValidate: true });
                                  form.setValue('bill_to_zipcode', parts.zipcode, { shouldValidate: true });
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
                          name="bill_to_city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl><Input placeholder="City" {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bill_to_state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl><Input placeholder="TX" maxLength={2} {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="bill_to_zipcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl><Input placeholder="77076" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Toggle on to enter a custom billing address.
                    </p>
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
                        <FormLabel>Internal Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Private notes (not visible on invoice)..." rows={2} />
                        </FormControl>
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
                          <Textarea {...field} placeholder="Note shown on the invoice..." rows={2} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cust_note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Note</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Note to the customer..." rows={2} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sqft_measurement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sq Ft Measurement</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Square footage details..." rows={2} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </SectionCard>

              </div>
            </ScrollArea>

            {/* ── Sticky footer ────────────────────────────────── */}
            <div className="flex-shrink-0 px-5 py-4 border-t bg-card">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Create Invoice
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Add Customer Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-5 pb-4 border-b bg-card flex-shrink-0">
            <SheetTitle>Add New Customer</SheetTitle>
          </SheetHeader>
          <AddCustomerForm setOpen={setCustomerSheetOpen} />
        </SheetContent>
      </Sheet>
    </>
  );
}
