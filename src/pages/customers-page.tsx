import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalCustomers,
  useFetchTotalResidentialCustomers,
  useFetchTotalCommercialCustomers
} from '../hooks/useAPI/useReports';
import { useFetchCustomers } from '../hooks/useAPI/useCustomers';
import { BuildingIcon, StoreIcon, UserIcon, UsersIcon } from 'lucide-react';
import CountStatCard from '../components/count-stat-card';
import DataTable from '../components/data-table';
import customerColumns from '../components/Customers/customer-table-columns.js';
import DataTableFilterCard from '../components/data-table-filter-card';
import AddCustomerForm from '../components/forms/customer-forms';

type Props = {};

export default function CustomersPage({}: Props) {
  const { customers, isLoading } = useFetchCustomers();
  const { data: totalCustomersCount, isLoading: isTotalCustomerCountLoading } =
    useFetchTotalCustomers();
  const { data: totalResidentialCustomers, isLoading: isTotalResidentialCustomersLoading } =
    useFetchTotalResidentialCustomers();
  const { data: totalCommercialCustomers, isLoading: isTotalCommercialCustomersLoading } =
    useFetchTotalCommercialCustomers();
  // React.useEffect(() => {
  //   console.log(customers);
  // }, []);

  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <DefaultPageHeader
        title="Customers"
        subheading="Manage customers and view information focused on them."
        addItemTextButton="Add customer"
        sheetTitle="Add customer"
        sheetDescription="Create a new customer to track their content."
        SheetContentBody={AddCustomerForm}
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
      <DataTable
        data={customers}
        isLoading={isLoading}
        columns={customerColumns}
        entity={'customer'}
        EntityFilterBar={DataTableFilterCard}
        activateModal={false}
        firstSelectName="Type"
        secondSelectName="State"
        thirdSelectName="Zipcode"
        filterBarEntity="customer"
        EmptyStateSheetBody={AddCustomerForm}
        emptyStateSheetTitle="Add customer"
        emptyStateSheetDescription="Create a new customer to track their content."
      />
    </div>
  );
}
