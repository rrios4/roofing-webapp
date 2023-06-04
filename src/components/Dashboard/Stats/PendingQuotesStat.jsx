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
import { TbRuler } from 'react-icons/tb';

const PendingQuotesStat = (props) => {
  const { pendingQuotesCount } = props;
  return (
    <>
      <Card
        size="md"
        rounded={'lg'}
        shadow={'xs'}
        border={'1px'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        {pendingQuotesCount === 0 || pendingQuotesCount ? (
          <>
            <CardBody>
              <Stat>
                <Icon as={TbRuler} boxSize={'6'} />
                {/* <StatLabel display={'flex'} fontWeight={'bold'}>
                  Pending Quotes
                  <Flex bg={'yellow.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex>
                </StatLabel> */}
                <Flex direction={'column'} flexWrap={'flex-wrap'}>
                  <StatLabel color={'yellow.500'} fontWeight={'bold'}>
                    Pending
                  </StatLabel>
                  <StatLabel fontWeight={'semibold'}>
                    Quotes
                    {/* <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex> */}
                  </StatLabel>
                </Flex>
                <StatNumber>
                  {pendingQuotesCount ? (
                    pendingQuotesCount
                  ) : pendingQuotesCount === 0 ? (
                    pendingQuotesCount
                  ) : (
                    <Spinner speed="0.60s" />
                  )}
                </StatNumber>
                {/* <StatHelpText>
                    <StatArrow type='increase' />
                    8%
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

export default PendingQuotesStat;
