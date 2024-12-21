import React from 'react';
import DefaultPageHeader, { DashboardPageHeader } from '../components/ui/page-header';

type Props = {};

export default function DashboardPage({}: Props) {
  return (
    <div className="w-full">
      {/* <DefaultPageHeader title='Overview' subheading='A glance at statistics from all the data in our system.' addItemTextButton='Add'/> */}
      <DashboardPageHeader />
    </div>
  );
}
