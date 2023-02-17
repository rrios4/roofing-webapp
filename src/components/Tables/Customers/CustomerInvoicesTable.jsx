import React from 'react';
import { Link } from 'react-router-dom';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Badge,
  IconButton,
  Skeleton
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { formatDate, formatMoneyValue, formatNumber } from '../../../utils';

const CustomerInvoicesTable = (props) => {
  const { data } = props;

  return (
    <>
      {!data ? (
        <>
          <Skeleton h={'20px'} w={'full'} />
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>INV#</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Due Date</Th>
                  <Th>Total</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <Text fontWeight={'semibold'}>{formatNumber(item.invoice_number)}</Text>
                    </Td>
                    <Td>
                      <Badge
                        w={'80px'}
                        textAlign={'center'}
                        my={'auto'}
                        p={2}
                        rounded={'xl'}
                        colorScheme={
                          item.invoice_status.name === 'Paid'
                            ? 'green'
                            : item.invoice_status.name === 'Pending'
                            ? 'yellow'
                            : item.invoice_status.name === 'Overdue'
                            ? 'red'
                            : 'gray'
                        }>
                        {item.invoice_status.name}
                      </Badge>
                    </Td>
                    <Td>
                      <Text>{formatDate(item.invoice_date)}</Text>
                    </Td>
                    <Td>
                      <Text>{formatDate(item.due_date)}</Text>
                    </Td>
                    <Td>
                      <Text>${formatMoneyValue(item.total)}</Text>
                    </Td>
                    <Td>
                      <Link to={`/editinvoice/${item.invoice_number}`}>
                        <IconButton icon={<FiArrowRight />} />
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default CustomerInvoicesTable;
