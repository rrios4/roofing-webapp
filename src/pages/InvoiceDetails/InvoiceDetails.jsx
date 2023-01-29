import React, {useEffect, useState, useContext} from 'react'
import {Select, Badge, Grid, Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, Container, Card, CardBody, Image, Divider, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tooltip, Avatar, Accordion, Skeleton, useColorModeValue} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
// import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import swal from 'sweetalert';
import {ChevronLeftIcon} from '@chakra-ui/icons'
import { FiArrowLeft, FiMoreHorizontal, FiLin, FiShare2, FiUploadCloud, FiPaperclip, FiSend, FiClock, FiAlignLeft, FiCircle, FiCheck } from 'react-icons/fi'
import { MdOutlinePayments } from 'react-icons/md'
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatNumber from '../../utils/formatNumber';

const InvoiceDetails = (props) => { 
    // Custom color configs for UX elements
    const bgColorMode = useColorModeValue('gray.100','gray.600');
    const bg = useColorModeValue('white', 'gray.800');
    const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
    const paymentBorderColor = useColorModeValue('gray.200', 'gray.400');
    const secondaryTextColor = useColorModeValue('gray.600', 'gray.300')
    
    // React States
    const [invoice, setInvoice] = useState();
    const [invoicePayments, setInvoicePayments] = useState();
    const [invoiceServiceLineItems, setInvoiceServiceLineItems] = useState();

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

    // Upcoming functions & changes
    // Function to handle the updating of invoice status but might be done using forms
    // Modal to delete invoice just like in the invoices page
    // Drawer to update invoices such as the invoices page
    
    
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
                                    <Text fontWeight={'semibold'} fontSize={'3xl'} letterSpacing={'0px'}>Invoice <Text as={'span'} color={'blue.400'}>#</Text> {formatNumber(invoice?.invoice_number)}</Text>
                                    <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>Due {invoice?.due_date}</Text>
                                </Box>
                            </Flex>
                            <Box  px={'2rem'} mb={'3rem'}>
                                <Flex mb={'1rem'}>
                                    <Text w='50px' fontWeight={'bold'} textColor={'gray.500'}>To</Text>
                                    {invoice?.bill_to === true ? <>
                                        <Box>
                                            <Text ml={'3rem'} fontWeight={'semibold'}>{invoice?.customer.first_name} {invoice?.customer.last_name}</Text>
                                            <Text ml={'3rem'}>{invoice?.bill_to_street_address}</Text>
                                            <Text ml={'3rem'}>{invoice?.bill_to_city}, {invoice?.bill_to_state} {invoice?.bill_to_zipcode}</Text>
                                            <Text ml={'3rem'} color={'blue.400'}>{invoice?.customer.email}</Text>
                                        </Box>
                                    
                                    
                                    </> : <>
                                        <Box>
                                            <Text ml={'3rem'} fontWeight={'semibold'}>{invoice?.customer.first_name} {invoice?.customer.last_name}</Text>
                                            <Text ml={'3rem'}>{invoice?.customer.street_address}</Text>
                                            <Text ml={'3rem'}>{invoice?.customer.city}, {invoice?.customer.state} {invoice?.customer.zipcode}</Text>
                                            <Text ml={'3rem'} color={'blue.400'}>{invoice?.customer.email}</Text>
                                        </Box>
                                    </>}
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w='50px' fontWeight={'bold'} textColor={'gray.500'}>From</Text>
                                    <Box>
                                        <Text ml={'3rem'} fontWeight={'semibold'}>Rios Roofing</Text>
                                        <Text ml={'3rem'}>150 Tallant St</Text>
                                        <Text ml={'3rem'}>Houston, TX 77076</Text>
                                        <Text ml={'3rem'} color={'blue.400'}>rrios.roofing@gmail.com</Text>
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
                                <Flex mb={'2rem'} px={4} py={2}>
                                    <Text fontWeight={'semibold'} textColor={secondaryTextColor}>Subtotal</Text>
                                    <Text ml={'auto'} mr={'1rem'}>${formatMoneyValue(invoice?.subtotal)}</Text>
                                </Flex>
                                <Flex mb={'2rem'} bg={'blue.500'} color={'white'} px={4} py={2} rounded={'xl'}>
                                    <Text fontWeight={'bold'} fontSize={'xl'}>Amount Due</Text>
                                    <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'}>${formatMoneyValue(invoice?.total)}</Text>
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
                                    <Text fontSize={'2xl'} fontWeight={'semibold'} color={secondaryTextColor}>Details</Text>
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor} my={'auto'}>Status</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Badge colorScheme={invoice?.invoice_status.name === 'New' ? 'green' : invoice?.invoice_status.name === 'Sent' ? 'yellow' : invoice?.invoice_status.name === 'Paid' ? 'blue' : invoice?.invoice_status.name === 'Overdue' ? 'red' : 'purple'}  variant={'solid'} mr={'1rem'} pt={'2px'} w={'80px'} rounded={'xl'} textAlign={'center'}>{invoice?.invoice_status.name}</Badge>}
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>Service</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Text mr={'1rem'}>{invoice?.service_type.name}</Text> }
                                    {/* <Text mr={'1rem'}>{invoice?.service_type.name}</Text> */}
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>Invoice Date</Text>
                                    <Text mr={'1rem'}>{invoice?.invoice_date ? invoice?.invoice_date : <Skeleton height={'20px'}/>}</Text>
                                </Flex>
                                <Flex   mb={'1rem'}>
                                    <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>Issue Date</Text>
                                    <Text mr={'1rem'}>{invoice?.issue_date}</Text>
                                </Flex>
                                <Flex mb={'1rem'}>
                                    <Text w={'36%'} fontWeight={'semibold'} textColor={secondaryTextColor} my={'auto'}>Customer</Text>
                                    <Flex>
                                        <Button variant={'ghost'}>
                                            <Avatar size={'xs'}/>
                                            {!invoice ? <Skeleton height={'20px'}/> : <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>{invoice?.customer.first_name} {invoice?.customer.last_name}</Text> }
                                        </Button>
                                    </Flex>
                                </Flex>
                                <Box>
                                    <Text fontWeight={'semibold'} textColor={secondaryTextColor} my={'auto'} mb={'8px'}>Note</Text>
                                    {!invoice ? <Skeleton height={'20px'}/> : <Text>{invoice.note}</Text>}
                                </Box>
                            </Box>
                            <Divider w={'95%'} mx={'auto'}/>
                            {/* Invoice Payment History */}
                            <Box px={'2rem'} py={'1rem'}>
                            <Flex alignItems={'center'} gap={3} mb={'1rem'}>
                                    <FiClock size={'25px'} color='gray'/>
                                    <Text fontSize={'2xl'} fontWeight={'semibold'} color={secondaryTextColor}>Payments</Text>
                                </Flex>
                                <Flex direction={'column'} w={'full'} mx={'auto'}>
                                    {/* Timeline Component */}
                                    {invoicePayments?.map((item, index) => (
                                        <Flex key={index} w={'full'}>
                                            <Flex direction={'column'} maxH={'300px'} gap={2}>
                                                {/* <Box rounded={'full'} bg={'green.500'} max-w={'10px'} max-h={'10px'}></Box> */}
                                                <Divider orientation='vertical' mx={'auto'} bg={"gray.400"} variant={'dashed'}/>
                                                <Box bg={'green.300'} rounded={'full'} p={1} >
                                                    <FiCheck color='white' size={'12px'} />
                                                </Box>
                                                <Divider orientation='vertical' mx={'auto'} bg={"gray.400"} variant={'dashed'}/>
                                            </Flex>
                                            <Flex direction={{base: 'column', md: 'row', lg: 'row'}} gap={4} px={4} py={6} bg={paymentCardBgColor} mx={4} my={6} rounded={'xl'} border={'1px'} borderColor={paymentBorderColor} w={'full'}>
                                                <Box>
                                                    <Text fontSize={'sm'}>Payment Date</Text>
                                                    <Text fontSize={'sm'} fontWeight={'bold'}>{item.date_received}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize={'sm'}>Payment Method</Text>
                                                    <Text fontSize={'sm'} fontWeight={'bold'}>{item.payment_method}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize={'sm'}>Amount</Text>
                                                    <Text fontSize={'sm'} fontWeight={'bold'}>${formatMoneyValue(item.amount)}</Text>
                                                </Box>
                                            </Flex>
                                    </Flex>
                                    ))}
                                </Flex>
                            </Box>
                        </CardBody>
                    </Card>

                </Flex>
            </Flex>
        </Container>
    )
}

export default InvoiceDetails;
