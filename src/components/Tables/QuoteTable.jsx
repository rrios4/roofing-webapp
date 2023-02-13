import React from 'react';
import { Link } from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Badge,
  Flex,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Skeleton
} from '@chakra-ui/react';
import formatNumber from '../../utils/formatNumber';
import { MdEdit, MdDelete, MdKeyboardArrowRight } from 'react-icons/md';

const QuoteTable = (props) => {
  const { data, handleDelete,  } = props
  return (
    <>
      <TableContainer overflow={'auto'}>
        {data ? (
          <>
            <Table variant={'simple'} size="sm">
              <TableCaption>Total of {data?.length} Quotes in our system ✌️</TableCaption>
              <Thead>
                <Tr>
                  <Th textAlign={'center'}>Quote#</Th>
                  <Th textAlign={'center'}>Status</Th>
                  <Th>Service Type</Th>
                  <Th>Date</Th>
                  <Th>Issue Date</Th>
                  <Th>Expiration</Th>
                  <Th>Customer</Th>
                  {/* <Th textAlign={'center'}>Customer Email</Th>
                                        <Th textAlign={'center'}>Customer Number</Th> */}
                  <Th>Total</Th>
                  {/* <Th>Amount Due</Th> */}
                  <Th textAlign={'center'}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((quote, index) => (
                  <Tr key={index}>
                    <Td textAlign={'center'}>
                      <Text fontWeight={'bold'} fontSize={'md'}>
                        {quote.quote_number ? formatNumber(quote.quote_number) : ''}
                      </Text>
                    </Td>
                    <Td textAlign={'center'}>
                      <Badge
                        w={'80px'}
                        variant={'subtle'}
                        mx={'auto'}
                        colorScheme={
                          quote.quote_status.name === 'New'
                            ? 'green'
                            : '' || quote.quote_status.name === 'Accepted'
                            ? 'green'
                            : '' || quote.quote_status.name === 'Pending'
                            ? 'yellow'
                            : '' || quote.quote_status.name === 'Rejected'
                            ? 'red'
                            : 'gray'
                        }
                        p="1"
                        rounded={'xl'}
                        align="center">
                        {quote.quote_status.name}
                      </Badge>
                    </Td>
                    {/* <Td textAlign={'center'}>{quote.quote_status.name === 'Sent'? <><Text color={'white'} mx={'auto'} bg={'yellow.500'} p='1' rounded={'xl'} align='center' w={'80px'}>Sent</Text></>: 'false'}</Td> */}
                    <Td>
                      <Text>{quote.services.name}</Text>
                    </Td>
                    <Td>
                      <Text>
                        {quote.quote_date ? new Date(quote?.quote_date).toLocaleDateString() : ''}
                      </Text>
                    </Td>
                    <Td textAlign={'center'}>
                      <Text>
                        {quote.issued_date ? new Date(quote.issued_date).toLocaleDateString() : ''}
                      </Text>
                    </Td>
                    <Td>
                      <Text>
                        {quote?.expiration_date
                          ? new Date(quote?.expiration_date).toLocaleDateString()
                          : ''}
                      </Text>
                    </Td>
                    <Td>
                      {quote?.customer?.first_name && quote?.customer?.last_name ? (
                        <>
                          <Flex>
                            <Link to={`/editcustomer/${quote.customer.id}`}>
                              <Button variant={'ghost'} colorScheme={'facebook'}>
                                <Avatar size={'xs'} mr={'8px'} my={'auto'} />
                                <Flex flexDir={'column'}>
                                  <Flex fontWeight={'bold'} fontSize={'xs'}>
                                    <Text marginRight={'4px'}>{quote?.customer?.first_name}</Text>
                                    <Text>{quote?.customer?.last_name}</Text>
                                  </Flex>
                                  <Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>
                                    {quote?.customer?.email}
                                  </Flex>
                                </Flex>
                              </Button>
                            </Link>
                          </Flex>
                        </>
                      ) : (
                        <>{quote?.customer?.company_name}</>
                      )}
                    </Td>
                    {/* <Td textAlign={'center'}><Text>{quote.customer.first_name}</Text><Text>{quote.customer.last_name}</Text></Td> */}
                    {/* <Td textAlign={'center'}><Text>{quote.customer.email}</Text></Td> */}
                    {/* <Td textAlign={'center'}><Text>{quote.customer.phone_number}</Text></Td> */}
                    <Td>
                      <Text>
                        $
                        {quote?.total
                          ? quote?.total.toLocaleString(undefined, {
                              minimumFractionDigits: 2
                            })
                          : '0'}
                      </Text>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <Tooltip label="Edit">
                          <IconButton icon={<MdEdit />} />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            onClick={() => {
                              handleDelete(quote.id, quote.quote_number);
                            }}
                            icon={<MdDelete />}
                          />
                        </Tooltip>
                        <Link to={`/editestimate/${quote.id}`}>
                          <Tooltip label="Go to Estimate Details ">
                            <IconButton
                              colorScheme={'gray'}
                              variant="solid"
                              icon={<MdKeyboardArrowRight />}
                            />
                          </Tooltip>
                        </Link>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : (
          <Skeleton height={'100px'} rounded={'md'} />
        )}
      </TableContainer>
    </>
  );
};

export default QuoteTable;
