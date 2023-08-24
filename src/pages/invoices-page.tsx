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
  useFetchTotalOverdueInvoices,
  useFetchTotalPaidInvoices,
  useFetchTotalPendingInvoices
} from '../hooks/useAPI/useReports';
import DataTable from '../components/data-table';
import { useFetchAllInvoices } from '../hooks/useAPI/useInvoices';
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
import { Avatar, AvatarImage } from '../components/ui/avatar';
import CustomerPreviewPopover from '../components/customer-preview-popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import AddInvoiceForm from '../components/invoice-forms';

type Props = {};
const columnHelper = createColumnHelper();

export default function InvoicesPage({}: Props) {
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
        sheetContent={<AddInvoiceForm/>}
        sheetTitle='Add invoice'
        sheetDescription='Create a new invoice to track income.'
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="Overdue"
          totalCount={totalOverdueInvoicesCount}
          icon={<MinusCircleIcon size={'25px'} />}
          isLoading={isTotalOverdueInvoicesLoading}
        />
        <CountStatCard
          title="Pending"
          icon={<CircleDotIcon size={'25px'} />}
          totalCount={totalPendingInvoicesCount}
          isLoading={isTotalPendingInvoicesLoading}
        />
        <CountStatCard
          title="Paid"
          icon={<CheckCircleIcon size={'25px'} />}
          totalCount={totalPaidInvoicesCount}
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
      />
    </div>
  );
}

const handleEditDrawer = () => {};
const deleteModalHandler = () => {};

export const invoiceTableColumns = [
  columnHelper.accessor('invoice_number', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return (
        <p className="text-center font-[800] text-[14px]">
          INV-{formatNumber(invoice.invoice_number)}
        </p>
      );
    },
    header: ({ column }) => (
      <div className="flex justify-center w-full">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Invoice
          <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
        </Button>
      </div>
    )
  }),
  columnHelper.accessor(
    (row: any) =>
      `${row.customer.first_name} ${row.customer.last_name} ${row.customer.email} ${row.invoice_number} ${row.invoice_status.name} ${row.services.name}`,
    {
      id: 'customer',
      cell: ({ row }: any) => {
        const invoice = row.original;
        const memojiUrl = `https://raw.githubusercontent.com/alohe/memojis/main/png/${
          arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
        }`;
        return (
          <CustomerPreviewPopover
            avatarUrl={memojiUrl}
            firstName={invoice.customer.first_name}
            lastName={invoice.customer.last_name}
            email={invoice.customer.email}
            phoneNumber={invoice.customer.phone_number}
            streetAddress={invoice.customer.street_address}
            city={invoice.customer.city}
            state={invoice.customer.state}
            zipcode={invoice.customer.zipcode}
            customerId={invoice.customer.id}
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
            <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
          </Button>
        </div>
      )
    }
  ),
  columnHelper.accessor('invoice_status_id', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      if (invoice.invoice_status.name === 'Paid') {
        return <DefaultStatusBadge title={invoice.invoice_status.name} variant={'green'} />;
      } else if (invoice.invoice_status.name === 'Overdue') {
        return <DefaultStatusBadge title={invoice.invoice_status.name} variant={'red'} />;
      } else if (invoice.invoice_status.name === 'Pending') {
        return <DefaultStatusBadge title={invoice.invoice_status.name} variant={'yellow'} />;
      } else {
        return <DefaultStatusBadge title={invoice.invoice_status.name} variant={'gray'} />;
      }
    },
    header: ({ column }) => (
      <div className="flex">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('invoice_date', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return (
        <p className="text-[14px] font-[400]">
          {formatDateWithAbbreviatedMonth(invoice.invoice_date)}
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
          <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('service_type_id', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>{invoice.services.name}</p>;
    },
    header: ({ column }) => (
      <div className="flex">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Service
          <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('due_date', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>{formatDateWithAbbreviatedMonth(invoice.due_date)}</p>;
    },
    header: ({ column }) => (
      <div className="flex">
        <Button
          className="px-1"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Due Date
          <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('amount_due', {
    cell: ({ row }: any) => {
      const invoice = row.original;
      return <p>${formatMoneyValue(invoice.amount_due)}</p>;
    },
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            className="px-1"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Balance
            <ArrowUpDownIcon className="h-4 w-4 ml-4" size={'15px'} />
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'secondary'}
                  className="px-3"
                  onClick={() => handleEditDrawer(invoice)}>
                  <PencilIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={'secondary'}
                  className="px-3"
                  onClick={() => deleteModalHandler(invoice.id, invoice.invoice_number)}>
                  <TrashIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link to={`/invoices/${invoice.invoice_number}`}>
                  <Button className="px-3" variant={'secondary'}>
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
