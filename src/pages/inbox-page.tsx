import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalClosedLeads,
  useFetchTotalNewLeads,
  useFetchTotalScheduledLeads
} from '../hooks/useAPI/useReports';
import CountStatCard from '../components/count-stat-card';
import { ArchiveIcon, CalendarIcon, InboxIcon } from 'lucide-react';
import AddCustomerForm from '../components/customer-forms';

type Props = {};

export default function InboxPage({}: Props) {
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
        addItemTextButton="Add lead request"
        sheetTitle='Add lead request'
        sheetDescription='Manually create a new lead when getting a new potential customer.'
        sheetContent={<AddCustomerForm/>}
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard title='New' totalCount={totalNewLeadsCount} icon={<InboxIcon size={'25px'}/>} isLoading={isTotalNewLeadsLoading}/>
        <CountStatCard title='Scheduled' totalCount={totalScheduledLeadsCount} isLoading={isTotalScheduledLeadsLoading} icon={<CalendarIcon size={'25px'}/>}/>
        <CountStatCard title='Closed' totalCount={totalClosedLeadsCount} isLoading={isTotalClosedLeadsLoading} icon={<ArchiveIcon size={'25px'}/>}/>
      </div>
    </div>
  );
}
