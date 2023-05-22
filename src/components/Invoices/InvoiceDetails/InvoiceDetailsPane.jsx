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
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { formatDate, formatMoneyValue } from '../../../utils';
import {
  AlignLeft,
  Radio,
  Briefcase,
  Calendar,
  CalendarCheck,
  UserSquare,
  StickyNote,
  Ruler,
  CreditCard,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceDetailsPane = (props) => {
  const {
    invoice,
    secondaryTextColor,
    paymentCardBgColor,
    handlePaymentDelete,
    loadingState,
    editSwitchIsOn
  } = props;
  return (
    <>
      <Card w={'full'} rounded={'xl'} size="lg">
        <CardBody overflowY={'auto'}>
          {/* Invoice Extra Details */}
          <Box>
            <Flex alignItems={'center'} gap={3} mb={'1rem'}>
              <AlignLeft size={'20px'} color="gray" />
              <Text fontSize={'xl'} fontWeight={'semibold'} color={secondaryTextColor}>
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
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <Badge
                  colorScheme={
                    invoice?.invoice_status.name === 'Paid'
                      ? 'green'
                      : invoice?.invoice_status.name === 'Pending'
                      ? 'yellow'
                      : invoice?.invoice_status.name === 'Overdue'
                      ? 'red'
                      : invoice?.invoice_status.name === 'Draft'
                      ? 'gray'
                      : 'facebook'
                  }
                  variant={'subtle'}
                  mr={'1rem'}
                  pt={'2px'}
                  w={'80px'}
                  rounded={'xl'}
                  textAlign={'center'}>
                  {invoice?.invoice_status.name}
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
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <Text mr={'1rem'}>{invoice?.service_type.name}</Text>
              )}
            </Flex>
            <Flex mb={'1rem'} gap="2">
              <Box my="auto">
                <Calendar size={'15px'} />
              </Box>
              <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                Invoice Date
              </Text>
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Text mr={'1rem'}>{formatDate(invoice?.invoice_date)}</Text>
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
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Text mr={'1rem'}>
                    {!invoice?.issue_date
                      ? 'Not Issued yet... 🙅‍♂️'
                      : formatDate(invoice?.issue_date)}
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
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
              ) : (
                <>
                  <Flex>
                    <Link to={`/customers/${invoice?.customer.id}`}>
                      <Button variant={'ghost'}>
                        <Avatar size={'xs'} />
                        <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>
                          {invoice?.customer.first_name} {invoice?.customer.last_name}
                        </Text>
                      </Button>
                    </Link>
                  </Flex>
                </>
              )}
            </Flex>
            <Box w="full">
              <Flex my={'1rem'} gap={2}>
                <Box my="auto">
                  <CreditCard size={'15px'} />
                </Box>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Payments
                </Text>
              </Flex>
              <Flex w="full" px={6} mb={6} gap="4">
                <Flex direction="column" gap="2" w="full">
                  {invoice?.invoice_payment?.map((item, index) => (
                    <>
                      <Flex
                        key={index}
                        gap="6"
                        bg={useColorModeValue('gray.100', 'gray.600')}
                        py="2"
                        px="6"
                        rounded="xl"
                        w="full">
                        <Box w="5%" my="auto">
                          <Box h="10px" w="10px" bg="green.300" rounded="full"></Box>
                        </Box>
                        <Flex gap="6">
                          <Text
                            w="60%"
                            fontWeight={'semibold'}
                            my="auto"
                            textColor={secondaryTextColor}>
                            {formatDate(item.date_received)}
                          </Text>
                          <Text w="full" my="auto" textAlign="center">
                            {item.payment_method}
                          </Text>
                        </Flex>
                        <Box ml="auto" my="auto">
                          <Text ml="2rem">${formatMoneyValue(item.amount)}</Text>
                        </Box>
                        {editSwitchIsOn === true ? (
                          <>
                            <Box>
                              <IconButton
                                onClick={() =>
                                  handlePaymentDelete(item.id, item.date_received, item.amount)
                                }
                                icon={<X size="15px" />}
                                isLoading={loadingState}
                              />
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </>
                  ))}
                </Flex>
              </Flex>
            </Box>
            <Box w="full" mb="2rem">
              <Flex mb={'1rem'} gap={2}>
                <Box my="auto">
                  <StickyNote size={'15px'} />
                </Box>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Note
                </Text>
              </Flex>
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
              ) : (
                <>
                  <Box px={6}>
                    <Box bg={paymentCardBgColor} p="2" rounded="xl">
                      <Textarea
                        border="none"
                        isReadOnly
                        value={!invoice?.note ? 'No note for this invoice... 🙅‍♂️' : invoice?.note}
                      />
                      {/* {!invoice?.note ? '❌ No note for this invoice...' : <Text>{invoice.note}</Text>} */}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
            <Box w="full">
              <Flex mb={'1rem'} gap={2}>
                <Box my="auto">
                  <Ruler size={'15px'} />
                </Box>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Measurements
                </Text>
              </Flex>
              {!invoice ? (
                <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
              ) : (
                <>
                  <Box px="6">
                    <Box bg={paymentCardBgColor} p="2" rounded="xl">
                      <Textarea
                        border="none"
                        isReadOnly
                        value={
                          !invoice?.sqft_measurement
                            ? 'No measurement information... 🙅‍♂️'
                            : invoice?.sqft_measurement
                        }
                      />
                    </Box>
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

export default InvoiceDetailsPane;
