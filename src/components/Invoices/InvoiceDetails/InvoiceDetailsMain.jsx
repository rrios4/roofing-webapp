import React from 'react';
import {
  Flex,
  Card,
  CardBody,
  Tooltip,
  Button,
  Image,
  Box,
  Text,
  Skeleton,
  Divider,
  TableContainer,
  Th,
  Td,
  Tbody,
  Table,
  Tr,
  Thead,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { formatNumber, formatDate, formatMoneyValue } from '../../../utils';
import { X } from 'lucide-react';
import { FiPaperclip, FiUploadCloud } from 'react-icons/fi';

const InvoiceDetailsMain = (props) => {
  const {
    invoice,
    paymentCardBgColor,
    editSwitchIsOn,
    handleLineItemDelete,
    bgColorMode,
    secondaryTextColor
  } = props;
  return (
    <>
      {/* Left Section */}
      <Flex w={{ base: 'full', lg: '60%' }}>
        <Card
          w={'full'}
          rounded={'lg'}
          shadow={'none'}
          border={'1px'}
          borderColor={useColorModeValue('gray.300', 'gray.700')}>
          <CardBody>
            {/* Header with Buttons */}
            <Flex justifyContent={'flex-end'} pr={'1rem'}>
              <Tooltip hasArrow label="Upload images">
                <Button variant={'outline'} roundedRight={'none'}>
                  <FiUploadCloud />
                </Button>
              </Tooltip>
              <Tooltip hasArrow label="Upload documents">
                <Button variant={'outline'} roundedLeft={'none'}>
                  <FiPaperclip />
                </Button>
              </Tooltip>
            </Flex>
            <Flex px={'2rem'} pb="3rem">
              <Image src="/LogoRR.png" maxW={'70px'} p={'1'} bg={'blue.500'} rounded={'2xl'} />
              <Box ml={'2rem'}>
                <Text fontWeight={'semibold'} fontSize={'3xl'} letterSpacing={'0px'}>
                  Invoice{' '}
                  <Text as={'span'} color={'blue.400'}>
                    #
                  </Text>{' '}
                  {formatNumber(invoice?.invoice_number)}
                </Text>
                <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>
                  Due {formatDate(invoice?.due_date)}
                </Text>
              </Box>
            </Flex>
            <Box px={'2rem'} mb={'3rem'}>
              <Flex mb={'1rem'}>
                <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                  To
                </Text>
                {!invoice ? (
                  <Skeleton
                    bg={paymentCardBgColor}
                    height={'100px'}
                    w={'250px'}
                    rounded={'xl'}
                    mx={'1rem'}
                  />
                ) : (
                  <>
                    {invoice?.bill_to === true ? (
                      <>
                        <Box>
                          <Text ml={'3rem'} fontWeight={'semibold'}>
                            {invoice?.customer.first_name} {invoice?.customer.last_name}
                          </Text>
                          <Box
                            _hover={{ cursor: 'pointer', color: 'blue.500' }}
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${invoice.bill_to_street_address}+${invoice?.bill_to_city}+${invoice?.bill_to_state}+${invoice?.bill_to_zipcode}`
                              )
                            }>
                            <Text ml={'3rem'}>{invoice?.bill_to_street_address}</Text>
                            <Text ml={'3rem'}>
                              {invoice?.bill_to_city}, {invoice?.bill_to_state}{' '}
                              {invoice?.bill_to_zipcode}
                            </Text>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {invoice?.customer.email}
                            </Text>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box>
                          <Text ml={'3rem'} fontWeight={'semibold'}>
                            {invoice?.customer.first_name} {invoice?.customer.last_name}
                          </Text>
                          <Box
                            _hover={{ cursor: 'pointer', color: 'blue.500' }}
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${invoice.customer.street_address}+${invoice?.customer.city}+${invoice?.customer.state}+${invoice?.customer.zipcode}`
                              )
                            }>
                            <Box>
                              <Text ml={'3rem'}>{invoice?.customer.street_address}</Text>
                              <Text ml={'3rem'}>
                                {invoice?.customer.city}, {invoice?.customer.state}{' '}
                                {invoice?.customer.zipcode}
                              </Text>
                            </Box>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {invoice?.customer.email}
                            </Text>
                          </Box>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Flex>
              <Flex mb={'1rem'}>
                <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                  From
                </Text>
                {!invoice ? (
                  <Skeleton
                    bg={paymentCardBgColor}
                    height={'100px'}
                    w={'250px'}
                    rounded={'xl'}
                    mx={'1rem'}
                  />
                ) : (
                  <>
                    <Box>
                      <Text ml={'3rem'} fontWeight={'semibold'}>
                        Rios Roofing
                      </Text>
                      <Text ml={'3rem'}>150 Tallant St</Text>
                      <Text ml={'3rem'}>Houston, TX 77076</Text>
                      <Text ml={'3rem'} color={'blue.400'}>
                        rrios.roofing@gmail.com
                      </Text>
                    </Box>
                  </>
                )}
              </Flex>
              <Flex>
                <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                  Notes
                </Text>
                {!invoice ? (
                  <Skeleton
                    bg={paymentCardBgColor}
                    height={'20px'}
                    w={'250px'}
                    rounded={'xl'}
                    mx={'1rem'}
                  />
                ) : (
                  <>
                    <Text ml={'3rem'}>{invoice?.cust_note}</Text>
                  </>
                )}
              </Flex>
            </Box>
            <Divider w={'95%'} mx={'auto'} />
            {/* Line Item Table */}
            <Box px={'2rem'} py={'2rem'}>
              <TableContainer rounded={'xl'}>
                {!invoice ? (
                  <Skeleton bg={paymentCardBgColor} height={'100px'} w={'full'} rounded={'xl'} />
                ) : (
                  <>
                    <Table variant={'simple'}>
                      <Thead bg={bgColorMode} rounded={'xl'}>
                        <Tr>
                          <Th>Description</Th>
                          <Th>Qty</Th>
                          <Th>Rate</Th>
                          <Th>Amount</Th>
                          {editSwitchIsOn === true ? <Th></Th> : <></>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {/* Table Row Data Component */}
                        {invoice?.invoice_line_service?.map((item, index) => (
                          <Tr key={index}>
                            <Td whiteSpace="normal" height="auto" blockSize="auto">
                              {item.description}
                            </Td>
                            <Td>{item.qty}</Td>
                            <Td>{item.item_rate === true ? item.rate : 'Fixed'}</Td>
                            <Td>${formatMoneyValue(item.amount)}</Td>
                            {editSwitchIsOn === true ? (
                              <Td>
                                <IconButton
                                  icon={<X size={'15px'} />}
                                  onClick={() =>
                                    handleLineItemDelete(item.id, item.description, item.amount)
                                  }
                                />
                              </Td>
                            ) : (
                              <></>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </>
                )}
              </TableContainer>
            </Box>

            <Box px={'4rem'} pb="0rem">
              <Flex mb={'0rem'} mx={8} py={2}>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Subtotal
                </Text>
                <Text ml={'auto'} mr={'1rem'}>
                  ${formatMoneyValue(invoice?.total)}
                </Text>
              </Flex>
              <Flex mb={'1rem'} mx={8} py={2}>
                <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                  Total
                </Text>
                <Text ml={'auto'} mr={'1rem'}>
                  ${formatMoneyValue(invoice?.total)}
                </Text>
              </Flex>
              <Flex my={'3rem'} bg={'blue.500'} color={'white'} px={4} py={4} rounded={'xl'}>
                <Text fontWeight={'bold'} fontSize={'xl'}>
                  Amount Due
                </Text>
                <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'}>
                  ${formatMoneyValue(invoice?.amount_due)}
                </Text>
              </Flex>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default InvoiceDetailsMain;
