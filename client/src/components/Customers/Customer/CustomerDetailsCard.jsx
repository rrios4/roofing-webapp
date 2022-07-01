import React from 'react'
import Card from '../../Card/index'
import { Box, Button, Text, Stack, VStack, HStack, Image, StackDivider, Spinner} from '@chakra-ui/react';
import {  MdLocationOn, MdEmail, MdPhone, MdOutlineDateRange } from 'react-icons/md'

const CustomerDetailsCard = (props) => {
    const {customer, onOpen, deleteCustomer, customerDate, bg, borderColor} = props

  return (
    <>
    {/* Customer Card Info */}
    <Card width={'70%'} bg={bg} borderColor={borderColor}>
        <HStack divider={<StackDivider borderColor='gray.200' />}>
            <Box mr={'1rem'}>
                <Box rounded={'full'} w={'120px'} bg='gray.500' h={'120px'}><Image rounded={'full'} src='https://i.pinimg.com/originals/0b/3d/f1/0b3df19a63dfe264cfd984f6864a77b3.jpg'/></Box>
            </Box>
            <Stack marginLeft={'1rem'}>
                <HStack>
                    <Text marginRight={'1rem'} fontSize={'2xl'} fontWeight='semibold' ml={'4px'}>{customer.first_name} {customer.last_name}</Text>
                    {customer.customer_type_id === 1 ? <><Box><Text fontSize={'xs'} textAlign={'center'} p={'1'} rounded={'full'} bg={'blue.500'} textColor={'white'} fontWeight={'medium'}>Residential</Text></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 2 ? <><Box><Text fontSize={'xs'} textAlign={'center'} p={'1'} rounded={'full'} bg={'green.500'} textColor={'white'} fontWeight={'medium'}>Commercial</Text></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 3 ? <><Box><Text fontSize={'xs'} textAlign={'center'} p={'1'} rounded={'full'} bg={'yellow.500'} textColor={'white'} fontWeight={'medium'}>Other</Text></Box></>  : <><Text></Text></>}
                </HStack>
                <VStack align='flex-start' pl={'1rem'}>
                    <HStack>
                        <MdEmail/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.email}</Text>
                    </HStack>
                    <HStack>
                        <MdPhone/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.phone_number}</Text>
                    </HStack>
                    <HStack>
                        <MdLocationOn/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text>
                    </HStack>
                </VStack>  
            </Stack>
        </HStack>
        <HStack spacing={'auto'} marginTop={'1rem'}>
            <Stack direction={'row'} justifyContent='center' justifyItems={'center'} marginLeft={'6px'}>
                <MdOutlineDateRange size={'18px'}/>
                <Text fontSize={'sm'}>{customerDate}</Text>
            </Stack>
            <Box marginRight={'1rem'}>
                <Button onClick={onOpen} marginRight={'1rem'}>Edit</Button>
                <Button onClick={deleteCustomer}>Delete</Button>
            </Box>    
        </HStack>  
    </Card>
    </>
  )
}

export default CustomerDetailsCard