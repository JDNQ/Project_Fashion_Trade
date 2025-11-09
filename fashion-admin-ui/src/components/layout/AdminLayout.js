import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TagsOutlined,
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Space, Avatar } from 'antd'; // Import component AntD

const { Header, Sider, Content } = Layout;

// 1. Định nghĩa các mục menu
const menuItems = [
    {
        key: '/admin/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/admin/products',
        icon: <ShoppingCartOutlined />,
        label: 'Quản lý Sản phẩm',
    },
    {
        key: '/admin/orders',
        icon: <AppstoreOutlined />,
        label: 'Quản lý Đơn hàng',
    },
    {
        key: '/admin/users',
        icon: <UserOutlined />,
        label: 'Quản lý Người dùng',
    },
    {
        key: '/admin/categories',
        icon: <TagsOutlined />,
        label: 'Quản lý Danh mục',
    },
    {
        key: '/admin/brands',
        icon: <TagsOutlined />,
        label: 'Quản lý Thương hiệu',
    },
];

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false); // Trạng thái đóng/mở Sider
    const { logout } = useAuth();
    const navigate = useNavigate(); // Hook để điều hướng
    const location = useLocation(); // Hook để lấy đường dẫn hiện tại

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 2. Xử lý khi nhấp vào menu
    const handleMenuClick = (e) => {
        // e.key chính là đường dẫn (path) chúng ta đã định nghĩa
        navigate(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 3. Thanh Sider (Menu bên trái) */}
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: 'white', margin: 0 }}>
                        {collapsed ? 'F.A' : 'Fashion Admin'}
                    </h2>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    // Tự động chọn mục menu dựa trên URL
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick} // Gọi hàm điều hướng
                />
            </Sider>

            {/* 4. Khung chính (Header + Content) */}
            <Layout>
                {/* Header (Thanh trên cùng) */}
                <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Button type="primary" danger onClick={logout}>
                            Đăng xuất
                        </Button>
                    </Space>
                </Header>

                {/* 5. Nội dung (Trang con hiển thị ở đây) */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {/* <Outlet /> là nơi các trang con (Products, Orders...) được render */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;