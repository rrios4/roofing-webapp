import React from 'react'
import { Box, Flex , Text, Editable, Badge, Button, Grid } from "@chakra-ui/react";
import {Link} from 'react-router-dom';

const CustomerEdit = () => {
    return (
        <Flex direction='column'>
            <Box pt='2rem' pb='1rem' >
                <Box>
                    <Link to='/customers'>
                        <Text>Go Back</Text>
                    </Link>
                </Box>
            </Box>
            <Box display='flex' pt='2rem'>
                <Box display='flex' p='1rem' bg='gray.700' rounded='2xl' shadow='md'>
                    <Box display='flex' mr='auto'>
                        <Box display='flex' pr='1rem'>
                            <Text>Status</Text>
                        </Box>
                        <Box >
                            <Badge bg='green.600' p='8px'>Active</Badge>
                        </Box>
                    </Box>
                    <Box display='flex'>
                        <Box pr='1rem'>
                            <Button>Edit</Button>
                        </Box>
                        <Box >
                            <Button bg='red.600'>Delete</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display='flex' pt='2rem' >
                <Box display='flex' flexDir='column' p='1rem' bg='gray.700' rounded='2xl' shadow='md'>
                    <Box display='flex' >
                        <Box>
                            Customer ID
                        </Box>
                        <Box display='flex' flexDir='column' ml='auto'>
                            <Text>150 Tallant St</Text>
                            <Text>Houston, TX </Text>
                            <Text> United States</Text>
                        </Box>
                    </Box>
                    <Box display='flex' >
                        <Box display='flex' flexDir='column'>
                            <Box>
                                Customer name 
                            </Box>
                            <Box>
                                Customer phone
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column'>
                            Address
                            City
                            Country 
                        </Box>
                        <Box display='flex' flexDir='column'>
                            Customer email
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
