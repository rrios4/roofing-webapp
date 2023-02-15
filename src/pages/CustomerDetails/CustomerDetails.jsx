import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Modal,
  useColorModeValue,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
  Badge,
  IconButton,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Skeleton
} from '@chakra-ui/react';
import Select from 'react-select';
import supabase from '../../utils/supabaseClient';
import formatPhoneNumber from '../../utils/formatPhoneNumber';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerDetailsCard, EditCustomerForm, DeleteAlertDialog } from '../../components';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { FiFileText, FiArrowRight } from 'react-icons/fi';
import { TbRuler } from 'react-icons/tb';
import formatDate from '../../utils/formatDate';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatNumber from '../../utils/formatNumber';

const CustomerDetails = (props) => {
  const navigate = useNavigate();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  //Style for Card component
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = useColorModeValue('blue', 'gray');
  const hoverEffectBgColor = useColorModeValue('gray.50', 'gray.800');

  // const {id} = props.match.params;
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  // React State to store array of objects from GET request API
  const [customer, getCustomer] = useState();
  const [customerInvoicesById, setCustomerInvoicesById] = useState();

  // Customer Registered Date
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  let customerDate = customer ? (
    new Date(`${customer.created_at}`).toLocaleDateString('en-us', options)
  ) : (
    <>
      <Spinner size={'xs'} />
    </>
  );

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

  // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

  useEffect(() => {
    // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
    // if (!localStorage.getItem('supabase.auth.token')) {
    //     history.push('/login');
    // }
    getAllCustomer();
    getAllInvoicesByCustomerId();
  }, []);

  const getAllCustomer = async () => {
    let { data: customerById, error } = await supabase
      .from('customer')
      .select('*, customer_type:customer_type_id(*)')
      .eq('id', `${id}`);

    if (error) {
      console.log(error);
    }
    getCustomer(customerById[0]);
    // console.log(customerById)
  };

  const getAllInvoicesByCustomerId = async () => {
    let { data, error } = await supabase
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

  // Function that does action to delete customer by id from DB
  const handleModalDeleteOnClick = async () => {
    let { data, error } = await supabase.from('customer').delete().eq('id', `${id}`);

    if (error) {
      console.log(error);
      // handleCustomerErrorDeleteToast();
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
        title: `Customer deleted!`,
        description: `We've deleted customer with email ${customer.email} for you 🎉.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    navigate('/customers');
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
        zipcode: selectedCustomerObject.zipcode
      })
      .match({ id: customer?.id });

    if (error) {
      console.log(error);
      // handleCustomerErrorUpdateToast();
      toast({
        position: 'top-right',
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
        description: "We've updated customer for you 🎉.",
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

  return (
    <Container maxWidth={'1400px'} h={'full'}>
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
                          Customer's Invoices
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {!customerInvoicesById ? (
                        <>
                          <Skeleton h={'20px'} w={'full'} />
                        </>
                      ) : (
                        <>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Th>INV#</Th>
                                  <Th>Status</Th>
                                  <Th>Date</Th>
                                  <Th>Due Date</Th>
                                  <Th>Total</Th>
                                  <Th>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {customerInvoicesById?.map((item, index) => (
                                  <Tr key={index}>
                                    <Td>
                                      <Text fontWeight={'semibold'}>
                                        {formatNumber(item.invoice_number)}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Badge
                                        w={'80%'}
                                        textAlign={'center'}
                                        my={'auto'}
                                        p={2}
                                        rounded={'xl'}
                                        colorScheme={
                                          item.invoice_status.name === 'Paid'
                                            ? 'green'
                                            : item.invoice_status.name === 'Pending'
                                            ? 'yellow'
                                            : item.invoice_status.name === 'Overdue'
                                            ? 'red'
                                            : 'gray'
                                        }>
                                        {item.invoice_status.name}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Text>{formatDate(item.invoice_date)}</Text>
                                    </Td>
                                    <Td>
                                      <Text>{formatDate(item.due_date)}</Text>
                                    </Td>
                                    <Td>
                                      <Text>${formatMoneyValue(item.total)}</Text>
                                    </Td>
                                    <Td>
                                      <Link to={`/editinvoice/${item.invoice_number}`}>
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

              {/* Customer Quotes Card */}
              <Box w={'full'}>
                <Accordion
                  allowToggle
                  rounded={'xl'}
                  p={2}
                  shadow={'md'}
                  bg={useColorModeValue('white', 'gray.700')}>
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
                          Customer's Quotes
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}></AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Flex>
          </Flex>
        </VStack>

        {/* Edit Form Modal */}
        <EditCustomerForm
          isOpen={isEditOpen}
          onClose={handleCustomerEditCancel}
          customer={selectedCustomerObject}
          updateParentState={getAllCustomer}
          toast={toast}
          handleEditSubmit={handleEditSubmit}
          handleEditOnChange={handleCustomerEditChange}
        />

        {/* Modal to prompt the user that they will be deleting a user */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={'center'}>Delete Customer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight={'bold'} mb={'1rem'}>
                Are you sure you want to delete:{' '}
                <Text as="span" textColor={useColorModeValue('blue.400', 'blue.500')}>
                  {customer?.first_name} {customer?.last_name}
                </Text>
                ?{' '}
              </Text>
              <Text>
                Once you confirm there will be no way to restore the customer's information. 😢
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={'red'} onClick={handleModalDeleteOnClick}>
                Delete
              </Button>
              <Button variant={'solid'} ml={3} onClick={onDeleteClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Tried to implement delete dialog from the component but ended up not working because this depends on the navigate back to the customers page and the component is more meant to be used to update the paretn state of the page */}
        {/* <DeleteAlertDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                updateParentState={getAllCustomer}
                toast={handleDeleteToast}
                header={`Delete ${customer?.first_name} ${customer?.last_name}❓`}
                body={`Are you sure? You can't undo this action afterwards.`}
                tableName={'customer'}
                tableFieldName={'id'}
                itemNumber={id}
                /> */}
      </Flex>
    </Container>
  );
};

export default CustomerDetails;
