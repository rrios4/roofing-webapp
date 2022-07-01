import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {ChakraProvider, Flex, ThemeProvider, theme, ColorModeProvider, CSSReset} from "@chakra-ui/react"
import { Customers, Navbar, Invoices, Estimates, Employees, DashBoard, EstimateRequests  } from "./components/";
import CustomerEdit from './components/Customers/Customer/CustomerEdit'
import InvoiceEdit from './components/Invoices/Invoice/InvoiceEdit'
import EmployeeEdit from './components/Employees/Employee/EmployeeEdit';
import EstimateEdit from './components/Estimates/Estimate/EstimateEdit';
import Login from './components/Authentication/Login'
import SignUp from './components/Authentication/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
            <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <ColorModeProvider options={{
                            useSystemColorMode: false
                        }}>
                        <CSSReset />
                        <ChakraProvider>
                            <Navbar/>
                            <Flex ml={{base:'0rem', lg:'8rem'}} mt={{base:'4rem', lg:'0rem'}} justifyContent='center'>
                            <Routes>
                                    <Route path="/" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/signup" element={<SignUp/>}/>
                                    <Route path='/estimate-requests' element={<ProtectedRoute><EstimateRequests/></ProtectedRoute>}/>
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
    )
}

export default App
