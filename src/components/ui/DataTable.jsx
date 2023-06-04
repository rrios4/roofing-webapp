import React from 'react';
import {
  Box,
  Button,
  Flex,
  Select,
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
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import EmptyState from './EmptyState';

const DataTable = ({ data, isLoading, entity, activateModal, columns, EntityFilterBar }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const tableBorderColors = useColorModeValue('gray.200', 'gray.700');
  const tableBgHeaderColor = useColorModeValue('gray.100', 'gray.700');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter
    }
  });

  if (isLoading === true) {
    return (
      <>
        <Skeleton w={'full'} h={'200px'} rounded={'lg'} />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <EmptyState
          emptyStateIcon={<HelpCircle size={'20px'} />}
          entity={entity}
          activateModal={activateModal}
        />
      </>
    );
  }

  return (
    <>
      <EntityFilterBar rootTable={table} />
      <Box w={'full'}>
        <TableContainer roundedTop={'lg'} border={'1px'} borderColor={tableBorderColors}>
          <Table size={'sm'}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} bg={tableBgHeaderColor}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  ))}
                </Tr>
              ))}
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
          borderColor={tableBorderColors}>
          <Box w={'25%'}>
            <Button
              gap={4}
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={'15px'} />
              <Text fontSize={'14px'} fontWeight={600} display={{ base: 'none', md: 'flex' }}>
                Previous
              </Text>
            </Button>
          </Box>
          <Flex my={'auto'} w={'50%'} justify={'center'} gap={4}>
            <Flex gap={1} my={'auto'}>
              <Text fontSize={'14px'} fontWeight={'400'}>
                Page
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                {table.getState().pagination.pageIndex + 1}
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                of
              </Text>
              <Text fontSize={'14px'} fontWeight={'400'}>
                {table.getPageCount()}
              </Text>
            </Flex>
            <Flex my={'auto'} gap={2}>
              <Select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
          <Flex w={'25%'} justify={'flex-end'}>
            <Button gap={4} onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()}>
              <Text fontSize={'14px'} fontWeight={600} display={{ base: 'none', md: 'flex' }}>
                Next
              </Text>
              <ChevronRight size={'15px'} />
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default DataTable;
