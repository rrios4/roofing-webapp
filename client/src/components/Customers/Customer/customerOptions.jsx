import React from 'react'

const customerOptions = (props) => {
    const { customers }  = props
  return (
    <>
        {customers?.map((customer,index) => (
            <>
                <option key={customer.id} value={customer.id}>{customer.first_name} {customer.last_name} : {customer.email}</option>
            </>
        ))}
    </>
  )
}

export default customerOptions