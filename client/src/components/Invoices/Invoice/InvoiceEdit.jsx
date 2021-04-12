import React, {useEffect, useState} from 'react'
import { Box, Flex , Text, ButtonGroup, IconButton, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input, Alert, AlertIcon } from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon, CheckIcon, CloseIcon, EditIcon} from '@chakra-ui/icons';
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';

// function InvoiceEdit(props) {
//     // React States
//     const [invoice, getInvoice] = useState(''); 

//     //React functions
//     useEffect(() => {
//         getInvoiceById();
//     }, []);

//     // Define variables
//     const {id} = props.match.params;
//     const url = 'http://localhost:8081/api';
//     let history = useHistory();

//     // functions to use
//     const getInvoiceById = async () => {
//         await axios.get(`${url}/invoices/${id}`)
//         .then((response) => {
//             const invoiceById = response.data;
//             //add our data to state
//             getInvoice(invoiceById);
//             console.log(invoiceById);
//         })
//         .catch(error => console.error(`Error: ${error}`));
//     }
    
//     return (
//         <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
//                     <Link to='/invoices'>
//                         <Box display='flex'  pt='2rem' pb='1rem' pl='1rem'>
//                             <Box display='flex' rounded='xl' p='1rem'>
//                                 <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
//                             </Box>
//                         </Box>
//                     </Link>
//                     <Box display='flex' pt='1rem' justifyContent='center'>
//                         <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
//                             <Box display='flex' mr='auto' pl='1rem'>
//                                 <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
//                                     <Text fontWeight='bold' fontSize='20px' color='white'>Status:</Text>
//                                 </Box>
//                                 <Box >
//                                     <Badge bg='green.600' p='8px'>Active</Badge>
//                                 </Box>
//                             </Box>
//                             <Box display='flex' pr='1rem'>
//                                 <Box pr='1rem'>
//                                     <Button>Edit</Button>
//                                 </Box>
//                                 <Box color='white'>
//                                     <Button bg='red.600'>Delete</Button>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     </Box>
//                     <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
//                         <Box display='flex' flexDir='column' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
//                             <Box display='flex' p='2rem'>
//                                 <Box>
//                                     <Text fontWeight='bold'>Invoice Number:</Text>
//                                     <Text fontSize='30px' fontWeight='regular'> #{invoice.id}</Text>
//                                 </Box>
//                                 <Box display='flex' flexDir='column' ml='auto' >
//                                     <Text textAlign='right' fontWeight='bold'>Rios Roofing</Text>
//                                     <Text textAlign='right'>150 Tallant St</Text>
//                                     <Text textAlign='right'>Houston, TX</Text>
//                                     <Text textAlign='right'>77076</Text>
//                                     <Text textAlign='right'>United States</Text>
//                                 </Box>
//                             </Box>
//                             <Box display='flex' justifyContent='space-between' p='1rem'>
//                                 <Box display='flex' flexDir='column' p='1rem' justifyContent='space-between'>
//                                     <Box pb='1rem'>
//                                         {/* <Editable defaultValue={customer.name}>
//                                             <EditablePreview/>
//                                             <EditableInput/>
//                                             <EditableControls/>
//                                         </Editable> */}
//                                         <Text fontWeight='bold'>Invoice Date:</Text>
//                                         <Text>{invoice.inv_date}</Text>  
//                                     </Box>
//                                     <Box>
//                                         <Text fontWeight='bold'>Payment Due:</Text>
//                                         <Text>{invoice.due_date}</Text>
//                                     </Box>
//                                 </Box>
//                                 <Box display='flex' flexDir='column' p='1rem'>
//                                     <Box>
//                                         <Text fontWeight='bold'>Bill To:</Text>
//                                     </Box>
//                                     <Box>
//                                         <Text>{invoice.cu.name}</Text>
//                                     </Box>
//                                     <Box>
//                                         {invoice.cu.address}
//                                     </Box>
//                                     <Box>
//                                         {invoice.cu.city}, {invoice.cu.state}
//                                     </Box>
//                                     <Box>
//                                         United States
//                                     </Box>
                                    
//                                 </Box>
//                                 <Box display='flex' flexDir='column' p='1rem' mr='auto'>
//                                     <Box>
//                                         <Text fontWeight='bold'>Email To: </Text>
//                                     </Box>
//                                     {invoice.cu.email}
//                                 </Box>
//                             </Box>
//                             <Grid>

