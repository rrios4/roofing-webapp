import React, { useState, useEffect } from 'react';
// import { useHistory } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
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
import { MdKeyboardArrowLeft, MdPostAdd, MdSearch, MdFilterList } from 'react-icons/md';
import { FiFileText, FiFolder, FiX } from 'react-icons/fi';
import { useInvoices } from '../../hooks/useInvoices';
import { useServices } from '../../hooks/useServices';
import { useInvoiceStatuses } from '../../hooks/useInvoiceStatuses';

function Invoices() {
  // Hooks
  const { invoices, fetchInvoices, setInvoices, invoicesLoadingStateIsOn } = useInvoices();
  const { services } = useServices();
  const { invoiceStatuses } = useInvoiceStatuses();

  // Use Disclosured used for opening drawers where forms are at
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Ref for to focus cursor or field for elements
  const initialRef = React.useRef();
  let navigate = useNavigate();
  const toast = useToast();

  //Style for Card component
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = useColorModeValue('gray', 'gray');

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
  const filteredInvoiceDraftArray = () =>
    setInvoices((invoices) => invoices.filter((invoice) => invoice.invoice_status_id === 4));

  // Functions to program events or actions
  useEffect(() => {
    // getAllInvoices();
    // getCustomers();
  }, []);

  //   Handles getting a list of all invoices from DB
  // const getAllInvoices = async () => {
  //   const { data: allInvoices, error } = await supabase
  //     .from('invoice')
  //     .select(
  //       '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)'
  //     )
  //     // .neq('invoice_status_id', 4)
  //     .order('invoice_status_id', { ascending: false })
  //     .order('updated_at', { ascending: false });

  //   if (error) {
  //     console.log(error);
  //   }
  //   // getInvoices(allInvoices);
  //   console.log(allInvoices);
  // };

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
    console.log(selectedEditInvoice);
    const { data, error } = await supabase
      .from('invoice')
      .update({
        service_type_id: selectedEditInvoice.service_type_id,
        invoice_status_id: selectedEditInvoice.invoice_status_id,
        invoice_date: selectedEditInvoice.invoice_date,
        issue_date: selectedEditInvoice.issue_date,
        due_date: selectedEditInvoice.due_date,
        sqft_measurement: selectedEditInvoice.sqft_measurement,
        note: selectedEditInvoice.note,
        cust_note: selectedEditInvoice.cust_note,
        updated_at: new Date()
      })
      .eq('invoice_number', selectedEditInvoice.invoice_number);

    if (error) {
      // Toast to give feedback when error happens updating invoice
      toast({
        position: 'top',
        title: `Error Updating Invoice Number ${selectedEditInvoice.invoice_number}`,
        description: `Error: ${error.message}`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      await fetchInvoices();
      // Toast to give feedback when success happens updating invoice
      toast({
        position: 'top',
        title: `Successfully Updated Invoice!`,
        description: `We've updated INV# ${selectedEditInvoice.invoice_number} for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
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
      filteredInvoiceDraftArray();
    } else {
      fetchInvoices();
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

  // Handles the toast to give feedback to the user
  const handleToastMessage = (status, position, invoice_numer, title, description) => {
    toast({
      position: position,
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true
    });
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
        updateParentData={fetchInvoices}
        toast={toast}
        data={invoices}
        nextInvoiceNumberValue={nextInvoiceNumber}
        loadingState={invoicesLoadingStateIsOn}
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
        loadingState={invoicesLoadingStateIsOn}
        services={services}
        invoiceStatuses={invoiceStatuses}
      />
      <ConnectedInvoiceDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        updateParentState={fetchInvoices}
        header={'Delete Invoice'}
        entityDescription={`INVOICE # ${selectedInvoiceNumber}`}
        body={`You can't undo this action afterwards. This will delete associated payments and line-items that depend on this invoice. 🚨`}
        itemNumber={selectedInvoiceNumber}
      />

      {/* Main Invoice Page Code */}
      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
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
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'lg'}>
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
            {invoicesLoadingStateIsOn === true ? (
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
