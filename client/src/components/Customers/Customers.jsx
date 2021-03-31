import React from 'react';
//import {Grid} from '@material-ui/core';
import Customer from './Customer/Customer';
import {VStack, Grid, Stack, Flex, Box, Link, Text, Button} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from "@chakra-ui/icons";

const customers = [
    {id: 1, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 2, name: 'Sunny Den', email: 'sunnyden123@gmail.com', phone_number: '883-229-1122'},
    {id: 3, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 4, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 5, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 6, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 7, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 8, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 9, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 10, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 11, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 12, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 13, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 14, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 15, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 16, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 17, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 18, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 19, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 20, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 21, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 22, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 23, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
]

const Customers = () => {
    return (
        <main>
        {/* <Grid container justify="center" spacing={4}>
            {customers.map((customer) => (
                <Grid item key={customer.id} xs={12} sm={6} md={4} lg={3}>
                        <Customer customer={customer} />
                </Grid>
            ))}
        </Grid> */}
            <Flex flexDir='column' justifyContent='center' color='white'>
                <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
                    <Box>
                        <Button leftIcon={<SearchIcon/>} colorScheme='blue'></Button>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='3rem' pl='1rem' pr='1rem'>
                    <Box>
                        <Text fontSize='4xl'> Customers</Text>
                        <Text>There is a total of 23 customers</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        Filter By
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid'>
                            New Customer 
                        </Button>
                    </Box>
                </Box>
                <Grid gap={4} p='4' >
                    {customers.map((customer) => (
                                <Box borderRadius="xl" p='2' item key={customer.id} bg="gray.600" color='white'>
                                            <Customer customer={customer} /> 
                                </Box>
                            ))}
                </Grid>

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

export default Customers;
