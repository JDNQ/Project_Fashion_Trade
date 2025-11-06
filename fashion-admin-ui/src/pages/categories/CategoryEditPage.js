import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

// (Styles - Giống hệt CreatePage)
const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };
const errorStyle = { color: 'red' };
const checkboxStyle = { marginLeft: '10px' };

function CategoryEditPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL

    // 1. State cho form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(null);
    const [active, setActive] = useState(true);

    // 2. State cho danh sách chọn
    const [allCategories, setAllCategories] = useState([]);

    // 3. State cho loading/error
    const [loading, setLoading] = useState(true); // True vì cần tải dữ liệu
    const [error, setError] = useState(null);

    // 4. useEffect: Tải đồng thời (danh sách Categories VÀ chi tiết Category)
    useEffect(() => {
        const loadData = async () => {
            try {
                // (Giả định bạn đã thêm API GET /api/v1/admin/categories/{id} vào Backend)
                const [catData, allCatsData] = await Promise.all([
                    CategoryService.getCategoryById(id),
                    CategoryService.getAllCategories()
                ]);

                // Điền (populate) dữ liệu vào form
                setName(catData.name);
                setSlug(catData.slug);
                setDescription(catData.description || ''); // Xử lý null
                setParentId(catData.parentId);
                setActive(catData.active);

                // Lọc danh sách cha (không thể tự làm cha của chính mình)
                setAllCategories(allCatsData.filter(cat => cat.id.toString() !== id.toString()));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // 5. Hàm Submit (Cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const categoryData = {
                name, slug, description,
                parentId: parentId || null,
                active,
                sortOrder: 0 // (Tạm thời)
            };

            await CategoryService.updateCategory(id, categoryData);

            alert('Cập nhật danh mục thành công!');
            navigate('/admin/categories');

        } catch (err) {
            setError(err.message || 'Lỗi không xác định');
            setLoading(false);
        }
    };

    // 6. Render
    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p style={errorStyle}>Lỗi: {error}</p>;

    return (
        <div style={formStyle}>
            <h2>Chỉnh sửa Danh mục (ID: {id})</h2>
            <form onSubmit={handleSubmit}>
                {/* (Phần JSX của Form giống hệt CreatePage) */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Tên Danh mục:</label>
                    <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Đường dẫn (Slug):</label>
                    <input style={inputStyle} type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Mô tả:</label>
                    <textarea style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Danh mục cha:</label>
                    <select
                        style={inputStyle}
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value)}
                    >
                        <option value="">-- Không có --</option>
                        {allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Trạng thái:</label>
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    <span style={checkboxStyle}>Hiển thị (Active)</span>
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu Cập nhật'}
                </button>
            </form>
        </div>
    );
}

export default CategoryEditPage;