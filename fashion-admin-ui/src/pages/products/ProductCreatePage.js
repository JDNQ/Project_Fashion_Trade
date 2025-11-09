import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import BrandService from '../../services/BrandService';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Space,
    Typography,
    notification,
    Row,
    Col
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

function ProductCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

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
                notification.error({
                    message: 'Lỗi tải dữ liệu',
                    description: 'Không thể tải danh mục hoặc thương hiệu.',
                });
            }
        };
        loadDropdownData();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const productData = {
                ...values,
                variants: values.variants || [],
                images: values.images || []
            };

            await ProductService.createProduct(productData);

            notification.success({
                message: 'Thành công',
                description: 'Tạo sản phẩm mới thành công!',
            });
            navigate('/admin/products');

        } catch (err) {
            notification.error({
                message: 'Tạo thất bại',
                description: err.message || 'Lỗi không xác định khi tạo sản phẩm.',
            });
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <Title level={2}>Tạo Sản phẩm mới</Title>

            <Form
                {...formLayout}
                form={form}
                name="create_product"
                onFinish={onFinish}
                initialValues={{
                    status: 'Draft',
                    variants: [{ sku: '', attributes: '{"size":"M", "color":"Black"}', price: 0, stockQuantity: 10 }],
                    images: [{ url: '', altText: 'product image' }]
                }}
            >
                <Row gutter={24}>
                    {/* CỘT BÊN TRÁI */}
                    <Col span={16}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} />
                        </Form.Item>

                        {/* ========== ĐÂY LÀ PHẦN SỬA LỖI ========== */}
                        <Form.Item label="Biến thể sản phẩm (Variants)">
                            {/* Phải là một hàm (function) */}
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true, message: 'Thiếu SKU' }]}>
                                                    <Input placeholder="SKU" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'attributes']}>
                                                    <Input placeholder='{"size":"M"}' />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, message: 'Thiếu giá' }]}>
                                                    <InputNumber placeholder="Giá" min={0} style={{width: '100%'}} />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'stockQuantity']} rules={[{ required: true, message: 'Thiếu SL' }]}>
                                                    <InputNumber placeholder="Tồn kho" min={0} style={{width: '100%'}} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm biến thể
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item label="Hình ảnh sản phẩm">
                            <Form.List name="images">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true, message: 'Thiếu URL' }]}>
                                                    <Input placeholder="URL Hình ảnh" style={{width: '300px'}} />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'altText']}>
                                                    <Input placeholder="Alt Text" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm hình ảnh
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>
                    {/* ========================================= */}

                    {/* CỘT BÊN PHẢI */}
                    <Col span={8}>
                        {/* ... (Code cột phải y hệt như cũ) ... */}
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Draft">Bản nháp (Draft)</Option>
                                <Option value="Published">Công bố (Published)</Option>
                                <Option value="Archived">Lưu trữ (Archived)</Option>
                            </Select>
                        </Form.Item>
                        {/* ... (Các Form.Item khác) ... */}
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{marginTop: '20px'}}>
                        Tạo sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ProductCreatePage;