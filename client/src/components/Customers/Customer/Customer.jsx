import React from 'react';
import {Box, Badge, Flex, Grid, Text, Spinner} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {Link} from 'react-router-dom'

function Customer(props) {
    const {menu, customers} = props;
    if(customers.length > 0) {
        return(
            <Grid gap={4}>
                {customers.map((customer, index) => {
                    return (
                        <Link to={`/editcustomer/${customer.id}`}>
                            <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='md' pt='1.5rem' pb='1.5rem'>
                                <Box key={customer.id} pl='1rem'>
                                    <Text fontFamily='sans-serif' fontWeight='light'>{customer.id}</Text>
                                </Box>
                                <Box pl='12'>
                                    <Text fontFamily='sans-serif' fontWeight='ligh'>{customer.first_name}</Text>
                                </Box>
                                <Box pl='2'>
                                    <Text fontFamily='sans-serif' fontWeight='ligh'>{customer.last_name}</Text>
                                </Box>
                                <Box pl='12'>
                                    <Text fontFamily='sans-serif' fontWeight='light'>{customer.email}</Text>
                                </Box>
                                <Box pl='12'>
                                    <Text fontFamily='sans-serif' fontWeight='light'>{customer.phone_number}</Text>
                                </Box>
                                <Box pl='10' ml='auto'>
                                <Badge ml="1" fontSize="0.8em" colorScheme="green" variant='solid'>
                                    Active
                                </Badge>
                                </Box>
                                <Box pl="5">
                                    <ChevronRightIcon fontSize='25px'/>
                                </Box>
                            </Flex>
                        </Link>
                    )
                })}
            </Grid>   
        )
    } else {
        return (
            <Flex p='4' justifyContent='center'>
                <Box display='flex'>
                    {/* <Text shadow='sm' color='red' fontSize='20px'>No Customers yet! </Text> */}
                    <Spinner margin='1rem'/>
                </Box>
            </Flex>
        )
    }
}

export default Customer;

