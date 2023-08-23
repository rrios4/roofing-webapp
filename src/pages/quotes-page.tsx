import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import {
  ArrowUpDownIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CircleDotIcon,
  MinusCircleIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react';
import {
  useFetchTotalAcceptedQuotes,
  useFetchTotalPendingQuotes,
  useFetchTotalRejectedQuotes
} from '../hooks/useAPI/useReports';
import DataTable from '../components/data-table';
import { useFetchQuotes } from '../hooks/useAPI/useQuotes';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import {
  arrayOfMemojiFileNames,
  formatDateWithAbbreviatedMonth,
  formatMoneyValue,
  formatNumber
} from '../lib/utils';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

type Props = {};
const columnHelper = createColumnHelper();

export default function QuotesPage({}: Props) {
  const { quotes, isLoading: isQuotesLoading } = useFetchQuotes();
  const { data: totalAcceptedQuotesCount, isLoading: isTotalAcceptedQuoteCountLoading } =
    useFetchTotalAcceptedQuotes();
  const { data: totalPendingQuotesCount, isLoading: isTotalPendingQuoteCountLoading } =
    useFetchTotalPendingQuotes();
  const { data: totalRejectedQuotesCount, isLoading: isTotalRejectedQuoteCountLoading } =
    useFetchTotalRejectedQuotes();
  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Quotes"
        subheading="Manage quotes and view information focused on them."
        addItemTextButton="Add quote"
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="Accepted"
          icon={<CheckCircleIcon size={'25px'} />}
          totalCount={totalAcceptedQuotesCount}
          isLoading={isTotalAcceptedQuoteCountLoading}
        />
        <CountStatCard
          title="Pending"
          icon={<CircleDotIcon size={'25px'} />}
          totalCount={totalPendingQuotesCount}
          isLoading={isTotalPendingQuoteCountLoading}
        />
        <CountStatCard
          title="Rejected"
          icon={<MinusCircleIcon size={'25px'} />}
          totalCount={totalRejectedQuotesCount}
          isLoading={isTotalRejectedQuoteCountLoading}
        />
      </div>
      <DataTable
        entity="quote"
        data={quotes}
        isLoading={isQuotesLoading}
        firstSelectName="Status"
        secondSelectName="Service Type"
        thirdSelectName="Customer"
        activateModal={false}
        EntityFilterBar={DataTableFilterCard}
        filterBarEntity={'customer'}
        columns={quoteColumns}
      />
    </div>
  );
}

const deleteModalHandler = () => {

}

const handleEditDrawer = () => {

}

export const quoteColumns = [
  columnHelper.accessor('quote_number', {
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <p className="text-center font-[800] text-[14px]">QT-{formatNumber(quote.quote_number)}</p>
      );
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quote
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('quote_date', {
    cell: ({ row }: any) => {
      const quote = row.original;
      return (
        <p className="font-[400] text-[14px]">{formatDateWithAbbreviatedMonth(quote.quote_date)}</p>
      );
    },
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Date
        <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
      </Button>
    )
  }),
  columnHelper.accessor('status_id', {
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Status
        <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
      </Button>
    ),
    cell: ({ row }: any) => {
      const quote = row.original;
      if (quote.quote_status.name === 'Accepted') {
        return <DefaultStatusBadge title={quote.quote_status.name} variant={'green'} />;
      } else if (quote.quote_status.name === 'Pending') {
        return <DefaultStatusBadge title={quote.quote_status.name} variant={'yellow'} />;
      } else if (quote.quote_status.name === 'Rejected') {
        return <DefaultStatusBadge title={quote.quote_status.name} variant={'red'} />;
      } else {
        return <DefaultStatusBadge title={quote.quote_status.name} variant={'gray'} />;
      }
    }
  }),
  columnHelper.accessor('service', {
    id: 'service',
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Service
        <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
      </Button>
    ),
    cell: ({ row }: any) => {
      const quote = row.original;
      return <p className="font-[400] text-[14px]">{quote.services.name}</p>;
    }
  }),
  columnHelper.accessor('expiration_date', {
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Expiration
        <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
      </Button>
    ),
    cell: ({ row }: any) => {
      const quote = row.original;
      return (
        <p className="font-[400] text-[14px]">
          {formatDateWithAbbreviatedMonth(quote.expiration_date)}
        </p>
      );
    }
  }),
  columnHelper.accessor(
    (row: any) =>
      `${row.customer.first_name} ${row.customer.last_name} ${row.customer.email} ${row.quote_number} ${row.quote_status.name} ${row.services.name}`,
    {
      id: 'customer',
      cell: ({ row }: any) => {
        const quote = row.original;
        return (
          <Link to={`/customers/${quote.customer.id}`} className=''>
            <Button className="px-1 py-6" variant={'ghost'}>
              <div className="flex gap-3">
                <Avatar className='border'>
                  <AvatarImage
                    src={`https://raw.githubusercontent.com/alohe/memojis/main/png/${
                      arrayOfMemojiFileNames[
                        Math.floor(Math.random() * arrayOfMemojiFileNames.length)
                      ]
                    }`}
                  />
                  <AvatarFallback>
                    {`${quote.customer.first_name.substring(
                      0,
                      1
                    )}${quote.customer.last_name.substring(0, 1)}`}
                  </AvatarFallback>
                </Avatar>
                <div className="font-[14px] pr-2">
                  <div className="flex gap-1 font-[500]">
                    <p>{quote.customer.first_name}</p>
                    <p>{quote.customer.last_name}</p>
                  </div>
                  <p className="font-[400]">{quote.customer.email}</p>
                </div>
              </div>
            </Button>
          </Link>
        );
      },
      header: ({ column }) => (
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Customer
          <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
        </Button>
      )
    }
  ),
  columnHelper.accessor('total', {
    cell: ({ row }: any) => {
      const quote = row.original;
      return <p className="font-[400] text-[14px]">${formatMoneyValue(quote.total)}</p>;
    },
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Total
        <ArrowUpDownIcon size={'15px'} className={'h-4 w-4 ml-4'} />
      </Button>
    )
  }),
  columnHelper.accessor('actions', {
    header: () => <p>Actions</p>,
    cell: ({ row }: any) => {
      const quote = row.original;
      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'secondary'} className="px-3" onClick={() => handleEditDrawer(quote)}>
                  <PencilIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger >
                <Button variant={'secondary'} className="px-3" onClick={() => deleteModalHandler(quote.quote_number)}>
                  <TrashIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link to={`/quotes/${quote.quote_number}`}></Link>
                <Button className="px-3" variant={'secondary'}>
                  <ChevronRightIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to see details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  })
];
