import React from 'react';
import { ModalIndex } from '../';
import { Text, Flex, FormLabel, Select, Input, FormControl, Button, useColorModeValue } from '@chakra-ui/react'

const EditInvoiceForm = (props) => {
    const { onClose, isOpen, onOpen, initialRef } =  props
    const bg = useColorModeValue('white', 'gray.800')
  return (
    <ModalIndex initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} bg={bg}>
        <Text fontSize={'25px'} fontWeight={'bold'}>Edit<Text as='span' ml={'8px'} color={'blue.500'}>INV</Text>-0016</Text>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Invoice</Text>
        <Flex flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>Status</FormLabel>
                <Select>
                    <option>New</option>
                    <option>Scheduled</option>
                    <option>Expired</option>
                </Select>
            </Flex>
            <Flex flexDirection={'column'}>
                <FormLabel>Invoice Date</FormLabel>
                <Input type='date'/>
            </Flex>
        </Flex>
        <Flex flexDirection={'column'} mb={'1rem'}>
            <FormLabel>Issue Date</FormLabel>
            <Input type='date'/>
        </Flex>
        <Flex flexDirection={'column'} mb={'1rem'}>
            <FormLabel>Due Date</FormLabel>
            <Input type='date'/>
        </Flex>
        <FormLabel>Service Type</FormLabel>
        <Select>
            <option>Roof Replacement</option>
            <option>Roof Leak Repair</option>
            <option>Roof Maintenance</option>
        </Select>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill From</Text>
        <FormControl>
            <FormLabel htmlFor='city'>Street Address</FormLabel>
            <Input type={''}/>
        </FormControl>
        <Flex mt={'1rem'} flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>City</FormLabel>
                <Input/>
            </Flex>
            <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Post Code</FormLabel>
                <Input/>
            </Flex>
        </Flex>
        <FormControl>
            <FormLabel htmlFor='city'>State</FormLabel>
            <Input type={''}/>
        </FormControl>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill To</Text>
        <Flex flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>First Name</FormLabel>
                <Input/>
            </Flex>
            <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Last Name</FormLabel>
                <Input/>
            </Flex>
        </Flex>
        <FormControl>
            <FormLabel htmlFor='city'>Email</FormLabel>
            <Input type={''}/>
        </FormControl>
        <Flex pt={'2rem'} justifyContent={'flex-end'}>
            <Button mx={'1rem'} onClick={onClose}>Cancel</Button>
            <Button colorScheme={'blue'}>Save Changes</Button>
        </Flex>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Item List</Text>
    </ModalIndex>
  )
}

export default EditInvoiceForm