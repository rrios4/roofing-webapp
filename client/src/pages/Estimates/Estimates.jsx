import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {Select, Spinner, Box, Flex, useToast, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, Table, TableContainer, Td, ModalCloseButton, HStack, Tooltip, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, VStack, TableCaption, Thead, Tr, Th, Tbody} from '@chakra-ui/react';
import AsyncSelect from 'react-select/async';
import supabase from '../../utils/supabaseClient';
import formatNumber from '../../utils/formatNumber';
import { MdKeyboardArrowLeft, MdPostAdd, MdSearch, MdKeyboardArrowRight, MdEdit, MdDelete, MdFilterList, MdFilterAlt } from 'react-icons/md';
import { Card, CustomerOptions, Estimate, NewEstimateForm, DeleteAlertDialog } from '../../components';

function Estimates() {
    //Defining variables
    const {isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose} = useDisclosure();
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const initialRef = React.useRef();

    //Define toast from chakra ui
    const toast = useToast()

    // let navigate = useNavigate();
    const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    // States to manage data
    const [selectedEstimateId, setSelectedEstimateId] = useState('');
    const [selectedEstimateNumber, setSelectedEstimateNumber] = useState('')

    const [estimates, setEstimates] = useState(null);
    const [customers, setCustomers] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchEstimateInput, setSearchEstimateInput] = useState('')
    const [name, setCustomerName] = useState('');
    const [etDate, setEtDate] = useState('');
    const [expDate, setExpDate] = useState('');
    const [quotePrice, setQuotedPrice] = useState('');
    const [estStatus, setEstStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [measurement, setMeasurement] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [cuIdCaptured, setCuIdCaptured] = useState('');

    //React Render Hook
    useEffect(() => {
        getAllEstimates();
        getCustomers();
    }, []);

    //Functions for API calls or handling events across UI
    const getAllEstimates = async() => {
        const {data: estimates, error} = await supabase
        .from('estimate')
        .select(`*, customer:customer_id(*), estimate_status:est_status_id(*), service_type:service_type_id(*)`)

        if(error){
            console.log(error);
        }

        setEstimates(estimates)
        console.log(estimates)
    }

    const getCustomers = async() => {
        const {data: customers, error} = await supabase
        .from('customer')
        .select('id, first_name, last_name, email')
         
        if(error){
            console.log(error);
        }

        setCustomers(customers)
        console.log(customers)
    }

    const searchEstimate = async() => {

    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/estimates/add`
        const json = {
            etStatusId: estStatus,
            customerId: cuIdCaptured,
            estimate_date: etDate,
            exp_date: expDate,
            sqft_measurement: measurement,
            service_name: serviceName,
            price: `$${quotePrice}`,
            quote_price: `$${quotePrice}`
        }
        await axios.post(url2, json)
        .then((response) => {
            console.log('I was submitted', response);
        })
        .catch((err) => {
            console.error(err);
        })
        console.log('Submit Function works!')
        //history.go(0);
        getAllEstimates();
        setEtDate('');
        setExpDate('');
        setQuotedPrice('');
        setEstStatus('');
        setServiceName('');
        setMeasurement('');
    };

    const handleSelectedCustomer = (selectedCustomer) => {
        // const value = e.target.value;
        // setSelectedCustomer(value)
        setSelectedCustomer({ 
            selectedCustomer: selectedCustomer || []
        })
        // console.log(selectedCustomer.value)
        const selectedCuId = selectedCustomer.value
        // console.log(selectedCustomer.e.value)
        setCuIdCaptured(selectedCuId);
        console.log(selectedCuId);
        // console.log(cuIdCaptured)
    };

    const handleEstimateStatusInput = (e) => {
        const selectedValue = e.target.value;
        setEstStatus(selectedValue);
    }

    const loadOptions = async (inputText, callback) => {
        await axios.get(`http://${process.env.REACT_APP_BASE_URL}:8081/api/customers/?name=${inputText}`)
        .then((response) => {
            // const allCustomers = response.data;
            //add data to state
            // setCustomers(allCustomers);
            callback(response.data.map(customer =>({label: customer.name, value: customer.id, email: customer.email})))
        })
        .catch(error => console.error(`Error: ${error}`))
    }

    const handleDelete = (estimateId, estimate_number) => {
        setSelectedEstimateId(estimateId)
        setSelectedEstimateNumber(estimate_number)
        onDeleteOpen();
    }

    const handleDeleteToast = (estimate_number) => {
        toast({
            position: 'top-right',
            title: `Estimate #${estimate_number} deleted!`,
            description: "We've deleted estimate for you.",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    return (
        <>
            <VStack my={'2rem'} w='100%' mx={'auto'} px='4rem'>
                <Box display={'flex'} marginBottom={'1rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
                    </Link>
                </Box>
                <Card width='full' bg={bg} borderColor={borderColor}>
                    <HStack mt={'1rem'} mb={'2rem'}>
                        <Box display={'flex'} mr={'auto'}>
                            <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Estimates</Text>
                        </Box>
                        <Box display='flex' pr='1rem' mr={'1rem'} justifyContent={'end'} >
                            <form method='GET' onSubmit={searchEstimate}>
                                <FormControl display={'flex'}>
                                    <Input value={searchEstimateInput} onChange={({target}) => setSearchEstimateInput(target.value)} placeholder='Search for Request' colorScheme='blue' border='2px'/>
                                    <Tooltip label='Search'><Button ml={'1rem'} type='submit'><MdSearch size={'25px'}/></Button></Tooltip>
                                </FormControl>
                            </form>
                            <Tooltip label='Filter'><Button colorScheme={'gray'} ml='2rem'><MdFilterAlt size={'20px'}/></Button></Tooltip>
                            <Tooltip label='Sort'><Button colorScheme={'gray'} ml='1rem'><MdFilterList size={'20px'}/></Button></Tooltip>
                            <Tooltip label='Create New Estimate'><Button colorScheme='blue' variant='solid' onClick={onNewOpen} ml='1rem'><MdPostAdd size={'20px'}/></Button></Tooltip>
                        </Box>
                    </HStack>
                    <TableContainer overflow={'auto'}>
                        <Table variant={'simple'} size='sm'>
                                <TableCaption>Total of {estimates?.length} Estimates in our system ✌️</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th textAlign={'center'}>Estimate#</Th>
                                        <Th textAlign={'center'}>Status</Th>
                                        <Th textAlign={'center'}>Service Type</Th>
                                        <Th textAlign={'center'}>Estimate Date</Th>
                                        <Th textAlign={'center'}>Issue Date</Th>
                                        <Th textAlign={'center'}>Expiration Date</Th>
                                        <Th textAlign={'center'}>Customer Name</Th>
                                        <Th textAlign={'center'}>Customer Email</Th>
                                        <Th textAlign={'center'}>Customer Number</Th>
                                        <Th textAlign={'center'}>Total</Th>
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {estimates?.map((estimate, index) => (
                                        <Tr key={estimate.id}>
                                            <Td textAlign={'center'}><Text fontWeight={'bold'}>{estimate.estimate_number ? formatNumber(estimate.estimate_number) : ''}</Text></Td>    
                                            <Td textAlign={'center'}><Text color={'white'}>{estimate.estimate_status.name === 'Sent'? <><Text mx={'auto'} bg={'yellow.500'} p='1' rounded={'xl'} align='center' w={'80px'}>Sent</Text></>: 'false'}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.service_type.name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ estimate.estimate_date ? new Date(estimate.estimate_date).toLocaleDateString(): ''}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ estimate.issued_date ? new Date(estimate.issued_date).toLocaleDateString(): ''}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ estimate.expiration_date ? new Date(estimate.expiration_date).toLocaleDateString() : ''}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.first_name}</Text><Text>{estimate.customer.last_name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.email}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.phone_number}</Text></Td>
                                            <Td textAlign={'center'}><Text>${estimate.total ? (estimate.total).toLocaleString(undefined, {minimumFractionDigits : 2}) : '0'}</Text></Td>
                                            <Td textAlign={'center'}><Tooltip label='Edit'><Button mr={'1rem'}><MdEdit/></Button></Tooltip><Tooltip label='Delete'><Button onClick={() => {handleDelete(estimate.id, estimate.estimate_number)}} mr={'1rem'}><MdDelete/></Button></Tooltip><Link to={`/editestimate/${estimate.id}`}><Tooltip label='Go to Estimate Details '><Button ml={'0rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td>
                                        </Tr>

                                    ))}
                                </Tbody>
                        </Table>
                    </TableContainer>




                </Card> 
            </VStack>
            <NewEstimateForm initialRef={initialRef} isOpen={isNewOpen} onClose={onNewClose}/>
            <DeleteAlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} updateParentState={getAllEstimates} toast={handleDeleteToast} itemId={selectedEstimateId} itemNumber={selectedEstimateNumber} tableName={'estimate'} header={`Delete Estimate #${selectedEstimateNumber}`} body={`Are you sure? You can't undo this action afterwards.`}/>
        </>

    )
}

export default Estimates
