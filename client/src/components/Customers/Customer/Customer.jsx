import React from 'react';
// import { Card, CardMedia, CardContent, CardActions, Typography, IconBotton} from '@material-ui/core';
import {Box, Badge, Container, Flex} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useStyles from './styles';

const Customer = ({customer}) => {
    //const classes = useStyles();
    return (
        <Flex p='4' justifyContent='space-between' >
            <Box>
                {customer.id}
            </Box>
            <Box pl='12'>
                {customer.name}
            </Box>
            <Box pl='12'>
                {customer.email}
            </Box>
            <Box pl='12'>
                {customer.phone_number}
            </Box>
            <Box pl='10' ml='auto'>
                <Badge bg='green.300' color='black'>
                    Active
                </Badge>
            </Box>
            <Box pl="5">
                <ChevronRightIcon fontSize='25px'/>
            </Box>
        </Flex>

        // <Card className={classes.root}>
        // <CardMedia className={classes.media} image='' title={customer.name}/>
        // <CardContent> 
        //     <div className={classes.CardContent}>
        //         <Typography variant="h3" gutterBottom>
        //             {customer.id}
        //         </Typography>
        //         <Typography>
        //             {customer.name}
        //         </Typography>
        //         <Typography>
        //             {customer.phone_number}
        //         </Typography>
        //         <Typography>
        //             {customer.email}
        //         </Typography>
        //     </div>
        // </CardContent>
        // </Card>
        // <Badge>
        // Pending
        // </Badge>  

    );
}

export default Customer;
