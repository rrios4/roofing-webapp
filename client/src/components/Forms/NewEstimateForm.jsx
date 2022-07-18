import React,{useState} from 'react';
import { DrawerIndex, CustomerOptions } from '..';
import AsyncSelect from 'react-select/async';
import supabase from '../../utils/supabaseClient';
import { useColorMode, Select, Box, Flex, Textarea, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, Table, TableContainer, Td, ModalCloseButton, HStack, Tooltip, ModalBody, ModalFooter, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Button, FormHelperText, Text, useDisclosure, VStack, TableCaption, Thead, Tr, Th, Tbody} from '@chakra-ui/react';

const NewEstimateForm = (props) => {
    const { isOpen, onClose, initialRef, updateEstimateData } = props 
    const { colorMode } = useColorMode();

    // States to manage data
    const [estimates, setEstimates] = useState(null);
    const [customers, setCustomers] = useState('');
    const [name, setCustomerName] = useState('');
    const [etDate, setEtDate] = useState('');
    const [expDate, setExpDate] = useState('');
    const [quotePrice, setQuotedPrice] = useState('');
    const [estStatus, setEstStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [measurement, setMeasurement] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [cuIdCaptured, setCuIdCaptured] = useState('');

    const [quoteToStreetAddressInput, setQuoteToStreetAddressInput] = useState('');
    const [quoteToCityInput, setQuoteToCityInput] = useState('');
    const [quoteToStateInput, setQuoteToStateInput] = useState('');
    const [quoteToZipcodeInput, setQuoteToZipcodeInput] = useState('');
    const [estimateNumberInput, setEstimateNumberInput] = useState('')


    const handleSubmit= async() => {

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

  return (
    <DrawerIndex isOpen={isOpen} onClose={onClose} initialRef={initialRef}>
        <form method='POST' onSubmit={handleSubmit}>
        <Text fontSize={'25px'} fontWeight={'bold'}>Create<Text as='span' ml={'8px'} color={'blue.500'}>Estimate</Text></Text>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Quote To</Text>
                <FormControl isRequired>
                    <FormLabel pt='1rem'>Customer</FormLabel>
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
                        <Input value={quoteToStreetAddressInput} onChange={(e) => setQuoteToStreetAddressInput(e.target.value)} type={'text'}/>
                        <Flex flexDir={'row'} mb={'1rem'}>
                        <Flex flexDirection={'column'}>
                            <FormLabel pt='1rem'>City</FormLabel>
                            <Input value={quoteToCityInput} onChange={(e) => setQuoteToCityInput(e.target.value)} type={'text'}/>
                        </Flex>
                        <Flex flexDirection={'column'} ml={'1rem'}>
                            <FormLabel pt='1rem'>State</FormLabel>
                            <Input value={quoteToStateInput} onChange={(e) => setQuoteToStateInput(e.target.value)} type='text'/>
                        </Flex>
                    </Flex>
                    <FormLabel mt='1rem'>Zipcode</FormLabel>
                    <Input type='number' value={quoteToZipcodeInput} onChange={(e) => setQuoteToZipcodeInput(e.target.value)} type={'text'}/>
                </FormControl>
                {/* <FormControl isRequired>
                    <FormLabel pt='1rem'>Job Type</FormLabel>
                    <Select placeholder='Select Job Type'>
                        <option value='Option 1'>New Roof Installation</option>
                        <option value='Option 2'>Roof Repair</option>
                        <option value='Option 3'>Construction</option>
                    </Select>
                    <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/>
                </FormControl> */}
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Estimate Description</Text>
                <FormControl isRequired>
                <FormLabel>Invoice Number</FormLabel>
                <Input type={'number'} placeholder='Type Invoice Number' value={estimateNumberInput} onChange={(e) => setEstimateNumberInput(e.target.value)}/>
                    <Flex flexDir={'row'} mb={'1rem'}>
                        <Flex flexDirection={'column'} mr='1rem'>
                            <FormLabel pt='1rem'>Status</FormLabel>
                            <Select placeholder='Select Status' value={estStatus} onChange={(e) => setEstStatus(e.target.value)}>
                                <option value='2'>Approved</option>
                                <option value='1'>Pending</option>
                                <option value='3'>Expired</option>
                            </Select>
                        </Flex>
                        <Flex>
                            <FormControl isRequired>
                                <FormLabel pt='1rem'>Estimate Date</FormLabel>
                                <Input type='date' value={etDate} onChange={({target}) => setEtDate(target.value)} id='state' placeholder='Invoice date'/>
                            </FormControl>
                        </Flex>

                    </Flex>
                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                </FormControl>
                <FormControl isRequired>
                    <FormLabel pt='1rem'>Expiration Date</FormLabel>
                    <Input type='date' value={expDate} onChange={({target}) => setExpDate(target.value)} id='zipcode' placeholder='Due date'/>
                </FormControl>
                <FormControl isRequired>
                <FormLabel pt='1rem'>Service Name</FormLabel>
                    <InputGroup>
                    <Input id='service' placeholder='Service Name' value={serviceName} onChange={({target}) => setServiceName(target.value)} />
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel pt='1rem'>Estimate Total</FormLabel>
                    <Input value={quotePrice} onChange={({target}) => setQuotedPrice(target.value)} placeholder='Quote price' type='number'/>
                </FormControl>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Extra</Text>
                <FormControl>
                    <FormLabel pt='1rem'>Sqft Roof Measurement</FormLabel>
                    <Textarea type='number' placeholder='Sqft of Roof' value={measurement} onChange={({target}) => setMeasurement(target.value)}></Textarea>
                </FormControl>
                <Flex pt={'2rem'} w='full' justifyContent={'flex-end'}>
                    <Button onClick={onClose} mr='1rem'>Cancel</Button>
                    <Button colorScheme='blue' type='submit' onClick={onClose} >Save</Button>
                </Flex>
        </form>
    </DrawerIndex>
  )
}

export default NewEstimateForm