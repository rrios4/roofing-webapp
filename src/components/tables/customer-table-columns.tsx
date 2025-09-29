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
          <div className="flex gap-4">
            <div></div>
            <Avatar className="border w-[45px] h-[45px] bg-blue-100 dark:bg-blue-700/30">
              {/*<AvatarImage*/}
              {/*  src={`https://raw.githubusercontent.com/alohe/memojis/main/png/${*/}
              {/*    arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]*/}
              {/*  }`}*/}
              {/*/>*/}
              <AvatarFallback>
                {`${customer.first_name.substring(0, 1)}${customer.last_name.substring(0, 1)}`}
              </AvatarFallback>
            </Avatar>
            <div className="text-[14px]">
              <div className="flex gap-1 font-[600]">
                <p>{customer.first_name}</p>
                <p>{customer.last_name}</p>
              </div>
              <p className="font-[300]">{customer.email}</p>
            </div>
          </div>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            className="py-0 gap-2"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Customer
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3 ml-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3 ml-2" />
            ) : null}
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
        className="px-0 gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Type
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
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
    header: () => <p className="min-w-[300px]">Address</p>
  }),
  columnHelper.accessor('phone_number', {
    cell: ({ row }) => {
      const customer = row.original;
      return <p className="font-[400] text-[14px] min-w-[150px]">{customer.phone_number}</p>;
    },
    header: () => <p>Phone Number</p>
  }),
  columnHelper.accessor('created_at', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      return (
        <p className="text-[14px]">
          {/* @ts-ignore */}
          {new Date(customer.created_at).toLocaleDateString('en-us', options)}
        </p>
      );
    },
    header: ({ column }) => (
      <div className="flex gap-4 min-w-[180px]">
        <Button
          className="gap-2 px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Registered Since
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }: Props) => {
      const customer = row.original;
      return (
        <Link to={`/customers/${customer.id}`}>
          <Button variant={'secondary'}>
            <ChevronRight size={'15px'} />
          </Button>
        </Link>
      );
    },
    header: () => <p>Actions</p>
  })
];

export default customerColumns;
