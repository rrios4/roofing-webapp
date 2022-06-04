import React from 'react'

// Component that dispalys options for state data from static JSON data
const StateOptions = ({states}) => {
    if(states.length > 0){
        return(
            <>
                {states.map((state, index) => (
                    <>
                        <option key={index} value={state.abbreviation}>{state.name}, {state.abbreviation}</option>
                    </>
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

export default StateOptions