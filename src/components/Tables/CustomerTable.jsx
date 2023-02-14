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
  Avatar,
  Tooltip,
  IconButton,
  Skeleton
} from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

const CustomerTable = (props) => {
  const { data, isWideVersion } = props;
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  return (
    <>
      <TableContainer overflow={'auto'}>
        <Table variant="simple" size={'sm'}>
          <TableCaption>Total of {data?.length} Customers registered in our system ✌️</TableCaption>
          <Thead>
            <Tr>
              <Th>Customer</Th>
              <Th>Type</Th>
              {isWideVersion && <Th>Phone Number</Th>}
              {isWideVersion && <Th>Address</Th>}
              {isWideVersion && <Th>Registered Date</Th>}
              <Th textAlign={'center'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((customer, index) => (
              <Tr key={index}>
                <Td>
                  {customer.first_name && customer.last_name ? (
                    <>
                      <Flex>
                        <Avatar size={'sm'} mr={'16px'} my={'auto'} />
                        <Flex flexDir={'column'}>
                          <Flex fontWeight={'bold'} fontSize={'sm'}>
                            <Text marginRight={'4px'}>{customer.first_name}</Text>
                            <Text>{customer.last_name}</Text>
                          </Flex>
                          <Flex mt={'2px'} textColor={'blue.500'}>
                            {customer.email}
                          </Flex>
                        </Flex>
                      </Flex>
                    </>
                  ) : (
                    <>{customer.company_name}</>
                  )}
                </Td>
                <Td>
                  <Badge
                    w="90%"
                    textAlign="center"
                    padding={'2'}
                    rounded={'full'}
                    variant={'subtle'}
                    colorScheme={
                      customer.customer_type_id === 1
                        ? 'blue'
                        : customer.customer_type_id === 2
                        ? 'green'
                        : customer.customer_type_id === 3
                        ? 'yellow'
                        : ''
                    }>
                    {customer.customer_type_id === 1
                      ? 'Residential'
                      : customer.customer_type_id === 2
                      ? 'Commercial'
                      : customer.customer_type_id === 3
                      ? 'Other'
                      : ''}
                  </Badge>
                </Td>
                {isWideVersion && (
                  <Td>
                    <Flex fontWeight={'light'}>
                      {!customer.phone_number ? (
                        <>
                          <Text>❌ Unavailable</Text>
                        </>
                      ) : (
                        customer.phone_number
                      )}
                    </Flex>
                  </Td>
                )}
                {isWideVersion && (
                  <Td>
                    <Text
                      _hover={{ textColor: 'blue' }}
                      cursor={'pointer'}
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`
                        )
                      }>
                      {customer.street_address} {customer.city}, {customer.state} {customer.zipcode}
                    </Text>
                  </Td>
                )}
                {isWideVersion && (
                  <Td>{new Date(customer.created_at).toLocaleDateString('en-us', options)}</Td>
                )}
                <Td textAlign={'center'}>
                  <Link to={`/editcustomer/${customer.id}`}>
                    <Tooltip label="Go to Customer Details ">
                      <IconButton
                        ml={'1rem'}
                        colorScheme={'gray'}
                        variant="solid"
                        icon={<MdKeyboardArrowRight />}
                      />
                    </Tooltip>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomerTable;
