import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import OrderService from '../../services/OrderService';
import { Table, Button, Space, Tag, Typography, Popconfirm } from 'antd'; // Import component AntD
import { EyeOutlined } from '@ant-design/icons'; // Import icons

const { Title } = Typography;

// (Các hàm tiện ích - nên chuyển vào /utils/helpers.js)
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

function OrderListPage() {
    const navigate = useNavigate(); // Hook để điều hướng

    // 1. State cho dữ liệu
    const [orders, setOrders] = useState([]);

    // 2. State cho phân trang (Table tự quản lý)
    const [pagination, setPagination] = useState({
        current: 1, // AntD Table bắt đầu từ 1
        pageSize: 10,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Hàm fetch dữ liệu (Cập nhật cho AntD)
    const fetchOrders = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(null);

            // Chuyển đổi (AntD page 1 = Spring Page 0)
            const springPage = page - 1;
            const data = await OrderService.getAllOrders(springPage, pageSize, "createdAt,desc");

            setOrders(data.content);
            setPagination({
                current: data.number + 1,
                pageSize: data.size,
                total: data.totalElements, // Tổng số phần tử
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. useEffect: Tải dữ liệu khi mount
    useEffect(() => {
        fetchOrders(pagination.current, pagination.pageSize);
    }, []); // Chỉ tải 1 lần khi mount

    // 5. Xử lý khi Table thay đổi (đổi trang, sắp xếp...)
    const handleTableChange = (newPagination) => {
        fetchOrders(newPagination.current, newPagination.pageSize);
    };

    // 6. Định nghĩa các cột (columns) cho Table
    const columns = [
        {
            title: 'Mã ĐH',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'shippingName',
            key: 'shippingName',
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    <small>{record.userEmail}</small>
                </div>
            )
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDate(text),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Trạng thái ĐH',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status) => {
                let color = 'geekblue';
                if (status === 'Delivered') color = 'green';
                if (status === 'Cancelled') color = 'red';
                if (status === 'Shipped') color = 'orange';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Trạng thái TT',
            dataIndex: 'payStatus',
            key: 'payStatus',
            render: (status) => (
                <Tag color={status === 'Paid' ? 'green' : 'volcano'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/orders/${record.id}`)} // Điều hướng
                    >
                        Xem
                    </Button>
                </Space>
            ),
        },
    ];

    // 7. Render Giao diện
    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Quản lý Đơn hàng</Title>

                {error && <p style={{color: 'red'}}>Lỗi: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={orders} // Dữ liệu
                    rowKey="id" // Khóa chính
                    pagination={pagination} // Cấu hình phân trang
                    loading={loading} // Hiệu ứng tải
                    onChange={handleTableChange} // Xử lý khi đổi trang
                    bordered
                    // Cho phép cuộn ngang trên màn hình nhỏ
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </div>
    );
}

export default OrderListPage;