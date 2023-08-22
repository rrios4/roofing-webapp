import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function InvoicesPage({}: Props) {
  return (
    <div className='w-full'>
        <DefaultPageHeader title='Invoices' subheading='Manage invoices and view information focused on them.' addItemTextButton='Add invoice'/>
    </div>
  )
}