import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import thêm useParams
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import BrandService from '../../services/BrandService';

// (Toàn bộ styles giữ nguyên như ProductCreatePage)
const formStyle = { maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' };
const errorStyle = { color: 'red', marginTop: '10px' };
const sectionStyle = { border: '1px solid #eee', padding: '15px', marginTop: '20px', borderRadius: '5px' };
const dynamicRowStyle = { display: 'flex', gap: '10px', marginBottom: '10px' };
const dynamicInputStyle = { flex: 1, padding: '8px', boxSizing: 'border-box' };
const removeBtnStyle = { padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' };

function ProductEditPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // 1. Lấy 'id' từ URL

    // 2. State (giống hệt CreatePage)
    const [product, setProduct] = useState({
        name: '', slug: '', description: '', status: 'Draft',
        defaultImage: '', categoryId: '', brandId: '',
        seoMetaTitle: '', seoMetaDesc: ''
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true); // Mặc định là true để tải dữ liệu
    const [error, setError] = useState(null);

    // 3. useEffect: Tải Categories, Brands VÀ Dữ liệu Sản phẩm
    useEffect(() => {
        const loadData = async () => {
            try {
                // Tải đồng thời 3 nguồn dữ liệu
                const [productData, catData, brandData] = await Promise.all([
                    ProductService.getProductById(id),
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);

                // 4. Điền (Populate) dữ liệu vào state
                setCategories(catData);
                setBrands(brandData);

                // Điền thông tin sản phẩm
                setProduct({
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    status: productData.status,
                    defaultImage: productData.defaultImage || '', // Xử lý null
                    categoryId: productData.categoryId,
                    brandId: productData.brandId,
                    seoMetaTitle: productData.seoMetaTitle || '',
                    seoMetaDesc: productData.seoMetaDesc || ''
                });

                // Điền variants (cần map lại để bỏ các trường không cần thiết)
                setVariants(productData.variants.map(v => ({
                    sku: v.sku,
                    attributes: v.attributes,
                    price: v.price,
                    salePrice: v.salePrice,
                    stockQuantity: v.stockQuantity
                })));

                // Điền images
                setImages(productData.images.map(img => ({
                    url: img.url,
                    altText: img.altText
                })));

                setLoading(false);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
                setLoading(false);
            }
        };
        loadData();
    }, [id]); // Chạy lại nếu ID thay đổi

    // 5. Toàn bộ các hàm handlers (handleMainChange, handleVariantChange, addVariant, ...)
    // giữ nguyên y hệt như ProductCreatePage
    const handleMainChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index][name] = value;
        setVariants(newVariants);
    };
    const addVariant = () => { /* ... (Giống CreatePage) ... */ };
    const removeVariant = (index) => { /* ... (Giống CreatePage) ... */ };
    const handleImageChange = (index, e) => { /* ... (Giống CreatePage) ... */ };
    const addImage = () => { /* ... (Giống CreatePage) ... */ };
    const removeImage = (index) => { /* ... (Giống CreatePage) ... */ };

    // 6. Hàm handleSubmit (CẬP NHẬT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Dữ liệu DTO (giống hệt Create)
            const productData = {
                ...product,
                variants: variants,
                images: images
            };

            // Gọi API Cập nhật
            await ProductService.updateProduct(id, productData);

            alert('Cập nhật sản phẩm thành công!');
            navigate('/admin/products'); // Chuyển về trang danh sách

        } catch (err) {
            setError(err.message || 'Lỗi không xác định khi cập nhật.');
            setLoading(false);
        }
    };

    // 7. Render
    if (loading) {
        return <p>Đang tải dữ liệu sản phẩm...</p>;
    }

    if (error) {
        return <p style={errorStyle}>Lỗi: {error}</p>;
    }

    return (
        <div style={formStyle}>
            <h2>Chỉnh sửa Sản phẩm (ID: {id})</h2>

            {/* PHẦN FORM JSX (HTML) GIỮ NGUYÊN Y HỆT
              NHƯ TRONG ProductCreatePage.js
              (Vì 'value' đã được bind với state)
            */}

            <form onSubmit={handleSubmit}>
                {/* --- PHẦN THÔNG TIN CHÍNH --- */}
                <div style={sectionStyle}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Tên sản phẩm:</label>
                        <input style={inputStyle} type="text" name="name" value={product.name} onChange={handleMainChange} required />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Đường dẫn (Slug):</label>
                        <input style={inputStyle} type="text" name="slug" value={product.slug} onChange={handleMainChange} required />
                    </div>
                     <div style={formGroupStyle}>
                        <label style={labelStyle}>Mô tả:</label>
                        <textarea style={inputStyle} name="description" value={product.description} onChange={handleMainChange} />
                    </div>
                     <div style={formGroupStyle}>
                        <label style={labelStyle}>Ảnh đại diện (URL):</label>
                        <input style={inputStyle} type="text" name="defaultImage" value={product.defaultImage} onChange={handleMainChange} />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Danh mục:</label>
                        <select style={inputStyle} name="categoryId" value={product.categoryId} onChange={handleMainChange} required>
                            <option value="">-- Chọn Danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Thương hiệu:</label>
                        <select style={inputStyle} name="brandId" value={product.brandId} onChange={handleMainChange} required>
                            <option value="">-- Chọn Thương hiệu --</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Trạng thái:</label>
                        <select style={inputStyle} name="status" value={product.status} onChange={handleMainChange}>
                            <option value="Draft">Bản nháp (Draft)</option>
                            <option value="Published">Công bố (Published)</option>
                            <option value="Archived">Lưu trữ (Archived)</option>
                        </select>
                    </div>
                </div>

                {/* --- PHẦN BIẾN THỂ (VARIANTS) --- */}
                <div style={sectionStyle}>
                    {/* (Code JSX y hệt ProductCreatePage) */}
                </div>

                {/* --- PHẦN HÌNH ẢNH (IMAGES) --- */}
                <div style={sectionStyle}>
                    {/* (Code JSX y hệt ProductCreatePage) */}
                </div>

                {/* --- SUBMIT --- */}
                {error && <p style={errorStyle}>{error}</p>}
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu Cập nhật'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductEditPage;