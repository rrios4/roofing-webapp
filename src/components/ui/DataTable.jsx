import React from 'react';
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, UserX } from 'lucide-react';
import EmptyState from './EmptyState';

const DataTable = ({ data, isLoading, entity, activateModal, columns }) => {
  const [sorting, setSorting] = React.useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  });

  if (isLoading === true) {
    return <Skeleton w={'full'} h={'200px'} rounded={'lg'} />;
  }

  if (!data) {
    return (
      <EmptyState
        emptyStateIcon={<UserX size={'20px'} />}
        entity={entity}
        activateModal={activateModal}
      />
    );
  }

  return (
    <>
      <Box w={'full'}>
        <TableContainer
          roundedTop={'lg'}
          border={'1px'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Table size={'md'}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} bg={useColorModeValue('gray.100', 'gray.700')} h={'44px'}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  ))}
                </Tr>
              ))}
              {/* <Tr bg={useColorModeValue('gray.100', 'gray.700')} h={'44px'}>

              </Tr> */}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex
          gap={4}
          justify={'center'}
          w={'full'}
          p={'1rem'}
          borderLeft={'1px'}
          borderRight={'1px'}
          borderBottom={'1px'}
          roundedBottom={'lg'}
          shadow={'sm'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Box w={'25%'}>
            <Button
              gap={4}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={'15px'} />
              <Text fontSize={'14px'} fontWeight={600} display={{ base: 'none', md: 'flex' }}>
                Previous
              </Text>
            </Button>
          </Box>
          <Flex my={'auto'} w={'50%'} justify={'center'}>
            <Flex gap={1}>
              <Text fontSize={'14px'} fontWeight={'400'}>
                Page
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                1
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                of
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                10
              </Text>
            </Flex>
          </Flex>
          <Flex w={'25%'} justify={'flex-end'}>
            <Button gap={4} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <Text fontSize={'14px'} fontWeight={600} display={{ base: 'none', md: 'flex' }}>
                Next
              </Text>
              <ChevronRight size={'15px'} />
            </Button>
          </Flex>
        </Flex>
        {/* <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table> */}
        {/* <div className="h-4" />
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button> */}
      </Box>
    </>
  );
};

export default DataTable;
