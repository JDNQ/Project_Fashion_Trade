import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

// (Styles - tương tự các trang form khác)
const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };
const errorStyle = { color: 'red' };
const checkboxStyle = { marginLeft: '10px' };

function CategoryCreatePage() {
    const navigate = useNavigate();

    // 1. State cho form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(null); // ID của danh mục cha
    const [active, setActive] = useState(true);

    // 2. State để chứa danh sách danh mục (để chọn cha)
    const [allCategories, setAllCategories] = useState([]);

    // 3. State cho loading/error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 4. useEffect: Tải tất cả danh mục về để làm danh sách chọn "Cha"
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await CategoryService.getAllCategories();
                setAllCategories(data);
            } catch (err) {
                console.error("Lỗi khi tải danh mục cha:", err);
            }
        };
        loadCategories();
    }, []);

    // 5. Hàm Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const categoryData = {
                name,
                slug,
                description,
                // Gửi null nếu parentId là rỗng (chuỗi rỗng)
                parentId: parentId || null,
                active,
                sortOrder: 0 // (Tạm thời, bạn có thể thêm trường này)
            };

            await CategoryService.createCategory(categoryData);

            alert('Tạo danh mục thành công!');
            navigate('/admin/categories'); // Chuyển về trang danh sách

        } catch (err) {
            setError(err.message || 'Lỗi không xác định');
            setLoading(false);
        }
    };

    return (
        <div style={formStyle}>
            <h2>Tạo Danh mục mới</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Tên Danh mục:</label>
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
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Mô tả:</label>
                    <textarea
                        style={inputStyle}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Danh mục cha:</label>
                    <select
                        style={inputStyle}
                        value={parentId || ''} // Dùng chuỗi rỗng cho "Không có"
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
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                    />
                    <span style={checkboxStyle}>Hiển thị (Active)</span>
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu Danh mục'}
                </button>
            </form>
        </div>
    );
}

export default CategoryCreatePage;