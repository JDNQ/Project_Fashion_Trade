import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import axios from 'axios'; // Import axios để cấu hình global

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo "Provider" (Nhà cung cấp)
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // (Bạn có thể thêm state 'user' để lưu thông tin user sau)

    // 3. Kiểm tra token khi ứng dụng khởi động
    useEffect(() => {
        const storedToken = AuthService.getToken();
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            // Cấu hình axios để TỰ ĐỘNG đính kèm token vào header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    // 4. Hàm xử lý Đăng nhập
    const login = async (email, password) => {
        try {
            const receivedToken = await AuthService.login(email, password);
            setToken(receivedToken);
            setIsAuthenticated(true);
            // Cấu hình axios để TỰ ĐỘNG đính kèm token vào header
            axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        } catch (error) {
            // Ném lỗi ra để LoginPage có thể bắt
            throw error;
        }
    };

    // 5. Hàm xử lý Đăng xuất
    const logout = () => {
        AuthService.logout();
        setToken(null);
        setIsAuthenticated(false);
        // Xóa token khỏi header axios
        delete axios.defaults.headers.common['Authorization'];
    };

    // 6. Cung cấp các giá trị này cho các "con"
    const value = {
        token,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;