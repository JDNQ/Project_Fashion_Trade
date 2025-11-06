import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import OrderService from '../../services/OrderService';

// (Styles)
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
};
const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
};
const thStyle = {
    ...thTdStyle,
    backgroundColor: '#f2f2f2'
};
const errorStyle = {
    color: 'red'
};
const paginationStyle = {
    marginTop: '20px'
};
const buttonStyle = {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'pointer',
    textDecoration: 'none' // Thêm cho Link
};

// Hàm tiện ích format tiền tệ
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm tiện ích format ngày
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};


function OrderListPage() {
    // States
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // ========== ĐÂY LÀ DÒNG BỊ LỖI ==========
    // Đảm bảo bạn đã khai báo 'totalElements' ở đây
    const [totalElements, setTotalElements] = useState(0);
    // ======================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch dữ liệu
    const fetchOrders = async (page) => {
        try {
            setLoading(true);
            setError(null);

            const data = await OrderService.getAllOrders(page, 10, "createdAt,desc");

            setOrders(data.content);
            setTotalPages(data.totalPages);

            // ========== VÀ SET GIÁ TRỊ CHO NÓ Ở ĐÂY ==========
            setTotalElements(data.totalElements);
            // ============================================

            setCurrentPage(data.number);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect
    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    // Xử lý đổi trang
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

    // Render Giao diện
    if (loading) {
        return <p>Đang tải danh sách đơn hàng...</p>;
    }

    if (error) {
        return <p style={errorStyle}>Lỗi: {error}</p>;
    }

    return (
        <div>
            <h2>Quản lý Đơn hàng</h2>

            {/* ========== VÀ SỬ DỤNG NÓ Ở ĐÂY ========== */}
            <p>Tổng số đơn hàng: {totalElements}</p>
            {/* ======================================= */}

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Mã ĐH</th>
                        <th style={thStyle}>Khách hàng</th>
                        <th style={thStyle}>Ngày đặt</th>
                        <th style{...thStyle}>Tổng tiền</th>
                        <th style={thStyle}>Trạng thái ĐH</th>
                        <th style={thStyle}>Trạng thái TT</th>
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td style={thTdStyle}>{order.orderNo}</td>
                            <td style={thTdStyle}>{order.shippingName} ({order.userEmail})</td>
                            <td style={thTdStyle}>{formatDate(order.createdAt)}</td>
                            <td style={thTdStyle}>{formatCurrency(order.totalAmount)}</td>
                            <td style={thTdStyle}>{order.orderStatus}</td>
                            <td style={thTdStyle}>{order.payStatus}</td>
                            <td style={thTdStyle}>
                                <Link
                                    to={`/admin/orders/${order.id}`}
                                    style={{...buttonStyle, backgroundColor: '#17a2b8', color: 'white'}}
                                >
                                    Xem
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div style={paginationStyle}>
                <button
                    style={buttonStyle}
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    Trước
                </button>
                <span>
                    Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                    style={buttonStyle}
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}

export default OrderListPage;