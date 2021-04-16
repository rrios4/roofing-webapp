import React, {useEffect, useState} from 'react'
import { Badge, Grid, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import {Link, Redirect, useHistory} from 'react-router-dom';
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

const CustomerEdit = (props) => {
    const {id} = props.match.params;
    let history = useHistory();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    //GET data from API
    const [customer, getCustomer] = useState('');

    // States that pick up the values from the input fields of the form
    const [name, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');

    const url = 'http://localhost:8081/api';

    useEffect(() => {
        getAllCustomer();
    }, []);

    // componentDidMount() {
    //     getAllCustomer();
    // }
    
    const getAllCustomer = async () => {
        await axios.get(`${url}/customers/${id}`)
        .then((response) => {
            const allCustomer = response.data
            //add our data to state
            getCustomer(allCustomer);
        })
        .catch(error => console.error(`Error: ${error}`));
    }

    const deleteCustomer = async () => {
        // console.log('Button will perform a delete to the database.');
        await axios.delete(`${url}/customers/${id}`)
        .then((response) => {
            console.log("Customer has been deleted!")
            return <Redirect to='/customers' />
        })
        .catch(error => console.error(`Error: ${error}`));
        history.push("/customers")
                
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://localhost:8081/api/customers/${id}`
        const json = {
            name: name,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            phone_number: inputValue,
            email: email
        }
        await axios.put(url2, json)
        .then((response) => {
            console.log('I was submitted 1', response);
        })
        .catch((err) => {
            console.error(err);
        })
            console.log('Submit Function works!')

        getAllCustomer();
        setCustomerName('');
        setAddress('');
        setCity('');
        setZipcode('');
        SetInputValue('');
        setEmail('');
        onClose()

    };

    const closeButton = () => {
        getAllCustomer();
        setCustomerName('');
        setAddress('');
        setCity('');
        setZipcode('');
        SetInputValue('');
        setEmail('');
        onClose()
    }
    const [inputValue, SetInputValue] = useState("");

    const handlePhoneInput = (e) => {
        //This is where we'll call our future formatPhoneNumber function
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        //We'll set the input value using our setInputValue
        SetInputValue(formattedPhoneNumber);
    }


    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
             <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center' letterSpacing='1px'>Edit Customer</ModalHeader>
                        <Text color='red' textAlign='center'>Re-type all data please!</Text>
                        <ModalCloseButton />
                        <form method='PUT' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel >Customer Name</FormLabel>
                                    <Input isRequired defaultValue={customer.name} value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer name'/>
                                    <FormHelperText textAlign='right'>{customer.name}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel >Address</FormLabel>
                                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                                    <FormHelperText textAlign='right'>{customer.address}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel >City</FormLabel>
                                    <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                                    <FormHelperText textAlign='right'>{customer.city}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel >State</FormLabel>
                                    <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                                    <FormHelperText textAlign='right'>{customer.state}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel >Zipcode</FormLabel>
                                    <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                                    <FormHelperText textAlign='right'>{customer.zipcode}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Phone Number</FormLabel>
                                    <InputGroup>
                                    <InputLeftAddon children="+1" />
                                    <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                                    </InputGroup>
                                    <FormHelperText textAlign='right'>{customer.phone_number}</FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel >Email</FormLabel>
                                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
                                    <FormHelperText textAlign='right'>{customer.email}</FormHelperText>
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={handleSubmit} >Save</Button>
                            <Button onClick={closeButton} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>

                    </ModalContent> 
                </Modal>
            <Link to='/customers'>
                <Box display='flex'  pt='2rem' pb='1rem' pl='1rem'>
                    <Box display='flex' rounded='xl' p='1rem'>
                        <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
                    </Box>
                </Box>
            </Link>
            <Box display='flex' pt='1rem' justifyContent='center'>
                <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' mr='auto' pl='1rem'>
                        <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
                            {/* <Text fontWeight='bold' fontSize='20px' color='white'>Status:</Text> */}
                        </Box>
                        <Box >
                            {/* <Badge bg='green.600' p='8px'>Active</Badge> */}
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
                        <Box>
                            <Text fontSize='25px' letterSpacing='1px' fontWeight='bold'>Customer #{customer.id}</Text>
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
                                <Text>{customer.name}</Text> 
                                
                            </Box>
                            <Box>
                                <Text fontWeight='bold'>Phone Number:</Text>
                                <Text>{customer.phone_number}</Text>
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Address:</Text>
                            </Box>
                            <Box>
                                {customer.address}
                            </Box>
                            <Box>
                                {customer.city}, {customer.state}, {customer.zipcode}
                            </Box>
                            <Box>
                                United States
                            </Box>
                            
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Email: </Text>
                            </Box>
                            {customer.email}
                        </Box>
                    </Box>
                    <Grid>

                    </Grid>
                </Box>
            </Box>
        </Flex>
    )
}

export default CustomerEdit;
