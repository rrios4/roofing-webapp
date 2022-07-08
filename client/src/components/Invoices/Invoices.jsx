import React, {useState, useEffect} from 'react';
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Formik, Select, useColorModeValue, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, VStack, Td, Tr, Tooltip, Th, Tbody, TableCaption, Table, Thead, HStack, border} from '@chakra-ui/react';
import axios from 'axios';
import Invoice from "./Invoice/Invoice";
import AsyncSelect from 'react-select/async';
import swal from 'sweetalert';
import supabase from '../../utils/supabaseClient';
import { TableContainer } from '@material-ui/core';
import { Card, CustomerOptions } from '../';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdPostAdd, MdSearch, MdKeyboardArrowRight, MdEdit, MdDelete, MdFilterList, MdFilterAlt } from 'react-icons/md';

function Invoices() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let navigate = useNavigate();

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    //React States to manage data
    const [invoices, getInvoices] = useState(null);
    const [customers, setCustomers] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [cuIdCaptured, setCuIdCaptured] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [selectInvoiceStatus, setSelectInvoiceStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [selectJobTypeOption, setJobTypeOption] = useState('');
    const [searchInvoiceInput, setSearchInvoiceInput] = useState('');

    // Functions to program events or actions
    useEffect(() => {
        getAllInvoices();
        // getCustomers();
    }, []);

    const getAllInvoices = async() => {
        const {data: allInvoices, error} = await supabase
        .from('invoice')
        .select('*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)')

        if(error){
            console.log(error)
        }
        getInvoices(allInvoices)
        console.log(allInvoices)
    }

    const searchInvoice = async() => {

    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/invoices/add`
        const json = {
            customerId: cuIdCaptured,
            jobTypeId: selectJobTypeOption,
            invStatusId: selectInvoiceStatus,
            service_name: serviceName,
            inv_date: invoiceDate,
            due_date: dueDate,
            amount_due: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountDue)}`
        }
        await axios.post(url2, json)
        .then((response) => {
            console.log('I was submitted', response);
        })
        .catch((err) => {
            console.error(err);
            swal("Good job!", "You clicked the button!", "error");
        })
        console.log('Submit Function works!')
        //history.go(0);
        setJobTypeOption('');
        setSelectInvoiceStatus('');
        setServiceName('');
        setInvoiceDate('');
        setDueDate('');
        setAmountDue('');
        getAllInvoices();
    };

    const handleJobTypeInput = (e) => {
        const selectedValue = e.target.value;
        setJobTypeOption(selectedValue);
    };
    
    const handleInvoiceStatusInput = (e) => {
        const selectedValue = e.target.value;
        setSelectInvoiceStatus(selectedValue);
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

    const loadOptions = async (inputText, callback) => {
        await axios.get(`http://${process.env.REACT_APP_BASE_URL}:8081/api/customers/?name=${inputText}`)
        .then((response) => {
            // const allCustomers = response.data;
            //add data to state
            // setCustomers(allCustomers);
            callback(response.data.map(customer =>({label: customer.name, value: customer.id, email: customer.email})))
        })
        .catch(error => console.error(`Error: ${error}`))
    };

    const formValidation = (value) => {
        let error
        if(!value){
            error = 'Field is required'
        } 

        return error;
    }

    return (
        <VStack my={'2rem'} w='100%' mx={'auto'} px='4rem'>
            <Box display={'flex'} marginBottom={'1rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
                    </Link>
                </Box>
                <Card width='full' bg={bg} borderColor={borderColor}>
                    <HStack my={'1rem'}>
                        <Box display={'flex'} mr={'auto'}>
                            <Text fontSize={'2xl'} fontWeight='medium' p={'2'} mx='14px'>Invoices</Text>
                        </Box>
                        <Box display='flex' pr='1rem' mr={'1rem'} justifyContent={'end'} >
                            <form method='GET' onSubmit={searchInvoice}>
                                <FormControl display={'flex'}>
                                    <Input value={searchInvoiceInput} onChange={({target}) => setSearchInvoiceInput(target.value)} placeholder='Search for Invoice' colorScheme='blue' border='2px'/>
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
                                <TableCaption>Total of {invoices?.length} Invoices in our system ✌️</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th textAlign={'center'}>Invoice#</Th>
                                        <Th textAlign={'center'}>Status</Th>
                                        <Th textAlign={'center'}>Service Type</Th>
                                        <Th textAlign={'center'}>Invoice Date</Th>
                                        <Th textAlign={'center'}>Issue Date</Th>
                                        <Th textAlign={'center'}>Due Date</Th>
                                        <Th textAlign={'center'}>Customer Name</Th>
                                        <Th textAlign={'center'}>Customer Email</Th>
                                        <Th textAlign={'center'}>Customer Number</Th>
                                        <Th textAlign={'center'}>Total</Th>
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {invoices?.map((invoice, index) => (
                                        <Tr key={invoice.id}>
                                            <Td textAlign={'center'}><Text>INV-{invoice.invoice_number}</Text></Td>    
                                            <Td textAlign={'center'}><Text>{invoice.invoice_status.name === 'New'? <><Text mx={'auto'} bg={'green.500'} p='1' rounded={'xl'} align='center' w={'80px'}>New</Text></>: 'false'}</Text></Td>
                                            <Td textAlign={'center'}><Text>{invoice.service_type.name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(invoice.invoice_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(invoice.issue_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{ new Date(invoice.due_date).toLocaleDateString()}</Text></Td>
                                            <Td textAlign={'center'}><Text>{invoice.customer.first_name}</Text><Text>{invoice.customer.last_name}</Text></Td>
                                            <Td textAlign={'center'}><Text>{invoice.customer.email}</Text></Td>
                                            <Td textAlign={'center'}><Text>{invoice.customer.phone_number}</Text></Td>
                                            <Td textAlign={'center'}><Text>${(invoice.total).toLocaleString(undefined, {minimumFractionDigits : 2})}</Text></Td>
                                            <Td textAlign={'center'}><Link to={`/editinvoice/${invoice.id}`}><Tooltip label='Edit'><Button mr={'1rem'}><MdEdit/></Button></Tooltip><Tooltip label='Delete'><Button mr={'1rem'}><MdDelete/></Button></Tooltip><Tooltip label='Go to Estimate Details '><Button ml={'0rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td>
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
                        <ModalHeader textAlign='center'>Create New Invoice</ModalHeader>
                        <Text color='red' textAlign='center'>Fill all fields please!</Text>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Customer Name</FormLabel>
                                        <AsyncSelect 
                                            
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
                                            })}/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Job Type</FormLabel>
                                    <Select defaultValue={null} value={selectJobTypeOption} placeholder='Select Job Type' onChange={(e) => handleJobTypeInput(e)}>
                                        <option value='1'>New Roof Installation</option>
                                        <option value='2'>Roof Repairs</option>
                                        <option value='3'>Structure Construction</option>
                                        <option value='4'>Siding Repair</option>
                                        <option value='5'>Roof Maintenance</option>
                                        <option value='6'>Painting Interior of Home</option>
                                        <option value='7'>Painting Exterior of Home</option>
                                        <option value='8'>Flooring Installation</option>
                                    </Select>
                                    {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
                                </FormControl>
                                <FormControl isRequired={true}>
                                    <FormLabel pt='1rem'>Invoice Status</FormLabel>
                                    <Select defaultValue={null} value={selectInvoiceStatus} placeholder='Select Invoice Status' onChange={(e) => handleInvoiceStatusInput(e)}>
                                        <option value='2'>Paid</option>
                                        <option value='1'>Pending</option>
                                        <option value='3'>Outstanding</option>
                                    </Select>
                                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Invoice Date</FormLabel>
                                    <Input type='date' value={invoiceDate} onChange={({target}) => setInvoiceDate(target.value)} id='invDate' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Due Date</FormLabel>
                                    <Input type='date' value={dueDate} onChange={({target}) => setDueDate(target.value)} id='dueDate' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                        <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Amount Due</FormLabel>
                                    <Input value={amountDue} onChange={({target}) => setAmountDue(target.value)} placeholder='Amount due' type='number'/>
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

export default Invoices
