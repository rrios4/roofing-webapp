import React from 'react';
import {
  Box,
  TableContainer,
  Skeleton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton
} from '@chakra-ui/react';
import { formatMoneyValue } from '../../../utils';
import { FiX } from 'react-icons/fi';

const QuoteDetailsLineItemTable = (props) => {
  const { handleLineItemDelete, editSwitchIsOn, paymentCardBgColor, quoteById, bgColorMode } =
    props;
  return (
    <>
      <Box px={'2rem'} py={'2rem'}>
        <TableContainer rounded={'xl'}>
          {!quoteById ? (
            <Skeleton bg={paymentCardBgColor} height={'100px'} w={'full'} rounded={'xl'} />
          ) : (
            <>
              <Table variant={'simple'}>
                <Thead bg={bgColorMode} rounded={'xl'}>
                  <Tr>
                    <Th>Description</Th>
                    <Th>Qty</Th>
                    <Th>Rate</Th>
                    <Th>Amount</Th>
                    {editSwitchIsOn === true ? <Th></Th> : <></>}
                  </Tr>
                </Thead>
                <Tbody>
                  {/* Table Row Data Component */}
                  {quoteById?.quote_line_item?.map((item, index) => (
                    <Tr key={index}>
                      <Td whiteSpace="normal" height="auto" blockSize="auto">
                        {item.description}
                      </Td>
                      <Td>{item.qty}</Td>
                      <Td>{item.item_rate === true ? item.rate : 'Fixed'}</Td>
                      <Td>${formatMoneyValue(item.amount)}</Td>
                      {editSwitchIsOn === true ? (
                        <Td>
                          <IconButton icon={<FiX />} onClick={() => handleLineItemDelete(item)} />
                        </Td>
                      ) : (
                        <></>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
        </TableContainer>
      </Box>
    </>
  );
};

export default QuoteDetailsLineItemTable;
