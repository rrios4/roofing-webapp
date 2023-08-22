import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalCustomers,
  useFetchTotalResidentialCustomers,
  useFetchTotalCommercialCustomers
} from '../hooks/useAPI/useReports.jsx';
import { BuildingIcon, StoreIcon, UserIcon } from 'lucide-react';
import CountStatCard from '../components/count-stat-card';

type Props = {};

export default function CustomersPage({}: Props) {
  const { data: totalCustomersCount, isLoading: isTotalCustomerCountLoading } =
    useFetchTotalCustomers();
  const { data: totalResidentialCustomers, isLoading: isTotalResidentialCustomersLoading } =
    useFetchTotalResidentialCustomers();
  const { data: totalCommercialCustomers, isLoading: isTotalCommercialCustomersLoading } =
    useFetchTotalCommercialCustomers();
  React.useEffect(() => {
    console.log(totalCustomersCount);
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
      <DefaultPageHeader
        title="Customers"
        subheading="Manage customers and view information focused on them."
        addItemTextButton="Add customer"
      />
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <CountStatCard
          title="Total Customers"
          totalCount={totalCustomersCount}
          icon={<UserIcon size={'25px'} />}
          isLoading={isTotalCustomerCountLoading}
        />
        <CountStatCard
          title="Residential"
          totalCount={totalResidentialCustomers}
          icon={<StoreIcon size={'25px'} />}
          isLoading={isTotalResidentialCustomersLoading}
        />
        <CountStatCard
          title="Commercial"
          totalCount={totalCommercialCustomers}
          icon={<BuildingIcon size={'25px'} />}
          isLoading={isTotalCommercialCustomersLoading}
        />
      </div>
    </div>
  );
}
