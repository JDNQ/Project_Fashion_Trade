import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import {
    Table,
    Button,
    Space,
    Tag,
    Typography,
    Popconfirm,
    notification
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

function CategoryListPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Hàm tải dữ liệu
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await CategoryService.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
            notification.error({ message: 'Lỗi tải danh mục', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    // 2. useEffect: Tải khi mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. Hàm xử lý Xóa
    const handleDelete = async (id) => {
        try {
            await CategoryService.deleteCategory(id);
            notification.success({ message: 'Xóa danh mục thành công.' });
            fetchCategories(); // Tải lại danh sách
        } catch (err) {
            notification.error({ message: 'Lỗi khi xóa danh mục', description: err.message });
        }
    };

    // 4. Định nghĩa các cột (columns) cho Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parentName',
            key: 'parentName',
            render: (parentName) => parentName || 'N/A',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Hoạt động' : 'Ẩn'}
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
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/categories/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa danh mục?"
                        description="Bạn có chắc muốn xóa danh mục này?"
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

    // 5. Render
    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Quản lý Danh mục</Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                    onClick={() => navigate('/admin/categories/new')}
                >
                    Thêm danh mục mới
                </Button>

                {error && <p style={{color: 'red'}}>Lỗi: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </div>
    );
}

export default CategoryListPage;