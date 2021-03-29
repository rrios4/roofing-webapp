import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconBotton} from '@material-ui/core';
import useStyles from './styles'

const Customer = ({customer}) => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media} image='' title={customer.name}/>
            <CardContent> 
                <div className={classes.CardContent}>
                    <Typography variant="h3" gutterBottom>
                        {customer.id}
                    </Typography>
                    <Typography>
                        {customer.name}
                    </Typography>
                    <Typography>
                        {customer.phone_number}
                    </Typography>
                    <Typography>
                        {customer.email}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}

export default Customer;
