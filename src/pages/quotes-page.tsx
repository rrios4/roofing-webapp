import React from 'react'
import DefaultPageHeader from '../components/ui/page-header'

type Props = {}

export default function QuotesPage({}: Props) {
  return (
    <div className='w-full'>
        <DefaultPageHeader title='Quotes' subheading='Manage quotes and view information focused on them.' addItemTextButton='Add quote'/>
    </div>
  )
}