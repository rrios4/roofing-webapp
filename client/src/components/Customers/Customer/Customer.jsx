import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconBotton} from '@material-ui/core';
import {Box, Badge, Container} from "@chakra-ui/react"
import useStyles from './styles'

const Customer = ({customer}) => {
    const classes = useStyles();
    return (
        <Container>
            <Box>
                {customer.id}
            </Box>
            <Box>
                {customer.name}
            </Box>
            <Box>
                {customer.phone_number}
            </Box>
            <Badge>
                Pending
            </Badge>
            {/* <Card className={classes.root}>
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
            <Badge>
                Pending
            </Badge> */}
        </Container>

    );
}

export default Customer;
