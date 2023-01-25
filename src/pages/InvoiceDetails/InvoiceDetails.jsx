import React, {useEffect, useState, useContext} from 'react'
import {Select, Badge, Grid, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, Container, Card, CardBody, Image, Divider, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tooltip, Avatar, Accordion, Skeleton, useColorModeValue} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
// import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import swal from 'sweetalert';
import {ChevronLeftIcon} from '@chakra-ui/icons'
import { FiArrowLeft, FiMoreHorizontal, FiLin, FiShare2, FiUploadCloud, FiPaperclip, FiSend, FiClock, FiAlignLeft, FiCircle } from 'react-icons/fi'
import { MdOutlinePayments } from 'react-icons/md'
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';

const InvoiceDetails = (props) => { 
    const bgColorMode = useColorModeValue('gray.100','gray.600')
    
    // React States
    const [invoice, setInvoice] = useState();
    const [invoicePayments, setInvoicePayments] = useState();
    const [invoiceServiceLineItems, setInvoiceServiceLineItems] = useState();
    const [customer, setCustomer] = useState('');
    const [cuStatus, setCuStatus] = useState('');
    const [jobType, setJobType] = useState('');
    
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [selectInvoiceStatus, setSelectInvoiceStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [selectJobTypeOption, setJobTypeOption] = useState('');

    // Define variables
    const {id} = useParams();
    const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;
    let navigate = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = React.useRef();

    //React functions
    useEffect(() => {
        getInvoiceDetailsById()
        getAllInvoicePayments()
        getAllInvoiceServiceLineItems()
    }, []);

    // functions created by me to get what I need of data
    const getInvoiceById = async () => {
        await axios.get(`${url}/invoices/${id}`)
        .then((response) => {
            const invoiceById = response.data;
            const cu = response.data.cu;
            const invs = response.data.invs;
            const jtype = response.data.jtype;
            //add our data to state
            setInvoice(invoiceById);
            setCustomer(cu);
            setCuStatus(invs);
            setJobType(jtype);
        })
        .catch(error => console.error(`Error: ${error}`));
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/invoices/${id}`
        const json = {
            jobTypeId: selectJobTypeOption,
            service_name: serviceName,
            inv_date: invoiceDate,
            due_date: dueDate,
            amount_due: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountDue)}`
        }
        await axios.put(url2, json)
        .then((response) => {
            console.log('I was submitted', response);
        })
        .catch((err) => {
            console.error(err);
        })
        setJobTypeOption('');
        setSelectInvoiceStatus('');
        setServiceName('');
        setInvoiceDate('');
        setDueDate('');
        setAmountDue('');
        getInvoiceById();
        onClose();
        console.log('Submit Function works!')
        //history.go(0);
    };

    const statusBadge = () => {
        if(cuStatus.status_name === 'Pending'){
            return(
                <Badge colorScheme='yellow' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{cuStatus.status_name}</Badge>
            )
        } else if(cuStatus.status_name === 'Paid'){
            return(
                <Badge colorScheme='green' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{cuStatus.status_name}</Badge>
            )
        } else if(cuStatus.status_name === 'Outstanding') {
            return(
                <Badge colorScheme='red' variant='solid' p='8px' w='110px' textAlign='center'  rounded='xl'>{cuStatus.status_name}</Badge>
            )
        }
    }

    const handleJobTypeInput = (e) => {
        const selectedValue = e.target.value;
        setJobTypeOption(selectedValue);
    };

    const deleteInvoice = async () => {
        // console.log('Button will perform a delete to the database.');
        // await axios.delete(`${url}/invoices/${id}`)
        // .then((response) => {
        //     console.log("Invoice has been deleted!")
        //     return <Redirect to='/invoices' />
        // })
        // .catch(error => console.error(`Error: ${error}`));
        // history.push("/invoices")
        await swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover invoice info!',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
        .then((willDelete) => {
            if(willDelete) {
                axios.delete(`${url}/invoices/${id}`)
                .then(response => {
                    navigate("/invoices")
                })
                swal("Poof! Your invoice has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your invoice data was not deleted!");
                navigate(`/editinvoice/${id}`)
            }
        })         
    }

    const markInvoicePaid = async() => {
        await axios.put(`http://${process.env.REACT_APP_BASE_URL}:8081/api/invoices/${id}`, {
            invStatusId : '2'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
    };

    const markInvoicePending = async() => {
        await axios.put(`http://${process.env.REACT_APP_BASE_URL}:8081/api/invoices/${id}`, {
            invStatusId: '1'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
        .catch(error => console.error(`Error: ${error}`));
    };

    const markInvoiceOutstanding = async() => {
        await axios.put(`http://${process.env.REACT_APP_BASE_URL}:8081/api/invoices/${id}`, {
            invStatusId: '3'
        })
        .then((response) => {
            getInvoiceById();
            console.log(response);
        })
        .catch(error => console.error(`Error: ${error}`));
    };

    // Function that call the supabase DB to get invoice info
    const getInvoiceDetailsById = async() => {
        const { data, error } = await supabase
        .from('invoice')
        .select('*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)')
        .eq('invoice_number', `${id}`)

        if(error){
            console.log(error)
        }
        setInvoice(data[0])
        // console.log(invoice)
    }

    // Get is a list of all payment associated to invoice number
    const getAllInvoicePayments = async() => {
        const { data, error } = await supabase
        .from('payment')
        .select('amount, payment_method, date_received')
        .eq('invoice_id', `${id}`)

        if(error){
            console.log(error)
        }
        setInvoicePayments(data)
        console.log(data)
    }

    // Get a list of all service line items associated to invoice number
    const getAllInvoiceServiceLineItems = async() => {
        const { data, error } = await supabase
        .from('invoice_line_service')
        .select('*')
        .eq('invoice_id', `${id}`)

        if(error){
            console.log(error)
        }

        setInvoiceServiceLineItems(data)
        console.log(data)
    }
    
    
    return (
        <Container maxW={'1400px'} pt={'2rem'} pb={'4rem'}>
            {/* Header */}
            <Flex justify={'space-between'} mb={'1rem'} flexDir={{base: 'row', lg: 'row'}}>
                <Flex px={'1rem'} gap={4} mb={{base: '0rem', lg: '0'}}>
                    <Button borderColor={'gray.300'} colorScheme={'gray'}><FiArrowLeft/></Button>
                    {/* <Text my={'auto'} fontSize={'xl'} fontWeight={'bold'}>INV #{id}</Text> */}
                </Flex>
                <Flex px={'1rem'} gap={4} ml={{base: 'auto', lg: '0'}}>
                    <Tooltip hasArrow label="More"><Button colorScheme={'gray'}><FiMoreHorizontal/></Button></Tooltip>
                    <Tooltip hasArrow label="Share"><Button colorScheme={'gray'}><FiShare2/></Button></Tooltip>
                    <Tooltip hasArrow label="Send invoice"><Button colorScheme={'blue'} gap={2}><FiSend/>Send invoice</Button></Tooltip>
                </Flex>
            </Flex>
            <Flex px={'1rem'} gap={6} flexDir={{base: 'column', lg: 'row'}}>
                {/* Left Section */}
                <Flex w={{base:'full', lg:'60%'}}>
                    <Card w={'full'} rounded={'xl'}>
                        <CardBody>
                            {/* Header with Buttons */}
                            <Flex justifyContent={'flex-end'} pr={'1rem'}>
                                <Tooltip hasArrow label="Upload images"><Button variant={'outline'} roundedRight={'none'}><FiUploadCloud/></Button></Tooltip>
                                <Tooltip hasArrow label="Upload documents"><Button variant={'outline'} roundedLeft={'none'}><FiPaperclip/></Button></Tooltip>
                            </Flex>
                            <Flex px={'2rem'} pb='3rem'>
                                <Image src="https://github.com/rrios4/roofing-webapp/blob/main/src/assets/LogoRR.png?raw=true" maxW={'70px'} p={'1'} bg={'blue.500'} rounded={'2xl'}/>
                                <Box ml={'2rem'}>
                                    <Text fontWeight={'semibold'} fontSize={'3xl'} letterSpacing={'0px'}>Invoice <Text as={'span'} color={'blue.400'}>#</Text> {id}</Text>
                                    <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>Due {invoice?.due_date}</Text>
                                </Box>
                            </Flex>
                            <Box  px={'2rem'} mb={'3rem'}>
                                <Flex mb={'1rem'}>
                                    <Text w='50px' fontWeight={'bold'} textColor={'gray.500'}>To</Text>
                                    <Box>
                                        <Text ml={'3rem'} fontWeight={'semibold'}>{invoice?.customer.first_name} {invoice?.customer.last_name}</Text>
                                        <Text ml={'3rem'}>{invoice?.bill_to_street_address}</Text>
                                        <Text ml={'3rem'}>{invoice?.bill_to_city}, {invoice?.bill_to_state} {invoice?.bill_to_zipcode}</Text>
                                        <Text ml={'3rem'} color={'blue.400'}>{invoice?.customer.email}</Text>
                                    </Box>
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w='50px' fontWeight={'bold'} textColor={'gray.500'}>From</Text>
                                    <Box>
                                        <Text ml={'3rem'} fontWeight={'semibold'}>Rios Roofing</Text>
                                        <Text ml={'3rem'}>150 Tallant St</Text>
                                        <Text ml={'3rem'}>Houston, TX 77076</Text>
                                        <Text ml={'3rem'} color={'blue.400'}>rroofing@gmail.com</Text>
                                    </Box>
                                </Flex>
                                <Flex>
                                    <Text w='50px' fontWeight={'bold'} textColor={'gray.500'}>Notes</Text>
                                    <Text ml={'3rem'}>{invoice?.cust_note}</Text>
                                </Flex>
                            </Box>
                            <Divider w={'95%'} mx={'auto'}/>
                            {/* Line Item Table */}
                            <Box px={'2rem'} py={'2rem'} >
                                <TableContainer rounded={'xl'}>
                                    <Table variant={'simple'}>
                                        <Thead bg={bgColorMode} rounded={'xl'}>
                                            <Tr>
                                                <Th>Description</Th>
                                                <Th>Qty</Th>
                                                <Th>Rate</Th>
                                                <Th>Amount</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {invoiceServiceLineItems?.map((item, index) => (
                                                <Tr key={index}>
                                                    <Td>{item.description}</Td>
                                                    <Td>{item.qty}</Td>
                                                    <Td>{item.item_rate === true ? item.rate : 'Fixed'}</Td>
                                                    <Td>${formatMoneyValue(item.amount)}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Box px={'4rem'} pb='2rem'>
                                <Flex mb={'2rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'}>Subtotal</Text>
                                    <Text ml={'auto'} mr={'1rem'}>${formatMoneyValue(invoice?.subtotal)}</Text>
                                </Flex>
                                <Flex mb={'2rem'}>
                                    <Text fontWeight={'bold'} fontSize={'xl'}>Amount Due</Text>
                                    <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'} mr={'1rem'}>${formatMoneyValue(invoice?.total)}</Text>
                                </Flex>
                                <Flex w={'full'}>
                                    <Button w={'full'}>Add Payment</Button>
                                </Flex>
                            </Box>
                        </CardBody>
                    </Card>
                </Flex>
                {/* Right Section */}
                <Flex w={{base:'full', lg:'40%'}} >
                    <Card w={'full'} rounded={'xl'}>
                        <CardBody overflowY={'auto'}>
                            {/* Invoice Extra Details */}
                            <Box px={'2rem'} py={'1rem'}>
                                <Flex alignItems={'center'} gap={3} mb={'1rem'}>
                                    <FiAlignLeft size={'25px'} color='gray'/>
                                    <Text fontSize={'2xl'} fontWeight={'semibold'} color={'gray.500'}>Details</Text>
                                </Flex>
                                <Flex justifyContent={'space-between'} mb={'1rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'} my={'auto'}>Status</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Badge colorScheme={invoice?.invoice_status.name === 'New' ? 'green' : invoice?.invoice_status.name === 'Sent' ? 'yellow' : invoice?.invoice_status.name === 'Paid' ? 'blue' : invoice?.invoice_status.name === 'Overdue' ? 'red' : 'purple'}  variant={'solid'} mr={'1rem'} pt={'2px'} w={'80px'} rounded={'xl'} textAlign={'center'}>{invoice?.invoice_status.name}</Badge>}
                                </Flex>
                                <Flex justifyContent={'space-between'} mb={'1rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'}>Service</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Text mr={'1rem'}>{invoice?.service_type.name}</Text> }
                                    {/* <Text mr={'1rem'}>{invoice?.service_type.name}</Text> */}
                                </Flex>
                                <Flex justifyContent={'space-between'} mb={'1rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'}>Invoice Date</Text>
                                    <Text mr={'1rem'}>{invoice?.invoice_date ? invoice?.invoice_date : <Skeleton height={'20px'}/>}</Text>
                                </Flex>
                                <Flex justifyContent={'space-between'} mb={'1rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'}>Issue Date</Text>
                                    <Text mr={'1rem'}>{invoice?.issue_date}</Text>
                                </Flex>
                                <Flex justifyContent={'space-between'} mb={'1rem'}>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'} my={'auto'}>Customer</Text>
                                    <Flex>
                                        <Button variant={'ghost'}>
                                            <Avatar size={'xs'}/>
                                            {!invoice ? <Skeleton height={'20px'}/> : <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>{invoice?.customer.first_name} {invoice?.customer.last_name}</Text> }
                                        </Button>
                                    </Flex>
                                </Flex>
                                <Box>
                                    <Text fontWeight={'semibold'} textColor={'gray.500'} my={'auto'} mb={'8px'}>Note</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Text>{invoice.note}</Text>}
                                </Box>
                            </Box>
                            <Divider w={'95%'} mx={'auto'}/>
                            {/* Invoice Payment History */}
                            <Box px={'2rem'} py={'1rem'}>
                            <Flex alignItems={'center'} gap={3} mb={'1rem'}>
                                    <FiClock size={'25px'} color='gray'/>
                                    <Text fontSize={'2xl'} fontWeight={'semibold'} color={'gray.500'}>Payment History</Text>
                                </Flex>
                                <Flex direction={'column'} py={'1rem'} px={'8px'}>
                                    {/* Timeline Component */}
                                    {invoicePayments?.map((item, index) => (
                                        <Flex key={index}>
                                            <Flex direction={'column'} h={'70px'} gap={1}>
                                                {/* <Box rounded={'full'} bg={'green.500'} max-w={'10px'} max-h={'10px'}></Box> */}
                                                <FiCircle color='green' size={'15px'} />
                                                <Divider orientation='vertical' mx={'auto'} bg={"slate.100"}/>
                                            </Flex>
                                            <Box ml={'1rem'}>
                                                <Text fontSize={'sm'} fontWeight={'bold'}>{item.date_received}</Text>
                                                <Text fontSize={'xs'}>{item.payment_method}</Text>
                                                <Text fontSize={'xs'} fontWeight={'semibold'}>${formatMoneyValue(item.amount)}</Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </Flex>

                            </Box>

                        </CardBody>
                    </Card>

                </Flex>
            </Flex>

        </Container>
        // <Flex direction='column' justifyContent='center' pb='3rem' pt='1rem' w={[300, 400, 800]} >
        //     <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        //             <ModalOverlay />
        //             <ModalContent p='1rem' ml='6rem'>
        //                 <ModalHeader textAlign='center'>Edit Invoice</ModalHeader>
        //                 <Text color='red' textAlign='center'>Fill all fields please!</Text>
        //                 <ModalCloseButton />
        //                 <form method='PUT' onSubmit={handleSubmit}>
        //                 <ModalBody>
        //                         <FormControl isRequired={true}>
        //                             <FormLabel pt='1rem'>Job Type</FormLabel>
        //                             <Select defaultValue={null} value={selectJobTypeOption} placeholder='Select Job Type' onChange={(e) => handleJobTypeInput(e)}>
        //                                 <option value='1'>New Roof Installation</option>
        //                                 <option value='2'>Roof Repairs</option>
        //                                 <option value='3'>Structure Construction</option>
        //                                 <option value='4'>Siding Repair</option>
        //                                 <option value='5'>Roof Maintenance</option>
        //                                 <option value='6'>Painting Interior of Home</option>
        //                                 <option value='6'>Painting Exterior of Home</option>
        //                                 <option value='6'>Flooring Installation</option>
                                        
        //                             </Select>
        //                             {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
        //                         </FormControl>
        //                         <FormControl isRequired>
        //                             <FormLabel pt='1rem'>Invoice Date</FormLabel>
        //                             <Input type='date' value={invoiceDate} onChange={({target}) => setInvoiceDate(target.value)} id='invDate' placeholder='Invoice date'/>
        //                         </FormControl>
        //                         <FormControl isRequired>
        //                             <FormLabel pt='1rem'>Due Date</FormLabel>
        //                             <Input type='date' value={dueDate} onChange={({target}) => setDueDate(target.value)} id='dueDate' placeholder='Due date'/>
        //                         </FormControl>
        //                         <FormControl isRequired>
        //                         <FormLabel pt='1rem'>Service Name</FormLabel>
        //                             <InputGroup>
        //                                 <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
        //                             </InputGroup>
        //                         </FormControl>
        //                         <FormControl isRequired={true}>
        //                             <FormLabel pt='1rem'>Amount Due</FormLabel>
        //                             <Input value={amountDue} onChange={({target}) => setAmountDue(target.value)} placeholder='Amount due' type='number'/>
        //                         </FormControl>
        //                 </ModalBody>
        //                 <ModalFooter>
        //                     <Button colorScheme='blue' mr={3} type='submit' onClick={handleSubmit} >Save</Button>
        //                     <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
        //                 </ModalFooter>
        //                 </form>

        //             </ModalContent> 
        //         </Modal>
        //         <Link to='/invoices'>
        //         <Box display='flex' pt='1rem' pb='1rem' pl='1rem'>
        //             <Box display='flex' _hover={{color: 'blue.400'}}>
        //                 <ChevronLeftIcon fontSize='35px'/>
        //                 <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text> 
        //             </Box>
        //         </Box>
        //     </Link>
        //             <Box display='flex' pt='1rem' justifyContent='center'>
        //                 <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
        //                     <Box display='flex' mr='auto' pl='1rem'>
        //                         <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
        //                             <Text fontSize='18px' fontWeight='bold' color='white'>Status:</Text>
        //                         </Box>
        //                         <Box display='flex' flexDir='column' justifyContent='center' >
        //                             {/* <Badge colorScheme='yellow' variant='solid' p='8px'>{cuStatus.status_name}</Badge> */}
        //                             {statusBadge()}
        //                         </Box>
        //                     </Box>
        //                     <Box display='flex' pr='1rem'>
        //                         <Box pr='1rem' >
        //                             <Button colorScheme='blue' onClick={markInvoiceOutstanding}>Mark Outstanding</Button>
        //                         </Box>
        //                         <Box pr='1rem' >
        //                             <Button colorScheme='yellow' onClick={markInvoicePending}>Mark Pending</Button>
        //                         </Box>
        //                         <Box pr='0rem' >
        //                             <Button colorScheme='green' onClick={markInvoicePaid}>Mark Paid</Button>
        //                         </Box>
        //                     </Box>
        //                 </Box>
        //             </Box>
        //             <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
        //                 <Box display='flex' flexDir='column' p='1rem' rounded='2xl' bg='gray.600' shadow='md' w={[300, 400, 800]}>
        //                     <Box display='flex' justifyContent='flex-end' pr='2rem' pt='1rem'>
        //                         <Button colorScheme='blue' onClick={onOpen}>Edit</Button>
        //                         <Box pl='1rem'>
        //                             <Button colorScheme='red' onClick={deleteInvoice}>Delete</Button>
        //                         </Box>
        //                     </Box>
        //                     <Box display='flex' p='2rem' bg='gray.600' rounded='xl'>
        //                         <Box>
        //                             <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Invoice #{invoice.id}</Text>
        //                             <Text  fontSize='20px' fontWeight='light' letterSpacing='1px'>{jobType.type_name}</Text>
        //                         </Box>
        //                         <Box display='flex' flexDir='column' ml='auto' >
        //                             <Text textAlign='right' fontWeight='bold'>Rios Roofing</Text>
        //                             <Text textAlign='right' fontWeight='light'>150 Tallant St</Text>
        //                             <Text textAlign='right' fontWeight='light'>Houston, TX</Text>
        //                             <Text textAlign='right' fontWeight='light'>77076</Text>
        //                             <Text textAlign='right' fontWeight='light'>United States</Text>
        //                         </Box>
        //                     </Box>
        //                     <Box display='flex' justifyContent='center' p='1rem' pt='1rem' pb='1rem'>
        //                         <Box display='flex' flexDir='column' p='1rem' >
        //                             <Box pb='1rem'>
        //                                 {/* <Editable defaultValue={customer.name}>
        //                                     <EditablePreview/>
        //                                     <EditableInput/>
        //                                     <EditableControls/>
        //                                 </Editable> */}
        //                                 <Text fontSize='22px' fontWeight='bold'>Invoice Date:</Text>
        //                                 <Text>{new Date(invoice.inv_date).toLocaleDateString()}</Text>  
        //                             </Box>
        //                             <Box>
        //                                 <Text fontSize='22px' fontWeight='bold'>Payment Due:</Text>
        //                                 <Text>{new Date(invoice.due_date).toLocaleDateString()}</Text>
        //                             </Box>
        //                         </Box>
        //                         <Box display='flex' flexDir='column' p='1rem' ml='auto' mr='auto'>
        //                             <Box>
        //                                 <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Bill To:</Text>
        //                             </Box>
        //                             <Box pb='4px'>
        //                                 <Text letterSpacing='1px'>{customer.name}</Text>
        //                             </Box>
        //                             <Box>
        //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.address},</Text>
        //                             </Box>
        //                             <Box>
        //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.city}, {customer.state}, 77076</Text>
        //                             </Box>
        //                             <Box>
        //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.zipcode}</Text>
        //                             </Box>
        //                             <Box>
        //                                 <Text letterSpacing='1px'>United States</Text>
        //                             </Box>
                                    
        //                         </Box>
        //                         <Box display='flex' flexDir='column' p='1rem'>
        //                             <Box>
        //                                 <Text fontSize='22px' fontWeight='bold'>Email To: </Text>
        //                             </Box>
        //                             <Text letterSpacing='1px'>{customer.email}</Text>
        //                         </Box>
        //                     </Box>
        //                     <Box display='flex' flexDir='column' p='1rem' >
        //                         <Box display='flex' flexDir='column' bg='gray.700' p='1rem' roundedTop='xl'>
        //                             <Box display='flex' justifyContent='space-between' >
        //                                     <Box ml='1rem'>
        //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Service Name</Text>    
        //                                     </Box> 
        //                                     <Box>
        //                                         {/* <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>QTY.</Text> */}
        //                                     </Box>
        //                                     <Box>
        //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Price</Text>
        //                                     </Box>
        //                                     <Box mr='1rem'>
        //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Total</Text>
        //                                     </Box>
        //                             </Box>
        //                             <Box display='flex' justifyContent='space-between' pt='1rem' pb='1rem' >
        //                                     <Box ml='1rem'>
        //                                         <Text letterSpacing='1px' fontSize='16px' fontWeight='light'>{invoice.service_name}</Text>    
        //                                     </Box> 
        //                                     <Box>
        //                                         {/* <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>1</Text> */}
        //                                     </Box>
        //                                     <Box>
        //                                         <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{invoice.amount_due}</Text>
        //                                     </Box>
        //                                     <Box mr='1rem'>
        //                                         <Text letterSpacing='1px'  fontSize='16px' fontWeight='bold'>{invoice.amount_due}</Text>
        //                                     </Box>
        //                             </Box>
        //                         </Box>
        //                         <Box display='flex'  bg='blue.600' p='2rem' roundedBottom='xl'>
        //                                 <Box ml='auto'>
        //                                     <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>Amount Due:</Text>
        //                                 </Box>
        //                                 <Box ml='4rem' >
        //                                     <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>{invoice.amount_due}</Text>
        //                                 </Box>
        //                             </Box>
                                        
        //                     </Box>
        //                     <Grid>

        //                     </Grid>
        //                 </Box>
        //             </Box>
        //     </Flex>
    )
}

export default InvoiceDetails;
