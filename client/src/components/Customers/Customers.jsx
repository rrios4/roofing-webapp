import React, {useState, useEffect} from 'react';
import Customer from './Customer/Customer';
import { Select, Flex, Box, Text, Button, Input, InputGroup, InputLeftAddon, FormHelperText, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import supabase from '../../utils/supabaseClient'
import stateJSONData from '../../data/state_titlecase.json'
import CustomerTypeOptions from './Customer/CustomerTypeOptions';
import StateOptions from '../StateOptions';
import formatPhoneNumber from '../../utils/formatPhoneNumber';

export default function Customers() {

        //GET data from API
        const [customers, getCustomers] = useState('');
        const [searchCustomer, setSearchCustomer] = useState('');

        // useStates that pick up the values from the input fields of the form
        const [firstName, setfirstName] = useState('');
        const [lastName, setlastName] = useState('');
        const [address, setAddress] = useState('');
        const [city, setCity] = useState('');
        const [state, setState] = useState('');
        const [zipcode, setZipcode] = useState('');
        const [email, setEmail] = useState('');
        const [customerTypes, setcustomerTypes] = useState('')
        const [selectedCustomerType, setselectedCustomerType] = useState('')
        const [states, setstates] = useState('')

        const [inputValue, SetInputValue] = useState("");

        useEffect(() => {
            // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
            // if (!localStorage.getItem('supabase.auth.token')) {
            //     history.push('/login');
            // }
            getAllCustomers();
            getAllCustomerTypes();
            setstates(stateJSONData)
        }, []);

        // Gets a list of all customers stored in supabase DB
        const getAllCustomers = async() => {
            let { data: customer, error } = await supabase 
            .from('customer')
            .select('*')

            if(error){
                console.log(error)
            }

            getCustomers(customer)
        }

        // Gets a list of all customer types stored in supabase DB
        const getAllCustomerTypes = async() => {
            let { data: customerTypes, error} = await supabase
            .from('customer_type')
            .select('*')

            if(error){
                console.log(error)
            }
            setcustomerTypes(customerTypes)
        }

        // Search for customer based on first name, last name, or email address
        const getAllCustomersByName = async(event) => {
            event.preventDefault();
            if(searchCustomer === ''){
                let { data: customers, error } = await supabase
                .from('customer')
                .select('*')
                if(error){
                    console.log(error)
                }
                getCustomers(customers)
            } else {
                let {data: customersSearchResult, error } = await supabase
                .from('customer')
                .select('*')
                .or(`first_name.ilike.%${searchCustomer}%,last_name.ilike.%${searchCustomer}%,email.ilike.%${searchCustomer}%,phone_number.ilike.%${searchCustomer}%`)
    
                if(error){
                    console.log(error)
                }
                console.log(customersSearchResult)
                getCustomers(customersSearchResult);
            }
        }

        const { isOpen, onOpen, onClose } = useDisclosure();
        const initialRef = React.useRef();
        //const finalRef = React.useRef();

        const handlePhoneInput = (e) => {
            //This is where we'll call our future formatPhoneNumber function
            const formattedPhoneNumber = formatPhoneNumber(e.target.value);
            //We'll set the input value using our setInputValue
            SetInputValue(formattedPhoneNumber);
        }
        
        // Function that will make the POST request from axios to create new customer
        const handleSubmit = async(event) => {
            event.preventDefault();

            let { data, error } = await supabase
            .from('customer')
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    street_address: address,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                    phone_number: inputValue,
                    email: email,
                    customer_type_id: selectedCustomerType,
                }
            ])

            if(error){
                console.log(error)
            }
            console.log(data)
            console.log('Submit Function works!')
            //history.go(0);
            getAllCustomers(); setfirstName(''); setlastName(''); setAddress(''); setCity(''); setZipcode(''); SetInputValue(''); setEmail(''); setselectedCustomerType(''); setState('');
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
                        <Text color='red' textAlign='center'>Fill all fields please!</Text>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Customer Type</FormLabel>
                                    <Select placeholder='Select Customer Type' onChange={(e) => {setselectedCustomerType(e.target.value)}}>
                                        <CustomerTypeOptions customerTypes={customerTypes}/>
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>First Name</FormLabel>
                                    <Input value={firstName} onChange={({target}) => setfirstName(target.value)} id='name' ref={initialRef} placeholder='First Name'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Last Name</FormLabel>
                                    <Input value={lastName} onChange={({target}) => setlastName(target.value)} id='name' ref={initialRef} placeholder='Last Name'/>
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
                                    {/* <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/> */}
                                    <Select placeholder='Select State' onChange={(e) => {setState(e.target.value)}}>
                                        <StateOptions states={states}/>
                                    </Select>
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


