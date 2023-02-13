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
import { FiFileText } from 'react-icons/fi';

const OverdueInvoicesStat = (props) => {
  const { overdueInvoicesCount } = props;
  return (
    <>
      <Card
        bg={useColorModeValue('white', 'gray.700')}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        rounded={'xl'}>
        {overdueInvoicesCount === 0 || overdueInvoicesCount ? (
          <>
            <CardBody>
              <Stat>
                <Icon as={FiFileText} boxSize={'6'} />
                {/* <StatLabel display={'flex'} fontWeight={'bold'}>
                  Invoices Overdue
                  <Flex bg={'red.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex>
                </StatLabel> */}
                <Flex direction={'column'} flexWrap={'flex-wrap'}>
                  <StatLabel color={'red.500'} fontWeight={'bold'}>
                    Overdue
                  </StatLabel>
                  <StatLabel fontWeight={'semibold'}>
                    Invoices
                    {/* <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex> */}
                  </StatLabel>
                </Flex>
                <StatNumber>
                  {overdueInvoicesCount ? (
                    overdueInvoicesCount
                  ) : overdueInvoicesCount === 0 ? (
                    overdueInvoicesCount
                  ) : (
                    <Spinner speed="0.60s" />
                  )}
                </StatNumber>
                {/* <StatHelpText>
                    <StatArrow type='increase' color={'red.500'} />
                    1%
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

export default OverdueInvoicesStat;
