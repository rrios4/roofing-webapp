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

const QuoteRecentTable = (props) => {
  const { data } = props;
  return (
    <>
      <TableContainer overflow={'auto'}>
        {!data ? (
          <Skeleton height={'200px'} rounded={'md'} />
        ) : (
          <>
            <Table variant="simple" size={'sm'}>
              <TableCaption>Recently updated quotes 👋</TableCaption>
              <Thead>
                <Tr>
                  <Th textAlign={'center'}>Quote #</Th>
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
                    <Td fontWeight={'bold'} textAlign={'center'}>{formatNumber(item.quote_number)}</Td>
                    <Td textAlign={'center'}>
                      <Badge
                        w={'80px'}
                        variant={'subtle'}
                        mx={'auto'}
                        colorScheme={
                          item.quote_status.name === 'Accepted'
                            ? 'green'
                            : '' || item.quote_status.name === 'Paid'
                            ? 'green'
                            : '' || item.quote_status.name === 'Pending'
                            ? 'yellow'
                            : '' || item.quote_status.name === 'Rejected'
                            ? 'red'
                            : 'gray'
                        }
                        p="1"
                        rounded={'xl'}
                        align="center">
                        {item.quote_status.name}
                      </Badge>
                    </Td>
                    <Td>{item.services.name}</Td>
                    <Td>
                      <Flex>
                        <Text>{item.customer.first_name}</Text>
                        <Text ml={'4px'}>{item.customer.last_name}</Text>
                      </Flex>
                    </Td>
                    <Td fontWeight={'bold'}>${item.total}</Td>
                    <Td>
                      <Link to={'/estimates'}>
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
        )}
      </TableContainer>
    </>
  );
};

export default QuoteRecentTable;
