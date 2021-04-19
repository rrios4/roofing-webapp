import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {VStack, Grid, Stack, Flex, Box, Text, Button, IconButton, Input, Form, Modal, ModalBody,ModalOverlay, ModalContent, ModalHeader, useDisclosure, ModalFooter, ModalCloseButton, FormControl, FormLabel, InputGroup, InputLeftAddon, Select, FormHelperText} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import Employee from './Employee/Employee'
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

function Employees() {
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    //GET data from API
    const [employees, getEmployees] = useState('');
    const [searchEmployee, setSearchEmployee] = useState('');
    const url = 'http://localhost:8081/api';

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('username')) {
            history.push('/login');
        }
        getAllEmployees();
    }, []);

    // States that pick up the values from the input fields of the form
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [payrate, setPayrate] = useState('');
    const [empStatus, setEmpStatus] = useState('');
    const [inputValue, SetInputValue] = useState("");

    const getAllEmployees = () => {
        axios.get(`${url}/employees`)
        .then((response) => {
            const allEmployees = response.data
            //add our data to state
            getEmployees(allEmployees);
            console.log(allEmployees)
        })
        .catch(error => console.error(`Error: ${error}`));
    }

    const handlePhoneInput = (e) => {
        //This is where we'll call our future formatPhoneNumber function
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        //We'll set the input value using our setInputValue
        SetInputValue(formattedPhoneNumber);
    }

    // Function that will make the POST request from axios
    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = 'http://localhost:8081/api/employees/add'
        const json = {
            emp_statusId: '1',
            emp_name: name,
            address: address,
            city: city,
            state: state,
            phone_number: inputValue,
            email: email,
            zipcode: zipcode,
            payrate: payrate,
            }
            await axios.post(url2, json)
            .then((response) => {
                console.log('I was submitted', response);
            })
            .catch((err) => {
                console.error(err);
            })
            console.log('Submit Function works!')
            console.log(empStatus)
            //history.go(0);
            getAllEmployees();
            setCustomerName('');
            setAddress('');
            setCity('');
            setZipcode('');
            SetInputValue('');
            setEmail('');
        };

        const getAllEmployeesByName = async(event) => {
            event.preventDefault();
            axios.get(`${url}/employees/?name=${searchEmployee}`)
            .then((response) => {
                const results = response.data;
                //add data to old state to update it
                getEmployees(results);
                this.employees(results);
            })
            .catch(error => console.error(`Error: ${error}`));
        }

        // const statusOptions = [
        //     {value: '1', label: 'Active'},
        //     {value: '2', label: 'Fired'},
        //     {value: '3', label: 'Injured'}
        // ]

    return (
        <main>
            <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Create New Employee</ModalHeader>
                        <Text color='red' textAlign='center'>Fill all fields please!</Text>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Employee Name</FormLabel>
                                    <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Employee name'/>
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
                                {/* <FormControl>
                                    <FormLabel pt='1rem'>Employee Status</FormLabel>
                                    <Select placeholder='Select employee status' option={statusOptions}>
                                        <option value={1} onChange={({target}) => setEmpStatus(target.value)}>Active</option>
                                        <option value={2} onChange={({target}) => setEmpStatus(target.value)}>Fired</option>
                                        <option value={3} onChange={({target}) => setEmpStatus(target.value)}>Injured</option>
                                    </Select>
                                </FormControl> */}
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Payrate ($ per sq.)</FormLabel>
                                    <Input type='number' value={payrate} onChange={({target}) => setPayrate(target.value)}/>
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={onClose} >Save</Button>
                            <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>

                    </ModalContent> 
                </Modal>
            <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
                    <Box display='flex'>
                            <form method='GET' onSubmit={getAllEmployeesByName}>
                                <FormControl>
                                    <Input value={searchEmployee} onChange={({target}) => setSearchEmployee(target.value)} placeholder='Search for Employee' colorScheme='blue' border='2px'/>
                                    <FormHelperText textAlign='right'>Press Enter key to search</FormHelperText>
                                </FormControl>
                            </form>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='3rem' pl='1rem' pr='1rem'>
                    <Box>
                        <Text fontSize='4xl'>Employees</Text>
                        <Text>There is a total of {employees.length} employees</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        {/* Filter By */}
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} onClick={onOpen} colorScheme='blue' variant='solid'>
                            New Employee 
                        </Button>
                    </Box>
                </Box>
                <Box p='1rem' color='white'>
                        <Employee employees={employees} />                
                </Box>
            </Flex>
        </main>
    )
}

export default Employees
