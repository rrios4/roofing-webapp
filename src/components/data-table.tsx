import React from 'react';
import EmptyStateCard from './empty-state-card';
import { ChevronLeftIcon, ChevronRightIcon, HelpCircleIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Props = {
  data: any;
  isLoading: boolean;
  entity: string;
  activateModal: any;
  columns: any;
  EntityFilterBar: any;
  firstSelectName: string;
  secondSelectName: string;
  thirdSelectName: string;
};

export default function DataTable({
  data,
  isLoading,
  entity,
  activateModal,
  columns,
  EntityFilterBar,
  firstSelectName,
  secondSelectName,
  thirdSelectName
}: Props) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

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

  const [tableSize, setTableSize] = React.useState('10');

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] rounded-lg" />;
  }

  if (data.length === 0) {
    return (
      <EmptyStateCard
        entity={entity}
        icon={<HelpCircleIcon size={'20px'} />}
        activateModal={false}
      />
    );
  }
  return (
    <>
      <EntityFilterBar
        rootTable={table}
        entity={entity}
        columnEntity={entity}
        firstSelectName={firstSelectName}
        secondSelectName={secondSelectName}
        thirdSelectName={thirdSelectName}
      />
      <div className="w-full border rounded-lg overflow-hidden">
        <Table className="">
          <TableHeader className="bg-zinc-50 dark:bg-zinc-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="rounded-full" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-4 justify-center w-full p-4 border-t rounded-b-lg ">
          <div className="w-[25%]">
            <Button
              variant={'secondary'}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}>
              <ChevronLeftIcon className="mr-2 h-4 w-4" />{' '}
              <p className="font-[500] hidden md:flex">Previous</p>
            </Button>
          </div>
          <div className="flex my-auto w-[50%] justify-center gap-4">
            <div className="flex gap-1 my-auto text-[14px] font-[400]">
              <p>Page</p>
              <p>{table.getState().pagination.pageIndex + 1}</p>
              <p>of</p>
              <p>{table.getPageCount()}</p>
            </div>
            <div className="flex my-auto gap-2">
              <Select onValueChange={(e) => table.setPageSize(Number(e))}>
                <SelectTrigger>
                  <SelectValue placeholder={'Select page size'} />
                </SelectTrigger>
                <SelectContent>
                  {['10', '20', '30', '40', '50'].map((pageSize, index) => (
                    <SelectItem key={index} value={pageSize}>
                      Show {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-[25%] justify-end">
            <Button
              variant={'secondary'}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <p className="font-[500] hidden md:flex">Next</p>{' '}
              <ChevronRightIcon className="md:ml-4 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
