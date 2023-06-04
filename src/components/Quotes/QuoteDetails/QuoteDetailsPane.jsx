import React from 'react';
import {
  Flex,
  Card,
  CardBody,
  Box,
  Text,
  Skeleton,
  Textarea,
  Badge,
  Button,
  Avatar,
  useColorModeValue
} from '@chakra-ui/react';
import { formatDate } from '../../../utils';
import {
  AlignLeft,
  Radio,
  Briefcase,
  Calendar,
  CalendarCheck,
  UserSquare,
  StickyNote,
  Ruler
} from 'lucide-react';
import { Link } from 'react-router-dom';

const QuoteDetailsPane = (props) => {
  const { quoteById, paymentCardBgColor, secondaryTextColor } = props;
  return (
    <>
      <Card
        w={'full'}
        size={'sm'}
        rounded={'lg'}
        shadow={'none'}
        border={'1px'}
        borderColor={useColorModeValue('gray.300', 'gray.700')}>
        <CardBody overflowY={'auto'}>
          {/* Invoice Extra Details */}
          <Box px={'1rem'} py={'8px'}>
            <Flex alignItems={'center'} gap={3} mb={'1rem'}>
              <AlignLeft size={'20px'} color="gray" />
              <Text fontSize={'xl'} fontWeight={'bold'} color={secondaryTextColor}>
                Details
              </Text>
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <Radio size={'15px'} />
              </Box>
              <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor} my={'auto'}>
                Status
              </Text>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <Badge
                  colorScheme={
                    quoteById?.quote_status?.name === 'Accepted'
                      ? 'green'
                      : quoteById?.quote_status?.name === 'Pending'
                      ? 'yellow'
                      : quoteById?.quote_status?.name === 'Rejected'
                      ? 'red'
                      : quoteById?.quote_status?.name === 'Draft'
                      ? 'gray'
                      : 'facebook'
                  }
                  variant={'subtle'}
                  mr={'1rem'}
                  pt={'2px'}
                  w={'80px'}
                  rounded={'xl'}
                  textAlign={'center'}>
                  {quoteById?.quote_status?.name}
                </Badge>
              )}
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <Briefcase size={'15px'} />
              </Box>
              <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor} my="auto">
                Service
              </Text>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <Text mr={'1rem'}>{quoteById?.services?.name}</Text>
              )}
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <Calendar size={'15px'} />
              </Box>
              <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                Quote Date
              </Text>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Text mr={'1rem'}>{quoteById?.quote_date}</Text>
                </>
              )}
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <CalendarCheck size={'15px'} />
              </Box>
              <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                Issue Date
              </Text>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Text mr={'1rem'}>
                    {!quoteById.issue_date ? 'Not issued yet... 🙅‍♂️' : formatDate(quote.issue_date)}
                  </Text>
                </>
              )}
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <UserSquare size={'15px'} />
              </Box>
              <Text w={'36%'} fontWeight={'semibold'} textColor={secondaryTextColor} my={'auto'}>
                Customer
              </Text>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Flex>
                    <Link to={`/customers/${quoteById?.customer?.id}`}>
                      <Button variant={'ghost'}>
                        <Avatar size={'xs'} />
                        <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>
                          {quoteById?.customer?.first_name} {quoteById?.customer?.last_name}
                        </Text>
                      </Button>
                    </Link>
                  </Flex>
                </>
              )}
            </Flex>
            <Box w="full" mb="2rem">
              <Flex mb={'1rem'} gap={2}>
                <Box my="auto">
                  <StickyNote size={'15px'} />
                </Box>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Internal Note
                </Text>
              </Flex>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
              ) : (
                <>
                  <Box bg={paymentCardBgColor} p="2" rounded="xl">
                    <Textarea
                      border="none"
                      h={'100px'}
                      isReadOnly
                      value={
                        !quoteById?.private_note
                          ? 'No note for this quote... 🙅‍♂️'
                          : quoteById?.private_note
                      }
                    />
                    {/* {!quoteById?.note ? '❌ No note for this invoice...' : <Text>{invoice.note}</Text>} */}
                  </Box>
                </>
              )}
            </Box>
            <Box w="full" mb={'2'}>
              <Flex mb={'1rem'} gap={2}>
                <Box my="auto">
                  <Ruler size={'15px'} />
                </Box>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Measurements
                </Text>
              </Flex>
              {!quoteById ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
              ) : (
                <>
                  <Box bg={paymentCardBgColor} p="2" rounded="xl">
                    <Textarea
                      border="none"
                      isReadOnly
                      value={
                        !quoteById?.measurement_note
                          ? 'No measurement information... 🙅‍♂️'
                          : quoteById?.measurement_note
                      }
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </CardBody>
      </Card>
    </>
  );
};

export default QuoteDetailsPane;
