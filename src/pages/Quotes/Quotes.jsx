import React, { useState } from 'react';
import {
  Box,
  Flex,
  useToast,
  Tooltip,
  Text,
  useDisclosure,
  VStack,
  useColorModeValue,
  Button,
  Avatar
} from '@chakra-ui/react';
import {
  ConnectedQuoteDeleteAlertDialog,
  CreateQuoteForm,
  EditQuoteForm,
  PageHeader,
  QuoteStatCards
} from '../../components';
import { useFetchQuotes, useUpdateQuote } from '../../hooks/useAPI/useQuotes';
import { useQuoteStatuses } from '../../hooks/useAPI/useQuoteStatuses';
import { useFetchAllServices } from '../../hooks/useAPI/useServices';
import { ArrowUpDown, ChevronRight, Pencil, Trash } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { formatMoneyValue, monthDDYYYYFormat, formatNumber } from '../../utils';
import { Link } from 'react-router-dom';
import QuoteFilterBar from '../../components/Quotes/QuoteFilterBar';
import StatusBadge from '../../components/ui/StatusBadge';

function Estimates() {
  // const queryClient = useQueryClient();
  const columnHelper = createColumnHelper();

  // Chakra UI Hooks
  const initialRef = React.useRef();
  const toast = useToast();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Custom React Hooks
  const { quotes, isLoading: quotesLoadingStateIsOn, isError } = useFetchQuotes();
  const { data: services, isLoading: isRoofingServicesLoading } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  // States to manage data
  const [selectedEditQuote, setSelectedEditQuote] = useState({
    id: '',
    quote_number: '',
    status_id: '',
    service_id: '',
    quote_date: '',
    issue_date: '',
    expiration_date: '',
    note: '',
    measurement_note: '',
    cust_note: ''
  });
  const [selectedRowItem, setSelectedRowItem] = useState('');

  const { mutate: mutateUpdateQuote, isLoading: quoteUpdateIsLoading } = useUpdateQuote(toast);
  // const deboundedQuoteSearchTerm = useDebounce(searchQuoteInput, 100);

  const quoteColumns = [
    columnHelper.accessor('quote_number', {
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Text
            align={'center'}
            fontWeight={500}
            fontSize={'14px'}
            textColor={useColorModeValue('gray.900', 'gray.200')}>
            #{formatNumber(quote.quote_number)}
          </Text>
        );
      },
      header: ({ column }) => (
        <Flex w={'full'} justify={'center'}>
          <Button
            px={0}
            fontSize={'14px'}
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Quote
            <Box ml={2} h={4} w={4}>
              <ArrowUpDown size={'15px'} />
            </Box>
          </Button>
        </Flex>
      )
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
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      )
    }),
    columnHelper.accessor('status_id', {
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      ),
      cell: ({ row }) => {
        const quote = row.original;
        if (quote.quote_status.name === 'Accepted') {
          return <StatusBadge badgeText={quote.quote_status.name} colorScheme={'green'} />;
        } else if (quote.quote_status.name === 'Pending') {
          return <StatusBadge badgeText={quote.quote_status.name} colorScheme={'yellow'} />;
        } else if (quote.quote_status.name === 'Rejected') {
          return <StatusBadge badgeText={quote.quote_status.name} colorScheme={'red'} />;
        } else {
          return <StatusBadge badgeText={quote.quote_status.name} colorScheme={'gray'} />;
        }
      }
    }),
    columnHelper.accessor('service', {
      id: 'service',
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Service
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      ),
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
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Expiration
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      ),
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Text fontWeight={400} fontSize={'14px'}>
            {monthDDYYYYFormat(quote.expiration_date)}
          </Text>
        );
      }
    }),
    columnHelper.accessor(
      (row) =>
        `${row.customer.first_name} ${row.customer.last_name} ${row.customer.email} ${row.quote_number} ${row.quote_status.name} ${row.services.name}`,
      {
        id: 'customer',
        cell: ({ row }) => {
          const quote = row.original;
          return (
            <Link
              to={`/customers/${quote.customer.id}`}
              _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}>
              <Button variant={'ghost'} px={1}>
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
        },
        header: ({ column }) => (
          <Button
            px={1}
            fontSize={'14px'}
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Customer
            <Box ml={2} h={4} w={4}>
              <ArrowUpDown size={'15px'} />
            </Box>
          </Button>
        )
      }
    ),
    columnHelper.accessor('total', {
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Text fontSize={'14px'} fontWeight={400}>
            ${formatMoneyValue(quote.total)}
          </Text>
        );
      },
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      )
    }),
    columnHelper.accessor('actions', {
      header: () => <Text>Actions</Text>,
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Flex gap={2}>
            <Tooltip label="Edit">
              <Button p={0} onClick={() => handleEditDrawer(quote)}>
                <Pencil size={'15px'} />
              </Button>
            </Tooltip>
            <Tooltip label="Delete">
              <Button p={0} onClick={() => deleteModalHandler(quote.quote_number)}>
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

  const deleteModalHandler = (quote_number) => {
    setSelectedRowItem(quote_number);
    onDeleteOpen();
  };

  const handleEditDrawer = (quote) => {
    setSelectedEditQuote({
      id: quote.id,
      quote_number: quote.quote_number,
      status_id: quote.status_id,
      service_id: quote.service_id,
      quote_date: quote.quote_date ? quote.quote_date : '',
      issue_date: quote.issue_date ? quote.issue_date : '',
      expiration_date: quote.expiration_date ? quote.expiration_date : '',
      private_note: quote.private_note,
      measurement_note: quote.measurement_note,
      public_note: quote.public_note
    });
    onEditOpen();
  };

  const handleEditOnChange = (e) => {
    setSelectedEditQuote({ ...selectedEditQuote, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    mutateUpdateQuote(selectedEditQuote);
    onEditClose();
    setSelectedEditQuote({
      id: '',
      quote_number: '',
      status_id: '',
      service_id: '',
      quote_date: '',
      issue_date: '',
      expiration_date: '',
      private_note: '',
      measurement_note: '',
      public_note: ''
    });
  };

  return (
    <>
      <CreateQuoteForm
        initialRef={initialRef}
        isOpen={isNewOpen}
        onClose={onNewClose}
        services={services}
        quoteStatuses={quoteStatuses}
        toast={toast}
        data={quotes}
      />
      <ConnectedQuoteDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        itemNumber={selectedRowItem}
        header={`Delete Quote`}
        entityDescription={`Quote #${selectedRowItem}`}
        body={`Once you confirm you can't undo this action afterwards. There will be no way to restore the information. 🚨`}
      />
      <EditQuoteForm
        isOpen={isEditOpen}
        onClose={onEditClose}
        onOpen={onEditOpen}
        quote={selectedEditQuote}
        services={services}
        quoteStatuses={quoteStatuses}
        handleEditOnChange={handleEditOnChange}
        handleEditSubmit={handleEditSubmit}
        loadingState={quoteUpdateIsLoading}
      />
      <VStack mt={'4'} mb={10} w="full" mx={'auto'} px={{ base: '4', lg: '8' }} gap={4}>
        <PageHeader
          title={'Quotes'}
          subheading={'Manage your quotes to send out to your customers.'}
          addItemButtonText={'Add quote'}
          onOpen={onNewOpen}
        />
        <QuoteStatCards />
        <DataTable
          data={quotes}
          columns={quoteColumns}
          isLoading={quotesLoadingStateIsOn}
          entity={'quote'}
          activateModal={onNewOpen}
          EntityFilterBar={QuoteFilterBar}
        />
      </VStack>
    </>
  );
}

export default Estimates;
