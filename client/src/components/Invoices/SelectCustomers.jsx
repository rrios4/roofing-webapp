import React from 'react'
import {Box, Badge, Container, Flex, Grid, Text, Select} from "@chakra-ui/react";

function SelectCustomers(props) {
    const {menu, customers} = props;
    
    if(customers.length > 0){
        return(
            <div>
                {customers.map((customer, index) => {
                    return(
                        <option value={customer.id}>{customer.name}</option>
                    )
                })}
            </div>
        )

    } else {
        return (
            <option>No Customers!</option>
        )
    }


    return (
        <div>
            
        </div>
    )
}

export default SelectCustomers
