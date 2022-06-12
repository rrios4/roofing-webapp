import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
// import {BrowserRouter, Switch} from 'react-router-dom';
import {ChakraProvider, Flex, ThemeProvider, theme, ColorModeProvider, CSSReset} from "@chakra-ui/react"
import { Customers, Navbar, Invoices, Estimates, Employees, DashBoard  } from "./components/";
import CustomerEdit from './components/Customers/Customer/CustomerEdit'
// import DashBoard from './components/Dashboard/Dashboard'
import InvoiceEdit from './components/Invoices/Invoice/InvoiceEdit'
import EmployeeEdit from './components/Employees/Employee/EmployeeEdit';
import EstimateEdit from './components/Estimates/Estimate/EstimateEdit';
import Login from './components/Authentication/Login'
import SignUp from './components/Authentication/SignUp';
import { AuthProvider } from './components/Authentication/auth';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <ColorModeProvider options={{
                            useSystemColorMode: false
                        }}>
                        <CSSReset />
                        <ChakraProvider>
                            <Navbar/>
                            <Flex ml='9rem' justifyContent='center'>
                            <Routes>
                                    <Route path="/" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/signup" element={<SignUp/>}/>
                                    <Route path='/customers' element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
                                    <Route path='/invoices' element={<ProtectedRoute><Invoices/></ProtectedRoute>}/>
                                    <Route path='/estimates' element={<ProtectedRoute><Estimates/></ProtectedRoute>}/>
                                    <Route path='/employees' element={<ProtectedRoute><Employees/></ProtectedRoute>}/>
                                    <Route path='/editcustomer/:id' element={<ProtectedRoute><CustomerEdit/></ProtectedRoute>}/>
                                    <Route path='/editinvoice/:id' element={<ProtectedRoute><InvoiceEdit/></ProtectedRoute>}/>
                                    <Route path="/editestimate/:id" element={<ProtectedRoute><EstimateEdit/></ProtectedRoute>}/>
                                    <Route path="/editemployee/:id" element={<ProtectedRoute><EmployeeEdit/></ProtectedRoute>}/>
                            </Routes>
                            </Flex>
                        </ChakraProvider>
                        </ColorModeProvider>
                    </ThemeProvider>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
