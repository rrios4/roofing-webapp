import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Flex,
  Text,
  useToast,
  Input,
  useDisclosure,
  FormControl,
  VStack,
  HStack,
  Tooltip,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
  Skeleton,
  Box
} from '@chakra-ui/react';
import {
  EditEstimateRequestForm,
  DeleteAlertDialog,
  NewEstimateRequestForm,
  NewCustomerForm,
  QuoteRequestTable
} from '../../components';
import supabase from '../../utils/supabaseClient';
import { MdSearch, MdPostAdd, MdFilterAlt, MdFilterList } from 'react-icons/md';
import { FiInbox } from 'react-icons/fi';
import { useQuoteRequests } from '../../hooks/useQuoteRequests';

const EstimateRequests = () => {
  // React Hook for managing state of quotes request
  const { quoteRequests, setQuoteRequests, fetchQuoteRequests, quoteRequestLoadingStateIsOn } =
    useQuoteRequests();

  //Chakra UI styling parameters
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = useColorModeValue('blue', 'gray');

  // Chakra UI Modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const initialRef = React.useRef();

  //Define toast from chakra ui
  const toast = useToast();

  // React Use State to store data from API requests
  // const [quoteRequests, setQuoteRequests] = useState(null);
  const [searchEstimateRequestsInput, setSearchEstimateRequestsInput] = useState('');
  const [selectedEstimateRequestObject, setSelectedEstimateRequestObject] = useState({
    id: '',
    est_request_status_id: '',
    requested_date: '',
    service_type_id: '',
    streetAddress: '',
    city: '',
    state: '',
    zipcode: '',
    firstName: '',
    lastName: '',
    email: '',
    customer_typeID: '',
    phone_number: ''
  });
  const [selectedEstimateRequestId, setSelectedEstimateRequestId] = useState('');
  const [selectedEstimateRequestNumber, setSelectedEstimateRequestNumber] = useState('');

  const [inputValue, SetInputValue] = useState('');

  useEffect(() => {}, []);

  // Search for customer quote request
  const searchEstimateRequest = async (event) => {
    event.preventDefault();

    if (searchEstimateRequestsInput === '') {
      // let { data: requests, error } = await supabase
      //     .from('quote_request')
      //     .select('*')

      // if (error) {
      //     console.log(error)
      // }
      // searchEstimateRequestsInput(requests)
      // setQuoteRequests(requests)
      fetchQuoteRequests();
    } else {
      let { data: qrSearchResult, error } = await supabase
        .from('quote_request')
        .select('*')
        .or(
          `firstName.ilike.%${searchEstimateRequestsInput}%,lastName.ilike.%${searchEstimateRequestsInput}%,email.ilike.%${searchEstimateRequestsInput}%,phone_number.ilike.%${searchEstimateRequestsInput}%`
        );

      if (error) {
        console.log(error);
      }
      console.log(qrSearchResult);
      // setCustomers(customersSearchResult);
      setQuoteRequests(qrSearchResult);
    }
  };

  //Handles alert box to user when they click to delete data
  const handleDeleteAlert = (estimateRequestId, estimateRequestNumber) => {
    setSelectedEstimateRequestId(estimateRequestId);
    // setSelectedEstimateRequestNumber(estimateRequestNumber);
    onDeleteOpen();
  };

  //Function that shows a toast once the user creates a new qr
  const handleNewToast = (requestId) => {
    toast({
      position: 'top-right',
      title: `Quote Request created!`,
      description: "We've created a new quote request for you 🚀",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  //Formats SQL date from DB to present in GUI table
  const handleSQLFormatDate = (date) => {
    let parsedDate = new Date(Date.parse(date));
    let options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    let dateString = parsedDate.toLocaleDateString('en-US', options);
    return dateString;
  };

  //Handles edit data
  const handleEdit = (estimate_request) => {
    // setSelectedEstimateRequestObject(estimate_request);
    setSelectedEstimateRequestObject({
      id: estimate_request.id,
      est_request_status_id: estimate_request.est_request_status_id,
      customer_typeID: estimate_request.customer_typeID,
      requested_date: estimate_request.requested_date,
      service_type_id: estimate_request.service_type_id,
      streetAddress: estimate_request.streetAddress,
      city: estimate_request.city,
      state: estimate_request.state,
      zipcode: estimate_request.zipcode,
      firstName: estimate_request.firstName,
      lastName: estimate_request.lastName,
      email: estimate_request.email,
      phone_number: estimate_request.phone_number
    });
    onEditOpen();
  };

  //Handles the cancel button in the modal form for editing QR
  const handleEditCancel = () => {
    onEditClose();
    setSelectedEstimateRequestObject({
      id: '',
      est_request_status_id: '',
      requested_date: '',
      service_type_id: '',
      streetAddress: '',
      city: '',
      state: '',
      zipcode: '',
      firstName: '',
      lastName: '',
      email: ''
    });
  };

  //Handles changes made to the fields made by the user and updates the React State
  const handleEditChange = (e) => {
    setSelectedEstimateRequestObject({
      ...selectedEstimateRequestObject,
      [e.target.name]: e.target.value
    });
    // console.log(selectedEstimateRequestObject.streetAddress)
  };

  // Handles the submition of new edited information to the database
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('quote_request')
      .update({
        id: selectedEstimateRequestObject.id,
        service_type_id: selectedEstimateRequestObject.service_type_id,
        est_request_status_id: selectedEstimateRequestObject.est_request_status_id,
        requested_date: selectedEstimateRequestObject.requested_date,
        firstName: selectedEstimateRequestObject.firstName,
        lastName: selectedEstimateRequestObject.lastName,
        streetAddress: selectedEstimateRequestObject.streetAddress,
        city: selectedEstimateRequestObject.city,
        state: selectedEstimateRequestObject.state,
        zipcode: selectedEstimateRequestObject.zipcode,
        email: selectedEstimateRequestObject.email,
        phone_number: selectedEstimateRequestObject.phone_number,
        customer_typeID: selectedEstimateRequestObject.customer_typeID,
        updated_at: new Date()
      })
      .eq('id', selectedEstimateRequestObject.id);

    if (error) {
      console.log(error);
      handleToastMessage(
        'error',
        'top',
        selectedEstimateRequestObject.id,
        'Error Updating Quote Request',
        `Error: ${error}`
      );
    }
    onEditClose();
    setSelectedEstimateRequestObject({
      id: '',
      est_request_status_id: '',
      requested_date: '',
      service_type_id: '',
      streetAddress: '',
      city: '',
      state: '',
      zipcode: '',
      firstName: '',
      lastName: '',
      email: ''
    });
    await fetchQuoteRequests();
    handleEditChangeToast(selectedEstimateRequestObject.id);
    // console.log(selectedEstimateRequestObject)
  };

  //Handles to determine if email alredy exist in DB
  const handleEmailValidation = async (request) => {
    const { data: resEmail, error } = await supabase
      .from('customer')
      .select(
        'id, customer_type_id, email, phone_number, first_name, last_name, street_address, zipcode, state'
      )
      .eq('email', `${request.email}`);

    if (error) {
      console.log(error);
    }
    // console.log(resEmail.length)
    if (resEmail.length === 0) {
      // console.log('Email is not available in DB!')
      // console.log(request)
      const { error } = await supabase.from('customer').insert({
        first_name: request.firstName,
        last_name: request.lastName,
        street_address: request.streetAddress,
        city: request.city,
        state: request.state,
        zipcode: request.zipcode,
        phone_number: request.phone_number,
        email: request.email,
        customer_type_id: request.customer_typeID
      });

      if (error) {
        console.log(error);
      }

      handleEmailValidationToastSuccess(request.email);
    } else {
      // console.log('Email is available in DB.')
      handleEmailValidationToastError(resEmail);
    }
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

  //Function that shows a toast once the user confirmed that the data has been updated
  const handleEditChangeToast = (requestId) => {
    toast({
      position: 'top-right',
      title: `QR# ${requestId} updated!`,
      description: "We've updated quote request for you 🎉",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  //Function that shows a toast when the user click to save qr as a customer
  const handleEmailValidationToastError = (requestId) => {
    toast({
      position: 'top-right',
      title: `Customer already exist!`,
      description: `${requestId[0].email} email already exist! 👮‍♂️`,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };

  //Function that shows a toast when the user click to save qr as a customer
  const handleEmailValidationToastSuccess = (requestId) => {
    toast({
      position: 'top-right',
      title: `New customer has been saved!`,
      description: `Customer with ${requestId} email has been saved! 🚀`,
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  //Function that shows a toast once the user confirmed that the data has been deleted
  const handleDeleteToast = (requestId) => {
    toast({
      position: 'top-right',
      title: `Quote Request #${requestId} deleted!`,
      description: "We've deleted quote request for you 🚀",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  return (
    <>
      <NewEstimateRequestForm
        isOpen={isNewOpen}
        onClose={onNewClose}
        initialRef={initialRef}
        updateQRData={fetchQuoteRequests}
        toast={handleNewToast}
      />
      <EditEstimateRequestForm
        initialRef={initialRef}
        handleSubmit={handleEditSubmit}
        isOpen={isEditOpen}
        handleEditCancel={handleEditCancel}
        objectData={selectedEstimateRequestObject}
        handleEditOnChange={handleEditChange}
      />
      <DeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        toast={handleToastMessage}
        updateParentState={fetchQuoteRequests}
        itemId={selectedEstimateRequestId}
        itemNumber={selectedEstimateRequestId}
        tableName={'quote_request'}
        tableFieldName={'id'}
        header={`❌ Delete QR # ${selectedEstimateRequestId}`}
        body={`Are you sure? You can't undo this action afterwards.`}
      />

      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
        {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button shadow={'sm'} colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>Back</Button>
                    </Link>
                </Box> */}
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'md'}>
          <CardBody>
            {/* Card Header with Search, Button, and etc... */}
            <HStack mt={'1rem'} mb={'2rem'}>
              <Flex display={'flex'} mr={'auto'} alignItems={'center'} ml={'24px'}>
                <Icon as={FiInbox} boxSize={'7'} />
                <Text fontSize={'3xl'} fontWeight="semibold" mx="14px">
                  Quote Requests
                </Text>
              </Flex>
              <Flex pr="1rem" mr={'1rem'} justifyContent={'end'} gap={10}>
                <form method="GET" onSubmit={searchEstimateRequest}>
                  <FormControl display={'flex'}>
                    <Input
                      value={searchEstimateRequestsInput}
                      onChange={({ target }) => setSearchEstimateRequestsInput(target.value)}
                      placeholder="Search for Request"
                      colorScheme="blue"
                      border="2px"
                    />
                    <Tooltip label="Search">
                      <IconButton ml={'1rem'} type="submit" icon={<MdSearch />} />
                    </Tooltip>
                  </FormControl>
                </form>
                <Flex gap={4}>
                  <Tooltip label="Filter">
                    <IconButton colorScheme={'gray'} icon={<MdFilterAlt />} />
                  </Tooltip>
                  <Tooltip label="Sort">
                    <IconButton colorScheme={'gray'} icon={<MdFilterList />} />
                  </Tooltip>
                  <Tooltip label="Create New Request">
                    <IconButton
                      colorScheme="blue"
                      variant="solid"
                      onClick={onNewOpen}
                      icon={<MdPostAdd />}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </HStack>
            {/* Main Body for content */}
            {/* Quote Request Table to display all requests from company website */}
            {quoteRequestLoadingStateIsOn === true ? (
              <Box w={'full'} height={'200px'}>
                <Skeleton height={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <QuoteRequestTable
                  data={quoteRequests}
                  emailValidation={handleEmailValidation}
                  handleEdit={handleEdit}
                  handleDeleteAlert={handleDeleteAlert}
                />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
};

export default EstimateRequests;
