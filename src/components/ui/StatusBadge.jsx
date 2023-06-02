import React from 'react';
import { Badge, Flex, Box, Text } from '@chakra-ui/react';

const StatusBadge = ({ badgeText, colorScheme }) => {
  return (
    <>
      <Badge rounded={'full'} py={1} px={2} colorScheme={colorScheme}>
        <Flex gap={2}>
          <Box w={1} h={1} p={1} bg={`${colorScheme}.500`} rounded={'full'} my={'auto'}></Box>
          <Text textTransform={'initial'} fontSize={'12px'} fontWeight={500}>
            {badgeText}
          </Text>
        </Flex>
      </Badge>
    </>
  );
};

export default StatusBadge;
