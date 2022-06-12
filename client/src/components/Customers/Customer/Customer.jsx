import React from 'react';
import { Td, Tr, Text, Box, Button, Spinner } from '@chakra-ui/react';
import {MdKeyboardArrowRight} from 'react-icons/md';
import { Link } from 'react-router-dom';

const Customer = (props) => {
    const { customers } = props

  return (
    <>
        {customers ? customers.map((customer,index) => (
            <Tr key={index}>
                <Td maxW={'150px'}>{customer.first_name && customer.last_name ? <><Text marginRight={'2px'}>{customer.first_name}</Text><Text>{customer.last_name}</Text></> : <>{customer.company_name}</>}</Td>
                <Td>{customer.email}</Td>
                <Td>{customer.phone_number}</Td>
                <Td maxW={'200px'}><Text _hover={{textColor: "blue"}} cursor={'pointer'} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`)}>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text></Td>
                <Td>{customer.customer_type_id === 1 ? <><Box><Text fontSize={'md'} textAlign={'center'} p={'2'} rounded={'full'} bg={'blue.500'} textColor={'white'} fontWeight={'light'}>Residential</Text></Box></>  : ""}
                    {customer.customer_type_id === 2 ? <><Box><Text textAlign={'center'} p={'2'} rounded={'full'} bg={'green.500'} textColor={'white'} fontWeight={'light'}>Commercial</Text></Box></> : ""}
                    {customer.customer_type_id === 3 ? <><Box><Text textAlign={'center'} p={'2'} rounded={'full'} bg={'yellow.500'} textColor={'white'} fontWeight={'light'}>Other</Text></Box></>   : ""}
                    
                </Td>
                <Td><Link to={`/editcustomer/${customer.id}`}><Button ml={'1rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Link></Td>
            </Tr>
        )) : <><Td></Td><Td></Td><Td display={'flex'} justifyContent='center'><Spinner margin='1rem'/></Td> </>}
    </>
  )
}

export default Customer