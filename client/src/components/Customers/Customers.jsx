import React, {useState, useEffect} from 'react';
//import {Grid} from '@material-ui/core';
import Customer from './Customer/Customer';
import {VStack, Grid, Stack, Flex, Box, Text, Button, IconButton, Input, InputGroup, InputLeftAddon, FormHelperText, NumberInput, NumberInputField, Form, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import {useHistory} from 'react-router-dom';
import axios from 'axios';

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

export default function Customers() {
        let history = useHistory();

        //GET data from API
        const [customers, getCustomers] = useState('');
        const [searchCustomer, setSearchCustomer] = useState('');
        const url = 'http://localhost:8081/api';
        const query = `/?name=${searchCustomer}`

        useEffect(() => {
            // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
            if (!localStorage.getItem('currentUser')) {
                history.push('/login');
            }
            getAllCustomers();
        }, []);

        const getAllCustomers = async() => {
            await axios.get(`${url}/customers`)
            .then((response) => {
                const allCustomers = response.data
                //add our data to state
                getCustomers(allCustomers);
            })
            .catch(error => console.error(`Error: ${error}`));
        }

        const getAllCustomersByName = async(event) => {
            event.preventDefault();
            axios.get(`${url}/customers/?name=${searchCustomer}`)
            .then((response) => {
                const results = response.data;
                //add data to old state to update it
                getCustomers(results);
                this.customers(results);
            })
            .catch(error => console.error(`Error: ${error}`));
        }

        const { isOpen, onOpen, onClose } = useDisclosure();
        const initialRef = React.useRef();
        //const finalRef = React.useRef();

        const [inputValue, SetInputValue] = useState("");

        const handlePhoneInput = (e) => {
            //This is where we'll call our future formatPhoneNumber function
            const formattedPhoneNumber = formatPhoneNumber(e.target.value);
            //We'll set the input value using our setInputValue
            SetInputValue(formattedPhoneNumber);
        }

        // States that pick up the values from the input fields of the form
        const [name, setCustomerName] = useState('');
        const [address, setAddress] = useState('');
        const [city, setCity] = useState('');
        const [state, setState] = useState('');
        const [zipcode, setZipcode] = useState('');
        const [email, setEmail] = useState('');
        
        // Function that will make the POST request from axios
        const handleSubmit = async(event) => {
            event.preventDefault();
            const url2 = 'http://localhost:8081/api/customers/add'
            const json = {
                name: name,
                address: address,
                city: city,
                state: state,
                zipcode: zipcode,
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
            getAllCustomers();
            setCustomerName('');
            setAddress('');
            setCity('');
            setZipcode('');
            SetInputValue('');
            setEmail('');
        };

    return (
        <main>
        {/* <Grid container justify="center" spacing={4}>
            {customers.map((customer) => (
                <Grid item key={customer.id} xs={12} sm={6} md={4} lg={3}>
                        <Customer customer={customer} />
                </Grid>
            ))}
        </Grid> */}
            <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Create New Customer</ModalHeader>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Customer Name</FormLabel>
                                    <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer name'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Address</FormLabel>
                                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>City</FormLabel>
                                    <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>State</FormLabel>
                                    <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Zipcode</FormLabel>
                                    <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Phone Number</FormLabel>
                                    <InputGroup>
                                    <InputLeftAddon children="+1" />
                                    <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Email</FormLabel>
                                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
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
                            <form method='GET' onSubmit={getAllCustomersByName}>
                                <FormControl>
                                    <Input value={searchCustomer} onChange={({target}) => setSearchCustomer(target.value)} placeholder='Search for Customer' colorScheme='blue' border='2px'/>
                                    <FormHelperText textAlign='right'>Press Enter key to search</FormHelperText>
                                </FormControl>
                            </form>
                        </Box>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='2rem' pl='1rem' pr='1rem' >
                    <Box>
                        <Text fontSize='4xl'> Customers</Text>
                        <Text>There is a total of {customers.length} customers</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid' onClick={onOpen}>
                            New Customer 
                        </Button>
                    </Box>
                </Box>
                <Box p='1rem' color='white' >
                        <Customer customers={customers} />                
                </Box>
            </Flex>
            {/* <Flex justify='center' flexDirection='column' p={2}>
                {customers.map((customer) => (
                        <Box p={2}  item key={customer.id} xs={12} sm={6} md={4} lg={3}>
                                <Customer customer={customer} />
                        </Box>
                    ))}
            </Flex> */}
             
    </main>
    )
}


