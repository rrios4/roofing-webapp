import React, { useState } from 'react';
import { ModalIndex } from '..';
import supabase from '../../utils/supabaseClient';
import AsyncSelect from 'react-select/async';
import { Text, ModalCloseButton, ModalBody, FormControl, FormLabel, Select, Input, InputGroup, ModalFooter, Button, useColorModeValue } from '@chakra-ui/react'

const NewInvoiceForm = (props) => {
    const { onNewClose, isNewOpen, onNewOpen, initialRef } =  props
    const bg = useColorModeValue('white', 'gray.800');
    //React States to temporarly hold data & detect changes to data when state updated
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [selectInvoiceStatus, setSelectInvoiceStatus] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [selectJobTypeOption, setJobTypeOption] = useState('');

    const handleSubmit = () => {

    }

    const handleSelectedCustomer = () => {

    }

    const loadOptions = async (inputText, callback) => {
        //Use supabase SDK to return a list of all customers
        const { data: customers , error} = await supabase
        .from('customer')
        .select('first_name, last_name, customer_type_id, id, email')
        .like('first_name, last_name', `%${inputText}%`)

        if(error){
            console.log(error);
        }
        callback(customers.map((customer, index) => ({label: `${customer.first_name} ${customer.last_name}`, value: customer.id, email: customer.email})))
        console.log(customers)
    };

    const handleJobTypeInput = () => {

    }

    const handleInvoiceStatusInput = () => {

    }

  return (
    <ModalIndex initialFocusRef={initialRef} isOpen={isNewOpen} onClose={onNewClose} bg={bg}>
                        <ModalCloseButton />
                        <form method='POST' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                <Text fontSize={'25px'} fontWeight={'bold'}>Create<Text as='span' ml={'8px'} color={'blue.500'}>INVOICE</Text></Text>
                                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Invoice</Text>
                                    <FormLabel pt='1rem'>Customer Name</FormLabel>
                                        <AsyncSelect 
                                            
                                            onChange={handleSelectedCustomer} 
                                            loadOptions={loadOptions} 
                                            placeholder='Type Customer Name'
                                            getOptionLabel={option => `${option.label},  ${option.email}`}
                                            theme={theme => ({
                                                ...theme,
                                                borderRadius: 5,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: 'primary',
                                                    primary: 'black',
                                                    neutral0: 'white',
                                                    neutral90: 'white',
                                                },
                                            })}/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Job Type</FormLabel>
                                    <Select defaultValue={null} value={selectJobTypeOption} placeholder='Select Job Type' onChange={(e) => handleJobTypeInput(e)}>
                                        <option value='1'>New Roof Installation</option>
                                        <option value='2'>Roof Repairs</option>
                                        <option value='3'>Structure Construction</option>
                                        <option value='4'>Siding Repair</option>
                                        <option value='5'>Roof Maintenance</option>
                                        <option value='6'>Painting Interior of Home</option>
                                        <option value='7'>Painting Exterior of Home</option>
                                        <option value='8'>Flooring Installation</option>
                                    </Select>
                                    {/* <Input value={address} onChange={({target}) => setAddress(target.value)} id='address' placeholder='Street address'/> */}
                                </FormControl>
                                <FormControl isRequired={true}>
                                    <FormLabel pt='1rem'>Invoice Status</FormLabel>
                                    <Select defaultValue={null} value={selectInvoiceStatus} placeholder='Select Invoice Status' onChange={(e) => handleInvoiceStatusInput(e)}>
                                        <option value='2'>Paid</option>
                                        <option value='1'>Pending</option>
                                        <option value='3'>Outstanding</option>
                                    </Select>
                                    {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Invoice Date</FormLabel>
                                    <Input type='date' value={invoiceDate} onChange={({target}) => setInvoiceDate(target.value)} id='invDate' placeholder='Invoice date'/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Due Date</FormLabel>
                                    <Input type='date' value={dueDate} onChange={({target}) => setDueDate(target.value)} id='dueDate' placeholder='Due date'/>
                                </FormControl>
                                <FormControl isRequired>
                                <FormLabel pt='1rem'>Service Name</FormLabel>
                                    <InputGroup>
                                        <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt='1rem'>Amount Due</FormLabel>
                                    <Input value={amountDue} onChange={({target}) => setAmountDue(target.value)} placeholder='Amount due' type='number'/>
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' onClick={onNewClose} >Save</Button>
                            <Button onClick={onNewClose} colorScheme='blue'>Cancel</Button>
                        </ModalFooter>
                        </form>
    </ModalIndex>
  )
}

export default NewInvoiceForm