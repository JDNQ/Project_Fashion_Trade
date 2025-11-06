import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth'; // (Có thể cần để kiểm tra vai trò SUPER_ADMIN)

// Danh sách tất cả vai trò có thể có trong hệ thống (từ Enum Role.java)
const ALL_ROLES = [
    "CUSTOMER",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "SUPPORT",
    "MARKETING",
    "SUPER_ADMIN"
];

// Styles (đơn giản)
const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#f4f4f4' };
const checkboxContainerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr' };
const checkboxLabelStyle = { marginLeft: '8px' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { color: 'red' };

function UserEditPage() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();

    // 1. State cho dữ liệu user
    const [user, setUser] = useState(null);
    // 2. State cho các vai trò được chọn
    const [selectedRoles, setSelectedRoles] = useState(new Set());

    // 3. State cho loading và error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // 4. useEffect: Tải dữ liệu người dùng khi component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // (Giả định bạn đã thêm API GET /api/v1/admin/users/{id} ở Backend)
                const userData = await UserService.getUserById(id);
                setUser(userData);
                // 5. Điền (populate) các vai trò hiện tại vào Set
                setSelectedRoles(new Set(userData.roles));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    // 6. Hàm xử lý khi check/uncheck một vai trò
    const handleRoleChange = (roleName) => {
        // Tạo một Set mới (không thay đổi state cũ trực tiếp)
        const newRoles = new Set(selectedRoles);
        if (newRoles.has(roleName)) {
            newRoles.delete(roleName); // Bỏ chọn
        } else {
            newRoles.add(roleName); // Chọn
        }
        setSelectedRoles(newRoles);
    };

    // 7. Hàm xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);

        try {
            // Chuyển Set thành Array để gửi API
            const rolesArray = Array.from(selectedRoles);

            await UserService.updateUserRoles(id, rolesArray);

            alert('Cập nhật vai trò thành công!');
            navigate('/admin/users'); // Quay về trang danh sách

        } catch (err) {
            setError(err.message);
            setIsUpdating(false);
        }
    };

    // 8. Render
    if (loading) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    // (Lưu ý: Lỗi "Không thể tải chi tiết người dùng"
    // sẽ xảy ra nếu bạn chưa thêm API GET /admin/users/{id} vào backend)
    if (error) {
        return <p style={errorStyle}>Lỗi: {error}</p>;
    }

    if (!user) {
        return <p>Không tìm thấy người dùng.</p>;
    }

    return (
        <div style={formStyle}>
            <h2>Chỉnh sửa Người dùng (ID: {user.id})</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Email:</label>
                    <input style={inputStyle} type="email" value={user.email} readOnly />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Họ tên:</label>
                    <input style={inputStyle} type="text" value={user.fullName || ''} readOnly />
                </div>

                {/* Phần Cập nhật Vai trò */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Vai trò (Roles):</label>
                    <div style={checkboxContainerStyle}>
                        {ALL_ROLES.map(role => (
                            <div key={role}>
                                <input
                                    type="checkbox"
                                    id={`role-${role}`}
                                    checked={selectedRoles.has(role)}
                                    onChange={() => handleRoleChange(role)}
                                />
                                <label style={checkboxLabelStyle} htmlFor={`role-${role}`}>
                                    {role}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                <button type="submit" style={buttonStyle} disabled={isUpdating}>
                    {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi Vai trò'}
                </button>
            </form>
        </div>
    );
}

export default UserEditPage;