import React, {useState, useMemo, useEffect} from 'react';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import {BrowserRouter as HashRouter, Switch, Route} from 'react-router-dom';
import {ChakraProvider, extendTheme, Box, Flex, ThemeProvider, theme, ColorModeProvider, CSSReset} from "@chakra-ui/react"
import { Customers, Navbar, Invoices, Estimates, Schedules, Employees, Materials  } from "./components/";
import CustomerEdit from './components/Customers/Customer/CustomerEdit'
import DashBoard from './components/Dashboard/Dashboard'
import Customer from './components/Customers/Customer/Customer';
import InvoiceEdit from './components/Invoices/Invoice/InvoiceEdit'
import { InvoiceContext } from './components/Invoices/Invoice/InvoiceContext';

const App = () => {
    
    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <ColorModeProvider options={{
                    useSystemColorMode: false
                }}>
                    <CSSReset />
                    <ChakraProvider>
                        <Navbar/>
                        <Switch>
                        <Flex ml='9rem' justifyContent='center' >
                            <Route exact path='/' component={DashBoard}></Route>
                            <Route exact path='/customers' component={Customers}></Route>
                            <Route exaxt path='/estimates' component={Estimates}></Route>
                            <Route exact path='/schedules' component={Schedules}></Route>
                            <Route exact path='/employees' component={Employees}></Route>
                            <Route exact path='/materials' component={Materials}></Route>
                            <Route exact path='/editcustomer/:id' component={CustomerEdit}></Route>
                            <Route exact path='/editinvoice/:id' component={InvoiceEdit}></Route>
                            <Route exact path='/invoices' component={Invoices}></Route>


                        </Flex>
                        </Switch>

                    </ChakraProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </HashRouter>
    )
}

export default App
