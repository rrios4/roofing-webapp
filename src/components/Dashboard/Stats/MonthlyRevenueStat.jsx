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
  CardBody,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { FiCreditCard } from 'react-icons/fi';
import formatMoneyValue from '../../../utils/formatMoneyValue';

const MonthlyRevenueStat = (props) => {
  const { currentMonthRevenuesWithPercentageChange, currentMonthAcronym, currentYear } = props;
  return (
    <>
      <Card
        size="md"
        rounded={'lg'}
        shadow={'none'}
        border={'1px'}
        borderColor={useColorModeValue('gray.200', 'gray.600')}>
        {!currentMonthRevenuesWithPercentageChange ? (
          <>
            <CardBody>
              <Skeleton height={'100px'} rounded={'md'} />
            </CardBody>
          </>
        ) : (
          <CardBody>
            <Stat>
              <Icon as={FiCreditCard} boxSize={'6'} />
              <StatLabel display={'flex'} fontWeight={'bold'}>
                {currentMonthAcronym} {currentYear} Revenue
                <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex>
              </StatLabel>
              <StatNumber>
                ${formatMoneyValue(currentMonthRevenuesWithPercentageChange?.monthly_revenue)}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    currentMonthRevenuesWithPercentageChange?.percentage_change >= 0
                      ? 'increase'
                      : 'decrease'
                  }
                />
                {currentMonthRevenuesWithPercentageChange?.percentage_change.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default MonthlyRevenueStat;
