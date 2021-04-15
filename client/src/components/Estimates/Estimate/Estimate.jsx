import React from 'react'
import { Grid, Box, Flex, Text, Badge } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

function Estimate(props) {
    const {menu, estimates} = props;
if(estimates.length > 0){
        return(
            <Grid gap={4}>
            {estimates.map((estimate, index) => {
                    const statusBadge = () => {
                        if(estimate.ets.status_name === 'Pending'){
                            return(
                                <Badge colorScheme='yellow' variant='solid' p='8px' rounded='xl'>{estimate.ets.status_name}</Badge>
                            )
                        } else if(estimate.ets.status_name === 'Ready'){
                            return(
                                <Badge colorScheme='green' variant='solid' p='8px' rounded='xl'>{estimate.ets.status_name}</Badge>
                            )
                        }
                    }
                return (
                    <Link to={`/editestimate/${estimate.id}`}>
                        <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='sm' pt='1.5rem' pb='1.5rem' key={estimate.id}>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='1rem'>
                                <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='light'>#{estimate.id}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' ml='2rem' >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Date:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(estimate.estimate_date).toLocaleDateString()}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' ml='2rem' >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Due:</Text> */}
                                {/* <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(invoice.due_date).toLocaleDateString()}</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.cu.email}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' ml='2rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Customer:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.cu.name}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' ml='2rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Phone Number:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{estimate.cu.phone_number}</Text>
                            </Box>
                            <Box ml='2rem' display='flex' flexDir='column' justifyContent='center'>
                                {/* <Text letterSpacing='1px' fontSize='18px' mr='8px' fontWeight='bold'>Total:</Text> */}
                                <Text letterSpacing='1px' fontSize='18px' fontWeight='light'>{estimate.quote_price}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='2rem' ml='auto'>
                                {statusBadge()}
                                {/* <Badge ml="1" fontSize="0.8em" colorScheme='yellow' variant='solid' p='4px'>  
                                    <Text>{invoice.invs.status_name}</Text>
                                </Badge> */}
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
