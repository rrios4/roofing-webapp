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
import formatNumber from '../../utils/formatNumber';

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
                <Th textAlign={'center'}>QR#</Th>
                <Th>Status</Th>
                <Th>Service</Th>
                <Th>Name</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item, index) => (
                <Tr key={item.id}>
                  <Td fontWeight={'bold'} textAlign={'center'}>
                    {formatNumber(item.id)}
                  </Td>
                  <Td>
                    <Badge
                      w={'80px'}
                      variant={'subtle'}
                      mx={'auto'}
                      colorScheme={
                        item.estimate_request_status.name === 'New'
                          ? 'green'
                          : '' || item.estimate_request_status.name === 'Planned'
                          ? 'blue'
                          : '' || item.estimate_request_status.name === 'Pending'
                          ? 'yellow'
                          : '' || item.estimate_request_status.name === 'Closed'
                          ? 'red'
                          : 'gray'
                      }
                      p="1"
                      rounded={'xl'}
                      align="center">
                      {item.estimate_request_status.name}
                    </Badge>
                  </Td>
                  <Td>
                    <Text>{item.services.name}</Text>
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
