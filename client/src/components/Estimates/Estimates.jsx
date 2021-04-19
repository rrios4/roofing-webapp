import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import {Select, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import Estimate from './Estimate/Estimate';
import AsyncSelect from 'react-select/async';

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
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('username')) {
            history.push('/login');
        }
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
        const url2 = 'http://localhost:8081/api/estimates/add'
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
        await axios.get(`http://localhost:8081/api/customers/?name=${inputText}`)
        .then((response) => {
            // const allCustomers = response.data;
            //add data to state
            // setCustomers(allCustomers);
            callback(response.data.map(customer =>({label: customer.name, value: customer.id, email: customer.email})))
        })
        .catch(error => console.error(`Error: ${error}`))
    }

    return (
        <main>
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
