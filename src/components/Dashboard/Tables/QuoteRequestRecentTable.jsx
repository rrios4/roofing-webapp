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
import formatNumber from '../../../utils/formatNumber';
import StatusBadge from '../../ui/StatusBadge';

const QuoteRequestRecentTable = (props) => {
  const { data } = props;
  return (
    <>
      {data ? (
        <TableContainer overflow={'auto'}>
          <Table variant="simple" size={'sm'}>
            <TableCaption>Recent Leads Updated 👋</TableCaption>
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
                <React.Fragment key={index}>
                  <Tr key={item.id}>
                    <Td fontWeight={'bold'} textAlign={'center'}>
                      {formatNumber(item.id)}
                    </Td>
                    <Td>
                      {item.estimate_request_status.name === 'New' ? (
                        <StatusBadge
                          badgeText={item.estimate_request_status.name}
                          colorScheme={'green'}
                        />
                      ) : item.estimate_request_status.name === 'Scheduled' ? (
                        <StatusBadge
                          badgeText={item.estimate_request_status.name}
                          colorScheme={'orange'}
                        />
                      ) : item.estimate_request_status.name === 'Pending' ? (
                        <StatusBadge
                          badgeText={item.estimate_request_status.name}
                          colorScheme={'yellow'}
                        />
                      ) : item.estimate_request_status.name === 'Closed' ? (
                        <StatusBadge
                          badgeText={item.estimate_request_status.name}
                          colorScheme={'red'}
                        />
                      ) : (
                        <StatusBadge
                          badgeText={item.estimate_request_status.name}
                          colorScheme={'gray'}
                        />
                      )}
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
                </React.Fragment>
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
