import React, { useState, useEffect } from 'react';
import { DrawerIndex } from '..';
import { Text, FormControl, FormLabel, Select, Input, InputGroup, Button, useColorModeValue, useColorMode, Flex, Textarea, DrawerFooter } from '@chakra-ui/react';
import supabase from '../../utils/supabaseClient';
import { QuoteRequestStatusOptions } from '../'

const NewEstimateRequestForm = (props) => {
    const {isOpen, onOpen, onClose, initialRef} = props

    //React UseStates
    const [quoteStatuses, setQuoteStatuses] = useState('')
    const [selectedQuoteStatus, setSelectedQuoteStatus] = useState('')

    const handleSubmit = () => {

    }

    useEffect(() => {
      getAllQuoteStatuses()
    

    }, [])
    

    //Get list of all quote statuses
    const getAllQuoteStatuses = async() => {
        let { data: quoteStatuses, error} = await supabase
        .from('estimate_request_status')
        .select('*')

        if(error){
            console.log(error)
        }
        setQuoteStatuses(quoteStatuses)
        // console.log(quoteStatuses)
    }


  return (
    <DrawerIndex isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <form method='POST' onSubmit={handleSubmit}>
            <Text fontSize={'25px'} fontWeight={'bold'}>Create<Text as='span' ml={'8px'} color={'blue.500'}>Quote Request</Text></Text>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Request</Text>
            <FormControl isRequired>
                <Flex>
                    <Flex flexDir={'column'}>
                        <FormLabel>Status</FormLabel>
                        <Select placeholder='Select Status' value={selectedQuoteStatus} onChange={(e) => {setSelectedQuoteStatus(e.target.value)}}>
                            <QuoteRequestStatusOptions data={quoteStatuses}/>
                        </Select>
                    </Flex>
                    <Flex flexDir={'column'} ml={'1rem'}>
                        <FormLabel>Date</FormLabel>
                        <Input type={'date'}/>
                    </Flex>
                </Flex>
                <FormLabel mt={'1rem'}>Service Type</FormLabel>
                <Input type={'text'}/>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Address</Text>
                <FormLabel>Street Address</FormLabel>
                <Input/>
                <Flex mt={'1rem'}>
                    <Flex flexDir={'column'} mr={'1rem'}>
                        <FormLabel>City</FormLabel>
                        <Input type={'text'}/>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <FormLabel>State</FormLabel>
                        <Input type={'text'}/>
                    </Flex>
                    <Flex flexDir={'column'} ml={'1rem'}>
                        <FormLabel>Postal Code</FormLabel>
                        <Input type={'text'}/>
                    </Flex>
                </Flex>

                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Client</Text>
                <Flex mt={'1rem'}>
                    <Flex flexDir={'column'} mr={'1rem'}>
                        <FormLabel>First Name</FormLabel>
                        <Input type={'text'}/>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <FormLabel>Last Name</FormLabel>
                        <Input type={'text'}/>
                    </Flex>
                </Flex>
                <FormLabel mt={'1rem'}>Email</FormLabel>
                <Input type={'email'}/>
            </FormControl>
            <DrawerFooter mt={'2rem'}>
                <Button onClick={onClose} mr='1rem'>Cancel</Button>
                <Button type='submit' colorScheme={'blue'}>Create</Button>
            </DrawerFooter>

        </form>

    </DrawerIndex>
  )
}

export default NewEstimateRequestForm