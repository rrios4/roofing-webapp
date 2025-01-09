import React, { useState } from 'react';
// import { useHistory } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';
import {
  useColorModeValue,
  useToast,
  Box,
  Flex,
  FormControl,
  Input,
  Button,
  Text,
  useDisclosure,
  VStack,
  Avatar,
  Tooltip,
  HStack,
  Icon,
  IconButton,
  Card,
  CardBody,
  Skeleton,
  Divider
} from '@chakra-ui/react';
import supabase from '../../utils/supabaseClient';
import {
  CustomerOptions,
  EditInvoiceForm,
  NewInvoiceForm,
  Invoice,
  DeleteAlertDialog,
  InvoiceFilterSwitchPopover,
  InvoiceTable,
  ConnectedInvoiceDeleteAlertDialog,
  PageHeader,
  InvoiceFilterBar,
  InvoiceStatCards
} from '../../components/index.js';
import { MdPostAdd, MdSearch, MdFilterList } from 'react-icons/md';
import { FiFileText, FiFolder, FiX } from 'react-icons/fi';
import { useFetchAllInvoices, useUpdateInvoice } from '../../hooks/useAPI/useInvoices.js';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/useInvoiceStatuses.js';
import { useFetchAllServices } from '../../hooks/useAPI/useServices.js';
import { ArrowUpDown, ChevronRight, Pencil, Plus, Trash } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../components/ui/DataTable.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { formatDate, formatMoneyValue, formatNumber, monthDDYYYYFormat } from '../../utils';

