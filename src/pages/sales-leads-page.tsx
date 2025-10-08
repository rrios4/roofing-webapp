import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalClosedLeads,
  useFetchTotalNewLeads,
  useFetchTotalScheduledLeads
} from '../hooks/useAPI/use-report';
import CountStatCard from '../components/count-stat-card';
import {
  ArchiveIcon,
  ArrowDownIcon,
  // ArrowUpDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  InboxIcon,
  PencilIcon,
  UserPlusIcon
} from 'lucide-react';
import AddLeadRequestForm from '../components/forms/add-inbox-forms';
import DataTable from '../components/data-table';
import { useFetchAllQuoteRequests } from '../hooks/useAPI/use-qr';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import { arrayOfMemojiFileNames, formatDateWithAbbreviatedMonth, formatNumber } from '../lib/utils';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import CustomerPreviewPopover from '../components/customer-preview-popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import ConnectedDeleteQRequestAlertDialog from '../components/connected-delete-dialogs';

type Props = {};

const columnHelper = createColumnHelper<any>();

export default function InboxPage() {
  const { data: quoteRequests, isLoading: isQuoteRequestLoading } = useFetchAllQuoteRequests();
  const { data: totalNewLeadsCount, isLoading: isTotalNewLeadsLoading } = useFetchTotalNewLeads();
  const { data: totalScheduledLeadsCount, isLoading: isTotalScheduledLeadsLoading } =
    useFetchTotalScheduledLeads();
  const { data: totalClosedLeadsCount, isLoading: isTotalClosedLeadsLoading } =
    useFetchTotalClosedLeads();
  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Sales Leads"
        subheading="Manage and view all lead requests from website here."
        addItemTextButton="Add request"
        sheetTitle="Add request"
        sheetDescription="Manually create a new lead when getting a new potential customer."
        SheetContentBody={AddLeadRequestForm}
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="New"
          totalCount={totalNewLeadsCount ?? 0}
          icon={<InboxIcon size={'25px'} />}
          isLoading={isTotalNewLeadsLoading}
        />
        <CountStatCard
          title="Scheduled"
          totalCount={totalScheduledLeadsCount ?? 0}
          isLoading={isTotalScheduledLeadsLoading}
          icon={<CalendarIcon size={'25px'} />}
        />
        <CountStatCard
          title="Closed"
          totalCount={totalClosedLeadsCount ?? 0}
          isLoading={isTotalClosedLeadsLoading}
          icon={<ArchiveIcon size={'25px'} />}
        />
      </div>
      <DataTable
        entity="lead"
        isLoading={isQuoteRequestLoading}
        data={quoteRequests}
        activateModal={false}
        firstSelectName="Status"
        secondSelectName="Service Type"
        thirdSelectName="Customer Type"
        EntityFilterBar={DataTableFilterCard}
        columns={leadsTableColumns}
        filterBarEntity="customer"
        EmptyStateSheetBody={AddLeadRequestForm}
        emptyStateSheetTitle="Add request"
        emptyStateSheetDescription="Manually create a new lead when getting a new potential customer."
      />
    </div>
  );
}

const handleEdit = (object: any) => {};
const handleEmailValidation = (object: any) => {};

