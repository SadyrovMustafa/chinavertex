import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './admin/AdminLayout';
import { ClientRoute, AdminRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { MyRequests } from './pages/MyRequests';
import { MyOrders } from './pages/MyOrders';
import { Favorites } from './pages/Favorites';
import { Sourcing } from './pages/Sourcing';
import { Cases } from './pages/Cases';
import { FAQ } from './pages/FAQ';
import { Payments } from './pages/Payments';
import { Messages } from './pages/Messages';

import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminUsers } from './admin/AdminUsers';
import { AdminRequests } from './admin/AdminRequests';
import { AdminOrders } from './admin/AdminOrders';
import { AdminPayments } from './admin/AdminPayments';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminTemplates } from './admin/AdminTemplates';
import { AdminSuppliers } from './admin/AdminSuppliers';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/dashboard"
              element={
                <ClientRoute>
                  <Dashboard />
                </ClientRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ClientRoute>
                  <MyRequests />
                </ClientRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ClientRoute>
                  <MyOrders />
                </ClientRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ClientRoute>
                  <Favorites />
                </ClientRoute>
              }
            />
            <Route path="/sourcing" element={<Sourcing />} />
            <Route
              path="/payments"
              element={
                <ClientRoute>
                  <Payments />
                </ClientRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ClientRoute>
                  <Messages />
                </ClientRoute>
              }
            />
          </Route>

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'bg-surface-800 border border-zinc-700 text-zinc-100',
          },
        }}
      />
    </>
  );
}
