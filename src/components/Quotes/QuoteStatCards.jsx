import React from 'react';
import { Flex, useColorModeValue, Text, Box } from '@chakra-ui/react';
import { CheckCircle, ChevronUp, CircleDot, MinusCircle } from 'lucide-react';
import {
  useFetchTotalAcceptedQuotes,
  useFetchTotalPendingQuotes,
  useFetchTotalRejectedQuotes
} from '../../hooks/useAPI/useReports';

const QuoteStatCards = () => {
  const { data: totalAcceptedQuotes } = useFetchTotalAcceptedQuotes();
  const { data: totalPendingQuotes } = useFetchTotalPendingQuotes();
  const { data: totalRejectedQuotes } = useFetchTotalRejectedQuotes();
  return (
    <>
      <Flex w="full" gap={4} flexDir={{ base: 'column', md: 'row' }}>
        <Flex
          shadow={'xs'}
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>Accepted</Text>
            <CheckCircle size={'20px'} />
            {/* <Building size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalAcceptedQuotes}
            </Text>
            <Flex w={'40%'} justify={'flex-end'}>
              <Box
                mb={'1'}
                w="80px"
                height={'34px'}
                border={'2px'}
                borderColor={'green.500'}
                mt={'auto'}
                rounded={'full'}>
                <Flex w={'full'} h={'full'} justify={'center'} gap={2}>
                  <Flex flexDir={'column'} justify={'center'}>
                    <ChevronUp size={'15px'} color="green" />
                  </Flex>
                  <Text fontSize={'14px'} fontWeight={'500'} my={'auto'} textColor={'green.500'}>
                    0%
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          shadow={'xs'}
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>Pending</Text>
            <CircleDot size={'20px'} />
            {/* <Store size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalPendingQuotes}
            </Text>
            <Flex w={'40%'} justify={'flex-end'}>
              <Box
                mb={'1'}
                w="80px"
                height={'34px'}
                border={'2px'}
                borderColor={'green.500'}
                mt={'auto'}
                rounded={'full'}>
                <Flex w={'full'} h={'full'} justify={'center'} gap={1}>
                  <Flex flexDir={'column'} justify={'center'}>
                    <ChevronUp size={'20px'} color="green" />
                  </Flex>
                  <Text fontSize={'14px'} fontWeight={'500'} my={'auto'} textColor={'green.500'}>
                    0%
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          shadow={'xs'}
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>Rejected</Text>
            <MinusCircle size={'20px'} />
            {/* <Users size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalRejectedQuotes}
            </Text>
            <Flex w={'40%'} justify={'flex-end'}>
              <Box
                mb={'1'}
                w="80px"
                height={'34px'}
                border={'2px'}
                borderColor={'green.500'}
                mt={'auto'}
                rounded={'full'}>
                <Flex w={'full'} h={'full'} justify={'center'} gap={1}>
                  <Flex flexDir={'column'} justify={'center'}>
                    <ChevronUp size={'20px'} color="green" />
                  </Flex>
                  <Text fontSize={'14px'} fontWeight={'500'} my={'auto'} textColor={'green.500'}>
                    0%
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default QuoteStatCards;
