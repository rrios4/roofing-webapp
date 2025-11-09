import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, ChevronRight, CompassIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { arrayOfMemojiFileNames } from '../../lib/utils';
import { Button } from '../ui/button';
import DefaultStatusBadge from '../status-badges';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import GoogleMapsAddressPreviewPopover from '../google-maps-preview';

type Props = {
  row: any;
};

const columnHelper = createColumnHelper<any>();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

export const customerColumns = [
  columnHelper.accessor(
    (row: any) =>
      `${row.first_name} ${row.last_name} ${row.email} ${row.street_address} ${row.city} ${row.zipcode} ${row.phone_number}`,
    {
      id: 'customer',
      cell: ({ row }: Props) => {
        const customer = row.original;
        return (
          <div className="flex gap-2 sm:gap-3">
            <Avatar className="border w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-700/30 flex-shrink-0">
              <AvatarFallback className="text-xs sm:text-sm font-medium">
                {`${customer.first_name.substring(0, 1)}${customer.last_name.substring(0, 1)}`}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs sm:text-sm min-w-0">
              <div className="flex gap-1 font-semibold text-xs sm:text-sm">
                <p className="truncate">{customer.first_name}</p>
                <p className="truncate">{customer.last_name}</p>
              </div>
              <p className="font-normal text-xs text-muted-foreground truncate">{customer.email}</p>
            </div>
          </div>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            className="py-0 gap-1 sm:gap-2 text-xs sm:text-sm px-0"
            variant={'ghost'}
            size={'sm'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Customer
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3" />
            )}
          </Button>
        );
      }
    }
  ),
  columnHelper.accessor('customer_type_id', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      if (customer.customer_type.name === 'Residential') {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="blue" />;
      } else if (customer.customer_type.name === 'Commercial') {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="green" />;
      } else {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="gray" />;
      }
    },
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        size={'sm'}
        className="px-0 gap-1 sm:gap-2 text-xs sm:text-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Type
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3" />
        )}
      </Button>
    )
  }),
  columnHelper.accessor('address', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      const customerAddress = `${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`;
      return (
        <GoogleMapsAddressPreviewPopover
          streetAddress={customer.street_address}
          city={customer.city}
          state={customer.state}
          zipcode={customer.zipcode}
          addressQuery={customerAddress}
        />
      );
    },
    header: () => (
      <p className="text-xs sm:text-sm font-medium min-w-[200px] sm:min-w-[250px]">Address</p>
    )
  }),
  columnHelper.accessor('phone_number', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <p className="font-normal text-xs sm:text-sm min-w-[120px] sm:min-w-[150px]">
          {customer.phone_number}
        </p>
      );
    },
    header: () => <p className="text-xs sm:text-sm font-medium">Phone</p>
  }),
  columnHelper.accessor('created_at', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      return (
        <p className="text-xs sm:text-sm">
          {/* @ts-ignore */}
          {new Date(customer.created_at).toLocaleDateString('en-us', options)}
        </p>
      );
    },
    header: ({ column }) => (
      <div className="flex gap-2 sm:gap-4 min-w-[140px] sm:min-w-[180px]">
        <Button
          className="gap-1 sm:gap-2 px-0 text-xs sm:text-sm"
          size={'sm'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Registered
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      return (
        <Link to={`/customers/${customer.id}`}>
          <Button variant={'secondary'} size={'sm'} className="h-7 w-7 p-0">
            <ChevronRight size={'14px'} />
          </Button>
        </Link>
      );
    },
    header: () => <p className="text-xs sm:text-sm font-medium">Actions</p>
  })
];

export default customerColumns;
