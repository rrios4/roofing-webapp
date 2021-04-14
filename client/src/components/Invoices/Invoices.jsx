import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import Invoice from "./Invoice/Invoice";

function Invoices() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();
    const url = 'http://localhost:8081/api';

    //React States to manage data
    const [invoices, getInvoices] = useState('');
    const [customers, setCustomers] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [inputValue, SetInputValue] = useState("");

    // Functions to program functions
    useEffect(() => {
        getAllInvoices();
        getCustomers();
        console.log(getCustomers())
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
        })
        .catch(error => console.error(`Error: ${error}`))
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = 'http://localhost:8081/api/customers/add'
        const json = {
            name: name,
            address: address,
            city: city,
            state: state,
            phone_number: inputValue,
            email: email
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
        // getAllCustomers();
        // setCustomerName('');
        // setAddress('');
        // setCity('');
        // setZipcode('');
        // SetInputValue('');
        // setEmail('');
    };

    const handleOnInputchange = (e) => {
        const query = e.target.value;

    }
    
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
                                        <Select placeholder='Select Customer'>
                                            <option>{customers.name}</option>
                                        </Select>
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
                                    <Select placeholder='Select Job Type'>
                                        <option value='Option 1'>New Roof</option>
                                        <option value='Option 2'>Roof Repair</option>
                                        <option value='Option 3'>Construction</option>
                                    </Select>
                                    {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Invoice Status</FormLabel>
                                    <Select placeholder='Select Invoice Status'>
                                        <option value='Option 1'>Paid</option>
                                        <option value='Option 2'>Pending</option>
                                        <option value='Option 3'>Outstanding</option>
                                    </Select>
                                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Invoice Date</FormLabel>
                                    <Input type='date' value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Due Date</FormLabel>
                                    <Input type='date' value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                    <Input id='phone' placeholder='Service Name' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Amount Due</FormLabel>
                                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Amount due' type='number'/>
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
