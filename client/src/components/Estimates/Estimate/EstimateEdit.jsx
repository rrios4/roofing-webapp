import React, {useEffect, useState, useContext} from 'react'
import {Select, Badge, Grid, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon, CheckIcon, CloseIcon, EditIcon} from '@chakra-ui/icons';
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';

const EstimateEdit = (props) => {

    // React States
    const [invoice, setInvoice] = useState('');
    const [customer, setCustomer] = useState('');
    const [cuStatus, setCuStatus] = useState('');
    const [jobType, setJobType] = useState('');
    const [estDate, setEstDate] = useState('');
    const [expDate, setExpDate] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [quotePrice, setQuotePrice] = useState('');
    const [sqMeasurement, setSqMeasurement] = useState('');

    // Define variables
    const {id} = props.match.params;
    const url = 'http://localhost:8081/api';
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();
    let history = useHistory();

    //React functions
    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('currentUser')) {
            history.push('/login');
        }
        getInvoiceById();
    }, []);

    // functions created by me to get what I need of data
    const getInvoiceById = async () => {
        await axios.get(`${url}/estimates/${id}`)
        .then((response) => {
            const invoiceById = response.data;
            const cu = response.data.cu;
            const ets = response.data.ets;
            const jtype = response.data.jtype;
            //add our data to state
            setInvoice(invoiceById);
            setCustomer(cu);
            setCuStatus(ets);
            console.log(invoiceById);
        })
        .catch(error => console.error(`Error: ${error}`));
    }   

    const statusBadge = () => {
        if(cuStatus.status_name === 'Pending'){
            return(
                <Badge colorScheme='yellow' variant='solid' p='8px' rounded='xl'>{cuStatus.status_name}</Badge>
            )
        } else if(cuStatus.status_name === 'Approved'){
            return(
                <Badge colorScheme='green' variant='solid' p='8px' rounded='xl'>{cuStatus.status_name}</Badge>
            )
        } else if(cuStatus.status_name === 'Expired') {
            return(
                <Badge colorScheme='red' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{cuStatus.status_name}</Badge>
            )
        }
    }

    const deleteEstimate = async () => {
        // console.log('Button will perform a delete to the database.');
        await axios.delete(`${url}/estimates/${id}`)
        .then((response) => {
            console.log("Estimate has been deleted!")
            return <Redirect to='/estimates' />
        })
        .catch(error => console.error(`Error: ${error}`));
        history.push("/estimates")
                
    }

    const markEstimateApproved = async() => {
        await axios.put(`http://localhost:8081/api/estimates/${id}`, {
            etStatusId : '1'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
    };

    const markEstimatePending = async() => {
        await axios.put(`http://localhost:8081/api/estimates/${id}`, {
            etStatusId: '2'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
        .catch(error => console.error(`Error: ${error}`));
    };

    const markEstimateExpired = async() => {
        await axios.put(`http://localhost:8081/api/estimates/${id}`, {
            etStatusId: '3'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
        .catch(error => console.error(`Error: ${error}`));
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://localhost:8081/api/estimates/${id}`
        const json = {
            estimate_date: estDate,
            exp_date: expDate,
            sqft_measurement: sqMeasurement,
            service_name: serviceName,
            quote_price: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quotePrice)}`,
        }
        await axios.put(url2, json)
        .then((response) => {
            console.log('I was submitted', response);
        })
        .catch((err) => {
            console.error(err);
        })
        // setJobTypeOption('');
        // setSelectInvoiceStatus('');
        setServiceName('');
        setEstDate('');
        setExpDate('');
        setQuotePrice('');
        // setInvoiceDate('');
        // setDueDate('');
        // setAmountDue('');
        getInvoiceById();
        onClose();
        console.log('Submit Function works!')
        //history.go(0);
    };

    return(
        <Flex direction='column' justifyContent='center' pb='1rem' pt='1rem' w={[300, 400, 800]} >
                <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p='1rem' ml='6rem'>
                        <ModalHeader textAlign='center'>Edit Estimate</ModalHeader>
                        <ModalCloseButton />
                        <form method='PUT' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Estimate Date</FormLabel>
                                    <Input type='date' value={estDate} onChange={({target}) => setEstDate(target.value)} id='invDate' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Expiration Date</FormLabel>
                                    <Input type='date' value={expDate} onChange={({target}) => setExpDate(target.value)} id='dueDate' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                        <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired={true}>
                                    <FormLabel pt='1rem'>Quoted Price</FormLabel>
                                    <Input value={quotePrice} onChange={({target}) => setQuotePrice(target.value)} placeholder='Quote price' type='number'/>
                                </FormControl>
                                <FormControl isRequired={true}>
                                    <FormLabel pt='1rem'>SQ FT Measurement</FormLabel>
                                    <Input value={sqMeasurement} onChange={({target}) => setSqMeasurement(target.value)} placeholder='Square Feet' type='number'></Input>
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={handleSubmit} >Save</Button>
                            <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>
                    </ModalContent> 
                </Modal>
                    <Link to='/estimates'>
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
                                    <Button colorScheme='yellow' onClick={markEstimatePending}>Mark Pending</Button>
                                </Box>
                                <Box pr='1rem'>
                                    <Button colorScheme='green' onClick={markEstimateApproved}>Approved</Button>
                                </Box>
                                <Box pr='1rem' >
                                    <Button colorScheme='red' onClick={markEstimateExpired}>Mark Expired</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
                        <Box display='flex' flexDir='column' p='1rem' rounded='2xl' bg='gray.600' shadow='md' w={[300, 400, 800]}>
                            <Box display='flex' justifyContent='flex-end' pr='2rem' pt='1rem'>
                                <Button colorScheme='blue' onClick={onOpen}>Edit</Button>
                                <Box pl='1rem'>
                                    <Button colorScheme='red' onClick={deleteEstimate}>Delete</Button>
                                </Box>
                            </Box>
                            <Box display='flex' p='2rem' bg='gray.600' rounded='xl'>
                                <Box>
                                    <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Estimate #{invoice.id}</Text>
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
                                        <Text fontSize='22px' fontWeight='bold'>Estimate Date:</Text>
                                        <Text>{new Date(invoice.estimate_date).toLocaleDateString()}</Text>  
                                    </Box>
                                    <Box>
                                        <Text fontSize='22px' fontWeight='bold'>Expiration Date:</Text>
                                        <Text>{new Date(invoice.exp_date).toLocaleDateString()}</Text>
                                    </Box>
                                </Box>
                                <Box display='flex' flexDir='column' p='1rem' ml='auto' mr='auto'>
                                    <Box>
                                        <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>EST For:</Text>
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
                                                {/* <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>QTY.</Text> */}
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
                                                <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{`${invoice.sqft_measurement} sqft.`}</Text>
                                            </Box>
                                            <Box>
                                                <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{invoice.quote_price}</Text>
                                            </Box>
                                            <Box mr='1rem'>
                                                <Text letterSpacing='1px'  fontSize='16px' fontWeight='bold'>{invoice.quote_price}</Text>
                                            </Box>
                                    </Box>
                                </Box>
                                <Box display='flex'  bg='blue.600' p='2rem' roundedBottom='xl'>
                                        <Box ml='auto'>
                                            <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>Estimated Price:</Text>
                                        </Box>
                                        <Box ml='4rem' >
                                            <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>{invoice.quote_price}</Text>
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

export default EstimateEdit