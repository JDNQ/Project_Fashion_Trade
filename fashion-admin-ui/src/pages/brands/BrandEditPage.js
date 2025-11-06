import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandService from '../../services/BrandService';

// (Styles - Giống hệt CreatePage)
const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };
const errorStyle = { color: 'red' };

function BrandEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    // 1. State cho form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    // 2. State cho loading/error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. useEffect: Tải dữ liệu Brand
    useEffect(() => {
        const loadBrand = async () => {
            try {
                // (Giả định bạn đã thêm API GET /api/v1/admin/brands/{id} vào Backend)
                const data = await BrandService.getBrandById(id);
                setName(data.name);
                setSlug(data.slug);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadBrand();
    }, [id]);

    // 4. Hàm Submit (Cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const brandData = { name, slug };
            await BrandService.updateBrand(id, brandData);
            alert('Cập nhật thương hiệu thành công!');
            navigate('/admin/brands');
        } catch (err) {
            setError(err.message || 'Lỗi không xác định');
            setLoading(false);
        }
    };

    // 5. Render
    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p style={errorStyle}>Lỗi: {error}</p>;

    return (
        <div style={formStyle}>
            <h2>Chỉnh sửa Thương hiệu (ID: {id})</h2>
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
                    {loading ? 'Đang lưu...' : 'Lưu Cập nhật'}
                </button>
            </form>
        </div>
    );
}

export default BrandEditPage;