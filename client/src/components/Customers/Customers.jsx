import React from 'react';
import {Grid} from '@material-ui/core';
import Customer from './Customer/Customer'

const customers = [
    {id: 1, name: 'Jonh Den', email: 'johnden123@gmail.com', phone_number: '883-229-1212'},
    {id: 2, name: 'Sunny Den', email: 'sunnyden123@gmail.com', phone_number: '883-229-1122'}
]

const Customers = () => {
    return (
        <main>
        <Grid container justify="center" spacing={4}>
            {customers.map((customer) => (
                <Grid item key={customer.id} xs={12} sm={6} md={4} lg={3}>
                        <Customer customer={customer} />
                </Grid>
            ))}
        </Grid>
    </main>
    )

}

export default Customers;
