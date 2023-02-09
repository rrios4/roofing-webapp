import React from 'react'

const QuoteRequestStatusOptions = (props) => {
    const { data } = props 
    if(data?.length > 0){
        return(
            <>
                {data?.map((quoteRequestStatus, index) => (
                    <option key={index} value={quoteRequestStatus.id}>{quoteRequestStatus.name}</option>
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

export default QuoteRequestStatusOptions