import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import AddJobForm from '../components/forms/job-forms';

type Props = {};

export default function JobsPage() {
  return (
    <div className="w-full">
      <DefaultPageHeader
        title="Jobs"
        subheading="Manage multiple jobs at the same time to quickly glance all active jobs."
        addItemTextButton="Add job"
        sheetTitle="Add job"
        sheetDescription="Create a new job to start managing a new job within the company."
        SheetContentBody={AddJobForm}
      />
    </div>
  );
}
