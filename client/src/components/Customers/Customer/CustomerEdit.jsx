import React from 'react'
import { Box, Flex , Text, Editable, EditablePreview, EditableInput, EditableControls, Badge, Button, Grid } from "@chakra-ui/react";
import {Link} from 'react-router-dom';


const CustomerEdit = () => {
    


    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]}>
            <Box pt='2rem' pb='1rem'>
                <Box>
                    <Link to='/customers'>
                        <Text>Go Back</Text>
                    </Link>
                </Box>
            </Box>
            <Box display='flex' pt='1rem' justifyContent='center'>
                <Box display='flex' p='1rem' bg='gray.700' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' mr='auto'>
                        <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
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
            <Box display='flex' pt='2rem'  justifyContent='center'>
                <Box display='flex' flexDir='column' p='1rem' bg='gray.700' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                    <Box display='flex' p='2rem'>
                        <Box>

                            <Text fontSize='40px' fontWeight='bold'>#1</Text>
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
                                Customer name 
                            </Box>
                            <Box>
                                Customer phone
                            </Box>
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>
                            <Box>
                                Address 
                            </Box>
                            <Box>
                                City
                            </Box>
                            <Box>
                                Country
                            </Box>
                            
                        </Box>
                        <Box display='flex' flexDir='column' p='1rem'>

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
