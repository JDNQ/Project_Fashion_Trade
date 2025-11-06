import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import Layout và Pages
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';

// Import các trang CRUD
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
            {/* Tuyến đường Đăng nhập:
              - Nếu đã đăng nhập, tự động chuyển đến /admin
              - Nếu chưa, hiển thị LoginPage
            */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />
                }
            />

            {/* Tuyến đường Admin (được bảo vệ):
              - Yêu cầu phải đăng nhập (thông qua PrivateRoute)
              - Sử dụng chung AdminLayout (Sidebar/Navbar)
            */}
            <Route path="/admin" element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>

                    {/* Dashboard */}
                    <Route path="dashboard" element={<DashboardPage />} />

                    {/* Quản lý Sản phẩm */}
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductCreatePage />} />
                    <Route path="products/edit/:id" element={<ProductEditPage />} />

                    {/* Quản lý Đơn hàng */}
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />

                    {/* Quản lý Người dùng */}
                    <Route path="users" element={<UserListPage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />

                    {/* Quản lý Danh mục */}
                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="categories/new" element={<CategoryCreatePage />} />
                    <Route path="categories/edit/:id" element={<CategoryEditPage />} />

                    {/* Quản lý Thương hiệu */}
                    <Route path="brands" element={<BrandListPage />} />
                    <Route path="brands/new" element={<BrandCreatePage />} />
                    <Route path="brands/edit/:id" element={<BrandEditPage />} />

                    {/* Trang mặc định khi vào /admin là /admin/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                </Route>
            </Route>

            {/* Tuyến đường gốc (/):
              - Nếu đã đăng nhập, vào /admin
              - Nếu chưa, vào /login
            */}
            <Route
                path="/"
                element={
                    <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />
                }
            />

            {/* Trang 404 Not Found */}
            <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
    );
}

export default AppRoutes;