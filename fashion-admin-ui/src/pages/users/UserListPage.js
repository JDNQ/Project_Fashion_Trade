import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import UserService from '../../services/UserService';

// Styles (Giữ nguyên)
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
// Style cho các nút
const buttonStyle = {
    marginRight: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '3px'
};
const editButtonStyle = { ...buttonStyle, backgroundColor: '#ffc107', color: 'black', textDecoration: 'none' };
const lockButtonStyle = { ...buttonStyle, backgroundColor: '#dc3545', color: 'white' };
const unlockButtonStyle = { ...buttonStyle, backgroundColor: '#28a745', color: 'white' };


function UserListPage() {
    // ... (State: users, loading, error giữ nguyên) ...
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ... (Hàm fetchUsers và useEffect giữ nguyên) ...
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await UserService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ========== THÊM MỚI: HÀM XỬ LÝ KHÓA/MỞ ==========
    const handleToggleStatus = async (userId, currentStatus) => {
        // 1. Xác định trạng thái mới
        const newStatus = currentStatus === 'active' ? 'locked' : 'active';
        const actionText = newStatus === 'locked' ? 'khóa' : 'mở khóa';

        // 2. Xác nhận
        if (window.confirm(`Bạn có chắc muốn ${actionText} người dùng ID: ${userId}?`)) {
            try {
                // 3. Gọi API Service
                await UserService.updateUserStatus(userId, newStatus);

                // 4. Xử lý thành công
                alert(`Đã ${actionText} người dùng thành công.`);

                // 5. Tải lại dữ liệu (Cách đơn giản)
                // (Cách tốt hơn: Cập nhật state 'users' trực tiếp)
                fetchUsers();

            } catch (err) {
                // 6. Xử lý lỗi
                alert(`Lỗi khi ${actionText} người dùng: ${err.message}`);
            }
        }
    };
    // ===============================================


    // (Render loading/error giữ nguyên)
    if (loading) {
        return <p>Đang tải danh sách người dùng...</p>;
    }
    if (error) {
        return <p style={errorStyle}>Lỗi: {error}</p>;
    }

    return (
        <div>
            <h2>Quản lý Người dùng</h2>
            <p>Tổng số người dùng: {users.length}</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Họ tên</th>
                        <th style={thStyle}>Vai trò (Roles)</th>
                        <th style={thStyle}>Trạng thái</th>
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={thTdStyle}>{user.id}</td>
                            <td style={thTdStyle}>{user.email}</td>
                            <td style={thTdStyle}>{user.fullName}</td>
                            <td style={thTdStyle}>
                                {user.roles ? user.roles.join(', ') : 'N/A'}
                            </td>
                            <td style={thTdStyle}>{user.status}</td>

                            {/* ========== CẬP NHẬT HÀNH ĐỘNG ========== */}
                            <td style={thTdStyle}>
                                {/* Nút Sửa (chưa có logic) */}
                                <Link to={`/admin/users/edit/${user.id}`} style={editButtonStyle}>
                                    Sửa
                                </Link>

                                {/* Nút Khóa / Mở */}
                                <button
                                    style={user.status === 'active' ? lockButtonStyle : unlockButtonStyle}
                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                >
                                    {user.status === 'active' ? 'Khóa' : 'Mở'}
                                </button>
                            </td>
                            {/* ======================================= */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserListPage;