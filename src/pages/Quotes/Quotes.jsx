import React, { useState } from 'react';
import {
  Box,
  Flex,
  useToast,
  Tooltip,
  Input,
  Text,
  useDisclosure,
  VStack,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  Badge,
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
import { ChevronRight, Pencil, Trash, Search } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { formatMoneyValue, monthDDYYYYFormat, formatNumber } from '../../utils';
import { Link } from 'react-router-dom';

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
        <Box w={'full'}>
          <Flex
            shadow={'xs'}
            w={'full'}
            gap={4}
            bg={useColorModeValue('gray.50', 'gray.800')}
            border={'1px'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            px={'1rem'}
            py={'6'}
            rounded={'lg'}
            flexDir={{ base: 'column', md: 'row' }}>
            <Box w={{ base: 'full', md: '40%' }}>
              <Text fontSize={'14px'} fontWeight={500} mb={'2'}>
                Search for Quote
              </Text>
              <InputGroup>
                <InputLeftElement>
                  <Search size={'20px'} color="gray" />
                </InputLeftElement>
                <Input
                  type={'search'}
                  placeholder="Search"
                  bg={useColorModeValue('white', 'gray.800')}
                />
              </InputGroup>
            </Box>
            <Box w={{ base: 'full', md: '20%' }}>
              <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
                Status
              </Text>
              <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
                <option>Accepted</option>
              </Select>
            </Box>
            <Box w={{ base: 'full', md: '20%' }}>
              <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
                Service Type
              </Text>
              <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
                <option>All</option>
              </Select>
            </Box>
            <Box w={{ base: 'full', md: '20%' }}>
              <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
                Customer
              </Text>
              <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
                <option>All</option>
              </Select>
            </Box>
          </Flex>
        </Box>
        <DataTable
          data={quotes}
          columns={quoteColumns}
          isLoading={quotesLoadingStateIsOn}
          entity={'quote'}
          activateModal={onNewOpen}
        />
        {/* {quotesLoadingStateIsOn === true && (
          <>
            <Box w={'full'} h={'200px'}>
              <Skeleton h={'200px'} rounded={'xl'} />
            </Box>
          </>
        )}
        <Card
          width="full"
          size={{ base: 'md', md: 'md' }}
          rounded={'lg'}
          shadow={'xs'}
          border={'1px'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <CardBody>
            {quotesLoadingStateIsOn === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <QuoteTable
                  data={!searchQuoteInput ? quotes : quoteSearchResult}
                  handleDelete={handleDelete}
                  handleEditDrawer={handleEditDrawer}
                />
              </>
            )}
          </CardBody>
        </Card> */}
      </VStack>
    </>
  );
}

export default Estimates;
