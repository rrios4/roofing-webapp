import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from './components/common/theme-provider';
// import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import {
//   Login,
//   Signup,
//   Dashboard,
//   Customers,
//   QuoteRequests,
//   Invoices,
//   Quotes,
//   CustomerById,
//   InvoiceDetails,
//   QuoteById
// } from './pages';
import { Layout, ProtectedRoute } from './components';
import { AuthProvider } from './hooks/useAuth';

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient();

root.render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}
              {/* <Route path="/login" element={<Login />} /> */}
              {/* <Route path="/signup" element={<Signup />} /> */}
              {/* <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <QuoteRequests />
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
              path="/quotes"
              element={
                <ProtectedRoute>
                  <Quotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <ProtectedRoute>
                  <CustomerById />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotes/:id"
              element={
                <ProtectedRoute>
                  <QuoteById />
                </ProtectedRoute>
              }
            /> */}
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);
