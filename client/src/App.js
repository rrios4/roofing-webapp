import React from 'react';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import Customers from './components/Customers/Customers';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ChakraProvider, extendTheme, Box, Flex} from "@chakra-ui/react"
import Navbar from './components/Navbar/Navbar';

const colors = {
    brand: {
        900: "#la365d",
        800: "#153e75",
        700: "#2a69ac",
    },
}
const theme = extendTheme({ colors })

const App = () => {
    return (
        <ChakraProvider theme={theme}>
                <Navbar/>
                <Flex ml='9rem' justifyContent='center' bg='gray.900'>
                    <Customers />
                    
                </Flex>
  
        </ChakraProvider>

        
    )
}

export default App
