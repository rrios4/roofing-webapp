import React, { useState, useEffect } from 'react';
import { DrawerIndex, ServiceTypeOptions, InvoiceStatusOptions } from '..';
import supabase from '../../utils/supabaseClient';
import AsyncSelect from 'react-select/async';
import { Text, FormControl, FormLabel, Select, Input, InputGroup, Button, useColorModeValue, useColorMode, Flex, Textarea, Box, Switch, TableContainer, Table, Thead, Tr, Th, Tbody, Td, NumberInput, NumberIncrementStepper, NumberInputField, NumberDecrementStepper, NumberInputStepper } from '@chakra-ui/react';
import formatMoneyValue from '../../utils/formatMoneyValue';

const NewInvoiceForm = (props) => {
    const { colorMode } = useColorMode();
    const { onNewClose, isNewOpen, onNewOpen, initialRef, data, updateParentData, nextInvoiceNumberValue, toast } =  props

    // Custom color configs for UX elements
    const bg = useColorModeValue('white', 'gray.800');
    const tableHeaderColor = useColorModeValue('blue.400', 'blue.600');

    // Select & Options React States
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [serviceLineItems, setServiceLineItems] = useState();
    const [serviceTypesOptions, setServiceTypesOptions] = useState(null);
    const [invoiceStatusOptions, setInvoiceStatusOptions] = useState(null)
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('');
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');

    // Input React States
    const [lineItemList, setLineItemList] = useState([])
    const [invoiceNumberInput, setInvoiceNumberInput] = useState('');
    const [invoiceDateInput, setInvoiceDateInput] = useState('');
    const [invoiceDueDateInput, setInvoiceDueDateInput] = useState('');
    const [sqftInput, setSqftInput] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [billToStreetAddressInput, setBillToStreetAddressInput] = useState('');
    const [billToCityInput, setBillToCityInput] = useState('');
    const [billToStateInput, setBillToStateInput] = useState('');
    const [billToZipcodeInput, setBillToZipcodeInput] = useState('');
    const [customerNoteMessage, setCustomerNoteMessage] = useState('');
    const [lineItemDescriptionInput, setLineItemDescriptionInput] = useState('');
    const [lineItemQty, setLineItemQty] = useState('');
    const [lineItemRate, setLineItemRate] = useState('');
    const [invoiceTotalCalculatedValue, setInvoiceTotalCalculatedValue] = useState(0);
    const [invoiceSubTotalCalculatedvalue, setInvoiceSubTotalCalculatedvalue] = useState(0)

    // New States That I'm currently working with
    // Switch React States
    const [fixedRateSwitchIsOn, setFixedRateSwitchIsOn] = useState(true);
    const [billToSwitchIsOn, setBillToSwitchIsOn] = useState(false);
    const [noteSwitchIsOn, setNoteSwitchIsOn] = useState(false);
    const [measurementNoteSwitchIsOn, setMeasurementNoteSwitchIsOn] = useState(false);
    const [customerNoteSwitchIsOn, setCustomerNoteSwitchIsOn] = useState(false);

    // Line Item React State
    const [numOfLineItemFields, setNumOfLineItemFields] = useState(0)

    useEffect(() => {
      getServiceTypesOptionsData();
      getInvoiceStatusOptions();
    //   handleInvoiceNextNumber();
    

    }, [])
    
    // Function to handle the submit data from the form to supabase DB
    const handleSubmit = async(event) => {
        event.preventDefault();
        // POST request to supabase to save new invoice
        const { data, error } = await supabase
        .from('invoice')
        .insert([
            {
                invoice_number: invoiceNumberInput,
                customer_id: selectedCustomer.selectedCustomer.value,
                service_type_id: selectedServiceType,
                invoice_status_id: selectedInvoiceStatus,
                invoice_date: invoiceDateInput,
                due_date: invoiceDueDateInput,
                sqft_measurement: sqftInput ? sqftInput : null,
                note: noteInput ? noteInput : null,
                cust_note: customerNoteSwitchIsOn === true ? customerNoteMessage : 'Thank you for your business! 🚀',
                bill_to_street_address: billToSwitchIsOn === true ?  billToStreetAddressInput : null,
                bill_to_city: billToSwitchIsOn === true ? billToCityInput : null,
                bill_to_state: billToSwitchIsOn === true ? billToStateInput : null,
                bill_to_zipcode: billToSwitchIsOn === true ? billToZipcodeInput : null,
                bill_from_email: 'rrios.roofing@gmail.com',
                bill_from_street_address: '150 Tallant St',
                bill_from_city: 'Houston',
                bill_from_state: 'TX',
                bill_from_zipcode: '77076',
                bill_to: billToSwitchIsOn === true ? true : false,
                subtotal: invoiceSubTotalCalculatedvalue >= 0 ? invoiceSubTotalCalculatedvalue : 0,
                total: invoiceTotalCalculatedValue >= 0 ? invoiceTotalCalculatedValue : 0 ,
                amount_due: invoiceTotalCalculatedValue >= 0 ? invoiceTotalCalculatedValue : 0,

            }
        ])

        if(error){
            console.log(error)
            alert(error)
        }

        await handleLineItemSubmit()

        setLineItemList([])
        setNumOfLineItemFields(0)
        setInvoiceTotalCalculatedValue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0));
        setInvoiceSubTotalCalculatedvalue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0))
        handleCreateInvoiceSuccessToast(invoiceNumberInput)
        
        updateParentData(); setInvoiceNumberInput(''); setSelectedCustomer(''); setSelectedServiceType(''); setSelectedInvoiceStatus(''); setInvoiceDateInput(''); setInvoiceDueDateInput(''); setSqftInput(''); setNoteInput(''); setBillToCityInput(''); setBillToStateInput(''); setBillToStreetAddressInput(''); setBillToZipcodeInput(''); setCustomerNoteMessage('');
        setFixedRateSwitchIsOn(true); setBillToSwitchIsOn(false); setNoteSwitchIsOn(false); setMeasurementNoteSwitchIsOn(false); setCustomerNoteSwitchIsOn(false);
    }

    const handleLineItemSubmit = async() => {
        lineItemList.map(async(item,index) => {
            const { data, error} = await supabase
            .from('invoice_line_service')
            .insert([
                {
                    invoice_id: parseInt(invoiceNumberInput),
                    service_id: parseInt(selectedServiceType),
                    fixed_item: fixedRateSwitchIsOn,
                    description: item.description,
                    qty: fixedRateSwitchIsOn === true ? 1 : 1,
                    rate: fixedRateSwitchIsOn === true ? null : parseInt(item.rate),
                    amount: item.amount, 
                    sq_ft: fixedRateSwitchIsOn === true ? null : parseInt(item.sq_ft)
                }
            ])

            if(error){
                console.log(error)
            }
        })
        // console.log({
        //     invoice_id: parseInt(invoiceNumberInput),
        //     service_id: selectedServiceType,
        //     fixed_item: fixedRateSwitchIsOn,
        //     item_list: lineItemList
        // })
    }

    // Function that will handle the selected value from react-select component and stores it in a useState
    const handleSelectedCustomer = (value) => {
        setSelectedCustomer({
            selectedCustomer: value || []
        })
        // console.log(selectedCustomer.selectedCustomer.value)
    }

    // Function that will load options for react-select component as the user types name
    const loadOptions = async (inputText, callback) => {
        //Use supabase SDK to return a list of all customers to be used by react-select as options 
        const { data: customers , error} = await supabase
        .from('customer')
        .select('first_name, last_name, customer_type_id, id, email')
        .or(`first_name.ilike.%${inputText}%,last_name.ilike.%${inputText}%,email.ilike.%${inputText}%`)

        if(error){
            console.log(error);
        }
        callback(customers.map((customer, index) => ({label: `${customer.first_name} ${customer.last_name}`, value: customer.id, email: customer.email})))
        // console.log(customers)
    };

    // Function that gets all service types from supabase DB
    const getServiceTypesOptionsData = async() => {
        const { data: serviceTypes, error} = await supabase
        .from('services')
        .select('id, name')
        .order('id', { ascending: true })

        if(error){
            console.log(error);
        }
        setServiceTypesOptions(serviceTypes)
        // console.log(serviceTypes)
    }

    // Function that gets all the invoice statuses from supabase DB
    const getInvoiceStatusOptions = async() => {
        // console.log(serviceTypesOptions)
        const { data: invoiceStatuses, error} = await supabase
        .from('invoice_status')
        .select('id, name')

        if(error){
            console.log(error)
        }
        setInvoiceStatusOptions(invoiceStatuses)
    }

    // Delete Line Item Field
    const handleDeleteLineItemField = (index) => {
        const list =  lineItemList;
        console.log(numOfLineItemFields)
        list.pop()
        setLineItemList(list)
        setNumOfLineItemFields(numOfLineItemFields - 1);
        console.log(lineItemList)
        setInvoiceTotalCalculatedValue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0));
        setInvoiceSubTotalCalculatedvalue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0))
    }

    // Handle adding new line items to be stored in a react useState
    const handleAddingLineItem = (newLineItem) => {
        setNumOfLineItemFields(numOfLineItemFields + 1)
        // setServiceLineItems(prevServiceLineItems => [...prevServiceLineItems, newLineItem])
        setLineItemList([...lineItemList, { fixed_item: fixedRateSwitchIsOn === true ? true : false, description: '', qty: '', sq_ft: '', rate: '', amount: 0}])
        console.log(lineItemList)
    }

    // Handle change of input fields
    const handleOnChangeLineItemInput = (e,index) => {
        const { name, value } = e.target;
        const list = [...lineItemList];
        list[index][name] = value;
        setLineItemList(list)
        setInvoiceTotalCalculatedValue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0))
        setInvoiceSubTotalCalculatedvalue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0))
    }

    // Handle sucess message toast when invoice was created
    const handleCreateInvoiceSuccessToast = (invoice_number) => {
        toast({
            position: 'top',
            title: `Invoice #${invoice_number} was created succesfully! 🎉`,
            description: "We've sucessfully created an invoice for you!",
            status: 'success',
            duration: 5000,
            isClosable: true
        })
    }

    // Handle cancel button to clear all states such when the submit happens
    const handleCancelButton = () => {
        onNewClose()
        setLineItemList([])
        setNumOfLineItemFields(0)
        setInvoiceTotalCalculatedValue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0));
        setInvoiceSubTotalCalculatedvalue(lineItemList.reduce((total, currentItem) => total = parseFloat(total) + parseFloat(currentItem.amount), 0))

        setInvoiceNumberInput(''); setSelectedCustomer(''); setSelectedServiceType(''); setSelectedInvoiceStatus(''); setInvoiceDateInput(''); setInvoiceDueDateInput(''); setSqftInput(''); setNoteInput(''); setBillToCityInput(''); setBillToStateInput(''); setBillToStreetAddressInput(''); setBillToZipcodeInput(''); setCustomerNoteMessage('');
        setFixedRateSwitchIsOn(true); setBillToSwitchIsOn(false); setNoteSwitchIsOn(false); setMeasurementNoteSwitchIsOn(false); setCustomerNoteSwitchIsOn(false);
    }

    // I want to use this for the future
    // const subtotal = lineItemList.reduce((total, currentItem) => total = parseInt(total) + parseInt(currentItem.amount), 0)
    // const total = lineItemList.reduce((total, currentItem) => total = parseInt(total) + parseInt(currentItem.amount), 0);

  return (
    <DrawerIndex initialFocusRef={initialRef} isOpen={isNewOpen} onClose={onNewClose} bg={bg} size="lg">
        <form method='POST' onSubmit={handleSubmit}>
            <Text fontSize={'25px'} fontWeight={'bold'} mb={'1rem'}>Create<Text as='span' ml={'8px'} color={'blue.400'}>Invoice</Text></Text>
            <Flex gap={8} direction={{base: 'column', lg: 'column'}}>
                {/* Invoice Details */}
                <Box>
                    <FormControl isRequired>
                        <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'1rem'} mb={'1rem'}>General Info</Text>
                        <Box w={'full'} p={'1rem'} bg={useColorModeValue('gray.100', 'gray.600')} border={'1px'} borderColor={useColorModeValue('gray.200', 'gray.700')} rounded={'xl'}>
                            <FormLabel>Select Customer</FormLabel>
                                <AsyncSelect 
                                    onChange={handleSelectedCustomer} 
                                    loadOptions={loadOptions} 
                                    // defaultOptions={}
                                    placeholder='Search for Customer'
                                    getOptionLabel={option => `${option.label},  ${option.email}`}
                                    theme={theme => ({
                                        ...theme,
                                        borderRadius: 6,
                                        colors: {
                                            ...theme.colors,
                                            primary25: colorMode === 'dark' ? '#4A5568' : '#EDF2F7',
                                            primary: colorMode === 'dark' ? '#3182CE' : '#3182CE',
                                            neutral0: colorMode === 'dark' ? '#1A202C' : 'white',
                                            neutral90: 'white',
                                        },
                                })}/>
                        </Box>
                        <Flex gap={4} mt={'2rem'}>
                            <Box w={'50%'}>
                                <FormLabel >Invoice #</FormLabel>
                                <Input placeholder={!data ? 'Loading...' : Math.max(...data?.map(item => item.invoice_number)) + 1} type={'number'} value={invoiceNumberInput} onChange={(e) => setInvoiceNumberInput(e.target.value)}/>
                            </Box>
                            <Box w={'50%'}>
                                <FormLabel>Status</FormLabel>
                                <Select value={selectedInvoiceStatus} placeholder='Select Status' onChange={(e) => setSelectedInvoiceStatus(e.target.value)}>
                                    <InvoiceStatusOptions data={invoiceStatusOptions}/>
                                </Select> 
                            </Box>
                        </Flex>
                        <Flex gap={4} mt={'1rem'}>
                            <Box w={'50%'}>
                                <FormLabel>Date</FormLabel>
                                <Input type='date' value={invoiceDateInput} onChange={({target}) => setInvoiceDateInput(target.value)} id='invDate' placeholder='Select Invoice Date'/>
                            </Box>
                            <Box w={'50%'}>
                                <FormControl isRequired>
                                    <FormLabel>Due Date</FormLabel>
                                    <Input type='date' value={invoiceDueDateInput} onChange={({target}) => setInvoiceDueDateInput(target.value)} id='dueDate' placeholder='Due date'/>
                                </FormControl>
                            </Box>
                        </Flex>
                        <Box>
                            <FormLabel mt='1rem'>Select Service</FormLabel>
                            <Select value={selectedServiceType} placeholder='Select Service' onChange={(e) => setSelectedServiceType(e.target.value)}>
                                <ServiceTypeOptions data={serviceTypesOptions}/>
                            </Select>
                        </Box>
                    </FormControl>
                </Box>
                {/* Bill To Input Fields */}
                {billToSwitchIsOn === true ? <>
                        <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'}>Bill To</Text>
                        <Box>
                            <FormControl isRequired>
                                <FormLabel>Street Address</FormLabel>
                                <Input value={billToStreetAddressInput} onChange={(e) => setBillToStreetAddressInput(e.target.value)} type={'text'}/>
                                <Flex flexDir={'row'} mb={'1rem'}>
                                    <Flex flexDirection={'column'}>
                                        <FormLabel pt='1rem'>City</FormLabel>
                                        <Input value={billToCityInput} onChange={(e) => setBillToCityInput(e.target.value)} type={'text'}/>
                                    </Flex>
                                    <Flex flexDirection={'column'} ml={'1rem'}>
                                        <FormLabel pt='1rem'>State</FormLabel>
                                        <Input value={billToStateInput} onChange={(e) => setBillToStateInput(e.target.value)} type='text'/>
                                    </Flex>
                                    <Flex flexDirection={'column'} ml={'1rem'}>
                                        <FormLabel mt='1rem'>Zipcode</FormLabel>
                                        <Input value={billToZipcodeInput} onChange={(e) => setBillToZipcodeInput(e.target.value)} type={'text'}/>
                                    </Flex>
                                </Flex>
                            </FormControl>
                        </Box>

                </> : <></>}
            </Flex>
            {/* Service Item Input Table */}
            <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Service Items</Text>
            <Box>
                <TableContainer>
                    <Table variant={'unstyled'} size={'md'}>
                        <Thead>
                            <Tr>
                                <Th p={2}>Description</Th>
                                <Th p={2}>{fixedRateSwitchIsOn === true ? "Qty" : "Sqft"}</Th>
                                <Th p={2}>Rate</Th>
                                <Th p={2}>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Array.from({ length: numOfLineItemFields}, (_,i) => (
                                <Tr key={i}>
                                        <Td p={2}><Input variant={'outline'} placeholder={`Item ${i+1}`} name='description' minW={'300px'} onChange={ (e) => handleOnChangeLineItemInput(e,i)}/></Td>
                                        <Td p={2}>{fixedRateSwitchIsOn === true ? <Input type={'number'} disabled variant={'outline'} placeholder='1' name='qty' maxW={'50px'} /> : <Input type={'number'} minW={'10px'} variant={'flushed'} placeholder='30' name='sq_ft' onChange={ (e) => handleOnChangeLineItemInput(e,i)}/>}</Td>
                                        <Td p={2}>{fixedRateSwitchIsOn === true ? <Input disabled variant={'outline'} placeholder={'Fixed'} value={'Fixed'} name='rate' maxW={'100px'} onChange={ (e) => handleOnChangeLineItemInput(e,i)}/> : <Input minW={'80px'} variant={'outline'} name='rate' placeholder='320' maxW={'100px'} onChange={ (e) => handleOnChangeLineItemInput(e,i)}/>}</Td>
                                        {/* <Td><Input type={'number'} minW={'100px'} variant={'flushed'} placeholder='$1,000' name='amount' onChange={ (e) => handleOnChangeLineItemInput(e,i)}/></Td> */}
                                        <Td p={2}><Input name='amount' placeholder='0.00' type={'number'} onChange={ (e) => handleOnChangeLineItemInput(e,i)} maxW={'100px'}/></Td>
                                </Tr>
                            ))}
                        </Tbody>

                    </Table>
                </TableContainer>
            </Box>
            {/* Add Line Item Button */}
            <Flex justifyContent={'center'} gap={4}>
                <Button w={'30%'} onClick={() => handleAddingLineItem()} my={'2rem'}>Add Item</Button>
                {numOfLineItemFields <= 0 ? <></> : <Button my={'2rem'} onClick={() => handleDeleteLineItemField()}>Delete Row</Button>}
            </Flex>

            {/* Total */}
            {/* <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Total</Text> */}
            <Flex justify={'space-between'} px={'8rem'} py={'1rem'}>
                <Text>Subtotal</Text>
                <Text>${formatMoneyValue(invoiceSubTotalCalculatedvalue)}</Text>
            </Flex>
            <Flex justify={'space-between'} mx={'2rem'} px={'2rem'} py={'1rem'} bg={tableHeaderColor} rounded={'xl'} color={'white'}>
                <Text fontSize={'2xl'} fontWeight={'bold'}>Amount Due</Text>
                <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(invoiceTotalCalculatedValue)}</Text>
            </Flex>
            
            {/* Extra Section Information */}
            {measurementNoteSwitchIsOn === true || noteSwitchIsOn === true || customerNoteSwitchIsOn === true ? <>
                <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Extra</Text>
            </>: <></>}
            <Flex direction={{base: 'column',lg: 'row'}} w={'full'} gap={4}>
                {customerNoteSwitchIsOn === true ? <>
                    <Box w={{base: 'full',lg:'50%'}}>
                        <FormControl>
                            <FormLabel mt={'1rem'}>Message to Customer</FormLabel>
                            <Textarea placeholder='Thank you for your business! 🚀' value={customerNoteMessage} onChange={(e) => setCustomerNoteMessage(e.target.value)}/>
                        </FormControl>
                    </Box>
                </> : <></>}
                {measurementNoteSwitchIsOn === true ? <>
                    <Box w={{base: 'full',lg:'50%'}}>
                        <FormControl>
                            <FormLabel mt={'1rem'}>Measurements</FormLabel>
                            <Textarea value={sqftInput} onChange={(e) => setSqftInput(e.target.value)}/>
                        </FormControl>
                    </Box>
                </> : <></>}
            </Flex>
            {noteSwitchIsOn === true ? <>
                <FormControl>
                    <FormLabel mt='1rem'> Additional Note</FormLabel>
                    <Textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)}/>
                </FormControl>            
            </> : <></>}    
            {/* Custom Setting Switches */}
            <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Custom Settings</Text>
            <Flex gap={4} flexWrap={'wrap'} py='1rem'>
                <Flex align={'center'}>
                    <Switch size={'sm'} isChecked={billToSwitchIsOn} onChange={() => setBillToSwitchIsOn(!billToSwitchIsOn)}/>
                    <Text ml={'8px'}>Bill To</Text>
                </Flex>
                <Flex align={'center'}>
                    <Switch size={'sm'} isChecked={fixedRateSwitchIsOn} onChange={() => setFixedRateSwitchIsOn(!fixedRateSwitchIsOn)}/>
                    <Text ml={'8px'}>Fixed Rate</Text>
                </Flex>
                <Flex align={'center'}>
                    <Switch size={'sm'} isChecked={noteSwitchIsOn} onChange={() => setNoteSwitchIsOn(!noteSwitchIsOn)}/>
                    <Text ml={'8px'}>Note</Text>
                </Flex>
                <Flex align={'center'}>
                    <Switch size={'sm'} isChecked={measurementNoteSwitchIsOn} onChange={() => setMeasurementNoteSwitchIsOn(!measurementNoteSwitchIsOn)}/>
                    <Text ml={'8px'}>Measurement</Text>
                </Flex>
                <Flex align={'center'}>
                    <Switch size={'sm'} isChecked={customerNoteSwitchIsOn} onChange={() => setCustomerNoteSwitchIsOn(!customerNoteSwitchIsOn)}/>
                    <Text ml={'8px'}>Customer Note</Text>
                </Flex>
            </Flex>           
            <Flex pt={'2rem'} justifyContent={'flex-end'} gap={4}>
                <Button colorScheme='blue' type='submit' onClick={onNewClose}>Create</Button>
                <Button onClick={handleCancelButton} colorScheme='gray'>Cancel</Button>
            </Flex>
        </form>
    </DrawerIndex>
  )
}

export default NewInvoiceForm