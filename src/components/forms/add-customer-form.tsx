import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCustomerFormSchema } from '../../validations/customer-form-validations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectTrigger, SelectValue } from '../ui/select';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/use-customer-types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { formatPhoneNumber } from '../../lib/utils';
import listOfUSStates from '../../data/state_titlecase.json';
import { useCreateCustomer } from '../../hooks/useAPI/use-customer';
import DefaultSelectDataItems from '../select-data-items';
import { AddressAutocomplete } from '../common/address-autocomplete';
import { ScrollArea } from '../ui/scroll-area';
import { SectionCard } from '../ui/section-card';
import { Loader2Icon, MapPinIcon, UsersIcon } from 'lucide-react';

type Props = {
  setOpen?: any;
};

export default function AddCustomerForm({ setOpen }: Props) {
  const { data: customerTypes, isLoading: customerTypesLoading } = useFetchAllCustomerTypes();
  const { mutate: addCustomerMutation, isLoading: isAddCustomerMutationLoading } =
    useCreateCustomer(toast, setOpen);

  const form = useForm<z.infer<typeof addCustomerFormSchema>>({
    resolver: zodResolver(addCustomerFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      street_address: '',
      customer_type: '1',
      city: '',
      zipcode: ''
    }
  });

  function onSubmit(values: z.infer<typeof addCustomerFormSchema>) {
    const structuredData = {
      first_name: values.first_name,
      last_name: values.last_name,
      customer_type_id: values.customer_type,
      email: values.email,
      phone_number: values.phone_number === undefined ? '' : values.phone_number,
      street_address: values.street_address === undefined ? '' : values.street_address,
      city: values.city,
      state: values.state,
      zipcode: values.zipcode
    };
    // @ts-ignore
    addCustomerMutation(structuredData);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 px-5 py-4">

              {/* ── Contact Info ─────────────────────────────── */}
              <SectionCard
                iconBg="bg-violet-500/10"
                iconText="text-violet-600"
                icon={<UsersIcon className="h-3.5 w-3.5" />}
                label="Contact Info"
              >
                <FormField
                  control={form.control}
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={customerTypesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                customerTypesLoading
                                  ? 'Loading...'
                                  : 'Select customer type'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <DefaultSelectDataItems
                          data={customerTypes}
                          valueKey="id"
                          labelKey="name"
                        />
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(555) 555-5555"
                          onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SectionCard>

              {/* ── Address ──────────────────────────────────── */}
              <SectionCard
                iconBg="bg-emerald-500/10"
                iconText="text-emerald-600"
                icon={<MapPinIcon className="h-3.5 w-3.5" />}
                label="Address"
              >
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onAddressSelect={(parts) => {
                            field.onChange(parts.street_address);
                            form.setValue('city', parts.city, { shouldValidate: true });
                            form.setValue('state', parts.state, { shouldValidate: true });
                            form.setValue('zipcode', parts.zipcode, { shouldValidate: true });
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
                    name="city"
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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                          </FormControl>
                          <DefaultSelectDataItems
                            data={listOfUSStates || []}
                            valueKey="abbreviation"
                            labelKey="name"
                          />
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="numeric" pattern="[0-9]*" placeholder="Zip code" />
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
            <Button type="submit" disabled={isAddCustomerMutationLoading} className="w-full">
              {isAddCustomerMutationLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Save Customer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
