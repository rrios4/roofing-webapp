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
import { MdKeyboardArrowRight } from 'react-icons/md';

const QuoteRequestRecentTable = (props) => {
  const { data } = props;
  return (
    <>
      {data ? (
        <TableContainer overflow={'auto'}>
          <Table variant="simple" size={'sm'}>
            <TableCaption>Recent Quote Requests Updated 👋</TableCaption>
            <Thead>
              <Tr>
                <Th>QR#</Th>
                <Th>Status</Th>
                <Th>Service</Th>
                <Th>Name</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item, index) => (
                <Tr key={item.id}>
                  <Td fontWeight={'bold'}>{item.id}</Td>
                  <Td>
                    {item.est_request_status_id === 1 ? (
                      <>
                        <Text
                          textColor={'white'}
                          bg={'green.500'}
                          py={'6px'}
                          rounded={'xl'}
                          align="center"
                          w={'80px'}>
                          New
                        </Text>
                      </>
                    ) : '' || item.est_request_status_id === 2 ? (
                      <>
                        <Text
                          textColor={'white'}
                          bg={'blue.500'}
                          py={'6px'}
                          rounded={'xl'}
                          align="center"
                          w={'80px'}>
                          Scheduled
                        </Text>
                      </>
                    ) : '' || item.est_request_status_id === 5 ? (
                      <>
                        <Text
                          textColor={'white'}
                          bg={'red.500'}
                          py={'6px'}
                          rounded={'xl'}
                          align="center"
                          w={'80px'}>
                          Closed
                        </Text>
                      </>
                    ) : '' || item.est_request_status_id === 3 ? (
                      <>
                        <Text
                          textColor={'white'}
                          bg={'yellow.500'}
                          py={'6px'}
                          rounded={'xl'}
                          align="center"
                          w={'80px'}>
                          Pending
                        </Text>
                      </>
                    ) : (
                      ''
                    )}
                  </Td>
                  <Td>
                    <Text>
                      {item.service_type_id === 1 ? 'Roof Replacement' : ''}
                      {item.service_type_id === 2 ? 'Roof Leak Repair' : ''}
                      {item.service_type_id === 3 ? 'Roof Maintenance' : ''}
                    </Text>
                  </Td>
                  <Td>
                    <Flex>
                      <Text>{item.firstName}</Text>
                      <Text ml={'5px'}>{item.lastName}</Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Link to={'/estimate-requests'}>
                      <Button colorScheme={'gray'} variant={'solid'}>
                        <MdKeyboardArrowRight size={'20px'} />
                      </Button>
                    </Link>
                  </Td>
                  {/* <Td><Link to={`/estimate-request`}><Tooltip label='Go to QR Details '><Button ml={'0rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Skeleton height="200px" rounded={'md'} />
      )}
    </>
  );
};

export default QuoteRequestRecentTable;
