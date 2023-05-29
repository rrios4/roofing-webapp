import React from 'react';
import { Avatar, Badge, Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const columnHelper = createColumnHelper();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

export const customerColumns = [
  columnHelper.accessor('customer', {
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
    }
  }),
  columnHelper.accessor('customerType', {
    cell: ({ row }) => {
      const customer = row.original;
      if (customer.customer_type.name === 'Residential') {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="blue">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'blue.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {customer.customer_type.name}
              </Text>
            </Flex>
          </Badge>
        );
      } else if (customer.customer_type.name === 'Commercial') {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="green">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'green.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {customer.customer_type.name}
              </Text>
            </Flex>
          </Badge>
        );
      } else {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="gray">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'gray.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {customer.customer_type.name}
              </Text>
            </Flex>
          </Badge>
        );
      }
    },
    header: () => <Text>Type</Text>
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
  columnHelper.accessor('createdAt', {
    cell: ({ row }) => {
      const customer = row.original;
      return <Text>{new Date(customer.created_at).toLocaleDateString('en-us', options)}</Text>;
    },
    header: () => <Text>Registered Since</Text>
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
