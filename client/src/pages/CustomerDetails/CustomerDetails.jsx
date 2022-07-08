import React, {useEffect, useState} from 'react'
import { Grid, Box, Flex, Modal, useColorModeValue, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Button, FormHelperText, Text, useDisclosure, Stack, VStack, HStack, Image, StackDivider, Spinner} from '@chakra-ui/react';
import axios from 'axios';
import Select from "react-select";
import swal from 'sweetalert';
import supabase from '../../utils/supabaseClient';
import formatPhoneNumber from '../../utils/formatPhoneNumber';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CustomerDetailsCard } from '../../components'
import { MdKeyboardArrowLeft, MdLocationOn, MdEmail, MdPhone, MdOutlineDateRange } from 'react-icons/md';

const CustomerDetails = (props) => {
    const navigate = useNavigate();

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');
    
    // const {id} = props.match.params;
    const {id} = useParams();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    //GET data from API
    const [customer, getCustomer] = useState('');
    // Customer Registered Date
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let customerDate = customer ? new Date(`${customer.created_at}`).toLocaleDateString('en-us', options) : <><Spinner size={'xs'}/></>;

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
            <VStack spacing={4}>
                <Box display={'flex'} justifyContent='start' w='full'>
                    <Link to={'/customers'}>
                        <Button colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
                    </Link>
                </Box>
                {/* Customer Details Card Info  Component */}
                <CustomerDetailsCard bg={bg} borderColor={borderColor} onOpen={onOpen} deleteCustomer={deleteCustomer} customer={customer} customerDate={customerDate}/>
                {/* Customer Estimates Card */}
                <Card width={'full'} bg={bg} borderColor={borderColor}>
                    <Text>Customer Invoice</Text>
                </Card>
                {/* Customer Invoices Card */}
                <Card width={'full'} bg={bg} borderColor={borderColor}>
                    <Text>Customer Estimates</Text>
                </Card>
            </VStack>
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
            {/* <Link to='/customers'>
                <Box display='flex' pt='1rem' pb='1rem' pl='1rem'>
                    <Box display='flex' _hover={{color: 'blue.400'}}>
                        <ChevronLeftIcon fontSize='35px'/>
                        <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
                    </Box>
                </Box>
            </Link> */}
        </Flex>
    )
}

export default CustomerDetails;
