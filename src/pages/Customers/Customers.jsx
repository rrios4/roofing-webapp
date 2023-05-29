import React, { useState } from 'react';
import {
  NewCustomerForm,
  PageHeader,
  CustomerFilterBar,
  CustomerStatsCards
} from '../../components';
import { useDisclosure, VStack, useToast } from '@chakra-ui/react';
import { useFetchCustomers, useSearchCustomers } from '../../hooks/useAPI/useCustomers';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/useCustomerTypes';
import useDebounce from '../../hooks/useDebounce';
import DataTable from '../../components/ui/DataTable';
import customerColumns from '../../components/Customers/Tables/CustomerColumns';

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
  const customerTableData = React.useMemo(async () => customers, []);

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
        <DataTable
          data={customers}
          columns={customerColumns}
          entity={'customer'}
          isLoading={isLoading}
          activateModal={onOpen}
        />
      </VStack>
    </>
  );
}
