import React, { useState } from 'react';
import DefaultSelectDataItems from '../select-data-items';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateCustomerFormSchema } from '../../validations/customer-form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { formatPhoneNumber } from '../../lib/utils';
import listOfUSStates from '../../data/state_titlecase.json';
import { SheetClose, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import ButtonLoading from '../button-states';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/use-customer-types';
import { useUpdateCustomer } from '../../hooks/useAPI/use-customer';
import { toast } from '../ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type EditCustomerFormProps = {
  customerData: any;
};

function EditCustomerForm({ customerData }: EditCustomerFormProps) {
  const { data: customerTypes } = useFetchAllCustomerTypes();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateCustomerFormSchema>>({
    resolver: zodResolver(updateCustomerFormSchema),
    defaultValues: {
      id: customerData.id.toString(),
      customer_type: customerData.customer_type_id.toString(),
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      email: customerData.email,
      phone_number: customerData.phone_number,
      street_address: customerData.street_address,
      city: customerData.city,
      state: customerData.state,
      zipcode: customerData.zipcode
    }
  });

  const {
    mutate: mutateUpdateCustomer,
    isLoading,
    isError
  } = useUpdateCustomer(toast, customerData?.id.toString());

  async function onSubmit(values: z.infer<typeof updateCustomerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { customer_type, ...rest } = values;
    const updatedValues = { ...rest, customer_type_id: parseInt(customer_type) };
    // console.log(updatedValues);
    // console.log(values);
    mutateUpdateCustomer(updatedValues);
    form.reset(updatedValues);
  }

  return (
    <div className="w-full mb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 h-full px-4 pb-6">
            <FormField
              control={form.control}
              name="customer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of customer" />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems data={customerTypes} />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="w-full"
                      onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select US state" />
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
                <FormItem className="w-full">
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input {...field} type="numeric" pattern="[0-9]*" inputMode="numeric" />
                  </FormControl>
                </FormItem>
              )}
            />
            <SheetFooter className="pt-8 gap-2">
              <SheetClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </SheetClose>
              {/*{isAddCustomerMutationLoading ? (*/}
              {/*  <ButtonLoading variant="primary" />*/}
              {/*) : (*/}
              {/*  <Button variant={'primary'} type="submit">*/}
              {/*    Save changes*/}
              {/*  </Button>*/}
              {/*)}*/}

              <SheetClose asChild>
                <Button variant={'primary'} type={'submit'}>
                  Save changes
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditCustomerForm;
