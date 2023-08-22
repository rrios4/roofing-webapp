import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function JobsPage({}: Props) {
  return (
    <div className='w-full'>
        <DefaultPageHeader title='Jobs' subheading='Manage multiple jobs at the same time to quickly glance all active jobs.' addItemTextButton='Add job'/>
    </div>
  )
}