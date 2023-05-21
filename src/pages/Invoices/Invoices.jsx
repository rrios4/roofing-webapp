import React, { useState } from 'react';
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
  HStack,
  Icon,
  IconButton,
  Card,
  CardBody,
  Skeleton
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
  ConnectedInvoiceDeleteAlertDialog
} from '../../components';
import { MdPostAdd, MdSearch, MdFilterList } from 'react-icons/md';
import { FiFileText, FiFolder, FiX } from 'react-icons/fi';
import { useFetchAllInvoices, useUpdateInvoice } from '../../hooks/useAPI/useInvoices';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/useInvoiceStatuses';
import { useFetchAllServices } from '../../hooks/useAPI/useServices';

function Invoices() {
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
    note: '',
    cust_note: ''
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
      note: invoice.note,
      cust_note: invoice.cust_note
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
        note: selectedEditInvoice.note,
        cust_note: selectedEditInvoice.cust_note,
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

  return (
    <>
      {/* Drawer Component Forms */}
      <NewInvoiceForm
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
      <VStack my={'2rem'} w={'full'} mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
        {/* <Alert status='success' mb={'1rem'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} height={'200px'} rounded={'8'}>
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>Invoice Submitted!</AlertTitle>
                <AlertDescription maxWidth='sm'>New invoice saved to the server. Fire on! 👋</AlertDescription>
            </Alert> */}
        {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent="start" w="full">
          <Link to={'/'}>
            <Button
              colorScheme={'gray'}
              ml={'1rem'}
              mb="1rem"
              leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>
              Back
            </Button>
          </Link>
        </Box> */}
        <Card width="full" rounded={'xl'} shadow={'sm'} size={'lg'}>
          <CardBody>
            {/* Header Page info & Actions */}
            <HStack mb={'24px'} mx={'1rem'}>
              <Flex display={'flex'} mr={'auto'} alignItems={'center'} gap={8}>
                <Flex>
                  <Icon as={FiFileText} boxSize={'6'} my={'auto'} />
                  <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
                    Invoices
                  </Text>
                </Flex>
                <Flex>
                  {/* Search Input for Invoices */}
                  <form method="GET" onSubmit={searchInvoice}>
                    <FormControl display={'flex'}>
                      <Input
                        value={searchInvoiceInput}
                        onChange={({ target }) => setSearchInvoiceInput(target.value)}
                        placeholder="Search for Invoice"
                        colorScheme="blue"
                        size={'md'}
                      />
                      <Tooltip label="Search">
                        <IconButton mx={'1rem'} type="submit" icon={<MdSearch />} />
                      </Tooltip>
                    </FormControl>
                  </form>
                </Flex>
              </Flex>
              <Flex mr={'1rem'} justifyContent={'end'} gap={10}>
                <Flex gap={4}>
                  {/* Popover component to filter invoices by status */}
                  <InvoiceFilterSwitchPopover
                    handleSwitches={handleSwitchesStatusFilter}
                    switchOne={filterSwitchStatus1IsOn}
                    switchTwo={filterSwitchStatus2IsOn}
                    switchThree={filterSwitchStatus3IsOn}
                    switchFour={filterSwitchStatus4IsOn}
                  />
                  {/* Sort Button */}
                  <Tooltip label="Sort">
                    <IconButton icon={<MdFilterList />} />
                  </Tooltip>
                  {/* Draft View Button */}
                  <Tooltip
                    label={
                      draftInvoiceButtonSwitchIsOn === true
                        ? 'Close View of Drafts'
                        : 'Click to view all Draft Invoices'
                    }>
                    <IconButton
                      icon={draftInvoiceButtonSwitchIsOn === true ? <FiX /> : <FiFolder />}
                      onClick={handleDraftInvoiceView}
                    />
                  </Tooltip>
                  {/* Create New Invoice Button */}
                  <Tooltip label="Create New Invoice">
                    <IconButton icon={<MdPostAdd />} onClick={onNewOpen} colorScheme={'blue'} />
                  </Tooltip>
                </Flex>
              </Flex>
            </HStack>
            {/* Table Component for Invoices Data */}
            {isInvoicesLoading === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton w={'full'} h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <InvoiceTable
                  data={invoices}
                  editModal={handleEditModal}
                  deleteAlert={handleDeleteAlert}
                />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}

export default Invoices;
