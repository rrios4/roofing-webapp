import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import {
  Customers,
  Navbar,
  Invoices,
  Estimates,
  Employees,
  DashBoard,
  EstimateRequests
} from './components/';
import CustomerEdit from './components/Customers/Customer/CustomerEdit';
import InvoiceEdit from './components/Invoices/Invoice/InvoiceEdit';
import EmployeeEdit from './components/Employees/Employee/EmployeeEdit';
import EstimateEdit from './components/Estimates/Estimate/EstimateEdit';
import Login from './components/Authentication/Login';
import SignUp from './components/Authentication/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Flex
          ml={{ base: '0rem', lg: '8rem' }}
          mt={{ base: '4rem', lg: '0rem' }}
          justifyContent="center">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            {/* Login Page */}
            <Route path="/login" element={<Login />} />
            {/* Register Page */}
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/estimate-requests"
              element={
                <ProtectedRoute>
                  <EstimateRequests />
                </ProtectedRoute>
              }
            />
            {/* Customers Page */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            {/* Invoices Page */}
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            {/* Quotes Page */}
            <Route
              path="/estimates"
              element={
                <ProtectedRoute>
                  <Estimates />
                </ProtectedRoute>
              }
            />
            {/* Employees Page */}
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            {/* Edit Customer by ID Page */}
            <Route
              path="/editcustomer/:id"
              element={
                <ProtectedRoute>
                  <CustomerEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editinvoice/:id"
              element={
                <ProtectedRoute>
                  <InvoiceEdit />
                </ProtectedRoute>
              }
            />
            {/* Edit Quote By ID Page */}
            <Route
              path="/editestimate/:id"
              element={
                <ProtectedRoute>
                  <EstimateEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editemployee/:id"
              element={
                <ProtectedRoute>
                  <EmployeeEdit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Flex>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
