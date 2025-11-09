import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import Layout và Pages
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage'; // 1. Import
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';
// ... (Import các trang CRUD khác)
import UserListPage from '../pages/users/UserListPage';
import UserEditPage from '../pages/users/UserEditPage';
import ProductListPage from '../pages/products/ProductListPage';
import ProductCreatePage from '../pages/products/ProductCreatePage';
import ProductEditPage from '../pages/products/ProductEditPage';
import OrderListPage from '../pages/orders/OrderListPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import CategoryCreatePage from '../pages/categories/CategoryCreatePage';
import CategoryEditPage from '../pages/categories/CategoryEditPage';
import BrandListPage from '../pages/brands/BrandListPage';
import BrandCreatePage from '../pages/brands/BrandCreatePage';
import BrandEditPage from '../pages/brands/BrandEditPage';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Tuyến đường Đăng nhập */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />
                }
            />

            {/* 2. THÊM TUYẾN ĐƯỜNG ĐĂNG KÝ */}
            <Route
                path="/register"
                element={
                    isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <RegisterPage />
                }
            />

            {/* Tuyến đường Admin (được bảo vệ) */}
            <Route path="/admin" element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    {/* ... (Các tuyến đường admin khác) ... */}
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductCreatePage />} />
                    <Route path="products/edit/:id" element={<ProductEditPage />} />
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />
                    <Route path="users" element={<UserListPage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />
                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="categories/new" element={<CategoryCreatePage />} />
                    <Route path="categories/edit/:id" element={<CategoryEditPage />} />
                    <Route path="brands" element={<BrandListPage />} />
                    <Route path="brands/new" element={<BrandCreatePage />} />
                    <Route path="brands/edit/:id" element={<BrandEditPage />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                </Route>
            </Route>

            {/* Tuyến đường gốc (/) */}
            <Route
                path="/"
                element={
                    <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />
                }
            />

            <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
    );
}

export default AppRoutes;