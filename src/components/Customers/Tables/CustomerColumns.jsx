import React from 'react';
// import { Avatar, Box, Button, div, Text, useColorModeValue } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { abbreviateName, arrayOfMemojiFileNames } from '../../../lib/utils';
import { Button } from '../../ui/button';
import DefaultStatusBadge from '../../status-badges.tsx';

const columnHelper = createColumnHelper();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

export const customerColumns = [
  columnHelper.accessor(
    (row) =>
      `${row.first_name} ${row.last_name} ${row.email} ${row.street_address} ${row.city} ${row.zipcode} ${row.phone_number}`,
    {
      id: 'customer',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex gap-4">
            <div></div>
            <Avatar className="border">
              <AvatarImage
                className="p-[0px]"
                src={`https://raw.githubusercontent.com/alohe/memojis/main/png/${
                  arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
                }`}
              />
              <AvatarFallback className="w-[60px] h-[60px]">
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
            className="py-0"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Customer <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    }
  ),
  columnHelper.accessor('customer_type_id', {
    cell: ({ row }) => {
      const customer = row.original;
      if (customer.customer_type.name === 'Residential') {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="blue" />;
      } else if (customer.customer_type.name === 'Commercial') {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="green" />;
      } else {
        return <DefaultStatusBadge title={customer.customer_type.name} variant="secondary" />;
      }
    },
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        className="py-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Type <ArrowUpDown size={'15px'} className="ml-2 h-4 w-4" />
      </Button>
    )
  }),
  columnHelper.accessor('address', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div
          className="flex gap-1 font-[400] text-[14px] cursor-pointer hover:text-blue-500"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`
            )
          }>
          <p>{customer.street_address}</p>
          <p>{customer.city},</p>
          <p>{customer.state}</p>
          <p>{customer.zipcode}</p>
        </div>
      );
    },
    header: () => <p>Address</p>
  }),
  columnHelper.accessor('phone_number', {
    cell: ({ row }) => {
      const customer = row.original;
      return <p className="font-[400] text-[14px]">{customer.phone_number}</p>;
    },
    header: () => <p>Phone Number</p>
  }),
  columnHelper.accessor('created_at', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <p className="text-[14px]">
          {new Date(customer.created_at).toLocaleDateString('en-us', options)}
        </p>
      );
    },
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Registered Since <ArrowUpDown className="ml-2 h-4 w-4" size={'15px'} />
      </Button>
    )
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }) => {
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
