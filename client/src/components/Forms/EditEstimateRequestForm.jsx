import React from 'react';
import { Select, Flex, Box, Text, Button, Input, InputGroup, InputLeftAddon, FormHelperText, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Tooltip, useColorModeValue, border, Collapse, Slide} from '@chakra-ui/react';
import { DrawerIndex } from '../'

const EditEstimateRequestForm = (props) => {
    const { onClose, isOpen, onOpen, objectData, initialRef } =  props
    const bg = useColorModeValue('white', 'gray.800')
    // Chakra UI Modal
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // const initialRef = React.useRef();

  return (
    <DrawerIndex initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} bg={bg}>
        <Text fontSize={'25px'} fontWeight={'bold'}>Edit<Text as='span' ml={'8px'} color={'blue.500'}>QR</Text>-{objectData.id}</Text>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Request</Text>
        <Flex flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>Status</FormLabel>
                <Select defaultValue={objectData.est_request_status_id}>
                    <option value={1}>New</option>
                    <option value={2}>Scheduled</option>
                    <option value={3}>Expired</option>
                </Select>
            </Flex>
            <Flex flexDirection={'column'}>
                <FormLabel>Date</FormLabel>
                <Input type='date' defaultValue={objectData.requested_date}/>
            </Flex>
        </Flex>
        <FormLabel>Service Type</FormLabel>
        <Select defaultValue={objectData.service_type_id}>
            <option value={1}>Roof Replacement</option>
            <option value={2}>Roof Leak Repair</option>
            <option value={3}>Roof Maintenance</option>
        </Select>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Address</Text>
        <FormControl>
            <FormLabel htmlFor='city'>Street Address</FormLabel>
            <Input type={'text'} defaultValue={objectData.streetAddress}/>
        </FormControl>
        <Flex mt={'1rem'} flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>City</FormLabel>
                <Input type={'text'} defaultValue={objectData.city}/>
            </Flex>
            <Flex flexDirection={'column'}>
                <FormLabel>State</FormLabel>
                <Input type={'text'} defaultValue={objectData.state}/>
            </Flex>
            <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Post Code</FormLabel>
                <Input type={'text'} defaultValue={objectData.zipcode}/>
            </Flex>
        </Flex>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Client</Text>
        <Flex flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>First Name</FormLabel>
                <Input type={'text'} defaultValue={objectData.firstName}/>
            </Flex>
            <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Last Name</FormLabel>
                <Input type={'text'} defaultValue={objectData.lastName}/>
            </Flex>
        </Flex>
        <FormControl>
            <FormLabel htmlFor='city'>Email</FormLabel>
            <Input type={'email'} defaultValue={objectData.email}/>
        </FormControl>
        <Flex pt={'2rem'} justifyContent={'flex-end'}>
            <Button mx={'1rem'} onClick={onClose}>Cancel</Button>
            <Button colorScheme={'blue'}>Save Changes</Button>
        </Flex>
    </DrawerIndex>
  )
}

export default EditEstimateRequestForm