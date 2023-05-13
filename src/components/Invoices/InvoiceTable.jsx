import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import formatNumber from '../../utils/formatNumber';
import formatMoneyValue from '../../utils/formatMoneyValue';
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
import { MdEdit, MdDelete, MdKeyboardArrowRight } from 'react-icons/md';

const InvoiceTable = (props) => {
  const { data, editModal, deleteAlert } = props;

  return (
    <>
      <TableContainer>
        <Table variant={'simple'} size="sm">
          <TableCaption overflowX={'auto'}>
            Total of {data?.length} Invoices in our system ✌️
          </TableCaption>
          <Thead>
            <Tr>
              <Th textAlign={'center'}>Invoice #</Th>
              <Th textAlign={'center'}>Status</Th>
              <Th>Service</Th>
              <Th>Invoice Date</Th>
              {/* <Th>Issue Date</Th> */}
              <Th>Due Date</Th>
              <Th>Customer</Th>
              {/* <Th>Customer Email</Th> */}
              {/* <Th>Phone Number</Th> */}
              <Th>Total</Th>
              <Th>Amount Due</Th>
              <Th textAlign={'center'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Table Row Data Component */}
            {data?.map((invoice, index) => (
              <Tr key={invoice.id}>
                <Td textAlign={'center'}>
                  <Text fontSize={'md'} fontWeight={'bold'}>
                    {formatNumber(invoice.invoice_number)}
                  </Text>
                </Td>
                <Td textAlign={'center'}>
                  <Badge
                    w={'80px'}
                    variant={'subtle'}
                    mx={'auto'}
                    colorScheme={
                      invoice.invoice_status.name === 'New'
                        ? 'green'
                        : '' || invoice.invoice_status.name === 'Paid'
                        ? 'green'
                        : '' || invoice.invoice_status.name === 'Pending'
                        ? 'yellow'
                        : '' || invoice.invoice_status.name === 'Overdue'
                        ? 'red'
                        : 'gray'
                    }
                    p="1"
                    rounded={'xl'}
                    align="center">
                    {invoice.invoice_status.name}
                  </Badge>
                </Td>
                <Td>
                  <Text>{invoice.services.name}</Text>
                </Td>
                <Td>
                  <Text>{formatDate(invoice.invoice_date)}</Text>
                </Td>
                {/* <Td><Text>{invoice.issue_date ? invoice.issue_date : ''}</Text></Td> */}
                <Td>
                  <Text>{formatDate(invoice.due_date)}</Text>
                </Td>
                {/* <Td><Flex>{invoice.customer.first_name} {invoice.customer.last_name}</Flex></Td> */}
                <Td>
                  {invoice.customer.first_name && invoice.customer.last_name ? (
                    <>
                      <Flex>
                        <Link to={`/customers/${invoice.customer.id}`}>
                          <Button variant={'ghost'} colorScheme={'facebook'}>
                            <Avatar size={'xs'} mr={'8px'} my={'auto'} />
                            <Flex flexDir={'column'}>
                              <Flex fontWeight={'bold'} fontSize={'xs'}>
                                <Text marginRight={'4px'}>{invoice.customer.first_name}</Text>
                                <Text>{invoice.customer.last_name}</Text>
                              </Flex>
                              <Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>
                                {invoice.customer.email}
                              </Flex>
                            </Flex>
                          </Button>
                        </Link>
                      </Flex>
                    </>
                  ) : (
                    <>{invoice.customer.company_name}</>
                  )}
                </Td>
                {/* <Td><Text>{invoice.customer.email}</Text></Td> */}
                {/* <Td><Text>{invoice.customer.phone_number}</Text></Td> */}
                <Td>
                  <Text>${formatMoneyValue(invoice.total ? invoice.total : 0)}</Text>
                </Td>
                <Td>
                  <Text>
                    ${!invoice.amount_due ? '0.00' : formatMoneyValue(invoice.amount_due)}
                  </Text>
                </Td>
                <Td textAlign={'center'}>
                  <Flex gap={2}>
                    <Tooltip label="Edit">
                      <IconButton
                        icon={<MdEdit />}
                        onClick={() => {
                          editModal(invoice);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<MdDelete />}
                        onClick={() => {
                          deleteAlert(invoice.id, invoice.invoice_number);
                        }}
                      />
                    </Tooltip>
                    <Link to={`/invoices/${invoice.invoice_number}`}>
                      <Tooltip label="Go to Invoice Details ">
                        <IconButton
                          icon={<MdKeyboardArrowRight />}
                          colorScheme={'gray'}
                          variant="solid"
                        />
                      </Tooltip>
                    </Link>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InvoiceTable;
