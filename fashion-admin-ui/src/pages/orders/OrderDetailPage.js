import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';

// (Styles - Bạn nên đưa vào CSS sau)
const pageStyle = { display: 'flex', gap: '20px', padding: '20px' };
const mainContentStyle = { flex: 2 };
const sidebarStyle = { flex: 1, background: '#f9f9f9', padding: '20px', borderRadius: '5px' };
const sectionStyle = { marginBottom: '20px' };
const h3Style = { borderBottom: '2px solid #eee', paddingBottom: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px' };
const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2', textAlign: 'left' };
const errorStyle = { color: 'red' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' };

// (Các hàm format tiền tệ và ngày)
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

function OrderDetailPage() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();

    // 1. State cho dữ liệu
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. State cho form cập nhật
    const [orderStatus, setOrderStatus] = useState('');
    const [payStatus, setPayStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // 3. Hàm tải dữ liệu đơn hàng
    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await OrderService.getOrderById(id);
            setOrder(data);

            // Điền (populate) dữ liệu vào form cập nhật
            setOrderStatus(data.orderStatus);
            setPayStatus(data.payStatus);
            setTrackingNumber(data.trackingNumber || ''); // Xử lý null

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. useEffect: Tải dữ liệu khi component mount
    useEffect(() => {
        fetchOrderDetails();
    }, [id]); // Chạy lại nếu ID thay đổi

    // 5. Hàm xử lý Cập nhật trạng thái
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);

        try {
            const updateData = {
                orderStatus,
                payStatus,
                trackingNumber
            };

            await OrderService.updateOrderStatus(id, updateData);

            alert('Cập nhật trạng thái thành công!');
            // Tải lại dữ liệu để hiển thị thông tin mới nhất
            await fetchOrderDetails();

        } catch (err) {
            setError('Lỗi khi cập nhật: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // 6. Render Giao diện
    if (loading) {
        return <p>Đang tải chi tiết đơn hàng...</p>;
    }

    if (error) {
        return <p style={errorStyle}>Lỗi: {error}</p>;
    }

    if (!order) {
        return <p>Không tìm thấy đơn hàng.</p>;
    }

    return (
        <div style={pageStyle}>

            {/* CỘT BÊN TRÁI (CHI TIẾT) */}
            <div style={mainContentStyle}>
                <h2>Chi tiết Đơn hàng: {order.orderNo}</h2>
                <p>Đặt lúc: {formatDate(order.createdAt)}</p>

                {/* Các mục đã mua */}
                <div style={sectionStyle}>
                    <h3 style={h3Style}>Sản phẩm đã mua</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>SKU</th>
                                <th style={thStyle}>Tên sản phẩm</th>
                                <th style={thStyle}>Đơn giá</th>
                                <th style={thStyle}>SL</th>
                                <th style={thStyle}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td style={thTdStyle}>{item.variantSku}</td>
                                    <td style={thTdStyle}>{item.productName}</td>
                                    <td style={thTdStyle}>{formatCurrency(item.unitPrice)}</td>
                                    <td style={thTdStyle}>{item.quantity}</td>
                                    <td style={thTdStyle}>{formatCurrency(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Thông tin thanh toán */}
                <div style={sectionStyle}>
                    <h3 style={h3Style}>Chi tiết Thanh toán</h3>
                    <p>Phương thức: {order.paymentMethod}</p>
                    <p>Phí vận chuyển: {formatCurrency(order.shippingFee)}</p>
                    <p>Giảm giá: {formatCurrency(order.discountAmount)}</p>
                    <p style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                        Tổng cộng: {formatCurrency(order.totalAmount)}
                    </p>
                </div>
            </div>

            {/* CỘT BÊN PHẢI (CẬP NHẬT & THÔNG TIN KH) */}
            <div style={sidebarStyle}>
                {/* Form Cập nhật trạng thái */}
                <div style={sectionStyle}>
                    <h3 style={h3Style}>Cập nhật Trạng thái</h3>
                    <form onSubmit={handleUpdateStatus}>
                        <div style={{marginBottom: '10px'}}>
                            <label style={labelStyle}>Trạng thái Đơn hàng:</label>
                            {/* (Bạn nên dùng <select> với các giá trị cố định) */}
                            <input
                                style={inputStyle}
                                type="text"
                                value={orderStatus}
                                onChange={(e) => setOrderStatus(e.target.value)}
                            />
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <label style={labelStyle}>Trạng thái Thanh toán:</label>
                            <input
                                style={inputStyle}
                                type="text"
                                value={payStatus}
                                onChange={(e) => setPayStatus(e.target.value)}
                            />
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <label style={labelStyle}>Mã vận đơn (Tracking):</label>
                            <input
                                style={inputStyle}
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                            />
                        </div>
                        <button type="submit" style={buttonStyle} disabled={isUpdating}>
                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </form>
                </div>

                {/* Thông tin Khách hàng */}
                <div style={sectionStyle}>
                    <h3 style={h3Style}>Khách hàng</h3>
                    <p>Tên: {order.shippingName}</p>
                    <p>Email: {order.userEmail}</p>
                    <p>SĐT: {order.shippingPhone}</p>
                </div>

                {/* Thông tin Giao hàng */}
                <div style={sectionStyle}>
                    <h3 style={h3Style}>Địa chỉ Giao hàng</h3>
                    <p>{order.shippingAddressLine}</p>
                    <p>{order.shippingDistrict}, {order.shippingCity}, {order.shippingProvince}</p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage;