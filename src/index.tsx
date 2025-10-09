import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from './components/common/theme-provider';
// import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import {
  CustomerPage,
  DashboardPage,
  InvoicesPage,
  JobsPage,
  LoginPage,
  QuotesPage,
  InboxPage,
  PageNotFound,
  CustomerInfoPage,
  DataManagementPage,
  ServicesManagementPage,
  StatusManagementPage
} from './pages';
import CustomerTypesPage from './pages/customer-types-page';
import ProfilePage from './pages/profile-page';
import { Layout, ProtectedRoute } from './components';
import { AuthProvider } from './hooks/useAuth';
import InvoiceInfoPage from './pages/invoice-info';
import QuoteInfoPage from './pages/quote-info';

const container = document.getElementById('app');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotes"
                element={
                  <ProtectedRoute>
                    <QuotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotes/:id"
                element={
                  <ProtectedRoute>
                    <QuoteInfoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <InvoicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/:id"
                element={
                  <ProtectedRoute>
                    <InvoiceInfoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <InboxPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:id"
                element={
                  <ProtectedRoute>
                    <CustomerInfoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-management"
                element={
                  <ProtectedRoute>
                    <DataManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-management/services"
                element={
                  <ProtectedRoute>
                    <ServicesManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-management/statuses"
                element={
                  <ProtectedRoute>
                    <StatusManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-management/customer-types"
                element={
                  <ProtectedRoute>
                    <CustomerTypesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/404" element={<PageNotFound />} />
              <Route path="*" element={<Navigate to={'/404'} />} />
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
