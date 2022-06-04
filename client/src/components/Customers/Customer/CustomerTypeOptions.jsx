import React from 'react'

// Component that displays options for the data loaded from supabase regarding customer types for select options
const CustomerTypeOptions = ({customerTypes}) => {
    if(customerTypes.length > 0){
        return(
            <>
                {customerTypes.map((customerType, index) => (
                    <option key={customerType.id} value={customerType.id}>{customerType.name}</option>
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

export default CustomerTypeOptions