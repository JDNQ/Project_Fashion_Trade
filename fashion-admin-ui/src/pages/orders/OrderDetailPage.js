import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import {
    Spin,
    Row,
    Col,
    Card,
    Typography,
    Descriptions,
    Tag,
    Table,
    Select,
    Button,
    Form,
    Input,
    notification
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// (Các hàm format tiền tệ và ngày)
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

function OrderDetailPage() {
    const { id } = useParams();
    const [form] = Form.useForm(); // Form để cập nhật

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Hàm tải dữ liệu
    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await OrderService.getOrderById(id);
            setOrder(data);

            // 2. Điền dữ liệu vào Form cập nhật
            form.setFieldsValue({
                orderStatus: data.orderStatus,
                payStatus: data.payStatus,
                trackingNumber: data.trackingNumber
            });

        } catch (err) {
            notification.error({ message: 'Lỗi tải đơn hàng', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id, form]);

    // 3. Hàm xử lý Cập nhật trạng thái
    const handleUpdateStatus = async (values) => {
        setIsUpdating(true);
        try {
            await OrderService.updateOrderStatus(id, values);
            notification.success({ message: 'Cập nhật thành công!' });
            await fetchOrderDetails(); // Tải lại dữ liệu mới
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
        } finally {
            setIsUpdating(false);
        }
    };

    // 4. Cột cho Bảng (Table) các sản phẩm
    const itemColumns = [
        { title: 'SKU', dataIndex: 'variantSku', key: 'sku' },
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'name' },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'price', render: formatCurrency },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'qty' },
        { title: 'Thành tiền', dataIndex: 'subtotal', key: 'subtotal', render: formatCurrency },
    ];

    if (loading) {
        return <Spin tip="Đang tải chi tiết đơn hàng..." size="large" fullscreen />;
    }

    if (!order) {
        return <p>Không tìm thấy đơn hàng.</p>;
    }

    // 5. Render
    return (
        <Row gutter={24}>
            {/* CỘT BÊN TRÁI (CHI TIẾT) */}
            <Col span={16}>
                <Title level={3}>Chi tiết Đơn hàng: #{order.orderNo}</Title>
                <Text type="secondary">Đặt lúc: {formatDate(order.createdAt)}</Text>

                {/* Các mục đã mua */}
                <Card title="Sản phẩm đã mua" style={{ marginTop: 24 }}>
                    <Table
                        columns={itemColumns}
                        dataSource={order.items}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                </Card>

                {/* Thông tin thanh toán */}
                <Card title="Chi tiết Thanh toán" style={{ marginTop: 24 }}>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Phương thức">{order.paymentMethod}</Descriptions.Item>
                        <Descriptions.Item label="Phí vận chuyển">{formatCurrency(order.shippingFee)}</Descriptions.Item>
                        <Descriptions.Item label="Giảm giá">{formatCurrency(order.discountAmount)}</Descriptions.Item>
                        <Descriptions.Item label={<Text strong>Tổng cộng</Text>}>
                            <Text strong style={{fontSize: '1.2em'}}>{formatCurrency(order.totalAmount)}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>

            {/* CỘT BÊN PHẢI (CẬP NHẬT & THÔNG TIN) */}
            <Col span={8}>
                {/* Form Cập nhật trạng thái */}
                <Card title="Cập nhật Trạng thái" style={{ marginBottom: 24 }}>
                    <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                        <Form.Item name="orderStatus" label="Trạng thái Đơn hàng" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Pending">Chờ xử lý (Pending)</Option>
                                <Option value="Processing">Đang xử lý (Processing)</Option>
                                <Option value="Shipped">Đã giao (Shipped)</Option>
                                <Option value="Delivered">Hoàn thành (Delivered)</Option>
                                <Option value="Cancelled">Đã hủy (Cancelled)</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="payStatus" label="Trạng thái Thanh toán" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Pending">Chờ thanh toán (Pending)</Option>
                                <Option value="Paid">Đã thanh toán (Paid)</Option>
                                <Option value="Refunded">Đã hoàn tiền (Refunded)</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="trackingNumber" label="Mã vận đơn (Tracking)">
                            <Input placeholder="Nhập mã vận đơn..." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isUpdating} block>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Thông tin Khách hàng */}
                <Card title="Thông tin Khách hàng" style={{ marginBottom: 24 }}>
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Tên">{order.shippingName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{order.userEmail}</Descriptions.Item>
                        <Descriptions.Item label="SĐT">{order.shippingPhone}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Thông tin Giao hàng */}
                <Card title="Địa chỉ Giao hàng">
                    <p>
                        {order.shippingAddressLine}<br/>
                        {order.shippingDistrict}, {order.shippingCity}<br/>
                        {order.shippingProvince}
                    </p>
                </Card>
            </Col>
        </Row>
    );
}

export default OrderDetailPage;