import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import { Table, Button, Space, Image, Tag, Typography, Popconfirm } from 'antd'; // Import component AntD
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons

const { Title } = Typography;

function ProductListPage() {
    const navigate = useNavigate();

    // 1. State cho dữ liệu (dataSource của Table)
    const [products, setProducts] = useState([]);

    // 2. State cho phân trang (Table tự quản lý)
    const [pagination, setPagination] = useState({
        current: 1, // AntD Table bắt đầu từ 1
        pageSize: 10,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Hàm fetch dữ liệu (Cập nhật cho AntD)
    const fetchProducts = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(null);

            // Chuyển đổi (AntD page 1 = Spring Page 0)
            const springPage = page - 1;
            const data = await ProductService.getAllProducts(springPage, pageSize, "id,desc");

            setProducts(data.content);
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
        fetchProducts(pagination.current, pagination.pageSize);
    }, []); // Chỉ tải 1 lần khi mount

    // 5. Xử lý khi Table thay đổi (đổi trang, sắp xếp...)
    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize);
    };

    // 6. Xử lý Xóa
    const handleDelete = async (id) => {
        try {
            await ProductService.deleteProduct(id);
            alert('Xóa (lưu trữ) sản phẩm thành công!');
            // Tải lại trang hiện tại
            fetchProducts(pagination.current, pagination.pageSize);
        } catch (err) {
            alert('Lỗi khi xóa sản phẩm: ' + err.message);
        }
    };

    // 7. Định nghĩa các cột (columns) cho Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id, // (Sắp xếp local)
        },
        {
            title: 'Ảnh',
            dataIndex: 'defaultImage',
            key: 'defaultImage',
            render: (text) => <Image src={text} alt="Product" width={60} />,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Published' ? 'green' : (status === 'Draft' ? 'blue' : 'red')}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => ( // 'record' là dữ liệu của hàng đó
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm?"
                        description="Bạn có chắc muốn xóa (lưu trữ) sản phẩm này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 8. Render Giao diện
    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Quản lý Sản phẩm</Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                    onClick={() => navigate('/admin/products/new')}
                >
                    Thêm sản phẩm mới
                </Button>

                {error && <p style={{color: 'red'}}>Lỗi: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={products} // Dữ liệu
                    rowKey="id" // Khóa chính
                    pagination={pagination} // Cấu hình phân trang
                    loading={loading} // Hiệu ứng tải
                    onChange={handleTableChange} // Xử lý khi đổi trang
                    bordered
                />
            </Space>
        </div>
    );
}

export default ProductListPage;