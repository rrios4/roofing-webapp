import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCustomerFormSchema } from '../validations/customer-form-validations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFetchAllCustomerTypes } from '../hooks/useAPI/useCustomerTypes';
import { SheetClose, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { formatPhoneNumber } from '../lib/utils';
import listOfUSStates from '../data/state_titlecase.json';
import { useCreateCustomer } from '../hooks/useAPI/useCustomers';
import ButtonLoading from './button-states';

type Props = {
  setOpen?: any;
};

export default function AddCustomerForm({ setOpen }: Props) {
  const { data: customerTypes } = useFetchAllCustomerTypes();
  const { mutate: addCustomerMutation, isLoading: isAddCustomerMutationLoading } =
    useCreateCustomer(toast, setOpen);

  // React.useEffect(() => {
  //   console.log(customerTypes);
  // }, []);

  // Define form
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
  // Define submit handler
  function onSubmit(values: z.infer<typeof addCustomerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
    <div className="w-full my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
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
                    <SelectContent>
                      {customerTypes?.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                          <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
                            {item.name}
                          </SelectItem>
                        </React.Fragment>
                      ))}
                    </SelectContent>
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
                      <SelectContent className="">
                        {listOfUSStates?.map((item: any, index: number) => (
                          <React.Fragment key={index}>
                            <SelectItem value={item.abbreviation} className="hover:cursor-pointer">
                              {item.name}
                            </SelectItem>
                          </React.Fragment>
                        ))}
                      </SelectContent>
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
              {isAddCustomerMutationLoading ? (
                <ButtonLoading variant="primary" />
              ) : (
                <Button variant={'primary'} type="submit">
                  Save changes
                </Button>
              )}

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