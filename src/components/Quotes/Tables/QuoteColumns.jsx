import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ChevronRight, Edit, Pencil, Trash } from 'lucide-react';
import { formatDate, formatMoneyValue, formatNumber, monthDDYYYYFormat } from '../../../utils';
import ConnectedQuoteDeleteAlertDialog from '../../ui/Alerts/ConnectedAlerts/ConnectedQuoteDeleteAlertDialog';
import EditQuoteForm from '../Forms/EditQuoteForm';

const columnHelper = createColumnHelper();
// const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

export const quoteColumns = [
  columnHelper.accessor('quote_number', {
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Text
          fontWeight={500}
          fontSize={'14px'}
          textColor={useColorModeValue('gray.900', 'gray.200')}>
          #{formatNumber(quote.quote_number)}
        </Text>
      );
    },
    header: () => <Text>Quote</Text>
  }),
  columnHelper.accessor('quote_date', {
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Text fontWeight={400} fontSize={'14px'}>
          {monthDDYYYYFormat(quote.quote_date)}
        </Text>
      );
    },
    header: () => <Text>Date</Text>
  }),
  columnHelper.accessor('status_id', {
    header: () => <Text>Status</Text>,
    cell: ({ row }) => {
      const quote = row.original;
      if (quote.quote_status.name === 'Accepted') {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="green">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'green.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {quote.quote_status.name}
              </Text>
            </Flex>
          </Badge>
        );
      } else if (quote.quote_status.name === 'Pending') {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="yellow">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'yellow.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {quote.quote_status.name}
              </Text>
            </Flex>
          </Badge>
        );
      } else if (quote.quote_status.name === 'Rejected') {
        return (
          <Badge rounded={'full'} py={1} px={2} colorScheme="red">
            <Flex gap={2}>
              <Box w={1} h={1} p={1} bg={'red.500'} rounded={'full'} my={'auto'}></Box>
              <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
                {quote.quote_status.name}
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
                {quote.quote_status.name}
              </Text>
            </Flex>
          </Badge>
        );
      }
    }
  }),
  columnHelper.accessor('service', {
    id: 'service',
    header: () => <Text>Service</Text>,
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Text fontWeight={400} fontSize={'14px'}>
          {quote.services.name}
        </Text>
      );
    }
  }),
  columnHelper.accessor('expiration_date', {
    header: () => <Text>Expiration</Text>,
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Text fontWeight={400} fontSize={'14px'}>
          {monthDDYYYYFormat(quote.expiration_date)}
        </Text>
      );
    }
  }),
  columnHelper.accessor((row) => `${row.customer.first_name}`, {
    id: 'customer',
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Link
          to={`/customers/${quote.customer.id}`}
          _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}>
          <Button variant={'ghost'}>
            <Flex gap={3}>
              <Avatar
                my={'auto'}
                size={'sm'}
                name={`${quote.customer.first_name} ${quote.customer.last_name}`}
                bg={useColorModeValue('gray.200', 'gray.600')}
                textColor={useColorModeValue('gray.700', 'gray.200')}
              />
              <Box fontSize={'14px'}>
                <Flex gap={1} fontWeight={500}>
                  <Text>{quote.customer.first_name}</Text>
                  <Text>{quote.customer.last_name}</Text>
                </Flex>
                <Text fontWeight={400}>{quote.customer.email}</Text>
              </Box>
            </Flex>
          </Button>
        </Link>
      );
    }
  }),
  columnHelper.accessor('total', {
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <Text fontSize={'14px'} fontWeight={400}>
          ${formatMoneyValue(quote.total)}
        </Text>
      );
    }
  }),
  columnHelper.accessor('actions', {
    header: () => <Text>Actions</Text>,
    cell: ({ row }) => {
      const quote = row.original;
      const {
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
        isOpen: isDeleteOpen
      } = useDisclosure();
      const { onOpen: onEditOpen, onClose: onEditClose, isOpen: isEditOpen } = useDisclosure();
      const toast = useToast();

      return (
        <Flex gap={2}>
          <ConnectedQuoteDeleteAlertDialog
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            itemNumber={quote.quote_number}
            toast={toast}
            header={`Delete Quote`}
            entityDescription={`Quote #${formatNumber(quote.quote_number)}`}
            body={`Once you confirm you can't undo this action afterwards. There will be no way to restore the information. 🚨`}
          />
          <EditQuoteForm isOpen={isEditOpen} onClose={onEditClose} quote={quote} />
          <Tooltip label="Edit">
            <Button p={0} onClick={onEditOpen}>
              <Pencil size={'15px'} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete">
            <Button p={0} onClick={onDeleteOpen}>
              <Trash size={'15px'} />
            </Button>
          </Tooltip>
          <Tooltip label="Quote Details">
            <Link to={`/quotes/${quote.quote_number}`}>
              <Button px={0}>
                <ChevronRight size={'15px'} />
              </Button>
            </Link>
          </Tooltip>
        </Flex>
      );
    }
  })
];

export default quoteColumns;
