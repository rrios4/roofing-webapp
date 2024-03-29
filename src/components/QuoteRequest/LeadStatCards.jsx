import React from 'react';
import { Flex, useColorModeValue, Text, Box } from '@chakra-ui/react';
import { Archive, CalendarCheck, CheckCircle, ChevronUp, CircleDot, Inbox } from 'lucide-react';
import {
  useFetchTotalClosedLeads,
  useFetchTotalNewLeads,
  useFetchTotalScheduledLeads
} from '../../hooks/useAPI/useReports';

const LeadStatCards = () => {
  const { data: totalNewLeads } = useFetchTotalNewLeads();
  const { data: totalScheduledLeads } = useFetchTotalScheduledLeads();
  const { data: totalClosedLeads } = useFetchTotalClosedLeads();
  return (
    <>
      <Flex w="full" gap={4} flexDir={{ base: 'column', md: 'row' }}>
        <Flex
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          shadow={'xs'}
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>New</Text>
            {/* <MinusCircle size={'20px'} color="red" /> */}
            <Inbox size={'20px'} />
            {/* <Users size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalNewLeads}
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
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          shadow={'xs'}
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>Scheduled</Text>
            {/* <CircleDot size={'20px'} color="orange" /> */}
            <CalendarCheck size={'20px'} />
            {/* <Store size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalScheduledLeads}
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
          w={{ base: 'full', md: '35%' }}
          flexDir={'column'}
          border="1px"
          p="6"
          shadow={'xs'}
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded={'lg'}>
          <Flex w={'full'} justify={'space-between'}>
            <Text fontWeight={'500'}>Closed</Text>
            <Archive size={'20px'} />
            {/* <CheckCircle size={'20px'} color="green" /> */}
            {/* <Building size={'20px'} /> */}
            {/* <MoreVertical size={'20px'} /> */}
          </Flex>
          <Flex mt={'2'}>
            <Text fontSize={'36px'} fontWeight={'600'} w={'60%'}>
              {totalClosedLeads}
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
      </Flex>
    </>
  );
};

export default LeadStatCards;
