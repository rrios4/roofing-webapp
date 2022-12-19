import React from 'react';
import { Td, Tr, Text, Box, Flex, Button, Spinner, Tooltip, Avatar, Badge } from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Customer = (props) => {
  const { customers, isWideVersion } = props
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <>
      {customers ? customers.map((customer, index) => (
        <Tr key={index}>
          <Td>{customer.first_name && customer.last_name ? <><Flex><Avatar size={'sm'} mr={'18px'} my={'auto'} /><Flex flexDir={'column'}><Flex fontWeight={'bold'} fontSize={'md'}><Text marginRight={'4px'}>{customer.first_name}</Text><Text>{customer.last_name}</Text></Flex><Flex mt={'4px'} fontWeight={'light'}>{customer.email}</Flex></Flex></Flex></> : <>{customer.company_name}</>}</Td>
          <Td><Badge padding={'8px'} rounded={'full'} colorScheme={customer.customer_type_id === 1 ? 'blue' : customer.customer_type_id === 2 ? 'green' : customer.customer_type_id === 3 ? 'yellow' : ''} variant={'solid'} ml={'1rem'}>{customer.customer_type_id === 1 ? 'Residential' : customer.customer_type_id === 2 ? 'Commercial' : customer.customer_type_id === 3 ? 'Other' : ''}</Badge></Td>
          {isWideVersion && <Td><Flex fontWeight={'light'}>{customer.phone_number}</Flex></Td>}
          {isWideVersion && <Td><Text _hover={{ textColor: "blue" }} cursor={'pointer'} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`)}>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text></Td>}
          {isWideVersion && <Td>{new Date(customer.created_at).toLocaleDateString('en-us', options)}</Td>}
          <Td textAlign={'center'}><Link to={`/editcustomer/${customer.id}`}><Tooltip label='Go to Customer Details '><Button ml={'1rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'} /></Button></Tooltip></Link></Td>
        </Tr>
      )) : <Tr><Td><Spinner padding={'1rem'} /></Td></Tr>}
    </>
  )
}

export default Customer