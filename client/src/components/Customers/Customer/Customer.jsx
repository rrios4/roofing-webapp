import React from 'react';
import { Td, Tr, Text, Box, Button, Spinner, Tooltip } from '@chakra-ui/react';
import {MdKeyboardArrowRight} from 'react-icons/md';
import { Link } from 'react-router-dom';

const Customer = (props) => {
    const { customers } = props
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <>
        {customers ? customers.map((customer,index) => (
            <Tr key={index}>
                <Td textAlign={'center'}>{customer.first_name && customer.last_name ? <><Text marginRight={'2px'}>{customer.first_name}</Text><Text>{customer.last_name}</Text></> : <>{customer.company_name}</>}</Td>
                <Td textAlign={'center'} isNumeric>
                    {customer.customer_type_id === 1 ? <><Text fontSize={'sm'} maxW={'100px'} mx={'auto'} textAlign={'center'} p={'2'} rounded={'full'} bg={'blue.500'} textColor={'white'} fontWeight={'light'}>Residential</Text></>  : ""}
                    {customer.customer_type_id === 2 ? <><Text fontSize={'sm'} maxW={'100px'} mx={'auto'} textAlign={'center'} p={'2'} rounded={'full'} bg={'green.500'} textColor={'white'} fontWeight={'light'}>Commercial</Text></> : ""}
                    {customer.customer_type_id === 3 ? <><Text fontSize={'sm'} maxW={'100px'} mx={'auto'} textAlign={'center'} p={'2'} rounded={'full'} bg={'yellow.500'} textColor={'white'} fontWeight={'light'}>Other</Text></>   : ""}  
                </Td>
                <Td textAlign={'center'}>{customer.email}</Td>
                <Td textAlign={'center'}>{customer.phone_number}</Td>
                <Td textAlign={'center'}><Text _hover={{textColor: "blue"}} cursor={'pointer'} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`)}>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text></Td>
                <Td textAlign={'center'}>{new Date(customer.created_at).toLocaleDateString('en-us', options)}</Td>
                <Td textAlign={'center'}><Link to={`/editcustomer/${customer.id}`}><Tooltip label='Go to Customer Details '><Button ml={'1rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td>
            </Tr>
        )) : <><Td></Td><Td></Td><Td></Td><Td></Td><Td display={'flex'} justifyContent='center'><Spinner margin='1rem'/></Td> </>}
    </>
  )
}

export default Customer