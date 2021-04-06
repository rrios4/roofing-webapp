import React from 'react';
import {Link} from 'react-router-dom';

import {Box, Badge, Container, Flex, Grid} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

function Employee(props) {
    const {menu, employees} = props;

    if(employees.length > 0) {
        return(
                <Grid gap={4}>
                {employees.map((employees, index) => {
                return (
                    <Link to={`/editemployee/${employees.id}`}>
                        <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='md' pt='1.5rem' pb='1.5rem'>
                            <Box key={employees.id}>
                                {employees.id}
                            </Box>
                            <Box pl='12'>
                                {employees.emp_name}
                            </Box>
                            <Box pl='12'>
                                {employees.email}
                            </Box>
                            <Box pl='12'>
                                {employees.phone_number}
                            </Box>
                            <Box pl='10' ml='auto'>
                                <Badge bg='green.300' color='black'>
                                    Active
                                </Badge>
                            </Box>
                            <Box pl='12'>
                                {employees.payrate}
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
            <Flex p='4' justifyContent='space-between' >
                <Box >
                    No Employees yet!
                </Box>

        </Flex>
        )
    }
}

export default Employee

