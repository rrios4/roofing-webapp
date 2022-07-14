import React, { useState, useEffect } from 'react';
import { ModalIndex, ServiceTypeOptions, InvoiceStatusOptions } from '..';
import supabase from '../../utils/supabaseClient';
import AsyncSelect from 'react-select/async';
import { Text, FormControl, FormLabel, Select, Input, InputGroup, Button, useColorModeValue, useColorMode, Flex, Textarea } from '@chakra-ui/react'

const NewInvoiceForm = (props) => {
    const { colorMode } = useColorMode();
    const { onNewClose, isNewOpen, onNewOpen, initialRef } =  props
    const bg = useColorModeValue('white', 'gray.800');
    //React States to temporarly hold data & detect changes to data when state updated
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [serviceTypesOptions, setServiceTypesOptions] = useState(null);
    const [invoiceStatusOptions, setInvoiceStatusOptions] = useState(null)
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('');

    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [selectServiceTypeOption, setServiceTypeOption] = useState('');


    useEffect(() => {
      getServiceTypesOptionsData();
      getInvoiceStatusOptions();
    

    }, [])
    

    const handleSubmit = () => {

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

    const handleJobTypeInput = () => {

    }

    const handleInvoiceStatusInput = () => {

    }

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
                         <Input type={'text'}/>
                         <Flex flexDir={'row'} mb={'1rem'}>
                            <Flex flexDirection={'column'}>
                                <FormLabel pt='1rem'>City</FormLabel>
                                <Input type={'text'}/>
                            </Flex>
                            <Flex flexDirection={'column'} ml={'1rem'}>
                                <FormLabel pt='1rem'>State</FormLabel>
                                <Input type='text'/>
                            </Flex>
                        </Flex>
                        <FormLabel mt='1rem'>Zipcode</FormLabel>
                        <Input type={'text'}/>
                </FormControl>
                <FormControl isRequired>
                    <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Invoice</Text>
                    <Flex flexDir={'row'} mb={'1rem'}>
                        <Flex flexDirection={'column'}>
                            <FormLabel pt='1rem'>Status</FormLabel>
                            <Select value={selectedInvoiceStatus} placeholder='Select Status' onChange={(e) => setSelectedInvoiceStatus(e.target.value)}>
                                <InvoiceStatusOptions data={invoiceStatusOptions}/>
                            </Select>
                        </Flex>
                        <Flex flexDirection={'column'} ml={'1rem'}>
                            <FormLabel pt='1rem'>Date</FormLabel>
                            <Input type='date' value={invoiceDate} onChange={({target}) => setInvoiceDate(target.value)} id='invDate' placeholder='Invoice date'/>
                        </Flex>
                    </Flex>
                    <FormControl isRequired>
                        <FormLabel mt='1rem'>Due Date</FormLabel>
                        <Input type='date' value={dueDate} onChange={({target}) => setDueDate(target.value)} id='dueDate' placeholder='Due date'/>
                    </FormControl>
                    <FormLabel mt='1rem'>Service Type</FormLabel>
                    <Select value={selectedServiceType} placeholder='Select Service' onChange={(e) => setSelectedServiceType(e.target.value)}>
                        <ServiceTypeOptions data={serviceTypesOptions}/>
                    </Select>
                    {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
                </FormControl>
                {/* <FormControl isRequired>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Total</Text>
                <FormLabel mt='1rem'>Service Name</FormLabel>
                    <InputGroup>
                        <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel mt='1rem'>Total</FormLabel>
                    <Input value={amountDue} onChange={({target}) => setAmountDue(target.value)} placeholder='Amount due' type='number'/>
                </FormControl> */}
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Extra</Text>
                <FormControl>
                    <FormLabel mt={'1rem'}>Measurements</FormLabel>
                    <Textarea/>
                    <FormLabel mt='1rem'>Note</FormLabel>
                    <Textarea/>
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