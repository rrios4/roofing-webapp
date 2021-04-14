import React, {useEffect, useState} from 'react'
import { Box, Flex , Text, ButtonGroup, IconButton, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input, Alert, AlertIcon } from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon, CheckIcon, CloseIcon, EditIcon} from '@chakra-ui/icons'
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import Employee from './Employee';

const EmployeeEdit = (props) => {
    const {id} = props.match.params;
    let history = useHistory();
    //GET data from API
    const [Employees, setEmployees] = useState(''); 

    const url = 'http://localhost:8081/api';

    useEffect(() => {
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

    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
            <Link to='/employees'>
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

export default EmployeeEdit;
