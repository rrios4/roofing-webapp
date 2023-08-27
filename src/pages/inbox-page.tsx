import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalClosedLeads,
  useFetchTotalNewLeads,
  useFetchTotalScheduledLeads
} from '../hooks/useAPI/useReports';
import CountStatCard from '../components/count-stat-card';
import {
  ArchiveIcon,
  ArrowUpDown,
  ArrowUpDownIcon,
  CalendarIcon,
  InboxIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon
} from 'lucide-react';
import AddLeadRequestForm from '../components/inbox-forms';
import DataTable from '../components/data-table';
import { useFetchAllQuoteRequests } from '../hooks/useAPI/useQuoteRequests';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import { arrayOfMemojiFileNames, formatDateWithAbbreviatedMonth, formatNumber } from '../lib/utils';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import CustomerPreviewPopover from '../components/customer-preview-popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

type Props = {};

const columnHelper = createColumnHelper<any>();

export default function InboxPage({}: Props) {
  const { data: quoteRequests, isLoading: isQuoteRequestLoading } = useFetchAllQuoteRequests();
  const { data: totalNewLeadsCount, isLoading: isTotalNewLeadsLoading } = useFetchTotalNewLeads();
  const { data: totalScheduledLeadsCount, isLoading: isTotalScheduledLeadsLoading } =
    useFetchTotalScheduledLeads();
  const { data: totalClosedLeadsCount, isLoading: isTotalClosedLeadsLoading } =
    useFetchTotalClosedLeads();
  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Inbox"
        subheading="Manage and view all lead requests from website here."
        addItemTextButton="Add request"
        sheetTitle="Add lead request"
        sheetDescription="Manually create a new lead when getting a new potential customer."
        SheetContentBody={AddLeadRequestForm}
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="New"
          totalCount={totalNewLeadsCount}
          icon={<InboxIcon size={'25px'} />}
          isLoading={isTotalNewLeadsLoading}
        />
        <CountStatCard
          title="Scheduled"
          totalCount={totalScheduledLeadsCount}
          isLoading={isTotalScheduledLeadsLoading}
          icon={<CalendarIcon size={'25px'} />}
        />
        <CountStatCard
          title="Closed"
          totalCount={totalClosedLeadsCount}
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
      />
    </div>
  );
}

const handleEdit = (object: any) => {};
const handleDeleteAlert = (itemId: any) => {};
const handleEmailValidation = (object: any) => {};

const leadsTableColumns = [
  columnHelper.accessor('id', {
    cell: ({ row }) => (
      <p className="text-center font-[800] text-[14px]">RQ-{formatNumber(row.getValue('id'))}</p>
    ),
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Request
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
        </Button>
      </div>
    )
  }),
  columnHelper.accessor(
    (row) =>
      `${row.firstName} ${row.lastName} ${row.streetAddress} ${row.city} ${row.zipcode} ${row.state} ${row.email} ${row.phone_number}`,
    {
      id: 'requestor',
      cell: ({ row }) => {
        const lead = row.original;
        const memojiUrl = `https://raw.githubusercontent.com/alohe/memojis/main/png/${
          arrayOfMemojiFileNames[Math.floor(Math.random() * arrayOfMemojiFileNames.length)]
        }`;
        return (
          <CustomerPreviewPopover
            avatarUrl={memojiUrl}
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
            <div className="h-4 w-4 ml-2">
              <ArrowUpDownIcon size={'15px'} />
            </div>
          </Button>
        </div>
      )
    }
  ),
  columnHelper.accessor('est_request_status_id', {
    cell: ({ row }) => {
      const lead = row.original;
      if (lead.estimate_request_status.name === 'New') {
        return <DefaultStatusBadge title={lead.estimate_request_status.name} variant={'green'} />;
      } else if (lead.estimate_request_status.name === 'Scheduled') {
        return <DefaultStatusBadge title={lead.estimate_request_status.name} variant={'yellow'} />;
      } else if (lead.estimate_request_status.name === 'Pending') {
        return <DefaultStatusBadge title={lead.estimate_request_status.name} variant={'yellow'} />;
      } else if (lead.estimate_request_status.name === 'Closed') {
        return <DefaultStatusBadge title={lead.estimate_request_status.name} variant={'red'} />;
      } else {
        return <DefaultStatusBadge title={lead.estimate_request_status.name} variant="gray" />;
      }
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
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
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
        </Button>
      </div>
    )
  }),
  columnHelper.accessor('service_type_id', {
    cell: ({ row }) => {
      const lead = row.original;
      return <p>{lead.services.name}</p>;
    },
    header: ({ column }) => (
      <div className="w-full justify-center flex">
        <Button
          className="px-0"
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Service
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
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
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
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
          <div className="h-4 w-4 ml-2">
            <ArrowUpDownIcon size={'15px'} />
          </div>
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
              <TooltipTrigger asChild>
                <Button variant={'secondary'} className="px-3" onClick={() => handleEdit(lead)}>
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
                  onClick={() => handleDeleteAlert(lead.id)}>
                  <TrashIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="px-3"
                  variant={'secondary'}
                  onClick={() => handleEmailValidation(lead)}>
                  <UserPlusIcon size={'15px'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add as a customer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  })
];
