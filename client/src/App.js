import React from 'react';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import {BrowserRouter as HashRouter, Switch, Route} from 'react-router-dom';
import {ChakraProvider, extendTheme, Box, Flex, ThemeProvider, theme, ColorModeProvider, CSSReset} from "@chakra-ui/react"
import { Customers, Navbar } from "./components/";
import DashBoard from './components/Dashboard/Dashboard'

const App = () => {
    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <ColorModeProvider options={{
                    useSystemColorMode: true
                }}>
                    <CSSReset />
                    <ChakraProvider>
                        <Navbar/>
                        <Switch>
                        <Flex ml='9rem' justifyContent='center' >
                            <Route exact path='/' component={DashBoard}>
                                
                            </Route>
                            <Route exact path='/customers' component={Customers}>
                            </Route>
                        
                        </Flex>
                        </Switch>

                    </ChakraProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </HashRouter>



        
    )
}

export default App
