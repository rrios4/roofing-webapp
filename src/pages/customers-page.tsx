import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function CustomersPage({}: Props) {
  return (
    <div className='w-full'>
      <DefaultPageHeader title='Customers' subheading='Manage customers and view information focused on them.' addItemTextButton='Add customer'/>
    </div>
  )
}