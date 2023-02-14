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
  Skeleton
} from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

const CustomerRecentTable = (props) => {
  const { data } = props;
  return (
    <>
      {data ? (
        <>
          <TableContainer overflow={'auto'}>
            <Table variant="simple" size={'sm'}>
              <TableCaption>Recently updated customers 👋</TableCaption>
              <Thead>
                <Tr>
                  <Th>Customer</Th>
                  <Th>Type</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>
                      {item.first_name && item.last_name ? (
                        <>
                          <Flex>
                            <Avatar size={'sm'} mr={'18px'} my={'auto'} />
                            <Flex flexDir={'column'}>
                              <Flex fontWeight={'bold'} fontSize={'md'}>
                                <Text marginRight={'4px'}>{item.first_name}</Text>
                                <Text>{item.last_name}</Text>
                              </Flex>
                              <Flex mt={'4px'} fontWeight={'light'}>
                                {item.email}
                              </Flex>
                            </Flex>
                          </Flex>
                        </>
                      ) : (
                        <>{item.company_name}</>
                      )}
                    </Td>
                    <Td>
                      <Badge
                        padding={'7px'}
                        rounded={'full'}
                        textAlign={'center'}
                        w="100px"
                        colorScheme={
                          item.customer_type_id === 1
                            ? 'blue'
                            : item.customer_type_id === 2
                            ? 'green'
                            : item.customer_type_id === 3
                            ? 'yellow'
                            : ''
                        }
                        variant={'subtle'}
                        ml={'1rem'}>
                        {item.customer_type_id === 1
                          ? 'Residential'
                          : item.customer_type_id === 2
                          ? 'Commercial'
                          : item.customer_type_id === 3
                          ? 'Other'
                          : ''}
                      </Badge>
                    </Td>
                    <Td>
                      <Link to={`/editcustomer/${item.id}`}>
                        <Button colorScheme={'gray'} variant={'solid'}>
                          <MdKeyboardArrowRight size={'20px'} />
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Skeleton height={'200px'} rounded={'md'} />
      )}
    </>
  );
};

export default CustomerRecentTable;
