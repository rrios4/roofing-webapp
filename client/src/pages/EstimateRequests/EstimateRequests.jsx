import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { Select, Flex, Box, Text, Button, useToast, Input, InputGroup, InputLeftAddon, FormHelperText, TableContainer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Tooltip, useColorModeValue, border} from '@chakra-ui/react';
import { Card, EditEstimateRequestForm, DeleteAlertDialog, NewEstimateRequestForm, NewCustomerForm } from '../../components';
import supabase from '../../utils/supabaseClient';
import formatNumber from '../../utils/formatNumber';
import { MdKeyboardArrowLeft, MdPersonAddAlt1, MdEdit, MdDelete, MdSearch, MdAddBox, MdPostAdd, MdFilterAlt, MdFilterList } from 'react-icons/md';

const EstimateRequests = () => {
    // Chakra UI Modal
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose} = useDisclosure();
    const initialRef = React.useRef();
    //Define toast from chakra ui
    const toast = useToast()

    // React Use State to store data from API requests
    const [estimateRequests, setEstimateRequests] = useState(null);
    const [searchEstimateRequestsInput, setSearchEstimateRequestsInput] = useState('');
    const [selectedEstimateRequestObject, setSelectedEstimateRequestObject] = useState('')
    const [selectedEstimateRequestId, setSelectedEstimateRequestId] = useState('');
    const [selectedEstimateRequestNumber, setSelectedEstimateRequestNumber] = useState('');

    //Chakra UI styling parameters
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    useEffect(() => {
        getQuoteRequests();
    }, [])
    
    // Get all quote requests
    const getQuoteRequests = async() => {
        const {data: requests, error} = await supabase
        .from('quote_request')
        .select('*')

        if(error){
            console.log(error)
        }
        setEstimateRequests(requests);
        console.log(requests);
    }

    // Search for customer quote request
    const searchEstimateRequest = async(event) => {
        event.preventDefault();

        if(searchEstimateRequestsInput === ''){
            let {data: requests, error} = await supabase
            .from('quote_request')
            .select('*')

            if(error){
                console.log(error)
            }
            // searchEstimateRequestsInput(requests)
            setEstimateRequests(requests)
        } else{
            let {data: qrSearchResult, error } = await supabase
            .from('quote_request')
            .select('*')
            .or(`firstName.ilike.%${searchEstimateRequestsInput}%,lastName.ilike.%${searchEstimateRequestsInput}%,email.ilike.%${searchEstimateRequestsInput}%,phone_number.ilike.%${searchEstimateRequestsInput}%`)

            if(error){
                console.log(error)
            }
            console.log(qrSearchResult)
            // setCustomers(customersSearchResult);
            setEstimateRequests(qrSearchResult)
        }
    }

    const handleDeleteAlert = (estimateRequestId, estimateRequestNumber) => {
        setSelectedEstimateRequestId(estimateRequestId);
        // setSelectedEstimateRequestNumber(estimateRequestNumber);
        onDeleteOpen()
    }

    const handleDeleteToast = (requestId) => {
        toast({
            position: 'top-right',
            title: `Quote Request #${requestId} deleted!`,
            description: "We've deleted estimate for you.",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    const handleEdit = (estimate_request) => {
        setSelectedEstimateRequestObject(estimate_request);
        onEditOpen()
    }

    const handleSQLFormatDate = (date) => {
        let parsedDate = new Date(Date.parse(date));
        let options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC'};
        let dateString = parsedDate.toLocaleDateString('en-US', options);
        return dateString
    }


  return (
    <>
    <NewEstimateRequestForm isOpen={isNewOpen} onClose={onNewClose} initialRef={initialRef} updateQRData={getQuoteRequests}/>
    <EditEstimateRequestForm initialRef={initialRef} isOpen={isEditOpen} onClose={onEditClose} objectData={selectedEstimateRequestObject}/>
    <DeleteAlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} toast={handleDeleteToast} updateParentState={getQuoteRequests} itemId={selectedEstimateRequestId} itemNumber={selectedEstimateRequestId} tableName={'quote_request'} header={`Delete QR # ${selectedEstimateRequestId}`} body={`Are you sure? You can't undo this action afterwards.`}/>
    <VStack my={'2rem'} w='100%' mx={'auto'} px='2rem'>
        <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
            <Link to={'/'}>
                <Button shadow={'sm'} colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
            </Link>
        </Box>
        <Card width='full' bg={bg} borderColor={borderColor}>
            <HStack mt={'1rem'} mb={'2rem'}>
                <Box display={'flex'} mr={'auto'}>
                    <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Quote Requests</Text>
                </Box>
                <Box display='flex' pr='1rem' mr={'1rem'} justifyContent={'end'} >
                    <form method='GET' onSubmit={searchEstimateRequest}>
                        <FormControl display={'flex'}>
                            <Input value={searchEstimateRequestsInput} onChange={({target}) => setSearchEstimateRequestsInput(target.value)} placeholder='Search for Request' colorScheme='blue' border='2px'/>
                            <Tooltip label='Search'><Button ml={'1rem'} type='submit'><MdSearch size={'25px'}/></Button></Tooltip>
                        </FormControl>
                    </form>
                    <Tooltip label='Filter'><Button colorScheme={'gray'} ml='2rem'><MdFilterAlt size={'20px'}/></Button></Tooltip>
                    <Tooltip label='Sort'><Button colorScheme={'gray'} ml='1rem'><MdFilterList size={'20px'}/></Button></Tooltip>
                    <Tooltip label='Create New Request'><Button colorScheme='blue' variant='solid' onClick={onNewOpen} ml='1rem'><MdPostAdd size={'20px'}/></Button></Tooltip>
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
                                <Td textAlign={'center'}><Text color={'white'}>{request.est_request_status_id === 1 ? <><Text bg={'green.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>New</Text></>: '' || request.est_request_status_id === 2 ? <><Text bg={'blue.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Scheduled</Text></>: '' || request.est_request_status_id === 5 ? <><Text bg={'red.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Closed</Text></>: '' || request.est_request_status_id === 3 ? <><Text bg={'yellow.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Pending</Text></>: ''  }</Text></Td>
                                <Td textAlign={'center'}><Text>{request.service_type_id === 1 ? 'Roof Replacement' : ''}{request.service_type_id === 2 ? 'Roof Leak Repair' : ''}{request.service_type_id === 3 ? 'Roof Maintenance' : ''}</Text></Td>
                                <Td><Text>{handleSQLFormatDate(request.requested_date)}</Text></Td>
                                <Td><Text>{request.firstName}</Text><Text>{request.lastName}</Text></Td>
                                <Td><Text>{request.email}</Text></Td>
                                <Td><Text>{request.phone_number ? request.phone_number : 'Not Available ❌'}</Text></Td>
                                <Td><Text cursor={'pointer'} _hover={{textColor: "blue"}} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${request.streetAddress}+${request.city}+${request.state}+${request.zipcode}`)}>{request.streetAddress} {request.city}, {request.state} {request.zipcode}</Text></Td>
                                <Td><Text>{new Date(request.created_at).toLocaleString()}</Text></Td>
                                <Td textAlign={'center'}><Tooltip label='Edit'><Button mr={'1rem'} onClick={() => {handleEdit(request)}}><MdEdit/></Button></Tooltip><Tooltip label='Delete'><Button mr={'1rem'} onClick={() => {handleDeleteAlert(request.id)}}><MdDelete/></Button></Tooltip><Tooltip label='Save as Customer'><Button><MdAddBox/></Button></Tooltip></Td>
                            </Tr>
                        ))}
                        {/* <Customer customers={customers}/> */}
                        {/* {customers?.map((customer) => (
                            <Tr key={customer.id} _hover={{ bg: "gray.100" }} rounded='md'>
                                <Td>{customer.first_name} {customer.last_name}</Td>
                                <Td>{customer.email}</Td>
                                <Td>{customer.phone_number}</Td>
                                <Td width='250px'>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Td>
                                <Td><Button colorScheme={'yellow'} variant='outline'>Edit</Button> <Button colorScheme={'red'} variant='outline'>Delete</Button> <Button colorScheme={'blue'} variant='outline'><MdKeyboardArrowRight size={'20px'}/></Button></Td>
                            </Tr>
                        ))} */}
                    </Tbody>

                </Table>
            </TableContainer>
        </Card>
    </VStack>
    </>
  )
}

export default EstimateRequests