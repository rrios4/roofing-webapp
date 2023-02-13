import React from 'react';
import {
  Card,
  Stat,
  Icon,
  StatLabel,
  Flex,
  StatNumber,
  Spinner,
  Skeleton,
  useColorModeValue,
  CardBody
} from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';

const TotalCustomersStat = (props) => {
  const { totalCustomersCount } = props;
  return (
    <>
      <Card
        bg={useColorModeValue('white', 'gray.700')}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        rounded={'xl'}>
        {totalCustomersCount === 0 || totalCustomersCount ? (
          <>
            <CardBody>
              <Stat>
                <Icon as={FiUsers} boxSize={'6'} />
                {/* <StatLabel display={'flex'} fontWeight={'bold'}>
                  Total Customers
                  <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex>
                </StatLabel> */}
                <Flex direction={'column'} flexWrap={'flex-wrap'}>
                  <StatLabel fontWeight={'bold'} color={'blue.500'}>Total</StatLabel>
                  <StatLabel fontWeight={'semibold'}>
                    Customers
                    {/* <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex> */}
                  </StatLabel>
                </Flex>
                <StatNumber>
                  {totalCustomersCount ? (
                    totalCustomersCount
                  ) : totalCustomersCount === 0 ? (
                    totalCustomersCount
                  ) : (
                    <Spinner speed="0.60s" />
                  )}
                </StatNumber>
                {/* <StatHelpText>
                    <StatArrow type='increase' />
                    32%
                </StatHelpText> */}
              </Stat>
            </CardBody>
          </>
        ) : (
          <CardBody>
            <Skeleton height={'90px'} rounded={'md'} />
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default TotalCustomersStat;
