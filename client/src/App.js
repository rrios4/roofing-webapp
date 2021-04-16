import React, {useState, useEffect} from 'react';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import {BrowserRouter as HashRouter, Switch, Route, useHistory, Redirect} from 'react-router-dom';
import {ChakraProvider, extendTheme, Box, Flex, ThemeProvider, theme, ColorModeProvider, CSSReset} from "@chakra-ui/react"
import { Customers, Navbar, Invoices, Estimates, Schedules, Employees, Materials  } from "./components/";
import CustomerEdit from './components/Customers/Customer/CustomerEdit'
import DashBoard from './components/Dashboard/Dashboard'
import Customer from './components/Customers/Customer/Customer';
import InvoiceEdit from './components/Invoices/Invoice/InvoiceEdit'
import { InvoiceContext } from './components/Invoices/Invoice/InvoiceContext';
import EmployeeEdit from './components/Employees/Employee/EmployeeEdit';
import EstimateEdit from './components/Estimates/Estimate/EstimateEdit';
import Login from './components/Authentication/Login'

const App = () => {
    // let history = useHistory();
    // const session = () => {
    //     if(localStorage.getItem.token !== null){
    //         return(
    //             <Box>
    //                 <Route exact path='/login' component={Login}></Route>
    //                 <Redirect to='/login'/>
    //             </Box>
    //         )
    //     } else if(localStorage.getItem.token === null){
    //         return(
    //             <Box>
    //                 <Route exact path='/' component={DashBoard}></Route>
    //                 <Route exact path='/customers' component={Customers}></Route>
    //                 <Route exaxt path='/estimates' component={Estimates}></Route>
    //                 <Route exact path='/schedules' component={Schedules}></Route>
    //                 <Route exact path='/employees' component={Employees}></Route>
    //                 <Route exact path='/materials' component={Materials}></Route>
    //                 <Route exact path='/editcustomer/:id' component={CustomerEdit}></Route>
    //                 <Route exact path='/editinvoice/:id' component={InvoiceEdit}></Route>
    //                 <Route exact path='/editestimate/:id' component={EstimateEdit}></Route>
    //                 <Route exact path='/invoices' component={Invoices}></Route>
    //                 <Route exact path='/editemployee/:id' component={EmployeeEdit}></Route>
    //             </Box>
    //         )
    //     }   
    // }
    
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
                            {/* {session()} */}
                            <Route exact path='/login' component={Login}></Route>
                            <Route exact path='/' component={DashBoard}></Route>
                            <Route exact path='/customers' component={Customers}></Route>
                            <Route exaxt path='/estimates' component={Estimates}></Route>
                            <Route exact path='/schedules' component={Schedules}></Route>
                            <Route exact path='/employees' component={Employees}></Route>
                            <Route exact path='/materials' component={Materials}></Route>
                            <Route exact path='/editcustomer/:id' component={CustomerEdit}></Route>
                            <Route exact path='/editinvoice/:id' component={InvoiceEdit}></Route>
                            <Route exact path='/editestimate/:id' component={EstimateEdit}></Route>
                            <Route exact path='/invoices' component={Invoices}></Route>
                            <Route exact path='/editemployee/:id' component={EmployeeEdit}></Route>
                        </Flex>
                        </Switch>

                    </ChakraProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </HashRouter>
    )
}

export default App
