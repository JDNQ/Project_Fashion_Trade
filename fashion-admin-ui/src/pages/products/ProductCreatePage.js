import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import BrandService from '../../services/BrandService';

// (Styles - bạn nên đưa vào file CSS riêng sau này)
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

function ProductCreatePage() {
    const navigate = useNavigate(); // Dùng để chuyển hướng sau khi tạo

    // 1. State cho Dữ liệu Form chính
    const [product, setProduct] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'Draft', // Giá trị mặc định
        defaultImage: '',
        categoryId: '',
        brandId: '',
        seoMetaTitle: '',
        seoMetaDesc: ''
    });

    // 2. State cho các danh sách (Categories, Brands)
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // 3. State cho các danh sách động (Variants, Images)
    const [variants, setVariants] = useState([
        { sku: '', attributes: '{"size":"M", "color":"Black"}', price: 0, salePrice: 0, stockQuantity: 0 }
    ]);
    const [images, setImages] = useState([
        { url: '', altText: 'product image' }
    ]);

    // 4. State cho Loading và Error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 5. useEffect: Tải Categories và Brands khi component mount
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [catData, brandData] = await Promise.all([
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);
                setCategories(catData);
                setBrands(brandData);
            } catch (err) {
                setError('Không thể tải danh mục hoặc thương hiệu.');
            }
        };
        loadDropdownData();
    }, []);

    // 6. Hàm xử lý thay đổi cho Form chính
    const handleMainChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // 7. Hàm xử lý thay đổi cho Variants
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index][name] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { sku: '', attributes: '', price: 0, salePrice: 0, stockQuantity: 0 }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    // (Tương tự cho Images)
    const handleImageChange = (index, e) => {
        const { name, value } = e.target;
        const newImages = [...images];
        newImages[index][name] = value;
        setImages(newImages);
    };
    const addImage = () => setImages([...images, { url: '', altText: '' }]);
    const removeImage = (index) => setImages(images.filter((_, i) => i !== index));


    // 8. Hàm xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Chuẩn bị dữ liệu DTO
            const productData = {
                ...product,
                variants: variants, // Gửi mảng variants
                images: images     // Gửi mảng images
            };

            // Gọi API
            await ProductService.createProduct(productData);

            alert('Tạo sản phẩm thành công!');
            navigate('/admin/products'); // Chuyển về trang danh sách

        } catch (err) {
            setError(err.message || 'Lỗi không xác định khi tạo sản phẩm.');
            setLoading(false);
        }
    };

    return (
        <div style={formStyle}>
            <h2>Tạo Sản phẩm mới</h2>
            <form onSubmit={handleSubmit}>

                {/* --- PHẦN THÔNG TIN CHÍNH --- */}
                <div style={sectionStyle}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Tên sản phẩm:</label>
                        <input style={inputStyle} type="text" name="name" value={product.name} onChange={handleMainChange} required />
                    </div>
                    {/* (Thêm các trường slug, description, defaultImage, seo... tương tự) */}
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
                    <h3 style={labelStyle}>Biến thể sản phẩm (Variants)</h3>
                    {variants.map((variant, index) => (
                        <div key={index} style={dynamicRowStyle}>
                            <input style={dynamicInputStyle} type="text" name="sku" placeholder="SKU" value={variant.sku} onChange={e => handleVariantChange(index, e)} />
                            <input style={dynamicInputStyle} type="text" name="attributes" placeholder='{"size":"M"}' value={variant.attributes} onChange={e => handleVariantChange(index, e)} />
                            <input style={dynamicInputStyle} type="number" name="price" placeholder="Giá" value={variant.price} onChange={e => handleVariantChange(index, e)} />
                            <input style={dynamicInputStyle} type="number" name="stockQuantity" placeholder="Tồn kho" value={variant.stockQuantity} onChange={e => handleVariantChange(index, e)} />
                            <button type="button" style={removeBtnStyle} onClick={() => removeVariant(index)}>Xóa</button>
                        </div>
                    ))}
                    <button type="button" onClick={addVariant}>+ Thêm biến thể</button>
                </div>

                {/* --- PHẦN HÌNH ẢNH (IMAGES) --- */}
                <div style={sectionStyle}>
                    <h3 style={labelStyle}>Hình ảnh sản phẩm</h3>
                    {images.map((image, index) => (
                        <div key={index} style={dynamicRowStyle}>
                            <input style={dynamicInputStyle} type="text" name="url" placeholder="URL Hình ảnh" value={image.url} onChange={e => handleImageChange(index, e)} />
                            <input style={dynamicInputStyle} type="text" name="altText" placeholder="Alt Text" value={image.altText} onChange={e => handleImageChange(index, e)} />
                            <button type="button" style={removeBtnStyle} onClick={() => removeImage(index)}>Xóa</button>
                        </div>
                    ))}
                    <button type="button" onClick={addImage}>+ Thêm hình ảnh</button>
                </div>

                {/* --- SUBMIT --- */}
                {error && <p style={errorStyle}>{error}</p>}
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductCreatePage;