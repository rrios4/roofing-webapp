import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CircleDotIcon,
  MinusCircleIcon,
  PencilIcon
} from 'lucide-react';
import {
  useFetchTotalOverdueInvoices,
  useFetchTotalPaidInvoices,
  useFetchTotalPendingInvoices
} from '../hooks/useAPI/use-report';
import DataTable from '../components/data-table';
import { useFetchAllInvoices } from '../hooks/useAPI/use-invoice';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDateWithAbbreviatedMonth, formatMoneyValue, formatNumber } from '../lib/utils';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import { Link } from 'react-router-dom';

import CustomerPreviewPopover from '../components/customer-preview-popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import AddInvoiceForm from '../components/forms/add-invoice-form';
import UpdateInvoiceSheet from '../components/forms/update-invoice-sheet';
import { ConnectedDeleteInvoiceAlertDialog } from '../components/connected-delete-dialogs';
import RecordPaymentDialog from '../components/record-payment-dialog';

type Props = {};
const columnHelper = createColumnHelper<any>();

export default function InvoicesPage() {
  const { data: invoices, isLoading: isInvoicesLoading } = useFetchAllInvoices();
  const { data: totalOverdueInvoicesCount, isLoading: isTotalOverdueInvoicesLoading } =
    useFetchTotalOverdueInvoices();
  const { data: totalPaidInvoicesCount, isLoading: isTotalPaidInvoicesLoading } =
    useFetchTotalPaidInvoices();
  const { data: totalPendingInvoicesCount, isLoading: isTotalPendingInvoicesLoading } =
    useFetchTotalPendingInvoices();
  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Invoices"
        subheading="Manage invoices and view information focused on them."
        addItemTextButton="Add invoice"
        SheetContentBody={AddInvoiceForm}
        sheetTitle="Add invoice"
        sheetDescription="Create a new invoice to track income."
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="Overdue"
          totalCount={totalOverdueInvoicesCount ?? 0}
          icon={<MinusCircleIcon size={'25px'} />}
          isLoading={isTotalOverdueInvoicesLoading}
        />
        <CountStatCard
          title="Pending"
          icon={<CircleDotIcon size={'25px'} />}
          totalCount={totalPendingInvoicesCount ?? 0}
          isLoading={isTotalPendingInvoicesLoading}
        />
        <CountStatCard
          title="Paid"
          icon={<CheckCircleIcon size={'25px'} />}
          totalCount={totalPaidInvoicesCount ?? 0}
          isLoading={isTotalPaidInvoicesLoading}
        />
      </div>
      <DataTable
        entity="invoice"
        data={invoices}
        isLoading={isInvoicesLoading}
        EntityFilterBar={DataTableFilterCard}
        firstSelectName="Status"
        secondSelectName="Service Type"
        thirdSelectName="Customer"
        filterBarEntity="customer"
        activateModal={false}
        columns={invoiceTableColumns}
        EmptyStateSheetBody={AddInvoiceForm}
        emptyStateSheetTitle="Add invoice"
        emptyStateSheetDescription="Create a new invoice to track income."
      />
    </div>
  );
}

const deleteModalHandler = (itemId: any, itemNumber: any) => {};

export const invoiceTableColumns = [
  columnHelper.accessor('invoice_number', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return (
        <p className="text-center text-[14px]">INV-{formatNumber(invoice.invoice_number || 0)}</p>
      );
    },
    header: ({ column }) => (
      <div className="flex justify-center w-full">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Invoice
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
      `${row.customer?.first_name || ''} ${row.customer?.last_name || ''} ${row.customer?.email || ''} ${row.invoice_number || ''} ${row.invoice_status?.name || ''} ${row.service?.name || ''}`,
    {
      id: 'customer',
      cell: ({ row }: any) => {
        const invoice = row.original;
        // const memojiUrl = `https://raw.githubusercontent.com/alohe/memojis/main/png/${
        //   arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
        // }`;
        return (
          <CustomerPreviewPopover
            // avatarUrl={memojiUrl}
            firstName={invoice.customer?.first_name || ''}
            lastName={invoice.customer?.last_name || ''}
            email={invoice.customer?.email || ''}
            phoneNumber={invoice.customer?.phone_number || ''}
            streetAddress={invoice.customer?.street_address || ''}
            city={invoice.customer?.city || ''}
            state={invoice.customer?.state || ''}
            zipcode={invoice.customer?.zipcode || ''}
            customerId={invoice.customer?.id || 0}
          />
        );
      },
      header: ({ column }) => (
        <div className="flex">
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
        </div>
      )
    }
  ),
  columnHelper.accessor('invoice_status_id', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      const statusName = invoice.invoice_status?.name || 'Unknown';
      if (statusName === 'Paid') {
        return <DefaultStatusBadge title={statusName} variant={'green'} />;
      } else if (statusName === 'Overdue') {
        return <DefaultStatusBadge title={statusName} variant={'red'} />;
      } else if (statusName === 'Pending') {
        return <DefaultStatusBadge title={statusName} variant={'yellow'} />;
      } else {
        return <DefaultStatusBadge title={statusName} variant={'gray'} />;
      }
    },
    header: ({ column }) => (
      <div className="flex">
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
      </div>
    )
  }),
  columnHelper.accessor('invoice_date', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return (
        <p className="text-[14px] font-[400]">
          {invoice.invoice_date ? formatDateWithAbbreviatedMonth(invoice.invoice_date) : 'N/A'}
        </p>
      );
    },
    header: ({ column }) => (
      <div className="flex">
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
      </div>
    )
  }),
  columnHelper.accessor('service_type_id', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>{invoice.service?.name || 'Unknown Service'}</p>;
    },
    header: ({ column }) => (
      <div className="flex">
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
      </div>
    )
  }),
  columnHelper.accessor('due_date', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>{invoice.due_date ? formatDateWithAbbreviatedMonth(invoice.due_date) : 'N/A'}</p>;
    },
    header: ({ column }) => (
      <div className="flex">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Due Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('total', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>${formatMoneyValue(invoice.total || 0)}</p>;
    },
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            className="px-0"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Total
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3 ml-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3 ml-2" />
            ) : null}
          </Button>
        </div>
      );
    }
  }),
  columnHelper.accessor('amount_due', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>${formatMoneyValue(invoice.amount_due || 0)}</p>;
    },
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            className="px-1"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Balance Due
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3 ml-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3 ml-2" />
            ) : null}
          </Button>
        </div>
      );
    }
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return (
        <div className="flex gap-2">
          <UpdateInvoiceSheet
            invoice={invoice}
            trigger={
              <Button variant={'outline'} className="px-3">
                <PencilIcon size={'15px'} />
              </Button>
            }
          />
          <RecordPaymentDialog invoice={invoice} />
          <ConnectedDeleteInvoiceAlertDialog
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete invoice with line-items/payments and remove data from our server."
            itemId={invoice.invoice_number}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/invoices/${invoice.invoice_number}`}>
                  <Button className="px-3" variant={'primary'}>
                    <ChevronRightIcon size={'15px'} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to see details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    header: () => <p>Actions</p>
  })
];