function Invoices() {
  const columnHelper = createColumnHelper();
  const initialRef = React.useRef();
  const toast = useToast();
  // Hooks
  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    isError: isInvoicesError
  } = useFetchAllInvoices();
  const {
    data: services,
    isRoofingServicesLoading,
    isRoofingServicesError
  } = useFetchAllServices();
  const {
    data: invoiceStatuses,
    isLoading: isInvoiceStatuses,
    isError: isInvoicesStatusesError
  } = useFetchAllInvoiceStatuses();
  const {
    mutate: mutateUpdateInvoice,
    isLoading: isUpdateInvoiceLoading,
    isError: isUpdateInvoiceError
  } = useUpdateInvoice(toast);

  // Use Disclosured used for opening drawers where forms are at
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  //React States to manage data
  // const [invoices, getInvoices] = useState();
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  const [searchInvoiceInput, setSearchInvoiceInput] = useState('');
  const [selectedEditInvoice, setSelectedEditInvoice] = useState({
    id: '',
    invoice_number: '',
    service_type_id: '',
    invoice_status_id: '',
    invoice_date: '',
    issue_date: '',
    due_date: '',
    sqft_measurement: '',
    private_note: '',
    public_note: ''
  });

  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState('');

  // React state switches
  const [filterSwitchStatus1IsOn, setFilterSwitchStatus1IsOn] = useState(false);
  const [filterSwitchStatus2IsOn, setFilterSwitchStatus2IsOn] = useState(false);
  const [filterSwitchStatus3IsOn, setFilterSwitchStatus3IsOn] = useState(false);
  const [filterSwitchStatus4IsOn, setFilterSwitchStatus4IsOn] = useState(false);
  const [draftInvoiceButtonSwitchIsOn, setDraftInvoiceButtonSwitchIsOn] = useState(false);

  // Invoice React State Array filtered
  // const filteredInvoiceDraftArray = () =>
  //   setInvoices((invoices) => invoices.filter((invoice) => invoice.invoice_status_id === 4));

  // Function to handle the search through all invoices
  const searchInvoice = async () => {};

  // Handles the opening of the edit drawer form and settings single invoice to a react state
  const handleEditModal = (invoice) => {
    setSelectedEditInvoice({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      service_type_id: invoice.service_type_id,
      invoice_status_id: invoice.invoice_status_id,
      invoice_date: invoice.invoice_date,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      sqft_measurement: invoice.sqft_measurement,
      private_note: invoice.public_note,
      public_note: invoice.private_note
    });
    onEditOpen();
  };

  //Handles changes made to the fields made by the user and updates the React State
  const handleEditChange = (e) => {
    setSelectedEditInvoice({ ...selectedEditInvoice, [e.target.name]: e.target.value });
  };

  // Handles the submitting of edited information from drawer form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updateInvoiceObject = [
      {
        service_type_id: selectedEditInvoice.service_type_id,
        invoice_status_id: selectedEditInvoice.invoice_status_id,
        invoice_date: selectedEditInvoice.invoice_date,
        issue_date: selectedEditInvoice.issue_date,
        due_date: selectedEditInvoice.due_date,
        sqft_measurement: selectedEditInvoice.sqft_measurement,
        public_note: selectedEditInvoice.public_note,
        private_note: selectedEditInvoice.private_note,
        updated_at: new Date()
      },
      {
        invoice_number: selectedEditInvoice.invoice_number
      }
    ];
    mutateUpdateInvoice(updateInvoiceObject);
    onEditClose();
    setSelectedEditInvoice({
      id: '',
      invoice_number: '',
      service_type_id: '',
      invoice_status_id: '',
      invoice_date: '',
      issue_date: '',
      due_date: '',
      sqft_measurement: '',
      note: '',
      cust_note: ''
    });
  };

  // Gets a list of invoices with status Draft
  const handleDraftInvoiceView = () => {
    const newSwitchValue = !draftInvoiceButtonSwitchIsOn;
    setDraftInvoiceButtonSwitchIsOn(newSwitchValue);
    if (newSwitchValue === true) {
      // filteredInvoiceDraftArray();
    } else {
      // fetchInvoices();
    }
    console.log(invoices);
  };

  // Handle filter checkboxes to update invoice state based on filter
  const handleSwitchesStatusFilter = async (switchOne, switchTwo, switchThree, switchFour) => {
    filterSwitchStatus1IsOn === true
      ? setFilterSwitchStatus1IsOn(false)
      : setFilterSwitchStatus1IsOn(switchOne);
    filterSwitchStatus2IsOn === true
      ? setFilterSwitchStatus2IsOn(false)
      : setFilterSwitchStatus2IsOn(switchTwo);
    filterSwitchStatus3IsOn === true
      ? setFilterSwitchStatus3IsOn(false)
      : setFilterSwitchStatus3IsOn(switchThree);
    filterSwitchStatus4IsOn === true
      ? setFilterSwitchStatus4IsOn(false)
      : setFilterSwitchStatus4IsOn(switchFour);
  };

  // Handles the opening of the alert
  const handleDeleteAlert = (invoiceId, invoice_number) => {
    setSelectedInvoiceId(invoiceId);
    setSelectedInvoiceNumber(invoice_number);
    onDeleteOpen();
  };

  // Handle when the user click on the create button in invoices page to open drawer and load data
  const handleDrawerOpenAction = async () => {};

  // Handle success message toast when invoice has been deleted
  const handleDeleteToast = (invoice_number) => {
    toast({
      position: 'top',
      title: `Invoice #${invoice_number} deleted! 🚀`,
      description: "We've deleted invoice for you.",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  // Handle edit data

  // Handles the cancel button in the modal form for editing invoices

  const invoiceTableColumns = [
    columnHelper.accessor('invoice_number', {
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <Text align={'center'} fontWeight={500} fontSize={'14px'}>
            #{formatNumber(invoice.invoice_number)}
          </Text>
        );
      },
      header: ({ column }) => (
        <Flex justify={'center'} w={'full'}>
          <Button
            px={1}
            fontSize={'14px'}
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Invoice
            <Box ml={2} h={4} w={4}>
              <ArrowUpDown size={'15px'} />
            </Box>
          </Button>
        </Flex>
      )
    }),
    columnHelper.accessor('invoice_date', {
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <Text fontSize={'14px'} fontWeight={400}>
            {monthDDYYYYFormat(invoice.invoice_date)}
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
    columnHelper.accessor('invoice_status_id', {
      cell: ({ row }) => {
        const invoice = row.original;
        if (invoice.invoice_status.name === 'Paid') {
          return <StatusBadge badgeText={invoice.invoice_status.name} colorScheme={'green'} />;
        } else if (invoice.invoice_status.name === 'Overdue') {
          return <StatusBadge badgeText={invoice.invoice_status.name} colorScheme={'red'} />;
        } else if (invoice.invoice_status.name === 'Pending') {
          return <StatusBadge badgeText={invoice.invoice_status.name} colorScheme={'yellow'} />;
        } else {
          return <StatusBadge badgeText={invoice.invoice_status.name} colorScheme={'gray'} />;
        }
      },
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
      )
    }),
    columnHelper.accessor('service_type_id', {
      cell: ({ row }) => {
        const invoice = row.original;
        return <Text>{invoice.services.name}</Text>;
      },
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
      )
    }),
    columnHelper.accessor('due_date', {
      cell: ({ row }) => {
        const invoice = row.original;
        return <Text>{monthDDYYYYFormat(invoice.due_date)}</Text>;
      },
      header: ({ column }) => (
        <Button
          px={1}
          fontSize={'14px'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Due Date
          <Box ml={2} h={4} w={4}>
            <ArrowUpDown size={'15px'} />
          </Box>
        </Button>
      )
    }),
    columnHelper.accessor(
      (row) =>
        `${row.customer.first_name} ${row.customer.last_name} ${row.customer.email} ${row.invoice_number} ${row.invoice_status.name} ${row.services.name}`,
      {
        id: 'customer',
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <Link
              to={`/customers/${invoice.customer.id}`}
              _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}>
              <Button variant={'ghost'} px={1}>
                <Flex gap={3}>
                  <Avatar
                    my={'auto'}
                    size={'sm'}
                    name={`${invoice.customer.first_name} ${invoice.customer.last_name}`}
                    bg={useColorModeValue('gray.200', 'gray.600')}
                    textColor={useColorModeValue('gray.700', 'gray.200')}
                  />
                  <Box fontSize={'14px'}>
                    <Flex gap={1} fontWeight={500}>
                      <Text>{invoice.customer.first_name}</Text>
                      <Text>{invoice.customer.last_name}</Text>
                    </Flex>
                    <Text fontWeight={400}>{invoice.customer.email}</Text>
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
    columnHelper.accessor('amount_due', {
      cell: ({ row }) => {
        const invoice = row.original;
        return <Text>${formatMoneyValue(invoice.amount_due)}</Text>;
      },
      header: ({ column }) => {
        return (
          <Button
            px={1}
            fontSize={'14px'}
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Balance
            <Box ml={2} h={4} w={4}>
              <ArrowUpDown size={'15px'} />
            </Box>
          </Button>
        );
      }
    }),
    columnHelper.accessor('actions', {
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <Flex gap={2}>
            <Button px={0} onClick={() => handleEditModal(invoice)}>
              <Pencil size={'15px'} />
            </Button>
            <Button px={0} onClick={() => handleDeleteAlert(invoice.id, invoice.invoice_number)}>
              <Trash size={'15px'} />
            </Button>
            <Link to={`/invoices/${invoice.invoice_number}`}>
              <Button px={0}>
                <ChevronRight size={'15px'} />
              </Button>
            </Link>
          </Flex>
        );
      },
      header: () => <Text>Actions</Text>
    })
  ];

  return (
    <>
      {/* Drawer Component Forms */}
      <NewInvoiceForm
        initialRef={initialRef}
        isNewOpen={isNewOpen}
        onNewClose={onNewClose}
        onNewOpen={onNewOpen}
        toast={toast}
        data={invoices}
        nextInvoiceNumberValue={nextInvoiceNumber}
        loadingState={isInvoicesLoading}
        services={services}
        invoiceStatuses={invoiceStatuses}
      />
      <EditInvoiceForm
        initialRef={initialRef}
        isOpen={isEditOpen}
        onClose={onEditClose}
        invoice={selectedEditInvoice}
        handleEditOnChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        loadingState={isInvoicesLoading}
        services={services}
        invoiceStatuses={invoiceStatuses}
      />
      <ConnectedInvoiceDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        header={'Delete Invoice'}
        entityDescription={`INVOICE # ${selectedInvoiceNumber}`}
        body={`You can't undo this action afterwards. This will delete associated payments and line-items that depend on this invoice. 🚨`}
        itemNumber={selectedInvoiceNumber}
      />

      {/* Main Invoice Page Code */}
      <VStack
        mt={{ base: '0', lg: '4' }}
        mb={8}
        w={'full'}
        mx={'auto'}
        px={{ base: '4', lg: '8' }}
        gap={4}>
        <PageHeader
          title={'Invoices'}
          subheading={'Manage your invoices to track income for projects.'}
          addItemButtonText={'Add invoice'}
          onOpen={onNewOpen}
        />
        <InvoiceStatCards />
        {/* <InvoiceFilterBar /> */}
        <DataTable
          data={invoices}
          columns={invoiceTableColumns}
          EntityFilterBar={InvoiceFilterBar}
          isLoading={isInvoicesLoading}
          entity={'invoice'}
          activateModal={onNewOpen}
        />
      </VStack>
    </>
  );
}

export default Invoices;
