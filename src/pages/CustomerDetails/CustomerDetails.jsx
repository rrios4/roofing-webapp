import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  Button,
  Text,
  useDisclosure,
  VStack,
  Spinner,
  useToast,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Badge,
  Skeleton
} from '@chakra-ui/react';

import supabase from '../../utils/supabaseClient';
import { Link, useParams } from 'react-router-dom';
import {
  CustomerDetailsCard,
  EditCustomerForm,
  ConnectedCustomerDeleteAlertDialog,
  CustomerInvoicesTable
} from '../../components';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { FiArrowRight, FiFileText } from 'react-icons/fi';
import { TbRuler } from 'react-icons/tb';
import { formatDate, formatMoneyValue, formatNumber } from '../../utils';
import { useCustomerTypes } from '../../hooks/useCustomerTypes';

const CustomerDetails = () => {
  // React Hooks
  const toast = useToast();
  const { customerTypes } = useCustomerTypes();

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { id } = useParams();
  // const {id} = props.match.params;

  // React State to store array of objects from GET request API
  const [customer, getCustomer] = useState();
  const [customerInvoicesById, setCustomerInvoicesById] = useState();
  const [customerQuotesById, setCustomerQuotesById] = useState();

  // States that pick up the values from the input fields of the form
  const [selectedCustomerObject, setSelectedCustomerObject] = useState({
    id: '',
    customer_type_id: '',
    first_name: '',
    last_name: '',
    street_address: '',
    city: '',
    state: '',
    zipcode: '',
    phone_number: '',
    email: ''
  });

  useEffect(() => {
    // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
    // if (!localStorage.getItem('supabase.auth.token')) {
    //     history.push('/login');
    // }
    getAllCustomer();
    getAllQuotesByCustomerId();
    getAllInvoicesByCustomerId();
  }, []);

  const getAllCustomer = async () => {
    const { data: customerById, error } = await supabase
      .from('customer')
      .select('*, customer_type:customer_type_id(*)')
      .eq('id', `${id}`);

    if (error) {
      console.log(error);
    }
    getCustomer(customerById[0]);
    // console.log(customerById)
  };

  const getAllQuotesByCustomerId = async () => {
    const { data: quotes, error } = await supabase
      .from('quote')
      .select('*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)')
      .eq('customer_id', `${id}`);

    if (error) {
      console.log(error);
    }
    setCustomerQuotesById(quotes);
  };

  const getAllInvoicesByCustomerId = async () => {
    const { data, error } = await supabase
      .from('invoice')
      .select(
        '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)'
      )
      .eq('customer_id', `${id}`);

    if (error) {
      console.log(error);
    }
    // console.log(data)
    setCustomerInvoicesById(data);
  };

  // Handles customer edit data
  const handleCustomerEdit = (customer) => {
    setSelectedCustomerObject({
      id: customer.id,
      customer_type_id: customer.customer_type_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      street_address: customer.street_address,
      city: customer.city,
      state: customer.state,
      zipcode: customer.zipcode,
      phone_number: customer.phone_number,
      email: customer.email
    });
    onEditOpen();
  };

  // Handles customer edit data change
  const handleCustomerEditChange = (e) => {
    setSelectedCustomerObject({ ...selectedCustomerObject, [e.target.name]: e.target.value });
  };

  // Handles the customer edit cancel form button
  const handleCustomerEditCancel = () => {
    onEditClose();
    setSelectedCustomerObject({
      id: '',
      customer_type_id: '',
      first_name: '',
      last_name: '',
      street_address: '',
      city: '',
      state: '',
      zipcode: '',
      phone_number: '',
      email: ''
    });
  };

  // Handles the submittion of data to make the updates to the DB
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('customer')
      .update({
        first_name: selectedCustomerObject.first_name,
        last_name: selectedCustomerObject.last_name,
        email: selectedCustomerObject.email,
        phone_number: selectedCustomerObject.phone_number,
        street_address: selectedCustomerObject.street_address,
        city: selectedCustomerObject.city,
        state: selectedCustomerObject.state,
        zipcode: selectedCustomerObject.zipcode,
        customer_type_id: selectedCustomerObject.customer_type_id
      })
      .match({ id: customer?.id });

    if (error) {
      console.log(error);
      // handleCustomerErrorUpdateToast();
      toast({
        position: 'top',
        title: 'Error Occured!',
        description: `Message: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      toast({
        position: 'top',
        title: `Customer updated!`,
        description: `We've updated customer with email ${selectedCustomerObject.email} data 🎉.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    await getAllCustomer();
    onEditClose();
    // handleCustomerSuccessUpdateToast();

    setSelectedCustomerObject({
      id: '',
      customer_type_id: '',
      first_name: '',
      last_name: '',
      street_address: '',
      city: '',
      state: '',
      zipcode: '',
      phone_number: '',
      email: ''
    });
  };

  // Customer Registered Date
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  let customerDate = customer ? (
    new Date(`${customer.created_at}`).toLocaleDateString('en-us', options)
  ) : (
    <>
      <Spinner size={'xs'} />
    </>
  );

  return (
    <Container maxWidth={'1400px'} h={'full'}>
      {/* Edit Form Modal */}
      <EditCustomerForm
        isOpen={isEditOpen}
        onClose={handleCustomerEditCancel}
        customer={selectedCustomerObject}
        updateParentState={getAllCustomer}
        toast={toast}
        handleEditSubmit={handleEditSubmit}
        handleEditOnChange={handleCustomerEditChange}
        customerTypes={customerTypes}
      />

      {/* Modal to prompt the user that they will be deleting a user */}
      <ConnectedCustomerDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        // updateParentState={getAllCustomer}
        header={'Delete Customer'}
        entityDescription={`${customer?.first_name} ${customer?.last_name} ${customer?.email}`}
        body={`You can't undo this action afterwards. This will delete all information that pertained to the customer from quotes and invoices! 🚨`}
        itemNumber={customer?.id}
      />

      <Flex direction="column" pb="2rem" pt="2rem" h={'full'}>
        <VStack spacing={4} h={'full'}>
          {/* Back Button */}
          <Box display={'flex'} justifyContent="start" w="full">
            <Link to={'/customers'}>
              <Button
                variant={'outline'}
                ml={'1rem'}
                mb="1rem"
                leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>
                Back
              </Button>
            </Link>
          </Box>
          <Flex w={'full'} direction={{ base: 'column', lg: 'row' }} gap={'6'}>
            {/* Customer Details Card Info  Component */}
            <CustomerDetailsCard
              bg={bg}
              borderColor={borderColor}
              onOpen={() => handleCustomerEdit(customer)}
              deleteCustomer={onDeleteOpen}
              customer={customer}
              customerDate={customerDate}
            />
            <Flex w={'full'} h={'full'} gap={4} direction={{ base: 'column', lg: 'column' }}>
              {/* Customer Invoices Card */}
              <Box w={'full'}>
                <Accordion
                  rounded={'xl'}
                  p={2}
                  shadow={'md'}
                  bg={useColorModeValue('white', 'gray.700')}
                  defaultIndex={[0]}
                  allowMultiple>
                  <AccordionItem borderTop={'0px'} borderBottom={'0px'}>
                    <h2>
                      <AccordionButton rounded={'md'}>
                        <FiFileText size={'20px'} />
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontWeight={'bold'}
                          fontSize={'md'}
                          ml={'4'}>
                          {"Customer's Invoices"}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {/* Table */}
                      <CustomerInvoicesTable data={customerInvoicesById} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>

              {/* Customer Quotes Card */}
              <Box w={'full'}>
                <Accordion
                  rounded={'xl'}
                  p={2}
                  shadow={'md'}
                  bg={useColorModeValue('white', 'gray.700')}
                  defaultIndex={[0]}
                  allowMultiple>
                  <AccordionItem borderTop={'0px'} borderBottom={'0px'}>
                    <h2>
                      <AccordionButton rounded={'md'}>
                        <TbRuler size={'20px'} />
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontWeight={'bold'}
                          fontSize={'md'}
                          ml={'4'}>
                          <Text>{"Customer's Quotes"}</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {!customerQuotesById ? (
                        <Skeleton h={'20px'} w={'full'} />
                      ) : (
                        <>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Th>Quote#</Th>
                                  <Th>Status</Th>
                                  <Th>Date</Th>
                                  <Th>Exp Date</Th>
                                  <Th>Total</Th>
                                  <Th>Action</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {customerQuotesById?.map((item, index) => (
                                  <Tr key={index}>
                                    <Td>{formatNumber(item.quote_number)}</Td>
                                    <Td>
                                      <Badge
                                        w={'80px'}
                                        textAlign={'center'}
                                        my={'auto'}
                                        p={2}
                                        rounded={'xl'}
                                        colorScheme={
                                          item.quote_status.name === 'Accepted'
                                            ? 'green'
                                            : item.quote_status.name === 'Pending'
                                            ? 'yellow'
                                            : item.quote_status.name === 'Rejected'
                                            ? 'red'
                                            : 'gray'
                                        }>
                                        {item.quote_status.name}
                                      </Badge>
                                    </Td>
                                    <Td>{formatDate(item.quote_date)}</Td>
                                    <Td>{formatDate(item.expiration_date)}</Td>
                                    <Td>{formatMoneyValue(item.total)}</Td>
                                    <Td>
                                      <Link to={`/editestimate/${item.quote_number}`}>
                                        <IconButton icon={<FiArrowRight />} />
                                      </Link>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Flex>
          </Flex>
        </VStack>
      </Flex>
    </Container>
  );
};

export default CustomerDetails;
