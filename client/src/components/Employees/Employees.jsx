import React, {useState, useEffect} from 'react';
import {VStack, Grid, Stack, Flex, Box, Text, Button, IconButton, Input, Form} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import Employee from './Employee/Employee'
import axios from 'axios';

function Employees() {
    //GET data from API
    const [employees, getEmployees] = useState('');

    const url = 'http://localhost:8081/api';

    useEffect(() => {
        getAllEmployees();
    }, []);

    const getAllEmployees = () => {
        axios.get(`${url}/employees`)
        .then((response) => {
            const allEmployees = response.data
            //add our data to state
            getEmployees(allEmployees);
        })
        .catch(error => console.error(`Error: ${error}`));
        }

    return (
        <main>
            <Flex flexDir='column' justifyContent='center' pb='2rem'>
                <Box pt='2rem' pb='1rem' ml='auto' pr='1rem'>
                    <Box display='flex'>
                        <Box pr='1rem'>
                            <Input placeholder='Search for Customer' colorScheme='blue' border='2px'/>
                        </Box>
                        <IconButton icon={<SearchIcon/>} colorScheme='blue'></IconButton>
                    </Box>
                </Box>
                <Box display='flex' pt='1rem' pb='3rem' pl='1rem' pr='1rem'>
                    <Box>
                        <Text fontSize='4xl'>Employees</Text>
                        <Text>There is a total of {employees.length} employees</Text>    
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center' ml='auto' pr='6rem'>
                        Filter By
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue' variant='solid'>
                            New Employee 
                        </Button>
                    </Box>
                </Box>
                <Box p='1rem' color='white'>
                        <Employee employees={employees} />                
                </Box>
            </Flex>
        </main>
    )
}

export default Employees
