import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  useToast,
  useColorModeValue,
  HStack,
  Tooltip,
  FormControl,
  Input,
  Button,
  Text,
  useDisclosure,
  VStack,
  IconButton,
  Icon,
  Card,
  CardBody,
  Skeleton
} from '@chakra-ui/react';
import AsyncSelect from 'react-select/async';
import supabase from '../../utils/supabaseClient';
import {
  MdKeyboardArrowLeft,
  MdPostAdd,
  MdSearch,
  MdFilterList,
  MdFilterAlt
} from 'react-icons/md';
import {
  CustomerOptions,
  Estimate,
  NewEstimateForm,
  DeleteAlertDialog,
  QuoteTable
} from '../../components';
import { TbRuler } from 'react-icons/tb';
import { useQuotes } from '../../hooks/useQuotes';

function Estimates() {
  // Hooks used to manage quote data
  const { quotes, setQuotes, fetchQuotes, quotesLoadingStateIsOn } = useQuotes();

  //Defining variables
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const initialRef = React.useRef();

  //Define toast from chakra ui
  const toast = useToast();

  // let navigate = useNavigate();
  // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

  //Style for Card component
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = useColorModeValue('blue', 'gray');

  // States to manage data
  const [selectedEstimateId, setSelectedEstimateId] = useState('');
  const [selectedEstimateNumber, setSelectedEstimateNumber] = useState('');

  // const [quotes, setQuotes] = useState(null);
  const [customers, setCustomers] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchEstimateInput, setSearchEstimateInput] = useState('');
  const [name, setCustomerName] = useState('');
  const [etDate, setEtDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [quotePrice, setQuotedPrice] = useState('');
  const [estStatus, setEstStatus] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [measurement, setMeasurement] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cuIdCaptured, setCuIdCaptured] = useState('');

  //React Render Hook
  useEffect(() => {
    // getAllQuotes();
    // getCustomers();
  }, []);

  //Functions for API calls or handling events across UI
  const getAllQuotes = async () => {
    const { data: Quotes, error } = await supabase
      .from('quote')
      .select(`*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)`);

    if (error) {
      console.log(error);
    }

    setQuotes(Quotes);
    console.log(Quotes);
  };

  const getCustomers = async () => {
    const { data: customers, error } = await supabase
      .from('customer')
      .select('id, first_name, last_name, email');

    if (error) {
      console.log(error);
    }

    setCustomers(customers);
    console.log(customers);
  };

  const searchEstimate = async () => {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/Quotes/add`;
    const json = {
      etStatusId: estStatus,
      customerId: cuIdCaptured,
      estimate_date: etDate,
      exp_date: expDate,
      sqft_measurement: measurement,
      service_name: serviceName,
      price: `$${quotePrice}`,
      quote_price: `$${quotePrice}`
    };
    await axios
      .post(url2, json)
      .then((response) => {
        console.log('I was submitted', response);
      })
      .catch((err) => {
        console.error(err);
      });
    console.log('Submit Function works!');
    //history.go(0);
    fetchQuotes();
    setEtDate('');
    setExpDate('');
    setQuotedPrice('');
    setEstStatus('');
    setServiceName('');
    setMeasurement('');
  };

  const handleSelectedCustomer = (selectedCustomer) => {
    // const value = e.target.value;
    // setSelectedCustomer(value)
    setSelectedCustomer({
      selectedCustomer: selectedCustomer || []
    });
    // console.log(selectedCustomer.value)
    const selectedCuId = selectedCustomer.value;
    // console.log(selectedCustomer.e.value)
    setCuIdCaptured(selectedCuId);
    console.log(selectedCuId);
    // console.log(cuIdCaptured)
  };

  const handleQuotestatusInput = (e) => {
    const selectedValue = e.target.value;
    setEstStatus(selectedValue);
  };

  const loadOptions = async (inputText, callback) => {
    await axios
      .get(`http://${process.env.REACT_APP_BASE_URL}:8081/api/customers/?name=${inputText}`)
      .then((response) => {
        // const allCustomers = response.data;
        //add data to state
        // setCustomers(allCustomers);
        callback(
          response.data.map((customer) => ({
            label: customer.name,
            value: customer.id,
            email: customer.email
          }))
        );
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  // Update this function to handle delete functinality.
  const handleDelete = (estimateId, estimate_number) => {
    setSelectedEstimateId(estimateId);
    setSelectedEstimateNumber(estimate_number);
    onDeleteOpen();
  };

  const handleDeleteToast = (estimate_number) => {
    toast({
      position: 'top-right',
      title: `Estimate #${estimate_number} deleted!`,
      description: "We've deleted estimate for you.",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  return (
    <>
      <NewEstimateForm initialRef={initialRef} isOpen={isNewOpen} onClose={onNewClose} />
      <DeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        updateParentState={getAllQuotes}
        toast={handleDeleteToast}
        itemId={selectedEstimateId}
        itemNumber={selectedEstimateNumber}
        tableName={'estimate'}
        header={`Delete Estimate #${selectedEstimateNumber}`}
        body={`Are you sure? You can't undo this action afterwards.`}
      />
      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
        {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent="start" w="full">
          <Link to={'/'}>
            <Button
              colorScheme={buttonColorScheme}
              ml={'1rem'}
              mb="1rem"
              leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>
              Back
            </Button>
          </Link>
        </Box> */}
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'lg'}>
          <CardBody>
            <HStack mb={'24px'} mx={'1rem'}>
              <Flex display={'flex'} mr={'auto'} alignItems={'center'} gap={8}>
                <Flex>
                  <Icon as={TbRuler} boxSize={'6'} my={'auto'} />
                  <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
                    Quotes
                  </Text>
                </Flex>
                <Flex>
                  <form method="GET" onSubmit={searchEstimate}>
                    <FormControl display={'flex'}>
                      <Input
                        value={searchEstimateInput}
                        onChange={({ target }) => setSearchEstimateInput(target.value)}
                        placeholder="Search for Quotes"
                        colorScheme="blue"
                        size={'md'}
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
                  <Tooltip label="Create New Estimate">
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
            {/* Table for all all quotes from DB */}
            {quotesLoadingStateIsOn === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <QuoteTable data={quotes} handleDelete={handleDelete} />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}

export default Estimates;
