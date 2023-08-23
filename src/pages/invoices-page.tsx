import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import { CheckCircleIcon, CircleDotIcon, MinusCircleIcon } from 'lucide-react';
import {
  useFetchTotalOverdueInvoices,
  useFetchTotalPaidInvoices,
  useFetchTotalPendingInvoices
} from '../hooks/useAPI/useReports';

type Props = {};

export default function InvoicesPage({}: Props) {
  const { data: totalOverdueInvoicesCount, isLoading: isTotalOverdueInvoicesLoading } = useFetchTotalOverdueInvoices();
  const { data: totalPaidInvoicesCount, isLoading: isTotalPaidInvoicesLoading } = useFetchTotalPaidInvoices();
  const { data: totalPendingInvoicesCount, isLoading: isTotalPendingInvoicesLoading } = useFetchTotalPendingInvoices();
  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Invoices"
        subheading="Manage invoices and view information focused on them."
        addItemTextButton="Add invoice"
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
    </div>
  );
}
