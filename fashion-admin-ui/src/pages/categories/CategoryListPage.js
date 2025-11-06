import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

// (Styles - Tương tự các trang List khác)
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2' };
const errorStyle = { color: 'red' };
const buttonStyle = { margin: '0 5px', padding: '5px 10px', cursor: 'pointer', textDecoration: 'none' };
const addButtonStyle = { display: 'inline-block', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', marginBottom: '20px' };

function CategoryListPage() {
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
        if (window.confirm(`Bạn có chắc muốn xóa danh mục ID: ${id}?`)) {
            try {
                await CategoryService.deleteCategory(id);
                alert('Xóa danh mục thành công.');
                fetchCategories(); // Tải lại danh sách
            } catch (err) {
                alert('Lỗi khi xóa danh mục: ' + err.message);
            }
        }
    };

    // 4. Render
    if (loading) return <p>Đang tải danh mục...</p>;
    if (error) return <p style={errorStyle}>Lỗi: {error}</p>;

    return (
        <div>
            <h2>Quản lý Danh mục</h2>

            <Link to="/admin/categories/new" style={addButtonStyle}>
                + Thêm danh mục mới
            </Link>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Tên</th>
                        <th style={thStyle}>Slug</th>
                        <th style={thStyle}>Danh mục cha</th>
                        <th style={thStyle}>Trạng thái</th>
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td style={thTdStyle}>{cat.id}</td>
                            <td style={thTdStyle}>{cat.name}</td>
                            <td style={thTdStyle}>{cat.slug}</td>
                            <td style={thTdStyle}>{cat.parentName || 'N/A'} (ID: {cat.parentId || ''})</td>
                            <td style={thTdStyle}>{cat.active ? 'Hoạt động' : 'Ẩn'}</td>
                            <td style={thTdStyle}>
                                <Link
                                    to={`/admin/categories/edit/${cat.id}`}
                                    style={{...buttonStyle, backgroundColor: '#ffc107'}}
                                >
                                    Sửa
                                </Link>
                                <button
                                    style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryListPage;