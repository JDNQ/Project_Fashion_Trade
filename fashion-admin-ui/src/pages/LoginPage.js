import React, { useState } from 'react';
// import AuthService from '../services/AuthService'; // (Không cần gọi trực tiếp nữa)
import { useAuth } from '../hooks/useAuth'; // <-- 1. Import hook

// (styles vẫn như cũ)
const loginStyles = {
    container: { width: '300px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' }
};

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // <-- 2. Lấy hàm login từ Context

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Vui lòng nhập cả email và mật khẩu.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // 3. Gọi hàm login từ Context
            await login(email, password);

            setLoading(false);

            // 4. Xử lý thành công
            alert('Đăng nhập thành công!');
            // (Trang sẽ tự động cập nhật vì state 'isAuthenticated' đã thay đổi)

        } catch (err) {
            setLoading(false);
            setError('Đăng nhập thất bại: ' + err.message);
        }
    };

    return (
        <div style={loginStyles.container}>
            <h2>Đăng nhập Admin</h2>
            <form onSubmit={handleSubmit}>
                {/* ... (Phần JSX của form không thay đổi) ... */}
                <div style={loginStyles.formGroup}>
                    <label style={loginStyles.label}>Email:</label>
                    <input
                        type="email"
                        style={loginStyles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div style={loginStyles.formGroup}>
                    <label style={loginStyles.label}>Password:</label>
                    <input
                        type="password"
                        style={loginStyles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {error && <p style={loginStyles.error}>{error}</p>}

                <button
                    type="submit"
                    style={loginStyles.button}
                    disabled={loading}
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;