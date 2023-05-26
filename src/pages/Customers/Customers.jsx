import React, { useState } from 'react';
import {
  NewCustomerForm,
  CustomerTable,
  PageHeader,
  CustomerFilterBar,
  CustomerStatsCards
} from '../../components';
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
  IconButton,
  useToast,
  Skeleton,
  Card,
  CardBody,
  useColorModeValue,
  StatHelpText,
  StatArrow,
  Stat
} from '@chakra-ui/react';
import { IoMdPersonAdd } from 'react-icons/io';
// import { MdSearch } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { useFetchCustomers, useSearchCustomers } from '../../hooks/useAPI/useCustomers';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/useCustomerTypes';
import useDebounce from '../../hooks/useDebounce';
import { Building, ChevronUp, MoreHorizontal, MoreVertical, Store, Users } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { MdArrowBack } from 'react-icons/md';

export default function Customers() {
  // Custom React Hook to use Customers with useState
  const { data: customerTypes } = useFetchAllCustomerTypes();

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
  const { data: customerSearchResult, isLoading: customerIsLoading } = useSearchCustomers(
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
      <VStack my={'4'} w="100%" mx={'auto'} px={{ base: '4', lg: '8' }} gap={4}>
        <PageHeader
          title={'Customers'}
          subheading={'Manage customers and view information focused on them.'}
          addItemButtonText="Add customer"
          onOpen={onOpen}
        />
        <CustomerStatsCards />
        <CustomerFilterBar />
        {/* Card Element for display main data for page */}
        <Card width="full" rounded={'lg'} size={{ base: 'md', lg: 'md' }}>
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
