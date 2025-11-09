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
        <Table className="text-xs sm:text-sm">
          <TableHeader className="bg-slate-50 dark:bg-zinc-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-700"
                key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`
                  hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150
                  ${index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-slate-50/30 dark:bg-zinc-800/20'}
                `}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-2 sm:p-3 text-xs sm:text-sm align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full p-2 sm:p-4 border-t bg-slate-50/50 dark:bg-zinc-800/50">
          <div>
            <Button
              variant={'secondary'}
              size={'sm'}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9">
              <ChevronLeftIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium hidden sm:inline">Previous</span>
              <span className="font-medium sm:hidden">Prev</span>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex gap-1 text-xs sm:text-sm font-normal">
              <span>Page</span>
              <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span>
              <span>of</span>
              <span className="font-semibold">{table.getPageCount()}</span>
            </div>
            <Select onValueChange={(e) => table.setPageSize(Number(e))}>
              <SelectTrigger className="w-auto min-w-0 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {['10', '20', '30', '40', '50'].map((pageSize, index) => (
                  <SelectItem key={index} value={pageSize} className="text-xs sm:text-sm">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              variant={'secondary'}
              size={'sm'}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9">
              <span className="font-medium hidden sm:inline">Next</span>
              <span className="font-medium sm:hidden">Next</span>
              <ChevronRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
