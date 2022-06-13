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
            <Flex flexDir='column' px={'1rem'} w={'full'}>
                <VStack w='full' px={'1rem'}>
                    <Stack direction={'row'} justify='flex-start' marginBottom={'1rem'}  w={'full'} spacing='0' mt={'1rem'}>
                        <Stack direction={'column'} spacing='0' mr={'auto'}>
                            <Text fontSize={'3xl'} fontWeight='bold' marginTop='2rem'>Main Dashboard</Text>
                            <Text fontSize='md' color='gray.500'>Rios Roofing Web Application by CoogTech</Text>
                        </Stack>
                        {/* Profile Card */}
                        <HStack marginBottom='0rem' spacing='4' shadow='md' padding='4' rounded='xl' borderWidth='1px'>
                            <Image rounded='full' boxSize='70px' src={`${loggedInUserData.avatar_url}`} alt='user-profile'/>
                            <VStack maxW='full' spacing='0rem' align='start'>
                                <Text fontSize='md' fontWeight='semibold' >{loggedInUserData.full_name}</Text>   
                                <Text fontSize='sm'>{loggedInUserData.email}</Text>
                            </VStack>
                            <Button onClick={logout}>Logout</Button>
                        </HStack>
                    </Stack>
                    <Stack w={'full'} wrap='wrap' direction={["column", "column", "column", "row"]} align='center' spacing='1rem'>
                        <EstimateRequestCountCard/>
                        <MonthlyRevenueCard/>
                        <EstimateCountCard/>
                        <CustomerCountCard/>
                    </Stack>

                </VStack>
            </Flex>
    )
}

export default Dashboard;