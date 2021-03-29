import React from 'react';
import Axios from 'axios';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import Customers from './components/Customers/Customers';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {ChakraProvider, extendTheme} from "@chakra-ui/react"

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
            Roofing App
            <Customers />
        </ChakraProvider>

        
    )
}

export default App
