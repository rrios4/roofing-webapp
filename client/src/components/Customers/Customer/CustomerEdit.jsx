import React, {useEffect, useState} from 'react'
import { Grid, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons'
import axios from 'axios';
import Select from "react-select";
import swal from 'sweetalert';
import supabase from '../../../utils/supabaseClient'
import formatPhoneNumber from '../../../utils/formatPhoneNumber'
import { Link, useNavigate, useParams } from 'react-router-dom';

const CustomerEdit = (props) => {
    const navigate = useNavigate();
    
    // const {id} = props.match.params;
    const {id} = useParams();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    //GET data from API
    const [customer, getCustomer] = useState('');

    // States that pick up the values from the input fields of the form
    const [name, setCustomerName] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [selectField, setSelectField] = useState('')

    // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        // if (!localStorage.getItem('supabase.auth.token')) {
        //     history.push('/login');
        // }
        getAllCustomer();
    }, []);
    
    const getAllCustomer = async () => {
        let { data: customerById, error } = await supabase
        .from('customer')
        .select('*')
        .eq('id', `${id}`)
        
        if(error){
            console.log(error)
        }
        getCustomer(customerById[0])

    }

    // Delete request that is sent to the DB to delete user by id
    const deleteRequest = async() => {
        let { data, error } = await supabase
        .from('customer')
        .delete()
        .eq('id',`${id}`)

        if(error){
            console.log(error)
        }
        console.log(data)
        // history.push("/customers")
        navigate("/customers")
    }

    // Function that programs delete button with alert and triggers action from delete request function to deleter customer
    const deleteCustomer = async () => {
        // console.log('Button will perform a delete to the database.');
        await swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover customer info!',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
        .then((willDelete) => {
            if(willDelete) {
                deleteRequest()
                swal("Poof! Your customer has been deleted!", {
                    icon: "success",
                });
                
            } else {
                swal("Your customer data was not deleted!");
                // history.push(`/editcustomer/${id}`)
                // navigate(`/editcustomer/${id}`)
            }
        })          
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/customers/${id}`
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
        console.log(firstName)
        if(selectField === '1'){
            let { data, error } = await supabase
            .from('customer')
            .update({first_name: firstName})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '2'){
            let { data, error } = await supabase
            .from('customer')
            .update({street_address: address})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '3'){
            let { data, error } = await supabase
            .from('customer')
            .update({city: city})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '4'){
            let { data, error } = await supabase
            .from('customer')
            .update({state: state})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '5'){
            let { data, error } = await supabase
            .from('customer')
            .update({zipcode: zipcode})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '6'){
            let { data, error } = await supabase
            .from('customer')
            .update({phone_number: inputValue})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '7'){
            let { data, error } = await supabase
            .from('customer')
            .update({email: email})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        } else if(selectField === '8'){
            await axios.put(url2, json)
            .then((response) => {
                console.log('All fields have been updated!', response);
            })
            .catch((err) => {
                console.error(err);
            })
        } else if(selectField === '9'){
            let { data, error } = await supabase
            .from('customer')
            .update({last_name: lastName})
            .match({id: customer.id})
            if(error){
                console.log(error)
            };
            console.log(data);
        }
        getAllCustomer(); setAddress(''); setCity(''); setZipcode(''); SetInputValue(''); setEmail(''); setSelectField(''); setState(''); setfirstName(''); setlastName(''); setlastName('');
        onClose()
    };

    const closeButton = () => {
        getAllCustomer(); setAddress(''); setCity(''); setZipcode(''); SetInputValue(''); setEmail(''); setSelectField(''); setfirstName(''); setlastName(''); setlastName('');
        onClose()
    }
    const [inputValue, SetInputValue] = useState("");

    const handlePhoneInput = (e) => {
        //This is where we'll call our future formatPhoneNumber function
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        //We'll set the input value using our setInputValue
        SetInputValue(formattedPhoneNumber);
    }  

    const fieldOptions = [
        { value: '1', label: 'First Name'},
        { value: '9', label: 'Last Name'},
        { value: '2', label: 'Address'},
        { value: '3', label: 'City'},
        { value: '4', label: 'State'},
        { value: '5', label: 'Zipcode'},
        { value: '6', label: 'Phone Number'},
        { value: '7', label: 'Email'},
        { value: '8', label: 'All Fields'}
    ]

    const handleInputField = (selectField) => {
        setSelectField(selectField.value);
        console.log(selectField);
    }

    const renderInputField = ()=> {
        if(selectField === '1'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={firstName} onChange={({target}) => setfirstName(target.value)} id='first_name' ref={initialRef} placeholder='Enter new first name'/>
                    <FormHelperText>First Name: {customer.first_name}</FormHelperText>
                </Box>   
            )
        } else if(selectField === '9'){
            return(
                <Box pt='1rem' pb='1rem'>
                <Input value={lastName} onChange={({target}) => setlastName(target.value)} id='last_name' placeholder='Enter new last name'/>
                <FormHelperText>Current Address: {customer.last_name}</FormHelperText>
                </Box>
            )
        } else if(selectField === '2'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                    <FormHelperText>Current Address: {customer.street_address}</FormHelperText>
                </Box>
            )
        } else if(selectField === '3'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                    <FormHelperText>Current City: {customer.city}</FormHelperText>
                </Box>
            )   
        } else if(selectField === '4'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                    <FormHelperText>Current State: {customer.state}</FormHelperText>
                </Box>
            )
        } else if(selectField === '5'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                    <FormHelperText>Current Zipcode: {customer.zipcode}</FormHelperText>
                </Box>
            )
        } else if(selectField === '6'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                    <FormHelperText>Current Phone Number: {customer.phone_number}</FormHelperText>
                </Box>
            )
        } else if(selectField === '7'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
                    <FormHelperText>Current Email: {customer.email}</FormHelperText>
                </Box>
            )
        } else if(selectField === '8'){
            return(
                <Box pt='1rem' pb='1rem'>
                    <Box pb='1rem'>
                        <FormLabel>Customer Name: </FormLabel>
                        <Input value={name} onChange={({target}) => setCustomerName(target.value)} id='name' ref={initialRef} placeholder='Customer Name'/>
                        <FormHelperText>Current Name: {customer.name}</FormHelperText>
                    </Box>
                    <Box pb='1rem'>
                        <FormLabel>Address: </FormLabel>
                        <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                        <FormHelperText>Current Address: {customer.address}</FormHelperText>
                    </Box >
                    <Box  pb='1rem'>
                        <FormLabel>City: </FormLabel>
                        <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/>
                        <FormHelperText>Current City: {customer.city}</FormHelperText>
                    </Box>
                    <Box  pb='1rem'>
                        <FormLabel>State: </FormLabel>
                        <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/>
                        <FormHelperText>Current State: {customer.state}</FormHelperText>
                    </Box>
                    <Box  pb='1rem'>
                        <FormLabel>Zipcode: </FormLabel>
                        <Input value={zipcode} onChange={({target}) => setZipcode(target.value)} id='zipcode' placeholder='Zipcode'/>
                        <FormHelperText>Current Zipcode: {customer.zipcode}</FormHelperText>
                    </Box>
                    <Box pb='1rem'>
                        <FormLabel>Phone Number: </FormLabel>
                        <Input id='phone' type='tel' placeholder='Phone number' onChange={(e) => handlePhoneInput(e)} value={inputValue}/>
                        <FormHelperText>Current Name: {customer.phone_number}</FormHelperText>
                    </Box>
                    <Box pt='1rem' >
                        <FormLabel>Email: </FormLabel>
                        <Input value={email} onChange={({target}) => setEmail(target.value)} placeholder='Email Address' type='email'/>
                        <FormHelperText>Current Name: {customer.email}</FormHelperText>
                    </Box>  
                </Box>
                
            )
        }
    }


    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
             <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center' letterSpacing='1px'>Edit Customer</ModalHeader>
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
            <Link to='/customers'>
                <Box display='flex' pt='1rem' pb='1rem' pl='1rem'>
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
                            {/* <Text fontWeight='bold' fontSize='20px' color='white'>Status:</Text> */}
                            <Text color='white' fontSize='25px' letterSpacing='1px' fontWeight='bold'>Customer #{customer.id}</Text>
                        </Box>
                        <Box >
                            {/* <Badge bg='green.600' p='8px'>Active</Badge> */}
                        </Box>
                    </Box>
                    <Box display='flex' pr='1rem'>
                        <Box pr='1rem'>
                            <Button onClick={onOpen} colorScheme='blue'>Edit</Button>
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
                            {/* <Text fontSize='25px' letterSpacing='1px' fontWeight='bold'>Customer #{customer.id}</Text> */}
                        </Box>
                        <Box display='flex' flexDir='column' ml='auto'>
                            <Text fontWeight='bold'>Rios Roofing</Text>
                            <Text textAlign='right' fontWeight='light'>150 Tallant St</Text>
                            <Text textAlign='right' fontWeight='light'>Houston, TX </Text>
                            <Text textAlign='right' fontWeight='light'> United States</Text>
                        </Box>
                    </Box>
                    <Box display='flex' justifyContent='space-between' p='1rem'>
                        {/* <Box>
                            <Table variant="simple" size='sm'>
                                <TableCaption color='white'>Customer Information</TableCaption>
                                <Thead>
                                    <Tr>
                                    <Th color='white'>Name</Th>
                                    <Th color='white'>Email</Th>
                                    <Th color='white'>Phone</Th>
                                    <Th color='white'>Address</Th>
                                    <Th isNumeric color='white'>City</Th>
                                    <Th color='white'>State</Th>
                                    <Th color='white'>Zipcode</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                    <Td>{customer.name}</Td>
                                    <Td>{customer.email}</Td>
                                    <Td>{customer.phone_number}</Td>
                                    <Td >{customer.address}</Td>
                                    <Td>{customer.city}</Td>
                                    <Td>{customer.state}</Td>
                                    <Td>{customer.zipcode}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box> */}
                        <Box display='flex' flexDir='column' p='1rem' justifyContent='space-between'>
                            <Box pb='1rem'>
                                <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Name:</Text>
                                <Text>{customer.first_name} {customer.last_name}</Text> 
                                
                            </Box>
                            <Box>
                                <Text fontSize='22px' fontWeight='bold' letterSpacing='1px' >Phone Number:</Text>
                                <Text>{customer.phone_number}</Text>
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Address:</Text>
                            </Box>
                            <Box>
                                {customer.street_address}
                            </Box>
                            <Box>
                                {customer.city}, {customer.state} {customer.zipcode}
                            </Box>
                            <Box>
                                United States
                            </Box>
                            
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Email: </Text>
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
