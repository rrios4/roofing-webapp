import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function LoginPage({}: Props) {
  return (
    <div className='flex flex-col w-full'>
        <DefaultPageHeader title='Customers' subheading='Manage all customers for you company' addItemTextButton='Add login item'/>
        <div>Test</div>
    </div>
  )
}