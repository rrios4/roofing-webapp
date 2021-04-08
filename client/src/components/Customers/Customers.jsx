import React, {useState, useEffect} from 'react';
//import {Grid} from '@material-ui/core';
import Customer from './Customer/Customer';
import {VStack, Grid, Stack, Flex, Box, Text, Button, IconButton, Input, Form, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import {Link} from 'react-router-dom';
import axios from 'axios';

// const customers = [
//     {id: 1, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 2, name: 'Sunny Den', email: 'sunnyden123@gmail.com', phone_number: '883-229-1122'},
//     {id: 3, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 4, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 5, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 6, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 7, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 8, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 9, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
//     {id: 10, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'}
// ]

    // const getCustomers = () => {
    //         Axios.get('http://localhost:3002/api/customers').then((response) => {
    //             console.log(response);
    //     });
    // };

// const Customers = () => {
//     //GET data from API
//     const [customers, getCustomers] = useState(' ');
//     const url = 'http://localhost:3002/api/customers';
//     const getAllCustomers = () => {
//         axios.get(`${url}`)
//         .then((response) => {
//             const allCustomers = response.data.customers.allCustomers
//             //add our data to state
//             getCustomers(allCustomers);
//         })
//         .catch(error => console.error(`Error: ${error}`));
//     }

//     useEffect(() => {
//         getAllCustomers();
//     }, [])

//     return (
//         <main>
//         {/* <Grid container justify="center" spacing={4}>
//             {customers.map((customer) => (
//                 <Grid item key={customer.id} xs={12} sm={6} md={4} lg={3}>
//                         <Customer customer={customer} />
//                 </Grid>
//             ))}
//         </Grid> */}
//             <Flex flexDir='column' justifyContent='center'>
//                 <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
//                     <Box display='flex'>
//                         <Box pr='1rem'>
//                             <Input placeholder='Search for Customer' colorScheme='blue' border='2px'/>
//                         </Box>
//                         <IconButton icon={<SearchIcon/>} colorScheme='blue'></IconButton>
//                     </Box>
//                 </Box>
//                 <Box display='flex' pt='1rem' pb='3rem' pl='1rem' pr='1rem'>
//                     <Box>
//                         <Text fontSize='4xl'> Customers</Text>
//                         <Text>There is a total of 23 customers</Text>    
//                     </Box>
//                     <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
//                         Filter By
//                     </Box>
//                     <Box display='flex' flexDir='column' justifyContent='center'>
//                         <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid'>
//                             New Customer 
//                         </Button>
//                     </Box>
//                 </Box>
//                 <Link to='/editcustomer'>
//                     <Grid gap={4} p='4' >
//                         {customers.map((customer, index) => (
//                                     <Box borderRadius="xl" p='2' item key={customer.id} bg="gray.600" color='white'>
//                                                 <Customer customer={customer} /> 
//                                     </Box>
//                                 ))}
//                     </Grid>
//                 </Link>
//             </Flex>
//             {/* <Flex justify='center' flexDirection='column' p={2}>
//                 {customers.map((customer) => (
//                         <Box p={2}  item key={customer.id} xs={12} sm={6} md={4} lg={3}>
//                                 <Customer customer={customer} />
//                         </Box>
//                     ))}
//             </Flex> */}
             
//     </main>
//     )

// }

// export default Customers;

export default function Customers() {

        //GET data from API
        const [customers, getCustomers] = useState('');
        const url = 'http://localhost:8081/api';

        useEffect(() => {
            getAllCustomers();
        }, []);

        const getAllCustomers = () => {
            axios.get(`${url}/customers`)
            .then((response) => {
                const allCustomers = response.data

                //add our data to state
                getCustomers(allCustomers);
            })
            .catch(error => console.error(`Error: ${error}`));
        }

        const { isOpen, onOpen, onClose } = useDisclosure();
        const initialRef = React.useRef();
        const finalRef = React.useRef();

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
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Customer Name</FormLabel>
                                <Input ref={initialRef} placeholder='Customer name' />
                                <FormLabel>Address</FormLabel>
                                <Input placeholder='Street address'/>
                                <FormLabel>City</FormLabel>
                                <Input placeholder='City'/>
                                <FormLabel>State</FormLabel>
                                <Input placeholder='State'/>
                                <FormLabel>Zipcode</FormLabel>
                                <Input placeholder='Zipcode'/>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3}>Save</Button>
                            <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
                    <Box display='flex'>
                        <Box pr='1rem'>
                            <Input placeholder='Search for Customer' colorScheme='blue' border='2px'/>
                        </Box>
                        <IconButton icon={<SearchIcon/>} colorScheme='blue'></IconButton>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='2rem' pl='1rem' pr='1rem' >
                    <Box>
                        <Text fontSize='4xl'> Customers</Text>
                        <Text>There is a total of {customers.length} customers</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        Filter By
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


