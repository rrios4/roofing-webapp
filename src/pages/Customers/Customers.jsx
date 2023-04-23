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
  CardBody
} from '@chakra-ui/react';
import { IoMdPersonAdd } from 'react-icons/io';
// import { MdSearch } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { useCustomers } from '../../hooks/useFetchData/useCustomers';
import { useCustomerTypes } from '../../hooks/useFetchData/useCustomerTypes';
import useDebounce from '../../hooks/useDebounce';
import { useCustomerSearch } from '../../hooks/useFetchData/useCustomerSearch';

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
  const { customers, isLoading } = useCustomers();
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
        loadingState={isLoading}
        customerTypes={customerTypes}
      />
      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '2', lg: '2rem' }}>
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
        <Card
          variant={'outline'}
          width="full"
          rounded={'xl'}
          shadow={'sm'}
          size={{ base: 'md', lg: 'lg' }}>
          <CardBody>
            <Stack
              direction={{ base: 'column-reverse', lg: 'row' }}
              mb={'24px'}
              mx={'1rem'}
              spacing="auto"
              gap={6}>
              <Flex alignItems={'center'} gap={8} justifyContent={'center'}>
                <Flex>
                  <Icon as={FiUsers} boxSize={'6'} my={'auto'} />
                  <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
                    Customers
                  </Text>
                </Flex>
              </Flex>
              <Flex gap={5} justifyContent={'center'}>
                <Flex w={'full'}>
                  <form>
                    <FormControl>
                      <Flex flexDir={'row'} w={'full'}>
                        <Input
                          value={searchCustomer}
                          onChange={({ target }) => setSearchCustomer(target.value)}
                          placeholder="Search for Customer"
                          colorScheme="blue"
                          size={'md'}
                          width={{ base: 'full', lg: '250px' }}
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
            </Stack>
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
