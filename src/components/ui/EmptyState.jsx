import React from 'react';
import { Flex, Box, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { PlusCircle } from 'lucide-react';

const EmptyState = ({ emptyStateIcon, entity, activateModal }) => {
  return (
    <Flex
      w={'full'}
      justifyContent={'center'}
      bg={useColorModeValue('white', 'gray.700')}
      p={8}
      maxW={'600px'}
      shadow={'sm'}
      border={'1px'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      rounded={'lg'}>
      <Flex flexDir={'column'} gap={4}>
        <Box
          mx={'auto'}
          p={3}
          border={'1px'}
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          rounded={'lg'}
          w={'max'}>
          {emptyStateIcon}
        </Box>
        <Box>
          <Text fontWeight={'600'} fontSize={'18px'} textAlign={'center'}>
            No {entity}s found
          </Text>
          <Text fontSize={'14px'} fontWeight={400} mb={6}>
            Click on the button at at the bottom to add a new {entity}.
          </Text>
          <Flex justify={'center'} fontSize={'16px'}>
            <Button gap={2} colorScheme="blue" onClick={activateModal}>
              <Box>
                <PlusCircle size={'20px'} />
              </Box>
              <Text fontWeight={600} fontSize={'16px'}>
                Add {entity}
              </Text>
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default EmptyState;