const leadsTableColumns = [
  columnHelper.accessor('id', {
    cell: ({ row }) => (
      <p className="text-center text-[14px]">RQ-{formatNumber(row.getValue('id'))}</p>
    ),
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Request
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
    (row) =>
      `${row.firstName} ${row.lastName} ${row.streetAddress} ${row.city} ${row.zipcode} ${row.state} ${row.email} ${row.phone_number}`,
    {
      id: 'customer',
      cell: ({ row }) => {
        const lead = row.original;
        // const memojiUrl = `https://raw.githubusercontent.com/alohe/memojis/main/png/${
        //   arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
        // }`;
        return (
          <CustomerPreviewPopover
            // avatarUrl={memojiUrl}
            firstName={lead.firstName}
            lastName={lead.lastName}
            email={lead.email}
            phoneNumber={lead.phone_number}
            streetAddress={lead.streetAddress}
            state={lead.state}
            city={lead.city}
            zipcode={lead.zipcode}
            customerId={lead.id}
          />
          // <div className='flex gap-3'>

          //   <Avatar
          //     my={'auto'}
          //     size={'sm'}
          //     name={`${lead.firstName} ${lead.lastName}`}
          //     bg={avatarBgColor}
          //     textColor={avatarTextColor}
          //   />
          //   <Flex flexDir={'column'} gap={1} fontSize={'14px'}>
          //     <Flex gap={1} fontWeight={500} fontSize={'xs'}>
          //       <Text>{lead.firstName}</Text>
          //       <Text>{lead.lastName}</Text>
          //     </Flex>
          //     <Text fontWeight={400} fontSize={'xs'}>
          //       {lead.email}
          //     </Text>
          //     <Flex
          //       fontWeight={400}
          //       gap={1}
          //       fontSize={'xs'}
          //       onClick={() =>
          //         window.open(
          //           `https://www.google.com/maps/search/?api=1&query=${lead.streetAddress}+${lead.city}+${lead.state}+${lead.zipcode}`
          //         )
          //       }
          //       cursor={'pointer'}
          //       _hover={{ textColor: 'blue.500' }}>
          //       <Text>{lead.streetAddress}</Text>
          //       <Text>{lead.city},</Text>
          //       <Text>{lead.state}</Text>
          //       <Text>{lead.zipcode}</Text>
          //     </Flex>
          //     <Text fontSize={'xs'}>{lead.phone_number}</Text>
          //   </Flex>
          // </div>
        );
      },
      header: ({ column }) => (
        <div className="w-full flex">
          <Button
            className="px-0"
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Requestor
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
  columnHelper.accessor('est_request_status_id', {
    cell: ({ row }) => {
      const lead = row.original;
      if (lead.status?.name === 'New') {
        return <DefaultStatusBadge title={lead.status.name} variant={'green'} />;
      } else if (lead.status?.name === 'Scheduled') {
        return <DefaultStatusBadge title={lead.status.name} variant={'yellow'} />;
      } else if (lead.status?.name === 'Pending') {
        return <DefaultStatusBadge title={lead.status.name} variant={'yellow'} />;
      } else if (lead.status?.name === 'Closed') {
        return <DefaultStatusBadge title={lead.status.name} variant={'red'} />;
      } else {
        return <DefaultStatusBadge title={lead.status?.name || 'Unknown'} variant="gray" />;
      }
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
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
  columnHelper.accessor('requested_date', {
    cell: ({ row }) => {
      return <p>{formatDateWithAbbreviatedMonth(row.getValue('requested_date'))}</p>;
    },
    header: ({ column }) => (
      <div className="w-full flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Desired Date
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
    cell: ({ row }) => {
      const lead = row.original;
      return <p>{lead.service?.name}</p>;
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
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
  columnHelper.accessor('customer_typeID', {
    cell: ({ row }) => {
      const lead = row.original;
      if (lead.customer_type.name === 'Residential') {
        return <DefaultStatusBadge title={lead.customer_type.name} variant={'blue'} />;
      } else if (lead.customer_type.name === 'Commercial') {
        return <DefaultStatusBadge title={lead.customer_type.name} variant={'green'} />;
      } else {
        return <DefaultStatusBadge title={lead.customer_type.name} variant={'gray'} />;
      }
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Type
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('created_at', {
    cell: ({ row }) => {
      return <p>{new Date(row.getValue('created_at')).toLocaleString()}</p>;
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Entry Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon className="h-3 w-3 ml-2" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon className="h-3 w-3 ml-2" />
          ) : null}
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('actions', {
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="p-3 rounded-md bg-secondary"
                onClick={() => handleEdit(lead)}>
                <PencilIcon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ConnectedDeleteQRequestAlertDialog
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete lead request and remove data from out servers."
            itemId={lead.id}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="p-3 rounded-md bg-secondary h-full"
                onClick={() => handleEmailValidation(lead)}>
                <UserPlusIcon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>Add as a customer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  })
];
