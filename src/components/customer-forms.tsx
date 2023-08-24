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
import { MapPinIcon, UserIcon } from 'lucide-react';
import { Separator } from './ui/separator';

type Props = {};

export default function AddCustomerForm({}: Props) {
  const { data: customerTypes } = useFetchAllCustomerTypes();
  React.useEffect(() => {
    console.log(customerTypes);
  }, []);
  // Define form
  const form = useForm<z.infer<typeof addCustomerFormSchema>>({
    resolver: zodResolver(addCustomerFormSchema)
    // defaultValues: {
    //   first_name: '',
    //   last_name: '',
    //   email: '',
    //   phone_number: '',
    //   street_address: '',
    //   customerType: 1,
    //   city: '',
    //   state: '',
    //   zipcode: ''
    // }
  });
  // Define submit handler
  function onSubmit(values: z.infer<typeof addCustomerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerType"
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
                  <Input {...field} className="w-full" />
                </FormControl>
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
                  <Input {...field} className="w-full" />
                </FormControl>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          <SheetFooter>
            <SheetClose asChild>
              <Button variant={'secondary'}>Cancel</Button>
            </SheetClose>
            <Button variant={'primary'}>Save changes</Button>
            {/* <SheetClose>
              <Button variant={'primary'}>Save changes</Button>
            </SheetClose> */}
          </SheetFooter>
        </form>
      </Form>
    </div>
  );
}
