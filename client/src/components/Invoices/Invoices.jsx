import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import Invoice from "./Invoice/Invoice";
import SelectCustomers from './SelectCustomers';
import AsyncSelect from 'react-select/async';

function Invoices() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();
    const url = 'http://localhost:8081/api';

    //React States to manage data
    const [invoices, getInvoices] = useState('');
    const [customers, setCustomers] = useState('');
    const [customerInput, setCustomerInput] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [name, setCustomerName] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [selectInvoiceStatus, setSelectInvoiceStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [inputValue, SetInputValue] = useState('');
    const [selectJobTypeOption, setJobTypeOption] = useState('');

    // Functions to program events or actions
    useEffect(() => {
        getAllInvoices();
        getCustomers();
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

    const getCustomers = async() => {
        await axios.get('http://localhost:8081/api/customers')
        .then((response) => {
            const allCustomers = response.data;
            //add data to state
            setCustomers(allCustomers);
            console.log(allCustomers)
        })
        .catch(error => console.error(`Error: ${error}`))
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = 'http://localhost:8081/api/invoices/add'
        const json = {
            customerId: "1",
            jobTypeId: selectJobTypeOption,
            invStatusId: selectInvoiceStatus,
            service_name: serviceName,
            inv_date: invoiceDate,
            due_date: dueDate,
            amount_due: `$${amountDue}`
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

    const handleCustomerInput = (e) => {
        const value = e.target.value;
        setCustomerInput(value);
        
    };

    return (
        <main>
            <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Create New Invoice</ModalHeader>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Customer Name</FormLabel>
                                        {/* <Dropdown options={customers} selection onChange={customerInput} defaultValue={null} placeholder='Select Customer'/> */}
                                        {/* <Select defaultValue={null} placeholder='Select Customer'>
                                            <SelectCustomers customers={customers}/>
                                        </Select> */}
                                        {/* <pre>customerInput: "{customerInput}"</pre> */}
                                        <AsyncSelect options={customers} placeholder='Select Customer'/>
                                        {/* {customers.map(customer => {
                                            return(
                                                <main>
                                                    <Select>
                                                        <option>{customer.name}</option>
                                                    </Select>
                                                </main>
                                            )
                                        })} */}
                                    {/* <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer name'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Job Type</FormLabel>
                                    <Select defaultValue={null} value={selectJobTypeOption} placeholder='Select Job Type' onChange={(e) => handleJobTypeInput(e)}>
                                        <option value='1'>New Roof Installation</option>
                                        <option value='2'>Roof Repair</option>
                                        <option value='3'>Construction</option>
                                    </Select>
                                    {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
                                </FormControl>
                                <FormControl isRequired={true}>
                                    <FormLabel pt='1rem'>Invoice Status</FormLabel>
                                    <Select defaultValue={null} value={selectInvoiceStatus} placeholder='Select Invoice Status' onChange={(e) => handleInvoiceStatusInput(e)}>
                                        <option value='1'>Paid</option>
                                        <option value='2'>Pending</option>
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
                            <form method='GET' >
                                <FormControl>
                                    <Input value={searchCustomer} onChange={({target}) => setSearchCustomer(target.value)} placeholder='Search Invoices Name' colorScheme='blue' border='2px'/>
                                    <FormHelperText textAlign='right'>Press Enter key to search</FormHelperText>
                                </FormControl>
                            </form>
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
