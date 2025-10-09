import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CircleDotIcon,
  MailIcon,
  MapPinIcon,
  MinusCircleIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react';
import {
  useFetchTotalAcceptedQuotes,
  useFetchTotalPendingQuotes,
  useFetchTotalRejectedQuotes
} from '../hooks/useAPI/use-report';
import DataTable from '../components/data-table';
import { useFetchQuotes } from '../hooks/useAPI/use-quotes';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import {
  arrayOfMemojiFileNames,
  formatDateWithAbbreviatedMonth,
  formatDateTimeWithAbbreviatedMonth,
  formatMoneyValue,
  formatNumber
} from '../lib/utils';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import CustomerPreviewPopover from '../components/customer-preview-popover';
import AddQuoteForm from '../components/forms/add-quote-form';
import UpdateQuoteSheet from '../components/forms/update-quote-sheet';
import { ConnectedDeleteQuoteAlertDialog } from '../components/connected-delete-dialogs';

type Props = {};
const columnHelper = createColumnHelper<any>();

export default function QuotesPage() {
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
        sheetTitle="Add Quote"
        sheetDescription="Create a new quote that will help track potential new work."
        SheetContentBody={AddQuoteForm}
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="Accepted"
          icon={<CheckCircleIcon size={'25px'} />}
          totalCount={totalAcceptedQuotesCount ?? 0}
          isLoading={isTotalAcceptedQuoteCountLoading}
        />
        <CountStatCard
          title="Pending"
          icon={<CircleDotIcon size={'25px'} />}
          totalCount={totalPendingQuotesCount ?? 0}
          isLoading={isTotalPendingQuoteCountLoading}
        />
        <CountStatCard
          title="Rejected"
          icon={<MinusCircleIcon size={'25px'} />}
          totalCount={totalRejectedQuotesCount ?? 0}
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
        emptyStateSheetTitle="Add quote"
        emptyStateSheetDescription="Create a new quote to keep track of estimates customers request."
        EmptyStateSheetBody={AddQuoteForm}
      />
    </div>
  );
}

export const quoteColumns = [
  columnHelper.accessor('quote_number', {
    cell: ({ row }) => {
      const quote = row.original;
      return <p className="text-center text-[14px]">QT-{formatNumber(quote.quote_number)}</p>;
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quote
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor(
    (row: any) =>
      `${row.customer.first_name} ${row.customer.last_name} ${row.customer.email} ${row.quote_number} ${row.quote_status.name} ${row.service.name}`,
    {
      id: 'customer',
      cell: ({ row }: any) => {
        const quote = row.original;
        // const memojiUrl = `https://raw.githubusercontent.com/alohe/memojis/main/png/${
        //   arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
        // }`;
        return (
          <CustomerPreviewPopover
            firstName={quote.customer.first_name}
            lastName={quote.customer.last_name}
            email={quote.customer.email}
            phoneNumber={quote.customer.phone_number}
            streetAddress={quote.customer.street_address}
            city={quote.customer.city}
            state={quote.customer.state}
            zipcode={quote.customer.zipcode}
            customerId={quote.customer.id}
          />
        );
      },
      header: ({ column }) => (
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Customer
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      )
    }
  ),
  columnHelper.accessor('status_id', {
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Status
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
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
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
      </Button>
    )
  }),
  columnHelper.accessor('service', {
    id: 'service',
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Service
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
      </Button>
    ),
    cell: ({ row }: any) => {
      const quote = row.original;
      return <p className="font-[400] text-[14px]">{quote?.service?.name}</p>;
    }
  }),
  columnHelper.accessor('expiration_date', {
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Expiration
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
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
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
      </Button>
    )
  }),
  columnHelper.accessor('updated_at', {
    cell: ({ row }: any) => {
      const quote = row.original;
      return (
        <p className="font-[400] text-[14px]">
          {formatDateTimeWithAbbreviatedMonth(quote.updated_at)}
        </p>
      );
    },
    header: ({ column }) => (
      <Button
        className="px-1"
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Updated At
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="h-3 w-3 ml-2" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3 ml-2" />
        ) : null}
      </Button>
    )
  }),
  columnHelper.accessor('actions', {
    header: () => <p>Actions</p>,
    cell: ({ row }: any) => {
      const quote = row.original;
      return (
        <div className="flex gap-2">
          <UpdateQuoteSheet
            quote={quote}
            trigger={
              <Button variant={'outline'} size={'icon'}>
                <PencilIcon size={'15px'} />
              </Button>
            }
          />
          <ConnectedDeleteQuoteAlertDialog
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete quote with line-items and remove data from out servers."
            itemId={quote.quote_number}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/quotes/${quote.quote_number}`}>
                  <Button variant={'primary'} size={'icon'}>
                    <ChevronRightIcon size={'15px'} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to see details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  })
];
