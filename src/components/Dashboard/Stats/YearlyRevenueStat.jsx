import React from 'react';
import {
  Card,
  Stat,
  Icon,
  StatLabel,
  Flex,
  StatNumber,
  Skeleton,
  useColorModeValue,
  StatHelpText,
  StatArrow,
  CardBody
} from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';
import formatMoneyValue from '../../../utils/formatMoneyValue';

const YearlyRevenueStat = (props) => {
  const { currentYearTotalRevenueWithPercentageChange, currentYear } = props;
  return (
    <>
      <Card
        w={'full'}
        size="md"
        rounded={'lg'}
        shadow={'xs'}
        border={'1px'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        {!currentYearTotalRevenueWithPercentageChange ? (
          <>
            <CardBody>
              <Skeleton height={'100px'} rounded={'md'} />
            </CardBody>
          </>
        ) : (
          <>
            <CardBody>
              <Stat>
                <Icon as={FiDollarSign} boxSize={'6'} />
                <StatLabel display={'flex'} fontWeight={'bold'}>
                  Total Revenue for {currentYear}
                  {/* <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex> */}
                </StatLabel>
                <StatNumber>
                  $
                  {formatMoneyValue(
                    currentYearTotalRevenueWithPercentageChange?.current_year_revenue
                  )}
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={
                      currentYearTotalRevenueWithPercentageChange?.percent_change >= 0
                        ? 'increase'
                        : 'decrease'
                    }
                  />
                  {currentYearTotalRevenueWithPercentageChange?.percent_change.toFixed(2)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </>
        )}
      </Card>
    </>
  );
};

export default YearlyRevenueStat;
