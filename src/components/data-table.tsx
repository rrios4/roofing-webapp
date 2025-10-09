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
  filterBarEntity: string;
  emptyStateSheetTitle?: string;
  emptyStateSheetDescription?: string;
  EmptyStateSheetBody?: any;
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
  thirdSelectName,
  filterBarEntity,
  emptyStateSheetTitle,
  emptyStateSheetDescription,
  EmptyStateSheetBody
}: Props) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // @ts-expect-error not being used rn
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // @ts-expect-error not being used rn
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
    return (
      <div className="flex flex-col w-full gap-6">
        <Skeleton className="w-full h-[115px] rounded-lg" />
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyStateCard
        entity={entity}
        icon={<HelpCircleIcon size={'20px'} />}
        activateModal={false}
        sheetTitle={emptyStateSheetTitle ? emptyStateSheetTitle : ''}
        sheetDescription={emptyStateSheetDescription ? emptyStateSheetDescription : ''}
        SheetContentBody={EmptyStateSheetBody}
      />
    );
  }
  return (
    <>
      <EntityFilterBar
        rootTable={table}
        entity={filterBarEntity}
        columnEntity={filterBarEntity}
        firstSelectName={firstSelectName}
        secondSelectName={secondSelectName}
        thirdSelectName={thirdSelectName}
      />
      <div className="w-full border rounded-lg overflow-hidden">
        <Table className="">
          <TableHeader className="bg-slate-100 dark:bg-zinc-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800"
                key={headerGroup.id}>
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
              <TableRow key={row.id} className="hover:bg-transparent">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid grid-flow-row grid-cols-3 gap-4 w-full p-4 border-t rounded-b-lg ">
          <div className="">
            <Button
              variant={'secondary'}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}>
              <ChevronLeftIcon className="mr-2 h-4 w-4" />{' '}
              <p className="font-[500] hidden md:flex">Previous</p>
            </Button>
          </div>
          <div className="flex my-auto w-full justify-center gap-4 md:flex-row flex-col-reverse">
            <div className="flex gap-1 my-auto text-[14px] font-[400] mx-auto md:mx-0">
              <p>Page</p>
              <p className="font-[700]">{table.getState().pagination.pageIndex + 1}</p>
              <p>of</p>
              <p className="font-[600]">{table.getPageCount()}</p>
            </div>
            <div className="flex my-auto gap-2">
              <Select onValueChange={(e) => table.setPageSize(Number(e))}>
                <SelectTrigger>
                  <SelectValue placeholder={'Select page size'} />
                </SelectTrigger>
                <SelectContent>
                  {['10', '20', '30', '40', '50', '100'].map((pageSize, index) => (
                    <SelectItem key={index} value={pageSize}>
                      Show {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
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
