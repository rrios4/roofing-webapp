import React from 'react'
import { Box, Button, Text, Stack, VStack, HStack, Image, StackDivider, Spinner, Tooltip, Badge, Avatar, Card, CardBody} from '@chakra-ui/react';
import {  MdLocationOn, MdEmail, MdPhone, MdOutlineDateRange, MdEdit, MdDelete } from 'react-icons/md'
import { FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi'

const CustomerDetailsCard = (props) => {
    const {customer, onOpen, deleteCustomer, customerDate, bg, borderColor} = props

  return (
    <>
    {/* Customer Card Info */}
    <Card rounded={'xl'} minW={{base: '350px', md: '500', lg: '600px'}}>
        <CardBody padding={'2rem'}>
        <Stack divider={<StackDivider borderColor='gray.200' />} direction={{base: 'column', lg: 'row'}} justifyContent={'center'}>
            <Box mb={{base: '1rem', lg: '0rem'}} p={{base: '1rem', lg: '0rem'}} mx={{base:'auto', lg: '0'}} >
                <Box mx={'1rem'} rounded={'full'} w={'128px'} bg='gray.300' h={'128px'}><Avatar rounded={'full'} size={'2xl'} src='https://i.pinimg.com/originals/0b/3d/f1/0b3df19a63dfe264cfd984f6864a77b3.jpg'/></Box>
            </Box>
            <Stack marginLeft={{base: '0rem', lg: '1rem' }} margin={{base:'1'}}>
                <HStack>
                    <Text marginRight={'2px'} fontSize={'2xl'} fontWeight='bold' ml={'0px'}>{customer.first_name} {customer.last_name}</Text>
                    {customer.customer_type_id === 1 ? <><Box><Badge colorScheme={'blue'} variant='solid' rounded={'6'}>Residential</Badge></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 2 ? <><Box><Badge colorScheme={'green'} variant='solid' rounded={'6'}>Commercial</Badge></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 3 ? <><Box><Badge colorScheme={'yellow'} variant='solid' rounded={'6'}>Other</Badge></Box></>  : <><Text></Text></>}
                </HStack>
                <VStack align='flex-start' pl={'1rem'}>
                    <HStack>
                        <FiMail/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.email}</Text>
                    </HStack>
                    <HStack>
                        <FiPhone/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.phone_number}</Text>
                    </HStack>
                    <HStack>
                        <FiMapPin/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text>
                    </HStack>
                </VStack>  
            </Stack>
        </Stack>
        <Stack direction={{base:'row', lg: 'row'}}justifyContent={{base: 'space-between',lg: 'center'}} spacing={{base: '1rem',lg: '16rem'}} marginTop={'1rem'} >
            <Stack direction={'row'} marginLeft={'6px'} my={'auto'}>
                <FiCalendar size={'18px'}/>
                <Text fontSize={'sm'}>{customerDate}</Text>
            </Stack>
            <Stack direction={'row'} marginRight={'0rem'}>
                <Tooltip label={'Edit'}>
                    <Button _hover={{bg:'blue.400', color:'white',}} onClick={onOpen} marginRight={'1rem'}><MdEdit/></Button>
                </Tooltip>
                <Tooltip label={'Delete'}>
                    <Button _hover={{bg:'red.500', color:'white',}} onClick={deleteCustomer}><MdDelete/></Button>
                </Tooltip>
            </Stack>    
        </Stack>  

        </CardBody>
    </Card>
    {/* <Card width={'50%'} bg={bg} borderColor={borderColor}>
        <HStack divider={<StackDivider borderColor='gray.200' />}>
            <Box mr={'1rem'}>
                <Box rounded={'full'} w={'120px'} bg='gray.500' h={'120px'}><Avatar rounded={'full'} size={'2xl'} src='https://i.pinimg.com/originals/0b/3d/f1/0b3df19a63dfe264cfd984f6864a77b3.jpg'/></Box>
            </Box>
            <Stack marginLeft={'1rem'}>
                <HStack>
                    <Text marginRight={'2px'} fontSize={'2xl'} fontWeight='semibold' ml={'4px'}>{customer.first_name} {customer.last_name}</Text>
                    {customer.customer_type_id === 1 ? <><Box><Badge colorScheme={'blue'} variant='solid' rounded={'6'}>Residential</Badge></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 2 ? <><Box><Badge colorScheme={'green'} variant='solid' rounded={'6'}>Commercial</Badge></Box></>  : <><Text></Text></>}
                    {customer.customer_type_id === 3 ? <><Box><Badge colorScheme={'yellow'} variant='solid' rounded={'6'}>Other</Badge></Box></>  : <><Text></Text></>}
                </HStack>
                <VStack align='flex-start' pl={'1rem'}>
                    <HStack>
                        <FiMail/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.email}</Text>
                    </HStack>
                    <HStack>
                        <FiPhone/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.phone_number}</Text>
                    </HStack>
                    <HStack>
                        <FiMapPin/>
                        <Text fontSize={'sm'} fontWeight='light'>{customer.street_address} {customer.city}, {customer.state} {customer.zipcode}</Text>
                    </HStack>
                </VStack>  
            </Stack>
        </HStack>
        <HStack spacing={'auto'} marginTop={'1rem'} mr={'1rem'}>
            <Stack direction={'row'} justifyContent='center' justifyItems={'center'} marginLeft={'6px'}>
                <FiCalendar size={'18px'}/>
                <Text fontSize={'sm'}>{customerDate}</Text>
            </Stack>
            <Box marginRight={'0rem'}>
                <Tooltip label={'Edit'}>
                    <Button _hover={{bg:'blue.400', color:'white',}} onClick={onOpen} marginRight={'1rem'}><MdEdit/></Button>
                </Tooltip>
                <Tooltip label={'Delete'}>
                    <Button _hover={{bg:'red.500', color:'white',}} onClick={deleteCustomer}><MdDelete/></Button>
                </Tooltip>
            </Box>    
        </HStack>  
    </Card> */}
    </>
  )
}

export default CustomerDetailsCard