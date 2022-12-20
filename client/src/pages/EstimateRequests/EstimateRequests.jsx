import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, Flex, Box, Text, Button, useToast, Input, InputGroup, InputLeftAddon, FormHelperText, TableContainer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Tooltip, useColorModeValue, border, Icon } from '@chakra-ui/react';
import { Card, EditEstimateRequestForm, DeleteAlertDialog, NewEstimateRequestForm, NewCustomerForm } from '../../components';
import supabase from '../../utils/supabaseClient';
import formatNumber from '../../utils/formatNumber';
import { MdKeyboardArrowLeft, MdPersonAddAlt1, MdEdit, MdDelete, MdSearch, MdAddBox, MdPostAdd, MdFilterAlt, MdFilterList } from 'react-icons/md';
import formatPhoneNumber from '../../utils/formatPhoneNumber';
import {
    FiInbox
  } from "react-icons/fi";

const EstimateRequests = () => {
    // Chakra UI Modal
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
    const initialRef = React.useRef();
    //Define toast from chakra ui
    const toast = useToast()

    // React Use State to store data from API requests
    const [estimateRequests, setEstimateRequests] = useState(null);
    const [searchEstimateRequestsInput, setSearchEstimateRequestsInput] = useState('');
    const [selectedEstimateRequestObject, setSelectedEstimateRequestObject] = useState({ id: '', est_request_status_id: '', requested_date: '', service_type_id: '', streetAddress: '', city: '', state: '', zipcode: '', firstName: '', lastName: '', email: '', customer_typeID: '', phone_number: '' })
    const [selectedEstimateRequestId, setSelectedEstimateRequestId] = useState('');
    const [selectedEstimateRequestNumber, setSelectedEstimateRequestNumber] = useState('');

    const [inputValue, SetInputValue] = useState("");

    //Chakra UI styling parameters
    const bg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    useEffect(() => {
        getQuoteRequests();
    }, [])

    // Get all quote requests
    const getQuoteRequests = async () => {
        const { data: requests, error } = await supabase
            .from('quote_request')
            .select('*')
            .order('est_request_status_id', { ascending: true })
            .order('created_at', { ascending: false })

        if (error) {
            console.log(error)
        }
        setEstimateRequests(requests);
        // console.log(requests);
    }

    // Search for customer quote request
    const searchEstimateRequest = async (event) => {
        event.preventDefault();

        if (searchEstimateRequestsInput === '') {
            // let { data: requests, error } = await supabase
            //     .from('quote_request')
            //     .select('*')

            // if (error) {
            //     console.log(error)
            // }
            // searchEstimateRequestsInput(requests)
            // setEstimateRequests(requests)
            getQuoteRequests();
        } else {
            let { data: qrSearchResult, error } = await supabase
                .from('quote_request')
                .select('*')
                .or(`firstName.ilike.%${searchEstimateRequestsInput}%,lastName.ilike.%${searchEstimateRequestsInput}%,email.ilike.%${searchEstimateRequestsInput}%,phone_number.ilike.%${searchEstimateRequestsInput}%`)

            if (error) {
                console.log(error)
            }
            console.log(qrSearchResult)
            // setCustomers(customersSearchResult);
            setEstimateRequests(qrSearchResult)
        }
    }

    //Handles alert box to user when they click to delete data
    const handleDeleteAlert = (estimateRequestId, estimateRequestNumber) => {
        setSelectedEstimateRequestId(estimateRequestId);
        // setSelectedEstimateRequestNumber(estimateRequestNumber);
        onDeleteOpen()
    }

    //Function that shows a toast once the user creates a new qr
    const handleNewToast = (requestId) => {
        toast({
            position: 'top-right',
            title: `Quote Request created!`,
            description: "We've created a new quote request for you 🚀",
            status: 'success',
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

    //Function that shows a toast once the user confirmed that the data has been updated
    const handleEditChangeToast = (requestId) => {
        toast({
            position: 'top-right',
            title: `QR# ${requestId} updated!`,
            description: "We've updated quote request for you 🚀",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    //Function that shows a toast when the user click to save qr as a customer
    const handleEmailValidationToastError = (requestId) => {
        toast({
            position: 'top-right',
            title: `Customer already exist!`,
            description: `${requestId[0].email} email already exist! 🚀`,
            status: 'error',
            duration: 5000,
            isClosable: true
        })
    }

    //Function that shows a toast when the user click to save qr as a customer
    const handleEmailValidationToastSuccess = (requestId) => {
        toast({
            position: 'top-right',
            title: `New customer has been saved!`,
            description: `Customer with ${requestId} email has been saved! 🚀`,
            status: 'success',
            duration: 5000,
            isClosable: true
        })
    }

    //Formats SQL date from DB to present in GUI table
    const handleSQLFormatDate = (date) => {
        let parsedDate = new Date(Date.parse(date));
        let options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
        let dateString = parsedDate.toLocaleDateString('en-US', options);
        return dateString
    }

    //Handles edit data 
    const handleEdit = (estimate_request) => {
        // setSelectedEstimateRequestObject(estimate_request);
        setSelectedEstimateRequestObject({ id: estimate_request.id, est_request_status_id: estimate_request.est_request_status_id, customer_typeID: estimate_request.customer_typeID, requested_date: estimate_request.requested_date, service_type_id: estimate_request.service_type_id, streetAddress: estimate_request.streetAddress, city: estimate_request.city, state: estimate_request.state, zipcode: estimate_request.zipcode, firstName: estimate_request.firstName, lastName: estimate_request.lastName, email: estimate_request.email, phone_number: estimate_request.phone_number });
        onEditOpen();
    }

    //Handles the cancel button in the modal form for editing QR
    const handleEditCancel = () => {
        onEditClose();
        setSelectedEstimateRequestObject({ id: '', est_request_status_id: '', requested_date: '', service_type_id: '', streetAddress: '', city: '', state: '', zipcode: '', firstName: '', lastName: '', email: '' })
    }

    //Handles changes made to the fields made by the user and updates the React State
    const handleEditChange = (e) => {
        setSelectedEstimateRequestObject({ ...selectedEstimateRequestObject, [e.target.name]: e.target.value });
        // console.log(selectedEstimateRequestObject.streetAddress)
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('quote_request')
            .update({
                id: selectedEstimateRequestObject.id,
                service_type_id: selectedEstimateRequestObject.service_type_id,
                est_request_status_id: selectedEstimateRequestObject.est_request_status_id,
                requested_date: selectedEstimateRequestObject.requested_date,
                firstName: selectedEstimateRequestObject.firstName,
                lastName: selectedEstimateRequestObject.lastName,
                streetAddress: selectedEstimateRequestObject.streetAddress,
                city: selectedEstimateRequestObject.city,
                state: selectedEstimateRequestObject.state,
                zipcode: selectedEstimateRequestObject.zipcode,
                email: selectedEstimateRequestObject.email,
                phone_number: selectedEstimateRequestObject.phone_number,
                customer_typeID: selectedEstimateRequestObject.customer_typeID,
                updated_at: new Date()
            })
            .eq('id', selectedEstimateRequestObject.id)
            
        if(error) {
            console.log(error)
        }
        onEditClose();
        setSelectedEstimateRequestObject({ id: '', est_request_status_id: '', requested_date: '', service_type_id: '', streetAddress: '', city: '', state: '', zipcode: '', firstName: '', lastName: '', email: '' });
        await getQuoteRequests();
        handleEditChangeToast(selectedEstimateRequestObject.id)
        // console.log(selectedEstimateRequestObject)
    }

    //Handles to determine if email alredy exist in DB
    const handleEmailValidation = async (request) => {
        const { data: resEmail, error } = await supabase
            .from('customer')
            .select('id, customer_type_id, email, phone_number, first_name, last_name, street_address, zipcode, state')
            .eq('email', `${request.email}`)

        if (error) {
            console.log(error);
        }
        // console.log(resEmail.length)
        if (resEmail.length === 0) {
            // console.log('Email is not available in DB!')
            // console.log(request)
            const { error } = await supabase
                .from('customer')
                .insert({
                    first_name: request.firstName,
                    last_name: request.lastName,
                    street_address: request.streetAddress,
                    city: request.city,
                    state: request.state,
                    zipcode: request.zipcode,
                    phone_number: request.phone_number,
                    email: request.email,
                    customer_type_id: request.customer_typeID,
                })

            if(error){
                console.log(error)
            }
            
            handleEmailValidationToastSuccess(request.email);
        } else {
            // console.log('Email is available in DB.')
            handleEmailValidationToastError(resEmail);
        }
    }

    return (
        <>
            <NewEstimateRequestForm isOpen={isNewOpen} onClose={onNewClose} initialRef={initialRef} updateQRData={getQuoteRequests} toast={handleNewToast} />
            <EditEstimateRequestForm initialRef={initialRef} handleSubmit={handleEditSubmit} isOpen={isEditOpen} handleEditCancel={handleEditCancel} objectData={selectedEstimateRequestObject} handleEditOnChange={handleEditChange} />
            <DeleteAlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} toast={handleDeleteToast} updateParentState={getQuoteRequests} itemId={selectedEstimateRequestId} itemNumber={selectedEstimateRequestId} tableName={'quote_request'} header={`Delete QR # ${selectedEstimateRequestId}`} body={`Are you sure? You can't undo this action afterwards.`} />
            <VStack my={'2rem'} w='100%' mx={'auto'} px={{base: '1rem', lg: '2rem'}}>
                {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button shadow={'sm'} colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>Back</Button>
                    </Link>
                </Box> */}
                <Card width='full' bg={bg} borderColor={borderColor}>
                    <HStack mt={'1rem'} mb={'2rem'}>
                        <Flex display={'flex'} mr={'auto'} alignItems={'center'} ml={'24px'}>
                            <Icon as={FiInbox} boxSize={'7'}/>
                            <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Quote Requests</Text>
                        </Flex>
                        <Box display='flex' pr='1rem' mr={'1rem'} justifyContent={'end'} >
                            <form method='GET' onSubmit={searchEstimateRequest}>
                                <FormControl display={'flex'}>
                                    <Input value={searchEstimateRequestsInput} onChange={({ target }) => setSearchEstimateRequestsInput(target.value)} placeholder='Search for Request' colorScheme='blue' border='2px' />
                                    <Tooltip label='Search'><Button ml={'1rem'} type='submit'><MdSearch size={'25px'} /></Button></Tooltip>
                                </FormControl>
                            </form>
                            <Tooltip label='Filter'><Button colorScheme={'gray'} ml='2rem'><MdFilterAlt size={'20px'} /></Button></Tooltip>
                            <Tooltip label='Sort'><Button colorScheme={'gray'} ml='1rem'><MdFilterList size={'20px'} /></Button></Tooltip>
                            <Tooltip label='Create New Request'><Button colorScheme='blue' variant='solid' onClick={onNewOpen} ml='1rem'><MdPostAdd size={'20px'} /></Button></Tooltip>
                        </Box>

                    </HStack>
                    <TableContainer overflow={'auto'}>
                        <Table variant='simple' size={'sm'}>
                            <TableCaption>Total of {estimateRequests?.length} requests in our system ✌️</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>QR #</Th>
                                    <Th textAlign={'center'}>Status</Th>
                                    <Th textAlign={'center'}>Service</Th>
                                    <Th>Desired Date</Th>
                                    <Th>Customer Type</Th>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Phone Number</Th>
                                    <Th textAlign={'center'}>Address</Th>
                                    <Th textAlign={'center'}>Entry Date</Th>
                                    <Th textAlign={'center'}>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {estimateRequests?.map((request, index) => (
                                    <Tr key={request.id}>
                                        <Td textAlign={'center'}><Text fontWeight={'bold'} fontSize={'md'}>{formatNumber(request.id)}</Text></Td>
                                        <Td textAlign={'center'}>{request.est_request_status_id === 1 ? <><Text textColor={'white'} bg={'green.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>New</Text></> : '' || request.est_request_status_id === 2 ? <><Text textColor={'white'} bg={'blue.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Scheduled</Text></> : '' || request.est_request_status_id === 5 ? <><Text textColor={'white'} bg={'red.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Closed</Text></> : '' || request.est_request_status_id === 3 ? <><Text textColor={'white'} bg={'yellow.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Pending</Text></> : ''}</Td>
                                        <Td textAlign={'center'}><Text>{request.service_type_id === 1 ? 'Roof Replacement' : ''}{request.service_type_id === 2 ? 'Roof Leak Repair' : ''}{request.service_type_id === 3 ? 'Roof Maintenance' : ''}</Text></Td>
                                        <Td><Text>{handleSQLFormatDate(request.requested_date)}</Text></Td>
                                        <Td>{request.customer_typeID === 1 ? <><Text textColor={'white'} bg={'blue.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Residential</Text></> : '' || request.customer_typeID === 2 ? <><Text textColor={'white'} bg={'purple.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Commercial</Text></> : '' || request.customer_typeID === 3 ? <><Text textColor={'white'} bg={'yellow.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Other</Text></> : ''}</Td>
                                        <Td><Text>{request.firstName}</Text><Text>{request.lastName}</Text></Td>
                                        <Td><Text>{request.email}</Text></Td>
                                        <Td><Text>{request.phone_number ? request.phone_number : 'Not Available ❌'}</Text></Td>
                                        <Td><Text cursor={'pointer'} _hover={{ textColor: "blue" }} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${request.streetAddress}+${request.city}+${request.state}+${request.zipcode}`)}>{request.streetAddress} {request.city}, {request.state} {request.zipcode}</Text></Td>
                                        <Td><Text>{new Date(request.created_at).toLocaleString()}</Text></Td>
                                        <Td textAlign={'center'}><Tooltip label='Edit'><Button mr={'1rem'} onClick={() => { handleEdit(request) }}><MdEdit /></Button></Tooltip><Tooltip label='Delete'><Button mr={'1rem'} onClick={() => { handleDeleteAlert(request.id) }}><MdDelete /></Button></Tooltip><Tooltip label='Save as Customer'><Button onClick={() => handleEmailValidation(request)}><MdAddBox /></Button></Tooltip></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </VStack>
        </>
    )
}

export default EstimateRequests