import React from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  VStack,
  HStack,
  Image,
  StackDivider,
  Spinner,
  Tooltip,
  Badge,
  Avatar,
  Card,
  CardBody,
  Flex,
  Divider,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import {
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdOutlineDateRange,
  MdEdit,
  MdDelete
} from 'react-icons/md';
import { FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';

const CustomerDetailsCard = (props) => {
  const { customer, onOpen, deleteCustomer, customerDate, bg, borderColor } = props;

  return (
    <>
      {/* Customer Card Info */}
      <Flex w={{ base: 'full', lg: '60%' }} justify={'center'}>
        <Card w="full" rounded={'xl'} py={'1rem'}>
          <CardBody>
            <Flex direction={'column'}>
              {/* Customer Header Section */}
              <Avatar
                name={`${customer?.first_name} ${customer?.last_name}`}
                bg={useColorModeValue('gray.200', 'gray.500')}
                textColor={useColorModeValue('gray.700', 'gray.200')}
                size={'2xl'}
                mx={'auto'}
                mb={'1rem'}
              />
              <Text fontSize={'2xl'} fontWeight={'bold'} mx={'auto'}>
                {customer?.first_name} {customer?.last_name}
              </Text>
              <Text
                mx={'auto'}
                fontWeight={'semibold'}
                fontSize={'md'}
                textColor={useColorModeValue('gray.500', 'gray.400')}>
                {customer?.city}, {customer?.state}
              </Text>
              <Badge
                p={'2'}
                rounded={'xl'}
                mx={'auto'}
                mt={'1rem'}
                colorScheme={
                  customer?.customer_type.name === 'Residential'
                    ? 'blue'
                    : customer?.customer_type.name === 'Commercial'
                    ? 'green'
                    : customer?.customer_type.name === 'Other'
                    ? 'yellow'
                    : 'gray'
                }>
                {customer?.customer_type.name}
              </Badge>
              <Stack direction={'row'} mx={'auto'} my={'2rem'} gap={2}>
                <Tooltip label={'Edit'}>
                  <IconButton
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onOpen}
                    icon={<MdEdit />}
                  />
                </Tooltip>
                <Tooltip label={'Delete'}>
                  <IconButton
                    _hover={{ bg: 'red.500', color: 'white' }}
                    onClick={deleteCustomer}
                    icon={<MdDelete />}
                  />
                </Tooltip>
              </Stack>
              <Divider w={'full'} mb={'2rem'} />
              {/* Customer Body Info */}
              <Box px={'1rem'} mx={'auto'}>
                <Flex gap={4} mb={'2'} flexDir={{ base: 'column', md: 'row' }}>
                  <Flex gap={'4'} justify={'center'}>
                    <Box my={'auto'}>
                      <FiMail />
                    </Box>
                    <Text
                      w={'100px'}
                      fontWeight={'semibold'}
                      textColor={useColorModeValue('gray.500', 'gray.400')}
                      fontSize={'md'}>
                      Email
                    </Text>
                  </Flex>
                  <Text textAlign={{ base: 'center', md: '' }}>{customer?.email}</Text>
                </Flex>
                <Flex gap={4} mb={'2'} flexDir={{ base: 'column', md: 'row' }}>
                  <Flex gap={4} justify={'center'}>
                    <Box my={'auto'}>
                      <FiPhone />
                    </Box>
                    <Text
                      w={'100px'}
                      fontWeight={'semibold'}
                      textColor={useColorModeValue('gray.500', 'gray.400')}
                      fontSize={'md'}>
                      Phone
                    </Text>
                  </Flex>
                  <Text textAlign={{ base: 'center', md: '' }}>{customer?.phone_number}</Text>
                </Flex>
                <Flex gap={4} mb={'2'} flexDir={{ base: 'column', md: 'row' }}>
                  <Flex gap={4} justify={'center'}>
                    <Box my={'auto'}>
                      <FiMapPin />
                    </Box>
                    <Text
                      w={'100px'}
                      fontWeight={'semibold'}
                      textColor={useColorModeValue('gray.500', 'gray.400')}
                      fontSize={'md'}>
                      Address
                    </Text>
                  </Flex>
                  <Text
                    textAlign={{ base: 'center', md: '' }}
                    _hover={{ textColor: 'blue.500', cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${customer?.street_address}+${customer?.city}+${customer?.state}+${customer?.zipcode}`
                      )
                    }>
                    {customer?.street_address} {customer?.city}, {customer?.state}{' '}
                    {customer?.zipcode}
                  </Text>
                </Flex>
                <Flex gap={4} mb={'2'} flexDir={{ base: 'column', md: 'row' }}>
                  <Flex gap={'4'} justify={'center'}>
                    <Box my={'auto'}>
                      <FiCalendar />
                    </Box>
                    <Text
                      w={'100px'}
                      fontWeight={'semibold'}
                      textColor={useColorModeValue('gray.500', 'gray.400')}
                      fontSize={'md'}>
                      Registered
                    </Text>
                  </Flex>
                  <Text textAlign={{ base: 'center', md: '' }}>{customerDate}</Text>
                </Flex>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default CustomerDetailsCard;
