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
  Skeleton
} from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

const QuoteRecentTable = (props) => {
  const { data } = props;
  return (
    <>
      <TableContainer overflow={'auto'}>
        {data ? (
          <>
            <Table variant="simple" size={'sm'}>
              <TableCaption>Recently updated quotes 👋</TableCaption>
              <Thead>
                <Tr>
                  <Th>Q#</Th>
                  <Th>Status</Th>
                  <Th>Service</Th>
                  <Th>Customer</Th>
                  <Th>Total</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={item.id}>
                    <Td fontWeight={'bold'}>{item.estimate_number}</Td>
                    <Td>
                      {item.estimate_status.name === 'Sent' ? (
                        <>
                          <Text
                            color={'white'}
                            mx={'auto'}
                            bg={'yellow.500'}
                            p="1"
                            rounded={'xl'}
                            align="center"
                            w={'80px'}>
                            Sent
                          </Text>
                        </>
                      ) : (
                        'false'
                      )}
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
        ) : (
          <Skeleton height={'200px'} rounded={'md'} />
        )}
      </TableContainer>
    </>
  );
};

export default QuoteRecentTable;
