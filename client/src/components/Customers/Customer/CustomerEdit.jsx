import React, {useEffect, useState} from 'react'
import { Box, Flex , Text, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input, Alert, AlertIcon } from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons'
import {Link, Redirect, useHistory} from 'react-router-dom';
import FocusLock from 'react-focus-lock';
import axios from 'axios';



const CustomerEdit = (props) => {
    const {id} = props.match.params;
    let history = useHistory();
            //GET data from API
            const [customer, getCustomer] = useState(''); 

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


    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
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
                                <Button bg='red.600' onClick={deleteCustomer}>Delete</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                <Box display='flex' flexDir='column' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' p='2rem'>
                        <Box>
                            <Text fontWeight='bold'>Customer ID:</Text>
                            <Text fontSize='30px' fontWeight='regular'> #{customer.id}</Text>
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
                                {/* <Editable defaultValue={customers.name}>
                                    <EditablePreview/>
                                    <EditableInput/>
                                    
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
                                {customer.city}, {customer.state}
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
