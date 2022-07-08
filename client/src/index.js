import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import { AuthProvider } from './contexts/auth';
import theme from './theme';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeScript, ThemeProvider, ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Login, Signup, Dashboard, Customers, EstimateRequests, Invoices, Estimates } from './pages'
import { Layout, ProtectedRoute, CustomerEdit, InvoiceEdit, EmployeeEdit, Employees, EstimateEdit } from './components'

ReactDOM.render(
    <AuthProvider>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CSSReset/>
                <ChakraProvider>
                <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                <Layout>
                    <Routes>
                        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/signup' element={<Signup/>}/>
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
                </Layout>
                </ChakraProvider>
            </ThemeProvider>
        </BrowserRouter>
    </AuthProvider>

, document.getElementById('root'));