import React from 'react';
// 1. Đảm bảo import 'Link' và 'Outlet' từ 'react-router-dom'
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// (Styles - giữ nguyên)
const layoutStyle = { display: 'flex', minHeight: '100vh' };
const sidebarStyle = { width: '220px', background: '#2c3e50', color: 'white', padding: '20px' };
const navLinkStyle = { color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' };
const contentStyle = { flex: 1, padding: '20px' };
const headerStyle = { background: '#f4f4f4', padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #ddd' };


function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div style={layoutStyle}>
            {/* 2. Đảm bảo đây là component <Link> (chữ L viết hoa) */}
            <nav style={sidebarStyle}>
                <h3>Fashion Admin</h3>
                <Link to="/admin/dashboard" style={navLinkStyle}>Dashboard</Link>
                <Link to="/admin/products" style={navLinkStyle}>Quản lý Sản phẩm</Link>
                <Link to="/admin/orders" style={navLinkStyle}>Quản lý Đơn hàng</Link>
                <Link to="/admin/users" style={navLinkStyle}>Quản lý Người dùng</Link>
                <Link to="/admin/categories" style={navLinkStyle}>Quản lý Danh mục</Link>
                <Link to="/admin/brands" style={navLinkStyle}>Quản lý Thương hiệu</Link>
            </nav>

            <div style={contentStyle}>
                <header style={headerStyle}>
                    <button onClick={logout}>Đăng xuất</button>
                </header>

                {/* 3. Đảm bảo bạn có <Outlet /> ở đây.
                       Nếu thiếu, trang sẽ luôn luôn trắng */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;