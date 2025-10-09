import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import {
  useFetchTotalCustomers,
  useFetchTotalResidentialCustomers,
  useFetchTotalCommercialCustomers
} from '../hooks/useAPI/use-report';
import { useFetchCustomers } from '../hooks/useAPI/use-customer';
import { BuildingIcon, StoreIcon, UserIcon, UsersIcon } from 'lucide-react';
import CountStatCard from '../components/count-stat-card';
import DataTable from '../components/data-table';
import customerColumns from '../components/tables/customer-table-columns.js';
import DataTableFilterCard from '../components/data-table-filter-card';
import AddCustomerForm from '../components/forms/add-customer-form';

type Props = {};

export default function CustomersPage() {
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
          totalCount={totalCustomersCount ?? 0}
          icon={<UserIcon size={'25px'} />}
          isLoading={isTotalCustomerCountLoading}
        />
        <CountStatCard
          title="Residential"
          totalCount={totalResidentialCustomers ?? 0}
          icon={<StoreIcon size={'25px'} />}
          isLoading={isTotalResidentialCustomersLoading}
        />
        <CountStatCard
          title="Commercial"
          totalCount={totalCommercialCustomers ?? 0}
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
