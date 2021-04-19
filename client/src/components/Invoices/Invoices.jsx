import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { Formik, Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import Invoice from "./Invoice/Invoice";
import AsyncSelect from 'react-select/async';
import swal from 'sweetalert'

function Invoices() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();
    const url = 'http://localhost:8081/api';

    //React States to manage data
    const [invoices, getInvoices] = useState('');
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

    // Functions to program events or actions
    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('username')) {
            history.push('/login');
        }
        getAllInvoices();
        // getCustomers();
    }, []);

    const getAllInvoices = async() => {
        await axios.get(`${url}/invoices/`)
        .then((response) => {
            const allInvoices = response.data
            //add our data to state
            getInvoices(allInvoices);
        })
        .catch(error => console.error(`Error: ${error}`));
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = 'http://localhost:8081/api/invoices/add'
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
        await axios.get(`http://localhost:8081/api/customers/?name=${inputText}`)
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
        <main>
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
                <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
                    <Box display='flex'>
                        <Box display='flex' flexDir='column' pr='1rem'>
                            {/* <form method='GET' >
                                <FormControl>
                                    <Input value={searchCustomer} onChange={({target}) => setSearchCustomer(target.value)} placeholder='Search Invoices Name' colorScheme='blue' border='2px'/>
                                    <FormHelperText textAlign='right'>Press Enter key to search</FormHelperText>
                                </FormControl>
                            </form> */}
                        </Box>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='2rem' pl='1rem' pr='1rem' >
                    <Box>
                        <Text fontSize='4xl'>Invoices</Text>
                        <Text>There is a total of {invoices.length} invoices</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid' onClick={onOpen}>
                            New Invoice
                        </Button>
                    </Box>
                </Box>
                <Box p='1rem' color='white' >
                        <Invoice invoices={invoices} />                
                </Box>
            </Flex>
        </main>
    )
}

export default Invoices
