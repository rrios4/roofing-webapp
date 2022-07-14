import React, { useState, useEffect } from 'react';
import { ModalIndex, ServiceTypeOptions, InvoiceStatusOptions } from '..';
import supabase from '../../utils/supabaseClient';
import AsyncSelect from 'react-select/async';
import { Text, FormControl, FormLabel, Select, Input, InputGroup, Button, useColorModeValue, useColorMode, Flex, Textarea } from '@chakra-ui/react';

const NewInvoiceForm = (props) => {
    const { colorMode } = useColorMode();
    const { onNewClose, isNewOpen, onNewOpen, initialRef, fetchInvoice } =  props
    const bg = useColorModeValue('white', 'gray.800');
    //React States to temporarly hold data & detect changes to data when state updated
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [serviceTypesOptions, setServiceTypesOptions] = useState(null);
    const [invoiceStatusOptions, setInvoiceStatusOptions] = useState(null)
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('');

    const [invoiceNumberInput, setInvoiceNumberInput] = useState('');
    const [invoiceDateInput, setInvoiceDateInput] = useState('');
    const [invoiceDueDateInput, setInvoiceDueDateInput] = useState('');
    const [sqftInput, setSqftInput] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [billToStreetAddressInput, setBillToStreetAddressInput] = useState('');
    const [billToCityInput, setBillToCityInput] = useState('');
    const [billToStateInput, setBillToStateInput] = useState('');
    const [billToZipcodeInput, setBillToZipcodeInput] = useState('')

    useEffect(() => {
      getServiceTypesOptionsData();
      getInvoiceStatusOptions();
    

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
                bill_to_street_address: billToStreetAddressInput,
                bill_to_city: billToCityInput,
                bill_to_state: billToStateInput,
                bill_to_zipcode: billToZipcodeInput,

            }
        ])

        if(error){
            console.log(error)
            alert(error)
        }
        
        fetchInvoice(); setInvoiceNumberInput(''); setSelectedCustomer(''); selectedServiceType(''); setSelectedInvoiceStatus(''); setInvoiceDateInput(''); setInvoiceDueDateInput(''); setSqftInput(''); setNoteInput(''); setBillToCityInput(''); setBillToStateInput(''); setBillToStreetAddressInput(''); setBillToZipcodeInput('')
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
        .from('service_type')
        .select('id, name')

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

    // Function to get latest invoice number and comeup with the next 
    const newInvoiceNumberLogic = async() => {
    }

  return (
    <ModalIndex initialFocusRef={initialRef} isOpen={isNewOpen} onClose={onNewClose} bg={bg}>
        <form method='POST' onSubmit={handleSubmit}>
            <FormControl isRequired>
            <Text fontSize={'25px'} fontWeight={'bold'}>Create<Text as='span' ml={'8px'} color={'blue.500'}>Invoice</Text></Text>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Bill To</Text>
                <FormLabel mt='1rem'>Customer</FormLabel>
                    <AsyncSelect 
                        onChange={handleSelectedCustomer} 
                        loadOptions={loadOptions} 
                        // defaultOptions={}
                        placeholder='Type Customer Name'
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
                        <FormLabel mt='1rem'>Street Address</FormLabel>
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
                    </Flex>
                    <FormLabel mt='1rem'>Zipcode</FormLabel>
                    <Input value={billToZipcodeInput} onChange={(e) => setBillToZipcodeInput(e.target.value)} type={'text'}/>
            </FormControl>
            <FormControl isRequired>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Invoice</Text>
                <FormLabel>Invoice Number</FormLabel>
                <Input type={'number'} placeholder='Type Invoice Number' value={invoiceNumberInput} onChange={(e) => setInvoiceNumberInput(e.target.value)}/>
                <Flex flexDir={'row'} mb={'1rem'}>
                    <Flex flexDirection={'column'}>
                        <FormLabel pt='1rem'>Status</FormLabel>
                        <Select value={selectedInvoiceStatus} placeholder='Select Status' onChange={(e) => setSelectedInvoiceStatus(e.target.value)}>
                            <InvoiceStatusOptions data={invoiceStatusOptions}/>
                        </Select>
                    </Flex>
                    <Flex flexDirection={'column'} ml={'1rem'}>
                        <FormLabel pt='1rem'>Date</FormLabel>
                        <Input type='date' value={invoiceDateInput} onChange={({target}) => setInvoiceDateInput(target.value)} id='invDate' placeholder='Select Invoice Date'/>
                    </Flex>
                </Flex>
                <FormControl isRequired>
                    <FormLabel mt='1rem'>Due Date</FormLabel>
                    <Input type='date' value={invoiceDueDateInput} onChange={({target}) => setInvoiceDueDateInput(target.value)} id='dueDate' placeholder='Due date'/>
                </FormControl>
                <FormLabel mt='1rem'>Service Type</FormLabel>
                <Select value={selectedServiceType} placeholder='Select Service' onChange={(e) => setSelectedServiceType(e.target.value)}>
                    <ServiceTypeOptions data={serviceTypesOptions}/>
                </Select>
            </FormControl>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Extra</Text>
            <FormControl>
                <FormLabel mt={'1rem'}>Measurements</FormLabel>
                <Textarea value={sqftInput} onChange={(e) => setSqftInput(e.target.value)}/>
                <FormLabel mt='1rem'>Note</FormLabel>
                <Textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)}/>
            </FormControl>

            <Flex pt={'2rem'} justifyContent={'flex-end'}>
                <Button onClick={onNewClose} mr={3} colorScheme='gray'>Cancel</Button>
                <Button colorScheme='blue' type='submit' onClick={onNewClose} >Create</Button>
            </Flex>
        </form>
    </ModalIndex>
  )
}

export default NewInvoiceForm