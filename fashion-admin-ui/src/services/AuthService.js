import axios from 'axios';

// Định nghĩa URL cơ sở của API
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Tạo một "instance" của axios với cấu hình chung
 * (Chúng ta sẽ dùng cái này thay vì axios global để tránh xung đột)
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Dịch vụ xử lý logic đăng nhập
 * Đây là một đối tượng (Object)
 */
const AuthService = {

    /**
     * Gọi API đăng nhập
     */
    login: async (email, password) => {
        try {
            // 1. Gọi API /auth/login
            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password
            });

            // 2. Nếu gọi thành công (status 200)
            if (response.data && response.data.accessToken) {
                const token = response.data.accessToken;

                // 3. Lưu token vào localStorage
                localStorage.setItem('admin_token', token);

                // 4. Trả về token
                return token;
            } else {
                throw new Error('Phản hồi không hợp lệ từ máy chủ');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error.response?.data || error.message);
            throw new Error(error.response?.data || 'Đăng nhập thất bại');
        }
    },

    /**
     * Lấy token từ localStorage
     * (Đây là hàm mà AuthContext đang gọi)
     */
    getToken: () => {
        return localStorage.getItem('admin_token');
    },

    /**
     * Xóa token (Đăng xuất)
     */
    logout: () => {
        localStorage.removeItem('admin_token');
    }
};

// Đảm bảo bạn export default ĐỐI TƯỢNG 'AuthService'
export default AuthService;