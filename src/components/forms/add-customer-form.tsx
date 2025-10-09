import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCustomerFormSchema } from '../../validations/customer-form-validations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/use-customer-types';
import { SheetClose, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { formatPhoneNumber } from '../../lib/utils';
import listOfUSStates from '../../data/state_titlecase.json';
import { useCreateCustomer } from '../../hooks/useAPI/use-customer';
import DefaultSelectDataItems from '../select-data-items';
import ButtonLoading from '../button-states';
import { Avatar, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  setOpen?: any;
};

export default function AddCustomerForm({ setOpen }: Props) {
  const {
    data: customerTypes,
    isLoading: customerTypesLoading,
    error: customerTypesError
  } = useFetchAllCustomerTypes();
  const { mutate: addCustomerMutation, isLoading: isAddCustomerMutationLoading } =
    useCreateCustomer(toast, setOpen);

  React.useEffect(() => {
    console.log('Customer Types Data:', customerTypes);
    console.log('Customer Types Loading:', customerTypesLoading);
    console.log('Customer Types Error:', customerTypesError);
  }, [customerTypes, customerTypesLoading, customerTypesError]);

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
    <div className="w-full mb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <div className="space-y-2 my-4">
            <FormLabel>Choose an avatar</FormLabel>
            <div className="grid w-full grid-cols-6 grid-flow-row gap-2">
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/1627.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/1949.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/2529.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/2738.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/2821.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/3201.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/3359.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/3379.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/3552.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/4122.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/4314.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/4937.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/5186.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/5228.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/5372.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/5506.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/5696.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6287.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6367.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6437.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6474.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6643.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/6775.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7016.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7263.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7474.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7644.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7684.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/7924.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/8145.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/8603.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/9519.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/9575.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/9811.png?raw=true" />
              </Avatar>
              <Avatar className="border w-[60px] h-[60px] mx-auto p-[2px]">
                <AvatarImage src="https://github.com/alohe/memojis/blob/main/png/9933.png?raw=true" />
              </Avatar>
            </div>
          </div> */}
          <div className="space-y-4 h-full px-4 pb-6">
            <FormField
              control={form.control}
              name="customer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={customerTypesLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            customerTypesLoading
                              ? 'Loading customer types...'
                              : customerTypesError
                                ? 'Error loading customer types'
                                : 'Select the type of customer'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <DefaultSelectDataItems
                      data={customerTypes}
                      valueKey="id"
                      labelKey="name"
                      emptyMessage={
                        customerTypesError
                          ? `Error: ${customerTypesError}`
                          : 'No customer types available'
                      }
                    />
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
