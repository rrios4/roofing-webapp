import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { Select, Flex, Box, Text, Button, Input, InputGroup, InputLeftAddon, FormHelperText, TableContainer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Tooltip, useColorModeValue, border} from '@chakra-ui/react';
import { Card, EditEstimateRequestForm } from '../../components';
import supabase from '../../utils/supabaseClient';
import formatNumber from '../../utils/formatNumber';
import { MdKeyboardArrowLeft, MdPersonAddAlt1, MdEdit, MdDelete, MdSearch, MdAddBox, MdPostAdd, MdFilterAlt, MdFilterList } from 'react-icons/md';

const EstimateRequests = () => {

    // React Use State to store data from API requests
    const [estimateRequests, setEstimateRequests] = useState(null);
    const [searchEstimateRequestsInput, setSearchEstimateRequestsInput] = useState('');

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    useEffect(() => {
        getEstimateRequests();
    }, [])
    
    // Get all estimate requests
    const getEstimateRequests = async() => {
        const {data: requests, error} = await supabase
        .from('estimate_request')
        .select('*')

        if(error){
            console.log(error)
        }
        setEstimateRequests(requests);
        console.log(requests);
    }

    // Search for customer estimate request
    const searchEstimateRequest = async(event) => {
        event.preventDefault();

        if(searchEstimateRequestsInput === ''){
            let {data: requests, error} = await supabase
            .from('estimate_request')
            .select('*')

            if(error){
                console.log(error)
            }
            searchEstimateRequestsInput(requests)
        }
    }

    // Chakra UI Modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();


  return (
    <>
    <EditEstimateRequestForm initialRef={initialRef} isOpen={isOpen} onClose={onClose}/>
    <VStack my={'2rem'} w='100%' mx={'auto'} px='4rem'>
        <Box display={'flex'} marginBottom={'1rem'} justifyContent='start' w='full'>
            <Link to={'/'}>
                <Button shadow={'sm'} colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
            </Link>
        </Box>
        <Card width='full' bg={bg} borderColor={borderColor}>
            <HStack mt={'1rem'} mb={'2rem'}>
                <Box display={'flex'} mr={'auto'}>
                    <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Estimate Requests</Text>
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
                    <Tooltip label='Create New Request'><Button colorScheme='blue' variant='solid' onClick={onOpen} ml='1rem'><MdPostAdd size={'20px'}/></Button></Tooltip>
                </Box>

            </HStack>
            <TableContainer overflow={'auto'}>
                <Table variant='simple' size={'sm'}>
                    <TableCaption>Total of {estimateRequests?.length} requests in our system ✌️</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign={'center'}>Request #</Th>
                            <Th textAlign={'center'}>Status</Th>
                            <Th textAlign={'center'}>Service Type</Th>
                            <Th textAlign={'center'}>Requested Date</Th>
                            <Th textAlign={'center'}>Name</Th>
                            <Th textAlign={'center'}>Email</Th>
                            <Th textAlign={'center'}>Address</Th>
                            <Th textAlign={'center'}>Entry Date</Th>
                            <Th textAlign={'center'}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {estimateRequests?.map((request, index) => (
                            <Tr key={request.id}>
                                <Td textAlign={'center'}><Text>{formatNumber(request.id)}</Text></Td>
                                <Td textAlign={'center'}><Text>{request.est_request_status_id === 1 ? <><Text bg={'green.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>New</Text></>: ''}</Text></Td>
                                <Td textAlign={'center'}><Text>{request.service_type_id === 1 ? 'Roof Replacement' : ''}{request.service_type_id === 2 ? 'Roof Leak Repair' : ''}{request.service_type_id === 3 ? 'Roof Maintenance' : ''}</Text></Td>
                                <Td textAlign={'center'}><Text>{new Date(request.requested_date).toLocaleDateString()}</Text></Td>
                                <Td textAlign={'center'}><Text>{request.firstName}</Text><Text>{request.lastName}</Text></Td>
                                <Td textAlign={'center'}><Text>{request.email}</Text></Td>
                                <Td textAlign={'center'}><Text cursor={'pointer'} _hover={{textColor: "blue"}} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${request.streetAddress}+${request.city}+${request.state}+${request.zipcode}`)}>{request.streetAddress} {request.city}, {request.state} {request.zipcode}</Text></Td>
                                <Td textAlign={'center'}><Text>{new Date(request.created_at).toLocaleString()}</Text></Td>
                                <Td textAlign={'center'}><Tooltip label='Edit'><Button mr={'1rem'} onClick={onOpen}><MdEdit/></Button></Tooltip><Tooltip label='Delete'><Button mr={'1rem'}><MdDelete/></Button></Tooltip><Tooltip label='Save as Customer'><Button><MdAddBox/></Button></Tooltip></Td>
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