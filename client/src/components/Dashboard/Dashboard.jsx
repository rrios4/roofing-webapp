import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Grid, Button, Image, VStack, HStack, Stack } from "@chakra-ui/react";
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/auth'
import {FcRuler, FcMoneyTransfer, FcConferenceCall, FcDepartment } from 'react-icons/fc'
import { Card, CustomerCountCard, EstimateRequestCountCard, MonthlyRevenueCard, EstimateCountCard } from '../../components';

const Dashboard = ({children}) => {
    const auth = useAuth()
    const navigate = useNavigate()
    // console.log(auth.user.user_metadata.avatar_url)
    const [loggedInUserData, setloggedInUserData] = useState('')
    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        // if (!localStorage.getItem('supabase.auth.token')) {
        //     history.push('/login');
        // }
        // console.log(localStorage.getItem('supabase.auth.token'))
        userData()
    }, []);

    const logout = () => {
        // localStorage.clear();
        auth.Logout()
        swal("Logged Out!", "You are now logged out from the system!", "success");
        navigate("/login")
    }

    const userData = async() => {
        setloggedInUserData(auth.user.user_metadata)
    }


    return (
        <main>
            <Flex flexDir='column' px={'1rem'}>
                <VStack>
                    <Stack direction={'row'} justify='flex-start' marginBottom={'1rem'}>
                        <Text fontSize={'3xl'} fontWeight='bold' marginTop='2rem'>Main Dashboard</Text>
                    </Stack>
                    <Stack direction={["column", "column", "column", "row"]} align='center' spacing='1rem'>
                        <EstimateRequestCountCard/>
                        <MonthlyRevenueCard/>
                        <EstimateCountCard/>
                        <CustomerCountCard/>
                        {/* Profile Card */}
                        <HStack marginBottom='0rem' spacing='1rem' shadow='md' padding='1rem' rounded='xl' borderWidth='1px'>
                            <Image rounded='full' boxSize='70px' src={`${loggedInUserData.avatar_url}`} alt='user-profile'/>
                            <VStack maxW='10rem' spacing='0rem' align='start' marginRight='8rem'>
                                <Text fontSize='md' fontWeight='semibold' >{loggedInUserData.full_name}</Text>   
                                <Text fontSize='sm'>{loggedInUserData.email}</Text>
                            </VStack>
                            <Button onClick={logout}>Logout</Button>
                        </HStack>
                    </Stack>
                    <VStack marginBottom='1rem' align='end' width='450px'>
                        <Text fontSize='md' color='gray.500'>Rios Roofing Web Application by CoogTech</Text>
                    </VStack>

                </VStack>

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
                
                <Grid templateColumns='repeat(2, 1fr)' gap='6' pt='1rem' pb='1rem' pl='0rem'>
                    <Link to='/invoices'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='200px' rounded='2xl' shadow='md' borderWidth='1px'>
                            <Box display='flex' justifyContent='center'>
                                <FcMoneyTransfer size={80}/>
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='xl' fontWeight='bold'>Invoices</Text>
                            </Box>
                        </Box>
                    </Link>
                    <Link to='/estimates'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='200px' rounded='2xl' shadow='md' borderWidth='1px'>
                            <Box display='flex' justifyContent='center'>
                                <FcRuler size={80}/>
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='xl' fontWeight='bold'>Estimates</Text>
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
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='200px' rounded='2xl' borderWidth='1px' shadow='md'>
                                <Box display='flex' justifyContent='center'>
                                    <FcConferenceCall size={80}/>
                                </Box>
                                <Box display='flex' justifyContent='center' pt='1rem'>
                                    <Text fontSize='xl' fontWeight='bold'>Customers</Text>
                                </Box>
                        </Box>
                    </Link>   
                    <Link to='/employees'>
                        <Box display='flex' flexDir='column' justifyContent='center' p='1rem' boxSize='200px' rounded='2xl' borderWidth='1px' shadow='md'>
                            
                            <Box display='flex' justifyContent='center'>
                                <FcDepartment size={80}/>
                            </Box>
                            <Box display='flex' justifyContent='center' pt='1rem'>
                                <Text fontSize='xl' fontWeight='bold'>Employees</Text>
                            </Box>
                        </Box>
                    </Link>

                </Grid>

            </Flex>
        </main>
    )
}

export default Dashboard;