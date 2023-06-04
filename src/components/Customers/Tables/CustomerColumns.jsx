import React from 'react';
import { Avatar, Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';

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
          <Flex gap={4}>
            <Avatar
              name={`${customer.first_name} ${customer.last_name}`}
              w={'40px'}
              h={'40px'}
              bg={useColorModeValue('gray.200', 'gray.600')}
              textColor={useColorModeValue('gray.700', 'gray.200')}
            />
            <Box fontSize={'14px'}>
              <Flex gap={2} fontWeight={'500'}>
                <Text>{customer.first_name}</Text>
                <Text>{customer.last_name}</Text>
              </Flex>
              <Text fontWeight={400}>{customer.email}</Text>
            </Box>
          </Flex>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            py={0}
            fontSize={'14px'}
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Customer
            <Box ml={2} h={4} w={4}>
              <ArrowUpDown size={'15px'} />
            </Box>
          </Button>
        );
      }
    }
  ),
  columnHelper.accessor('customer_type_id', {
    cell: ({ row }) => {
      const customer = row.original;
      if (customer.customer_type.name === 'Residential') {
        return <StatusBadge badgeText={customer.customer_type.name} colorScheme={'blue'} />;
      } else if (customer.customer_type.name === 'Commercial') {
        return <StatusBadge badgeText={customer.customer_type.name} colorScheme={'green'} />;
      } else {
        return <StatusBadge badgeText={customer.customer_type.name} colorScheme={'gray'} />;
      }
    },
    header: ({ column }) => (
      <Button
        py={0}
        fontSize={'14px'}
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Type
        <Box ml={2} h={4} w={4}>
          <ArrowUpDown size={'15px'} />
        </Box>
      </Button>
    )
  }),
  columnHelper.accessor('address', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Flex
          gap={1}
          fontWeight={400}
          fontSize={'14px'}
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`
            )
          }
          cursor={'pointer'}
          _hover={{ textColor: 'blue.500' }}>
          <Text>{customer.street_address}</Text>
          <Text>{customer.city},</Text>
          <Text>{customer.state}</Text>
          <Text>{customer.zipcode}</Text>
        </Flex>
      );
    }
  }),
  columnHelper.accessor('phone_number', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Text fontWeight={400} fontSize={'14px'}>
          {customer.phone_number}
        </Text>
      );
    },
    header: () => <Text>Phone Number</Text>
  }),
  columnHelper.accessor('created_at', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Text fontSize={'14px'}>
          {new Date(customer.created_at).toLocaleDateString('en-us', options)}
        </Text>
      );
    },
    header: ({ column }) => (
      <Button
        py={0}
        fontSize={'14px'}
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Registered Since
        <Box ml={2} h={4} w={4}>
          <ArrowUpDown size={'15px'} />
        </Box>
      </Button>
    )
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Link to={`/customers/${customer.id}`}>
          <Button px={0}>
            <ChevronRight size={'15px'} />
          </Button>
        </Link>
      );
    }
  })
];

export default customerColumns;
