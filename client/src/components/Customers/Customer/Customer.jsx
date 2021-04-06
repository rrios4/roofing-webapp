import React from 'react';
// import { Card, CardMedia, CardContent, CardActions, Typography, IconBotton} from '@material-ui/core';
import {Box, Badge, Container, Flex, Grid} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useStyles from './styles';
import {Link} from 'react-router-dom'
import CustomerEdit from './CustomerEdit';

// const Customer = ({customer}) => {
//     //const classes = useStyles();

    

//     return (
//         <Flex p='4' justifyContent='space-between' >
//             <Box>
//                 {customer.id}
//             </Box>
//             <Box pl='12'>
//                 {customer.name}
//             </Box>
//             <Box pl='12'>
//                 {customer.email}
//             </Box>
//             <Box pl='12'>
//                 {customer.phone_number}
//             </Box>
//             <Box pl='10' ml='auto'>
//                 <Badge bg='green.300' color='black'>
//                     Active
//                 </Badge>
//             </Box>
//             <Box pl="5">
//                 <ChevronRightIcon fontSize='25px'/>
//             </Box>
//         </Flex>

//         // <Card className={classes.root}>
//         // <CardMedia className={classes.media} image='' title={customer.name}/>
//         // <CardContent> 
//         //     <div className={classes.CardContent}>
//         //         <Typography variant="h3" gutterBottom>
//         //             {customer.id}
//         //         </Typography>
//         //         <Typography>
//         //             {customer.name}
//         //         </Typography>
//         //         <Typography>
//         //             {customer.phone_number}
//         //         </Typography>
//         //         <Typography>
//         //             {customer.email}
//         //         </Typography>
//         //     </div>
//         // </CardContent>
//         // </Card>
//         // <Badge>
//         // Pending
//         // </Badge>  

//     );
// }

// export default Customer;

function Customer(props) {

    const {menu, customers} = props;

    if(customers.length > 0) {
        return(
                <Grid gap={4}>
                {customers.map((customer, index) => {
                return (
                    <Link to={`/editcustomer/${customer.id}`}>
                        <Flex p='4' justifyContent='space-between' rounded='xl' bg='gray.600' _hover={{bg: "gray.500"}} shadow='md' pt='1.5rem' pb='1.5rem'>
                            <Box key={customer.id}>
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
                    </Link>
                    

                )
            })}
                </Grid>
            

        )
    } else {
        return (
            <Flex p='4' justifyContent='space-between' >
                <Box >
                    No Customers yet!
                </Box>

        </Flex>
        )
    }

}

export default Customer;

