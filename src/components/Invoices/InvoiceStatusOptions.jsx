import React from 'react'

const InvoiceStatusOptions = (props) => {
    const { data } = props 
    if(data?.length > 0){
        return(
            <>
                {data?.map((invoiceStatus) => (
                    <option key={invoiceStatus.id} value={invoiceStatus.id}>{invoiceStatus.name}</option>
                ))}
            </>
        )
    } else {
        return(
            <>
                <option>Data not available! ❌</option>
            </>
        )
    }
}

export default InvoiceStatusOptions