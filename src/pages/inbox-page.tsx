import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function InboxPage({}: Props) {
  return (
    <div className='w-full'>
        <DefaultPageHeader title='Inbox' subheading='Manage and view all lead requests from website here.' addItemTextButton='Add lead request'/>
    </div>
  )
}