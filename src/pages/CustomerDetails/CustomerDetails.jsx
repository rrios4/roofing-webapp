import React, { useEffect, useState } from 'react'
import { Grid, Box, Flex, Modal, useColorModeValue, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Button, FormHelperText, Text, useDisclosure, Stack, VStack, HStack, Image, StackDivider, Spinner, useToast, Container, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Card, CardBody } from '@chakra-ui/react';
import Select from "react-select";
import supabase from '../../utils/supabaseClient';
import formatPhoneNumber from '../../utils/formatPhoneNumber';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerDetailsCard, EditCustomerForm, DeleteAlertDialog } from '../../components'
import { MdKeyboardArrowLeft, MdLocationOn, MdEmail, MdPhone, MdOutlineDateRange } from 'react-icons/md';
import {
    FiUsers,
    FiInbox,
    FiGrid,
    FiFileText,
} from 'react-icons/fi'
import { TbRuler } from "react-icons/tb";

const CustomerDetails = (props) => {
    const navigate = useNavigate();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast()

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    // const {id} = props.match.params;
    const { id } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();
    //GET data from API
    const [customer, getCustomer] = useState('');

    // Customer Registered Date
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let customerDate = customer ? new Date(`${customer.created_at}`).toLocaleDateString('en-us', options) : <><Spinner size={'xs'} /></>;

    // States that pick up the values from the input fields of the form
    const [selectedCustomerObject, setSelectedCustomerObject] = useState({ id: '', customer_type_id: '', first_name: '', last_name: '', street_address: '', city: '', state: '', zipcode: '', phone_number: '', email: '' })

    // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        // if (!localStorage.getItem('supabase.auth.token')) {
        //     history.push('/login');
        // }
        getAllCustomer();
    }, []);

    const getAllCustomer = async () => {
        let { data: customerById, error } = await supabase
            .from('customer')
            .select('*')
            .eq('id', `${id}`)

        if (error) {
            console.log(error)
        }
        getCustomer(customerById[0])

    }

    // Toast that shows up when there is a success when editing and request was sent succefully
    const handleCustomerEditToast = () => {
        toast({
            position: 'top-right',
            title: `Customer updated!`,
            description: "We've updated customer for you 🎉.",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    // Toast to show up when there is success when sending the request to deleting customer
    const handleCustomerSuccessDeleteToast = () => {
        toast({
            position: 'top-right',
            title: `Customer deleted!`,
            description: "We've deleted customer for you 🎉.",
            status: 'success',
            duration: 5000,
            isClosable: true
        })
    }

    // Toast that shows up when there is an error when sending the request to deleting customer
    const handleCustomerErrorDeleteToast = (error) => {
        toast({
            position: 'top-right',
            title: 'Error Occured!',
            description: `Message: ${error}`,
            status: 'error',
            duration: 5000,
            isClosable: true
        })
    }

    // Function that does action to delete customer by id from DB
    const handleModalDeleteOnClick = async () => {
        let { data, error } = await supabase
            .from('customer')
            .delete()
            .eq('id', `${id}`)

        if (error) {
            console.log(error)
        }
        console.log(data)
        // history.push("/customers")
        if (error) {
            console.log(error)
            handleCustomerErrorDeleteToast()
        }
        if(data){
            handleCustomerSuccessDeleteToast()
        }

        navigate("/customers")
    }

    // Handles customer edit data
    const handleCustomerEdit = (customer) => {
        setSelectedCustomerObject({ id: customer.id, customer_type_id: customer.customer_type_id, first_name: customer.first_name, last_name: customer.last_name, street_address: customer.street_address, city: customer.city, state: customer.state, zipcode: customer.zipcode, phone_number: customer.phone_number, email: customer.email })
        onEditOpen()
    }

    // Handles customer edit data change
    const handleCustomerEditChange = (e) => {
        setSelectedCustomerObject({ ...selectedCustomerObject, [e.target.name]: e.target.value });
    }

    // Handles the customer edit cancel form button
    const handleCustomerEditCancel = () => {
        onEditClose();
        setSelectedCustomerObject({ id: '', customer_type_id: '', first_name: '', last_name: '', street_address: '', city: '', state: '', zipcode: '', phone_number: '', email: '' })
    }

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
            .match({ id: customer?.id })

        if (error) {
            console.log(error);
            handleCustomerErrorUpdateToast();
        }
        await getAllCustomer()
        onEditClose()
        handleCustomerSuccessUpdateToast()
        setSelectedCustomerObject({ id: '', customer_type_id: '', first_name: '', last_name: '', street_address: '', city: '', state: '', zipcode: '', phone_number: '', email: '' })
    }

    // Toast to show up when there is success when sending the request to deleting customer
    const handleCustomerSuccessUpdateToast = () => {
        toast({
            position: 'top-right',
            title: `Customer updated!`,
            description: "We've updated customer for you 🎉.",
            status: 'success',
            duration: 5000,
            isClosable: true
        })
    }


    // Toast that shows up when there is an error when sending the request to update customer
    const handleCustomerErrorUpdateToast = (error) => {
        toast({
            position: 'top-right',
            title: 'Error Occured!',
            description: `Message: ${error}`,
            status: 'error',
            duration: 5000,
            isClosable: true
        })
    }

    //Function that shows a toast once the user confirmed that the data has been deleted
    const handleDeleteToast = (requestId) => {
        toast({
            position: 'top-right',
            title: `Quote Request #${requestId} deleted!`,
            description: "We've deleted quote request for you 🚀",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }


    return (
        <Container maxWidth={'1400px'}>
            <Flex direction='column' pb='2rem' pt='2rem'>
                <VStack spacing={4}>
                    {/* Back Button */}
                    <Box display={'flex'} justifyContent='start' w='full'>
                        <Link to={'/customers'}>
                            <Button variant={'outline'} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>Back</Button>
                        </Link>
                    </Box>
                    {/* Customer Details Card Info  Component */}
                    <CustomerDetailsCard bg={bg} borderColor={borderColor} onOpen={() => handleCustomerEdit(customer)} deleteCustomer={onDeleteOpen} customer={customer} customerDate={customerDate} />
                    {/* Customer Estimates Card */}
                    <Card width={'full'} rounded={'xl'}>
                        <CardBody>
                            <Accordion allowToggle>
                                <AccordionItem borderTop={'0px'} borderBottom={'0px'}>
                                    <h2>
                                        <AccordionButton rounded={'md'}>
                                            <FiFileText size={'20px'} />
                                            <Box as='span' flex='1' textAlign='left' fontWeight={'bold'} fontSize={'md'} ml={'4'}>
                                                Customer's Invoices
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} >

                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                    {/* Customer Invoices Card */}
                    <Card w={'full'} rounded={'xl'}>
                        <CardBody rounded={'xl'}>
                            <Accordion allowToggle>
                                <AccordionItem borderTop={'0px'} borderBottom={'0px'}>
                                    <h2>
                                        <AccordionButton rounded={'md'}>
                                            <TbRuler size={'20px'} />
                                            <Box as='span' flex='1' textAlign='left' fontWeight={'bold'} fontSize={'md'} ml={'4'}>
                                                Customer's Quotes
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} >

                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </VStack>

                {/* Edit Form Modal */}
                <EditCustomerForm 
                isOpen={isEditOpen} 
                onClose={handleCustomerEditCancel} 
                customer={selectedCustomerObject} 
                updateParentState={getAllCustomer} 
                toast={handleCustomerEditToast} 
                handleEditSubmit={handleEditSubmit} 
                handleEditOnChange={handleCustomerEditChange} />

                {/* Modal to prompt the user that they will be deleting a user */}
                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader textAlign={'center'}>Delete Customer</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text fontWeight={'bold'} mb={'1rem'}>Are you sure you want to delete: <Text as="span" textColor={useColorModeValue('blue.400', 'blue.500')}>{customer.first_name} {customer.last_name}</Text>? </Text>
                            <Text>Once you confirm there will be no way to restore the customer's information. 😢</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme={'red'} onClick={handleModalDeleteOnClick}>Delete</Button>
                            <Button variant={'solid'} ml={3} onClick={onDeleteClose}>Close</Button>
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
    )
}

export default CustomerDetails;
