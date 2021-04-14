import React, {useEffect, useState, useContext} from 'react'
import { Box, Flex , Text, ButtonGroup, IconButton, Editable, EditablePreview, EditableInput, Badge, Button, Grid, PopoverContent, FormControl, FormLabel, Input, Alert, AlertIcon, color } from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon, CheckIcon, CloseIcon, EditIcon} from '@chakra-ui/icons';
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import { InvoiceContext } from './InvoiceContext';

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
    //React functions
    useEffect(() => {
        getInvoiceById();
    }, []);

    // React States
    const [invoice, setInvoice] = useState('');
    const [customer, setCustomer] = useState('');
    const [cuStatus, setCuStatus] = useState('');
    const [jobType, setJobType] = useState('');

    // Define variables
    const {id} = props.match.params;
    const url = 'http://localhost:8081/api';
    let history = useHistory();

    // functions created by me to get what I need of data
    const getInvoiceById = async () => {
        await axios.get(`${url}/invoices/${id}`)
        .then((response) => {
            const invoiceById = response.data;
            const cu = response.data.cu;
            const invs = response.data.invs;
            const jtype = response.data.jtype;
            console.log(cu)
            //add our data to state
            setInvoice(invoiceById);
            setCustomer(cu);
            setCuStatus(invs);
            setJobType(jtype);
            console.log(invoiceById);
        })
        .catch(error => console.error(`Error: ${error}`));
    }   

    const statusBadge = () => {
        if(cuStatus.status_name === 'Pending'){
            return(
                <Badge colorScheme='yellow' variant='solid' p='8px' rounded='xl'>{cuStatus.status_name}</Badge>
            )
        } else if(cuStatus.status_name === 'Active'){
            return(
                <Badge colorScheme='green' variant='solid' p='8px' rounded='xl'>{cuStatus.status_name}</Badge>
            )
        }
    }
    
    
    return (
        <Flex direction='column' justifyContent='center' pb='1rem' pt='1rem' w={[300, 400, 800]} >
                    <Link to='/invoices'>
                        <Box display='flex'  pt='1rem' pb='1rem' pl='1rem'>
                            <Box display='flex' rounded='xl' p='1rem'>
                                <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
                            </Box>
                        </Box>
                    </Link>
                    <Box display='flex' pt='1rem' justifyContent='center'>
                        <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
                            <Box display='flex' mr='auto' pl='1rem'>
                                <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
                                    <Text fontWeight='light' fontSize='18px' color='white'>Status:</Text>
                                </Box>
                                <Box display='flex' flexDir='column' justifyContent='center' >
                                    {/* <Badge colorScheme='yellow' variant='solid' p='8px'>{cuStatus.status_name}</Badge> */}
                                    {statusBadge()}
                                </Box>
                            </Box>
                            <Box display='flex' pr='1rem'>
                                <Box pr='1rem' >
                                    <Button colorScheme='green'>Mark as Paid</Button>
                                </Box>
                                <Box>
                                    <Button colorScheme='red'>Delete</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                        <Box display='flex' flexDir='column' p='1rem' rounded='2xl' bg='gray.600' shadow='md' w={[300, 400, 800]}>
                            <Box display='flex' p='2rem' bg='gray.600' rounded='xl'>
                                <Box>
                                    <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Invoice #{invoice.id}</Text>
                                    <Text  fontSize='20px' fontWeight='light' letterSpacing='1px'>{jobType.type_name}</Text>
                                </Box>
                                <Box display='flex' flexDir='column' ml='auto' >
                                    <Text textAlign='right' fontWeight='bold'>Rios Roofing</Text>
                                    <Text textAlign='right' fontWeight='light'>150 Tallant St</Text>
                                    <Text textAlign='right' fontWeight='light'>Houston, TX</Text>
                                    <Text textAlign='right' fontWeight='light'>77076</Text>
                                    <Text textAlign='right' fontWeight='light'>United States</Text>
                                </Box>
                            </Box>
                            <Box display='flex' justifyContent='center' p='1rem' pt='1rem' pb='1rem'>
                                <Box display='flex' flexDir='column' p='1rem' >
                                    <Box pb='1rem'>
                                        {/* <Editable defaultValue={customer.name}>
                                            <EditablePreview/>
                                            <EditableInput/>
                                            <EditableControls/>
                                        </Editable> */}
                                        <Text fontSize='22px' fontWeight='bold'>Invoice Date:</Text>
                                        <Text>{new Date(invoice.inv_date).toLocaleDateString()}</Text>  
                                    </Box>
                                    <Box>
                                        <Text fontSize='22px' fontWeight='bold'>Payment Due:</Text>
                                        <Text>{new Date(invoice.due_date).toLocaleDateString()}</Text>
                                    </Box>
                                </Box>
                                <Box display='flex' flexDir='column' p='1rem' ml='auto' mr='auto'>
                                    <Box>
                                        <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Bill To:</Text>
                                    </Box>
                                    <Box pb='4px'>
                                        <Text letterSpacing='1px'>{customer.name}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight='light' letterSpacing='1px'>{customer.address},</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight='light' letterSpacing='1px'>{customer.city}, {customer.state}, 77076</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight='light' letterSpacing='1px'>{customer.zipcode}</Text>
                                    </Box>
                                    <Box>
                                        <Text letterSpacing='1px'>United States</Text>
                                    </Box>
                                    
                                </Box>
                                <Box display='flex' flexDir='column' p='1rem'>
                                    <Box>
                                        <Text fontSize='22px' fontWeight='bold'>Email To: </Text>
                                    </Box>
                                    <Text letterSpacing='1px'>{customer.email}</Text>
                                </Box>
                            </Box>
                            <Box display='flex' flexDir='column' p='1rem' >
                                <Box display='flex' flexDir='column' bg='gray.700' p='1rem' roundedTop='xl'>
                                    <Box display='flex' justifyContent='space-between' >
                                            <Box ml='1rem'>
                                                <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Service Name</Text>    
                                            </Box> 
                                            <Box>
                                                <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>QTY.</Text>
                                            </Box>
                                            <Box>
                                                <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Price</Text>
                                            </Box>
                                            <Box mr='1rem'>
                                                <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Total</Text>
                                            </Box>
                                    </Box>
                                    <Box display='flex' justifyContent='space-between' pt='1rem' pb='1rem' >
                                            <Box ml='1rem'>
                                                <Text letterSpacing='1px' fontSize='16px' fontWeight='light'>{invoice.service_name}</Text>    
                                            </Box> 
                                            <Box>
                                                <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>1</Text>
                                            </Box>
                                            <Box>
                                                <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{invoice.amount_due}</Text>
                                            </Box>
                                            <Box mr='1rem'>
                                                <Text letterSpacing='1px'  fontSize='16px' fontWeight='bold'>{invoice.amount_due}</Text>
                                            </Box>
                                    </Box>
                                </Box>
                                <Box display='flex'  bg='blue.600' p='2rem' roundedBottom='xl'>
                                        <Box ml='auto'>
                                            <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>Amount Due:</Text>
                                        </Box>
                                        <Box ml='4rem' >
                                            <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>{invoice.amount_due}</Text>
                                        </Box>
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
