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
  Flex,
  Button,
  Skeleton,
  Badge
} from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import formatNumber from '../../utils/formatNumber';

const InvoiceRecentTable = (props) => {
  const { data } = props;

  return (
    <>
      <TableContainer overflow={'auto'}>
        {data ? (
          <>
            <Table variant="simple" size={'sm'}>
              <TableCaption>Recently updated invoices 👋</TableCaption>
              <Thead>
                <Tr>
                  <Th>Invoice#</Th>
                  <Th>Status</Th>
                  <Th>Service</Th>
                  <Th>Customer</Th>
                  <Th>Total</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td fontWeight={'bold'} textAlign={'center'}>{formatNumber(item.invoice_number)}</Td>
                    <Td textAlign={'center'}>
                      <Badge
                        w={'80px'}
                        variant={'subtle'}
                        mx={'auto'}
                        colorScheme={
                          item.invoice_status.name === 'Paid'
                            ? 'green'
                            : '' || item.invoice_status.name === 'Pending'
                            ? 'yellow'
                            : '' || item.invoice_status.name === 'Overdue'
                            ? 'red' || item.invoice_status.name === 'Draft'
                            : 'gray'
                        }
                        p="1"
                        rounded={'xl'}
                        align="center">
                        {item.invoice_status.name}
                      </Badge>
                    </Td>
                    <Td>{item.service_type.name}</Td>
                    <Td>
                      <Flex>
                        <Text>{item.customer.first_name}</Text>
                        <Text ml={'4px'}>{item.customer.last_name}</Text>
                      </Flex>
                    </Td>
                    <Td fontWeight={'bold'}>${item.total}</Td>
                    <Td>
                      <Link to={`/editinvoice/${item.id}`}>
                        <Button colorScheme={'gray'} variant={'solid'}>
                          <MdKeyboardArrowRight size={'20px'} />
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : (
          <Skeleton height={'200px'} rounded={'md'} />
        )}
      </TableContainer>
    </>
  );
};

export default InvoiceRecentTable;
