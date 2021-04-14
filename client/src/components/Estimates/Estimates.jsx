import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import Estimate from './Estimate/Estimate';

function Estimates() {
    //Defining variables
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();
    const url = 'http://localhost:8081/api';

    // States to manage data
    const [estimates, getEstimates] = useState('');
    const [customers, setCustomers] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [inputValue, SetInputValue] = useState("");

    //React Render Hook
    useEffect(() => {
        getAllEstimates();
        getCustomers();
    }, []);

    //Functions for API calls or handling events across UI
    const getAllEstimates = async() => {
        await axios.get(`${url}/estimates/`)
        .then((response) => {
            const allEstimates = response.data
            //add our data to state
            getEstimates(allEstimates);
            console.log(allEstimates)
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


    return (
        <main>
            <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Create New Estimate</ModalHeader>
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
                                    <FormLabel pt='1rem'>Estimate Status</FormLabel>
                                    <Select placeholder='Select Invoice Status'>
                                        <option value='Option 1'>Paid</option>
                                        <option value='Option 2'>Pending</option>
                                        <option value='Option 3'>Outstanding</option>
                                    </Select>
                                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Date</FormLabel>
                                    <Input type='date' value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Expiration Date</FormLabel>
                                    <Input type='date' value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                    <Input id='phone' placeholder='Service Name' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Total</FormLabel>
                                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Amount due' type='number'/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel pt='1rem'>Sqft Roof Measurement</FormLabel>
                                    <Input type='number' placeholder='Sqft of Roof'></Input>
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
                                    <Input value={searchCustomer} onChange={({target}) => setSearchCustomer(target.value)} placeholder='Search Customer Name' colorScheme='blue' border='2px'/>
                                    <FormHelperText textAlign='right'>Press Enter key to search</FormHelperText>
                                </FormControl>
                            </form>
                        </Box>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='2rem' pl='1rem' pr='1rem' >
                    <Box>
                        <Text letterSpacing='1px' fontWeight='normal' fontSize='4xl'>Estimates</Text>
                        <Text>There is a total of {estimates.length} estimates</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid' onClick={onOpen}>
                            New Estimate
                        </Button>
                    </Box>
                </Box>
                <Box p='1rem' color='white' >
                    <Estimate estimates={estimates} />                
                </Box>
            </Flex>
        </main>
    )
}

export default Estimates
