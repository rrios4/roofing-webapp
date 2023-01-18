import React from 'react'
import { Grid, Box, Flex, Text, Badge } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
// import { Link } from "react-router-dom";
import { Link } from 'react-router-dom'

function Estimate(props) {
    const {menu, estimates} = props;
if(estimates?.length > 0){
        return(
            <Grid gap={4}>
            {estimates?.map((estimate, index) => {
                    // const statusBadge = () => {
                    //     if(estimate.estimate_status.name === 'Pending'){
                    //         return(
                    //             <Badge colorScheme='yellow' variant='solid' p='8px' w='110px' textAlign='center' rounded='xl'>{estimate.ets.status_name}</Badge>
                    //         )
                    //     } else if(estimate.estimate_status.name === 'Approved'){
                    //         return(
                    //             <Badge colorScheme='green' variant='solid' p='8px' w='110px' textAlign='center' rounded='xl'>{estimate.ets.status_name}</Badge>
                    //         )
                    //     } else if(estimate.estimate_status.name === 'Expired'){
                    //         return(
                    //             <Badge colorScheme='red' variant='solid' p='8px' w='110px' textAlign='center' rounded='xl'>{estimate.ets.status_name}</Badge>
                    //         )
                    //     }
                    // }
                return (
                    <Link to={`/editestimate/${estimate.id}`}>
                        <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='sm' pt='1.5rem' pb='1.5rem' key={estimate.id}>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='1rem'>
                                <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='light'>EST-{estimate.estimate_number}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='4rem'  >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Date:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(estimate.estimate_date).toLocaleDateString()}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='4rem' ml='auto' >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Due:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(estimate.expiration_date).toLocaleDateString()}</Text>
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.customer.email}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center'  pl='4rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Customer:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.customer.first_name}</Text>
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.customer.last_name}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='4rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Phone Number:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.customer.phone_number}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='4rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' mr='8px' fontWeight='bold'>Total:</Text> */}
                                <Text letterSpacing='1px' fontSize='18px' fontWeight='light'>$ {(estimate.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='2rem' >
                                {/* {statusBadge()} */}
                                <Badge ml="1" fontSize="0.8em" colorScheme='yellow' variant='solid' p='4px'>  
                                    <Text>{estimate.estimate_status.name}</Text>
                                </Badge>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl="5">
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
            <main>

            </main>
        )
    }
}

export default Estimate
