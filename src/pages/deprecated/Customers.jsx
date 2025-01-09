import React, { useState } from 'react';
import {
  NewCustomerForm,
  PageHeader,
  CustomerStatsCards,
  CustomerFilterBar
} from '../../components/index.js';
import { useDisclosure, VStack, useToast } from '@chakra-ui/react';
import { useFetchCustomers } from '../../hooks/useAPI/useCustomers.js';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/useCustomerTypes.js';
import useDebounce from '../../hooks/useDebounce.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import customerColumns from '../../components/Customers/Tables/CustomerColumns';

export default function Customers() {
  // Chakra UI Hook toast
  const toast = useToast();
  const initialRef = React.useRef();
  //const finalRef = React.useRef();

  // Custom React Hook to use Customers with useState
  const { data: customerTypes } = useFetchAllCustomerTypes();
  const { customers, isLoading } = useFetchCustomers();

  //For opening drawer components
  const { isOpen, onOpen, onClose } = useDisclosure();

  //GET data from API
  // const [customers, setCustomers] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [columnFilters, setColumnFilters] = React.useState([]);

  const debouncedCustomerSearchTerm = useDebounce(searchCustomer, 100);

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
      <VStack
        mt={{ base: '0', lg: '4' }}
        mb={8}
        w="100%"
        mx={'auto'}
        px={{ base: '4', lg: '8' }}
        gap={4}>
        <PageHeader
          title={'Customers'}
          subheading={'Manage customers and view information focused on them.'}
          addItemButtonText="Add customer"
          onOpen={onOpen}
        />
        <CustomerStatsCards />
        <DataTable
          data={customers}
          columns={customerColumns}
          entity={'customer'}
          isLoading={isLoading}
          activateModal={onOpen}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          EntityFilterBar={CustomerFilterBar}
        />
      </VStack>
    </>
  );
}
