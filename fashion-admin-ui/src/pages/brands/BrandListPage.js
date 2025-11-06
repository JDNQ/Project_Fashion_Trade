import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandService from '../../services/BrandService';

// (Styles - Tương tự các trang List khác)
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2' };
const errorStyle = { color: 'red' };
const buttonStyle = { margin: '0 5px', padding: '5px 10px', cursor: 'pointer', textDecoration: 'none' };
const addButtonStyle = { display: 'inline-block', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', marginBottom: '20px' };

function BrandListPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Hàm tải dữ liệu
    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await BrandService.getAllBrands();
            setBrands(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. useEffect: Tải khi mount
    useEffect(() => {
        fetchBrands();
    }, []);

    // 3. Hàm xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa thương hiệu ID: ${id}?`)) {
            try {
                await BrandService.deleteBrand(id);
                alert('Xóa thương hiệu thành công.');
                fetchBrands(); // Tải lại danh sách
            } catch (err) {
                alert('Lỗi khi xóa thương hiệu: ' + err.message);
            }
        }
    };

    // 4. Render
    if (loading) return <p>Đang tải thương hiệu...</p>;
    if (error) return <p style={errorStyle}>Lỗi: {error}</p>;

    return (
        <div>
            <h2>Quản lý Thương hiệu</h2>

            <Link to="/admin/brands/new" style={addButtonStyle}>
                + Thêm thương hiệu mới
            </Link>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Tên</th>
                        <th style={thStyle}>Slug</th>
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(brand => (
                        <tr key={brand.id}>
                            <td style={thTdStyle}>{brand.id}</td>
                            <td style={thTdStyle}>{brand.name}</td>
                            <td style={thTdStyle}>{brand.slug}</td>
                            <td style={thTdStyle}>
                                <Link
                                    to={`/admin/brands/edit/${brand.id}`}
                                    style={{...buttonStyle, backgroundColor: '#ffc107'}}
                                >
                                    Sửa
                                </Link>
                                <button
                                    style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
                                    onClick={() => handleDelete(brand.id)}
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

export default BrandListPage;