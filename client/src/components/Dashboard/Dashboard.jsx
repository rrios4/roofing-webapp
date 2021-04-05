import React from 'react'
import { Box, Flex, Avatar, Text, Grid, Button, Badge} from "@chakra-ui/react";
import {ChevronRightIcon} from '@chakra-ui/icons'
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BallotIcon from '@material-ui/icons/Ballot';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import {Link} from 'react-router-dom'


function Dashboard() {
    return (
        <main>
            <Flex flexDir='column' color='white'>
                {/* <Box display='flex' pt='1rem'>
                    <Box p='1rem'> 
                        <Avatar size='lg' name='username' src='https://64.media.tumblr.com/073578da50f557bd56caef112e255950/b754da231bb4bd69-34/s640x960/4f8c9cf93d4f03c42d448eba0dac2a9cbb2a69e2.jpg'/>
                        
                    </Box>
                    <Box display='flex' flexDir='column' justifyContent='center'>
                        <Text fontSize='25px' fontWeight='black'>SimplyNex</Text>
                        <Text>Welcome! Today is March 31, 2021</Text>
                    </Box>
                    <Box ml='auto' p='1rem'>
                        <Button colorScheme='blue'>Logout</Button>
                    </Box>
                </Box> */}
                {/* <Box display='flex' flexDir='column' pb='1rem' pt='2rem'>
                    <Box>
                        <Text fontSize='30px' fontWeight='black'>Upcoming Jobs</Text>
                    </Box>
                    <Grid p='1rem' gap='3' >
                        <Box display='flex' justifyContent='space-between' bg='gray.700' p='1rem' rounded='xl'>
                            <Box pl='1rem' pr='1rem'>
                                <Badge variant='subtle' colorScheme='green'>Status</Badge>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Customer Name</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Phone Number</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Home Address</Text>
                            </Box>
                            <Box ml='auto'>
                                <ChevronRightIcon fontSize='20px'/>
                            </Box>

                        </Box>
                        <Box display='flex' justifyContent='space-between' bg='gray.700' p='1rem' rounded='xl'>
                            <Box pl='1rem' pr='1rem'>
                                <Badge variant='subtle' colorScheme='green'>Status</Badge>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Customer Name</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Phone Number</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Home Address</Text>
                            </Box>
                            <Box ml='auto'>
                                <ChevronRightIcon fontSize='20px'/>
                            </Box>

                        </Box>
                        <Box display='flex' justifyContent='space-between' bg='gray.700' p='1rem' rounded='xl'>
                            <Box pl='1rem' pr='1rem'>
                                <Badge variant='subtle' colorScheme='green'>Status</Badge>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Customer Name</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Phone Number</Text>
                            </Box>
                            <Box pl='1rem' pr='1rem'>
                                <Text>Home Address</Text>
                            </Box>
                            <Box ml='auto'>
                                <ChevronRightIcon fontSize='20px'/>
                            </Box>

                        </Box>
                    </Grid>

                </Box> */}
                
                <Grid templateColumns='repeat(4, 1fr)' gap='5' pt='22rem' pb='1rem' pl='0rem'>
                    <Link to='/invoices'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                            <Box display='flex' justifyContent='center'>
                                <DescriptionIcon style={{fontSize: 100}} />
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='20px' fontWeight='black'>Invoices</Text>
                            </Box>
                        </Box>
                    </Link>
                    <Link to='/estimates'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                            <Box display='flex' justifyContent='center'>
                                <AssignmentIcon style={{fontSize: 100}} />
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='20px' fontWeight='black'>Estimates</Text>
                            </Box>
                        </Box>
                    </Link>
                    {/* <Link to='/schedules'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                            <Box display='flex' justifyContent='center'>
                                <AccessTimeIcon style={{fontSize: 100}} />
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='20px' fontWeight='black'>Job Schedule</Text>
                            </Box>
                        </Box>
                    </Link> */}
                    {/* <Link to='/materials'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                            <Box display='flex' justifyContent='center'>
                                <BallotIcon style={{fontSize: 100}} />
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='20px' fontWeight='black'>Materials</Text>
                            </Box>

                        </Box> 
                    </Link> */}
                    <Link to='/customers'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                                <Box display='flex' justifyContent='center'>
                                    <PersonPinIcon style={{fontSize: 100}} />
                                </Box>
                                <Box display='flex' justifyContent='center' pt='1rem'>
                                    <Text fontSize='20px' fontWeight='black'>Customers</Text>
                                </Box>
                        </Box>
                    </Link>   
                    <Link to='/employees'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='280px' bg='gray.700' rounded='2xl' shadow='md' _hover={{ bg: "gray.600" }}>
                            
                            <Box display='flex' justifyContent='center'>
                                <PermContactCalendarIcon style={{fontSize: 100}} />
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='20px' fontWeight='black'>Employees</Text>
                            </Box>
                        </Box>
                    </Link>

                </Grid>

            </Flex>
        </main>
    )
}

export default Dashboard;