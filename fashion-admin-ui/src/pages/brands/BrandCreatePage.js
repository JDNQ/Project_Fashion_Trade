import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../services/BrandService';

// (Styles - Giống hệt CategoryCreatePage)
const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };
const errorStyle = { color: 'red' };

function BrandCreatePage() {
    const navigate = useNavigate();

    // 1. State cho form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    // 2. State cho loading/error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 3. Hàm Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const brandData = { name, slug };
            await BrandService.createBrand(brandData);
            alert('Tạo thương hiệu thành công!');
            navigate('/admin/brands');

        } catch (err) {
            setError(err.message || 'Lỗi không xác định');
            setLoading(false);
        }
    };

    return (
        <div style={formStyle}>
            <h2>Tạo Thương hiệu mới</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Tên Thương hiệu:</label>
                    <input
                        style={inputStyle}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Đường dẫn (Slug):</label>
                    <input
                        style={inputStyle}
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu Thương hiệu'}
                </button>
            </form>
        </div>
    );
}

export default BrandCreatePage;