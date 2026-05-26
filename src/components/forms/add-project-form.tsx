import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue } from '../ui/select';
import DefaultSelectDataItems from '../select-data-items';
import { AddressAutocomplete } from '../common/address-autocomplete';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/use-customer';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import {
  useFetchProjectSources,
  useFetchNextProjectNumber,
  useFetchProjectTypes,
  useFetchProjectStatuses,
  useCreateProject
} from '../../hooks/useAPI/use-projects';
import { ChevronDownIcon, Loader2Icon, MapPinIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const schema = z.object({
  project_number: z.string().optional(),
  street_address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  property_owner_name: z.string().optional(),
  customer: z.number().nullable().optional(),
  service: z.number().nullable().optional(),
  source_id: z.number().nullable().optional(),
  project_type_id: z.number().nullable().optional(),
  project_status_id: z.number().nullable().optional(),
  estimated_value: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

type Props = {
  setOpen?: (open: boolean) => void;
  onSuccess?: () => void;
  defaultProjectNumber?: number;
  defaultProjectStatusId?: number;
};

export default function AddProjectForm({ setOpen, defaultProjectNumber, defaultProjectStatusId }: Props) {
  const { customers } = useFetchCustomers();
  const { data: services } = useFetchAllServices();
  const { data: sources } = useFetchProjectSources();
  const { data: types } = useFetchProjectTypes();
  const { data: statuses } = useFetchProjectStatuses();
  const { data: nextNumber } = useFetchNextProjectNumber();
  const { mutate: createProject, isLoading } = useCreateProject(setOpen);

  const [displayAddress, setDisplayAddress] = React.useState('');
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const resolvedNextNumber = defaultProjectNumber ?? nextNumber;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      project_number: '',
      street_address: '',
      customer: null,
      project_status_id: defaultProjectStatusId ?? undefined
    }
  });

  const onSubmit = (values: FormValues) => {
    const legacyAddress = [values.street_address, values.city, values.state, values.zipcode]
      .filter(Boolean)
      .join(', ');

    createProject({
      project_number: parseInt(values.project_number || String(resolvedNextNumber ?? 1), 10),
      address: legacyAddress || values.street_address,
      street_address: values.street_address || null,
      city: values.city || null,
      state: values.state || null,
      zipcode: values.zipcode || null,
      property_owner_name: values.property_owner_name || null,
      customer: values.customer ?? null,
      service: values.service ?? null,
      source_id: values.source_id ?? null,
      project_type_id: values.project_type_id ?? null,
      status: 'Lead',
      project_status_id: values.project_status_id ?? defaultProjectStatusId ?? 1,
      estimated_value: values.estimated_value ? parseFloat(values.estimated_value) : null,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      description: null,
      notes: null,
      sq_ft_measurement: null,
      contract_amount: null,
      is_insurance_claim: false,
      claim_number: null,
      insurance_company: null,
      adjuster_name: null,
      adjuster_phone: null,
      date_of_loss: null,
      permit_required: false,
      permit_number: null,
      permit_issued_date: null,
      drive_folder_id: null,
      drive_folder_name: null,
      drive_folder_url: null,
      quote_request_id: null
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2 pb-8 px-2">
        {/* ── Address ─────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-1.5">
                <FormLabel>Address</FormLabel>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                  Required
                </span>
              </div>
              <FormControl>
                <AddressAutocomplete
                  value={displayAddress}
                  onChange={(v) => {
                    setDisplayAddress(v);
                    field.onChange(v);
                  }}
                  onAddressSelect={(parts) => {
                    const cityStateZip = [
                      parts.city,
                      [parts.state, parts.zipcode].filter(Boolean).join(' ')
                    ]
                      .filter(Boolean)
                      .join(', ');
                    const full = [parts.street_address, cityStateZip].filter(Boolean).join(', ');
                    setDisplayAddress(full);
                    field.onChange(parts.street_address || '');
                    form.setValue('street_address', parts.street_address || '', {
                      shouldValidate: true
                    });
                    form.setValue('city', parts.city || '');
                    form.setValue('state', parts.state || '');
                    form.setValue('zipcode', parts.zipcode || '');
                  }}
                  placeholder="Start typing the job site address..."
                />
              </FormControl>
              {form.watch('city') && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPinIcon className="h-3 w-3" />
                  {[form.watch('city'), form.watch('state'), form.watch('zipcode')]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Customer ─────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-1.5">
                <FormLabel>Customer</FormLabel>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <SearchCustomerCombobox data={customers} form={form} field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Add more details toggle ───────────────────────── */}
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="flex w-full items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDownIcon
            className={cn('h-4 w-4 transition-transform duration-200', detailsOpen && 'rotate-180')}
          />
          <span className="font-medium text-foreground">Add more details</span>
          <span className="ml-auto text-xs">All optional</span>
        </button>

        {/* ── Collapsible details ───────────────────────────── */}
        {detailsOpen && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="project_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                      </FormControl>
                      <DefaultSelectDataItems data={types} />
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project_status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage..." />
                        </SelectTrigger>
                      </FormControl>
                      <DefaultSelectDataItems data={statuses} />
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service..." />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems data={services} />
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                        $
                      </span>
                      <Input {...field} type="number" min="0" step="0.01" className="pl-7" placeholder="0.00" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="property_owner_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Owner Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Owner name (if no customer record yet)" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source..." />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems data={sources} />
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                        #
                      </span>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        className="pl-7"
                        placeholder={resolvedNextNumber?.toString() ?? '—'}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Create Project
        </Button>
      </form>
    </Form>
  );
}
