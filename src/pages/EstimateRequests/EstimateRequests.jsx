import React, { useEffect, useState } from 'react';
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
  Icon,
  Card,
  CardBody,
  Skeleton,
  Box
} from '@chakra-ui/react';
import {
  EditEstimateRequestForm,
  NewEstimateRequestForm,
  QuoteRequestTable,
  ConnectedQRDeleteAlertDialog
} from '../../components';
import supabase from '../../utils/supabaseClient';
import { MdSearch, MdPostAdd, MdFilterAlt, MdFilterList } from 'react-icons/md';
import { FiInbox } from 'react-icons/fi';
import { useQuoteRequests } from '../../hooks/useQuoteRequests';
import { useServices } from '../../hooks/useServices';
import { useQRStatuses } from '../../hooks/useQRStatuses';
import { useCustomerTypes } from '../../hooks/useFetchData/useCustomerTypes';

const EstimateRequests = () => {
  // React Hook for managing state of quotes request
  const { quoteRequests, setQuoteRequests, fetchQuoteRequests, quoteRequestLoadingStateIsOn } =
    useQuoteRequests();
  const { services } = useServices();
  const { qrStatuses } = useQRStatuses();
  const { customerTypes } = useCustomerTypes();
  // Chakra UI Reacr hook for toasts
  const toast = useToast();

  // Chakra UI Modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const initialRef = React.useRef();

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
      fetchQuoteRequests();
    } else {
      let { data: qrSearchResult, error } = await supabase
        .from('quote_request')
        .select(
          '*, services:service_type_id(*), customer_type:customer_typeID(*), estimate_request_status:est_request_status_id(*)'
        )
        .or(
          `firstName.ilike.%${searchEstimateRequestsInput}%,lastName.ilike.%${searchEstimateRequestsInput}%,email.ilike.%${searchEstimateRequestsInput}%,phone_number.ilike.%${searchEstimateRequestsInput}%`
        );

      if (error) {
        console.log(error);
      }
      // console.log(qrSearchResult);
      setQuoteRequests(qrSearchResult);
    }
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
    onEditClose();
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
      // Toast to give feedback when error occurs
      toast({
        position: 'top',
        title: 'Error Occured Updating Request',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
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
    // Toast to give feedback when success occurs
    toast({
      position: 'top',
      title: `QR# ${selectedEstimateRequestObject.id} updated!`,
      description: "We've updated quote request for you 🎉",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    // console.log(selectedEstimateRequestObject)
  };

  // Handles to determine if email alredy exist in DB to then save data as a new customer
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

      // handleEmailValidationToastSuccess(request.email);
      toast({
        position: 'top',
        title: `New customer has been saved!`,
        description: `Customer with ${request.email} email has been saved! 🚀`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } else {
      // console.log('Email is available in DB.')
      // handleEmailValidationToastError(resEmail);
      toast({
        position: 'top',
        title: `Customer already exist!`,
        description: `${resEmail[0].email} email already exist! 👮‍♂️`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Handles alert box to user when they click to delete data
  const handleDeleteAlert = (estimateRequestId, estimateRequestNumber) => {
    setSelectedEstimateRequestId(estimateRequestId);
    // setSelectedEstimateRequestNumber(estimateRequestNumber);
    onDeleteOpen();
  };

  return (
    <>
      <NewEstimateRequestForm
        isOpen={isNewOpen}
        onClose={onNewClose}
        initialRef={initialRef}
        updateQRData={fetchQuoteRequests}
        toast={toast}
        services={services}
        qrStatuses={qrStatuses}
        customerTypes={customerTypes}
      />
      <EditEstimateRequestForm
        initialRef={initialRef}
        handleSubmit={handleEditSubmit}
        isOpen={isEditOpen}
        onClose={onEditClose}
        handleEditCancel={handleEditCancel}
        objectData={selectedEstimateRequestObject}
        handleEditOnChange={handleEditChange}
        services={services}
        qrStatuses={qrStatuses}
      />
      <ConnectedQRDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        updateParentState={fetchQuoteRequests}
        itemNumber={selectedEstimateRequestId}
        header={'Delete Quote Request'}
        entityDescription={`QR # ${selectedEstimateRequestId}`}
        body={`Once you confirm there will be no way to restore the information. 🚨`}
      />

      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
        {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button shadow={'sm'} colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>Back</Button>
                    </Link>
                </Box> */}
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'lg'}>
          <CardBody>
            {/* Card Header with Search, Button, and etc... */}
            <HStack mb={'24px'} mx={'1rem'}>
              <Flex display={'flex'} mr={'auto'} alignItems={'center'} gap={8}>
                <Flex>
                  <Icon as={FiInbox} boxSize={'6'} my={'auto'} />
                  <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
                    Quote Requests
                  </Text>
                </Flex>
                <Flex>
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
                </Flex>
              </Flex>
              <Flex justifyContent={'end'} gap={10}>
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
