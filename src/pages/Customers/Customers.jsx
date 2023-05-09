import React, { useState } from 'react';
import { NewCustomerForm, CustomerTable } from '../../components';
import {
  Flex,
  Box,
  Text,
  Input,
  useBreakpointValue,
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
  CardBody,
  Button
} from '@chakra-ui/react';
import { IoMdPersonAdd } from 'react-icons/io';
// import { MdSearch } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { useFetchCustomers } from '../../hooks/useFetchData/useCustomers';
import { useCustomerTypes } from '../../hooks/useFetchData/useCustomerTypes';
import useDebounce from '../../hooks/useDebounce';
import { useCustomerSearch } from '../../hooks/useFetchData/useCustomerSearch';
// import { Link } from 'react-router-dom';
// import { MdArrowBack } from 'react-icons/md';

export default function Customers() {
  // Custom React Hook to use Customers with useState
  const { customerTypes } = useCustomerTypes();

  // Chakra UI Hook toast
  const toast = useToast();

  //For opening drawer components
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  //const finalRef = React.useRef();

  //GET data from API
  // const [customers, setCustomers] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const debouncedCustomerSearchTerm = useDebounce(searchCustomer, 100);
  const { customers, isLoading } = useFetchCustomers();
  const { customerSearchResult, customerIsLoading } = useCustomerSearch(
    debouncedCustomerSearchTerm
  );

  const isWideVersion = useBreakpointValue({
    base: false,
    xl: true
  });

  return (
    <>
      {/* Form for creating a new customer */}
      <NewCustomerForm
        isOpen={isOpen}
        onClose={onClose}
        initialRef={initialRef}
        toast={toast}
        customerTypes={customerTypes}
      />
      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '2', lg: '2rem' }}>
        <Box
          display={'flex'}
          flexDirection={{ base: 'column', lg: 'row' }}
          marginBottom={'1rem'}
          justifyContent={{ base: 'center', lg: 'flex-start' }}
          w="full"
          gap={'4'}
          px={'2rem'}>
          <Flex mr={'auto'} w={'full'} justifyContent={{ base: 'center', lg: 'flex-start' }}>
            <Icon as={FiUsers} boxSize={6} my={'auto'} />
            <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
              Customers
            </Text>
          </Flex>
          <Flex gap={5} justifyContent={'center'}>
            <Flex w={'full'}>
              <form>
                <FormControl>
                  <Flex flexDir={'row'} w={'full'}>
                    <Input
                      variant={'outline'}
                      borderColor={'gray.300'}
                      value={searchCustomer}
                      onChange={({ target }) => setSearchCustomer(target.value)}
                      placeholder="Search for customer..."
                      size={'md'}
                      width={{ base: '300px', lg: '300px' }}
                    />
                    {/* <Tooltip label="Search">
                          <IconButton
                            ml={'1rem'}
                            type="submit"
                            icon={<MdSearch />}
                            isLoading={isLoading || customerIsLoading}
                          />
                        </Tooltip> */}
                  </Flex>
                </FormControl>
              </form>
            </Flex>
            <Box display="flex" justifyContent={{ base: 'center', lg: 'normal' }}>
              <Tooltip label={'Create New Customer'}>
                <IconButton
                  colorScheme="blue"
                  variant="solid"
                  onClick={onOpen}
                  icon={<IoMdPersonAdd />}
                />
              </Tooltip>
            </Box>
          </Flex>
        </Box>
        {/* Card Element for display main data for page */}
        <Card width="full" rounded={'xl'} shadow={'sm'} size={{ base: 'md', lg: 'lg' }}>
          <CardBody>
            {/* Customer Table Component */}
            {/* Renders a table with all customers stored from database */}
            {isLoading || customerIsLoading === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton w={'full'} h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <CustomerTable
                  data={!searchCustomer ? customers : customerSearchResult}
                  isWideVersion={isWideVersion}
                />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
