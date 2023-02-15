import React, { useState, useEffect } from 'react';
import { NewCustomerForm, CustomerTable } from '../../components';
import {
  Flex,
  Box,
  Text,
  Input,
  useBreakpointValue,
  useColorModeValue,
  Tooltip,
  useDisclosure,
  FormControl,
  VStack,
  Icon,
  Stack,
  IconButton,
  useToast,
  Skeleton,
  Card,
  CardBody
} from '@chakra-ui/react';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdSearch } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { supabase } from '../../utils';
import { useCustomers } from '../../hooks/useCustomers';

export default function Customers() {
  // Custom React Hook to use Customers with useState
  const { customers, setCustomers, fetchCustomers, customersLoadingStateIsOn } = useCustomers();
  // Chakra UI Hook toast
  const toast = useToast();

  //For opening drawer components
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  //const finalRef = React.useRef();

  //Style for Card component
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = useColorModeValue('blue', 'gray');

  //GET data from API
  // const [customers, setCustomers] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');

  const isWideVersion = useBreakpointValue({
    base: false,
    xl: true
  });

  useEffect(() => {
    // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
    // if (!localStorage.getItem('supabase.auth.token')) {
    //     history.push('/login');
    // }
  }, []);

  // Search for customer based on first name, last name, or email address
  const getAllCustomersByName = async (event) => {
    event.preventDefault();
    if (searchCustomer === '') {
      await fetchCustomers();
    } else {
      let { data: customersSearchResult, error } = await supabase
        .from('customer')
        .select('*')
        .or(
          `first_name.ilike.%${searchCustomer}%,last_name.ilike.%${searchCustomer}%,email.ilike.%${searchCustomer}%,phone_number.ilike.%${searchCustomer}%`
        );

      if (error) {
        console.log(error);
      }
      console.log(customersSearchResult);
      setCustomers(customersSearchResult);
    }
  };

  return (
    <>
      {/* Form for creating a new customer */}
      <NewCustomerForm
        isOpen={isOpen}
        onClose={onClose}
        initialRef={initialRef}
        updateCustomerData={fetchCustomers}
        toast={toast}
        loadingState={customersLoadingStateIsOn}
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
        {/* Card Element for display main data for page */}
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'md'}>
          <CardBody>
            <Stack direction={{ base: 'column', lg: 'row' }} mt={'1rem'} mb={'2rem'} spacing="auto">
              <Flex alignItems={'center'} ml="24px">
                <Icon as={FiUsers} boxSize={'7'} />
                <Text fontSize={'3xl'} fontWeight="semibold" mx="14px">
                  Customers
                </Text>
              </Flex>
              <Box
                display="flex"
                pr="1rem"
                pt={{ base: '1rem', lg: '0rem' }}
                justifyContent={{ base: 'center', lg: 'normal' }}>
                <form method="GET" onSubmit={getAllCustomersByName}>
                  <FormControl>
                    <Flex flexDir={'row'}>
                      <Input
                        value={searchCustomer}
                        onChange={({ target }) => setSearchCustomer(target.value)}
                        placeholder="Search for Customer"
                        colorScheme="blue"
                        border="2px"
                      />
                      <Tooltip label="Search">
                        <IconButton
                          ml={'1rem'}
                          type="submit"
                          icon={<MdSearch />}
                          isLoading={customersLoadingStateIsOn}
                        />
                      </Tooltip>
                    </Flex>
                  </FormControl>
                </form>
                <Tooltip label={'Create New Customer'}>
                  <IconButton
                    colorScheme="blue"
                    variant="solid"
                    onClick={onOpen}
                    ml="2rem"
                    icon={<IoMdPersonAdd />}
                  />
                </Tooltip>
              </Box>
            </Stack>
            {/* Customer Table Component */}
            {/* Renders a table with all customers stored from database */}
            {customersLoadingStateIsOn === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton w={'full'} h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <CustomerTable data={customers} isWideVersion={isWideVersion} />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
