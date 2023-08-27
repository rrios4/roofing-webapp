import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addRequestFormSchema } from '../validations/inbox-form-validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ClipboardTypeIcon, FormInput, UserIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { useFetchAllQRStatuses } from '../hooks/useAPI/useQRStatuses';
import { useFetchAllCustomerTypes } from '../hooks/useAPI/useCustomerTypes';
import { useFetchAllServices } from '../hooks/useAPI/useServices';
import { Input } from './ui/input';

type Props = {};

export default function AddLeadRequestForm({}: Props) {
  const { data: qrStatuses, isLoading: isQRStatusesLoading } = useFetchAllQRStatuses();
  const { data: customerTypes, isLoading: isCustomerTypesLoading } = useFetchAllCustomerTypes();
  const { data: servicesData, isLoading: isServicesDataLoading } = useFetchAllServices();
  const form = useForm<z.infer<typeof addRequestFormSchema>>({
    resolver: zodResolver(addRequestFormSchema)
  });

  function onSubmit(values: z.infer<typeof addRequestFormSchema>) {
    console.log(values);
  }
  return (
    <div className="w-full my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <ClipboardTypeIcon className="w-4 h-4 my-auto"/>
              {/* <UserIcon className="w-4 h-4 my-auto" /> */}
              <p className="font-[700]">Request</p>
            </div>
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qrStatuses?.map((item: any, index: number) => (
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
              <FormField
                control={form.control}
                name="desired_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Desired date</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 text-start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                          initialFocus
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
                name="customer_type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Type of Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request status" />
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
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servicesData?.map((item: any, index: number) => (
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
            </div>
            <div className="flex gap-2">
              <UserIcon className="w-4 h-4 my-auto" />
              <p className="font-[700]">Client</p>
            </div>
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
          </div>
        </form>
      </Form>
    </div>
  );
}
