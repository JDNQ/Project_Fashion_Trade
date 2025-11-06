import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService'; // Đã import

// Styles (Giữ nguyên)
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2' };
const errorStyle = { color: 'red' };
const paginationStyle = { marginTop: '20px' };
const buttonStyle = { margin: '0 5px', padding: '5px 10px', cursor: 'pointer', textDecoration: 'none' };
const addButtonStyle = { display: 'inline-block', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', marginBottom: '20px' };

function ProductListPage() {
    // ... (Toàn bộ State: products, currentPage, ... giữ nguyên) ...
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ... (Hàm fetchProducts, useEffect, handleNextPage, handlePrevPage giữ nguyên) ...
    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductService.getAllProducts(page, 10, "id,desc");
            setProducts(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setCurrentPage(data.number);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // ========== THÊM MỚI: HÀM XỬ LÝ XÓA ==========
    const handleDeleteProduct = async (productId) => {
        // 1. Xác nhận
        if (window.confirm(`Bạn có chắc muốn xóa (lưu trữ) sản phẩm ID: ${productId}?`)) {
            try {
                // 2. Gọi API Service
                await ProductService.deleteProduct(productId);

                // 3. Xử lý thành công
                alert('Sản phẩm đã được chuyển vào kho lưu trữ.');

                // 4. Tải lại danh sách
                // (Cách tốt hơn: Nếu sản phẩm là cái cuối cùng của trang,
                // chúng ta nên lùi về trang trước, nhưng tạm thời tải lại trang hiện tại)
                fetchProducts(currentPage);

            } catch (err) {
                // 5. Xử lý lỗi
                alert('Lỗi khi xóa sản phẩm: ' + err.message);
            }
        }
    };
    // ===============================================


    // (Render loading/error giữ nguyên)
    if (loading) return <p>Đang tải...</p>;
    if (error) return <p style={errorStyle}>Lỗi: {error}</p>;

    return (
        <div>
            <h2>Quản lý Sản phẩm</h2>

            <Link to="/admin/products/new" style={addButtonStyle}>
                + Thêm sản phẩm mới
            </Link>

            <p>Tổng số sản phẩm: {totalElements}</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        {/* ... (Các <th> khác) ... */}
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            {/* ... (Các <td> khác) ... */}
                            <td style={thTdStyle}>{product.id}</td>
                            <td style={thTdStyle}>{/* Ảnh */}</td>
                            <td style={thTdStyle}>{product.name}</td>
                            <td style={thTdStyle}>{product.categoryName}</td>
                            <td style={thTdStyle}>{/* Giá */}</td>
                            <td style={thTdStyle}>{product.status}</td>

                            {/* CẬP NHẬT HÀNH ĐỘNG */}
                            <td style={thTdStyle}>
                                <Link
                                    to={`/admin/products/edit/${product.id}`}
                                    style={{...buttonStyle, backgroundColor: '#ffc107'}}
                                >
                                    Sửa
                                </Link>

                                {/* ========== CẬP NHẬT NÚT XÓA ========== */}
                                <button
                                    style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
                                    onClick={() => handleDeleteProduct(product.id)} // Gắn sự kiện
                                >
                                    Xóa
                                </button>
                                {/* ====================================== */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* (Pagination giữ nguyên) */}
            <div style={paginationStyle}>
                {/* ... (Nội dung pagination) ... */}
            </div>
        </div>
    );
}

export default ProductListPage;