import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import App from './App';
import theme from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ColorModeScript, ThemeProvider, ChakraProvider, CSSReset } from '@chakra-ui/react';
import {
  Login,
  Signup,
  Dashboard,
  Customers,
  EstimateRequests,
  Invoices,
  Estimates,
  CustomerDetails,
  InvoiceDetails,
  EstimateDetails
} from './pages';
import { Layout, ProtectedRoute, EmployeeEdit, Employees } from './components';
import { AuthProvider } from './hooks/useAuth';

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <ChakraProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <AuthProvider>
            <Layout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/estimate-requests"
                  element={
                    <ProtectedRoute>
                      <EstimateRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <Customers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute>
                      <Invoices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/estimates"
                  element={
                    <ProtectedRoute>
                      <Estimates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute>
                      <Employees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editcustomer/:id"
                  element={
                    <ProtectedRoute>
                      <CustomerDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editinvoice/:id"
                  element={
                    <ProtectedRoute>
                      <InvoiceDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editestimate/:id"
                  element={
                    <ProtectedRoute>
                      <EstimateDetails />
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
            </Layout>
          </AuthProvider>
        </ChakraProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