//                             </Grid>
//                         </Box>
//                     </Box>
//             </Flex>
//     )
// }

// export default InvoiceEdit

const InvoiceEdit = (props) => {
    // React States
    const [invoice, getInvoice] = useState(''); 

    //React functions
    useEffect(() => {
        getInvoiceById();
    }, []);

    // Define variables
    const {id} = props.match.params;
    const url = 'http://localhost:8081/api';
    let history = useHistory();

    // functions to use
    const getInvoiceById = async () => {
        await axios.get(`${url}/invoices/${id}`)
        .then((response) => {
            const invoiceById = response.data;
            //add our data to state
            getInvoice(invoiceById);
            console.log(invoiceById);
        })
        .catch(error => console.error(`Error: ${error}`));
    }    
    return (
        <Flex direction='column' justifyContent='center' pb='2rem' pt='2rem' w={[300, 400, 800]} >
                    <Link to='/invoices'>
                        <Box display='flex'  pt='2rem' pb='1rem' pl='1rem'>
                            <Box display='flex' rounded='xl' p='1rem'>
                                <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
                            </Box>
                        </Box>
                    </Link>
                    <Box display='flex' pt='1rem' justifyContent='center'>
                        <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                            <Box display='flex' mr='auto' pl='1rem'>
                                <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
                                    <Text fontWeight='bold' fontSize='20px' color='white'>Status:</Text>
                                </Box>
                                <Box >
                                    <Badge bg='green.600' p='8px'>Active</Badge>
                                </Box>
                            </Box>
                            <Box display='flex' pr='1rem'>
                                <Box pr='1rem'>
                                    <Button>Edit</Button>
                                </Box>
                                <Box color='white'>
                                    <Button bg='red.600'>Delete</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                        <Box display='flex' flexDir='column' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                            <Box display='flex' p='2rem'>
                                <Box>
                                    <Text fontWeight='bold'>Invoice Number:</Text>
                                    <Text fontSize='30px' fontWeight='regular'> #{invoice.id}</Text>
                                </Box>
                                <Box display='flex' flexDir='column' ml='auto' >
                                    <Text textAlign='right' fontWeight='bold'>Rios Roofing</Text>
                                    <Text textAlign='right'>150 Tallant St</Text>
                                    <Text textAlign='right'>Houston, TX</Text>
                                    <Text textAlign='right'>77076</Text>
                                    <Text textAlign='right'>United States</Text>
                                </Box>
                            </Box>
                            <Box display='flex' justifyContent='space-between' p='1rem'>
                                <Box display='flex' flexDir='column' p='1rem' justifyContent='space-between'>
                                    <Box pb='1rem'>
                                        {/* <Editable defaultValue={customer.name}>
                                            <EditablePreview/>
                                            <EditableInput/>
                                            <EditableControls/>
                                        </Editable> */}
                                        <Text fontWeight='bold'>Invoice Date:</Text>
                                        <Text>{new Date(invoice.inv_date).toLocaleDateString()}</Text>  
                                    </Box>
                                    <Box>
                                        <Text fontWeight='bold'>Payment Due:</Text>
                                        <Text>{new Date(invoice.due_date).toLocaleDateString()}</Text>
                                    </Box>
                                </Box>
                                <Box display='flex' flexDir='column' p='1rem'>
                                    <Box>
                                        <Text fontWeight='bold'>Bill To:</Text>
                                    </Box>
                                    <Box>
                                        {/* <Text>{invoice.cu.name}</Text> */}
                                    </Box>
                                    <Box>
                                        {/* {invoice.cu.address} */}
                                    </Box>
                                    <Box>
                                        {/* {invoice.cu.city}, {invoice.cu.state} */}
                                    </Box>
                                    <Box>
                                        United States
                                    </Box>
                                    
                                </Box>
                                <Box display='flex' flexDir='column' p='1rem' mr='auto'>
                                    <Box>
                                        <Text fontWeight='bold'>Email To: </Text>
                                    </Box>
                                    {/* {invoice.cu.email} */}
                                </Box>
                            </Box>
                            <Grid>

                            </Grid>
                        </Box>
                    </Box>
            </Flex>
    )
}

export default InvoiceEdit;
