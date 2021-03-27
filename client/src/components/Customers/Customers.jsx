import React from 'react';
import Grid from '@material-ui/core';

const Customers = () => {
    <main>
        <Grid container justify="center" spacing={4}>
            {products.map((customer) => (
                <Grid item key={customer.id} xs={12} sm={6} md={4} lg={3}>
                        
                    </Grid>
            ))}
        </Grid>
    </main>
}

export default Customers;
