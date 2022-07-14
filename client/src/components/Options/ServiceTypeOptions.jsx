import React from 'react'

const ServiceTypeOptions = (props) => {
    const { data } = props

    if(data?.length > 0){
        return(
            <>
                {data?.map((serviceType, index) => (
                    <option key={serviceType.id} value={serviceType.id}>{serviceType.name}</option>
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

export default ServiceTypeOptions