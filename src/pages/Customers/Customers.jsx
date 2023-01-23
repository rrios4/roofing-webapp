import React, { useState, useEffect } from 'react';
import { Customer, Card, StateOptions, CustomerTypeOptions, NewCustomerForm } from '../../components';
import { Select, Flex, Box, Text, Button, Input, useBreakpointValue, InputGroup, InputLeftAddon, useColorModeValue, TableContainer, FormHelperText, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, FormControl, FormLabel, ModalFooter, VStack, Table, TableCaption, Thead, Tr, Th, Tbody, Td, HStack, Spinner, Icon, Stack, Skeleton } from '@chakra-ui/react';
import supabase from '../../utils/supabaseClient'
import stateJSONData from '../../data/state_titlecase.json'
import formatPhoneNumber from '../../utils/formatPhoneNumber';
import { IoMdPersonAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowLeft, MdSearch } from 'react-icons/md';
import {
    FiUsers,
  } from "react-icons/fi";

export default function Customers() {
    //For opening drawer components
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();
    //const finalRef = React.useRef();

    //Style for Card component
    const bg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const buttonColorScheme = useColorModeValue('blue', 'gray');

    //GET data from API
    const [customers, setCustomers] = useState(null);
    const [searchCustomer, setSearchCustomer] = useState('');

    const isWideVersion = useBreakpointValue({
        base: false,
        xl: true
    })

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        // if (!localStorage.getItem('supabase.auth.token')) {
        //     history.push('/login');
        // }
        getAllCustomers();
    }, []);

    // Gets a list of all customers stored in supabase DB
    const getAllCustomers = async () => {
        let { data: customers, error } = await supabase
            .from('customer')
            .select('*')

        if (error) {
            console.log(error)
        }

        setCustomers(customers)
    }

    // Search for customer based on first name, last name, or email address
    const getAllCustomersByName = async (event) => {
        event.preventDefault();
        if (searchCustomer === '') {
            let { data: customers, error } = await supabase
                .from('customer')
                .select('*')
            if (error) {
                console.log(error)
            }
            setCustomers(customers)
        } else {
            let { data: customersSearchResult, error } = await supabase
                .from('customer')
                .select('*')
                .or(`first_name.ilike.%${searchCustomer}%,last_name.ilike.%${searchCustomer}%,email.ilike.%${searchCustomer}%,phone_number.ilike.%${searchCustomer}%`)

            if (error) {
                console.log(error)
            }
            console.log(customersSearchResult)
            setCustomers(customersSearchResult);
        }
    }

    return (
        <>
            <NewCustomerForm isOpen={isOpen} onClose={onClose} initialRef={initialRef} updateCustomerData={getAllCustomers} />
            <VStack my={'2rem'} w='100%' mx={'auto'} px={{base: '1rem', lg: '2rem'}}>
                <Box display={'flex'} marginBottom={'0rem'} justifyContent='start' w='full'>
                    <Link to={'/'}>
                        <Button colorScheme={buttonColorScheme} ml={'1rem'} mb='1rem' leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>Back</Button>
                    </Link>
                </Box>
                <Card width='full' bg={bg} borderColor={borderColor}>
                    <Stack direction={{base: 'column', lg:'row'}} mt={'1rem'} mb={'2rem'} spacing='auto'>
                        <Flex alignItems={'center'} ml='24px'>
                            <Icon as={FiUsers} boxSize={'7'}/>
                            <Text fontSize={'3xl'} fontWeight='semibold' mx='14px'>Customers</Text>
                        </Flex>
                        <Box display='flex' pr='1rem' pt={{base: '1rem', lg: '0rem'}} justifyContent={{base:'center', lg: 'normal'}} >
                            <form method='GET' onSubmit={getAllCustomersByName}>
                                <FormControl>
                                    <Flex flexDir={'row'}>
                                        <Input value={searchCustomer} onChange={({ target }) => setSearchCustomer(target.value)} placeholder='Search for Customer' colorScheme='blue' border='2px' />
                                        <Tooltip label='Search'><Button ml={'1rem'} type='submit'><MdSearch size={'25px'} /></Button></Tooltip>
                                    </Flex>
                                </FormControl>
                            </form>
                            <Tooltip label={'Create New Customer'}><Button colorScheme='blue' variant='solid' onClick={onOpen} ml='2rem'><IoMdPersonAdd size={'20px'} /></Button></Tooltip>
                        </Box>

                    </Stack>
                    <TableContainer overflow={'auto'}>
                        {customers ? <>
                            <Table variant='simple' size={'sm'}>
                                <TableCaption>Total of {customers?.length} customers registered in our system ✌️</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Customer</Th>
                                        <Th textAlign={'center'}>Type</Th>
                                        {isWideVersion && <Th>Phone Number</Th>}
                                        {isWideVersion && <Th>Address</Th>}
                                        {isWideVersion && <Th>Registered Date</Th>}
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Customer customers={customers} isWideVersion={isWideVersion} />
                                </Tbody>
                            </Table> 
                        </> : <Skeleton height={'100px'} rounded={'md'}/>}
                    </TableContainer>
                </Card>
            </VStack>
        </>
    )
}