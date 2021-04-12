import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import Invoice from "./Invoice/Invoice";

function formatPhoneNumber(value) {
    //if value is falsy eg if the user deletes the input, then just return 
    if(!value) return value;

    //clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 10)}`;
}

function Invoices() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();
    const url = 'http://localhost:8081/api';

    // States to manage data
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [invoices, getInvoices] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [inputValue, SetInputValue] = useState("");

    // Functions to program functions
    useEffect(() => {
        getAllInvoices();
    }, []);

    const getAllInvoices = async() => {
        await axios.get(`${url}/invoices/`)
        .then((response) => {
            const allInvoices = response.data
            //add our data to state
            getInvoices(allInvoices);
            console.log(allInvoices);
        })
        .catch(error => console.error(`Error: ${error}`));

    }

    // const getAllCustomersByName = async(event) => {
    //     event.preventDefault();
    //     axios.get(`${url}/customers/?name=${searchCustomer}`)
    //     .then((response) => {
    //         const results = response.data;
    //         //add data to old state to update it
    //         getCustomers(results);
    //         this.customers(results);
    //     })
    //     .catch(error => console.error(`Error: ${error}`));
    // }


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

    const handlePhoneInput = (e) => {
        //This is where we'll call our future formatPhoneNumber function
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        //We'll set the input value using our setInputValue
        SetInputValue(formattedPhoneNumber);
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
                                    <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer name'/>
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
