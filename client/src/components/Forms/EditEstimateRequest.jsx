import React from 'react';
import { Select, Flex, Box, Text, Button, Input, InputGroup, InputLeftAddon, FormHelperText, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Tooltip, useColorModeValue, border} from '@chakra-ui/react';

const EditEstimateRequest = (props) => {
    const { onClose, isOpen, onOpen, initialRef } =  props
    // Chakra UI Modal
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // const initialRef = React.useRef();

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} motionPreset={'slideInBottom'}>
    <ModalOverlay />
        <ModalContent zIndex={'9997'} roundedRight={'25'} w={'450px'} h='100vh' position={'fixed'} left={'100px'} top={'-60px'} bg={'gray.800'}>
            <Flex pl={'4rem'} pr={'3rem'} py={'2rem'} flexDirection={'column'} left={'0px'} top={'0px'} w={'450px'} minH={'100vh'} overflow={'auto'}>
                <Flex flexDir={'column'}>
                    <Text fontSize={'25px'} fontWeight={'bold'}>Edit<Text as='span' ml={'8px'} color={'blue.500'}>ESTR</Text>-0016</Text>
                    <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Request</Text>
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
                            <FormLabel>Date</FormLabel>
                            <Input type='date'/>
                        </Flex>
                    </Flex>
                    <FormLabel>Service Type</FormLabel>
                    <Select>
                        <option>Roof Replacement</option>
                        <option>Roof Leak Repair</option>
                        <option>Roof Maintenance</option>
                    </Select>
                    <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Address</Text>
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
                    <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Client</Text>
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
                </Flex>
            </Flex>
        </ModalContent>
    </Modal>
  )
}

export default EditEstimateRequest