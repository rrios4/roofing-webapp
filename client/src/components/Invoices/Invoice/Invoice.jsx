import React from 'react'
import { Grid, Box, Flex, Text, Badge } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

function Invoice(props) {
    const {menu, invoices} = props;
    if(invoices.length > 0){
        return(
            <Grid gap={4}>
            {invoices.map((invoice, index) => {
                    const statusBadge = () => {
                        if(invoice.invs.status_name === 'Pending'){
                            return(
                                <Badge colorScheme='yellow' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{invoice.invs.status_name}</Badge>
                            )
                        } else if(invoice.invs.status_name === 'Paid'){
                            return(
                                <Badge colorScheme='green' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{invoice.invs.status_name}</Badge>
                            )
                        } else if(invoice.invs.status_name === 'Outstanding'){
                            return(
                                <Badge colorScheme='red' variant='solid' p='8px' w='110px' textAlign='center' rounded='xl'>{invoice.invs.status_name}</Badge>
                            )
                        }
                    }
                return (
                    <Link to={`/editinvoice/${invoice.id}`}>
                        <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='sm' pt='1.5rem' pb='1.5rem' key={invoice.id}>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='1rem'>
                                <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='light'>#{invoice.id}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='2rem' >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Date:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(invoice.inv_date).toLocaleDateString()}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pl='2rem' pr='2rem' >
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Invoice Due:</Text> */}
                                {/* <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{new Date(invoice.due_date).toLocaleDateString()}</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{invoice.cu.name}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pr='2rem' ml='auto'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Customer:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{invoice.cu.email}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' pr='2rem'>
                                {/* <Text letterSpacing='1px' fontSize='18px' fontFamily='sans-serif' fontWeight='bold' mr='8px'>Phone Number:</Text> */}
                                <Text letterSpacing='1px' fontSize='16px' fontFamily='sans-serif' fontWeight='light'>{invoice.cu.phone_number}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center' >
                                {/* <Text letterSpacing='1px' fontSize='18px' mr='8px' fontWeight='bold'>Total:</Text> */}
                                <Text letterSpacing='1px' fontSize='18px' fontWeight='light'>{invoice.amount_due}</Text>
                            </Box>
                            <Box display='flex' flexDir='column' justifyContent='center'   pl='2rem'>
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
    return (
        <div>
            
        </div>
    )
}

export default Invoice
