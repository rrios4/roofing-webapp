import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addRequestFormSchema } from '../../validations/inbox-form-validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn, formatPhoneNumber } from '../../lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ClipboardTypeIcon, FormInput, MapPinIcon, UserIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useFetchAllQRStatuses } from '../../hooks/useAPI/use-qr-status';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/use-customer-types';
import DefaultSelectDataItems from '../select-data-items';
import { useFetchAllServices } from '../../hooks/useAPI/use-services';
import { Input } from '../ui/input';
import listOfUSStates from '../../data/state_titlecase.json';
import { SheetClose, SheetFooter } from '../ui/sheet';
import { toast } from '../ui/use-toast';
import { useCreateNewQuoteRequest } from '../../hooks/useAPI/use-qr';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  setOpen: any;
};

export default function AddLeadRequestForm({ setOpen }: Props) {
  const { data: qrStatuses, isLoading: isQRStatusesLoading } = useFetchAllQRStatuses();
  const { data: customerTypes, isLoading: isCustomerTypesLoading } = useFetchAllCustomerTypes();
  const { data: servicesData, isLoading: isServicesDataLoading } = useFetchAllServices();
  const { mutate: addNewRequestMutation, isLoading: isAddNewRequestLoading } =
    useCreateNewQuoteRequest(toast, setOpen);
  const form = useForm<z.infer<typeof addRequestFormSchema>>({
    resolver: zodResolver(addRequestFormSchema)
  });

  function onSubmit(values: z.infer<typeof addRequestFormSchema>) {
    console.log(values);
    addNewRequestMutation(values);
  }
  return (
    <div className="w-full my-4">
      <ScrollArea className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex gap-2">
                <ClipboardTypeIcon className="w-4 h-4 my-auto text-blue-900 dark:text-blue-300" />
                {/* <UserIcon className="w-4 h-4 my-auto text-blue-900 dark:text-blue-300" /> */}
                <p className="font-[600] text-blue-500 dark:text-blue-300">Request</p>
              </div>
              <div className="flex gap-6 w-full">
                <FormField
                  control={form.control}
                  name="est_request_status_id"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request status" />
                          </SelectTrigger>
                        </FormControl>
                        <DefaultSelectDataItems data={qrStatuses} />
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requested_date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Desired date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}>
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 text-start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-6 w-full">
                <FormField
                  control={form.control}
                  name="customer_typeID"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Type of Customer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request status" />
                          </SelectTrigger>
                        </FormControl>
                        <DefaultSelectDataItems data={customerTypes} />
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="service_type_id"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request status" />
                          </SelectTrigger>
                        </FormControl>
                        <DefaultSelectDataItems data={servicesData} />
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <UserIcon className="w-4 h-4 my-auto text-blue-900 dark:text-blue-300" />
                <p className="font-[600] text-blue-500 dark:text-blue-300">Client</p>
              </div>
              <div className="flex gap-6 w-full">
                <FormField
                  control={form.control}
                  name="firstName"
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
                  name="lastName"
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
              <div className="flex gap-2">
                <MapPinIcon className="w-4 h-4 my-auto text-blue-900 dark:text-blue-300" />
                <p className="font-[600] text-blue-500 dark:text-blue-300">Location</p>
              </div>
              <FormField
                control={form.control}
                name="streetAddress"
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
                <Button variant={'primary'} type="submit">
                  Save changes
                </Button>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
