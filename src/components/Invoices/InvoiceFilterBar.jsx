import React from 'react';
import {
  Box,
  Flex,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  useColorModeValue,
  Select
} from '@chakra-ui/react';
import { Search } from 'lucide-react';

const InvoiceFilterBar = () => {
  return (
    <>
      <Box w={'full'}>
        <Flex
          w={'full'}
          gap={4}
          bg={useColorModeValue('gray.50', 'gray.800')}
          border={'1px'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          px={'1rem'}
          py={'6'}
          rounded={'lg'}
          flexDir={{ base: 'column', md: 'row' }}>
          <Box w={{ base: 'full', md: '40%' }}>
            <Text fontSize={'14px'} fontWeight={500} mb={'2'}>
              Search for Invoice
            </Text>
            <InputGroup>
              <InputLeftElement>
                <Search size={'20px'} color="gray" />
              </InputLeftElement>
              <Input
                type={'search'}
                placeholder="Search"
                bg={useColorModeValue('white', 'gray.800')}
              />
            </InputGroup>
          </Box>
          <Box w={{ base: 'full', md: '20%' }}>
            <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
              Status
            </Text>
            <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
              <option>Accepted</option>
            </Select>
          </Box>
          <Box w={{ base: 'full', md: '20%' }}>
            <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
              Service Type
            </Text>
            <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
              <option>All</option>
            </Select>
          </Box>
          <Box w={{ base: 'full', md: '20%' }}>
            <Text fontSize={'14px'} fontWeight={500} placeholder="Select country" mb={'2'}>
              Customer
            </Text>
            <Select fontWeight={500} bg={useColorModeValue('white', 'gray.800')}>
              <option>All</option>
            </Select>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default InvoiceFilterBar;
