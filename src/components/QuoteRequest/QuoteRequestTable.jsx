import React from 'react';
import formatDate from '../../utils/formatDate';
import formatNumber from '../../utils/formatNumber';
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
import { MdEdit, MdAddBox, MdDelete } from 'react-icons/md';

const QuoteRequestTable = (props) => {
  const { data, emailValidation, handleEdit, handleDeleteAlert } = props;
  return (
    <>
      <TableContainer overflow={'auto'}>
        <Table variant="simple" size={'sm'}>
          <TableCaption>Total of {data?.length} requests in our system ✌️</TableCaption>
          <Thead>
            <Tr>
              <Th>QR #</Th>
              <Th textAlign={'center'}>Status</Th>
              <Th>Requestor</Th>
              <Th>Desired Date</Th>
              <Th>Service</Th>
              <Th>Type</Th>
              {/* <Th>Name</Th> */}
              {/* <Th>Email</Th> */}
              {/* <Th>Phone Number</Th> */}
              {/* <Th>Address</Th> */}
              <Th>Entry Date</Th>
              <Th textAlign={'center'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((request, index) => (
              <Tr key={index}>
                <Td>
                  <Text fontWeight={'bold'} fontSize={'md'}>
                    {formatNumber(request.id)}
                  </Text>
                </Td>
                <Td textAlign={'center'}>
                  <Badge
                    w={'80px'}
                    variant={'subtle'}
                    mx={'auto'}
                    colorScheme={
                      request.estimate_request_status.name === 'New'
                        ? 'green'
                        : '' || request.estimate_request_status.name === 'Planned'
                        ? 'blue'
                        : '' || request.estimate_request_status.name === 'Pending'
                        ? 'yellow'
                        : '' || request.estimate_request_status.name === 'Closed'
                        ? 'red'
                        : 'gray'
                    }
                    p="1"
                    rounded={'xl'}
                    align="center">
                    {request.estimate_request_status.name}
                  </Badge>
                </Td>
                <Td>
                  {request.firstName && request.lastName ? (
                    <>
                      <Flex>
                        <Avatar size={'sm'} mr={'16px'} my={'auto'} />
                        <Flex flexDir={'column'}>
                          <Flex fontWeight={'bold'} fontSize={'xs'}>
                            <Text marginRight={'4px'}>{request.firstName}</Text>
                            <Text>{request.lastName}</Text>
                          </Flex>
                          <Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>
                            {request.email}
                          </Flex>
                          <Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>
                            <Text
                              cursor={'pointer'}
                              _hover={{ textColor: 'blue' }}
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${request.streetAddress}+${request.city}+${request.state}+${request.zipcode}`
                                )
                              }>
                              {request.streetAddress} {request.city}, {request.state}{' '}
                              {request.zipcode}
                            </Text>
                          </Flex>
                          <Flex mt={'4px'} fontWeight={'light'} fontSize={'xs'}>
                            <Text>
                              {request.phone_number ? request.phone_number : '❌ Unavailable'}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </>
                  ) : (
                    <>{request.company_name}</>
                  )}
                </Td>
                <Td>
                  <Text>{formatDate(request.requested_date)}</Text>
                </Td>
                <Td>
                  <Text>
                    {request.service_type_id === 1 ? 'Roof Replacement' : ''}
                    {request.service_type_id === 2 ? 'Roof Leak Repair' : ''}
                    {request.service_type_id === 3 ? 'Roof Maintenance' : ''}
                  </Text>
                </Td>
                <Td textAlign={'center'}>
                  <Badge
                    w={'95px'}
                    variant={'subtle'}
                    mx={'auto'}
                    colorScheme={
                      request.customer_type.name === 'Commercial'
                        ? 'green'
                        : '' || request.customer_type.name === 'Residential'
                        ? 'blue'
                        : '' || request.customer_type.name === 'Other'
                        ? 'yellow'
                        : '' || request.customer_type.name === 'Rejected'
                        ? 'red'
                        : 'gray'
                    }
                    p="1"
                    rounded={'xl'}
                    align="center"
                    textAlign={'center'}>
                    {request.customer_type.name}
                  </Badge>
                </Td>

                {/* <Td>{request.customer_typeID === 1 ? <><Text textColor={'white'} bg={'blue.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Residential</Text></> : '' || request.customer_typeID === 2 ? <><Text textColor={'white'} bg={'purple.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Commercial</Text></> : '' || request.customer_typeID === 3 ? <><Text textColor={'white'} bg={'yellow.500'} py={'6px'} rounded={'xl'} align='center' w={'80px'}>Other</Text></> : ''}</Td> */}
                {/* <Td><Text>{request.firstName}</Text><Text>{request.lastName}</Text></Td> */}
                {/* <Td><Text>{request.email}</Text></Td> */}
                {/* <Td>
                  <Text>{request.phone_number ? request.phone_number : '❌ Unavailable'}</Text>
                </Td> */}
                {/* <Td>
                  <Text
                    cursor={'pointer'}
                    _hover={{ textColor: 'blue' }}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${request.streetAddress}+${request.city}+${request.state}+${request.zipcode}`
                      )
                    }>
                    {request.streetAddress} {request.city}, {request.state} {request.zipcode}
                  </Text>
                </Td> */}
                <Td>
                  <Text>{new Date(request.created_at).toLocaleString()}</Text>
                </Td>
                <Td textAlign={'center'}>
                  <Flex gap="2">
                    <Tooltip label="Edit">
                      <IconButton
                        icon={<MdEdit />}
                        onClick={() => {
                          handleEdit(request);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<MdDelete />}
                        onClick={() => {
                          handleDeleteAlert(request.id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Save as Customer">
                      <IconButton icon={<MdAddBox />} onClick={() => emailValidation(request)} />
                    </Tooltip>
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

export default QuoteRequestTable;
