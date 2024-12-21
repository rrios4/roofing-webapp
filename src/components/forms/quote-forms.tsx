import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addQuoteFormSchema } from '../../validations/quote-form-validations';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SearchCustomerCombobox from '../customer-combobox';
import { useFetchCustomers } from '../../hooks/useAPI/useCustomers';
import {
  CalendarIcon,
  MapIcon,
  RulerIcon,
  StickyNoteIcon,
  TrashIcon,
  User2Icon
} from 'lucide-react';
import DefaultSwitchCard, { SwtichCardTwo } from '../switch-card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { SheetClose, SheetFooter } from '../ui/sheet';
import { useFetchAllServices } from '../../hooks/useAPI/useServices';
import DefaultSelectDataItems from '../select-data-items';
import { useQuoteStatuses } from '../../hooks/useAPI/useQuoteStatuses';
import { useFetchQuotes } from '../../hooks/useAPI/useQuotes';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  setOpen: any;
};

const formSwitches = [
  {
    title: 'Custom Address',
    description: 'Manual input for address',
    icon: <MapIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'General Notes',
    description: 'To jot down general info',
    icon: <StickyNoteIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Measurements Note',
    description: 'To write roof measurement',
    icon: <RulerIcon className="w-5 h-5 my-auto mx-auto" />
  },
  {
    title: 'Customer Note',
    description: 'Write a note to customer',
    icon: <User2Icon className="w-5 h-5 my-auto mx-auto" />
  }
];

export default function AddQuoteForm({ setOpen }: Props) {
  const { quotes } = useFetchQuotes();
  const [nextQuoteNumber, setNextQuoteNumber] = React.useState(0);
  const { customers } = useFetchCustomers();
  const {
    data: roofingServices,
    isLoading: isRoofingServices,
    isError: isRoofingError
  } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();
  const [item, setItem] = React.useState([
    {
      id: uuidv4(),
      description: '',
      qty: 1,
      amount: 0
    }
  ]);

  const [customAddressSwitch, setCustomAddressSwitch] = React.useState(false);

  React.useEffect(() => {
    calculateNextQuoteNumber(quotes);
  }, []);

  const form = useForm<z.infer<typeof addQuoteFormSchema>>({
    resolver: zodResolver(addQuoteFormSchema),
    defaultValues: {
      quote_number: nextQuoteNumber === 0 ? 1 : nextQuoteNumber
    }
  });

  async function calculateNextQuoteNumber(object: any) {
    if (object.length === 0) {
      setNextQuoteNumber(1);
    } else if (object.lenght > 0) {
      const calculatedNextQuoteNumber =
        // eslint-disable-next-line no-unsafe-optional-chaining
        Math.max(...object?.map((item: any) => item.quote_number)) + 1;
      setNextQuoteNumber(calculatedNextQuoteNumber);
    }
  }

  function onSubmit(values: z.infer<typeof addQuoteFormSchema>) {
    console.log(values);
  }

  function onDelete(id: any) {
    setItem((prevState) => prevState.filter((el) => el.id !== id));
  }

  function handleOnChange(e: React.ReactEventHandler, id: any) {
    const data = [...item];
    const foundData = data.find((el) => el.id === id);

    // if (e.target.name === 'qty' || 'amount') {
    //   foundData[e.target.name] = e.target.value;
    //   foundData['amount'] = (
    //     Number(foundData?.qty) *
    //   )
    // }
    // foundData[e.target.name] = e.target.value;
    setItem(data);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 h-full px-4 pb-6">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Search for customer</FormLabel>
                  <SearchCustomerCombobox data={customers} form={form} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="quote_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quote #</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quote_status_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ? field.value.toString() : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status for quote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* {customerTypes?.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                          <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
                            {item.name}
                          </SelectItem>
                        </React.Fragment>
                      ))} */}
                        <DefaultSelectDataItems data={quoteStatuses} />
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-6 w-full">
              <FormField
                control={form.control}
                name="quote_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quote date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
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
                        />
                      </PopoverContent>
                    </Popover>
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
                  <FormLabel>Select Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? field.value.toString() : ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a roofing service..." />
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
            <div className="flex flex-col py-2 gap-6">
              <Label>Line Items</Label>
              {item.map((itemDetails, index) => (
                <React.Fragment key={index}>
                  <div className="grid w-full grid-cols-8 grid-flow-row gap-4">
                    <FormItem className="col-span-6 sm:col-span-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" />
                      </FormControl>
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
                        <Input type="number" disabled />
                      </FormControl>
                    </FormItem>
                    <FormItem className="col-span-3 sm:col-span-2">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" />
                      </FormControl>
                    </FormItem>
                    <div className="sm:col-span-1 mx-auto mt-auto">
                      <Button
                        type="button"
                        variant={'secondary'}
                        onClick={() => onDelete(itemDetails.id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => {
                  setItem((state) => [
                    ...state,
                    {
                      id: uuidv4(),
                      description: '',
                      qty: 1,
                      amount: 0
                    }
                  ]);
                }}>
                + Add Line Item
              </Button>
            </div>

            {/* <div className="grid grid-flow-row grid-cols-2 gap-2 py-4">
                {formSwitches.map((item, index) => (
                  <React.Fragment key={index}>
                    <DefaultSwitchCard
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                    />
                  </React.Fragment>
                ))}
              </div> */}

            {/* Optional  */}
            <div className="flex flex-col gap-4 pt-2">
              <Label>Extra Options</Label>
              {formSwitches.map((item, index) => (
                <React.Fragment key={index}>
                  <SwtichCardTwo
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    switchValue={customAddressSwitch}
                    setSwitchValue={setCustomAddressSwitch}
                  />
                  {customAddressSwitch && (
                    <>
                      <p>Test render of form fields</p>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>

            <SheetFooter className="pt-8 gap-2">
              <SheetClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </SheetClose>
              {/* {isAddCustomerMutationLoading ? (
                <ButtonLoading variant="primary" />
              ) : (
                <Button variant={'primary'} type="submit">
                  Save changes
                </Button>
              )} */}

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
