import React, {useEffect, useState} from 'react'
import { Box, Flex , Text, ModalBody, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormHelperText, useDisclosure, ModalCloseButton, ButtonGroup, IconButton, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input, Alert, AlertIcon } from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon, CheckIcon, CloseIcon, EditIcon, ArrowLeftIcon} from '@chakra-ui/icons'
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import Employee from './Employee';
import Select from "react-select";

const EmployeeEdit = (props) => {
    const {id} = props.match.params;
    let history = useHistory();
    const url = 'http://localhost:8081/api';
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();

    //GET data from API
    const [Employees, setEmployees] = useState(''); 
    
    // States that pick up the values from the input fields of the form
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [payrate, setPayRate] = useState('');
    const [selectField, setSelectField] = useState('');
    const [inputValue, SetInputValue] = useState("");

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('username')) {
            history.push('/login');
        }
        getAllEmployees();
    }, []);

    // componentDidMount() {
    //     getAllCustomer();
    // }
    
    const getAllEmployees = async () => {
        await axios.get(`${url}/employees/${id}`)
        .then((response) => {
            const allEmployees = response.data
            //add our data to state
            setEmployees(allEmployees);
        })
        .catch(error => console.error(`Error: ${error}`));
    }

    const deleteCustomer = async () => {
        // console.log('Button will perform a delete to the database.');
        await axios.delete(`${url}/employees/${id}`)
        .then((response) => {
            console.log("Employee has been deleted!")
            return <Redirect to='/customers' />
        })
        .catch(error => console.error(`Error: ${error}`));
        history.push("/employees")
                
    }

    const handlePhoneInput = (e) => {
        //This is where we'll call our future formatPhoneNumber function
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        //We'll set the input value using our setInputValue
        SetInputValue(formattedPhoneNumber);
    }  

    const fieldOptions = [
        { value: '1', label: 'Employee Name'},
        { value: '2', label: 'Address'},
        { value: '3', label: 'City'},
        { value: '4', label: 'State'},
        { value: '5', label: 'Zipcode'},
        { value: '6', label: 'Phone Number'},
        { value: '7', label: 'Email'},
        { value: '8', label: 'Payrate'},
        { value: '9', label: 'All Fields'}
    ];

    const handleInputField = (selectField) => {
        setSelectField(selectField.value);
        console.log(selectField);

    }

    const renderInputField = ()=> {
        if(selectField === '1'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Employee Name'/>
                    <FormHelperText>Current Name: {Employees.emp_name}</FormHelperText>
                </Box>
                
            )
        } else if(selectField === '2'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                    <FormHelperText>Current Address: {Employees.address}</FormHelperText>
                </Box>
            )
        } else if(selectField === '3'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                    <FormHelperText>Current City: {Employees.state}</FormHelperText>
                </Box>
            )   
        } else if(selectField === '4'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                    <FormHelperText>Current City: {Employees.city}</FormHelperText>
                </Box>
            )
        } else if(selectField === '5'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                    <FormHelperText>Current Zipcode: {Employees.zipcode}</FormHelperText>
                </Box>
            )
        } else if(selectField === '6'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                    <FormHelperText>Current Phone Number: {Employees.phone_number}</FormHelperText>
                </Box>
            )
        } else if(selectField === '7'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
                    <FormHelperText>Current Email: {Employees.email}</FormHelperText>
                </Box>
            )
        } else if(selectField === '8'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={payrate} onChange={({target}) => setPayRate(target.value)} placeholder='Payrate' type='number'/>
                    <FormHelperText>Current Payrate: ${Employees.payrate}</FormHelperText>
                </Box>
            )    
        } else if(selectField === '9'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Box pb='1rem'>
                        <FormLabel>Customer Name: </FormLabel>
                        <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer Name'/>
                        <FormHelperText>Current Name: {Employees.name}</FormHelperText>
                    </Box>
                    <Box pb='1rem'>
                        <FormLabel>Address: </FormLabel>
                        <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                        <FormHelperText>Current Address: {Employees.address}</FormHelperText>
                    </Box >
                    <Box  pb='1rem'>
                        <FormLabel>City: </FormLabel>
                        <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                        <FormHelperText>Current City: {Employees.city}</FormHelperText>
                    </Box>
                    <Box  pb='1rem'>
                        <FormLabel>State: </FormLabel>
                        <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                        <FormHelperText>Current State: {Employees.state}</FormHelperText>
                    </Box>
                    <Box  pb='1rem'>
                        <FormLabel>Zipcode: </FormLabel>
                        <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                        <FormHelperText>Current Zipcode: {Employees.zipcode}</FormHelperText>
                    </Box>
                    <Box pb='1rem'>
                        <FormLabel>Phone Number: </FormLabel>
                        <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                        <FormHelperText>Current Name: {Employees.phone_number}</FormHelperText>
                    </Box>
                    <Box pt='1rem' >
                        <FormLabel>Email: </FormLabel>
                        <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
                        <FormHelperText>Current Name: {Employees.email}</FormHelperText>
                    </Box>  
                </Box>
                
            )
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://localhost:8081/api/employees/${id}`
        const json = {
            name: name,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            phone_number: inputValue,
            email: email
        }
        console.log('Submit Function works!');
        
        if(selectField === '1'){
            await axios.put(url2, {
                emp_name: name
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '2'){
            await axios.put(url2, {
                address: address
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '3'){
            await axios.put(url2, {
                city: city
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '4'){
            await axios.put(url2, {
                state: state
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '5'){
            await axios.put(url2, {
                zipcode: zipcode
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '6'){
            await axios.put(url2, {
                phone_number: inputValue
            })
        } else if(selectField === '7'){
            await axios.put(url2, {
                email: email
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '8'){
            await axios.put(url2, {
                payrate: `${payrate}`
            })
            .then((response) => {
                console.log('All fields have been updated!', response);
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '9'){
            await axios.put(url2, json)
            .then((response) => {
                console.log('All fields have been updated!', response);
            })
            .catch((err) => {
                console.error(err);
            })
        }

        getAllEmployees();
        setCustomerName('');
        setAddress('');
        setCity('');
        setZipcode('');
        SetInputValue('');
        setEmail('');
        setPayRate('');
        setSelectField('');
        onClose()

    };

    const closeButton = () => {
        getAllEmployees();
        setCustomerName('');
        setAddress('');
        setCity('');
        setZipcode('');
        SetInputValue('');
        setEmail('');
        setSelectField('');
        onClose()
    }

    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
             <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center' letterSpacing='1px'>Edit Employee</ModalHeader>
                        <Text color='red' textAlign='center'>Fill all fields please!</Text>
                        <ModalCloseButton />
                        <form method='PUT' onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Select Field:</FormLabel>
                                    <Select
                                    options={fieldOptions}
                                    onChange={handleInputField}
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
                                    {renderInputField()}
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={handleSubmit} >Update</Button>
                            <Button onClick={closeButton} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>

                    </ModalContent> 
                </Modal>
            <Link to='/employees'>
                <Box display='flex' pt='0rem' pb='0rem' pl='1rem'>
                    <Box display='flex' _hover={{color: 'blue.400'}}>
                        <ChevronLeftIcon fontSize='35px'/>
                        <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
                    </Box>
                </Box>
            </Link>
            <Box display='flex' pt='1rem' justifyContent='center'>
                <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' mr='auto' pl='1rem'>
                        <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
                            <Text fontWeight='bold' fontSize='20px' color='white'>Status:</Text>
                        </Box>
                        <Box >
                            <Badge bg='green.600' p='8px'>Active</Badge>
                        </Box>
                    </Box>
                    <Box display='flex' pr='1rem'>
                        <Box pr='1rem'>
                            <Button onClick={onOpen}>Edit</Button>
                        </Box>
                        <Box  color='white'>
                                <Button bg='red.600' onClick={deleteCustomer}>Delete</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                <Box display='flex' flexDir='column' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' p='2rem'>
                        <Box >
                            <Text fontWeight='bold'>Employee:</Text>
                            <Text fontSize='30px' fontWeight='regular'> #{Employees.id}</Text>
                        </Box>
                        <Box display='flex' flexDir='column' ml='auto'>
                            <Text>150 Tallant St</Text>
                            <Text>Houston, TX </Text>
                            <Text> United States</Text>
                        </Box>
                    </Box>
                    <Box display='flex' justifyContent='space-between' p='1rem'>
                        <Box display='flex' flexDir='column' p='1rem' justifyContent='space-between'>
                            <Box pb='1rem'>
                                {/* <Editable defaultValue={customer.name}>
                                    <EditablePreview/>
                                    <EditableInput/>
                                    <EditableControls/>
                                </Editable> */}
                                <Text fontWeight='bold'>Name:</Text>
                                <Text>{Employees.emp_name}</Text> 
                                
                            </Box>
                            <Box>
                                <Text fontWeight='bold'>Phone Number:</Text>
                                <Text>{Employees.phone_number}</Text>
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Address:</Text>
                            </Box>
                            <Box>
                                {Employees.address}
                            </Box>
                            <Box>
                                {Employees.city}, {Employees.state}, {Employees.zipcode}
                            </Box>
                            <Box>
                                United States
                            </Box>
                            
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Email: </Text>
                                <Text>{Employees.email}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight='bold'>Payrate:</Text>
                                <Text>${Employees.payrate} per sq.</Text>
                            </Box>
                        </Box>
                    </Box>
                    <Grid>

                    </Grid>
                </Box>
            </Box>
        </Flex>
    )
}

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

export default EmployeeEdit;
