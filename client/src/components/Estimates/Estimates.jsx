import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, Table, Td, ModalCloseButton, HStack, Tooltip, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, VStack, TableCaption, Thead, Tr, Th, Tbody} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import Estimate from './Estimate/Estimate';
import AsyncSelect from 'react-select/async';
import supabase from '../../utils/supabaseClient';
import { MdKeyboardArrowLeft, MdPostAdd, MdSearch, MdKeyboardArrowRight, MdEdit, MdDelete, MdFilterList, MdFilterAlt } from 'react-icons/md';
import { Card, CustomerOptions } from '../';
import { TableContainer } from '@material-ui/core';

function Estimates() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    // let navigate = useNavigate();
    const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

    // States to manage data
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

    return (
            <VStack my={'2rem'} w='100%' mx={'auto'} px='4rem'>
                <Box display={'flex'} marginBottom={'1rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
                    </Link>
                </Box>
                <Card width='full'>
                    <HStack my={'1rem'}>
                        <Box display={'flex'} mr={'auto'}>
                            <Text fontSize={'2xl'} fontWeight='medium' p={'2'} mx='14px'>Estimates</Text>
                        </Box>
                        <Box display='flex' pr='1rem' mr={'1rem'} justifyContent={'end'} >
                            <form method='GET' onSubmit={searchEstimate}>
                                <FormControl display={'flex'}>
                                    <Input value={searchEstimateInput} onChange={({target}) => setSearchEstimateInput(target.value)} placeholder='Search for Request' colorScheme='blue' border='2px'/>
                                    <Tooltip label='Search'><Button ml={'1rem'} type='submit'><MdSearch size={'25px'}/></Button></Tooltip>
                                </FormControl>
                            </form>
                            <Tooltip label='Filter'><Button colorScheme={'gray'} ml='5rem'><MdFilterAlt size={'20px'}/></Button></Tooltip>
                            <Tooltip label='Sort'><Button colorScheme={'gray'} ml='1rem'><MdFilterList size={'20px'}/></Button></Tooltip>
                            <Tooltip label='Create New Estimate'><Button colorScheme='blue' variant='solid' onClick={onOpen} ml='1rem'><MdPostAdd size={'20px'}/></Button></Tooltip>
                        </Box>
                    </HStack>
                    <TableContainer>
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
                                            <Td textAlign={'center'}><Text>EST-{estimate.estimate_number}</Text></Td>    
                                            <Td textAlign={'center'}><Text>{estimate.estimate_status.name === 'Sent'? <><Text mx={'auto'} bg={'yellow.500'} p='1' rounded={'xl'} align='center' w={'80px'}>Sent</Text></>: 'false'}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.service_type.name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(estimate.estimate_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(estimate.issued_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(estimate.expiration_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.first_name}</Text><Text>{estimate.customer.last_name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.email}</Text></Td>
                                            <Td textAlign={'center'}><Text>{estimate.customer.phone_number}</Text></Td>
                                            <Td textAlign={'center'}><Text>${(estimate.total).toLocaleString(undefined, {minimumFractionDigits : 2})}</Text></Td>
                                            <Td textAlign={'center'}><Link to={`/editestimate/${estimate.id}`}><Tooltip label='Edit'><Button mr={'1rem'}><MdEdit/></Button></Tooltip><Tooltip label='Delete'><Button mr={'1rem'}><MdDelete/></Button></Tooltip><Tooltip label='Go to Estimate Details '><Button ml={'0rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td>
                                        </Tr>

                                    ))}
                                </Tbody>
                        </Table>
                    </TableContainer>




                </Card> 
                <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Create New Estimate</ModalHeader>
                        <Text color='red' textAlign='center'>Fill all fields please!</Text>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Customer Name</FormLabel>
                                    {/* <AsyncSelect 
                                            onChange={handleSelectedCustomer} 
                                            loadOptions={loadOptions} 
                                            placeholder='Type Customer Name'
                                            getOptionLabel={option => `${option.label},  ${option.email}`}
                                            theme={theme => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: 'primary',
                                                    primary: 'black',
                                                    neutral0: 'white',
                                                    neutral90: 'white',
                                                },
                                            })}/> */}
                                    <Select placeholder='Select Customer'>
                                        <CustomerOptions customers={customers}/>
                                    </Select>
                                </FormControl>
                                {/* <FormControl isRequired>
                                    <FormLabel pt='1rem'>Job Type</FormLabel>
                                    <Select placeholder='Select Job Type'>
                                        <option value='Option 1'>New Roof Installation</option>
                                        <option value='Option 2'>Roof Repair</option>
                                        <option value='Option 3'>Construction</option>
                                    </Select>
                                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                                </FormControl> */}
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Status</FormLabel>
                                    <Select placeholder='Select Invoice Status' defaultValue={null} value={estStatus} onChange={(e) => handleEstimateStatusInput(e)}>
                                        <option value='2'>Approved</option>
                                        <option value='1'>Pending</option>
                                        <option value='3'>Expired</option>
                                    </Select>
                                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Date</FormLabel>
                                    <Input type='date' value={etDate} onChange={({target}) => setEtDate(target.value)} id='state' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Expiration Date</FormLabel>
                                    <Input type='date' value={expDate} onChange={({target}) => setExpDate(target.value)} id='zipcode' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                    <Input id='service' placeholder='Service Name' value={serviceName} onChange={({target}) => setServiceName(target.value)} />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Total</FormLabel>
                                    <Input value={quotePrice} onChange={({target}) => setQuotedPrice(target.value)} placeholder='Quote price' type='number'/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel pt='1rem'>Sqft Roof Measurement</FormLabel>
                                    <Input type='number' placeholder='Sqft of Roof' value={measurement} onChange={({target}) => setMeasurement(target.value)}></Input>
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={onClose} >Save</Button>
                            <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>

                    </ModalContent> 
                </Modal>
            </Flex>
            </VStack>
    )
}

export default Estimates
