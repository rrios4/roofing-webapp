import React from 'react';
import { Flex, Box, Text, Button, Divider, useColorModeValue } from '@chakra-ui/react';
import { Plus, PlusCircle } from 'lucide-react';

const PageHeader = (props) => {
  const { title, subheading, addItemButtonText, onOpen } = props;
  return (
    <>
      <Flex w={'full'} flexDir={'column'} gap={4}>
        <Flex
          w={'full'}
          justifyContent={'space-between'}
          mt={{ base: '2rem', md: '1rem' }}
          flexDir={{ base: 'column', md: 'row' }}
          gap={4}>
          <Box>
            <Text fontSize={{ base: '24px', md: '30px' }} fontWeight={'bold'}>
              {title}
            </Text>
            <Text fontSize={'16px'} fontWeight={400}>
              {subheading}
            </Text>
          </Box>
          <Box>
            <Button colorScheme="blue" gap={'3'} fontSize={'14px'} onClick={onOpen}>
              <PlusCircle size={'20px'} />
              {/* <Plus size={'15px'} /> */}
              {addItemButtonText}
            </Button>
          </Box>
        </Flex>
        <Box w={'full'}>
          <Divider
            mt={'2'}
            orientation="horizontal"
            borderColor={useColorModeValue('gray.400', 'gray.600')}
          />
        </Box>
      </Flex>
    </>
  );
};

export default PageHeader;
