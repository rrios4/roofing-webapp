import React, {useState, useEffect} from 'react';
// import { useHistory } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
import { useColorModeValue, useToast, Box, Flex, FormControl, Input, Button, Text, useDisclosure, VStack, TableContainer, Td, Tr, Tooltip, Th, Tbody, TableCaption, Table, Thead, HStack, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Skeleton, Avatar, Badge, Icon, IconButton, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Checkbox, Switch} from '@chakra-ui/react';
import axios from 'axios';
import swal from 'sweetalert';
import supabase from '../../utils/supabaseClient';
import formatNumber from '../../utils/formatNumber';
import { Card, CustomerOptions, EditInvoiceForm, NewInvoiceForm, Invoice, DeleteAlertDialog } from '../../components';
import { MdKeyboardArrowLeft, MdPostAdd, MdSearch, MdKeyboardArrowRight, MdEdit, MdDelete, MdFilterList, MdFilterAlt, MdToday } from 'react-icons/md';
import { FiFileText, FiFilter, FiFolder, FiX } from 'react-icons/fi'
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatDate from '../../utils/formatDate';

function Invoices() {
    //Defining variables
    const {isOpen: isNewOpen , onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
    const {isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose} = useDisclosure()
    const initialRef = React.useRef();
    let navigate = useNavigate();
    const toast = useToast()

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('gray', 'gray');

    //React States to manage data
    const [invoices, getInvoices] = useState();
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
    const [searchInvoiceInput, setSearchInvoiceInput] = useState('');
    const [selectedEditInvoice, setSelectedEditInvoice] = useState({id: '', invoice_number: '', service_type_id: '', invoice_status_id: '', invoice_date: '', issue_date: '', due_date: '', sqft_measurement: '', note: '', cust_note: ''});

    const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
    const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState('');

    // React state switches
    const [filterSwitchStatus1IsOn, setFilterSwitchStatus1IsOn] = useState(false);
    const [filterSwitchStatus2IsOn, setFilterSwitchStatus2IsOn] = useState(false);
    const [filterSwitchStatus3IsOn, setFilterSwitchStatus3IsOn] = useState(false);
    const [filterSwitchStatus4IsOn, setFilterSwitchStatus4IsOn] = useState(false);
    const [draftInvoiceButtonSwitchIsOn, setDraftInvoiceButtonSwitchIsOn] = useState(false)

    // Invoice React State Array filtered
    const filteredInvoiceDraftArray = () => getInvoices(invoices => invoices.filter(invoice => invoice.invoice_status_id === 4))

    // Functions to program events or actions
    useEffect(() => {
        getAllInvoices();
        // getCustomers();
    }, []);

    const getAllInvoices = async() => {
        const {data: allInvoices, error} = await supabase
        .from('invoice')
        .select('*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)')
        // .neq('invoice_status_id', 4)
        .order('invoice_status_id', { ascending: false })
        .order('updated_at', {ascending: false})

        if(error){
            console.log(error)
        }
        getInvoices(allInvoices)
        console.log(allInvoices)
    }

    // Function to handle the search through all invoices
    const searchInvoice = async() => {

    }

    // Handles the opening of the edit drawer form and settings single invoice to a react state
    const handleEditModal = (invoice) => {
        setSelectedEditInvoice({id: invoice.id, invoice_number: invoice.invoice_number, service_type_id: invoice.service_type_id, invoice_status_id: invoice.invoice_status_id, invoice_date: invoice.invoice_date, issue_date: invoice.issue_date, due_date: invoice.due_date, sqft_measurement: invoice.sqft_measurement, note: invoice.note, cust_note: invoice.cust_note})
        onEditOpen()
    }

    //Handles changes made to the fields made by the user and updates the React State
    const handleEditChange = (e) => {
        setSelectedEditInvoice({ ...selectedEditInvoice, [e.target.name]: e.target.value})
    }

    // Handles the submitting of edited information from drawer form
    const handleEditSubmit = async(e) => {
        e.preventDefault();
        console.log(selectedEditInvoice)
        const { data, error } = await supabase
        .from('invoice')
        .update({
            service_type_id: selectedEditInvoice.service_type_id,
            invoice_status_id: selectedEditInvoice.invoice_status_id,
            invoice_date: selectedEditInvoice.invoice_date,
            issue_date: selectedEditInvoice.issue_date,
            due_date: selectedEditInvoice.due_date,
            sqft_measurement: selectedEditInvoice.sqft_measurement,
            note: selectedEditInvoice.note ,
            cust_note: selectedEditInvoice.cust_note,
            updated_at: new Date()
        })
        .eq('invoice_number', selectedEditInvoice.invoice_number)

        if(error){
            // console.log(error)
            handleToastMessage('error', 'top', selectedEditInvoice.invoice_number, `Error Updating Invoice Number ${selectedEditInvoice.invoice_number}`, `Error: ${error.message}`)   
        }

        if(data){
            await getAllInvoices()
            handleToastMessage('success', 'top', selectedEditInvoice.invoice_number, `Successfully Updated Invoice`, `We've updated INV# ${selectedEditInvoice.invoice_number} for you 🎉`)
        }
        onEditClose()
        setSelectedEditInvoice({id: '', invoice_number: '', service_type_id: '', invoice_status_id: '', invoice_date: '', issue_date: '', due_date: '', sqft_measurement: '', note: '', cust_note: ''})

    }

    const handleDeleteAlert = (invoiceId, invoice_number) => {
        setSelectedInvoiceId(invoiceId);
        setSelectedInvoiceNumber(invoice_number);
        onDeleteOpen();
    }

    // Handle success message toast when invoice has been deleted
    const handleDeleteToast = (invoice_number) => {
        toast({
            position: 'top',
            title: `Invoice #${invoice_number} deleted! 🚀`,
            description: "We've deleted invoice for you.",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    // Gets a list of invoices with status Draft
    const handleDraftInvoiceView = () => {
        const newSwitchValue = !draftInvoiceButtonSwitchIsOn
        setDraftInvoiceButtonSwitchIsOn(newSwitchValue)
        if(newSwitchValue === true){
            filteredInvoiceDraftArray()
        } else {
            getAllInvoices()
        }
        console.log(invoices)
    }

    // Handle filter checkboxes to update invoice state based on filter
    const handleSwitchesStatusFilter = async(switchOne, switchTwo, switchThree, switchFour) => {
        filterSwitchStatus1IsOn === true ? setFilterSwitchStatus1IsOn(false) : setFilterSwitchStatus1IsOn(switchOne);
        filterSwitchStatus2IsOn === true ? setFilterSwitchStatus2IsOn(false) : setFilterSwitchStatus2IsOn(switchTwo);
        filterSwitchStatus3IsOn === true ? setFilterSwitchStatus3IsOn(false) : setFilterSwitchStatus3IsOn(switchThree);
        filterSwitchStatus4IsOn === true ? setFilterSwitchStatus4IsOn(false) : setFilterSwitchStatus4IsOn(switchFour);
        
    }

    // Handles the toast to give feedback to the user
    const handleToastMessage = (status, position, invoice_numer, title, description) => {
        toast({
            position: position,
            title: title,
            description: description,
            status: status,
            duration: 5000,
            isClosable: true,
        })
    }

    // Handle when the user click on the create button in invoices page to open drawer and load data
    const handleDrawerOpenAction = async() => {
    
    }

    // Handle edit data

    // Handles the cancel button in the modal form for editing invoices

    return (
        <> 

        {/* Drawer Component Forms */}
        <NewInvoiceForm isNewOpen={isNewOpen} onNewClose={onNewClose} onNewOpen={onNewOpen} updateParentData={getAllInvoices} toast={toast} data={invoices} nextInvoiceNumberValue={nextInvoiceNumber}/>
        <EditInvoiceForm initialRef={initialRef} isOpen={isEditOpen} onClose={onEditClose} invoice={selectedEditInvoice} handleEditOnChange={handleEditChange} handleEditSubmit={handleEditSubmit}/>
        <DeleteAlertDialog 
            isOpen={isDeleteOpen} 
            onClose={onDeleteClose} 
            onOpen={onDeleteOpen} 
            toast={handleToastMessage} 
            updateParentState={getAllInvoices} 
            header={`❌ Delete Invoice #${selectedInvoiceNumber}`} 
            body={`Are you sure? You can't undo this action afterwards. This will delete associated payments and line-items that depend on this invoice.`} 
            tableName={'invoice'} 
            tableFieldName={'invoice_number'}
            itemId={selectedInvoiceId} 
            itemNumber={selectedInvoiceNumber}
        /> 

        {/* Main Invoice Page Code */}
        <VStack my={'2rem'} w='100%' mx={'auto'} px={{base: '1rem', lg: '2rem'}}>
            {/* <Alert status='success' mb={'1rem'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} height={'200px'} rounded={'8'}>
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>Invoice Submitted!</AlertTitle>
                <AlertDescription maxWidth='sm'>New invoice saved to the server. Fire on! 👋</AlertDescription>
            </Alert> */}
            <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button colorScheme={'gray'} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'}/>}>Back</Button> 
                    </Link>
                </Box>
                <Card width='full' bg={bg} borderColor={borderColor}>
                    {/* Header Page info & Actions */}
                    <HStack mt={'1rem'} mb={'2rem'}>
                    <Flex display={'flex'} mr={'auto'} alignItems={'center'} ml={'24px'}>
                            <Icon as={FiFileText} boxSize={'7'}/>
                            <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Invoices</Text>
                        </Flex>
                        <Flex pr='1rem' mr={'1rem'} justifyContent={'end'}  gap={4}>
                            <form method='GET' onSubmit={searchInvoice}>
                                <FormControl display={'flex'}>
                                    <Input value={searchInvoiceInput} onChange={({target}) => setSearchInvoiceInput(target.value)} placeholder='Search for Invoice' colorScheme='blue' border='2px'/>
                                    <Tooltip label='Search'><Button mx={'1rem'} type='submit'><MdSearch size={'25px'}/></Button></Tooltip>
                                </FormControl>
                            </form>
                            {/* Filter Popover */}
                            <Popover>
                                <PopoverTrigger>
                                    <IconButton icon={<FiFilter/>} colorScheme={'gray'}/>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow/>
                                    <PopoverCloseButton/>
                                    <PopoverHeader fontWeight={'bold'}>Filter Invoices</PopoverHeader>
                                    <PopoverBody>
                                        <Flex direction={'column'} gap={2} py={'1rem'}>
                                            {/* Switch 1 */}
                                            <Flex gap={2}>
                                                <Switch isChecked={filterSwitchStatus1IsOn} onChange={() => handleSwitchesStatusFilter(true, false, false, false)}/>
                                                <Text my={'auto'} textAlign={'center'}>By Status of <Text as={'span'} fontWeight={'semibold'}>Draft</Text></Text>
                                            </Flex>
                                            {/* Switch 2 */}
                                            <Flex gap={2}>
                                                <Switch isChecked={filterSwitchStatus2IsOn} onChange={() => handleSwitchesStatusFilter(false, true, false, false)}/>
                                                <Text my={'auto'} textAlign={'center'}>By Status of <Text as={'span'} color={'yellow.400'} fontWeight={'semibold'}>Pending</Text></Text>
                                            </Flex>
                                            {/* Switch 3 */}
                                            <Flex gap={2}>
                                                <Switch isChecked={filterSwitchStatus3IsOn} onChange={() => handleSwitchesStatusFilter(false, false, true, false)}/>
                                                <Text my={'auto'} textAlign={'center'}>By Status of <Text as={'span'} color={'green.400'} fontWeight={'semibold'}>Paid</Text></Text>
                                            </Flex>
                                            {/* Switch 4 */}
                                            <Flex gap={2}>
                                                <Switch isChecked={filterSwitchStatus4IsOn} onChange={() => handleSwitchesStatusFilter(false, false, false, true)}/>
                                                <Text my={'auto'} textAlign={'center'}>By Status of <Text as={'span'} color={'red.400'} fontWeight={'semibold'}>Overdue</Text></Text>
                                            </Flex>
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                            <Tooltip label='Sort'><IconButton icon={<MdFilterList/>}/></Tooltip>
                            <Tooltip label={draftInvoiceButtonSwitchIsOn === true ? 'Close View of Drafts' : 'Click to view all Draft Invoices'}><IconButton icon={draftInvoiceButtonSwitchIsOn === true ? <FiX/> : <FiFolder/>} onClick={handleDraftInvoiceView}/></Tooltip>
                            <Tooltip label='Create New Invoice'><IconButton px={'1rem'} icon={<MdPostAdd/>} onClick={onNewOpen} colorScheme={'blue'}/></Tooltip>
                        </Flex>
                    </HStack>
                    <TableContainer>
                        {invoices ? <>
                            <Table variant={'simple'} size='sm'>
                                <TableCaption overflowX={'auto'}>Total of {invoices?.length} Invoices in our system ✌️</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th textAlign={'center'}>Invoice #</Th>
                                        <Th textAlign={'center'}>Status</Th>
                                        <Th>Service</Th>
                                        <Th>Invoice Date</Th>
                                        {/* <Th>Issue Date</Th> */}
                                        <Th>Due Date</Th>
                                        <Th>Customer</Th>
                                        {/* <Th>Customer Email</Th> */}
                                        {/* <Th>Phone Number</Th> */}
                                        <Th>Total</Th>
                                        <Th>Amount Due</Th>
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {/* Table Row Data Component */}
                                    {invoices?.map((invoice, index) => (
                                        <Tr key={invoice.id}>
                                            <Td textAlign={'center'}><Text fontSize={'md'} fontWeight={'bold'}>{formatNumber(invoice.invoice_number)}</Text></Td>    
                                            <Td textAlign={'center'}><Badge w={'80px'} variant={'subtle'} mx={'auto'} colorScheme={invoice.invoice_status.name === 'New' ? 'green' : '' || invoice.invoice_status.name === 'Paid' ? 'green' : '' || invoice.invoice_status.name === 'Pending' ? 'yellow' : '' || invoice.invoice_status.name === 'Overdue' ? 'red' : 'gray'} p='1' rounded={'xl'} align='center'>{invoice.invoice_status.name}</Badge></Td>
                                            <Td><Text>{invoice.service_type.name}</Text></Td>
                                            <Td><Text>{formatDate(invoice.invoice_date)}</Text></Td>
                                            {/* <Td><Text>{invoice.issue_date ? invoice.issue_date : ''}</Text></Td> */}
                                            <Td><Text>{formatDate(invoice.due_date)}</Text></Td>
                                            {/* <Td><Flex>{invoice.customer.first_name} {invoice.customer.last_name}</Flex></Td> */}
                                            <Td>{invoice.customer.first_name && invoice.customer.last_name ? <><Flex><Link to={`/editcustomer/${invoice.customer.id}`}><Button variant={'ghost'} colorScheme={'facebook'}><Avatar size={'xs'} mr={'8px'} my={'auto'} /><Flex flexDir={'column'}><Flex fontWeight={'bold'} fontSize={'xs'}><Text marginRight={'4px'}>{invoice.customer.first_name}</Text><Text>{invoice.customer.last_name}</Text></Flex><Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>{invoice.customer.email}</Flex></Flex></Button></Link></Flex></> : <>{invoice.customer.company_name}</>}</Td>
                                            {/* <Td><Text>{invoice.customer.email}</Text></Td> */}
                                            {/* <Td><Text>{invoice.customer.phone_number}</Text></Td> */}
                                            <Td><Text>${formatMoneyValue(invoice.total ? invoice.total : 0)}</Text></Td>
                                            <Td><Text>${!invoice.amount_due ? '0.00' : formatMoneyValue(invoice.amount_due)}</Text></Td>
                                            <Td textAlign={'center'}><Flex gap={2}><Tooltip label='Edit'><IconButton icon={<MdEdit/>} onClick={() => {handleEditModal(invoice)}}/></Tooltip><Tooltip label='Delete'><IconButton icon={<MdDelete/>} onClick={() => {handleDeleteAlert(invoice.id, invoice.invoice_number)}}/></Tooltip><Link to={`/editinvoice/${invoice.invoice_number}`}><Tooltip label='Go to Invoice Details '><IconButton icon={<MdKeyboardArrowRight/>} colorScheme={'gray'} variant='solid'/></Tooltip></Link></Flex></Td>
                                        </Tr>

                                    ))}
                                </Tbody>
                            </Table>
                        </> : <Skeleton height={'100px'} rounded={'md'}/>}
                    </TableContainer>
                </Card> 
        </VStack>
        </>
    )
}

export default Invoices
