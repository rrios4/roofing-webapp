import React, {useEffect, useState} from 'react'
import { Box, Flex , Text, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input } from "@chakra-ui/react";
import {Link} from 'react-router-dom';
import FocusLock from 'react-focus-lock';
import axios from 'axios';



const CustomerEdit = (props) => {
    const {id} = props.match.params;
    
            //GET data from API
            const [customers, getCustomers] = useState('');

            const url = 'http://localhost:8081/api';

            useEffect(() => {
                getAllCustomers();
            }, []);
    
            const getAllCustomers = () => {
                axios.get(`${url}/customers/${id}`)
                .then((response) => {
                    const allCustomers = response.data
    
                    //add our data to state
                    getCustomers(allCustomers);
                })
                .catch(error => console.error(`Error: ${error}`));
            }

            const deleteCustomer = () => {
                //axios.delete(`${url}/customers/${id}`)
                console.log('Button will perform a delete to the database.')
            }
    

    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
            <Box pt='2rem' pb='1rem'>
                <Box>
                    <Link to='/customers'>
                        <Text fontWeight='bold' fontSize='20px'>Go Back</Text>
                    </Link>
                </Box>
            </Box>
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
                            <Button>Edit</Button>
                        </Box>
                        <Box  color='white'>
                            <Button bg='red.600' onClick={deleteCustomer()}>Delete</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                <Box display='flex' flexDir='column' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' p='2rem'>
                        <Box>

                            <Text fontSize='40px' fontWeight='bold'># {customers.id}</Text>
                        </Box>
                        <Box display='flex' flexDir='column' ml='auto'>
                            <Text>150 Tallant St</Text>
                            <Text>Houston, TX </Text>
                            <Text> United States</Text>
                        </Box>
                    </Box>
                    <Box display='flex' >
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                {/* <Editable defaultValue={customers.name}>
                                    <EditablePreview/>
                                    <EditableInput/>
                                    
                                </Editable> */}
                                <Text fontWeight='bold'>Name:</Text>
                                <Text>{customers.name}</Text> 
                                
                            </Box>
                            <Box>
                                <Text fontWeight='bold'>Phone Number:</Text>
                                <Text>{customers.phone_number}</Text>
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Address:</Text>
                            </Box>
                            <Box>
                                {customers.address}
                            </Box>
                            <Box>
                                {customers.city}
                            </Box>
                            <Box>
                                {customers.state}
                            </Box>
                            <Box>
                                United States
                            </Box>
                            
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                <Text fontWeight='bold'>Email: </Text>
                            </Box>
                            {customers.email}
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
