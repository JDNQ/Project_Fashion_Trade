import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function DashboardPage() {
    return (
        <div>
            <Title level={2}>Chào mừng bạn đến với Dashboard</Title>
            <Paragraph>Đây là trang quản trị. Dưới đây là một số thống kê (mẫu):</Paragraph>

            <Row gutter={16} style={{marginTop: '24px'}}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Đơn hàng (mẫu)"
                            value={1128}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh thu (mẫu)"
                            value={93000000}
                            prefix={<DollarCircleOutlined />}
                            suffix="VND"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Người dùng mới (mẫu)"
                            value={5}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;