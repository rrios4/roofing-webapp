import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import { CheckCircleIcon, CircleDotIcon, MinusCircleIcon } from 'lucide-react';
import {
  useFetchTotalAcceptedQuotes,
  useFetchTotalPendingQuotes,
  useFetchTotalRejectedQuotes
} from '../hooks/useAPI/useReports';

type Props = {};

export default function QuotesPage({}: Props) {
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
    </div>
  );
}
